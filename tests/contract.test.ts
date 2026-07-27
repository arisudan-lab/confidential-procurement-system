import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  getDeployment,
  recordDeployment,
  resolveNetwork,
  setActiveNetwork,
} from '../scripts/network.js';

function tempProjectDir(): string {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'procurement-network-'));
}

test('an explicit network flag takes precedence over saved network state', () => {
  const cwd = tempProjectDir();
  try {
    setActiveNetwork('preview', { cwd });
    const result = resolveNetwork({ argv: ['node', 'script', '--network=preprod'], cwd, env: {} });

    assert.equal(result.network, 'preprod');
    assert.equal(result.source, 'flag');
    assert.equal(result.config.indexer, 'https://indexer.preprod.midnight.network/api/v4/graphql');
  } finally {
    fs.rmSync(cwd, { recursive: true, force: true });
  }
});

test('deployment records are isolated by network and persist their deployer', () => {
  const cwd = tempProjectDir();
  try {
    setActiveNetwork('preview', { cwd });
    recordDeployment('preview', 'preview-contract-address', 'preview-deployer', { cwd });
    recordDeployment('preprod', 'preprod-contract-address', 'preprod-deployer', { cwd });

    const previewDeployment = getDeployment('preview', { cwd });
    assert.deepEqual(previewDeployment, {
      address: 'preview-contract-address',
      deployer: 'preview-deployer',
      deployedAt: previewDeployment?.deployedAt,
    });
    assert.match(previewDeployment?.deployedAt ?? '', /^\d{4}-\d{2}-\d{2}T/);
    assert.equal(getDeployment('preprod', { cwd })?.address, 'preprod-contract-address');
  } finally {
    fs.rmSync(cwd, { recursive: true, force: true });
  }
});

test('network endpoint environment variables override only the configured endpoints', () => {
  const result = resolveNetwork({
    argv: ['node', 'script', '--network', 'preview'],
    env: { MIDNIGHT_INDEXER_URL: 'https://indexer.example.test/graphql' },
  });

  assert.equal(result.config.indexer, 'https://indexer.example.test/graphql');
  assert.equal(result.config.node, 'https://rpc.preview.midnight.network');
  assert.deepEqual(result.config.composeServices, ['proof-server']);
});

test('the Compact contract keeps bid data private and enforces tender transitions', () => {
  const contract = fs.readFileSync(path.resolve('contracts/procurement.compact'), 'utf8');

  assert.match(contract, /witness getSupplier\(\): Bytes<32>;/);
  assert.match(contract, /witness getBidAmount\(\): Uint<64>;/);
  assert.match(contract, /assert\(tenderStatus == TenderStatus\.OPEN, "Tender is not open"\);/);
  assert.match(contract, /assert\(tenderStatus == TenderStatus\.CLOSED, "Tender must be closed to award"\);/);
  assert.doesNotMatch(contract, /export ledger bidAmount/);
  assert.doesNotMatch(contract, /export ledger supplier/);
});
