# Confidential Procurement System
> A Confidential Procurement System built on the Midnight Network using Compact smart contracts.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel_Deployed-000000?style=flat-square&logo=vercel)](https://confidential-procurement-system-p50zjx47w.vercel.app/)
[![Demo Video](https://img.shields.io/badge/YouTube-Demo_Video-FF0000?style=flat-square&logo=youtube)](https://youtu.be/HqOVxdmK8H0)
[![Midnight Preprod](https://img.shields.io/badge/Network-Midnight_Preprod-8b5cf6?style=flat-square)](https://explorer.preprod.midnight.network)
[![Compact Language](https://img.shields.io/badge/Compact-v0.5.1-06b6d4?style=flat-square)](https://midnight.network)
[![Node.js Version](https://img.shields.io/badge/Node.js-v22.x-10b981?style=flat-square)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

---

## 🚀 Live Demo, Video & Repository
- 🌐 **Live Web Application**: [https://confidential-procurement-system-p50zjx47w.vercel.app/](https://confidential-procurement-system-p50zjx47w.vercel.app/)
- 📺 **YouTube Demo Video**: [https://youtu.be/HqOVxdmK8H0](https://youtu.be/HqOVxdmK8H0)
- 📦 **GitHub Repository**: [https://github.com/arisudan-lab/confidential-procurement-system](https://github.com/arisudan-lab/confidential-procurement-system)

---

## 📋 Features & Functionality
- [x] **Fully Functional Privacy dApp**: Meaningful use of Midnight's Zero-Knowledge privacy model for sealed-bid auctions.
- [x] **Live Demo Deployment**: [Live Vercel Application](https://confidential-procurement-system-p50zjx47w.vercel.app/)
- [x] **Demo Video (Lace Wallet + ZK Circuit Call)**: [Watch on YouTube](https://youtu.be/HqOVxdmK8H0)
- [x] **Public GitHub Repository**: [arisudan-lab/confidential-procurement-system](https://github.com/arisudan-lab/confidential-procurement-system)
- [x] **Browser Wallet Integration**: Directly connects to user's Midnight Lace Wallet (`window.midnight.mnLace`).
- [x] **Lace Wallet Connect / Disconnect Lifecycle**: Full session management with event prompts and error handling.

---

## 🛡️ Midnight Privacy Model: What an Observer Learns vs Cannot Learn

### ❌ What an Observer CANNOT Learn (Kept Strictly Private):
1. **Bid Amount**: The exact financial amount bid by the supplier is kept strictly private in the ZK circuit.
2. **Supplier Identity**: The address or identifying data of the bidder submitting the tender proposal.
3. **Proposal Details / Secret**: The proprietary details of the supplier's proposal remain hidden.
4. **Bid Nonce**: Cryptographic entropy generated locally ensuring unique commitments.

### ✅ What an Observer CAN Learn (Disclosed On-Chain Public State):
1. **Tender ID & Organization**: The public details of the tender being bid upon.
2. **Total Bid Count**: The aggregate number of bids received so far.
3. **Tender Status**: Whether the procurement is Open, Closed, or Awarded.
4. **Winning Commitment**: Only upon completion is the hash of the winning bid disclosed publicly.

---

## 🛠️ Contract & Live Deployment Details
| Environment | Location / Address | Verification / Explorer Link |
|---|---|---|
| **Live Web App** | `https://confidential-procurement-system-p50zjx47w.vercel.app/` | [Open Live App](https://confidential-procurement-system-p50zjx47w.vercel.app/) |
| **Demo Video** | `https://youtu.be/HqOVxdmK8H0` | [Watch Video Demo](https://youtu.be/HqOVxdmK8H0) |
| **Smart Contract** | Per-environment deployment (set `MIDNIGHT_CONTRACT_ADDRESS` when running the backend) | [Midnight Preprod Explorer](https://explorer.preprod.midnight.network) |
| **CI/CD Workflow** | `.github/workflows/ci.yml` | [View GitHub Actions Run](https://github.com/arisudan-lab/confidential-procurement-system/actions) |
| **Repository** | `arisudan-lab/confidential-procurement-system` | [View on GitHub](https://github.com/arisudan-lab/confidential-procurement-system) |

---

## Contract Address

This field is mandatory for a deployed environment. Do not use somebody else's shared deployment.

| Network | Contract Address |
|---|---|
| Preprod | `<YOUR_DEPLOYED_CONTRACT_ADDRESS>` |

After deploying, set the same value in the backend environment:

```env
MIDNIGHT_CONTRACT_ADDRESS=<YOUR_DEPLOYED_CONTRACT_ADDRESS>
```

The frontend reads its API endpoint from `VITE_API_URL`; it never embeds a shared contract address.

---

## 🔑 Browser Wallet Connector (`window.midnight.mnLace`)
```typescript
// Connect directly to user's browser Midnight Lace Wallet extension
public async connectWallet(): Promise<{ connected: boolean; walletAddress: string; walletName: string }> {
  const provider = this.getBrowserWalletProvider();
  if (!provider) {
    throw new Error("Midnight Lace Wallet extension not detected. Please install and enable the extension.");
  }
  const connectedApi = await provider.connect('preprod');
  const address = await connectedApi.getUnshieldedAddress();
  return { connected: true, walletAddress: address.unshieldedAddress, walletName: provider.name };
}
```

---

## 🚀 Quickstart & Local Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/arisudan-lab/confidential-procurement-system.git
   cd confidential-procurement-system
   ```

2. **Set Node version and install dependencies**:
   ```bash
   nvm use 22
   npm install
   ```

3. **Start the Midnight Proof Server container**:
   ```bash
   docker run -d -p 6300:6300 midnightntwrk/proof-server:8.1.0
   ```

4. **Compile the Compact contract**:
   ```bash
   npm run compile
   ```

5. **Start the backend** (in a second terminal):

   ```bash
   $env:MIDNIGHT_CONTRACT_ADDRESS='<YOUR_DEPLOYED_CONTRACT_ADDRESS>'
   $env:MIDNIGHT_WALLET_SEED='<YOUR_64_CHARACTER_HEX_SEED>' # required for preprod/preview backend execution
   npm --workspace backend run dev
   ```

6. **Start the frontend**:
   ```bash
   npm --workspace frontend run dev
   ```

For a local Docker devnet, use `npm run proof-server:start`, then `npm run deploy -- --network undeployed`; the generated address is recorded in `.midnight-state.json`. For Preprod, run `npm run deploy -- --network preprod` only after funding the generated wallet address through the faucet. Then copy the printed contract address into `MIDNIGHT_CONTRACT_ADDRESS`.

## Environment Variables

Create `frontend/.env.local` for local browser settings:

```env
VITE_MIDNIGHT_NETWORK=preprod
VITE_API_URL=http://localhost:3001/api
```

Set these backend variables in the terminal or your backend host. Do not commit a seed or private-state password.

```env
MIDNIGHT_CONTRACT_ADDRESS=<YOUR_DEPLOYED_CONTRACT_ADDRESS>
MIDNIGHT_WALLET_SEED=<YOUR_64_CHARACTER_HEX_SEED>
PRIVATE_STATE_PASSWORD=<A_STRONG_16_PLUS_CHARACTER_PASSWORD>
FRONTEND_ORIGIN=https://<YOUR-VERCEL-DOMAIN>
```

`MIDNIGHT_WALLET_SEED` is required only when the backend sends transactions on Preview/Preprod. For a local `undeployed` network, the development genesis seed is used automatically.

## Run the Full dApp

### One-time Windows setup

The Compact wrapper runs inside WSL. Install a distribution and Compact there:

```powershell
wsl --install -d Ubuntu
# Restart Windows when prompted, open Ubuntu once, then:
wsl sudo apt update
wsl npm install -g @midnight-ntwrk/compact-compiler
wsl compact --version
```

Install and start Docker Desktop, then verify it is available from PowerShell:

```powershell
docker version
docker compose up -d
```

### Local devnet

Use three terminals in the repository root:

```powershell
# Terminal 1: Midnight node, indexer, and proof server
docker compose up -d

# Terminal 2: compile and deploy (deployment is a manual action)
npm run compile
npm run deploy -- --network undeployed

# Terminal 3: backend
$env:MIDNIGHT_CONTRACT_ADDRESS='<ADDRESS_PRINTED_BY_DEPLOY>'
npm --workspace backend run dev

# Terminal 4: frontend
npm --workspace frontend run dev
```

Open the Vite URL shown in Terminal 4 and connect a wallet configured for the same network. The API health check is `http://localhost:3001/api/health`.

### Preprod

1. Install and unlock the Midnight Lace/1AM wallet extension, choose **Preprod**, and obtain test tNIGHT from the Preprod faucet.
2. Run `npm run compile` after WSL Compact is available.
3. Run `npm run deploy -- --network preprod`. The script prints the wallet address; fund it in the faucet and rerun the command if prompted.
4. Copy the printed contract address into `MIDNIGHT_CONTRACT_ADDRESS` and start the backend with a private seed and password as shown above.
5. Set `VITE_MIDNIGHT_NETWORK=preprod` and `VITE_API_URL` to the publicly hosted backend API.

## Vercel deployment

Vercel can host the Vite frontend, but it cannot host the persistent Midnight backend wallet, local private-state store, or Docker proof server. Deploy `frontend` to Vercel and deploy `backend` to a persistent Node host with access to a proof server (for example, a VM or container platform). In Vercel set:

```env
VITE_MIDNIGHT_NETWORK=preprod
VITE_API_URL=https://<YOUR-BACKEND-DOMAIN>/api
```

Set `FRONTEND_ORIGIN` on the backend to the exact Vercel origin so CORS accepts browser requests.

---

## 📸 Platform Screenshots

### Landing Page
![Landing Page](landing%20(2).png)

### Dashboard
![Dashboard](dashboard%20(2).png)

### Tender Board
![Tender Board](tender-board.png)

### Approved Supplier
![Approved Supplier](avproved_supplier.png)

### Contract Deployment
![Contract Deployment](screenshot.png)
