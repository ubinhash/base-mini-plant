const hre = require("hardhat");

async function main() {
  // Deploy the MiniPlant contract
  const MiniPlant = await hre.ethers.getContractFactory("MiniPlant");
  const miniPlant = await MiniPlant.deploy();
  await miniPlant.waitForDeployment();
  const miniPlantAddress = await miniPlant.getAddress();
  console.log("MiniPlant deployed to:", miniPlantAddress);

  // Verify MiniPlant
  console.log("Verifying MiniPlant...");
  try {
    await hre.run("verify:verify", {
      address: miniPlantAddress,
      constructorArguments: [],
    });
    console.log("MiniPlant verified successfully");
  } catch (error) {
    console.log("Error verifying MiniPlant:", error.message);
  }

  // Test mint a pot
  console.log("Testing mint function...");
  try {
    const [signer] = await hre.ethers.getSigners();
    const mintTx = await miniPlant.mint({ value: hre.ethers.parseEther("0.000001") });
    await mintTx.wait();
    console.log("Test pot minted successfully to:", signer.address);

    // Check plant state
    const tokenId = await miniPlant.activePlant(signer.address);
    const plant = await miniPlant.plants(tokenId);
    console.log("Minted plant state:", plant);

    // Grow 1 petal (spend 0.0000005 ETH)
    const growTx = await miniPlant.grow({ value: hre.ethers.parseEther("0.0000005") });
    await growTx.wait();
    console.log("Grew 1 petal for tokenId:", tokenId.toString());

    // Check updated plant state
    const updatedPlant = await miniPlant.plants(tokenId);
    console.log("Updated plant state:", updatedPlant);

  } catch (error) {
    console.log("Error minting or growing:", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});