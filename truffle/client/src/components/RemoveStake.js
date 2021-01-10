import React from "react";
/* global BigInt */

class RemoveStake extends React.Component {
    state = { stackId: null, val: 0, dataKeyStaking: null};


    componentDidMount() {

        const { drizzle } = this.props;
        const contract = drizzle.contracts.wXEQ;
        const stakingContract = drizzle.contracts.SoftStaking

        let dataKeyStaking = stakingContract.methods["userInfo"].cacheCall(drizzle.store.getState().accounts[0]);

        // save the `dataKey` to local component state for later reference
        this.setState({ dataKeyStaking });
    }

    handleKeyDown = e => {
            if (e.keyCode === 13) {
                this.setValue(e.target.value);
            }
    };

    setValue = value => {
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.SoftStaking
        if (value <= 0)
            return
        value = Math.round(value * (10**10))
        value = BigInt(value) * BigInt(10**8)

        let appCoins = 0

        const stackId = contract.methods["leave"].cacheSend( value,
            { from: drizzleState.accounts[0]}
        );
        this.setState({ stackId });
    };

    getTxStatus = () => {
        // get the transaction states from the drizzle state
        const { transactions, transactionStack } = this.props.drizzleState;

        // get the transaction hash using our saved `stackId`
        const txHash = transactionStack[this.state.stackId];

        // if transaction hash does not exist, don't display anything
        if (!txHash) return null;

        // otherwise, return the transaction status
        return `Transaction status: ${transactions[txHash] && transactions[txHash].status}`;
    };


    render() {
        let appCoins = 0
        try {
            appCoins = (Number(this.props.drizzleState.contracts.SoftStaking["userInfo"][this.state.dataKeyStaking].value.amount)/(10**18)).toLocaleString()
        } catch {

        }

        return (
            <div>
                <h3>Unlock some of your wXEQ from the staking pool<br/>(You currently have {appCoins} wXEQ staked)</h3>
                <input style={{"width":"42.5%"}} type="text" onChange={(e) => {this.setState({val: e.target.value})}} placeholder={"Amount to Remove"} onKeyDown={this.handleKeyDown} />
                <div id={"inputBox"}><p>{this.getTxStatus()}</p></div>
                <div style={{"paddingBottom":"30px"}}>
                    <button id={"submitButton"} onClick={ () => {this.setValue(this.state.val)}}><h3>Submit</h3></button>
                </div>

            </div>
        );
    }
}

export default RemoveStake;