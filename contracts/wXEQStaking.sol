pragma solidity >=0.4.22 <0.8.0;

import "./Ownable.sol";
import "./SafeMath.sol";
import "./wXEQ.sol";


contract PreSale is Ownable {
    using SafeMath for *;

    address payable public teamAdd;
    wXEQ wXEQcontract;
    uint256 finalBlock;
    uint256 public ethMinted;
    uint256 public wXEQminted;
    uint256 exchangeRate;
    uint256 stakingBonusEndBlock;
    uint stakingBonusHit;
    bool presaleActive;
    uint256 cap;
    uint256 minGoal;
    bool hasStakingBonus;
    
    address ETHUSD;
    uint256 public lastETHPrice;
    
    constructor(address xeq, address t) payable {
        transferOwnership(t);
        wXEQcontract = wXEQ(xeq);
        finalBlock = block.timestamp + (90 days);
        exchangeRate = 230000000000000;
        stakingBonusHit = 1;
        presaleActive = true;
        cap = 10000000.mul(10.pow(18));
        minGoal = 5000000.mul(10.pow(18));
        ETHUSD = address(0x9326BFA02ADD2366b30bacB125260Af641031331);
    }
    
    event Withdraw(address indexed from, uint256 amount, uint256 blockHeight);
    event Mint(address indexed from, uint256 ethAmount, uint256 XEQAmount);
    event ExhangeRateChanged(uint256 rate);
    event PreSaleStateChanged(bool isActive);
    
    modifier presaleIsActive() {
        require(presaleActive);
        _;
    }
    
    function wXEQLeft() public view returns (uint256) {
        return cap.sub(wXEQminted);
    }
    
    function finalPresaleBlock() public view returns (uint256) {
        return finalBlock;
    }
    
    function checkPresale(uint256 val) public view returns (bool) {
        if (wXEQminted.add(val) >= cap) {
            return false;
        } else if (block.timestamp > finalBlock && wXEQminted >= minGoal) {
            return false;
        } else {
            return true;
        }
    }
    
    function calculateAmount(uint256 _ethAmount) public view returns (uint256) {
        uint256 ethAmount = _ethAmount;
        uint256 rate =  15.mul(10.pow(16));
        
        uint256 price = lastETHPrice;
        return price.mul(10.pow(10)).div(rate).mul(10.pow(18)).mul(ethAmount).div(10*10**17);
    }
    
    function getAmount(uint256 _ethAmount) public returns (uint256) {
        uint256 ethAmount = _ethAmount;
        uint256 rate =  15.mul(10.pow(16));
        
        AggregatorInterface priceFeed = AggregatorInterface(ETHUSD);
        uint256 price = uint256(priceFeed.latestAnswer());
        return price.mul(10.pow(10)).div(rate).mul(10.pow(18)).mul(ethAmount).div(10*10**17);
    }
    
    function updateETHOracle(address _oracleAddress) public onlyOwner returns (bool) {
        require(_oracleAddress != address(0));
        ETHUSD = _oracleAddress;
        return true;
    }
    
    function updateExchangeRate(uint256 val) public onlyOwner returns (bool) {
        exchangeRate = val;
        emit ExhangeRateChanged(exchangeRate);
    }
    
    function endPresale() public onlyOwner presaleIsActive returns (bool) {
        presaleActive = false;
        emit PreSaleStateChanged(presaleActive);
    }
    
    function startPresale(uint256 numberOfDays, uint256 c, uint256 min) public onlyOwner returns (bool) {
        require(!presaleActive);
        require(numberOfDays != 0);
        presaleActive = true;
        finalBlock = block.timestamp + (numberOfDays.mul(1 days));
        cap = c;
        minGoal = min;
        emit PreSaleStateChanged(presaleActive);
    }
    
    function checkStakingDate() internal {
        if (stakingBonusHit == 1) {
            stakingBonusEndBlock = block.number.add(30.mul(6500));
        } else if (stakingBonusHit != 1 && block.number > stakingBonusEndBlock) {
            stakingBonusEndBlock = block.number.add(30.mul(6500));
        } else {
            stakingBonusEndBlock = stakingBonusEndBlock.add(30.mul(6500));
        }
    }
    
    function checkStakingBonus() external {
        if (hasStakingBonus) {
            if (wXEQminted > 9750000.mul(10.pow(18))) {
                if (stakingBonusHit <= 3) {
                    stakingBonusHit = 4;
                    checkStakingDate();
                }
            } else if (wXEQminted > 7500000.mul(10.pow(18))) {
                if (stakingBonusHit <= 2) {
                    stakingBonusHit = 3;
                    checkStakingDate();
                }
            } else if (wXEQminted > 500000.mul(10.pow(18))) {
                if (stakingBonusHit == 1) {
                    stakingBonusHit = 2;
                    checkStakingDate();
                }
            }
        }
    }
    
    function stakingBonus() public view returns (uint256, uint256) {
        return (stakingBonusHit, stakingBonusEndBlock);
    }

    fallback () external presaleIsActive payable {
        uint256 xeqVal = getAmount(msg.value);
        require(checkPresale(xeqVal));
        wXEQminted = wXEQminted.add(xeqVal);
        ethMinted = ethMinted.add(msg.value);
        uint256 ogBalance = wXEQcontract.balanceOf(msg.sender);
        wXEQcontract.mint(msg.sender, xeqVal);
        emit Mint(msg.sender, msg.value, xeqVal);
    }

    function withdraw(uint256 amount) public onlyOwner {
        require(amount <= ethBalance());
        teamAdd.transfer(amount);
        emit Withdraw(msg.sender, amount, block.number);
    }
    
    function ethBalance() public view returns (uint256) {
        return address(this).balance;
    }
}