pragma solidity >=0.4.22 <0.8.0;

import "./tools/SafeMath.sol";
import "./tools/DataStorage.sol";
import "./wXEQ.sol";

contract SoftStaking is ExternalAccessible {

    using SafeMath for *;
    DataStorage public dataStorage;
    wXEQ public wXEQContract;

    struct UserInfo {
        uint256 amount;
        uint256 share;
        uint256 rewardDebt;
    }

    uint256 rewardPerBlock;

    uint256 public accSushiPerShare;
    uint256 public ackSushiBalance;
    uint256 public totalShares;
    uint256 public dailyReward;
    uint256 lastMultiplerProcessBlock;
    uint256 reductionPerBlock;
    uint256 multiplier;
    mapping (address => UserInfo) public userInfo;

    mapping (uint8 => uint256) public extraEpochReward;
    mapping (uint256 => uint256) public stakingbonuses;

    uint256 public epoch;
    constructor(address _wxeq, address _dataStorage) public {

        wXEQContract = wXEQ(_wxeq);
        dataStorage = DataStorage(_dataStorage);
        masterContract = msg.sender;
        epoch = 1;
        dailyReward = (11.mul(10.pow(16))); // .11 wXEQ per block
        lastMultiplerProcessBlock = block.number;
        reductionPerBlock = 999999390274979584 ;
        multiplier = 1e18;
    }

    event Enter(address indexed user, uint256 amount);
    event Leave(address indexed user, uint256 amount);

    function cleanup() public {
        // Update multiplier

        if (epoch > 1) {
            if (stakingbonuses[block.number] >= block.number + 6532) {

            }
        }

        uint256 reductionTimes = block.number.sub(lastMultiplerProcessBlock);
        uint256 fraction = 1e18;
        uint256 acc = reductionPerBlock;
        while (reductionTimes > 0) {
            if (reductionTimes & 1 != 0) {
                fraction = fraction.mul(acc).div(1e18);
            }
            acc = acc.mul(acc).div(1e18);
            reductionTimes = reductionTimes / 2;
        }
        multiplier = multiplier.mul(fraction).div(1e18);
        lastMultiplerProcessBlock = block.number;
        // Update accSushiPerShare / ackSushiBalance
        if (totalShares > 0) {
            uint256 additionalSushi = wXEQContract.balanceOf(address(this)).sub(ackSushiBalance);
            accSushiPerShare = accSushiPerShare.add(additionalSushi.mul(1e12).div(totalShares));
            ackSushiBalance = ackSushiBalance.add(additionalSushi);
        }
    }

    function createStakingBonus(uint256 starting_block, uint256 end_block, uint256 _amount) public {
        require(starting_block > block.number);
        require(end_block >= block.number + 6532); //Must be atleast 1 day's worth


    }

    // Get user pending reward. May be outdated until someone calls cleanup.
    function getPendingReward(address _user) public view returns (uint256) {
        UserInfo storage user = userInfo[_user];
        return user.share.mul(accSushiPerShare).div(1e12).sub(user.rewardDebt);
    }

    // Enter the restaurant. Pay some SUSHIs. Earn some shares.
    function enter(uint256 _amount) public {
        cleanup();
        // safeSushiTransfer(msg.sender, getPendingReward(msg.sender));
        wXEQContract.transferFrom(msg.sender, address(this), _amount);
        ackSushiBalance = ackSushiBalance.add(_amount);
        UserInfo storage user = userInfo[msg.sender];
        uint256 moreShare = _amount.mul(multiplier).div(1e18);
        user.amount = user.amount.add(_amount);
        totalShares = totalShares.add(moreShare);
        user.share = user.share.add(moreShare);
        user.rewardDebt = user.share.mul(accSushiPerShare).div(1e12);
        emit Enter(msg.sender, _amount);
    }

    // Leave the restaurant. Claim back your SUSHIs.
    function leave(uint256 _amount) public {
        cleanup();
        safeSushiTransfer(msg.sender, getPendingReward(msg.sender));
        UserInfo storage user = userInfo[msg.sender];
        uint256 lessShare = user.share.mul(_amount).div(user.amount);
        user.amount = user.amount.sub(_amount);
        totalShares = totalShares.sub(lessShare);
        user.share = user.share.sub(lessShare);
        user.rewardDebt = user.share.mul(accSushiPerShare).div(1e12);
        safeSushiTransfer(msg.sender, _amount);
        emit Leave(msg.sender, _amount);
    }

    // Safe sushi transfer function, just in case if rounding error causes pool to not have enough SUSHIs.
    function safeSushiTransfer(address _to, uint256 _amount) internal {
        uint256 sushiBal = wXEQContract.balanceOf(address(this));
        if (_amount > sushiBal) {
            wXEQContract.mint(address(this), _amount.sub(sushiBal));
            wXEQContract.transfer(_to, sushiBal);
            ackSushiBalance = ackSushiBalance.sub(sushiBal);
        } else if (_amount > 0) {
            wXEQContract.transfer(_to, _amount);
            ackSushiBalance = ackSushiBalance.sub(_amount);
        }
    }

}