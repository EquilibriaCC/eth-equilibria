import React from "react";

class GetStakev2 extends React.Component {
    state = { dataKeyStaking: null };

    componentDidMount() {
        const { drizzle } = this.props;
        // const contract = drizzle.contracts.wXEQ;
        const stakingContract = drizzle.contracts.SoftStakingv2

        // let drizzle know we want to watch the `myString` method
        // let dataKeyXEQ = contract.methods["balanceOf"].cacheCall(drizzle.store.getState().accounts[0]);
        let dataKeyStaking = stakingContract.methods["userInfo"].cacheCall(drizzle.store.getState().accounts[0]);

        // save the `dataKey` to local component state for later reference
        this.setState({ dataKeyStaking });
    }

    render() {

        try {
            let stake = Number(this.props.drizzleState.contracts.StakingPools.getStakeTotalDeposited[Object.keys(this.props.drizzleState.contracts.StakingPools.getStakeTotalDeposited)[0]].value)/(10**18)

            if (stake === "0") {
                return <p id={"bigNumber"} style={{"color":"#ef101e"}}>{stake}</p>
            }
            return <p id={"bigNumber"}>{stake.toLocaleString()}</p>
        } catch {
            return <p id={"bigNumber"} style={{"color":"#ef101e"}}>0</p>
        }
    }
}

export default GetStakev2;
