/**
 * Tests for Confidential Procurement System
 * 
 * These tests verify the contract behavior, privacy model, and helper logic.
 */

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('Confidential Procurement System', () => {
  const contractPath = path.join(process.cwd(), 'contracts', 'procurement.compact');
  const managedPath = path.join(process.cwd(), 'contracts', 'managed', 'procurement');

  describe('Contract Compilation', () => {
    it('should compile the procurement contract successfully', () => {
      assert.ok(fs.existsSync(contractPath), 'Contract source file should exist');
      
      // Run compile command
      const compileOutput = execSync('npm run compile', { 
        encoding: 'utf-8',
        cwd: process.cwd()
      });
      
      // Check for successful compilation indicators
      assert.ok(
        compileOutput.includes('circuit') || compileOutput.includes('Compiling') || compileOutput.length > 0,
        'Should compile circuits'
      );
      assert.ok(fs.existsSync(managedPath), 'Managed contract directory should exist');
    });

    it('should generate all required circuit artifacts', () => {
      // Main circuits that generate ZK proofs
      const mainCircuits = ['createProcurement', 'submitBid', 'closeProcurement', 'awardProcurement'];
      
      mainCircuits.forEach(circuit => {
        const zkirPath = path.join(managedPath, 'zkir', `${circuit}.zkir`);
        const proverPath = path.join(managedPath, 'keys', `${circuit}.prover`);
        const verifierPath = path.join(managedPath, 'keys', `${circuit}.verifier`);
        
        assert.ok(fs.existsSync(zkirPath), `ZKIR file should exist for ${circuit}`);
        assert.ok(fs.existsSync(proverPath), `Prover key should exist for ${circuit}`);
        assert.ok(fs.existsSync(verifierPath), `Verifier key should exist for ${circuit}`);
      });
    });
  });

  describe('Contract Structure', () => {
    let contractContent: string;

    before(() => {
      contractContent = fs.readFileSync(contractPath, 'utf-8');
    });

    it('should export required ledger state variables', () => {
      const requiredLedgers = [
        'organization',
        'description',
        'deadline',
        'status',
        'winner',
        'bidCount'
      ];

      requiredLedgers.forEach(ledger => {
        assert.ok(
          contractContent.includes(`export ledger ${ledger}`),
          `Should export ledger variable: ${ledger}`
        );
      });
    });

    it('should export required circuits', () => {
      const requiredCircuits = [
        'createProcurement',
        'submitBid',
        'closeProcurement',
        'awardProcurement'
      ];

      requiredCircuits.forEach(circuit => {
        assert.ok(
          contractContent.includes(`export circuit ${circuit}`),
          `Should export circuit: ${circuit}`
        );
      });
    });

    it('should define ProcurementStatus enum', () => {
      assert.ok(
        contractContent.includes('export enum ProcurementStatus'),
        'Should define ProcurementStatus enum'
      );
      assert.ok(
        contractContent.includes('OPEN') && 
        contractContent.includes('CLOSED') && 
        contractContent.includes('AWARDED'),
        'Enum should include OPEN, CLOSED, and AWARDED states'
      );
    });

    it('should have privacy-preserving submitBid circuit', () => {
      // Verify that bidAmount is a parameter but not disclosed
      const submitBidSection = contractContent.substring(
        contractContent.indexOf('export circuit submitBid'),
        contractContent.indexOf('export circuit', contractContent.indexOf('export circuit submitBid') + 1)
      );

      assert.ok(
        submitBidSection.includes('bidAmount: Uint<64>'),
        'submitBid should accept bidAmount parameter'
      );

      // Verify bidAmount is NOT disclosed (remains private)
      assert.ok(
        !submitBidSection.includes('disclose(bidAmount)'),
        'bidAmount should NOT be disclosed (privacy requirement)'
      );

      // Verify bidCount IS incremented (public)
      assert.ok(
        submitBidSection.includes('bidCount.increment'),
        'Should increment public bid count'
      );
    });

    it('should have authorization checks in closeProcurement', () => {
      const closeSection = contractContent.substring(
        contractContent.indexOf('export circuit closeProcurement'),
        contractContent.indexOf('export circuit', contractContent.indexOf('export circuit closeProcurement') + 1)
      );

      assert.ok(
        closeSection.includes('assert(') && closeSection.includes('Not authorized'),
        'closeProcurement should have authorization check'
      );
    });

    it('should have authorization checks in awardProcurement', () => {
      const awardSection = contractContent.substring(
        contractContent.indexOf('export circuit awardProcurement'),
        contractContent.indexOf('export circuit', contractContent.indexOf('export circuit awardProcurement') + 1)
      );

      assert.ok(
        awardSection.includes('assert(') && awardSection.includes('Not authorized'),
        'awardProcurement should have authorization check'
      );

      assert.ok(
        awardSection.includes('status == ProcurementStatus.CLOSED'),
        'awardProcurement should verify procurement is closed'
      );
    });
  });

  describe('Privacy Model', () => {
    let contractContent: string;

    before(() => {
      contractContent = fs.readFileSync(contractPath, 'utf-8');
    });

    it('should keep bid amounts private', () => {
      // Search for any disclose calls with bidAmount
      const disclosePattern = /disclose\s*\(\s*bidAmount\s*\)/g;
      const matches = contractContent.match(disclosePattern);
      
      assert.strictEqual(
        matches,
        null,
        'bidAmount should never be disclosed publicly'
      );
    });

    it('should disclose winner address deliberately', () => {
      const awardSection = contractContent.substring(
        contractContent.indexOf('export circuit awardProcurement'),
        contractContent.indexOf('export circuit', contractContent.indexOf('export circuit awardProcurement') + 1)
      );

      assert.ok(
        awardSection.includes('winner = disclose(') || awardSection.includes('Some(disclose('),
        'Winner address should be disclosed (publicly verifiable)'
      );
    });

    it('should use witness functions for private inputs', () => {
      assert.ok(
        contractContent.includes('witness getOrgSk()') || 
        contractContent.includes('witness getSupplierSk()'),
        'Should use witness functions for private key inputs'
      );
    });
  });

  describe('Helper Functions', () => {
    it('should implement getDappPubKey helper circuit', () => {
      const contractContent = fs.readFileSync(contractPath, 'utf-8');
      assert.ok(
        contractContent.includes('getDappPubKey'),
        'Should implement getDappPubKey helper circuit'
      );
    });

    it('should have HELPER CIRCUITS section', () => {
      const contractContent = fs.readFileSync(contractPath, 'utf-8');
      assert.ok(
        contractContent.includes('HELPER CIRCUITS'),
        'Should have helper circuits section'
      );
    });
  });

  describe('Configuration Files', () => {
    it('should have package.json with correct compile script', () => {
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8')
      );

      assert.ok(
        packageJson.scripts.compile.includes('procurement.compact'),
        'Compile script should reference procurement contract'
      );

      assert.ok(
        packageJson.scripts.compile.includes('managed/procurement'),
        'Compile script should output to procurement directory'
      );
    });

    it('should have .env.example file', () => {
      const envExamplePath = path.join(process.cwd(), '.env.example');
      assert.ok(
        fs.existsSync(envExamplePath),
        '.env.example should exist'
      );

      const envContent = fs.readFileSync(envExamplePath, 'utf-8');
      assert.ok(
        envContent.includes('VITE_NETWORK'),
        'Should define VITE_NETWORK variable'
      );
      assert.ok(
        envContent.includes('VITE_CONTRACT_ADDRESS'),
        'Should define VITE_CONTRACT_ADDRESS variable'
      );
    });
  });
});
