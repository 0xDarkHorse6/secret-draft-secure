# Secret Draft Secure

A privacy-preserving fantasy sports platform built with FHE (Fully Homomorphic Encryption) technology. This platform allows users to create leagues, draft players, and manage lineups while keeping their strategies encrypted and private.

## Features

- **Privacy-First Design**: All user data and strategies are encrypted using FHE technology
- **Decentralized**: Built on Ethereum Sepolia testnet with smart contracts
- **Wallet Integration**: Seamless connection with popular wallets like Rainbow, MetaMask, and more
- **Real-time Updates**: Live updates for drafts, lineups, and scores
- **Secure Prize Distribution**: Automated and transparent prize distribution

## Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Blockchain**: Ethereum, Hardhat, Solidity
- **Encryption**: FHE (Fully Homomorphic Encryption)
- **Wallet**: RainbowKit, Wagmi, Viem
- **State Management**: TanStack Query

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/0xDarkHorse6/secret-draft-secure.git
cd secret-draft-secure
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server:
```bash
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Chain Configuration
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# Wallet Connect Configuration
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id

# Contract Configuration
VITE_CONTRACT_ADDRESS=your_deployed_contract_address
```

## Smart Contract

The platform uses a smart contract deployed on Ethereum Sepolia testnet that handles:

- League creation and management
- Player drafting with encrypted data
- Lineup submission with privacy protection
- Prize distribution
- FHE-encrypted scoring system

### Contract Functions

- `createLeague()`: Create a new fantasy league
- `joinLeague()`: Join an existing league
- `draftPlayer()`: Draft a player during the draft period
- `submitLineup()`: Submit encrypted lineup data
- `updatePlayerScore()`: Update encrypted player scores (owner only)
- `distributePrize()`: Distribute prizes to winners

## Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run compile`: Compile smart contracts
- `npm run test`: Run smart contract tests
- `npm run deploy`: Deploy contracts to Sepolia

### Smart Contract Development

1. Compile contracts:
```bash
npm run compile
```

2. Run tests:
```bash
npm run test
```

3. Deploy to Sepolia:
```bash
npm run deploy
```

## Privacy & Security

This platform prioritizes user privacy through:

- **FHE Encryption**: All sensitive data is encrypted using Fully Homomorphic Encryption
- **Zero-Knowledge Proofs**: Users can prove their strategies without revealing them
- **Decentralized Storage**: No central authority controls user data
- **Smart Contract Security**: Audited and tested smart contracts

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions, please open an issue on GitHub or contact the development team.

## Roadmap

- [ ] Mobile app development
- [ ] Additional sports support
- [ ] Advanced analytics dashboard
- [ ] Cross-chain compatibility
- [ ] NFT integration for unique players