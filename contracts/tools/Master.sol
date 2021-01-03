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
    PreSale public presaleContract;
    DataStorage public backupContract;
    OracleMaster public oracleContract;
    SoftStaking public softStakingContract;
    XEQSwaps public swapContract;

    uint256 devFeeVal1;
    uint256 devFeeVal2;

    constructor() {
        backupContract = new DataStorage();
        wXEQContract = new wXEQ(address(backupContract));
        presaleContract = new PreSale(address(wXEQContract), contractCreator);
        oracleContract = new OracleMaster(backupContract, address(wXEQContract));
        softStakingContract = new SoftStaking(address(backupContract), address(wXEQContract));
        swapContract = new XEQSwaps(address(wXEQContract), address(backupContract), address(this), address(oracleContract));
        access.push(address(wXEQContract));
        access.push(address(presaleContract));
        access.push(address(backupContract));
        access.push(address(oracleContract));
        access.push(address(softStakingContract));
        access.push(address(swapContract));
        access.push(address(this));
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