// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.19;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

// contract BasedNFT is ERC721, Ownable {
//     // Simple counter instead of Counters library
//     uint256 private _tokenIds;

//     // Mapping to track if an address has already minted
//     mapping(address => bool) public hasMinted;
    
//     // Base URI for metadata
//     string private _baseTokenURI;
    
//     // Events
//     event NFTMinted(address indexed to, uint256 indexed tokenId);
//     event BaseURIUpdated(string newBaseURI);

//     constructor() ERC721("Based NFT", "Baser Base") Ownable(msg.sender) {
//         _baseTokenURI = "";
//         _tokenIds = 0;
//     }

//     /**
//      * @dev Free mint function - each address can mint only once
//      */
//     function mint() external {
//         // require(!hasMinted[msg.sender], "Already minted");
        
//         _tokenIds++;
//         uint256 newTokenId = _tokenIds;
        
//         _mint(msg.sender, newTokenId);
//         hasMinted[msg.sender] = true;
        
//         emit NFTMinted(msg.sender, newTokenId);
//     }

//     /**
//      * @dev Check if an address has already minted
//      */
//     function hasAddressMinted(address user) external view returns (bool) {
//         return hasMinted[user];
//     }

//     /**
//      * @dev Get the total number of NFTs minted
//      */
//     function totalSupply() external view returns (uint256) {
//         return _tokenIds;
//     }

//     /**
//      * @dev Get the next token ID that will be minted
//      */
//     function getNextTokenId() external view returns (uint256) {
//         return _tokenIds + 1;
//     }

//     /**
//      * @dev Set the base URI for token metadata
//      */
//     function setBaseURI(string memory baseURI) external onlyOwner {
//         _baseTokenURI = baseURI;
//         emit BaseURIUpdated(baseURI);
//     }

//     /**
//      * @dev Get the base URI for token metadata
//      */
//     function baseURI() external view returns (string memory) {
//         return _baseTokenURI;
//     }

//     /**
//      * @dev Override the _baseURI function from ERC721
//      */
//     function _baseURI() internal view override returns (string memory) {
//         return _baseTokenURI;
//     }

//     /**
//      * @dev Get token URI for a specific token
//      */
//     function tokenURI(uint256 tokenId) public view override returns (string memory) {
//         require(tokenId > 0 && tokenId <= _tokenIds, "Token does not exist");
//         // For now, return a simple URI format
//         return string(abi.encodePacked(_baseURI(), "token/", uint2str(tokenId)));
//     }

//     /**
//      * @dev Convert uint256 to string
//      */
//     function uint2str(uint256 _i) internal pure returns (string memory str) {
//         if (_i == 0) {
//             return "0";
//         }
//         uint256 j = _i;
//         uint256 length;
//         while (j != 0) {
//             length++;
//             j /= 10;
//         }
//         bytes memory bstr = new bytes(length);
//         uint256 k = length;
//         while (_i != 0) {
//             k -= 1;
//             uint8 temp = (48 + uint8(_i - _i / 10 * 10));
//             bytes1 b1 = bytes1(temp);
//             bstr[k] = b1;
//             _i /= 10;
//         }
//         return string(bstr);
//     }
// } 