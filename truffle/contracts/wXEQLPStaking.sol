import "./tools/Ownable.sol";
import "./tools/SafeMath.sol";
import "./tools/DataStorage.sol";
import "./wXEQ.sol";
import "./tools/SafeERC20.sol";

contract LPStaking is Ownable {

    using SafeMath for *;
    using SafeERC20 for IERC20;

    DataStorage public dataStorage;
    wXEQ public wXEQContract;

    event Enter(address indexed user, uint256 amount);
    event Leave(address indexed user, uint256 amount);
    event WithdrawRewards(address indexed user, uint256 amount);

    struct UserInfo {
        mapping(uint256 => uint256) amount;
        mapping(uint256 => uint256) equity;
        uint256 stakingBlock;
        uint256 claimBlock;
    }

    struct Pool {
        address lp_contract;
        uint256 weight;
        uint256 totalStaked;
        uint256 totalEquity;
        uint256 stakers;
    }

    uint256 public lastStakingClaimBlock;
    uint256 public thisStakingClaimBlock;
    uint256 public nextStakingClaimBlock;
    uint256 public stakingRewardClaimBlocks;
    uint256 public distanceBetweenClaimBlocks;

    uint256 public oracleFees;
    uint256 public emission;
    uint256 public emissionmMultiplier;

    uint256 public blockClaimWindow;
    uint256 public epochWindow;

    mapping (address => UserInfo) public userInfo;
    mapping (uint256 => Pool) public pools;

    constructor(address _wxeq, address _dataStorage, address _master) public {
        wXEQContract = wXEQ(_wxeq);
        dataStorage = DataStorage(_dataStorage);
        emission = 720.mul(10.pow(18)); // .11 * 6520 * 28
        emissionmMultiplier = 50.mul(10.pow(18)); // 1M in added coins for first month

        blockClaimWindow = 70;
        epochWindow = 276;

        thisStakingClaimBlock = block.number.add(6520.mul(blockClaimWindow));
        lastStakingClaimBlock = thisStakingClaimBlock;
        Pool storage pool = pools[0];
        pool.lp_contract = address(0xBEA36A22c20C763958632150d7a245226A2aF4A4);
        pool.weight = 30;
        // transferOwnership(_master);
    }

    //setters

    function changeEmission(uint256 _emission) public onlyOwner returns (bool) {
        emission = _emission;
    }

    function changeEmissionMulitplier(uint256 _emissionMultiplier) public onlyOwner returns (bool) {
        emissionmMultiplier = _emissionMultiplier;
    }

    function changeBlockClaimWindow(uint256 _blockClaimWindow) public onlyOwner returns (bool) {
        blockClaimWindow = _blockClaimWindow;
    }

    function changeMaxMonthly(uint256 _MaxMonthly) public onlyOwner returns (bool) {
        blockClaimWindow = _MaxMonthly;
    }

    function changeEpochWindow(uint256 _epochWindow) public onlyOwner returns (bool) {
        epochWindow = _epochWindow;
    }

    //getters

    // Get the pending rewards based on the stakers and amounts at this block.
    function getPendingReward(address _user, uint256 _index) public view returns (uint256) {
        UserInfo storage user = userInfo[_user];
        if (user.equity[_index] == 0) {
            return 0;
        }
        Pool storage pool = pools[_index];
        return (user.equity[_index].mul(10.pow(18)).div(pool.totalEquity)).mul(emission.mul(pool.weight)).mul(thisStakingClaimBlock.sub(user.stakingBlock)).div(1e20);
    }

    function getFeeReward(address _user, uint256 _index) public view returns (uint256) {
        UserInfo storage user = userInfo[_user];
        if (user.equity[_index] == 0) {
            return 0;
        }
        Pool storage pool = pools[_index];
        return (user.equity[_index].mul(10.pow(18)).div(pool.totalEquity)).mul(oracleFees.mul(pool.weight)).mul(thisStakingClaimBlock.sub(user.stakingBlock)).div(1e20);
    }

    //functions

    function addPool(address _lpcontract, uint256 _weight, uint256 pool_index) public onlyOwner returns (bool) {
        require(_weight > 0);
        require(_lpcontract != address(0));

        Pool storage pool = pools[pool_index];
        pool.lp_contract = _lpcontract;
        pool.weight = _weight;
        return true;
    }

    function removePool(uint256 pool_index) public onlyOwner returns (bool) {
        require(pools[pool_index].weight != 0);
        delete pools[pool_index];
        return true;
    }

    function addOracleFee(uint256 _amount) public {
        require(wXEQContract.balanceOf(msg.sender) >= _amount);
        require(wXEQContract.allowance(msg.sender, address(this)) >= _amount);

        wXEQContract.transferFrom(msg.sender, address(this), _amount);
        oracleFees = oracleFees.add(_amount);
    }

    //enter with wxeq
    function enter(uint256 _amount) public returns (bool) {
        require(dataStorage.balanceOf(msg.sender) >= _amount);
        require(dataStorage.allowance(msg.sender, address(this)) >= _amount);
        require(msg.sender != address(0));

        Pool storage pool = pools[0];

        wXEQContract.transferFrom(msg.sender, address(this), _amount);
        pool.totalStaked = pool.totalStaked.add(_amount);
        UserInfo storage user = userInfo[msg.sender];
        user.amount[0] = user.amount[0].add(_amount);
        pool.stakers = pool.stakers.add(1);

        uint256 acceptableToEnter = thisStakingClaimBlock.sub(6520.mul(blockClaimWindow));

        if (!(block.number <= acceptableToEnter)) {
            return false;
        }

        if (user.stakingBlock != 0)  {
            user.stakingBlock = block.number;
        }

        emit Enter(msg.sender, _amount);
    }

    function enterLP(uint256 _amount, uint256 index) public returns (bool) {
        require(msg.sender != address(0));

        Pool storage pool = pools[index];
        require(pool.lp_contract != address(0));
        require(pool.weight != 0);

        IERC20 pair = IERC20(pool.lp_contract);
        require(pair.balanceOf(msg.sender) >= _amount);
        require(pair.allowance(msg.sender, address(this)) >= _amount);

        pair.transferFrom(msg.sender, address(this), _amount);
        pool.totalStaked = pool.totalStaked.add(_amount);
        UserInfo storage user = userInfo[msg.sender];
        user.amount[index] = user.amount[index].add(_amount);
        pool.stakers = pool.stakers.add(1);

        uint256 entryTime = nextStakingClaimBlock.sub(block.number);
        uint256 equity = _amount.mul(entryTime);
        if (user.stakingBlock < lastStakingClaimBlock) {
            equity = user.amount[index].mul(distanceBetweenClaimBlocks);
        }
        pool.totalEquity = pool.totalEquity.add(equity);

        user.equity[index] = user.equity[index].add(equity);


        uint256 acceptableToEnter = thisStakingClaimBlock.sub(epochWindow);

        if (!(block.number <= acceptableToEnter)) {
            return false;
        }

        if (user.amount[index] != 0) {
            claim(index);
        }
        user.stakingBlock = block.number;

        // if (user.stakingBlock == 0)  {
        // }

        emit Enter(msg.sender, _amount);
    }

    function getNewPortion(uint256 equity, uint256 amount, uint256 _amount) public pure returns (uint256) {
        return equity.sub(amount.sub(_amount).mul(10.pow(18)).div(amount).mul(equity).div(10.pow(18)));
    }


    //leave stake, forfeits monthly rewards.
    function leave(uint256 _amount, uint256 _index) public {
        UserInfo storage user = userInfo[msg.sender];
        require(user.amount[_index] > 0);

        Pool storage pool = pools[_index];
        require(pool.lp_contract != address(0));
        require(pool.weight != 0);

        IERC20 token = IERC20(pool.lp_contract);

        uint256 withdrawAmount = _amount;

        user.amount[_index] = user.amount[_index].sub(_amount);
        user.stakingBlock = 0;
        pool.totalStaked = pool.totalStaked.sub(_amount);
        pool.stakers = pool.stakers.sub(1);

        uint256 portion = getNewPortion(user.equity[_index], user.amount[_index], _amount);
        user.equity[_index] = user.equity[_index].sub(portion);
        pool.totalEquity = pool.totalEquity.sub(portion);


        require((token.balanceOf(address(this)) - oracleFees) >= withdrawAmount);
        token.transfer(msg.sender, withdrawAmount);
        emit Leave(msg.sender, withdrawAmount);
    }

    function claim(uint256 _index) public returns (bool) {
        UserInfo storage user = userInfo[msg.sender];
        require(user.equity[_index] > 0);

        require(user.stakingBlock <= thisStakingClaimBlock);

        uint256 acceptableClaim = lastStakingClaimBlock.sub(blockClaimWindow);

        if (!(block.number >= acceptableClaim)) {
            return false;
        }

        if (lastStakingClaimBlock == thisStakingClaimBlock) {
            lastStakingClaimBlock = thisStakingClaimBlock;
            thisStakingClaimBlock = thisStakingClaimBlock.add(epochWindow);
            distanceBetweenClaimBlocks = thisStakingClaimBlock.sub(lastStakingClaimBlock);
        }

        uint256 base_reward = getPendingReward(msg.sender, _index);
        uint256 fee_reward = getFeeReward(msg.sender, _index);
        require(base_reward > 0);
        user.stakingBlock = thisStakingClaimBlock;
        user.equity[_index] = user.amount[_index].mul(nextStakingClaimBlock.sub(thisStakingClaimBlock));
        wXEQContract.mint(msg.sender, base_reward);

        if (fee_reward > 0) {
            oracleFees = oracleFees.sub(fee_reward);
            require(wXEQContract.balanceOf(address(this)) >= fee_reward);
            wXEQContract.transfer(msg.sender, fee_reward);
        }

        emit WithdrawRewards(msg.sender, base_reward.add(fee_reward));
        return true;
    }
}
