# Confidential Procurement System

A privacy-preserving procurement platform built on Midnight Network where organizations can create procurement requests publicly while suppliers submit confidential bids. Bid amounts and sensitive proposal details remain private using Midnight's zero-knowledge capabilities, while procurement status, deadlines, and winning bidder are publicly verifiable.

## 🎯 Product Proposal

**Category:** Sealed-Bid Auction (Level 3)

**Problem:** Traditional procurement systems expose sensitive bid information, giving competitors unfair advantages and potentially leading to bid rigging. Suppliers hesitate to submit their best prices when competitors can see their bids.

**Solution:** A zero-knowledge sealed-bid auction where:
- Organizations publicly announce procurement requests
- Suppliers submit encrypted bids that remain private
- The lowest valid bid wins, proven via zero-knowledge
- Only the winner's address is disclosed (not the winning amount)
- All parties can verify the process was fair without seeing private data

**Use Cases:**
- Government procurement contracts
- Corporate supply chain sourcing
- Construction project bidding
- Service provider selection

## 🔒 Privacy Model

### What Observers CAN Learn (Public Information)
- ✅ That a procurement request exists
- ✅ The organization creating the request
- ✅ The procurement description and requirements
- ✅ The bidding deadline
- ✅ The current status (Open/Closed/Awarded)
- ✅ How many bids were submitted (bid count)
- ✅ Which supplier won the auction

### What Observers CANNOT Learn (Private Information)
- ❌ Bid amounts (remain zero-knowledge private)
- ❌ Proposal details (hashed, not revealed)
- ❌ Losing bidder identities
- ❌ The winning bid amount (only that it was valid)

### What Is Deliberately Disclosed
- Organization address (for accountability)
- Procurement description (for transparency)
- Winner address (for public verification)

## 📋 Submission Checklist

### Level 1 ✅
- [x] Compact contract with public ledger state
- [x] Private witness/input handling
- [x] Deliberate use of `disclose()` for public values
- [x] Contract compiles via `compact compile`
- [x] Generated `contracts/managed/` directory with circuits/keys
- [x] Local deployment works (`npm run setup -- --network undeployed`)
- [x] CLI interaction functional
- [x] README with setup instructions
- [x] Public vs private state documentation

### Level 2 ✅
- [x] Frontend with Lace wallet connect/disconnect
- [x] Wallet status display
- [x] Network status display
- [x] Contract integration from environment variables
- [x] Circuit calls from frontend
- [x] Result and error display
- [x] Public ledger state visualization
- [x] Privacy behavior explanation in UI
- [x] `.env.example` with required variables
- [x] Vercel/Netlify deployment ready

### Level 3 ✅
- [x] 29 comprehensive tests (contract + frontend)
- [x] GitHub Actions CI/CD workflow
- [x] Complete README with privacy model
- [x] Product proposal section
- [x] Loading, success, error, empty, disconnected states
- [x] No hardcoded deployment addresses
- [x] Polished, usable frontend

## 🚀 Quick Start

### Prerequisites

- **Node.js 22+** (use nvm: `nvm install 22`)
- **Docker** with Docker Compose v2+
- **Compact compiler** (install: `curl -sSL https://compact.midnight.network | bash`)
- **Lace Wallet** (browser extension)

### Setup

```bash
# Install dependencies
npm install

# Compile the contract
npm run compile

# Start local devnet and deploy
npm run setup
```

### Run Locally

```bash
# Start the proof server (Docker required)
docker compose up -d

# Interact via CLI
npm run cli

# Or run the frontend
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
confidential-procurement-system/
├── contracts/
│   ├── procurement.compact      # Zero-knowledge contract
│   └── managed/
│       └── procurement/         # Generated artifacts
│           ├── contract/        # JS bindings
│           ├── zkir/           # ZK intermediate representations
│           └── keys/           # Prover/verifier keys
├── frontend/
│   └── src/
│       ├── components/         # React components
│       │   ├── WalletConnect.tsx
│       │   ├── ProcurementForm.tsx
│       │   ├── BidForm.tsx
│       │   └── ProcurementState.tsx
│       └── App.tsx
├── src/
│   ├── deploy.ts              # Deployment script
│   ├── cli.ts                 # Interactive CLI
│   ├── setup.ts               # Setup orchestrator
│   └── wallet.ts              # Wallet management
├── tests/
│   ├── contract.test.ts       # Contract tests
│   └── frontend.test.ts       # Frontend tests
├── .github/workflows/
│   └── ci.yml                 # CI/CD pipeline
├── docker-compose.yml         # Local devnet
└── package.json
```

## 🎮 Available Commands

| Command | Description |
|---------|-------------|
| `npm run compile` | Compile Compact contract |
| `npm run setup` | Start devnet, compile, deploy |
| `npm run deploy` | Deploy contract to active network |
| `npm run cli` | Interactive CLI for contract interaction |
| `npm run check-balance` | Check wallet balance |
| `npm test` | Run all tests |
| `npm run build` | Type check project |
| `docker compose up -d` | Start local proof server |
| `docker compose down` | Stop local devnet |
| `npm run clean` | Remove generated artifacts |

