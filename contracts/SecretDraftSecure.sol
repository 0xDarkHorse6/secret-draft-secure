// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@fhevm/solidity/FHE.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title SecretDraftSecure
 * @dev Privacy-preserving fantasy sports platform using FHE encryption
 * @notice This contract allows users to create leagues, draft players, and manage lineups
 *         with encrypted data to protect user privacy and prevent front-running
 */
contract SecretDraftSecure is Ownable, ReentrancyGuard {
    using FHE for euint32;
    using FHE for euint8;
    using FHE for bool;

    // Events
    event LeagueCreated(uint256 indexed leagueId, address indexed creator, string name, uint256 entryFee);
    event PlayerDrafted(uint256 indexed leagueId, address indexed player, uint256 playerId, uint256 round);
    event LineupSubmitted(uint256 indexed leagueId, address indexed user, bytes32 lineupHash);
    event PrizeDistributed(uint256 indexed leagueId, address indexed winner, uint256 amount);

    // Structs
    struct League {
        string name;
        address creator;
        uint256 entryFee;
        uint256 maxPlayers;
        uint256 currentPlayers;
        uint256 totalPrizePool;
        bool isActive;
        uint256 draftDeadline;
        uint256 lineupDeadline;
        mapping(address => bool) participants;
        mapping(address => uint256[]) userLineup;
        mapping(uint256 => address) draftedPlayers;
        mapping(address => uint256) userScore;
    }

    struct Player {
        string name;
        string position;
        uint256 basePrice;
        bool isAvailable;
    }

    // State variables
    mapping(uint256 => League) public leagues;
    mapping(uint256 => Player) public players;
    uint256 public nextLeagueId = 1;
    uint256 public nextPlayerId = 1;
    
    // FHE encrypted data
    mapping(uint256 => euint32) private encryptedScores;
    mapping(address => euint8) private encryptedUserRatings;
    
    // Constants
    uint256 public constant MIN_ENTRY_FEE = 0.001 ether;
    uint256 public constant MAX_LEAGUE_SIZE = 12;
    uint256 public constant DRAFT_ROUNDS = 8;

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Create a new fantasy league
     * @param _name League name
     * @param _entryFee Entry fee in wei
     * @param _maxPlayers Maximum number of players
     * @param _draftDeadline Draft deadline timestamp
     * @param _lineupDeadline Lineup submission deadline timestamp
     */
    function createLeague(
        string memory _name,
        uint256 _entryFee,
        uint256 _maxPlayers,
        uint256 _draftDeadline,
        uint256 _lineupDeadline
    ) external payable nonReentrant returns (uint256) {
        require(_entryFee >= MIN_ENTRY_FEE, "Entry fee too low");
        require(_maxPlayers <= MAX_LEAGUE_SIZE, "League too large");
        require(_maxPlayers >= 2, "League too small");
        require(_draftDeadline > block.timestamp, "Invalid draft deadline");
        require(_lineupDeadline > _draftDeadline, "Invalid lineup deadline");
        require(msg.value >= _entryFee, "Insufficient entry fee");

        uint256 leagueId = nextLeagueId++;
        League storage league = leagues[leagueId];
        
        league.name = _name;
        league.creator = msg.sender;
        league.entryFee = _entryFee;
        league.maxPlayers = _maxPlayers;
        league.currentPlayers = 1;
        league.totalPrizePool = _entryFee;
        league.isActive = true;
        league.draftDeadline = _draftDeadline;
        league.lineupDeadline = _lineupDeadline;
        league.participants[msg.sender] = true;

        emit LeagueCreated(leagueId, msg.sender, _name, _entryFee);
        return leagueId;
    }

    /**
     * @dev Join an existing league
     * @param _leagueId League ID to join
     */
    function joinLeague(uint256 _leagueId) external payable nonReentrant {
        League storage league = leagues[_leagueId];
        require(league.isActive, "League not active");
        require(!league.participants[msg.sender], "Already in league");
        require(league.currentPlayers < league.maxPlayers, "League full");
        require(block.timestamp < league.draftDeadline, "Draft deadline passed");
        require(msg.value >= league.entryFee, "Insufficient entry fee");

        league.participants[msg.sender] = true;
        league.currentPlayers++;
        league.totalPrizePool += league.entryFee;

        // Refund excess payment
        if (msg.value > league.entryFee) {
            payable(msg.sender).transfer(msg.value - league.entryFee);
        }
    }

    /**
     * @dev Draft a player (only during draft period)
     * @param _leagueId League ID
     * @param _playerId Player ID to draft
     * @param _round Draft round
     */
    function draftPlayer(
        uint256 _leagueId,
        uint256 _playerId,
        uint256 _round
    ) external nonReentrant {
        League storage league = leagues[_leagueId];
        require(league.participants[msg.sender], "Not in league");
        require(block.timestamp < league.draftDeadline, "Draft deadline passed");
        require(_round <= DRAFT_ROUNDS, "Invalid round");
        require(players[_playerId].isAvailable, "Player not available");
        require(league.draftedPlayers[_playerId] == address(0), "Player already drafted");

        league.draftedPlayers[_playerId] = msg.sender;
        players[_playerId].isAvailable = false;

        emit PlayerDrafted(_leagueId, msg.sender, _playerId, _round);
    }

    /**
     * @dev Submit encrypted lineup
     * @param _leagueId League ID
     * @param _lineupHash Hash of encrypted lineup data
     */
    function submitLineup(
        uint256 _leagueId,
        bytes32 _lineupHash
    ) external nonReentrant {
        League storage league = leagues[_leagueId];
        require(league.participants[msg.sender], "Not in league");
        require(block.timestamp >= league.draftDeadline, "Draft not finished");
        require(block.timestamp < league.lineupDeadline, "Lineup deadline passed");

        emit LineupSubmitted(_leagueId, msg.sender, _lineupHash);
    }

    /**
     * @dev Update encrypted player scores (only owner)
     * @param _playerId Player ID
     * @param _encryptedScore Encrypted score data
     */
    function updatePlayerScore(
        uint256 _playerId,
        euint32 _encryptedScore
    ) external onlyOwner {
        encryptedScores[_playerId] = _encryptedScore;
    }

    /**
     * @dev Update encrypted user rating
     * @param _encryptedRating Encrypted rating data
     */
    function updateUserRating(euint8 _encryptedRating) external {
        encryptedUserRatings[msg.sender] = _encryptedRating;
    }

    /**
     * @dev Calculate and distribute prizes (only after lineup deadline)
     * @param _leagueId League ID
     * @param _winner Winner address
     */
    function distributePrize(
        uint256 _leagueId,
        address _winner
    ) external onlyOwner nonReentrant {
        League storage league = leagues[_leagueId];
        require(block.timestamp >= league.lineupDeadline, "Lineup deadline not passed");
        require(league.participants[_winner], "Winner not in league");
        require(league.isActive, "League not active");

        league.isActive = false;
        uint256 prizeAmount = league.totalPrizePool;
        
        // Transfer prize to winner
        payable(_winner).transfer(prizeAmount);
        
        emit PrizeDistributed(_leagueId, _winner, prizeAmount);
    }

    /**
     * @dev Add a new player to the system
     * @param _name Player name
     * @param _position Player position
     * @param _basePrice Base price for the player
     */
    function addPlayer(
        string memory _name,
        string memory _position,
        uint256 _basePrice
    ) external onlyOwner {
        uint256 playerId = nextPlayerId++;
        players[playerId] = Player({
            name: _name,
            position: _position,
            basePrice: _basePrice,
            isAvailable: true
        });
    }

    /**
     * @dev Get league information
     * @param _leagueId League ID
     */
    function getLeagueInfo(uint256 _leagueId) external view returns (
        string memory name,
        address creator,
        uint256 entryFee,
        uint256 maxPlayers,
        uint256 currentPlayers,
        uint256 totalPrizePool,
        bool isActive,
        uint256 draftDeadline,
        uint256 lineupDeadline
    ) {
        League storage league = leagues[_leagueId];
        return (
            league.name,
            league.creator,
            league.entryFee,
            league.maxPlayers,
            league.currentPlayers,
            league.totalPrizePool,
            league.isActive,
            league.draftDeadline,
            league.lineupDeadline
        );
    }

    /**
     * @dev Check if user is in league
     * @param _leagueId League ID
     * @param _user User address
     */
    function isUserInLeague(uint256 _leagueId, address _user) external view returns (bool) {
        return leagues[_leagueId].participants[_user];
    }

    /**
     * @dev Get user's drafted players
     * @param _leagueId League ID
     * @param _user User address
     */
    function getUserDraftedPlayers(uint256 _leagueId, address _user) external view returns (uint256[] memory) {
        return leagues[_leagueId].userLineup[_user];
    }

    /**
     * @dev Emergency withdraw (only owner)
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    /**
     * @dev Receive function to accept ETH
     */
    receive() external payable {}
}
