pragma solidity >=0.4.22 <0.8.0;

import "./tools/Ownable.sol";
import "./tools/ExternalAccessible.sol";
import "./tools/SafeMath.sol";
import "./tools/DataStorage.sol";
import "./wXEQ.sol";

contract SoftStaking is ExternalAccessible, Ownable {
    
    using SafeMath for *;
    DataStorage public dataStorage;
    wXEQ public wXEQContract;
    event Enter(address indexed user, uint256 amount);
    event Leave(address indexed user, uint256 amount);
    event WithdrawRewards(address indexed user, uint256 amount);

    struct UserInfo {
        uint256 amount;
        uint256 stakingBlock;
    }

    uint256 public blockReward;

    uint256 public totalStaked;

    mapping (address => UserInfo) public userInfo;

    constructor(address _wxeq, address _dataStorage, address _master) public {

        wXEQContract = wXEQ(_wxeq);
        dataStorage = DataStorage(_dataStorage);
        blockReward = (11.mul(10.pow(16)));  // .11 wXEQ per block
        masterContract = _master;
    }

    function changeStakingReward(uint256 _reward) public onlyOwner returns (bool) {
        require(_reward <= (50.mul(10.pow(16)))); //.5 wXEQ max
        blockReward = _reward;
    }

    // Get user pending reward. May be outdated until someone calls cleanup.
    function getPendingReward(address _user) public view returns (uint256) {
        UserInfo storage user = userInfo[_user];
        uint256 user_time = block.number - user.stakingBlock;
        uint256 baseReward = user.amount.mul(10.pow(18)).div(totalStaked).mul(blockReward);

        return baseReward.mul(user_time).div(1e18);
    }

    function getFeeReward(address _user) public view returns (uint256) {
        UserInfo storage user = userInfo[_user];
        uint256 user_time = block.number - user.stakingBlock;
        uint256 fees = dataStorage.balanceOf(address(this));
        uint256 my_fees = user.amount.mul(10.pow(18)).div(totalStaked).mul(fees);

        if (user_time <= 6520.mul(3)) {
            my_fees = 0;
        }
        return my_fees.div(1e18);
    }

    function enter(uint256 _amount) public {
        require(dataStorage.balanceOf(msg.sender) >= _amount);
        require(dataStorage.allowance(msg.sender, address(this)) >= _amount);
        require(msg.sender != address(0));

        wXEQContract._burnFrom(msg.sender, _amount);
        totalStaked = totalStaked.add(_amount);
        UserInfo storage user = userInfo[msg.sender];
        user.amount = user.amount.add(_amount);

        if (user.stakingBlock == 0)  {
            user.stakingBlock = block.number;
        }

        emit Enter(msg.sender, _amount);
    }

    function leave(uint256 _amount) public {
        UserInfo storage user = userInfo[msg.sender];
        require(user.amount > 0);

        user.amount = user.amount.sub(_amount);
        user.stakingBlock = 0;
        totalStaked = totalStaked.sub(_amount);
        
        uint256 base_reward = getPendingReward(msg.sender);
        uint256 fee_reward = getFeeReward(msg.sender);
        require(base_reward > 0);
        user.stakingBlock = block.number;
        wXEQContract.mint(msg.sender, base_reward);
        if (fee_reward > 0) {
            wXEQContract.transfer(msg.sender, fee_reward);
        }
        emit Leave(msg.sender, _amount);
    }

    function withdrawRewards() public {
        UserInfo storage user = userInfo[msg.sender];
        require(user.amount > 0);
        uint256 base_reward = getPendingReward(msg.sender);
        uint256 fee_reward = getFeeReward(msg.sender);
        require(base_reward > 0);
        user.stakingBlock = block.number;
        wXEQContract.mint(msg.sender, base_reward);
        if (fee_reward > 0) {
            wXEQContract.transfer(msg.sender, fee_reward);
        }
        emit WithdrawRewards(msg.sender, base_reward.add(fee_reward));
    }

}

// todo - finish staking validation - soft staking - node staking rewards after input - staking pool - staking multiplier