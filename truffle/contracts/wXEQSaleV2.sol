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
    bool public presaleActive;
    uint256 public cap;
    uint256 public minGoal;
    uint256 public xeqRate;

    mapping(address => uint256) userXEQMints;
    mapping(address => uint256) userETHDeposits;

    address public ETHUSD;
    uint256 public lastETHPrice;

    constructor(address xeq, address t) payable {
        transferOwnership(t);
        wXEQcontract = wXEQ(xeq);
        finalBlock = block.timestamp + (365 days);
        presaleActive = true;
        cap = 2000000.mul(10.pow(18));
        minGoal = 2000000.mul(10.pow(18));
        xeqRate = 3.mul(10.pow(16));
        ETHUSD = address(0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419);
        teamAdd = payable(0x025134a887052262B1BBD3aaf710a74dBeb935ae);
        wXEQminted = 542754430000000000000000;
        ethMinted = 16160000000000000000;
    }

    event Withdraw(address indexed from, uint256 amount, uint256 blockHeight);
    event Mint(address indexed from, uint256 ethAmount, uint256 XEQAmount);

    modifier presaleIsActive() {
        require(presaleActive);
        _;
    }

    function wXEQLeft() public view returns (uint256) {
        return cap.sub(wXEQminted);
    }

    function checkPresale(uint256 val) public view returns (bool) {
        if (wXEQminted.add(val) >= cap) {
            return false;
        } else if (block.timestamp > finalBlock) {
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
        require(val != 0);
        xeqRate = val;
        return true;
    }

    function updateTeamAddress(address _addy) public onlyOwner returns (bool) {
        require(_addy != address(0));
        teamAdd = payable(_addy);
        return true;
    }

    function endPresale() public onlyOwner presaleIsActive {
        presaleActive = false;
    }

    function startPresale(uint256 numberOfDays, uint256 c, uint256 min) public onlyOwner returns (bool) {
        require(!presaleActive);
        require(numberOfDays != 0);
        presaleActive = true;
        finalBlock = block.timestamp + (numberOfDays.mul(1 days));
        cap = c;
        minGoal = min;
        return true;
    }

    function deposit() public presaleIsActive payable {
        uint256 xeqVal = getAmount(msg.value);
        require(checkPresale(xeqVal));
        wXEQminted = wXEQminted.add(xeqVal);
        ethMinted = ethMinted.add(msg.value);
        wXEQcontract.mint(msg.sender, xeqVal);
        emit Mint(msg.sender, msg.value, xeqVal);
    }

    fallback () external presaleIsActive payable {
        uint256 xeqVal = getAmount(msg.value);
        require(checkPresale(xeqVal));
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