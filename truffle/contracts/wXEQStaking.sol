pragma solidity >=0.4.22 <0.8.0;

import "./tools/SafeMath.sol";
import "./tools/DataStorage.sol";
import "./wXEQ.sol";

contract SoftStaking {
    
    using SafeMath for *;
    DataStorage public dataStorage;
    wXEQ public wXEQContract;

    struct UserInfo {
        uint256 amount;
        uint256 stakingBlock;
    }

    uint256 blockReward;

    uint256 public totalStaked;

    mapping (address => UserInfo) public userInfo;

    constructor(address _wxeq, address _dataStorage) public {

        wXEQContract = wXEQ(_wxeq);
        dataStorage = DataStorage(_dataStorage);
        blockReward = (11.mul(10.pow(16)));  // .11 wXEQ per block
    }

    function changeStakingReward(uint256 _reward) public onlyOwner {
        require(_reward <= (50.mul(10.pow(16)))); //.5 wXEQ max
        blockReward = _reward;
    }

    // Get user pending reward. May be outdated until someone calls cleanup.
    function getPendingReward(address _user) public view returns (uint256) {
        UserInfo storage user = userInfo[_user];
        uint256 user_share = user.amount.div(totalStaked);
        uint256 user_time = block.number - user.stakingBlock;
        uint256 fees = dataStorage.balanceOf(address(this));
        uint256 my_fees = fees.div(user_share);

        //Must be in pool for 3 days to claim oracle fees.
        if (user_time <= 6520.mul(3)) {
            my_fees = 0;
        }

        uint256 base_reward = blockReward.mul(user_time).div(user_share);
        return base_reward.add(my_fees);
    }

    // Enter the restaurant. Pay some SUSHIs. Earn some shares.
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

    // Leave the restaurant. Claim back your SUSHIs.
    function leave(uint256 _amount) public {
        UserInfo storage user = userInfo[msg.sender];
        require(getPendingReward(msg.sender) > 0);
        require(user.amount > 0);
        user.amount = user.amount.sub(_amount);
        user.stakingBlock = 0;
        totalStaked = totalStaked.sub(_amount);
        wXEQContract.mint(msg.sender, getPendingReward(msg.sender));
        wXEQContract.mint(msg.sender, _amount);
        emit Leave(msg.sender, _amount);
    }

}

// todo - finish staking validation - soft staking - node staking rewards after input - staking pool - staking multiplier