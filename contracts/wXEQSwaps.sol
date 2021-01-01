pragma solidity >=0.4.22 <0.8.0;

import "./ExternalAccessible.sol";
import "./Ownable.sol";
import "./SafeMath.sol";
import "./wXEQ.sol";
import "./wXEQStaking.sol";
import "./OracleMaster.sol";

contract XEQSwaps is ExternalAccessible, Ownable {
    using SafeMath for *;
    
    wXEQ wXEQContract;
    DataStorage dataStorage;
    SoftStaking stakingPool;
    OracleMaster oracleContract;
    
    uint256 wXEQMinted;
    uint256 XEQMinted;
    uint256 teamAmount;
    uint256 burntAmount;
    uint256 stakePoolAmount;
    uint256 devFeePercent;

    address[] mintXEQBatchList;
    mapping(address => uint256[]) amountToMint;
    mapping(address => string[]) xeqAddress;
    mapping(address => bool[]) swapComplete;
    bool swapBacks;
    
    constructor(address w, address d, address s, address o) {
        wXEQContract = wXEQ(w);
        dataStorage = DataStorage(d);
        stakingPool = SoftStaking(s);
        masterContract = msg.sender;
        oracleContract = OracleMaster(o);
        wXEQMinted = 0;
        XEQMinted = 0;
        transferOwnership(o);
        teamAmount = 1000;
        burntAmount = 5000;
        stakePoolAmount = 4000;
        devFeePercent = 50;
    }
    
    event NewMint(address indexed account, uint256 amount, uint256 devFee, uint256 amountBurnt, uint256 amountForStakePool);

    function getXEQBatchLen() public view returns (uint256) {
        return mintXEQBatchList.length;
    }
    
    function acitvateSwapBack(bool setting) public hasAccess returns (bool) {
        swapBacks = setting;
        return true;
    }
    
    function checkBatchAccount(address account, uint256 index) public view returns (bool status, string memory XEQAddress, uint256 amount) {
        require(index < amountToMint[account].length);
        return (swapComplete[account][index], xeqAddress[account][index], amountToMint[account][index]);
    }
    
    function updateOracleContract(address cont) public hasAccess returns (bool) {
        oracleContract = OracleMaster(cont);
        return true;
    }
    
    function devFee(uint256 _value, uint256 devFeeVal1) public pure returns (uint256) {
        require(_value >= ((_value.mul(devFeeVal1)).div(10000)));
        return ((_value.mul(devFeeVal1)).div(10000));
    }
    
    function mintwXEQ(address account, uint256 amount) public onlyOwner returns (bool) {
        uint256 fee = devFee(amount, devFeePercent);
        uint256 teamFee = devFee(fee, teamAmount);
        uint256 burnt = devFee(fee, burntAmount);
        uint256 stakeAmount = devFee(fee, stakePoolAmount);
        wXEQContract.mint(account, amount.sub(fee));
        wXEQContract.mint(owner(), teamFee);
        wXEQContract.mint(address(stakingPool), stakeAmount);
        emit NewMint(account, amount, teamFee, burnt, stakeAmount);
        return true;
    }
    
    function testDevFeeVals(uint256 _value, uint256 val1, uint256 val2) public pure returns (uint256) {
        return (_value.mul(val1)).div(val2);
    }
    
    function setDevFee(uint256 val) public hasAccess returns (bool) {
        devFeePercent = val;
        assert(devFeePercent == val);
        return true;
    }
    
    function devFee(uint _value) public view returns (uint256) {
        require(_value >= ((_value.mul(devFeePercent)).div(10000)));
        return ((_value.mul(devFeePercent)).div(10000));
    }
    
    function mintXEQRequest(string memory account, uint256 amount) public returns (bool, uint256) {
        require(swapBacks);
        wXEQContract._burnFrom(msg.sender, amount);
        swapComplete[msg.sender].push(false);
        amountToMint[msg.sender].push(amount);
        xeqAddress[msg.sender].push(account);
        require(swapComplete[msg.sender].length == amountToMint[msg.sender].length);
        require(amountToMint[msg.sender].length == swapComplete[msg.sender].length);
        return (true, amount);
    }
    
    function confirmXEQSwap(address account, uint256 amount, uint256 swapNum) public onlyOwner returns (bool) {
        require(swapComplete[account].length.sub(1) >= swapNum);
        require(amount == amountToMint[account][swapNum]);
        swapComplete[account][swapNum] = true;
        bool check = false;
        for (uint i = 0; i < swapComplete[account].length; i++) {
            if (!swapComplete[account][i]) {
                check = true;
                break;
            }
        }
        if (!check) {
            for (uint k = 0; k < mintXEQBatchList.length; k++) {
                if (mintXEQBatchList[k] == account) {
                    delete mintXEQBatchList[k];
                    break;
                }
            }
        }
        return true;
    }
}