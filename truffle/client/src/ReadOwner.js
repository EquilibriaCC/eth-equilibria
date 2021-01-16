import React from "react";

class ReadOwner extends React.Component {
    state = { dataKey: null, dataKeyXEQ: null, dataKeyStaking: null, dataKeySale: null };

    componentDidMount() {
        const { drizzle } = this.props;
        const masterContract = drizzle.contracts.Master;
        const xeqContract = drizzle.contracts.wXEQ
        const stakingContract = drizzle.contracts.SoftStaking
        const saleContract = drizzle.contracts.PreSaleV2

        // let drizzle know we want to watch the `myString` method
        let dataKey = masterContract.methods["getWXEQContract"].cacheCall();
        dataKey = masterContract.methods["masterContract"].cacheCall();
        dataKey = masterContract.methods["getDataStorageContract"].cacheCall();
        dataKey = masterContract.methods["getWXEQSaleContract"].cacheCall();
        dataKey = masterContract.methods["getWXEQStakingContract"].cacheCall();
        dataKey = masterContract.methods["getWXEQSwapContract"].cacheCall();

        let dataKeyXEQ = xeqContract.methods["balanceOf"].cacheCall(drizzle.store.getState().accounts[0]);

        let dataKeyStaking = stakingContract.methods["totalStaked"].cacheCall();
        dataKeyStaking = stakingContract.methods["totalMinted"].cacheCall();
        dataKeyStaking = stakingContract.methods["lastPayoutBlock"].cacheCall();
        dataKeyStaking = stakingContract.methods["getPendingReward"].cacheCall(drizzle.store.getState().accounts[0]);
        dataKeyStaking = stakingContract.methods["getStake"].cacheCall(drizzle.store.getState().accounts[0]);

        let dataKeySale = saleContract.methods["ethMinted"].cacheCall();
        dataKeySale = saleContract.methods["wXEQminted"].cacheCall();
        // dataKeySale = saleContr // dataKeySale = saleContract.methods["finalBlock"].cacheCall();
        //         // dataKeySale = saleContract.methods["cap"].cacheCall();
        //         // dataKeySale = saleContract.methods["minGoal"].cacheCall();
        //         // dataKeySale = saleContract.methods["wXEQLeft"].cacheCall();act.methods["presaleActive"].cacheCall();
        // dataKeySale = saleContract.methods["xeqRate"].cacheCall();



        // save the `dataKey` to local component state for later reference
        this.setState({ dataKey, dataKeyXEQ, dataKeyStaking, dataKeySale });

    }

    render() {
        // get the contract state from drizzleState
        let xeqContract
        let backupContract
        let presaleContract
        let staking
        let swap
        let master
        let balance
        let totalStaked
        let myStake
        let pendingRewards
        let lastPayout
        let wXEQMinted
        let presaleActive
        let ethMinted
        let xeqRate
        let finalBlock
        let cap
        let minGoal
        let wXEQLeft
        try {
            xeqContract = this.props.drizzleState.contracts.Master["getWXEQContract"][this.state.dataKey].value
            backupContract = this.props.drizzleState.contracts.Master["getDataStorageContract"][this.state.dataKey].value
            presaleContract = this.props.drizzleState.contracts.Master["getWXEQSaleContract"][this.state.dataKey].value
            staking = this.props.drizzleState.contracts.Master["getWXEQStakingContract"][this.state.dataKey].value
            swap = this.props.drizzleState.contracts.Master["getWXEQSwapContract"][this.state.dataKey].value
            master = this.props.drizzleState.contracts.Master["masterContract"][this.state.dataKey].value
            balance = this.props.drizzleState.contracts.wXEQ["balanceOf"][this.state.dataKeyXEQ].value + this.props.drizzleState.contracts.SoftStaking["totalStaked"][this.state.dataKey].value
            // console.log(this.props.drizzleState.contracts.SoftStaking, this.state.dataKeyStaking)

            totalStaked = this.props.drizzleState.contracts.SoftStaking["totalStaked"][this.state.dataKey].value
            //myStake = this.props.drizzleState.contracts.SoftStaking["getStake"][this.state.dataKeyStaking].value
            pendingRewards = this.props.drizzleState.contracts.SoftStaking["getPendingReward"][this.state.dataKeyStaking].value
            lastPayout = this.props.drizzleState.contracts.SoftStaking["lastPayoutBlock"][this.state.dataKey].value

            // wXEQMinted = this.props.drizzleState.contracts.PreSale["wXEQminted"][this.state.dataKeySale].value
            // presaleActive = this.props.drizzleState.contracts.PreSale["presaleActive"][this.state.dataKeySale].value
            // ethMinted = this.props.drizzleState.contracts.PreSale["ethMinted"][this.state.dataKeySale].value
            // xeqRate = this.props.drizzleState.contracts.PreSale["xeqRate"][this.state.dataKeySale].value
            // finalBlock = this.props.drizzleState.contracts.PreSale["finalBlock"][this.state.dataKeySale].value
            // cap = this.props.drizzleState.contracts.PreSale["cap"][this.state.dataKeySale].value
            // minGoal = this.props.drizzleState.contracts.PreSale["minGoal"][this.state.dataKeySale].value
            // wXEQLeft = this.props.drizzleState.contracts.PreSale["wXEQLeft"][this.state.dataKeySale].value

            // console.log(this.props.drizzleState.contracts.SoftStaking)

        } catch {
            xeqContract = "0x0"
        }
        // using the saved `dataKey`, get the variable we're interested in
        // const myString = this.props.drizzleState.contracts.Master.wXEQContract[this.state.dataKey].value;

        // if it exists, then we display its value
        return (
            <div>
                <h3>Account</h3>
                <p>wXEQ Balance: {Number(balance) / (10**18)}</p><br/>
                <h3>Contracts</h3>
                <p>Master Contract: {master}</p>
                <p>wXEQ Contract: {xeqContract}</p>
                <p>Data Store Contract: {backupContract}</p>
                <p>PreSale Contract: {presaleContract}</p>
                <p>Staking Contract: {staking}</p>
                <p>Swaps Contract: {swap}</p>
                <br/><br/>
                <h3>Staking</h3>
                <p>Total Staked: {totalStaked}</p>
                <p>My Stake: {myStake}</p>
                <p>Pending Rewards: {Number(pendingRewards)/(10**18)}</p>
                <p>Last Payout Block: {lastPayout}</p>
                <h3>Pre Sale</h3>
                <p>Status: {presaleActive}</p>
                <p>Total wXEQ Created: {Number(wXEQMinted)/(10**18)}</p>
                <p>Total ETH Raised: {Number(ethMinted)/(10**18)}</p>
                <p>wXEQ/USD Rate: {Number(xeqRate)/(10**18)}</p>
                <p>Amount of wXEQ left before goal is reached: {Number(wXEQLeft)/(10**18)}</p>
                <p>Sale Goal: {Number(cap)/(10**18)}</p>
                <p>Minimum Sale Goal: {Number(minGoal)/(10**18)}</p>
                <p>Sale Expiration Block: {finalBlock}</p>
            </div>
        )
    }
}

export default ReadOwner;