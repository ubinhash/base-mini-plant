const hre = require("hardhat");

async function main() {
  // Deploy the BasedNFT contract
  const BasedNFT = await hre.ethers.getContractFactory("BasedNFT");
  const basedNFT = await BasedNFT.deploy();
  await basedNFT.waitForDeployment();
  const basedNFTAddress = await basedNFT.getAddress();
  console.log("BasedNFT deployed to:", basedNFTAddress);

  // Set base URI for metadata (optional)
  const baseURI = "https://your-metadata-server.com/metadata/";
  console.log("Setting base URI to:", baseURI);
  try {
    const setURITx = await basedNFT.setBaseURI(baseURI);
    await setURITx.wait();
    console.log("Base URI set successfully");
  } catch (error) {
    console.log("Error setting base URI:", error.message);
  }

  // Verify BasedNFT
  console.log("Verifying BasedNFT...");
  try {
    await hre.run("verify:verify", {
      address: basedNFTAddress,
      constructorArguments: [],
    });
    console.log("BasedNFT verified successfully");
  } catch (error) {
    console.log("Error verifying BasedNFT:", error.message);
  }

  // Test mint an NFT
  console.log("Testing mint function...");
  try {
    const [signer] = await hre.ethers.getSigners();
    const mintTx = await basedNFT.mint();
    await mintTx.wait();
    console.log("Test NFT minted successfully to:", signer.address);
    
    // Check total supply
    const totalSupply = await basedNFT.totalSupply();
    console.log("Total supply:", totalSupply.toString());
  } catch (error) {
    console.log("Error minting test NFT:", error.message);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 