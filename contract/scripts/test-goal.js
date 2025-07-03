const hre = require("hardhat");

async function main() {
  // Get the contract instance
  const languageLearningGoal = await hre.ethers.getContractAt(
    "LanguageLearningGoal",
    "0x0655266c179D0111398A3858904b62910567a5eB" // Replace with your deployed contract address
  );

  // Get the signer
  const [signer] = await hre.ethers.getSigners();
  console.log("Using signer address:", signer.address);

  // Use a known goalId (or set this to your actual goalId)
  const goalId = 1;

  // Update progress for some words
  console.log("\nUpdating progress...");
  const words = ["hello", "world"];
  
  // Get the signer's private key from environment
  const signerPrivateKey = process.env.PRIVATE_KEY_SIGNER;
  if (!signerPrivateKey) {
    throw new Error("PRIVATE_KEY_SIGNER not found in environment variables");
  }
  const signerWallet = new hre.ethers.Wallet(signerPrivateKey);
  console.log("Using signer wallet address:", signerWallet.address);
  
  for (const word of words) {
    // Create message hash as in the contract: keccak256(abi.encodePacked(goalId, word))
    const packed = hre.ethers.solidityPacked(["uint256", "string"], [goalId, word]);
    const messageHash = hre.ethers.keccak256(packed);
    // Sign the hash as an Ethereum Signed Message
    const signature = await signerWallet.signMessage(hre.ethers.getBytes(messageHash));

    // Update progress
    try {
      const updateTx = await languageLearningGoal.updateProgress(goalId, word, signature);
      await updateTx.wait();
      console.log(`Progress updated for word: ${word}`);

      // Check progress
      const progress = await languageLearningGoal.getWordProgress(signer.address, word);
      console.log(`Progress for ${word}: ${progress}`);
    } catch (error) {
      console.log(`Failed to update progress for word: ${word} - ${error.message}`);
    }
  }

//   // Try to claim stake
//   console.log("\nAttempting to claim stake...");
//   try {
//     const claimTx = await languageLearningGoal.claimStake();
//     await claimTx.wait();
//     console.log("Stake claimed successfully!");
//   } catch (error) {
//     console.log("Could not claim stake:", error.message);
//   }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 