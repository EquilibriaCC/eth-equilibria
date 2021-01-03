// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import "./tools/SafeMath.sol";
import "./tools/DataStorage.sol";
import "./wXEQ.sol";

contract SoftStaking {
    using SafeMath for *;
    DataStorage dataStorage;
    wXEQ wXEQContract;
    address[] public stakeholders;
    mapping(address => uint256) stakeHoldersStakeAmount;
    mapping(address => uint256) lastClaim;
    mapping(address => uint256) unlockBlock;
    mapping(address => uint256) firstBlock;
    mapping(address => bool) partOfPool; 
    uint256 public numberOfPoolStakers;
    uint256 public numberOfStakes;
    uint256 public dailyPool;
    uint256 public lastPoolRefresh;
    uint256 numberofNodesAtRefresh;
    uint256 public totalMinted;
    uint256 public totalStaked;
    uint256 public maxPayouts;
    uint256[] public payouts;
    uint256[] payoutBlock;
    uint256[] payoutPoolSize;
    uint256 public lastPayoutBlock;
    uint256 dailyBlock;

    constructor(address d, address s) {
        dataStorage = DataStorage(d);
        wXEQContract = wXEQ(s);
        lastPoolRefresh = block.number;
        numberOfPoolStakers = 0;
        numberOfStakes = 0;
        totalMinted = 0;
        totalStaked = 0;
        maxPayouts = 730;
        dailyPool = 730;
        dailyPool = 120; //120
        dailyBlock = 10; // 1080
        payouts.push(0);
        payoutPoolSize.push(0);
        payoutBlock.push(block.number);
    }
    
    event NewPayout(address indexed from, uint256 payout, uint256 block, uint256 poolSize);
    event Bal(uint256 bal);
    
    function checkPayout() public {
        if (block.number > lastPayoutBlock.add(dailyBlock)) {
            uint256 payout = dailyPool.mul(10.pow(18));
            uint256 multiplier = dataStorage.getStakingMultiplier();
            if (multiplier > 0) {
                payout = payout.mul(multiplier);
            }
            uint256 bal = dataStorage.balanceOf(address(this));
            if (bal > 0) {
                payout = payout.add(bal);
                emit Bal(bal);
                emit Bal(payout);
                wXEQContract._burn(address(this), bal);
            }
            payouts.push(payout);
            payoutBlock.push(block.number);
            payoutPoolSize.push(totalStaked);
            lastPayoutBlock = block.number;
            // assert(payoutPoolSize.length == payoutBlock.length && payoutBlock.length == payouts.length);
            if (payouts.length > maxPayouts) {
                delete payouts[0];
            }
            emit NewPayout(address(this), payout, block.number, totalStaked);
        }
    }
    
    function addStake(uint256 amount) public returns (bool) {
        require(dataStorage.balanceOf(msg.sender) >= amount);
        require(dataStorage.allowance(msg.sender, address(this)) >= amount);
        require(msg.sender != address(0));
        if (stakeHoldersStakeAmount[msg.sender] == 0) {
            numberOfStakes = numberOfStakes.add(1);
        } else {
            checkPayout();
            withdrawRewards();
        }
        firstBlock[msg.sender] = block.number;
        stakeHoldersStakeAmount[msg.sender] = stakeHoldersStakeAmount[msg.sender].add(amount);
        lastClaim[msg.sender] = block.number;
        totalStaked = totalStaked.add(amount);
        wXEQContract._burnFrom(msg.sender, amount);
    }
    
    function removeStake(uint256 amount) public returns (bool) {
        require(amount <= stakeHoldersStakeAmount[msg.sender]);
        checkPayout();
        withdrawRewards();
        firstBlock[msg.sender] = block.number;
        if (stakeHoldersStakeAmount[msg.sender] == 0) {
            numberOfStakes = numberOfStakes.sub(1);
            lastClaim[msg.sender] = 0;
        }
        stakeHoldersStakeAmount[msg.sender] = stakeHoldersStakeAmount[msg.sender].sub(amount);
        totalStaked = totalStaked.sub(amount);
        wXEQContract.mint(msg.sender, amount);
    }
    
    function withdrawRewards() public returns (uint256) {
        uint256 reward = pendingRewards(msg.sender);
        if (reward == 0) {
            return 0;
        }
        lastClaim[msg.sender] = block.number;
        wXEQContract.mint(msg.sender, reward);
        return reward;
    }
    
    function pendingRewards(address addy) public view returns (uint256) {
        uint256 payout = 0;
        if (stakeHoldersStakeAmount[addy] != 0 && lastClaim[addy] < lastPayoutBlock) {
            for (uint i = payouts.length - 1; i > 0; i--) {
                if (payoutBlock[i] > lastClaim[addy]) {
                    payout = payout.add((stakeHoldersStakeAmount[addy].mul((10.pow(18))).div(payoutPoolSize[i].mul(payouts[i].div(10.pow(18))))));
                } else {
                    break;
                }
            }
            return payout;
        }
        return payout;
    }
    
    function checkArrays() public view returns (uint256, uint256, uint256) {
        return (payouts.length, payoutBlock.length, payoutPoolSize.length);
    }
    
    function getStake(address addy) public view returns (uint256) {
        return stakeHoldersStakeAmount[addy];
    }
    
    function totalAmountStaked() public view returns (uint256) {
        return totalStaked;
    }
    
    function getLastClaim(address addy) public view returns (uint256, uint256) {
        return (lastClaim[addy], block.number);
    }

}

// todo - finish staking validation - soft staking - node staking rewards after input - staking pool - staking multiplier