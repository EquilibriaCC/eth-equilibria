pragma solidity >=0.4.22 <0.8.0;

import "./Ownable.sol";

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