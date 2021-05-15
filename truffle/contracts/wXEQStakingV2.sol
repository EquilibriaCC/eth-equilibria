pragma solidity >=0.4.22 <0.8.0;

import "./tools/Ownable.sol";
import "./tools/SafeMath.sol";
import "./tools/DataStorage.sol";
import "./wXEQ.sol";
import "./tools/ERC20.sol";
import "./tools/IERC20.sol";
import "./tools/SafeERC20.sol";

library FixedPointMath {
    uint256 public constant DECIMALS = 18;
    uint256 public constant SCALAR = 10**DECIMALS;

    struct FixedDecimal {
        uint256 x;
    }

    function fromU256(uint256 value) internal pure returns (FixedDecimal memory) {
        uint256 x;
        require(value == 0 || (x = value * SCALAR) / SCALAR == value);
        return FixedDecimal(x);
    }

    function maximumValue() internal pure returns (FixedDecimal memory) {
        return FixedDecimal(uint256(-1));
    }

    function add(FixedDecimal memory self, FixedDecimal memory value) internal pure returns (FixedDecimal memory) {
        uint256 x;
        require((x = self.x + value.x) >= self.x);
        return FixedDecimal(x);
    }

    function add(FixedDecimal memory self, uint256 value) internal pure returns (FixedDecimal memory) {
        return add(self, fromU256(value));
    }

    function sub(FixedDecimal memory self, FixedDecimal memory value) internal pure returns (FixedDecimal memory) {
        uint256 x;
        require((x = self.x - value.x) <= self.x);
        return FixedDecimal(x);
    }

    function sub(FixedDecimal memory self, uint256 value) internal pure returns (FixedDecimal memory) {
        return sub(self, fromU256(value));
    }

    function mul(FixedDecimal memory self, uint256 value) internal pure returns (FixedDecimal memory) {
        uint256 x;
        require(value == 0 || (x = self.x * value) / value == self.x);
        return FixedDecimal(x);
    }

    function div(FixedDecimal memory self, uint256 value) internal pure returns (FixedDecimal memory) {
        require(value != 0);
        return FixedDecimal(self.x / value);
    }

    function cmp(FixedDecimal memory self, FixedDecimal memory value) internal pure returns (int256) {
        if (self.x < value.x) {
            return -1;
        }

        if (self.x > value.x) {
            return 1;
        }

        return 0;
    }

    function decode(FixedDecimal memory self) internal pure returns (uint256) {
        return self.x / SCALAR;
    }
}


contract ReentrancyGuard {

    /**
     * @dev We use a single lock for the whole contract.
     */
    bool private rentrancy_lock = false;

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * @notice If you mark a function `nonReentrant`, you should also
     * mark it `external`. Calling one nonReentrant function from
     * another is not supported. Instead, you can implement a
     * `private` function doing the actual work, and a `external`
     * wrapper marked as `nonReentrant`.
     */
    modifier nonReentrant() {
        require(!rentrancy_lock);
        rentrancy_lock = true;
        _;
        rentrancy_lock = false;
    }

}

