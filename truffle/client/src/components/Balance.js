import React from "react";

class Balance extends React.Component {
    state = { dataKeyXEQ: null, dataKeyStaking: null };

    componentDidMount() {
        const { drizzle } = this.props;
        console.log(drizzle)
        const contract = drizzle.contracts.wXEQ;
        const stakingContract = drizzle.contracts.SoftStaking

        // let drizzle know we want to watch the `myString` method
        let dataKeyXEQ = contract.methods["balanceOf"].cacheCall(drizzle.store.getState().accounts[0]);
        let dataKeyStaking = stakingContract.methods["getStake"].cacheCall(drizzle.store.getState().accounts[0]);

        // save the `dataKey` to local component state for later reference
        this.setState({ dataKeyXEQ, dataKeyStaking });
    }

    render() {
        try {
            let balance = ((Number(this.props.drizzleState.contracts.wXEQ["balanceOf"][this.state.dataKeyXEQ].value)/(10**18)) + (Number(this.props.drizzleState.contracts.SoftStaking["getStake"][this.state.dataKeyStaking].value)/(10**18))).toLocaleString()
            if (balance === "0") {
                return (
                    <div>
                        <p id={"bigNumber"} style={{"color":"#ef101e"}}>{balance}</p>
                        <h2>Unlocked Balance</h2>
                        <p id={"bigNumber"}>{(Number(this.props.drizzleState.contracts.wXEQ["balanceOf"][this.state.dataKeyXEQ].value)/(10**18)).toLocaleString()}</p>
                    </div>
                )
            }
            return (
                <div>
                    <p id={"bigNumber"}>{balance}</p>
                    <h2>Unlocked Balance</h2>
                    <p id={"bigNumber"}>{(Number(this.props.drizzleState.contracts.wXEQ["balanceOf"][this.state.dataKeyXEQ].value)/(10**18)).toLocaleString()}</p>
                </div>
            )
        } catch {
            return <p id={"bigNumber"} style={{"color":"#ef101e"}}>0</p>
        }
    }
}

export default Balance;