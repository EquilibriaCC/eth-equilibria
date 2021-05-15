import React from "react";

class PendingRewards extends React.Component {
    state = { dataKeyStaking: null, dataKeyStaking2: null };

    componentDidMount() {
        const { drizzle } = this.props;
        console.log(drizzle)
        // const contract = drizzle.contracts.wXEQ;
        const stakingContract = drizzle.contracts.SoftStakingv2

        // let drizzle know we want to watch the `myString` method
        // let dataKeyXEQ = contract.methods["balanceOf"].cacheCall(drizzle.store.getState().accounts[0]);
        let dataKeyStaking = stakingContract.methods["getPendingReward"].cacheCall(drizzle.store.getState().accounts[0]);
        // let dataKeyStaking2 = stakingContract.methods["getFeeReward"].cacheCall(drizzle.store.getState().accounts[0]);

        // save the `dataKey` to local component state for later reference
        this.setState({ dataKeyStaking,  });
    }

    render() {
        try {
            let pendingRewards = ((Number(this.props.drizzleState.contracts.StakingPools.getStakeTotalUnclaimed[Object.keys(this.props.drizzleState.contracts.StakingPools.getStakeTotalUnclaimed)[0]].value)/(10**18))).toLocaleString()
            console.log(pendingRewards)
            if (pendingRewards === "0") {
                return <p id={"bigNumber"} style={{"color":"#ef101e"}}>{pendingRewards} wXEQ</p>
            }
            return <p id={"bigNumber"}>{pendingRewards}</p>
        } catch {
            return <p id={"bigNumber"} style={{"color":"#ef101e"}}>0</p>
        }
    }
}

export default PendingRewards;