library Pool {
    using FixedPointMath for FixedPointMath.FixedDecimal;
    using Pool for Pool.Data;
    using Pool for Pool.List;
    using SafeMath for uint256;

    struct Context {
        uint256 rewardRate;
        uint256 totalRewardWeight;
    }

    struct Data {
        IERC20 token;
        uint256 totalDeposited;
        uint256 rewardWeight;
        FixedPointMath.FixedDecimal accumulatedRewardWeight;
        uint256 lastUpdatedBlock;
    }

    struct List {
        Data[] elements;
    }

    /// @dev Updates the pool.
    ///
    /// @param _ctx the pool context.
    function update(Data storage _data, Context storage _ctx) internal {
        _data.accumulatedRewardWeight = _data.getUpdatedAccumulatedRewardWeight(_ctx);
        _data.lastUpdatedBlock = block.number;
    }

    /// @dev Gets the rate at which the pool will distribute rewards to stakers.
    ///
    /// @param _ctx the pool context.
    ///
    /// @return the reward rate of the pool in tokens per block.
    function getRewardRate(Data storage _data, Context storage _ctx)
    internal view
    returns (uint256)
    {
        // console.log("get reward rate");
        // console.log(uint(_data.rewardWeight));
        // console.log(uint(_ctx.totalRewardWeight));
        // console.log(uint(_ctx.rewardRate));
        return _ctx.rewardRate.mul(_data.rewardWeight).div(_ctx.totalRewardWeight);
    }

    /// @dev Gets the accumulated reward weight of a pool.
    ///
    /// @param _ctx the pool context.
    ///
    /// @return the accumulated reward weight.
    function getUpdatedAccumulatedRewardWeight(Data storage _data, Context storage _ctx)
    internal view
    returns (FixedPointMath.FixedDecimal memory)
    {
        if (_data.totalDeposited == 0) {
            return _data.accumulatedRewardWeight;
        }

        uint256 _elapsedTime = block.number.sub(_data.lastUpdatedBlock);
        if (_elapsedTime == 0) {
            return _data.accumulatedRewardWeight;
        }

        uint256 _rewardRate = _data.getRewardRate(_ctx);
        uint256 _distributeAmount = _rewardRate.mul(_elapsedTime);

        if (_distributeAmount == 0) {
            return _data.accumulatedRewardWeight;
        }

        FixedPointMath.FixedDecimal memory _rewardWeight = FixedPointMath.fromU256(_distributeAmount).div(_data.totalDeposited);
        return _data.accumulatedRewardWeight.add(_rewardWeight);
    }

    /// @dev Adds an element to the list.
    ///
    /// @param _element the element to add.
    function push(List storage _self, Data memory _element) internal {
        _self.elements.push(_element);
    }

    /// @dev Gets an element from the list.
    ///
    /// @param _index the index in the list.
    ///
    /// @return the element at the specified index.
    function get(List storage _self, uint256 _index) internal view returns (Data storage) {
        return _self.elements[_index];
    }

    /// @dev Gets the last element in the list.
    ///
    /// This function will revert if there are no elements in the list.
    ///ck
    /// @return the last element in the list.
    function last(List storage _self) internal view returns (Data storage) {
        return _self.elements[_self.lastIndex()];
    }

    /// @dev Gets the index of the last element in the list.
    ///
    /// This function will revert if there are no elements in the list.
    ///
    /// @return the index of the last element.
    function lastIndex(List storage _self) internal view returns (uint256) {
        uint256 _length = _self.length();
        return _length.sub(1);
    }

    /// @dev Gets the number of elements in the list.
    ///
    /// @return the number of elements.
    function length(List storage _self) internal view returns (uint256) {
        return _self.elements.length;
    }
}

/// @title Stake
///
/// @dev A library which provides the Stake data struct and associated functions.
library Stake {
    using FixedPointMath for FixedPointMath.FixedDecimal;
    using Pool for Pool.Data;
    using SafeMath for uint256;
    using Stake for Stake.Data;

    struct Data {
        uint256 totalDeposited;
        uint256 totalUnclaimed;
        FixedPointMath.FixedDecimal lastAccumulatedWeight;
    }

    function update(Data storage _self, Pool.Data storage _pool, Pool.Context storage _ctx) internal {
        _self.totalUnclaimed = _self.getUpdatedTotalUnclaimed(_pool, _ctx);
        _self.lastAccumulatedWeight = _pool.getUpdatedAccumulatedRewardWeight(_ctx);
    }

    function getUpdatedTotalUnclaimed(Data storage _self, Pool.Data storage _pool, Pool.Context storage _ctx)
    internal view
    returns (uint256)
    {
        FixedPointMath.FixedDecimal memory _currentAccumulatedWeight = _pool.getUpdatedAccumulatedRewardWeight(_ctx);
        FixedPointMath.FixedDecimal memory _lastAccumulatedWeight = _self.lastAccumulatedWeight;

        if (_currentAccumulatedWeight.cmp(_lastAccumulatedWeight) == 0) {
            return _self.totalUnclaimed;
        }

        uint256 _distributedAmount = _currentAccumulatedWeight
        .sub(_lastAccumulatedWeight)
        .mul(_self.totalDeposited)
        .decode();

        return _self.totalUnclaimed.add(_distributedAmount);
    }
}

interface IMintableERC20 is IERC20{
    function _mint(address _recipient, uint256 _amount) external;
    function _burn(address account, uint256 amount) external;
}

