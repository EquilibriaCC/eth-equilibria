import React from "react";

class GetStake extends React.Component {
    state = { dataKeyStaking: null };

    componentDidMount() {
        const { drizzle } = this.props;
        console.log(drizzle)
        // const contract = drizzle.contracts.wXEQ;
        const stakingContract = drizzle.contracts.SoftStaking

        // let drizzle know we want to watch the `myString` method
        // let dataKeyXEQ = contract.methods["balanceOf"].cacheCall(drizzle.store.getState().accounts[0]);
        let dataKeyStaking = stakingContract.methods["userInfo"].cacheCall(drizzle.store.getState().accounts[0]);

        // save the `dataKey` to local component state for later reference
        this.setState({ dataKeyStaking });
    }

    render() {
        try {
            let stake = (Number(this.props.drizzleState.contracts.SoftStaking["userInfo"][this.state.dataKeyStaking].value.amount)/(10**18)).toLocaleString()
            if (stake === "0") {
                return <p id={"bigNumber"} style={{"color":"#ef101e"}}>{stake}</p>
            }
            return <p id={"bigNumber"}>{stake}</p>
        } catch {
            return <p id={"bigNumber"} style={{"color":"#ef101e"}}>0</p>
        }
    }
}

export default GetStake;