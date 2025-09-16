import { ethers } from "hardhat";

async function main() {
  console.log("Deploying SecretDraftSecure contract...");

  const SecretDraftSecure = await ethers.getContractFactory("SecretDraftSecure");
  const secretDraftSecure = await SecretDraftSecure.deploy();

  await secretDraftSecure.waitForDeployment();

  const address = await secretDraftSecure.getAddress();
  console.log("SecretDraftSecure deployed to:", address);

  // Add some initial players
  console.log("Adding initial players...");
  
  const players = [
    { name: "Crypto King", position: "QB", basePrice: ethers.parseEther("0.1") },
    { name: "Blockchain Beast", position: "RB", basePrice: ethers.parseEther("0.08") },
    { name: "DeFi Dominator", position: "WR", basePrice: ethers.parseEther("0.06") },
    { name: "NFT Ninja", position: "TE", basePrice: ethers.parseEther("0.05") },
    { name: "Smart Contract", position: "K", basePrice: ethers.parseEther("0.03") },
  ];

  for (const player of players) {
    const tx = await secretDraftSecure.addPlayer(player.name, player.position, player.basePrice);
    await tx.wait();
    console.log(`Added player: ${player.name} (${player.position})`);
  }

  console.log("Deployment completed successfully!");
  console.log("Contract address:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
