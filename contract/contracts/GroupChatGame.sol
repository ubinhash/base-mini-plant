// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract GroupChatGame {
    using ECDSA for bytes32;

    address public signerAddress;
    uint256 public nextRoundId = 1;
    uint256 public constant maxRoundTime = 24 hours;
    address public owner;

    struct Round {
        uint256 id;
        bytes32 conversationId;
        address[] players;
        mapping(address => bool) hasDeposited;
        mapping(address => bool) hasWithdrawn;
        bool depositOpen;
        bool roundEnded;
        address winner;
        uint256 totalDeposited;
        uint256 startTime;
    }

    mapping(uint256 => Round) private rounds;
    mapping(uint256 => bytes32) public roundToConversation;
    mapping(bytes32 => uint256) public activeRoundId;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    event SignerUpdated(address indexed newSigner);
    event RoundStarted(bytes32 indexed conversationId, uint256 roundId);
    event PlayerDeposited(uint256 indexed roundId, address indexed player, uint256 amount);
    event DepositPhaseEnded(uint256 indexed roundId);
    event WinnerDeclared(uint256 indexed roundId, address indexed winner, uint256 prize);
    event FailsafeWithdrawn(uint256 indexed roundId, address indexed player, uint256 amount);
    event RoundEnded(uint256 indexed roundId, address winner, bool byFailsafe);

    function setSignerAddress(address _signerAddress) external onlyOwner {
        require(_signerAddress != address(0), "Invalid signer address");
        signerAddress = _signerAddress;
        emit SignerUpdated(_signerAddress);
    }

    function startNewRound(bytes32 conversationId, bytes calldata signature) external {
        require(activeRoundId[conversationId] == 0, "Active round already exists");

        // Verify signature
        bytes32 messageHash = keccak256(abi.encodePacked("START_ROUND", conversationId));
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(messageHash);
        address recovered = ECDSA.recover(ethSignedMessageHash, signature);
        require(recovered == signerAddress, "Invalid signature");

        uint256 roundId = nextRoundId++;
        Round storage round = rounds[roundId];
        round.id = roundId;
        round.conversationId = conversationId;
        round.depositOpen = true;
        round.startTime = block.timestamp;

        activeRoundId[conversationId] = roundId;
        roundToConversation[roundId] = conversationId;

        emit RoundStarted(conversationId, roundId);
    }

    function deposit(uint256 roundId) external payable {
        Round storage round = rounds[roundId];
        require(round.depositOpen, "Deposit phase closed");
        require(!round.hasDeposited[msg.sender], "Already deposited");
        require(msg.value > 0, "No ETH sent");

        round.hasDeposited[msg.sender] = true;
        round.players.push(msg.sender);
        round.totalDeposited += msg.value;

        emit PlayerDeposited(roundId, msg.sender, msg.value);
    }

    function endDepositPhase(uint256 roundId, bytes calldata signature) external {
        Round storage round = rounds[roundId];
        require(round.depositOpen, "Already ended");

        // Verify signature
        bytes32 messageHash = keccak256(abi.encodePacked("END_DEPOSIT", roundId));
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(messageHash);
        address recovered = ECDSA.recover(ethSignedMessageHash, signature);
        require(recovered == signerAddress, "Invalid signature");

        round.depositOpen = false;

        emit DepositPhaseEnded(roundId);
    }

    function declareWinner(uint256 roundId, address winner, bytes calldata signature) external {
        Round storage round = rounds[roundId];
        require(!round.roundEnded, "Round already ended");
        require(round.hasDeposited[winner], "Winner not a player");

        // Verify signature
        bytes32 messageHash = keccak256(abi.encodePacked("DECLARE_WINNER", roundId, winner));
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(messageHash);
        address recovered = ECDSA.recover(ethSignedMessageHash, signature);
        require(recovered == signerAddress, "Invalid signature");

        round.depositOpen = false;
        round.roundEnded = true;
        round.winner = winner;

        bytes32 conversationId = round.conversationId;
        activeRoundId[conversationId] = 0;

        uint256 prize = round.totalDeposited;
        (bool sent, ) = winner.call{value: prize}("");
        require(sent, "ETH transfer failed");

        emit WinnerDeclared(roundId, winner, prize);
        emit RoundEnded(roundId, winner, false);
    }

    function withdrawAfterTimeout(uint256 roundId) external {
        Round storage round = rounds[roundId];
        require(block.timestamp >= round.startTime + maxRoundTime, "Too early to withdraw");
        require(round.hasDeposited[msg.sender], "You didn't deposit");
        require(!round.hasWithdrawn[msg.sender], "Already withdrawn");

        // First withdrawal ends the round
        if (!round.roundEnded) {
            round.depositOpen = false;
            round.roundEnded = true;
            round.winner = address(0);
            activeRoundId[round.conversationId] = 0;

            emit RoundEnded(roundId, address(0), true);
        }

        uint256 share = round.totalDeposited / round.players.length;
        round.hasWithdrawn[msg.sender] = true;

        (bool sent, ) = msg.sender.call{value: share}("");
        require(sent, "Withdraw failed");

        emit FailsafeWithdrawn(roundId, msg.sender, share);
    }

    function getPlayers(uint256 roundId) external view returns (address[] memory) {
        return rounds[roundId].players;
    }

    function getRoundInfo(uint256 roundId) external view returns (
        bytes32 conversationId,
        bool depositOpen,
        bool roundEnded,
        address winner,
        uint256 totalDeposited,
        uint256 playerCount,
        uint256 startTime
    ) {
        Round storage round = rounds[roundId];
        return (
            round.conversationId,
            round.depositOpen,
            round.roundEnded,
            round.winner,
            round.totalDeposited,
            round.players.length,
            round.startTime
        );
    }
}
