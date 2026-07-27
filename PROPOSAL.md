# Confidential Procurement System Proposal

## Summary

Confidential Procurement System is a Midnight Network application for sealed-bid procurement. It lets a buyer publish a tender, suppliers submit confidential bids, and the buyer close and award the tender without exposing bid amounts, supplier identities, proposal details, or bid nonces on the public ledger.

## Problem

Conventional online procurement creates a difficult trade-off: a transparent process can reveal commercially sensitive bids, while a private process is hard for participants to audit. Public bid values can encourage bid shopping, collusion, and preferential treatment. Suppliers also need assurance that a tender was open when they submitted and that it was not awarded before closure.

## Proposed solution

The solution uses a Compact smart contract on Midnight to record the tender lifecycle:

1. A buyer creates a tender with a public tender identifier.
2. A supplier produces a zero-knowledge proof for its bid. The supplier, amount, proposal secret, and nonce remain private witnesses.
3. The contract records only the aggregate bid count while the tender is open.
4. The buyer closes the tender, then publishes the winning commitment when awarding it.

The public state is deliberately small: tender ID, tender status, bid count, and—after award—the winning commitment. This gives participants an auditable lifecycle without publishing the information that makes bids commercially sensitive.

## Architecture

- `contracts/procurement.compact` defines the tender state machine and privacy boundary.
- The frontend connects to a Midnight Lace wallet and submits supplier data to the bid workflow.
- The backend initializes the contract, reads public state, and coordinates transaction submission.
- Deployment metadata is stored per network in `.midnight-state.json`; an explicit `MIDNIGHT_CONTRACT_ADDRESS` can be supplied for a deployed environment.

## Security and privacy

Bid values and supplier data are witnesses rather than public ledger fields. Contract circuits enforce the allowed lifecycle: submissions require `OPEN`, closing requires `OPEN`, and awarding requires `CLOSED`. The application should use a separate deployment address for each environment and never commit wallet seeds, private state, or production environment files.

## Delivery and validation

The repository includes CI that installs locked dependencies, runs unit tests, type-checks scripts, and builds the frontend and backend. The initial tests cover network resolution precedence, deployment persistence, environment overrides, and the contract's privacy/lifecycle guarantees. A production rollout should additionally include end-to-end tests against a dedicated Midnight test environment and an independent review of the Compact contract.

## Builder resources

Project decisions follow the Midnight Builder Resources reference supplied for this project: <https://app.notion.com/p/Midnight-Builder-Resources-306087eb373e809c89fbd7f61a5b4d17>.
