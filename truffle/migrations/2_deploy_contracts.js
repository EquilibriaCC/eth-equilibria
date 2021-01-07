const master = artifacts.require("Master");
const data = artifacts.require("DataStorage")
const wxeq = artifacts.require("wXEQ")
const presale = artifacts.require("PreSale")
const staking = artifacts.require("SoftStaking")
const swaps = artifacts.require("XEQSwaps")
module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(master)
    // await deployer.deploy(data, master.address)
    // await deployer.deploy(wxeq, data.address, master.address)
    // await deployer.deploy(presale, wxeq.address, accounts[0])
    // await deployer.deploy(staking, data.address, wxeq.address)
    // await deployer.deploy(swaps, wxeq.address, data.address, staking.address, master.address)
    // let instance = await master.deployed()
    // await swaps.deployed()
    // await instance.updateAddress(wxeq.address, data.address, presale.address, staking.address, swaps.address)
};