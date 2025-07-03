const hre = require("hardhat");

async function main() {
  // Get the signer address from environment variable or use deployer as signer
  const signerAddress = process.env.SIGNER_ADDRESS || (await hre.ethers.getSigners())[0].address;
  console.log("Using signer address:", signerAddress);

  // Deploy the GroupChatGame contract
  const GroupChatGame = await hre.ethers.getContractFactory("GroupChatGame");
  const groupChatGame = await GroupChatGame.deploy();
  await groupChatGame.waitForDeployment();
  const groupChatGameAddress = await groupChatGame.getAddress();
  console.log("GroupChatGame deployed to:", groupChatGameAddress);

  // Set the signer address
  console.log("Setting signer address...");
  const setSignerTx = await groupChatGame.setSignerAddress(signerAddress);
  await setSignerTx.wait();
  console.log("Signer address set successfully");

  // Verify GroupChatGame
  console.log("Verifying GroupChatGame...");
  try {
    await hre.run("verify:verify", {
      address: groupChatGameAddress,
      constructorArguments: [],
    });
    console.log("GroupChatGame verified successfully");
  } catch (error) {
    console.log("Error verifying GroupChatGame:", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 