## 🌐 Networks

This dApp supports three networks:

| Network | Description | Default |
|---------|-------------|---------|
| `undeployed` | Local devnet (Docker) | ✅ Yes |
| `preview` | Public preview testnet | |
| `preprod` | Public preprod testnet | |

### Switch Networks

```bash
# Switch to preview testnet
npm run network preview

# Switch back to local devnet
npm run network undeployed
```

### Environment Variables

Create a `.env` file (or use `.env.example` as template):

```env
VITE_NETWORK=undeployed
VITE_CONTRACT_ADDRESS=0x...
VITE_PROOF_SERVER_URL=http://localhost:6300
```

For public networks:
```env
MIDNIGHT_INDEXER_URL=https://indexer.preprod.midnight.network/api/v4/graphql
MIDNIGHT_PROOF_SERVER_URL=https://lace-proof-pub.preprod.midnight.network
```

## 🔧 Contract Circuits

### `createProcurement(organization, description, deadline)`
Creates a new procurement request.
- **Public:** Organization address, description, deadline
- **Private:** None

### `submitBid(supplierSk, bidAmount, proposalDetails)`
Submits a confidential bid.
- **Public:** That a bid was submitted (increments bid count)
- **Private:** Bid amount, proposal details

### `closeProcurement(orgSk)`
Closes the procurement (after deadline).
- **Public:** Procurement status changes to CLOSED
- **Private:** Organization's secret key

### `awardProcurement(orgSk, winnerSk, winningBidAmount)`
Awards the contract to the winner.
- **Public:** Winner address
- **Private:** Winning bid amount (proven valid but not revealed)

### `revealBid(supplierSk, bidAmount, auditorPubKey)`
Optional circuit for revealing bid to auditors.
- **Public:** That a reveal occurred
- **Private:** Bid amount (only revealed to auditor in production)

## 🧪 Testing

```bash
# Run all tests
npm test

# Test output example:
# ✓ Contract Compilation (2)
# ✓ Contract Structure (5)
# ✓ Privacy Model (3)
# ✓ Frontend Components (19)
# tests 29, pass 29
```

## 🚀 Deployment

### Local Deployment

```bash
# 1. Start Docker devnet
docker compose up -d

# 2. Deploy contract
npm run deploy

# Contract address saved to .midnight-state.json
```

### Preview/Preprod Deployment

```bash
# 1. Switch network
npm run network preprod

# 2. Deploy (requires funded wallet)
npm run deploy

# Follow faucet instructions if wallet needs funding
```

**Note:** If Preprod wallet sync hangs, the contract compiles and local deploy works. Document any blockers in `.midnight-state.json`.

## 🖼️ UI States

The frontend handles all required states:

- **Loading:** Spinners and progress indicators during transactions
- **Success:** Green confirmation messages with transaction IDs
- **Error:** Red error messages with helpful descriptions
- **Empty:** Placeholder text when no data available
- **Disconnected:** Prompt to connect Lace wallet

## 🛠️ Troubleshooting

### Compact Compiler Issues
```bash
# Update to latest version
compact update

# Verify installation
which compact
compact --version
```

### Docker Issues
```bash
# Check Docker is running
docker ps

# Restart devnet
docker compose down -v
docker compose up -d
```

### Wallet Sync Issues
```bash
# Clean state and redeploy
npm run clean
npm run setup
```

### Node.js Version
```bash
# Ensure Node 22+
node -v
nvm install 22
nvm use 22
```

## 🌐 Vercel Deployment

This project is configured for Vercel deployment. The frontend will automatically build and deploy.

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or deploy to production
vercel --prod
```

### Vercel Configuration

- **Build Command:** `cd frontend && npm install && npm run build`
- **Output Directory:** `frontend/dist`
- **Install Command:** `cd frontend && npm install`

### Environment Variables on Vercel

Set these in your Vercel project settings:

| Variable | Value |
|----------|-------|
| `VITE_NETWORK` | `undeployed`, `preview`, or `preprod` |
| `VITE_CONTRACT_ADDRESS` | Your deployed contract address |
| `VITE_PROOF_SERVER_URL` | Proof server URL (e.g., `https://lace-proof-pub.preview.midnight.network`) |

## 📚 Resources

- [Midnight Documentation](https://docs.midnight.network)
- [Compact Language Guide](https://docs.midnight.network/compact)
- [Lace Wallet](https://lace.io)
- [Midnight Faucets](https://midnight-tmnight-preprod.nethermind.dev)
- [Vercel Deployment Guide](https://vercel.com/docs/deployments/git)

## 📄 License

MIT

## 👥 Contributors

Built for the Midnight Network dApp Submission Program.
