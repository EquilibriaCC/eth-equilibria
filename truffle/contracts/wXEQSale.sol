pragma solidity >=0.4.22 <0.8.0;

import "./tools/Ownable.sol";
import "./tools/SafeMath.sol";
import "./wXEQ.sol";
import "./oracle/AggregatorInterface.sol";

contract PreSale is Ownable {
    using SafeMath for *;

    address payable public teamAdd;
    wXEQ wXEQcontract;
    uint256 public finalBlock;
    uint256 public ethMinted;
    uint256 public wXEQminted;
    uint256 public stakingBonusEndBlock;
    uint public stakingBonusHit;
    bool public presaleActive;
    uint256 public cap;
    uint256 public minGoal;
    uint256 public xeqRate;
    bool public hasStakingBonus;
    mapping(address => uint256) userXEQMints;
    mapping(address => uint256) userETHDeposits;

    address ETHUSD;
    uint256 public lastETHPrice;

    constructor(address xeq, address t) payable {
        transferOwnership(t);
        wXEQcontract = wXEQ(xeq);
        finalBlock = block.timestamp + (90 days);
        stakingBonusHit = 1;
        presaleActive = true;
        cap = 10000000.mul(10.pow(18));
        minGoal = 5000000.mul(10.pow(18));
        xeqRate = 15.mul(10.pow(16));
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

    function getAmount(uint256 _ethAmount) public returns (uint256) {
        uint256 ethAmount = _ethAmount;
        AggregatorInterface priceFeed = AggregatorInterface(ETHUSD);
        uint256 price = uint256(priceFeed.latestAnswer());
        lastETHPrice = price;
        require(price.mul(10.pow(10)).div(xeqRate).mul(10.pow(18)).mul(ethAmount).div(10*10**17) != 0);
        return price.mul(10.pow(10)).div(xeqRate).mul(10.pow(18)).mul(ethAmount).div(10*10**17);
    }

    function updateETHOracle(address _oracleAddress) public onlyOwner returns (bool) {
        require(_oracleAddress != address(0));
        ETHUSD = _oracleAddress;
        return true;
    }

    function updateExchangeRate(uint256 val) public onlyOwner returns (bool) {
        xeqRate = val;
        emit ExhangeRateChanged(xeqRate);
        return true;
    }

    function endPresale() public onlyOwner presaleIsActive returns (bool) {
        presaleActive = false;
        emit PreSaleStateChanged(presaleActive);
        return true;
    }

    function startPresale(uint256 numberOfDays, uint256 c, uint256 min) public onlyOwner returns (bool) {
        require(!presaleActive);
        require(numberOfDays != 0);
        presaleActive = true;
        finalBlock = block.timestamp + (numberOfDays.mul(1 days));
        cap = c;
        minGoal = min;
        emit PreSaleStateChanged(presaleActive);
        return true;
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

    function deposit() public presaleIsActive payable {
        uint256 xeqVal = getAmount(msg.value);
        require(checkPresale(xeqVal));
        userXEQMints[msg.sender] = userXEQMints[msg.sender].add(xeqVal);
        userETHDeposits[msg.sender] = userETHDeposits[msg.sender].add(msg.value);
        wXEQminted = wXEQminted.add(xeqVal);
        ethMinted = ethMinted.add(msg.value);
        wXEQcontract.mint(msg.sender, xeqVal);
        emit Mint(msg.sender, msg.value, xeqVal);
    }

    fallback () external presaleIsActive payable {
        uint256 xeqVal = getAmount(msg.value);
        require(checkPresale(xeqVal));
        userXEQMints[msg.sender] = userXEQMints[msg.sender].add(xeqVal);
        userETHDeposits[msg.sender] = userETHDeposits[msg.sender].add(msg.value);
        wXEQminted = wXEQminted.add(xeqVal);
        ethMinted = ethMinted.add(msg.value);
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