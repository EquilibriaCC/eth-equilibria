// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import "../tools/ExternalAccessible.sol";
import "../tools/Ownable.sol";
import "./OracleMaster.sol";

contract Oracle is Ownable, ExternalAccessible {
    uint256 public creationDate;
    uint256 public lastProof;
    uint256 public tokensLocked;
    OracleMaster public oracleMasterContract;

    event Creation(address indexed from, address owner);
    event Deletion(address indexed from, address owner);
    event Proof(address indexed from, address owner, uint256 block);
    event NewInput(address indexed from, address owner, uint256 block);

    
    constructor(address o, address m) {
        creationDate = block.number;
        lastProof = block.number;
        oracleMasterContract = OracleMaster(msg.sender);
        transferOwnership(o);
        masterContract = m;
    }
    
    function sendProof() public onlyOwner returns (bool) {
        if (block.number + 100 > lastProof) {
            if (block.number > (lastProof + 6500)) {
                removeOracle();
                return false;
            }
            lastProof = block.number;
            oracleMasterContract.incrementOracleNum();
        }
        return true;
    }
    
    function removeOracle() public onlyOwner hasAccess returns (bool) {
        return true;
    }
    
    function sendNumberData(address task, uint256 val) public onlyOwner returns (bool) {
        bool success = oracleMasterContract.sendNumberData(task, val);
        require(success);
        return true;
    }
    
    function sendStringData(address task, string memory val) public onlyOwner returns (bool) {
        bool success = oracleMasterContract.sendStringData(task, val);
        require(success);
        return true;
    }
    
    function sendBoolData(address task, bool val) public onlyOwner returns (bool) {
        bool success = oracleMasterContract.sendBoolData(task, val);
        require(success);
        return true;
    }
    
    function sendSwapData(address task, string memory method, uint256 val) public onlyOwner returns (bool) {
        bool success = oracleMasterContract.sendSwapData(method, task, val);
        require(success);
        return true;
    }
}