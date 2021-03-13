
pragma solidity >=0.4.22 <0.8.0;

import "./tools/Ownable.sol";
import "./tools/SafeMath.sol";
import "./tools/DataStorage.sol";
import "./wXEQ.sol";
import "./tools/ERC20.sol";
import "./tools/IERC20.sol";
import "./tools/SafeERC20.sol";

contract SoftStakingv2 is Ownable {

    using SafeMath for *;
    using SafeERC20 for IERC20;

    DataStorage public dataStorage;
    wXEQ public wXEQContract;
    event Enter(address indexed user, uint256 amount);
    event Leave(address indexed user, uint256 amount);
    event WithdrawRewards(address indexed user, uint256 amount);

    struct UserInfo {
        uint256 amount;
        uint256 stakingBlock;
        uint256 claimedBalance;
    }

    uint256 public blockReward;

    uint256 public totalStaked;

    mapping (address => UserInfo) public userInfo;

    constructor(address _wxeq, address _dataStorage, address _master) public {

        wXEQContract = wXEQ(_wxeq);
        dataStorage = DataStorage(_dataStorage);
        blockReward = (11.mul(10.pow(16)));  // .11 wXEQ per block
        transferOwnership(_master);
    }

    function changeStakingReward(uint256 _reward) public onlyOwner {
        blockReward = _reward;
    }

    function getPendingReward(address _user) public view returns (uint256) {
        UserInfo storage user = userInfo[_user];
        if (user.amount == 0) {
            return 0;
        }
        uint256 user_time = block.number - user.stakingBlock;
        uint256 baseReward = user.amount.mul(10.pow(18)).div(totalStaked).mul(blockReward);

        return baseReward.mul(user_time).div(1e18).add(user.claimedBalance);
    }

    function enter(uint256 _amount) public {
        require(msg.sender != address(0));

        IERC20 pair = IERC20(0xC76ff45757091b2A718dA1C48a604dE6cbec7F71);
        require(pair.balanceOf(msg.sender) >= _amount);
        require(pair.allowance(msg.sender, address(this)) >= _amount);

        pair.transferFrom(msg.sender, address(this), _amount);
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

        uint256 base_reward = getPendingReward(msg.sender);
        IERC20 token = IERC20(0xC76ff45757091b2A718dA1C48a604dE6cbec7F71);

        user.amount = user.amount.sub(_amount);
        user.stakingBlock = 0;
        totalStaked = totalStaked.sub(_amount);
        require((token.balanceOf(address(this))) >= _amount);
        wXEQContract.mint(msg.sender, base_reward);
        token.transfer(msg.sender, _amount);
        emit Leave(msg.sender, _amount);
    }

    function withdrawRewards() public {
        UserInfo storage user = userInfo[msg.sender];
        require(user.amount > 0);
        uint256 base_reward = getPendingReward(msg.sender);
        require(base_reward > 0);
        user.stakingBlock = block.number;
        user.claimedBalance = 0;
        wXEQContract.mint(msg.sender, base_reward);
        emit WithdrawRewards(msg.sender, base_reward);
    }

    function lockRewards() public {
        UserInfo storage user = userInfo[msg.sender];
        require(user.amount > 0);
        uint256 base_reward = getPendingReward(msg.sender);
        require(base_reward > 0);
        user.stakingBlock = block.number;
        user.claimedBalance = user.claimedBalance.add(base_reward);
    }

}
