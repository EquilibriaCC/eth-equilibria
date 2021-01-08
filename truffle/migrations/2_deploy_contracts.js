const master = artifacts.require("Master");
const data = artifacts.require("DataStorage")
const wxeq = artifacts.require("wXEQ")
const presale = artifacts.require("PreSale")
const staking = artifacts.require("SoftStaking")
const swaps = artifacts.require("XEQSwaps")
module.exports = async function(deployer, network, accounts) {
    // await deployer.deploy(master)
    // await deployer.deploy(data, master.address)
    // await deployer.deploy(wxeq, data.address, master.address)
    //deployer.deploy(presale, "0x9822388c136Ca04297c135C62d22E623E2f429db", accounts[0])
    deployer.deploy(staking, "0x9822388c136Ca04297c135C62d22E623E2f429db", "0x4C286A534af466594faA6CC449fB174e1eed7948")
    // await deployer.deploy(swaps, wxeq.address, data.address, staking.address, master.address)
    // let instance = await master.deployed()
    // await swaps.deployed()
    // await instance.updateAddress(wxeq.address, data.address, presale.address, staking.address, swaps.address)
};