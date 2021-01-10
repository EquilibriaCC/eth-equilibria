import React from "react";
import TextField from "@material-ui/core/TextField";
/* global BigInt */

class AddStake extends React.Component {
    state = { stackId: null, val: 0};

    handleKeyDown = e => {
        // if the enter key is pressed, set the value with the string
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
        if (Object.keys(this.props.drizzleState.contracts.wXEQ.allowance).length > 0)
            appCoins = (Number(this.props.drizzleState.contracts.wXEQ.allowance[Object.keys(this.props.drizzleState.contracts.wXEQ.allowance)[0]].value))
        if (value > appCoins)
            return


        const instance = new drizzle.web3.eth.Contract(contract.abi, contract.address);

                const stackId = contract.methods["enter"].cacheSend( value,
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
        if (Object.keys(this.props.drizzleState.contracts.wXEQ.allowance).length > 0)
            appCoins = (Number(this.props.drizzleState.contracts.wXEQ.allowance[Object.keys(this.props.drizzleState.contracts.wXEQ.allowance)[0]].value)/10**18).toLocaleString()
        return (
            <div>
                <h6>Lock wXEQ and Earn Rewards<br/>(you currently have {appCoins} approved)</h6>
                <input type="text" onChange={(e) => {this.setState({val: e.target.value})}}  placeholder="Amount to Stake" onKeyDown={this.handleKeyDown} />
                <div id={"inputBox"}><p>{this.getTxStatus()}</p></div>
                <div style={{"paddingBottom":"30px"}}>
                    <button id={"submitButton"} onClick={ () => {this.setValue(this.state.val)}}><h3>Submit</h3></button>
                </div>
            </div>
        );
    }
}

export default AddStake;