# Base Mini Plant 🌱

A fully on-chain flower growing dApp built on Base with MiniKit and OnchainKit integration. Grow, nurture, and vault your unique NFT flowers with interactive on-chain actions.

## 🚀 Live Deployment

- **🌐 App**: [https://mini-plant.vercel.app/](https://mini-plant.vercel.app/)
- **📄 Contract**: [0x73f6d23fd7d0fbcf236febf72c72939eb9750e20](https://basescan.org/address/0x73f6d23fd7d0fbcf236febf72c72939eb9750e20)

## 🌟 Features

### Core Gameplay
- **Mint Flowers**: Start your garden by minting a new flower NFT
- **Grow Petals**: Add petals to your flower (up to 8) with unique colors
- **Trim Petals**: Remove petals to reshape your flower
- **Vault Flowers**: Seal your completed flowers in the vault

### Achievement System
- 🌈 **Rainbow Set**: Grow 8 unique colored petals
- 🌺 **Many Pedals**: Grow 6+ petals on a flower
- 🏛️ **Keep Vaulting**: Vault 5+ flowers
- 🌹 **ALL RED**: Grow all red petals (3+ petals)

### Technical Features
- **Fully On-Chain**: All flower data and rendering stored on-chain
- **Soulbound NFTs**: Non-transferable flowers for true ownership
- **Deterministic Rendering**: SVG flowers generated from on-chain data
- **Real-time Updates**: Live data from The Graph for leaderboards and achievements

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, React
- **Blockchain**: Base Network
- **Smart Contracts**: Solidity (MiniPlant.sol)
- **UI Framework**: MiniKit + OnchainKit
- **Data Indexing**: The Graph
- **Styling**: Tailwind CSS

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- MetaMask or compatible wallet
- Base network configured

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd base-quest-7
   ```

2. **Install dependencies**
   ```bash
   cd miniapp/mini-plant
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file with:
   ```env
   NEXT_PUBLIC_FLOWER_CONTRACT_ADDRESS=0x...
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key
   NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=Base Mini Plant
   NEXT_PUBLIC_URL=your_deployment_url
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎮 How to Play

1. **Connect Wallet**: Connect your wallet to Base network
2. **Mint a Flower**: Click "Mint" to create your first flower (costs 0.00001 ETH)
3. **Grow Your Flower**: Use "Grow" to add petals (costs 0.0000005 ETH per petal)
4. **Customize**: Use "Trim" to remove petals and reshape your flower
5. **Vault**: When satisfied, "Vault" your flower to seal it permanently
6. **Track Progress**: Check achievements and leaderboards

## 📱 MiniKit Integration

This project leverages **MiniKit** for seamless mobile wallet integration:

- **Frame Integration**: Built as a Farcaster Frame for social discovery
- **Mobile Optimized**: Native mobile experience with wallet connections
- **Sponsored Transactions**: Gasless transactions for better UX
- **Account Association**: Users can add the frame to their Farcaster account

## 🔗 OnchainKit Integration

**OnchainKit** provides the transaction infrastructure:

- **Transaction Components**: Pre-built UI components for blockchain interactions
- **Status Management**: Real-time transaction status updates
- **Error Handling**: Comprehensive error management and user feedback
- **Toast Notifications**: User-friendly transaction notifications

## 🏗️ Smart Contract

The `MiniPlant.sol` contract features:

- **ERC721 Standard**: Full NFT compatibility
- **Soulbound Design**: Non-transferable ownership
- **Achievement System**: On-chain achievement tracking
- **Deterministic Rendering**: SVG generation from contract state
- **Gas Optimization**: Efficient storage and operations

## 📊 Data & Analytics

- **The Graph Integration**: Real-time indexing of mint, grow, trim, and vault events
- **Leaderboards**: Top minters tracked via GraphQL queries
- **Achievement Tracking**: Unlock status stored and queried on-chain
- **User Vaults**: Personal flower collections indexed by address

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Mode**: Automatic theme switching
- **Tab Navigation**: Garden, Vault, and Leaderboard views
- **Real-time Updates**: Live data refresh capabilities
- **Achievement Display**: Visual achievement progress tracking

## 🔧 Development

### Project Structure
```
miniapp/mini-plant/
├── app/
│   ├── components/
│   │   ├── flower.tsx          # Main flower interaction
│   │   ├── vault.tsx           # Vault and achievements
│   │   ├── leaderboard.tsx     # Top minters
│   │   ├── renderflower.tsx    # SVG rendering
│   │   └── genflower.js        # SVG generation
│   ├── page.tsx                # Main app with tabs
│   └── layout.tsx              # App layout
├── contract/
│   └── contracts/
│       └── MiniPlant.sol       # Smart contract
└── README.md
```

### Key Components
- **FlowerRenderer**: Main interaction component with mint/grow/trim/vault
- **Vault**: Achievement display and vaulted flower collection
- **Leaderboard**: Top minters from The Graph data
- **RenderFlower**: On-chain SVG rendering component

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
npm start
```

### Smart Contract Deployment
```bash
npx hardhat deploy --network base
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Base Network** for the L2 infrastructure
- **MiniKit** for mobile wallet integration
- **OnchainKit** for transaction components
- **The Graph** for data indexing
- **Farcaster** for social discovery

---

**Grow your digital garden on Base! 🌱✨** 