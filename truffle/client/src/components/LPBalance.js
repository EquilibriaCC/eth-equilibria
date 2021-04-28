import React from "react";

class LPBalance extends React.Component {
    state = { dataKeyXEQ: null, dataKeyStaking: null, dataKeyStakingv2: null};

    componentDidMount() {
        const { drizzle } = this.props;
        const contract = drizzle.contracts.IERC20;
        const stakingContract = drizzle.contracts.SoftStaking

        // let drizzle know we want to watch the `myString` method
        let dataKeyXEQ = contract.methods["balanceOf"].cacheCall(drizzle.store.getState().accounts[0]);
        let dataKeyStaking = 0//stakingContract.methods["userInfo"].cacheCall(drizzle.store.getState().accounts[0]);
        drizzle.contracts.IERC20.methods["allowance"].cacheCall(drizzle.store.getState().accounts[0], drizzle.contracts.SoftStakingv2.address);

        const stakingContractv2 = drizzle.contracts.SoftStakingv2

        // let drizzle know we want to watch the `myString` method
        // let dataKeyXEQ = contract.methods["balanceOf"].cacheCall(drizzle.store.getState().accounts[0]);
        let dataKeyStakingv2 = stakingContract.methods["userInfo"].cacheCall(drizzle.store.getState().accounts[0]);

        // save the `dataKey` to local component state for later reference
        this.setState({ dataKeyXEQ, dataKeyStaking, dataKeyStakingv2 });
    }

    render() {
        let stakingBal = 0;
        try {
            console.log(("TEST", this.props.drizzleState.contracts.SoftStakingv2["userInfo"][this.state.dataKeyStakingv2].value.amount)/(10**18))
            stakingBal = Number(this.props.drizzleState.contracts.SoftStakingv2["userInfo"][this.state.dataKeyStakingv2].value.amount)/(10**18) + Number(this.props.drizzleState.contracts.SoftStakingv2["userInfo"][this.state.dataKeyStakingv2].value.claimedBalance)/(10**18)
        } catch {

        }
        try {
            let balance = (Number(this.props.drizzleState.contracts.IERC20["balanceOf"][this.state.dataKeyXEQ].value)/(10**18) + stakingBal).toLocaleString()
            // console.log(balance)
            if (balance === "0") {
                return (
                    <div>
                        <p id={"bigNumber"} style={{"color":"#ef101e"}}>{balance}</p>
                        <h2>Unlocked Balance</h2>
                        <p id={"bigNumber"}>{(Number(this.props.drizzleState.contracts.IERC20["balanceOf"][this.state.dataKeyXEQ].value)/(10**18)).toLocaleString()}</p>
                    </div>
                )
            }
            return (
                <div>
                    <p id={"bigNumber"}>{balance}</p>
                    <h2>Unlocked Balance</h2>
                    <p id={"bigNumber"}>{(Number(this.props.drizzleState.contracts.IERC20["balanceOf"][this.state.dataKeyXEQ].value)/(10**18)).toLocaleString()}</p>
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

export default LPBalance;