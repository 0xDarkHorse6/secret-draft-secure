# Vercel Deployment Guide for Secret Draft Secure

This guide provides step-by-step instructions for deploying the Secret Draft Secure application to Vercel.

## Prerequisites

- Vercel account (free tier available)
- GitHub account with access to the repository
- Node.js 18+ installed locally (for testing)

## Step-by-Step Deployment

### 1. Prepare the Repository

Ensure your code is pushed to GitHub:
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Import the `0xDarkHorse6/secret-draft-secure` repository

### 3. Configure Project Settings

#### Framework Preset
- **Framework Preset**: Vite
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### Environment Variables
Add the following environment variables in Vercel dashboard:

```
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=your_rpc_endpoint
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_INFURA_API_KEY=your_infura_key
VITE_CONTRACT_ADDRESS=your_deployed_contract_address
```

### 4. Deploy

1. Click "Deploy" button
2. Wait for the build process to complete (usually 2-3 minutes)
3. Your application will be available at the provided Vercel URL

### 5. Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed by Vercel
4. Wait for SSL certificate to be issued

## Build Configuration

The project includes a `vercel.json` configuration file with the following settings:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CHAIN_ID` | Ethereum Sepolia chain ID | Yes |
| `NEXT_PUBLIC_RPC_URL` | RPC endpoint for Sepolia | Yes |
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | WalletConnect project ID | Yes |
| `NEXT_PUBLIC_INFURA_API_KEY` | Infura API key | Yes |
| `VITE_CONTRACT_ADDRESS` | Deployed contract address | Yes |

## Troubleshooting

### Build Failures

1. **Dependency Issues**: Ensure all dependencies are properly installed
   ```bash
   npm install
   npm run build
   ```

2. **Environment Variables**: Verify all required environment variables are set

3. **Node Version**: Ensure Node.js 18+ is being used (Vercel automatically detects this)

### Runtime Issues

1. **Wallet Connection**: Check that WalletConnect project ID is correct
2. **Contract Interaction**: Verify contract address and ABI are correct
3. **Network Issues**: Ensure RPC URL is accessible and correct

## Performance Optimization

### Vercel Analytics
Enable Vercel Analytics for performance monitoring:
1. Go to Project Settings → Analytics
2. Enable Web Analytics
3. Add the analytics script to your app

### Edge Functions (Optional)
For better performance, consider using Vercel Edge Functions for API routes.

## Security Considerations

1. **Environment Variables**: Never commit sensitive keys to the repository
2. **HTTPS**: Vercel automatically provides HTTPS certificates
3. **CORS**: Configure CORS settings if needed for API calls

## Monitoring and Maintenance

1. **Deployment Logs**: Monitor deployment logs in Vercel dashboard
2. **Performance**: Use Vercel Analytics to monitor performance
3. **Updates**: Push changes to trigger automatic deployments

## Support

For deployment issues:
- Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
- Review build logs in Vercel dashboard
- Contact Vercel support if needed

## Post-Deployment Checklist

- [ ] Application loads correctly
- [ ] Wallet connection works
- [ ] Contract interactions function properly
- [ ] All environment variables are set
- [ ] Custom domain is configured (if applicable)
- [ ] Analytics are enabled (if desired)
- [ ] SSL certificate is active
