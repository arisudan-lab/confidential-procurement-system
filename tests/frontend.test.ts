/**
 * Frontend Component Tests
 * 
 * Tests for React components, wallet integration, and UI behavior.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('Frontend Components', () => {
  const componentsPath = path.join(process.cwd(), 'frontend', 'src', 'components');

  describe('Component Files', () => {
    it('should have WalletConnect component', () => {
      const walletConnectPath = path.join(componentsPath, 'WalletConnect.tsx');
      assert.ok(fs.existsSync(walletConnectPath), 'WalletConnect.tsx should exist');

      const content = fs.readFileSync(walletConnectPath, 'utf-8');
      assert.ok(content.includes('export function WalletConnect'), 'Should export WalletConnect function');
      assert.ok(content.includes('onConnect'), 'Should have onConnect prop');
      assert.ok(content.includes('onDisconnect'), 'Should have onDisconnect prop');
    });

    it('should have ProcurementForm component', () => {
      const formPath = path.join(componentsPath, 'ProcurementForm.tsx');
      assert.ok(fs.existsSync(formPath), 'ProcurementForm.tsx should exist');

      const content = fs.readFileSync(formPath, 'utf-8');
      assert.ok(content.includes('export function ProcurementForm'), 'Should export ProcurementForm function');
      assert.ok(content.includes('description'), 'Should have description field');
      assert.ok(content.includes('deadline'), 'Should have deadline field');
    });

    it('should have BidForm component', () => {
      const bidFormPath = path.join(componentsPath, 'BidForm.tsx');
      assert.ok(fs.existsSync(bidFormPath), 'BidForm.tsx should exist');

      const content = fs.readFileSync(bidFormPath, 'utf-8');
      assert.ok(content.includes('export function BidForm'), 'Should export BidForm function');
      assert.ok(content.includes('bidAmount'), 'Should have bidAmount field');
      assert.ok(content.includes('proposalDetails'), 'Should have proposalDetails field');
    });

    it('should have ProcurementState component', () => {
      const statePath = path.join(componentsPath, 'ProcurementState.tsx');
      assert.ok(fs.existsSync(statePath), 'ProcurementState.tsx should exist');

      const content = fs.readFileSync(statePath, 'utf-8');
      assert.ok(content.includes('export function ProcurementState'), 'Should export ProcurementState function');
      assert.ok(content.includes('contractAddress'), 'Should accept contractAddress prop');
    });

    it('should have NetworkStatus component', () => {
      const networkPath = path.join(componentsPath, 'NetworkStatus.tsx');
      assert.ok(fs.existsSync(networkPath), 'NetworkStatus.tsx should exist');

      const content = fs.readFileSync(networkPath, 'utf-8');
      assert.ok(content.includes('export function NetworkStatus'), 'Should export NetworkStatus function');
      assert.ok(content.includes('network'), 'Should accept network prop');
    });
  });

  describe('UI States', () => {
    it('WalletConnect should handle disconnected state', () => {
      const content = fs.readFileSync(
        path.join(componentsPath, 'WalletConnect.tsx'),
        'utf-8'
      );

      assert.ok(content.includes('laceDetected'), 'Should detect Lace wallet');
      assert.ok(content.includes('Install Lace'), 'Should offer to install Lace');
      assert.ok(content.includes('Connect'), 'Should have connect button');
    });

    it('WalletConnect should handle connected state', () => {
      const content = fs.readFileSync(
        path.join(componentsPath, 'WalletConnect.tsx'),
        'utf-8'
      );

      assert.ok(content.includes('connected'), 'Should have connected state');
      assert.ok(content.includes('Disconnect'), 'Should have disconnect button');
      assert.ok(content.includes('wallet-address'), 'Should display wallet address');
    });

    it('BidForm should show privacy notice', () => {
      const content = fs.readFileSync(
        path.join(componentsPath, 'BidForm.tsx'),
        'utf-8'
      );

      assert.ok(content.includes('privacy-notice'), 'Should have privacy notice section');
      assert.ok(content.includes('private'), 'Should mention privacy');
      assert.ok(content.includes('zero-knowledge'), 'Should mention zero-knowledge');
    });

    it('Forms should handle loading state', () => {
      const bidFormContent = fs.readFileSync(
        path.join(componentsPath, 'BidForm.tsx'),
        'utf-8'
      );

      assert.ok(bidFormContent.includes('submitting'), 'Should have submitting state');
      assert.ok(bidFormContent.includes('Generating ZK Proof'), 'Should show proof generation message');
    });

    it('Forms should handle success state', () => {
      const bidFormContent = fs.readFileSync(
        path.join(componentsPath, 'BidForm.tsx'),
        'utf-8'
      );

      assert.ok(bidFormContent.includes('result'), 'Should have result state');
      assert.ok(bidFormContent.includes('success'), 'Should handle success case');
    });

    it('Forms should handle error state', () => {
      const bidFormContent = fs.readFileSync(
        path.join(componentsPath, 'BidForm.tsx'),
        'utf-8'
      );

      assert.ok(bidFormContent.includes('error'), 'Should handle error case');
      assert.ok(bidFormContent.includes('Failed'), 'Should show error message');
    });
  });

  describe('Privacy Documentation', () => {
    it('BidForm should document what is private', () => {
      const content = fs.readFileSync(
        path.join(componentsPath, 'BidForm.tsx'),
        'utf-8'
      );

      assert.ok(content.includes('bid amount is'), 'Should explain bid amount privacy');
      assert.ok(content.includes('proposal details'), 'Should explain proposal privacy');
    });

    it('BidForm should document what is public', () => {
      const content = fs.readFileSync(
        path.join(componentsPath, 'BidForm.tsx'),
        'utf-8'
      );

      assert.ok(content.includes('bid count'), 'Should mention bid count is public');
    });
  });

  describe('Environment Configuration', () => {
    it('App should use environment variables', () => {
      const appPath = path.join(process.cwd(), 'frontend', 'src', 'App.tsx');
      const content = fs.readFileSync(appPath, 'utf-8');

      assert.ok(content.includes('import.meta.env.VITE_'), 'Should use environment variables');
      assert.ok(content.includes('VITE_NETWORK'), 'Should use VITE_NETWORK');
      assert.ok(content.includes('VITE_CONTRACT_ADDRESS'), 'Should use VITE_CONTRACT_ADDRESS');
    });
  });
});
