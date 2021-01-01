pragma solidity >=0.4.22 <0.8.0;

contract Upgradeable is Ownable {
    
    address public masterContract;
    
    constructor() {
        masterContract = msg.sender;
    }
    
    function newMaster(address addy) public onlyOwner returns (bool) {
        masterContract = addy;
    }
}