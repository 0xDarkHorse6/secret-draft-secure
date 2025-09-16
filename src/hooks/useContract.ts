import { useContract, useContractRead, useContractWrite, useAccount } from 'wagmi';
import { SecretDraftSecureABI } from '../lib/contractABI';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x...';

export function useSecretDraftSecure() {
  const { address } = useAccount();
  
  const contract = useContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: SecretDraftSecureABI,
  });

  const createLeague = useContractWrite({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: SecretDraftSecureABI,
    functionName: 'createLeague',
  });

  const joinLeague = useContractWrite({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: SecretDraftSecureABI,
    functionName: 'joinLeague',
  });

  const draftPlayer = useContractWrite({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: SecretDraftSecureABI,
    functionName: 'draftPlayer',
  });

  const submitLineup = useContractWrite({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: SecretDraftSecureABI,
    functionName: 'submitLineup',
  });

  return {
    contract,
    createLeague,
    joinLeague,
    draftPlayer,
    submitLineup,
    address,
  };
}

export function useLeagueInfo(leagueId: number) {
  return useContractRead({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: SecretDraftSecureABI,
    functionName: 'getLeagueInfo',
    args: [BigInt(leagueId)],
  });
}

export function useIsUserInLeague(leagueId: number, userAddress?: string) {
  return useContractRead({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: SecretDraftSecureABI,
    functionName: 'isUserInLeague',
    args: [BigInt(leagueId), userAddress as `0x${string}`],
    enabled: !!userAddress,
  });
}
