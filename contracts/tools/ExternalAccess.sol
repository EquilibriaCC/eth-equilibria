pragma solidity >=0.4.22 <0.8.0;

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