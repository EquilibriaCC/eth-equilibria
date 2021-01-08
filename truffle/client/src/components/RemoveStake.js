import React from "react";
/* global BigInt */

class RemoveStake extends React.Component {
    state = { stackId: null, val: 0};

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
        if (Object.keys(this.props.drizzleState.contracts.SoftStaking.getStake).length > 0)
            appCoins = (Number(this.props.drizzleState.contracts.SoftStaking.getStake[Object.keys(this.props.drizzleState.contracts.SoftStaking.getStake)[0]].value))
        if (value > appCoins)
            return


        const instance = new drizzle.web3.eth.Contract(contract.abi, contract.address);
        instance.methods.removeStake(value
        )
            .estimateGas()
            .then(gasAmount => {
                const stackId = contract.methods["removeStake"].cacheSend( value,
                    { from: drizzleState.accounts[0], gas: gasAmount }
                );
                this.setState({ stackId });
            })
            .catch(error => {
                console.log(47, error);
            });
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
        if (Object.keys(this.props.drizzleState.contracts.SoftStaking.getStake).length > 0)
            appCoins = (Number(this.props.drizzleState.contracts.SoftStaking.getStake[Object.keys(this.props.drizzleState.contracts.SoftStaking.getStake)[0]].value)/10**18).toLocaleString()
        return (
            <div>
                <h3>Unlock some of your wXEQ from the staking pool<br/>(You currently have {appCoins} wXEQ staked)</h3>
                <input style={{"width":"42.5%"}} type="text" onChange={(e) => {this.setState({val: e.target.value})}} placeholder={"Amount to Remove"} onKeyDown={this.handleKeyDown} />
                <div id={"inputBox"}><p>{this.getTxStatus()}</p></div>
                <div style={{"padding-bottom":"30px"}}>
                    <button id={"submitButton"} onClick={ () => {this.setValue(this.state.val)}}><h3>Submit</h3></button>
                </div>

            </div>
        );
    }
}

export default RemoveStake;