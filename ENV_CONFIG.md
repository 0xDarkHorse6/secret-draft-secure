# Environment Variables Configuration

This document explains how to configure environment variables for the Secret Draft Secure application.

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Chain Configuration
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=your_rpc_endpoint

# Wallet Connect Configuration
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id

# Infura Configuration
NEXT_PUBLIC_INFURA_API_KEY=your_infura_key

# Contract Configuration
VITE_CONTRACT_ADDRESS=your_deployed_contract_address_here

# Private Key for deployment (DO NOT COMMIT TO REPOSITORY)
PRIVATE_KEY=your_private_key_here
```

## Variable Descriptions

### NEXT_PUBLIC_CHAIN_ID
- **Description**: Ethereum Sepolia testnet chain ID
- **Value**: `11155111`
- **Required**: Yes

### NEXT_PUBLIC_RPC_URL
- **Description**: RPC endpoint for connecting to Sepolia testnet
- **Value**: `your_rpc_endpoint`
- **Required**: Yes

### NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
- **Description**: WalletConnect project ID for wallet connections
- **Value**: `your_project_id`
- **Required**: Yes

### NEXT_PUBLIC_INFURA_API_KEY
- **Description**: Infura API key for blockchain access
- **Value**: `your_infura_key`
- **Required**: Yes

### VITE_CONTRACT_ADDRESS
- **Description**: Address of the deployed SecretDraftSecure contract
- **Value**: Contract address after deployment
- **Required**: Yes (after contract deployment)

### PRIVATE_KEY
- **Description**: Private key for contract deployment
- **Value**: Your wallet private key
- **Required**: Yes (for deployment only)
- **Security**: Never commit this to the repository

## Vercel Deployment

For Vercel deployment, add these environment variables in the Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable with its corresponding value
4. Ensure all variables are available for Production, Preview, and Development environments

## Security Notes

- Never commit the `.env` file to version control
- Use different private keys for different environments
- Regularly rotate API keys and private keys
- Use environment-specific configurations for production vs development
