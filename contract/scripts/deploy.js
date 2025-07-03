const hre = require("hardhat");

async function main() {
  // Deploy a mock reward pool first (for testing)
  const MockRewardPool = await hre.ethers.getContractFactory("MockRewardPool");
  const mockRewardPool = await MockRewardPool.deploy();
  await mockRewardPool.waitForDeployment();
  const mockRewardPoolAddress = await mockRewardPool.getAddress();
  console.log("MockRewardPool deployed to:", mockRewardPoolAddress);

  // Verify MockRewardPool
  console.log("Verifying MockRewardPool...");
  try {
    await hre.run("verify:verify", {
      address: mockRewardPoolAddress,
      constructorArguments: [],
    });
    console.log("MockRewardPool verified successfully");
  } catch (error) {
    console.log("Error verifying MockRewardPool:", error.message);
  }

  // Get the signer address from environment variable or use deployer as signer
  const signerAddress = process.env.SIGNER_ADDRESS || (await hre.ethers.getSigners())[0].address;
  console.log("Using signer address:", signerAddress);

  // Deploy the LanguageLearningGoal contract
  const LanguageLearningGoal = await hre.ethers.getContractFactory("LanguageLearningGoal");
  const languageLearningGoal = await LanguageLearningGoal.deploy(mockRewardPoolAddress, signerAddress);
  await languageLearningGoal.waitForDeployment();
  const languageLearningGoalAddress = await languageLearningGoal.getAddress();
  console.log("LanguageLearningGoal deployed to:", languageLearningGoalAddress);

  // Verify LanguageLearningGoal
  console.log("Verifying LanguageLearningGoal...");
  try {
    await hre.run("verify:verify", {
      address: languageLearningGoalAddress,
      constructorArguments: [mockRewardPoolAddress, signerAddress],
    });
    console.log("LanguageLearningGoal verified successfully");
  } catch (error) {
    console.log("Error verifying LanguageLearningGoal:", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 