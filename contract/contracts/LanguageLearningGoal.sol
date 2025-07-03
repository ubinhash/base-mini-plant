// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract LanguageLearningGoal {
  using ECDSA for bytes32;

  address public owner;
  address public rewardPool;
  address public signerAddress;

  uint256 public nextGoalId = 1;
  uint8 public constant VOCAB_LEARNED_THRESHOLD = 3;

  struct Goal {
    address user;
    uint256 targetVocab;
    uint256 stake;
    uint256 startTime;
    uint256 deadline;
    bool claimed;
    uint256 learnedCount;
    uint8 difficulty; // 1-5 difficulty level
  }

  mapping(uint256 => Goal) public goals;
  mapping(address => uint256) public userActiveGoalId;
  mapping(address => mapping(string => uint8)) public wordLearningProgress;

  event GoalCreated(
    address indexed user,
    uint256 indexed goalId,
    uint256 targetVocab,
    uint256 deadline,
    uint8 difficulty
  );
  event VocabLearned(
    address indexed user,
    uint256 indexed goalId,
    string word,
    uint8 progress
  );
  event VocabMastered(
    address indexed user,
    uint256 indexed goalId,
    string word
  );
  event StakeClaimed(
    address indexed user,
    uint256 indexed goalId,
    uint256 amount
  );
  event SignerUpdated(address indexed newSigner);

  modifier onlyOwner() {
    require(msg.sender == owner, "Not owner");
    _;
  }

  constructor(address _rewardPool, address _signerAddress) {
    require(_rewardPool != address(0), "Invalid reward pool");
    require(_signerAddress != address(0), "Invalid signer address");

    owner = msg.sender;
    rewardPool = _rewardPool;
    signerAddress = _signerAddress;
  }

  function setSignerAddress(address _signerAddress) external onlyOwner {
    require(_signerAddress != address(0), "Zero address");
    signerAddress = _signerAddress;
    emit SignerUpdated(_signerAddress);
  }

  function createGoal(
    uint256 targetVocab,
    uint256 durationDays,
    uint8 difficulty
  ) external payable {
    require(userActiveGoalId[msg.sender] == 0, "Active goal exists");
    require(durationDays > 0 && durationDays <= 30, "Duration 1-30 days");
    require(targetVocab > 0, "Target vocab > 0");
    require(msg.value > 0, "Stake ETH");
    require(difficulty >= 1 && difficulty <= 5, "Difficulty 1-5");

    uint256 goalId = nextGoalId++;
    goals[goalId] = Goal({
      user: msg.sender,
      targetVocab: targetVocab,
      stake: msg.value,
      startTime: block.timestamp,
      deadline: block.timestamp + durationDays * 1 days,
      claimed: false,
      learnedCount: 0,
      difficulty: difficulty
    });

    userActiveGoalId[msg.sender] = goalId;

    emit GoalCreated(
      msg.sender,
      goalId,
      targetVocab,
      goals[goalId].deadline,
      difficulty
    );
  }

  function updateProgress(
    uint256 goalId,
    string calldata word,
    bytes calldata signature
  ) external {
    Goal storage g = goals[goalId];
    require(g.user != address(0), "Goal not found");
    require(!g.claimed, "Goal claimed");
    require(block.timestamp <= g.deadline, "Goal expired");

    uint8 currentProgress = wordLearningProgress[g.user][word];
    require(currentProgress < VOCAB_LEARNED_THRESHOLD, "Word already mastered");

    // Validate signature
    bytes32 messageHash = keccak256(abi.encodePacked(goalId, word));
    bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(messageHash);
    address recovered = ECDSA.recover(ethSignedMessageHash, signature);
    require(recovered == signerAddress, "Invalid signature");

    wordLearningProgress[g.user][word] = currentProgress + 1;

    if (currentProgress + 1 == VOCAB_LEARNED_THRESHOLD) {
      g.learnedCount += 1;
      emit VocabMastered(g.user, goalId, word);
    }

    emit VocabLearned(g.user, goalId, word, currentProgress + 1);
  }

  function claimStake() external {
    uint256 goalId = userActiveGoalId[msg.sender];
    require(goalId != 0, "No active goal");

    Goal storage g = goals[goalId];
    require(!g.claimed, "Already claimed");

    bool deadlinePassed = block.timestamp > g.deadline;
    bool goalReached = g.learnedCount >= g.targetVocab;
    require(deadlinePassed || goalReached, "Goal in progress");

    uint256 ratio = (g.learnedCount * 1e18) / g.targetVocab;
    if (ratio > 1e18) ratio = 1e18;

    uint256 refund = (g.stake * ratio) / 1e18;
    uint256 remainder = g.stake - refund;

    g.claimed = true;
    userActiveGoalId[msg.sender] = 0;

    if (refund > 0) {
      payable(msg.sender).transfer(refund);
      emit StakeClaimed(msg.sender, goalId, refund);
    }

    if (remainder > 0) {
      payable(rewardPool).transfer(remainder);
    }
  }

  function getActiveGoalId(address user) external view returns (uint256) {
    return userActiveGoalId[user];
  }

  function getWordProgress(
    address user,
    string calldata word
  ) external view returns (uint8) {
    return wordLearningProgress[user][word];
  }

  receive() external payable {}

  fallback() external payable {}
}
