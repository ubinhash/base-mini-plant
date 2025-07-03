# Language Learning Goal Smart Contract

This project contains a smart contract for managing language learning goals with staking functionality.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```bash
cp .env.example .env
```

3. Fill in your `.env` file with:
- `BASE_SEPOLIA_RPC_URL`: Your Base Sepolia RPC URL (default: https://sepolia.base.org)
- `BASE_MAINNET_RPC_URL`: Your Base Mainnet RPC URL (default: https://mainnet.base.org)
- `PRIVATE_KEY`: Your private key for deployment (without 0x prefix)
- `BASESCAN_API_KEY`: Your Basescan API key for contract verification

## Compilation

```bash
npx hardhat compile
```

## Testing

```bash
npx hardhat test
```

## Deployment

To deploy to the local Hardhat network:
```bash
npx hardhat run scripts/deploy.js
```

To deploy to Base Sepolia (testnet):
```bash
npx hardhat run scripts/deploy.js --network baseSepolia
```

To deploy to Base Mainnet:
```bash
npx hardhat run scripts/deploy.js --network base
```

## Contract Structure

- `LanguageLearningGoal.sol`: Main contract for managing language learning goals
- `MockRewardPool.sol`: Mock contract for testing purposes

## Features

- Create language learning goals with staking
- Track vocabulary learning progress
- Claim stake based on goal completion
- Operator system for progress verification

## Networks

### Base Sepolia (Testnet)
- Chain ID: 84532
- RPC URL: https://sepolia.base.org
- Explorer: https://sepolia.basescan.org

### Base Mainnet
- Chain ID: 8453
- RPC URL: https://mainnet.base.org
- Explorer: https://basescan.org
