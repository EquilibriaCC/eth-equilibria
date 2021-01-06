// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import "./ExternalAccessible.sol";
import "./SafeMath.sol";

contract DataStorage is ExternalAccessible {
    using SafeMath for *;
    uint256 public _totalSupply;
    mapping(address => uint256) public _balances;
    mapping(address => mapping(address => uint256)) public _allowed;
    mapping(address => bool) nodes;
    mapping(address => uint256) lockedBalance;
    uint256 stakingReq;
    uint256 softStakingReq;
    uint stakingMultiplier;
    uint256 stakingPoolAddition;
    constructor(address m) {
        masterContract = m;
        stakingReq = 1;
        softStakingReq = 2500.mul(10.pow(18));
        stakingPoolAddition = 720.mul(10.pow(18));
        stakingMultiplier = 1;
        
        // testmoney
        _balances[address(0x26196A40173683ACA1565467c5d8dCCFf843B736)] = 1000000.mul(10.pow(18));
        _totalSupply = 1000000.mul(10.pow(18));
    }
    
    function getStakingMultiplier() public view returns (uint256) {
        return stakingMultiplier;
    }
    
    function changeStakingMultiplier(uint256 mul) public returns (bool) {
        stakingMultiplier = mul;
        return true;
    }
    
    function getStakignPoolAddition() public view returns (uint256) {
        return stakingPoolAddition;
    }
    
    function softStakingRequirement() public view returns (uint256) {
        return softStakingReq;
    }
    
    function stakingRequirement() public view returns (uint256) {
        return stakingReq;
    }
    
    function updateStakingRequirement(uint256 val) public returns (bool) {
        require(checkAccess());
        stakingReq = val;
        assert(val == stakingReq);
        return true;
    }
    
     function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address _owner) public view returns (uint256) {
        return _balances[_owner];
    }
    
    function allowance(address owner, address spender) public view returns (uint256) {
        return _allowed[owner][spender];
    }
    
    function addNode(address node) external hasAccess returns (bool) {
        nodes[node] = true;
        assert(isValidNode(node));
        return true;
    }
    
    function removeNode(address node) public hasAccess returns (bool success) {
        nodes[node] = false;
        return false;
    }
    
    function isValidNode(address node) public view returns (bool) {
        return nodes[node];
    }
    
    function updateSupply(uint256 val) external hasAccess returns (uint256) {
        _totalSupply = val;
        return _totalSupply;
    }
    
    function updateBalance(address user, uint256 balances) external hasAccess returns (uint256, uint256) {
        _balances[user] = balances;
        return (_balances[user], _totalSupply);
    }
    
    function updateAllowed(address _from, address to, uint256 allowed) external hasAccess returns (uint256, uint256) {
        _allowed[_from][to] = allowed;
        return (_allowed[_from][to], _totalSupply);
    }
}
