const MyStringStore = artifacts.require("./tools/master.sol");

contract("Master", accounts => {
    it("should store the string 'Hey there!'", async () => {
        const myStringStore = await MyStringStore.deployed();

        // Set myString to "Hey there!"
        // await myStringStore.getOracleContract("Hey there!", { from: accounts[0] });

        // Get myString from public variable getter
        const storedString = await myStringStore.wXEQContract.call();

        assert.equal(storedString, "Hey there!", "The string was not stored");
    });
});