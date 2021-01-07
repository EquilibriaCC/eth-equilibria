// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

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