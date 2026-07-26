# Confidential Procurement System (Midnight dApp)

A privacy-first sealed-bid auction system built on the Midnight blockchain network. This application enables enterprise and government entities to conduct high-value procurement tenders where bid amounts and supplier details are kept completely confidential using zero-knowledge proofs.

## Project Overview

This repository represents the full stack for the Confidential Procurement System, following the official Midnight Level 3 dApp architecture standards.

- **Category:** Sealed-Bid Auction
- **Network:** Midnight Testnet
- **Privacy Model:** Zero-Knowledge Proofs for bid confidentiality
- **Wallet Integration:** Official Lace Wallet (DApp Connector)

## Architecture & Folder Structure

The project is structured as a scalable monorepo to separate concerns cleanly between the frontend UI, off-chain backend services, and on-chain Compact smart contracts.

```text
/
├── contracts/       # Future Midnight Compact smart contracts
├── frontend/        # React + Vite application (UI & Wallet integration)
├── backend/         # Future off-chain API, Indexer, and Proof Server integration
├── shared/          # Types and schemas shared across the stack
├── scripts/         # Deployment and utility scripts
├── docs/            # Architecture and system documentation
├── tests/           # E2E and integration tests
└── .github/         # CI/CD workflows
```

## Midnight Integration Plan

The application architecture has been laid out to integrate seamlessly with the Midnight blockchain:

1. **Lace Wallet Integration:** The frontend includes real integration with the Midnight Lace Wallet extension. It detects the extension, connects, manages the session, and exposes wallet state (network, address) through a React Context.
2. **Contract Stubs:** The `frontend/src/contracts/ProcurementContract.ts` serves as a placeholder for the generated Compact contract bindings.
3. **Proof Services:** Placeholder services in `frontend/src/services/` are prepared to handle off-chain computation and proof generation via the Midnight proof server.
4. **Environment Variables:** Network parameters (RPC URLs, indexers, proof server) are centralized.

## How to Run

### Frontend
The frontend is built with React, Vite, and TailwindCSS v4.

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Inside `frontend/.env`, configure the following:

- `VITE_NETWORK`: The target Midnight network (e.g., `testnet`).
- `VITE_CONTRACT_ADDRESS`: The deployed Compact contract address.
- `VITE_PROOF_SERVER_URL`: The URL for the local or remote Midnight proof server.
- `VITE_RPC_URL`: The Midnight node RPC endpoint.
- `VITE_INDEXER_URL`: The Midnight indexer endpoint.
- `VITE_LACE_NETWORK`: Expected Lace wallet network connection (`midnight-testnet`).

## Current Progress & Known Limitations

- **Frontend UI:** 100% complete. Includes Dashboards, Tender creation, Bid submission, Supplier verification, and Audit trails.
- **Wallet:** Fully implemented with real `window.midnight.lace` DApp connector logic.
- **Smart Contracts (Compact):** To be implemented.
- **Backend API:** To be implemented.
- **Blockchain Interactions:** Currently mocked/stubbed. No actual transactions are submitted to the Midnight testnet yet.

## Future Submission Roadmap

1. **Milestone 1:** UI/UX and Architecture Design (Completed)
2. **Milestone 2:** Compact Smart Contract Development (Next)
3. **Milestone 3:** Proof Server & Backend Integration
4. **Milestone 4:** Testnet Deployment & E2E Testing
