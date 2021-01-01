pragma solidity >=0.4.22 <0.8.0;

contract PreSale is Ownable {
    using SafeMath for *;

    address payable public teamAdd;
    wXEQ wXEQcontract;
    uint256 finalBlock;
    uint256 public ethMinted;
    uint256 public wXEQminted;
    uint256 exchangeRate;
    uint256 xeqRate;
    uint256 stakingBonusEndBlock;
    uint stakingBonusHit;
    bool presaleActive;
    uint256 cap;
    uint256 minGoal;
    bool hasStakingBonus;

    mapping(string => address) oracles;
    mapping(string => address) tokensAccepted;

    constructor(address xeq, address t) payable {
        transferOwnership(t);
        wXEQcontract = wXEQ(xeq);
        finalBlock = block.timestamp + (90 days);
        exchangeRate = 230000000000000;
        stakingBonusHit = 1;
        presaleActive = true;
        cap = 10000000.mul(10.pow(18));
        minGoal = 5000000.mul(10.pow(18));
        xeqRate = 1500000;
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
        if (wXEQminted.add(val.mul(10.pow(18))) >= cap) {
            return false;
        } else if (block.timestamp > finalBlock && wXEQminted >= minGoal) {
            return false;
        } else {
            return true;
        }
    }
    
    function calculateAmount(string memory token, uint256 val) public view returns (uint256) {
        
        require(oracles[token] != address(0));
        AggregatorInterface oracle = AggregatorInterface(oracles[token]);
        uint256 exchange_rate = uint256(oracle.latestAnswer()).div(xeqRate);

        return val.div(exchange_rate);
    }
    
    function getTokenAddress(string memory token) public view returns (address) {
        require(tokensAccepted[token] != address(0));
        return tokensAccepted[token];
    }
    
    function getOracleAddress(string memory token) public view returns (address) {
        require(oracles[token] != address(0));
        return oracles[token];
    }
    
    function haveToken(string memory token) public view returns (bool) {
        return oracles[token] != address(0);
    }
    
    function addToken(string memory token, address _oracle_address, address _token_address) public onlyOwner returns (bool) {
        require(_oracle_address != address(0));
        require(_token_address != address(0));
        if(haveToken(token))
            return false;
        
        oracles[token] = _oracle_address;
        tokensAccepted[token] = _token_address;
        return true;
    }
    
    function removeToken(string memory token) public onlyOwner returns (bool) {
        require(haveToken(token));
            
        delete oracles[token];
        delete tokensAccepted[token];
        return true;
    }
    
    function updateToken(string memory token, address _oracle_address, address _token_address) public onlyOwner returns (bool) {
        require(_oracle_address != address(0));
        require(_token_address != address(0));
        oracles[token] = _oracle_address;
        tokensAccepted[token] = _token_address;
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
        uint256 xeqVal = calculateAmount("eth", msg.value);
        // require(checkPresale(xeqVal));
        // checkStakingBonus();
        wXEQminted = wXEQminted.add(xeqVal.mul(10.pow(18)));
        ethMinted = ethMinted.add(msg.value);
        uint256 ogBalance = wXEQcontract.balanceOf(msg.sender);
        wXEQcontract.mint(msg.sender, xeqVal.mul(10.pow(18)));
        // assert(wXEQcontract.balanceOf(msg.sender) == ogBalance + (xeqVal * 10**18));
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