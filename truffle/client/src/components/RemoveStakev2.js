import React from "react";
/* global BigInt */

class RemoveStakev2 extends React.Component {
    state = { stackId: null, val: 0, dataKeyStaking: null};

    handleKeyDown = e => {
            if (e.keyCode === 13) {
                this.setValue(e.target.value);
            }
    };

    setValue = value => {
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.StakingPools
        if (value <= 0)
            return
        value = Math.round(value * (10**10))
        value = BigInt(value) * BigInt(10**8)


        const stackId = contract.methods["withdraw"].cacheSend( 1, value,
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
        let stake = 0
        try {
           stake = Number(this.props.drizzleState.contracts.StakingPools.getStakeTotalDeposited[Object.keys(this.props.drizzleState.contracts.StakingPools.getStakeTotalDeposited)[0]].value)/(10**18)
        } catch {

        }

        return (
            <div>
                <h3>Unlock some of your wXEQ-ETH LP tokens from the staking pool<br/>(You currently have {stake} wXEQ LP tokens staked)</h3>
                <input style={{"width":"42.5%"}} type="text" onChange={(e) => {this.setState({val: e.target.value})}} placeholder={"Amount to Remove"} onKeyDown={this.handleKeyDown} />
                <div id={"inputBox"}><p>{this.getTxStatus()}</p></div>
                <div style={{"paddingBottom":"30px"}}>
                    <button id={"submitButton"} onClick={ () => {this.setValue(this.state.val)}}><h3>Remove Stake</h3></button>
                </div>

            </div>
        );
    }
}

export default RemoveStakev2;