contract StakingPools is ReentrancyGuard {
    using FixedPointMath for FixedPointMath.FixedDecimal;
    using Pool for Pool.Data;
    using Pool for Pool.List;
    using SafeERC20 for IERC20;
    using SafeMath for uint256;
    using Stake for Stake.Data;

    event PendingGovernanceUpdated(
        address pendingGovernance
    );

    event GovernanceUpdated(
        address governance
    );

    event RewardRateUpdated(
        uint256 rewardRate
    );

    event PoolRewardWeightUpdated(
        uint256 indexed poolId,
        uint256 rewardWeight
    );

    event PoolCreated(
        uint256 indexed poolId,
        IERC20 indexed token
    );

    event TokensDeposited(
        address indexed user,
        uint256 indexed poolId,
        uint256 amount
    );

    event TokensWithdrawn(
        address indexed user,
        uint256 indexed poolId,
        uint256 amount
    );

    event TokensClaimed(
        address indexed user,
        uint256 indexed poolId,
        uint256 amount
    );

    /// @dev The token which will be minted as a reward for staking.
    IMintableERC20 public reward;

    /// @dev The address of the account which currently has administrative capabilities over this contract.
    address public governance;

    address public pendingGovernance;

    /// @dev Tokens are mapped to their pool identifier plus one. Tokens that do not have an associated pool
    /// will return an identifier of zero.
    mapping(IERC20 => uint256) public tokenPoolIds;

    /// @dev The context shared between the pools.
    Pool.Context private _ctx;

    /// @dev A list of all of the pools.
    Pool.List private _pools;

    /// @dev A mapping of all of the user stakes mapped first by pool and then by address.
    mapping(address => mapping(uint256 => Stake.Data)) private _stakes;

    /// @dev Tracks the total amount of tokens claimed as rewards.
    uint256 public totalTokensClaimed;

    constructor(
        IMintableERC20 _reward,
        address _governance
    ) public {
        require(_governance != address(0), "StakingPools: governance address cannot be 0x0");

        reward = _reward;
        governance = _governance;
        // 2083333300000000
    }

    /// @dev A modifier which reverts when the caller is not the governance.
    modifier onlyGovernance() {
        require(msg.sender == governance, "StakingPools: only governance");
        _;
    }

    /// @dev Sets the governance.
    ///
    /// This function can only called by the current governance.
    ///
    /// @param _pendingGovernance the new pending governance.
    function setPendingGovernance(address _pendingGovernance) external onlyGovernance {
        require(_pendingGovernance != address(0), "StakingPools: pending governance address cannot be 0x0");
        pendingGovernance = _pendingGovernance;

        emit PendingGovernanceUpdated(_pendingGovernance);
    }

    function acceptGovernance() external {
        require(msg.sender == pendingGovernance, "StakingPools: only pending governance");

        address _pendingGovernance = pendingGovernance;
        governance = _pendingGovernance;

        emit GovernanceUpdated(_pendingGovernance);
    }

    /// @dev Sets the distribution reward rate.
    ///
    /// This will update all of the pools.
    ///
    /// @param _rewardRate The number of tokens to distribute per second.
    function setRewardRate(uint256 _rewardRate) external onlyGovernance {
        _updatePools(); // 951293760000000

        _ctx.rewardRate = _rewardRate;

        emit RewardRateUpdated(_rewardRate);
    }

    /// @dev Creates a new pool.
    ///
    /// The created pool will need to have its reward weight initialized before it begins generating rewards.
    ///
    /// @param _token The token the pool will accept for staking.
    ///
    /// @return the identifier for the newly created pool.
    function createPool(IERC20 _token) external onlyGovernance returns (uint256) {
        require(tokenPoolIds[_token] == 0, "StakingPools: token already has a pool");

        uint256 _poolId = _pools.length();

        _pools.push(Pool.Data({
        token: _token,
        totalDeposited: 0,
        rewardWeight: 0,
        accumulatedRewardWeight: FixedPointMath.FixedDecimal(0),
        lastUpdatedBlock: block.number
        }));

        tokenPoolIds[_token] = _poolId + 1;

        emit PoolCreated(_poolId, _token);

        return _poolId;
    }

    /// @dev Sets the reward weights of all of the pools.
    ///
    /// @param _rewardWeights The reward weights of all of the pools.
    function setRewardWeights(uint256[] calldata _rewardWeights) external onlyGovernance {
        require(_rewardWeights.length == _pools.length(), "StakingPools: weights length mismatch");

        _updatePools();

        uint256 _totalRewardWeight = _ctx.totalRewardWeight;
        for (uint256 _poolId = 0; _poolId < _pools.length(); _poolId++) {
            Pool.Data storage _pool = _pools.get(_poolId);

            uint256 _currentRewardWeight = _pool.rewardWeight;
            if (_currentRewardWeight == _rewardWeights[_poolId]) {
                continue;
            }

            // FIXME
            _totalRewardWeight = _totalRewardWeight.sub(_currentRewardWeight).add(_rewardWeights[_poolId]);
            _pool.rewardWeight = _rewardWeights[_poolId];

            emit PoolRewardWeightUpdated(_poolId, _rewardWeights[_poolId]);
        }

        _ctx.totalRewardWeight = _totalRewardWeight;
    }

    /// @dev Stakes tokens into a pool.
    ///
    /// @param _poolId        the pool to deposit tokens into.
    /// @param _depositAmount the amount of tokens to deposit.
    function deposit(uint256 _poolId, uint256 _depositAmount) external nonReentrant {
        Pool.Data storage _pool = _pools.get(_poolId);
        _pool.update(_ctx);

        Stake.Data storage _stake = _stakes[msg.sender][_poolId];
        _stake.update(_pool, _ctx);

        _deposit(_poolId, _depositAmount);
    }

    /// @dev Withdraws staked tokens from a pool.
    ///
    /// @param _poolId          The pool to withdraw staked tokens from.
    /// @param _withdrawAmount  The number of tokens to withdraw.
    function withdraw(uint256 _poolId, uint256 _withdrawAmount) external nonReentrant {
        Pool.Data storage _pool = _pools.get(_poolId);
        _pool.update(_ctx);

        Stake.Data storage _stake = _stakes[msg.sender][_poolId];
        _stake.update(_pool, _ctx);

        _claim(_poolId);
        _withdraw(_poolId, _withdrawAmount);
    }

    /// @dev Claims all rewarded tokens from a pool.
    ///
    /// @param _poolId The pool to claim rewards from.
    ///
    /// @notice use this function to claim the tokens from a corresponding pool by ID.
    function claim(uint256 _poolId) external nonReentrant {
        Pool.Data storage _pool = _pools.get(_poolId);
        _pool.update(_ctx);

        Stake.Data storage _stake = _stakes[msg.sender][_poolId];
        _stake.update(_pool, _ctx);

        _claim(_poolId);
    }

    /// @dev Claims all rewards from a pool and then withdraws all staked tokens.
    ///
    /// @param _poolId the pool to exit from.
    function exit(uint256 _poolId) external nonReentrant {
        Pool.Data storage _pool = _pools.get(_poolId);
        _pool.update(_ctx);

        Stake.Data storage _stake = _stakes[msg.sender][_poolId];
        _stake.update(_pool, _ctx);

        _claim(_poolId);
        _withdraw(_poolId, _stake.totalDeposited);
    }

    /// @dev Gets the rate at which tokens are minted to stakers for all pools.
    ///
    /// @return the reward rate.
    function rewardRate() external view returns (uint256) {
        return _ctx.rewardRate;
    }

    /// @dev Gets the total reward weight between all the pools.
    ///
    /// @return the total reward weight.
    function totalRewardWeight() external view returns (uint256) {
        return _ctx.totalRewardWeight;
    }

    /// @dev Gets the number of pools that exist.
    ///
    /// @return the pool count.
    function poolCount() external view returns (uint256) {
        return _pools.length();
    }

    /// @dev Gets the token a pool accepts.
    ///
    /// @param _poolId the identifier of the pool.
    ///
    /// @return the token.
    function getPoolToken(uint256 _poolId) external view returns (IERC20) {
        Pool.Data storage _pool = _pools.get(_poolId);
        return _pool.token;
    }

    /// @dev Gets the total amount of funds staked in a pool.
    ///
    /// @param _poolId the identifier of the pool.
    ///
    /// @return the total amount of staked or deposited tokens.
    function getPoolTotalDeposited(uint256 _poolId) external view returns (uint256) {
        Pool.Data storage _pool = _pools.get(_poolId);
        return _pool.totalDeposited;
    }

    /// @dev Gets the reward weight of a pool which determines how much of the total rewards it receives per block.
    ///
    /// @param _poolId the identifier of the pool.
    ///
    /// @return the pool reward weight.
    function getPoolRewardWeight(uint256 _poolId) external view returns (uint256) {
        Pool.Data storage _pool = _pools.get(_poolId);
        return _pool.rewardWeight;
    }

    /// @dev Gets the amount of tokens per block being distributed to stakers for a pool.
    ///
    /// @param _poolId the identifier of the pool.
    ///
    /// @return the pool reward rate.
    function getPoolRewardRate(uint256 _poolId) external view returns (uint256) {
        Pool.Data storage _pool = _pools.get(_poolId);
        return _pool.getRewardRate(_ctx);
    }

    /// @dev Gets the number of tokens a user has staked into a pool.
    ///
    /// @param _account The account to query.
    /// @param _poolId  the identifier of the pool.
    ///
    /// @return the amount of deposited tokens.
    function getStakeTotalDeposited(address _account, uint256 _poolId) external view returns (uint256) {
        Stake.Data storage _stake = _stakes[_account][_poolId];
        return _stake.totalDeposited;
    }

    /// @dev Gets the number of unclaimed reward tokens a user can claim from a pool.
    ///
    /// @param _account The account to get the unclaimed balance of.
    /// @param _poolId  The pool to check for unclaimed rewards.
    ///
    /// @return the amount of unclaimed reward tokens a user has in a pool.
    function getStakeTotalUnclaimed(address _account, uint256 _poolId) external view returns (uint256) {
        Stake.Data storage _stake = _stakes[_account][_poolId];
        return _stake.getUpdatedTotalUnclaimed(_pools.get(_poolId), _ctx);
    }

    /// @dev Updates all of the pools.
    function _updatePools() internal {
        for (uint256 _poolId = 0; _poolId < _pools.length(); _poolId++) {
            Pool.Data storage _pool = _pools.get(_poolId);
            _pool.update(_ctx);
        }
    }

    /// @dev Stakes tokens into a pool.
    ///
    /// The pool and stake MUST be updated before calling this function.
    ///
    /// @param _poolId        the pool to deposit tokens into.
    /// @param _depositAmount the amount of tokens to deposit.
    function _deposit(uint256 _poolId, uint256 _depositAmount) internal {
        Pool.Data storage _pool = _pools.get(_poolId);
        Stake.Data storage _stake = _stakes[msg.sender][_poolId];

        _pool.totalDeposited = _pool.totalDeposited.add(_depositAmount);
        _stake.totalDeposited = _stake.totalDeposited.add(_depositAmount);

        _pool.token.safeTransferFrom(msg.sender, address(this), _depositAmount);

        emit TokensDeposited(msg.sender, _poolId, _depositAmount);
    }

    /// @dev Withdraws staked tokens from a pool.
    ///
    /// The pool and stake MUST be updated before calling this function.
    ///
    /// @param _poolId          The pool to withdraw staked tokens from.
    /// @param _withdrawAmount  The number of tokens to withdraw.
    function _withdraw(uint256 _poolId, uint256 _withdrawAmount) internal {
        Pool.Data storage _pool = _pools.get(_poolId);
        Stake.Data storage _stake = _stakes[msg.sender][_poolId];

        _pool.totalDeposited = _pool.totalDeposited.sub(_withdrawAmount);
        _stake.totalDeposited = _stake.totalDeposited.sub(_withdrawAmount);

        _pool.token.safeTransfer(msg.sender, _withdrawAmount);

        emit TokensWithdrawn(msg.sender, _poolId, _withdrawAmount);
    }

    /// @dev Claims all rewarded tokens from a pool.
    ///
    /// The pool and stake MUST be updated before calling this function.
    ///
    /// @param _poolId The pool to claim rewards from.
    ///
    /// @notice use this function to claim the tokens from a corresponding pool by ID.
    function _claim(uint256 _poolId) internal {
        Stake.Data storage _stake = _stakes[msg.sender][_poolId];

        uint256 _claimAmount = _stake.totalUnclaimed;
        _stake.totalUnclaimed = 0;

        reward._mint(msg.sender, _claimAmount);
        totalTokensClaimed = totalTokensClaimed.add(_claimAmount);

        emit TokensClaimed(msg.sender, _poolId, _claimAmount);
    }
}
