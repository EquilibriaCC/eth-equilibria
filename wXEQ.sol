pragma solidity >=0.4.22 <0.8.0;
import "https://github.com/smartcontractkit/chainlink/blob/develop/evm-contracts/src/v0.7/interfaces/AggregatorInterface.sol";

/** Taken from the OpenZeppelin github
 * @title SafeMath
 * @dev Math operations with safety checks that revert on error
 */
library SafeMath {

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b);
       
        return c;
    }
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0);
        uint256 c = a / b;

        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a);
        uint256 c = a - b;

        return c;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a);

        return c;
    }

    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b != 0);
        return a % b;
    }
    
    function pow(uint256 base, uint256 exponent) internal pure returns (uint256) {
    if (exponent == 0) {
        return 1;
    }
    else if (exponent == 1) {
        return base;
    }
    else if (base == 0 && exponent != 0) {
        return 0;
    }
    else {
        uint256 z = base;
        for (uint256 i = 1; i < exponent; i++)
            z = mul(z, base);
        return z;
    }
}
}

contract Context {
    function _msgSender() internal view returns (address payable) {
        return msg.sender;
    }

    function _msgData() internal view returns (bytes memory) {
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        return msg.data;
    }
}

contract Ownable is Context {
    address private _owner;
    address public contractCreator;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() {
        address msgSender = _msgSender();
        _owner = msgSender;
        contractCreator = msg.sender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    function owner() public view returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(_owner == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    function renounceOwnership() public onlyOwner {
        emit OwnershipTransferred(_owner, contractCreator);
        _owner = contractCreator;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

contract Accessible is Ownable {
    address[] public access;
    
    constructor() {
        access.push(msg.sender);
    }
    
     modifier hasAccess() {
        require(checkAccess());
        _;
    }
    
    function checkAccess() public view returns (bool) {
        require(checkAccessAddy(msg.sender));
        return false;
    }
    
    function checkAccessAddy(address addy) public view returns (bool) {
        for (uint i = 0; i < access.length; i++) {
            if (addy == access[i]) {
                return true;
            }
        }
        return false;
    }
    
    function removeAccess(address addr) public hasAccess returns (bool success) {
        for (uint i = 0; i < access.length; i++) {
            if (addr == access[i]) {
                delete access[i];
                assert(!checkAccessAddy(addr));
                return true;
            }
        }
        return false;
    }
    
    function addAccess(address addr) public onlyOwner returns (bool) {
        access.push(addr);
        assert(checkAccessAddy(addr));
        return true;
    }
}

contract HasMaster {
    address public masterContract;
    
    function newMaster(address addy) external view returns (bool) {
        require(msg.sender == masterContract);
        masterContract == addy;
        assert(addy == masterContract);
    }
}

contract ExternalAccessible is HasMaster {
    
    function checkAccess() public returns (bool) {
        bytes memory payload = abi.encodeWithSignature("checkAccess()");
        (bool success, bytes memory returnData) = masterContract.call(payload);
        require(success);
        return true;
    }

    modifier hasAccess() {
        require(checkAccess());
        _;
    }
}

contract wXEQ is ExternalAccessible {

    using SafeMath for *;

    struct mintXEQStruct {
        address addr;
        uint amount;
        string xeqAddress;
    }

    struct TxStorage {
        string hash;
        uint amountMinted;
    }

    string public _name;
    string public _symbol;
    address public contractCreator;
    uint8 public _decimals;
    DataStorage dataStorage;
    mapping(address => uint256) public _balances;
    mapping(address => mapping(address => uint256)) _allowed;
    mapping(address => bool) haveSynced;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(address back) {
        dataStorage = DataStorage(back);
        _decimals = 18;
        _name = "Wrapped Equilibria";
        _symbol = "wXEQ";
        contractCreator = msg.sender;
        // masterContract = Master(address(msg.sender));
    }

    function decimals() public view returns (uint8) {
        return _decimals;
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function totalSupply() public view returns (uint256) {
        return dataStorage.totalSupply();
    }

    function balanceOf(address _owner) public view returns (uint256) {
        return dataStorage.balanceOf(_owner);
    }

    function transfer(address to, uint256 value) public returns (bool) {
        require(value <= dataStorage.balanceOf(msg.sender));
        require(to != address(0));
        uint256 bal = dataStorage.balanceOf(msg.sender);
        dataStorage.updateBalance(msg.sender, bal.sub(value));
        assert(dataStorage.balanceOf(msg.sender).add(value) == bal);
        bal = dataStorage.balanceOf(to);
        dataStorage.updateBalance(to, bal.add(value));
        assert(dataStorage.balanceOf(to).sub(value) == bal);
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function approve(address spender, uint256 value) public returns (bool) {
        require(spender != address(0));
        require(dataStorage.balanceOf(msg.sender) >= value);
        dataStorage.updateAllowed(msg.sender, spender, value);
        assert(dataStorage.allowance(msg.sender, spender) == value);
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function allowance(address owner,address spender) public view returns (uint256) {
        return dataStorage.allowance(owner, spender);
    }

    function decreaseAllowance(address spender,uint256 subtractedValue) public returns (bool) {
        require(spender != address(0));
        uint256 allow = dataStorage.allowance(msg.sender, spender);
        dataStorage.updateAllowed(msg.sender, spender, allow.sub(subtractedValue));
        assert(allow.sub(subtractedValue) == dataStorage.allowance(msg.sender, spender));
        emit Approval(msg.sender, spender, _allowed[msg.sender][spender]);
        return true;
    }

    function transferFrom(address _from,address to,uint256 value) public returns (bool){
        require(value <= _balances[_from]);
        require(value <= _allowed[_from][msg.sender]);
        require(to != address(0));

        _balances[_from] = _balances[_from].sub(value);
        _balances[to] = _balances[to].add(value);
        _allowed[_from][msg.sender] = _allowed[_from][msg.sender].sub(value);
        emit Transfer(_from, to, value);
        return true;
    }

    function increaseAllowance(address spender,uint256 addedValue) public returns (bool) {
        require(spender != address(0));
        uint256 allow = dataStorage.allowance(msg.sender, spender);
        require(allow.add(addedValue) <= dataStorage.balanceOf(msg.sender));
        dataStorage.updateAllowed(msg.sender, spender, allow.add(addedValue));
        assert(allow.add(addedValue) == dataStorage.allowance(msg.sender, spender));
        emit Approval(msg.sender, spender, _allowed[msg.sender][spender]);
        return true;
    }

    function _burn(address account, uint256 amount) public hasAccess {
        require(amount <= dataStorage.balanceOf(account));
        uint256 supply = dataStorage.totalSupply();
        dataStorage.updateSupply(supply.sub(amount));
        assert(supply == dataStorage.totalSupply().add(amount));
        uint256 bal = dataStorage.balanceOf(account);
        dataStorage.updateBalance(account, bal.sub(amount));
        assert(bal == dataStorage.balanceOf(account).add(amount));
        emit Transfer(account, address(0), amount);
    }

    function _burnFrom(address account, uint256 amount) public {
        require(amount <= allowance(account, msg.sender));
        uint256 allow = allowance(account, msg.sender);
        dataStorage.updateAllowed(account, msg.sender, allow.sub(amount));
        assert(allow.sub(amount) == allowance(account, msg.sender));
        emit Transfer(account, address(0), amount);
        _burn(account, amount);
    }

    function mint(address account, uint256 amount) public hasAccess {
        uint256 supp = dataStorage.totalSupply();
        dataStorage.updateSupply(supp.add(amount));
        assert(dataStorage.totalSupply().sub(amount) == supp);
        uint256 bal = dataStorage.balanceOf(account);
        dataStorage.updateBalance(account, bal.add(amount));
        assert(dataStorage.balanceOf(account).sub(amount) == bal);
        emit Transfer(msg.sender, account, amount);
    }

}