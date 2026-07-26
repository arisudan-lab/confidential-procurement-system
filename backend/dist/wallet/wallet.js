// Wallet construction + sync-state restore.
//
// Mirrors network.ts in structure. The on-disk format and pure I/O live in
// wallet-state.ts (unit-tested from the scaffolder workspace, no SDK deps);
// this file is the glue between that format and the wallet SDK.
import { Buffer } from 'buffer';
// Ledger types now come from the midnight-js-protocol barrel, which re-exports
// ledger-v8 (8.1.0) under a stable subpath instead of depending on it directly.
import * as ledger from '@midnight-ntwrk/midnight-js-protocol/ledger';
import { unshieldedToken } from '@midnight-ntwrk/midnight-js-protocol/ledger';
import { setNetworkId, getNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
// As of Midnight.js 4.1.x / ledger-v8 8.1.0 the wallet SDK is consolidated behind
// the single @midnight-ntwrk/wallet-sdk barrel, which re-exports the former
// wallet-sdk-facade / -hd / -shielded / -dust-wallet / -unshielded-wallet packages.
import { WalletFacade, DustWallet, HDWallet, Roles, ShieldedWallet, createKeystore, NoOpTransactionHistoryStorage, PublicKey, UnshieldedWallet, } from '@midnight-ntwrk/wallet-sdk';
import { CHILD_KINDS, loadWalletState, saveWalletState, } from './wallet-state.js';
export { unshieldedToken };
export { loadWalletState, saveWalletState, clearWalletState, WALLET_STATE_DIR, WALLET_STATE_VERSION, } from './wallet-state.js';
function deriveKeys(seed) {
    const hdWallet = HDWallet.fromSeed(Buffer.from(seed, 'hex'));
    if (hdWallet.type !== 'seedOk')
        throw new Error('Invalid seed');
    const result = hdWallet.hdWallet
        .selectAccount(0)
        .selectRoles([Roles.Zswap, Roles.NightExternal, Roles.Dust])
        .deriveKeysAt(0);
    if (result.type !== 'keysDerived')
        throw new Error('Key derivation failed');
    hdWallet.hdWallet.clear();
    return result.keys;
}
function warnRestoreFailure(kind, err) {
    const msg = err instanceof Error ? err.message : String(err);
    process.stderr.write(`  ⚠ Could not restore ${kind} wallet state (${msg}); falling back to fresh sync.\n`);
}
/**
 * Build the wallet facade, restoring each child from saved state when
 * available and falling back to a from-seed start when not (or when restore
 * throws, e.g. after an SDK upgrade with an incompatible state format).
 *
 * Caller is responsible for `await wallet.waitForSyncedState()` afterwards.
 */
export async function createWallet(opts) {
    setNetworkId(opts.networkConfig.networkId);
    const keys = deriveKeys(opts.seed);
    const networkId = getNetworkId();
    const shieldedSecretKeys = ledger.ZswapSecretKeys.fromSeed(keys[Roles.Zswap]);
    const dustSecretKey = ledger.DustSecretKey.fromSeed(keys[Roles.Dust]);
    const unshieldedKeystore = createKeystore(keys[Roles.NightExternal], networkId);
    const saved = opts.restore === false
        ? {}
        : loadWalletState(opts.network, { cwd: opts.cwd });
    const restored = { shielded: false, unshielded: false, dust: false };
    const walletConfig = {
        networkId,
        indexerClientConnection: {
            indexerHttpUrl: opts.networkConfig.indexer,
            indexerWsUrl: opts.networkConfig.indexerWS,
        },
        provingServerUrl: new URL(opts.networkConfig.proofServer),
        relayURL: new URL(opts.networkConfig.node.replace(/^http/, 'ws')),
        txHistoryStorage: new NoOpTransactionHistoryStorage(),
        costParameters: { additionalFeeOverhead: 300000000000000n, feeBlocksMargin: 5 },
    };
    const wallet = await WalletFacade.init({
        configuration: walletConfig,
        shielded: async (config) => {
            const cls = ShieldedWallet(config);
            if (saved.shielded !== undefined) {
                try {
                    const restoredWallet = await cls.restore(saved.shielded);
                    restored.shielded = true;
                    return restoredWallet;
                }
                catch (err) {
                    warnRestoreFailure('shielded', err);
                }
            }
            return cls.startWithSecretKeys(shieldedSecretKeys);
        },
        unshielded: async (config) => {
            const cls = UnshieldedWallet(config);
            if (saved.unshielded !== undefined) {
                try {
                    const restoredWallet = await cls.restore(saved.unshielded);
                    restored.unshielded = true;
                    return restoredWallet;
                }
                catch (err) {
                    warnRestoreFailure('unshielded', err);
                }
            }
            return cls.startWithPublicKey(PublicKey.fromKeyStore(unshieldedKeystore));
        },
        dust: async (config) => {
            const cls = DustWallet(config);
            if (saved.dust !== undefined) {
                try {
                    const restoredWallet = await cls.restore(saved.dust);
                    restored.dust = true;
                    return restoredWallet;
                }
                catch (err) {
                    warnRestoreFailure('dust', err);
                }
            }
            return cls.startWithSecretKey(dustSecretKey, ledger.LedgerParameters.initialParameters().dust);
        },
    });
    await wallet.start(shieldedSecretKeys, dustSecretKey);
    return { wallet, shieldedSecretKeys, dustSecretKey, unshieldedKeystore, restored };
}
/**
 * Serialize each child wallet's current state and persist it for the next run.
 * Safe to call multiple times. Logs but does not throw on individual failures —
 * losing one child's state means the next run re-syncs that child only.
 */
export async function persistWalletState(network, ctx, cwd) {
    const next = {};
    for (const kind of CHILD_KINDS) {
        try {
            const child = ctx.wallet[kind];
            const serialized = await child.serializeState();
            if (kind === 'dust') {
                next.dust = serialized;
            }
            else {
                next[kind] = serialized;
            }
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            process.stderr.write(`  ⚠ Could not serialize ${kind} wallet state (${msg}); next run will re-sync.\n`);
        }
    }
    saveWalletState(network, next, { cwd });
}
