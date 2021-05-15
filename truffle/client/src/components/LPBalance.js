import React from "react";
/* global BigInt */

class LPBalance extends React.Component {
    state = { dataKeyXEQ: null, dataKeyStaking: null, dataKeyStakingv2: null, stakingv2DataKey: null};

    componentDidMount() {
        const { drizzle } = this.props;
        const contract = drizzle.contracts.IERC20;
        const stakingContract = drizzle.contracts.SoftStaking
        const stakingv2 = drizzle.contracts.StakingPools

        let dataKey = stakingv2.methods["getStakeTotalUnclaimed"].cacheCall(drizzle.store.getState().accounts[0], 1)
        stakingv2.methods["getStakeTotalDeposited"].cacheCall(drizzle.store.getState().accounts[0], 1)
        stakingv2.methods["getPoolTotalDeposited"].cacheCall(1)


        // let drizzle know we want to watch the `myString` method
        let dataKeyXEQ = contract.methods["balanceOf"].cacheCall(drizzle.store.getState().accounts[0]);
        let dataKeyStaking = 0//stakingContract.methods["userInfo"].cacheCall(drizzle.store.getState().accounts[0]);
        drizzle.contracts.IERC20.methods["allowance"].cacheCall(drizzle.store.getState().accounts[0], drizzle.contracts.StakingPools.address);

        const stakingv2DataKey = drizzle.contracts.SoftStakingv2

        // let drizzle know we want to watch the `myString` method
        // let dataKeyXEQ = contract.methods["balanceOf"].cacheCall(drizzle.store.getState().accounts[0]);
        let dataKeyStakingv2 = stakingContract.methods["userInfo"].cacheCall(drizzle.store.getState().accounts[0]);

        // save the `dataKey` to local component state for later reference
        this.setState({ dataKeyXEQ, dataKeyStaking, dataKeyStakingv2, stakingv2DataKey });
    }

    render() {
        let stakingBal = 0;
        try {
            stakingBal = Number(this.props.drizzleState.contracts.StakingPools.getStakeTotalDeposited[Object.keys(this.props.drizzleState.contracts.StakingPools.getStakeTotalDeposited)[0]].value)/(10**18)
        } catch {

        }
        try {
            let balance = (Number(this.props.drizzleState.contracts.IERC20["balanceOf"][this.state.dataKeyXEQ].value)/(10**18) + stakingBal).toLocaleString()
            // console.log(balance)
            if (balance === "0") {
                return (
                    <div>
                        <p id={"bigNumber"} style={{"color":"#ef101e"}}>{balance}</p>
                        <h2>Unlocked wXEQ-ETH LP Balance</h2>
                        <p id={"bigNumber"}>{(Number(this.props.drizzleState.contracts.IERC20["balanceOf"][this.state.dataKeyXEQ].value)/(10**18)).toLocaleString()}</p>
                    </div>
                )
            }
            return (
                <div>
                    <p id={"bigNumber"}>{balance}</p>
                    <h2>Unlocked wXEQ-ETH LP Balance</h2>
                    <p id={"bigNumber"}>{(Number(this.props.drizzleState.contracts.IERC20["balanceOf"][this.state.dataKeyXEQ].value)/(10**18)).toLocaleString()}</p>
                </div>
            )
        } catch {
            return <div>
                <p id={"bigNumber"} style={{"color":"#ef101e"}}>0</p>
                <h2>Unlocked wXEQ-ETH LP Balance</h2>
                <p id={"bigNumber"}>{0}</p>
            </div>
        }
    }
}

export default LPBalance;
