pragma solidity >=0.4.22 <0.8.0;

import "./ExternalAccessible.sol";
import "./SafeMath.sol";
import "./DataStorage.sol";
import "./wXEQ.sol";
import "./wXEQSwaps.sol";
import "./OracleTask.sol";
import "./Oracle.sol";

contract OracleMaster is ExternalAccessible {
    
    using SafeMath for *;
    
    DataStorage dataStorage;
    address[] oracles;
    uint256 oracleNum;
    uint256 inputReward;
    address[] approvedValidator;
    wXEQ wXEQContract;
    XEQSwaps swapContract;
    mapping(address => uint256) owedRewards;
    mapping(address => address) oracleOwner;
    bool isCentralized;
    
    constructor(DataStorage d, address w) {
        dataStorage = d;
        oracleNum = 0;
        masterContract = msg.sender;
        approvedValidator.push(address(this));
        wXEQContract = wXEQ(w);
        inputReward = 10.mul(10.pow(18));
        isCentralized = true;
    }
    
    function updateSwapContract(address addy) public hasAccess returns (bool) {
        swapContract = XEQSwaps(addy);
        assert(addy == address(swapContract));
        return true;
    }
    
    function switchCentralized(bool status) public hasAccess returns (bool) {
        isCentralized = status;
        return true;
    }
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    
    function isValidator(address addy) public view returns (bool) {
        for (uint i = 0; i < approvedValidator.length; i++) {
            if (addy == approvedValidator[i]) {
                return true;
            }
        }
        return false;
    }
    
    function createTask(string memory name) public returns (address) {
        OracleTask t = new OracleTask(name, msg.sender);
        assert(keccak256(bytes(t.getName())) == keccak256(bytes(name)));
        return address(t);
    }
    
    function newOracle() public returns (bool) {
        if (isCentralized) {
            require(checkAccess());
        }
        require(dataStorage.balanceOf(msg.sender) >= dataStorage.stakingRequirement());
        Oracle oracle = new Oracle(msg.sender, address(masterContract));
        dataStorage.addNode(address(oracle));
        oracles.push(address(oracle));
        oracleOwner[address(oracle)] = msg.sender;
        bool success = wXEQContract.transferFrom(msg.sender, address(oracle), dataStorage.stakingRequirement());
        require(success);
        return true;
    }
    
    function claimRewards(address node) public returns (bool, uint256) {
        require(oracleOwner[node] == msg.sender);
        require(owedRewards[node] != 0);
        uint256 amount = owedRewards[node];
        wXEQContract.mint(msg.sender, amount);
        owedRewards[node] = 0;
        assert(owedRewards[node] == 0);
    }
    
    function removeOracle() external returns (bool) {
        require(dataStorage.isValidNode(msg.sender));
        dataStorage.removeNode(msg.sender);

        return true;
    }
    
    function getOracleNum() public view returns (uint256) {
        return oracleNum;
    }
    
    function getCurrentOracle() public view returns (address) {
        return oracles[oracleNum];
    }
    
    function incrementOracleNum() public returns (bool) {
        require(dataStorage.isValidNode(msg.sender));
        if (oracleNum >= oracles.length) {
            oracleNum = 0;
        } else {
            oracleNum = oracleNum.add(1);
        }
        return true;
    }
    
    function sendNumberData(address task, uint256 val) public returns (bool) {
        require(msg.sender == oracles[oracleNum]);
        owedRewards[msg.sender] = owedRewards[msg.sender].add(inputReward);
        incrementOracleNum();
        OracleTask(task).setTrustedAnwserNumber(val);
        assert(OracleTask(task).trustedAnwserNumber() == val);
        return true;
    }
    
    function sendStringData(address task, string memory val) public returns (bool) {
        require(msg.sender == oracles[oracleNum]);
        owedRewards[msg.sender] = owedRewards[msg.sender].add(inputReward);
        incrementOracleNum();
        OracleTask(task).setTrustedAnwserString(val);
        assert(keccak256(bytes(OracleTask(task).trustedAnwserString())) == keccak256(bytes(val)));
        return true;
    }
    
    function sendBoolData(address task, bool val) public returns (bool) {
        require(msg.sender == oracles[oracleNum]);
        owedRewards[msg.sender] = owedRewards[msg.sender].add(inputReward);
        incrementOracleNum();
        OracleTask(task).setTrustedAnwserBool(val);
        assert(OracleTask(task).trustedAnwserBool() == val);
        return true;
    }
    
     function sendSwapData(string calldata method, address task, uint256 val) external returns (bool) {
        require(msg.sender == oracles[oracleNum]);
        owedRewards[msg.sender] = owedRewards[msg.sender].add(inputReward);
        incrementOracleNum();
        bytes memory payload = abi.encodeWithSignature(method, val);
        (bool success, bytes memory returnData) = address(task).call(payload);
        require(success);
        return true;
    }
}