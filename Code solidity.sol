// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DelayInsurance {
    struct Claim {
        uint256 claimId;
        address user;
        uint256 amount;
        bool isPaid;
        uint256 delayTime;
        string status; // Pending, Approved, Rejected
    }

    struct User {
        string name;
        address wallet;
    }

    address public admin;
    mapping(address => User) public users;
    mapping(uint256 => Claim) public claims;
    mapping(address => uint256[]) public userClaims;

    uint256 public claimCounter;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    event UserRegistered(address indexed user, string name);
    event ClaimSubmitted(uint256 indexed claimId, address indexed user, uint256 amount);
    event ClaimApproved(uint256 indexed claimId);
    event ClaimRejected(uint256 indexed claimId, string reason);

    constructor() {
        admin = msg.sender; // Assign contract deployer as admin
    }

    function registerUser(string memory _name) public {
        require(bytes(_name).length > 0, "Invalid name");
        require(users[msg.sender].wallet == address(0), "User already registered");
        users[msg.sender] = User(_name, msg.sender);
        emit UserRegistered(msg.sender, _name);
    }

    function submitClaim(uint256 _amount, uint256 _delayTime) public {
        require(users[msg.sender].wallet != address(0), "User not registered");
        require(_amount > 0, "Invalid amount");
        require(_delayTime > 0, "Invalid delay time");

        claims[claimCounter] = Claim({
            claimId: claimCounter,
            user: msg.sender,
            amount: _amount,
            isPaid: false,
            delayTime: _delayTime,
            status: "Pending"
        });

        userClaims[msg.sender].push(claimCounter);

        emit ClaimSubmitted(claimCounter, msg.sender, _amount);
        claimCounter++;
    }

    function approveClaim(uint256 _claimId) public onlyAdmin {
        Claim storage claim = claims[_claimId];
        require(keccak256(bytes(claim.status)) == keccak256(bytes("Pending")), "Already processed");
        claim.isPaid = true;
        claim.status = "Approved";
        payable(claim.user).transfer(claim.amount);
        emit ClaimApproved(_claimId);
    }

    function rejectClaim(uint256 _claimId, string memory _reason) public onlyAdmin {
        Claim storage claim = claims[_claimId];
        require(keccak256(bytes(claim.status)) == keccak256(bytes("Pending")), "Already processed");
        claim.status = "Rejected";
        emit ClaimRejected(_claimId, _reason);
    }

    function getUserClaims(address _user) public view returns (uint256[] memory) {
        return userClaims[_user];
    }

    function fundContract() public payable {}
}
