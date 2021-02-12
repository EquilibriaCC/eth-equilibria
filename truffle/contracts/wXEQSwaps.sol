// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import "./tools/ExternalAccessible.sol";
import "./tools/Ownable.sol";
import "./tools/SafeMath.sol";
import "./wXEQ.sol";

contract XEQSwaps is ExternalAccessible, Ownable {
    using SafeMath for *;
    
    wXEQ wXEQContract;
    DataStorage dataStorage;

    uint256 public wXEQMinted;
    uint256 public wXEQBurned;
    uint256 public teamFees;

    uint256 teamAmount;
    uint256 burntAmount;
    uint256 devFeePercent;

    //txHash -> eth address of tx mint
    
    mapping(string => bool) xeq_complete;
    mapping(string => uint256) xeq_amounts;
    mapping(string => address) eth_addresses;

    
    constructor(address w, address d, address _master) {
        wXEQContract = wXEQ(w);
        dataStorage = DataStorage(d);
        masterContract = _master;
        wXEQMinted = 0;
        transferOwnership(msg.sender);
        teamAmount = 4000;
        burntAmount = 6000;
        devFeePercent = 100;
        
    }
    
    event NewMint(address indexed account, uint256 amount, uint256 devFee, uint256 amountBurnt);
    
    function devFee(uint256 _value, uint256 devFeeVal1) public pure returns (uint256) {
        return ((_value.mul(devFeeVal1)).div(10000));
    }
    
    function claim_wxeq(string memory tx_hash) public returns (bool) {
        require(xeq_amounts[tx_hash] != 0);
        require(eth_addresses[tx_hash] != address(0));
        require(!xeq_complete[tx_hash]);
        require(eth_addresses[tx_hash] == msg.sender);
        xeq_complete[tx_hash] = true;
        uint256 fee = devFee(xeq_amounts[tx_hash], devFeePercent);
        uint256 teamFee = devFee(fee, teamAmount);
        uint256 burnt = devFee(fee, burntAmount);
        wXEQContract.mint(eth_addresses[tx_hash], xeq_amounts[tx_hash]);
        wXEQContract.mint(owner(), teamFee);
        wXEQBurned = wXEQBurned.add(burnt);
        wXEQMinted = wXEQMinted.add(xeq_amounts[tx_hash]);
        teamFees = teamFees.add(teamFee);
        emit NewMint(eth_addresses[tx_hash], xeq_amounts[tx_hash], teamFee, burnt);
        return true;
    }
    
    
    function register_transaction(address account, string memory tx_hash, uint256 amount) public onlyOwner returns (bool) {
        require(!xeq_complete[tx_hash]);
        require(xeq_amounts[tx_hash] == 0);
        require(eth_addresses[tx_hash] == address(0));
        
        eth_addresses[tx_hash] = account;
        xeq_amounts[tx_hash] = amount;
        return true;
    }
    
    function isSwapRegistered(string memory tx_hash) public view returns (bool) {
        if(xeq_amounts[tx_hash] == 0) 
        {
            return false;
        }
        return true;
    }
    
    function testDevFeeVals(uint256 _value, uint256 val1, uint256 val2) public pure returns (uint256) {
        return (_value.mul(val1)).div(val2);
    }
    
    function setDevFee(uint256 val) public hasAccess returns (bool) {
        devFeePercent = val;
        assert(devFeePercent == val);
        return true;
    }

     function setBurntAmount(uint256 val) public hasAccess returns (bool) {
        burntAmount = val;
        assert(burntAmount == val);
        return true;
    }

    function setTeamAmount(uint256 val) public hasAccess returns (bool) {
        teamAmount = val;
        assert(teamAmount == val);
        return true;
    }

    function devFee(uint _value) public view returns (uint256) {
        return ((_value.mul(devFeePercent)).div(10000));
    }
}