import React from "react";
import TextField from "@material-ui/core/TextField";
/* global BigInt */

class AddStake extends React.Component {
    state = { stackId: null, val: 0, claimable: false};

    handleKeyDown = e => {
        // if the enter key is pressed, set the value with the string
            if (e.keyCode === 13) {
                this.setValue(e.target.value);
            }

    };

    setValue = value => {
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.XEQSwaps

        if (value == "")
            return

        console.log(value)
        let dataKeyStaking = contract.methods["isSwapRegistered"].cacheCall(value);
        console.log(this.props.drizzleState.contracts.XEQSwaps.isSwapRegistered)
        this.state.claimable = this.props.drizzleState.contracts.XEQSwaps.isSwapRegistered[dataKeyStaking];
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
        let claimable = false
        let status = ""

        // if (Object.keys(this.props.drizzleState.contracts.XEQSwap.isSwapRegistered).length > 0)
        //     claimable = this.props.drizzleState.contracts.XEQSwap.isSwapRegistered[Object.keys(this.props.drizzleState.contracts.XEQSwap.isSwapRegistered)[0]].value

        if(claimable)
            status = "Claimable"
        else
            status = "Not yet registered!"

        return (
            <div>
                <h1>Swap XEQ to wXEQ</h1>
                <p>Check if your swap is registered!</p>
                <input type="text" onChange={(e) => {this.setState({val: e.target.value})}}  placeholder="XEQ Transaction Hash" onKeyDown={this.handleKeyDown} />
                <div id={"inputBox"}><p>{this.getTxStatus()}</p></div>
                <p>Status: {status}</p>
                <div style={{"paddingBottom":"30px"}}>
                    <button id={"submitButton"} onClick={ () => {this.setValue(this.state.val)}}><h3>Claim Swap</h3></button>
                </div>
            </div>
        );
    }
}

export default AddStake;