// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract MiniPlant is ERC721, Ownable {
    using Strings for uint256;

    uint256 public constant MAX_PETALS = 8;
    uint256 public constant MINT_PRICE = 0.000001 ether;
    uint256 public constant GROW_PRICE = 0.0000005 ether;
    uint256 public nextTokenId;

    struct Plant {
        uint8 petals;
        uint8 leaves;
        bool vaulted;
        uint8[8] petalColorIndices; // store up to 8 color indices
        uint8 potColorIndex; // store the pot color index
    }

    mapping(uint256 => Plant) public plants;
    mapping(address => uint256) public activePlant;

    // Pastel/vibrant color palettes for petals and pots
    string[] private petalColors = [
        "#FF6B6B", // vibrant coral red
        "#FFA69E", // warm blush
        "#FFB347", // vivid peach
        "#FFD166", // golden yellow
        "#70C1B3", // ocean teal
        "#5FAD56", // fresh green
        "#6A94FF", // periwinkle blue
        "#A685E2"  // soft violet
    ];

    // Pot color palettes: 8 options for striped and solid pots
    string[8] private potColors = [
        "#F9F9E3", // light cream
        "#FFE5B4", // pastel orange
        "#E0BBE4", // lavender
        "#B5EAD7", // mint
        "#FFF1BA", // pastel yellow
        "#B5D8FA", // pastel blue
        "#FFD1DC", // pastel pink
        "#E2F0CB"  // pastel green
    ];

    string[8] private potStripeColors = [
        "#BFCF6A", // olive stripe
        "#FFB347", // vivid peach stripe
        "#957DAD", // muted purple stripe
        "#70C1B3", // teal stripe
        "#FFD166", // golden stripe
        "#6A94FF", // periwinkle stripe
        "#FF6B6B", // coral stripe
        "#5FAD56"  // fresh green stripe
    ];

    constructor() ERC721("MiniPlant", "MPLANT") Ownable(msg.sender) {}

    // Mint a new plant (1 per address)
    function mint() external payable {
        require(activePlant[msg.sender] == 0, "Already have an active plant");
        require(msg.value >= MINT_PRICE, "Insufficient payment");
        nextTokenId++;
        uint256 tokenId = nextTokenId;
        _safeMint(msg.sender, tokenId);
        Plant storage plant = plants[tokenId];
        plant.petals = 0;
        plant.leaves = 2;
        plant.vaulted = false;
        // pseudo-random pot color index
        plant.potColorIndex = uint8(uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, tokenId))) % potColors.length);
        activePlant[msg.sender] = tokenId;
    }

    // Pay to grow a petal (up to 8)
    function grow() external payable {
        uint256 tokenId = activePlant[msg.sender];
        require(tokenId != 0, "No active plant");
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(!plants[tokenId].vaulted, "Vaulted");
        require(plants[tokenId].petals < MAX_PETALS, "Max petals");
        require(msg.value >= GROW_PRICE, "Insufficient payment");
        uint8 petalNum = plants[tokenId].petals;
        plants[tokenId].petalColorIndices[petalNum] = uint8(
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.prevrandao,
                        tokenId,
                        petalNum,
                        msg.sender
                    )
                )
            ) % petalColors.length
        );
        plants[tokenId].petals++;
    }


    // Free: trim a petal (last-in, first-out)
    function trimPetal() external {
        uint256 tokenId = activePlant[msg.sender];
        require(tokenId != 0, "No active plant");
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(!plants[tokenId].vaulted, "Vaulted");
        require(plants[tokenId].petals > 0, "No petals left");
        plants[tokenId].petals--;
    }

    // Vault: seal the plant forever
    function vault() external {
        uint256 tokenId = activePlant[msg.sender];
        require(tokenId != 0, "No active plant");
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        require(!plants[tokenId].vaulted, "Already vaulted");
        plants[tokenId].vaulted = true;
        activePlant[msg.sender] = 0;
    }

    // On-chain SVG rendering
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(tokenId > 0 && tokenId <= nextTokenId, "Nonexistent token");
        Plant memory plant = plants[tokenId];
        string memory svg = renderSVG(plant);
        string memory json = string(abi.encodePacked(
            '{"name":"MiniPlant #', tokenId.toString(), 
            '","description":"On-chain MiniPlant. Grow, trim, and vault your flower!",',
            '"image":"data:image/svg+xml;base64,', base64(bytes(svg)), '"}'
        ));
        return string(abi.encodePacked("data:application/json;base64,", base64(bytes(json))));
    }

    // Render SVG for a plant
    function renderSVG(Plant memory plant) internal view returns (string memory) {
        string memory petalsSVG = "";
        uint8 petals = plant.petals;
        for (uint8 i = 0; i < petals; i++) {
            uint256 angle = (360 * i) / (petals == 0 ? 1 : petals) + 45;
            string memory color = petalColors[plant.petalColorIndices[i] % petalColors.length];
            uint8 rx = 10;
            if (petals < 3) {
                rx = 15;
            } else if (petals < 4) {
                rx = 12;
            }
            petalsSVG = string(abi.encodePacked(
                petalsSVG,
                '<ellipse cx="150" cy="110" rx="', uint256(rx).toString(),
                '" ry="20" fill="', color,
                '" stroke="#fff" stroke-width="2" transform="rotate(',
                angle.toString(), ', 150, 130)" />'
            ));
        }
        // Leaves (always 2, but can be trimmed)
        string memory leavesSVG = "";
        if (plant.leaves > 0) {
            leavesSVG = string(abi.encodePacked(
                '<path d="M 120 175 Q 120 195 135 205 Q 150 195 120 175" fill="#4CAF50" />',
                plant.leaves > 1 ? '<path d="M 180 185 Q 180 205 165 215 Q 150 205 180 185" fill="#4CAF50" />' : ''
            ));
        }
        // Stem
        string memory stemSVG = '<path d="M 150 150 Q 148 170 150 190 Q 152 210 150 230 Q 148 250 150 270" stroke="#2E7D32" stroke-width="4" fill="none" />';
        // Pot (use plant.potColorIndex)
        string memory potSVG = string(abi.encodePacked(
            '<g>',
            '<path d="M 100 225 Q 150 285 200 225 Q 200 255 150 270 Q 100 255 100 225 Z" fill="', potColors[plant.potColorIndex], '" stroke="none"/>',
            '<rect x="100" y="225" width="100" height="12" fill="', potColors[plant.potColorIndex], '" stroke="none"/>',
            '<g stroke="', potStripeColors[plant.potColorIndex], '" stroke-width="2" fill="none">',
            '<path d="M 105 235 Q 150 245 195 235" />',
            '<path d="M 105 240 Q 150 250 195 240" />',
            '<path d="M 105 245 Q 150 255 195 245" />',
            '<path d="M 105 250 Q 150 260 195 250" />',
            '<path d="M 105 255 Q 150 265 195 255" />',
            '<path d="M 110 260 Q 150 270 190 260" />',
            '<path d="M 115 265 Q 150 275 185 265" />',
            '</g></g>'
        ));
        // Center
        string memory centerSVG = '<circle cx="150" cy="130" r="7" fill="#333" stroke="#fff" stroke-width="2"/>';
        // Compose SVG
        return string(abi.encodePacked(
            '<svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">',
            leavesSVG, stemSVG, petalsSVG, centerSVG, potSVG, '</svg>'
        ));
    }

    // Base64 encode (from OpenZeppelin)
    string internal constant TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    function base64(bytes memory data) internal pure returns (string memory) {
        if (data.length == 0) return '';
        string memory table = TABLE;
        uint256 encodedLen = 4 * ((data.length + 2) / 3);
        string memory result = new string(encodedLen + 32);
        assembly {
            mstore(result, encodedLen)
            let tablePtr := add(table, 1)
            let dataPtr := data
            let endPtr := add(dataPtr, mload(data))
            let resultPtr := add(result, 32)
            for {} lt(dataPtr, endPtr) {}
            {
                dataPtr := add(dataPtr, 3)
                let input := mload(dataPtr)
                mstore8(resultPtr, mload(add(tablePtr, and(shr(18, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(shr(12, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(shr(6, input), 0x3F))))
                resultPtr := add(resultPtr, 1)
                mstore8(resultPtr, mload(add(tablePtr, and(input, 0x3F))))
                resultPtr := add(resultPtr, 1)
            }
            switch mod(mload(data), 3)
            case 1 { mstore(sub(resultPtr, 2), shl(240, 0x3d3d)) }
            case 2 { mstore(sub(resultPtr, 1), shl(248, 0x3d)) }
        }
        return result;
    }

    // Withdraw function for the contract owner
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        (bool sent, ) = owner().call{value: balance}("");
        require(sent, "Withdraw failed");
    }

    // Returns the array of petal color indices for a given tokenId
    function getPetalColorIndices(uint256 tokenId) public view returns (uint8[8] memory) {
        require(tokenId > 0 && tokenId <= nextTokenId, "Nonexistent token");
        return plants[tokenId].petalColorIndices;
    }

    // Soulbound: block all transfers except mint (from == 0) and burn (to == 0)
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = _ownerOf(tokenId);
        // Only allow mint (from == address(0)) and burn (to == address(0))
        if (from != address(0) && to != address(0)) {
            revert("Soulbound: transfers disabled");
        }
        return super._update(to, tokenId, auth);
    }

    // Block approvals
    function approve(address, uint256) public pure override {
        revert("Soulbound: approvals disabled");
    }

    function setApprovalForAll(address, bool) public pure override {
        revert("Soulbound: approvals disabled");
    }
}
