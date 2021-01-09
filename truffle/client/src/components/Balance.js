import React from "react";

class Balance extends React.Component {
    state = { dataKeyXEQ: null, dataKeyStaking: null };

    componentDidMount() {
        const { drizzle } = this.props;
        const contract = drizzle.contracts.wXEQ;
        const stakingContract = drizzle.contracts.SoftStaking

        // let drizzle know we want to watch the `myString` method
        let dataKeyXEQ = contract.methods["balanceOf"].cacheCall(drizzle.store.getState().accounts[0]);
        let dataKeyStaking = 0//stakingContract.methods["userInfo"].cacheCall(drizzle.store.getState().accounts[0]);
        drizzle.contracts.wXEQ.methods["allowance"].cacheCall(drizzle.store.getState().accounts[0], drizzle.contracts.SoftStaking.address);

        // save the `dataKey` to local component state for later reference
        this.setState({ dataKeyXEQ, dataKeyStaking });
    }

    render() {
        let stakingBal = 0;
        try {
            stakingBal = Number(this.props.drizzleState.contracts.SoftStaking["userInfo"][this.state.dataKeyStaking].value.amount)/(10**18)
        } catch {

        }
        try {
            
            let balance = (Number(this.props.drizzleState.contracts.wXEQ["balanceOf"][this.state.dataKeyXEQ].value)/(10**18) + stakingBal).toLocaleString()
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
            return <div>
                <p id={"bigNumber"} style={{"color":"#ef101e"}}>0</p>
                <h2>Unlocked Balance</h2>
                <p id={"bigNumber"}>{0}</p>
            </div>
        }
    }
}

export default Balance;