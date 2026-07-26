// This module is structured to be extracted into a standalone package
// (@midnight-ntwrk/dapp-network or similar) without code changes. Do not
// introduce template substitutions, sibling-template imports, or globals
// here. All side-effecting inputs flow through function parameters.
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
export const NETWORK_IDS = ['undeployed', 'preview', 'preprod'];
export const STATE_FILE_NAME = '.midnight-state.json';
export const STATE_VERSION = 1;
export const NETWORK_CONFIGS = {
    undeployed: {
        networkId: 'undeployed',
        indexer: 'http://127.0.0.1:8088/api/v4/graphql',
        indexerWS: 'ws://127.0.0.1:8088/api/v4/graphql/ws',
        node: 'ws://127.0.0.1:9944',
        proofServer: 'http://127.0.0.1:6300',
        faucet: null,
        composeServices: ['node', 'indexer', 'proof-server'],
    },
    preview: {
        networkId: 'preview',
        indexer: 'https://indexer.preview.midnight.network/api/v4/graphql',
        indexerWS: 'wss://indexer.preview.midnight.network/api/v4/graphql/ws',
        node: 'https://rpc.preview.midnight.network',
        proofServer: 'http://127.0.0.1:6300',
        faucet: 'https://midnight-tmnight-preview.nethermind.dev',
        composeServices: ['proof-server'],
    },
    preprod: {
        networkId: 'preprod',
        indexer: 'https://indexer.preprod.midnight.network/api/v4/graphql',
        indexerWS: 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws',
        node: 'https://rpc.preprod.midnight.network',
        proofServer: 'http://127.0.0.1:6300',
        faucet: 'https://midnight-tmnight-preprod.nethermind.dev',
        composeServices: ['proof-server'],
    },
};
export function isNetworkId(v) {
    return typeof v === 'string' && NETWORK_IDS.includes(v);
}
function statePath(opts = {}) {
    return path.join(opts.cwd ?? process.cwd(), STATE_FILE_NAME);
}
export function loadState(opts = {}) {
    const p = statePath(opts);
    if (!fs.existsSync(p))
        return null;
    const raw = fs.readFileSync(p, 'utf-8');
    let parsed;
    try {
        parsed = JSON.parse(raw);
    }
    catch (e) {
        throw new Error(`Failed to parse ${p}: ${e.message}. Run \`npm run clean\` to reset.`);
    }
    if (!parsed ||
        typeof parsed !== 'object' ||
        parsed.version !== STATE_VERSION) {
        throw new Error(`Unsupported state-file version in ${p} (expected ${STATE_VERSION}). Run \`npm run clean\` to reset.`);
    }
    if (!isNetworkId(parsed.activeNetwork)) {
        throw new Error(`Invalid activeNetwork in ${p}. Run \`npm run clean\` to reset.`);
    }
    return parsed;
}
export function saveState(state, opts = {}) {
    const p = statePath(opts);
    // Write to a sibling tmp file then rename → atomic on POSIX.
    const tmp = `${p}.tmp-${process.pid}-${Date.now()}`;
    fs.writeFileSync(tmp, `${JSON.stringify(state, null, 2)}\n`);
    fs.renameSync(tmp, p);
}
export function parseNetworkFlag(argv) {
    for (let i = 2; i < argv.length; i++) {
        const arg = argv[i];
        if (arg === '--network') {
            const v = argv[i + 1];
            if (v === undefined)
                throw new Error('--network requires a value');
            if (!isNetworkId(v)) {
                throw new Error(`Unknown network: ${v}. Supported: ${NETWORK_IDS.join(', ')}.`);
            }
            return v;
        }
        if (arg.startsWith('--network=')) {
            const v = arg.slice('--network='.length);
            if (!isNetworkId(v)) {
                throw new Error(`Unknown network: ${v}. Supported: ${NETWORK_IDS.join(', ')}.`);
            }
            return v;
        }
    }
    return null;
}
const ENV_OVERRIDES = [
    ['indexer', 'MIDNIGHT_INDEXER_URL'],
    ['indexerWS', 'MIDNIGHT_INDEXER_WS_URL'],
    ['node', 'MIDNIGHT_NODE_URL'],
    ['faucet', 'MIDNIGHT_FAUCET_URL'],
    ['proofServer', 'MIDNIGHT_PROOF_SERVER_URL'],
];
function applyEnvOverrides(base, env) {
    const out = { ...base, composeServices: [...base.composeServices] };
    for (const [field, varName] of ENV_OVERRIDES) {
        const v = env[varName];
        if (v)
            out[field] = v;
    }
    return out;
}
export function resolveNetwork(opts = {}) {
    const argv = opts.argv ?? process.argv;
    const env = opts.env ?? process.env;
    const cwd = opts.cwd ?? process.cwd();
    const flag = parseNetworkFlag(argv);
    let network;
    let source;
    if (flag) {
        network = flag;
        source = 'flag';
    }
    else {
        const state = loadState({ cwd });
        if (state) {
            network = state.activeNetwork;
            source = 'state';
        }
        else {
            network = 'undeployed';
            source = 'default';
        }
    }
    const config = applyEnvOverrides(NETWORK_CONFIGS[network], env);
    return { network, config, source };
}
export const GENESIS_SEED = '0000000000000000000000000000000000000000000000000000000000000001';
export function getOrCreateSeed(network, opts = {}) {
    const env = opts.env ?? process.env;
    const cwd = opts.cwd ?? process.cwd();
    if (network === 'undeployed')
        return GENESIS_SEED;
    const fromEnv = env.MIDNIGHT_WALLET_SEED;
    if (fromEnv)
        return fromEnv;
    const existing = loadState({ cwd });
    const persisted = existing?.wallets?.[network]?.seed;
    if (persisted)
        return persisted;
    const seed = crypto.randomBytes(32).toString('hex');
    const next = existing ?? {
        version: STATE_VERSION,
        activeNetwork: network,
        wallets: {},
        deployments: {},
    };
    next.activeNetwork = network;
    next.wallets = {
        ...next.wallets,
        [network]: { seed, createdAt: new Date().toISOString() },
    };
    saveState(next, { cwd });
    return seed;
}
export function getDeployment(network, opts = {}) {
    const state = loadState(opts);
    return state?.deployments?.[network] ?? null;
}
export function recordDeployment(network, address, deployer, opts = {}) {
    const cwd = opts.cwd ?? process.cwd();
    const existing = loadState({ cwd });
    const next = existing ?? {
        version: STATE_VERSION,
        activeNetwork: network,
        wallets: {},
        deployments: {},
    };
    next.deployments = {
        ...next.deployments,
        [network]: { address, deployer, deployedAt: new Date().toISOString() },
    };
    saveState(next, { cwd });
}
export function setActiveNetwork(network, opts = {}) {
    const cwd = opts.cwd ?? process.cwd();
    const existing = loadState({ cwd });
    if (existing && existing.activeNetwork === network)
        return; // no-op
    const next = existing ?? {
        version: STATE_VERSION,
        activeNetwork: network,
        wallets: {},
        deployments: {},
    };
    next.activeNetwork = network;
    saveState(next, { cwd });
}
// CLI entry point. Activates only when the file is run directly via tsx,
// not when imported. Keeps the module tree-shakeable for the future
// extracted package.
function isMain() {
    // import.meta.url is a `file://` URL; argv[1] is a filesystem path.
    // Compare resolved paths to handle symlinks/aliases.
    try {
        const here = fileURLToPath(import.meta.url);
        const invoked = process.argv[1] && fs.realpathSync(process.argv[1]);
        return invoked === fs.realpathSync(here);
    }
    catch {
        return false;
    }
}
function cliMain(argv) {
    const args = argv.slice(2);
    if (args.length === 0) {
        const r = resolveNetwork({ argv });
        const dep = getDeployment(r.network);
        process.stdout.write(`Active network: ${r.network}${r.source === 'default' ? ' (default)' : ''}\n`);
        if (dep)
            process.stdout.write(`Last deploy: ${dep.address}\n`);
        return 0;
    }
    const candidate = args[0];
    if (!isNetworkId(candidate)) {
        process.stderr.write(`Unknown network: ${candidate}. Supported: ${NETWORK_IDS.join(', ')}.\n`);
        return 1;
    }
    setActiveNetwork(candidate);
    process.stdout.write(`Active network is now: ${candidate}\n`);
    if (candidate !== 'undeployed') {
        const seed = loadState()?.wallets?.[candidate]?.seed;
        if (!seed) {
            process.stdout.write(`Wallet not yet generated — run \`npm run setup\` to fund and deploy.\n`);
        }
    }
    return 0;
}
if (isMain()) {
    try {
        process.exit(cliMain(process.argv));
    }
    catch (e) {
        process.stderr.write(`${e.message}\n`);
        process.exit(1);
    }
}
