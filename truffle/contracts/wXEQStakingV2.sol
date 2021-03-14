
pragma solidity >=0.4.22 <0.8.0;

import "./tools/Ownable.sol";
import "./tools/SafeMath.sol";
import "./tools/DataStorage.sol";
import "./wXEQ.sol";
import "./tools/ERC20.sol";
import "./tools/IERC20.sol";
import "./tools/SafeERC20.sol";

contract SoftStakingV2 is Ownable {
    
    using SafeMath for *;
    using SafeERC20 for IERC20;
    
    wXEQ public wXEQContract;
    event Enter(address indexed user, uint256 amount);
    event Leave(address indexed user, uint256 amount);
    event WithdrawRewards(address indexed user, uint256 amount);

    struct UserInfo {
        uint256 amount;
        uint256 stakingBlock;
        uint256 claimedBalance;
        uint256 initialStakeBlock;
    }

    uint256 public blockReward;
    uint256 public multiplierBlockEnd;
    uint256 public multiplier;
    uint256 public lockPeriod;
    uint256 public totalStaked;
    address public lp_address;

    mapping (address => UserInfo) public userInfo;

    constructor(address _master, address _wxeq) public {

        wXEQContract = wXEQ(_wxeq);
        blockReward = (11.mul(10.pow(16)));  // .11 wXEQ per block
        multiplier = 50;
        multiplierBlockEnd = block.number.add(6520.mul(30));
        lockPeriod = 6520.mul(30);
        transferOwnership(_master);
    }

    function changeStakingReward(uint256 _reward) public onlyOwner returns (bool) {
        blockReward = _reward;
    }

    function changeMultiplier(uint256 _mult) public onlyOwner {
        multiplier = _mult;
    }

    function changeMultiplierBlockEnd(uint256 _blockEnd) public onlyOwner {
        multiplierBlockEnd = _blockEnd;
    }
    
    function changeLockPeriod(uint256 _lockPeriod) public onlyOwner {
        lockPeriod = _lockPeriod;
    }
    
    function changeLPAddress(address _lpAddress) public onlyOwner {
        lp_address = _lpAddress;
    }

    function getPendingReward(address _user) public view returns (uint256) {
        UserInfo storage user = userInfo[_user];
        if (user.amount == 0) {
            return 0;
        }
        require(user.stakingBlock != 0);
        uint256 user_time = block.number - user.stakingBlock;
        uint256 baseReward = block.number <= multiplierBlockEnd ? user.amount.mul(10.pow(18)).div(totalStaked).mul(blockReward.mul(multiplier)) : user.amount.mul(10.pow(18)).div(totalStaked).mul(blockReward);
   
        return baseReward.mul(user_time).div(1e18);
    }

    function enter(uint256 _amount) public {
        require(msg.sender != address(0));

        IERC20 pair = IERC20(0xBEA36A22c20C763958632150d7a245226A2aF4A4);
        require(pair.balanceOf(msg.sender) >= _amount);
        require(pair.allowance(msg.sender, address(this)) >= _amount);

        pair.transferFrom(msg.sender, address(this), _amount);
        totalStaked = totalStaked.add(_amount);
        UserInfo storage user = userInfo[msg.sender];
        
        if(user.amount != 0)
        {
            lockRewards();
        } else {
            user.initialStakeBlock = block.number;
        }
        
        user.amount = user.amount.add(_amount);
        user.stakingBlock = block.number;
        emit Enter(msg.sender, _amount);
    }

    function leave(uint256 _amount) public {
        UserInfo storage user = userInfo[msg.sender];
        require(user.amount > 0);
        IERC20 token = IERC20(lp_address);
        withdrawRewards();
        user.amount = user.amount.sub(_amount);
        totalStaked = totalStaked.sub(_amount);
        require((token.balanceOf(address(this))) >= _amount);
        token.transfer(msg.sender, _amount);
        emit Leave(msg.sender, _amount);
    }

    function withdrawRewards() public {
        UserInfo storage user = userInfo[msg.sender];
        require(user.amount > 0);
        require(block.number >= user.initialStakeBlock.add(lockPeriod));
        uint256 base_reward = getPendingReward(msg.sender);
        require(base_reward > 0);
        user.stakingBlock = block.number;
        user.claimedBalance = 0;
        wXEQContract.mint(msg.sender, base_reward);
        emit WithdrawRewards(msg.sender, base_reward);
    }
    
    function emergencyWithdraw() public {
        UserInfo storage user = userInfo[msg.sender];
        require(user.amount > 0);
        user.claimedBalance = 0;
        user.stakingBlock = 0;
        uint256 withdrawAmount = user.amount;
        user.amount = 0;
        IERC20 token = IERC20(lp_address);
        require((token.balanceOf(address(this))) >= withdrawAmount);
        token.transfer(msg.sender, withdrawAmount);
        emit Leave(msg.sender, withdrawAmount);
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