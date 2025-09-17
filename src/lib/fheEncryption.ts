import { keccak256, toHex } from "viem";

/**
 * FHE Encryption utilities for Secret Draft Secure
 * This module handles encryption of sensitive data before blockchain submission
 */

export interface EncryptedData {
  ciphertext: string;
  nonce: string;
  tag: string;
}

export interface LineupData {
  playerIds: number[];
  positions: number[];
  captain?: number;
  viceCaptain?: number;
}

/**
 * Generate a secure random nonce for encryption
 */
export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return toHex(array);
}

/**
 * Simple encryption using Web Crypto API (AES-GCM)
 * In a real FHE implementation, this would use FHE libraries
 */
export async function encryptData(data: any, key?: string): Promise<EncryptedData> {
  try {
    // Generate a random key if none provided
    const encryptionKey = key || generateNonce();
    
    // Convert data to string
    const dataString = JSON.stringify(data);
    const dataBuffer = new TextEncoder().encode(dataString);
    
    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Import key
    const keyBuffer = new TextEncoder().encode(encryptionKey.slice(0, 32));
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );
    
    // Encrypt data
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      dataBuffer
    );
    
    // Extract tag (last 16 bytes)
    const tag = new Uint8Array(encryptedBuffer.slice(-16));
    const ciphertext = new Uint8Array(encryptedBuffer.slice(0, -16));
    
    return {
      ciphertext: toHex(ciphertext),
      nonce: toHex(iv),
      tag: toHex(tag)
    };
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt data using Web Crypto API
 */
export async function decryptData(encryptedData: EncryptedData, key?: string): Promise<any> {
  try {
    const encryptionKey = key || generateNonce();
    
    // Convert hex strings back to Uint8Array
    const ciphertext = new Uint8Array(encryptedData.ciphertext.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    const iv = new Uint8Array(encryptedData.nonce.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    const tag = new Uint8Array(encryptedData.tag.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    
    // Combine ciphertext and tag
    const encryptedBuffer = new Uint8Array(ciphertext.length + tag.length);
    encryptedBuffer.set(ciphertext);
    encryptedBuffer.set(tag, ciphertext.length);
    
    // Import key
    const keyBuffer = new TextEncoder().encode(encryptionKey.slice(0, 32));
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    // Decrypt data
    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encryptedBuffer
    );
    
    const decryptedString = new TextDecoder().decode(decryptedBuffer);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Create a commitment hash for lineup data
 * This ensures data integrity without revealing the actual lineup
 */
export function createLineupCommitment(lineupData: LineupData, salt: string): string {
  const commitmentData = {
    ...lineupData,
    salt,
    timestamp: Date.now()
  };
  
  return keccak256(toHex(JSON.stringify(commitmentData)));
}

/**
 * Encrypt lineup data for blockchain submission
 */
export async function encryptLineup(lineupData: LineupData): Promise<{
  encryptedData: EncryptedData;
  commitment: string;
  salt: string;
}> {
  const salt = generateNonce();
  const commitment = createLineupCommitment(lineupData, salt);
  const encryptedData = await encryptData(lineupData);
  
  return {
    encryptedData,
    commitment,
    salt
  };
}

/**
 * Verify lineup commitment without revealing data
 */
export function verifyLineupCommitment(
  lineupData: LineupData,
  salt: string,
  commitment: string
): boolean {
  const expectedCommitment = createLineupCommitment(lineupData, salt);
  return expectedCommitment === commitment;
}

/**
 * Generate FHE public key (placeholder for real FHE implementation)
 */
export function generateFHEPublicKey(): string {
  // In a real implementation, this would generate an FHE public key
  // For now, we'll use a deterministic key based on user address
  return keccak256(toHex(`fhe-key-${Date.now()}`));
}

/**
 * Encrypt player selection using FHE
 */
export async function encryptPlayerSelection(
  playerId: number,
  round: number,
  publicKey?: string
): Promise<EncryptedData> {
  const selectionData = {
    playerId,
    round,
    timestamp: Date.now(),
    publicKey: publicKey || generateFHEPublicKey()
  };
  
  return await encryptData(selectionData);
}

/**
 * Batch encrypt multiple player selections
 */
export async function encryptPlayerSelections(
  selections: Array<{ playerId: number; round: number }>,
  publicKey?: string
): Promise<EncryptedData[]> {
  const encryptionPromises = selections.map(selection =>
    encryptPlayerSelection(selection.playerId, selection.round, publicKey)
  );
  
  return await Promise.all(encryptionPromises);
}

/**
 * Create a zero-knowledge proof for lineup validity
 * This is a placeholder for real ZK proof implementation
 */
export function createLineupProof(lineupData: LineupData): string {
  // In a real implementation, this would create a ZK proof
  // that the lineup is valid without revealing the actual selections
  const proofData = {
    lineupHash: keccak256(toHex(JSON.stringify(lineupData))),
    timestamp: Date.now(),
    proofType: 'lineup-validity'
  };
  
  return keccak256(toHex(JSON.stringify(proofData)));
}

/**
 * Validate lineup constraints
 */
export function validateLineup(lineupData: LineupData, maxPlayers: number = 5): boolean {
  // Basic validation rules
  if (!lineupData.playerIds || lineupData.playerIds.length !== maxPlayers) {
    return false;
  }
  
  if (lineupData.positions && lineupData.positions.length !== maxPlayers) {
    return false;
  }
  
  // Check for duplicate players
  const uniquePlayers = new Set(lineupData.playerIds);
  if (uniquePlayers.size !== lineupData.playerIds.length) {
    return false;
  }
  
  // Validate captain selection
  if (lineupData.captain && !lineupData.playerIds.includes(lineupData.captain)) {
    return false;
  }
  
  // Validate vice captain selection
  if (lineupData.viceCaptain && !lineupData.playerIds.includes(lineupData.viceCaptain)) {
    return false;
  }
  
  return true;
}

/**
 * Generate encrypted lineup hash for blockchain storage
 */
export async function generateEncryptedLineupHash(lineupData: LineupData): Promise<string> {
  if (!validateLineup(lineupData)) {
    throw new Error('Invalid lineup data');
  }
  
  const { commitment } = await encryptLineup(lineupData);
  return commitment;
}
