// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25 <0.8.0;

import "../wXEQ.sol";
import "../wXEQSale.sol";
import "../wXEQStaking.sol";
import "../wXEQSwaps.sol";
import "./DataStorage.sol";
import "./Accessible.sol";
import "./Upgradeable.sol";
import "./SafeMath.sol";


contract Master is Accessible, Upgradeable {
    using SafeMath for uint256;
    
    wXEQ public wXEQContract;
    address public presaleContract;
    DataStorage public backupContract;
    OracleMaster public oracleContract;
    SoftStaking public softStakingContract;
    XEQSwaps public swapContract;

    uint256 devFeeVal1;
    uint256 devFeeVal2;

    constructor() {
        masterContract = address(this);
    access.push(msg.sender);
        access.push(address(this));
    }

    function updateAddress(address w, address d, address pre, address staking, address swap) public onlyOwner returns (bool) {
        masterContract = address(this);
        wXEQContract = wXEQ(address(w));
        backupContract = DataStorage(address(d));
        presaleContract = address(pre);
        softStakingContract = SoftStaking(address(staking));
        swapContract = XEQSwaps(address(swap));
        access.push(address(wXEQContract));
        access.push(address(backupContract));
        access.push(pre);
        access.push(address(backupContract));
        access.push(address(softStakingContract));
        access.push(address(swapContract));
        return true;
    }
    
    function getOracleContract() public view returns (address) {
        return address(oracleContract);
    }

    function getWXEQContract() public view returns (address) {
        return address(wXEQContract);
    }

    function getWXEQSaleContract() public view returns (address) {
        return address(presaleContract);
    }

    function getWXEQStakingContract() public view returns (address) {
        return address(softStakingContract);
    }

    function getWXEQSwapContract() public view returns (address) {
        return address(swapContract);
    }

    function getDataStorageContract() public view returns (address) {
        return address(backupContract);
    }

}
