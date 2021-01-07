import React from "react";
/* global BigInt */

class AddStake extends React.Component {
    state = { stackId: null};

    handleKeyDown = e => {
        // if the enter key is pressed, set the value with the string
            if (e.keyCode === 13) {
                this.setValue(e.target.value);
            }

    };

    setValue = value => {
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.SoftStaking
        value = Math.round(value * (10**10))
        value = BigInt(value) * BigInt(10**8)
        console.log(value)
        let appCoins = 0
        if (Object.keys(this.props.drizzleState.contracts.wXEQ.allowance).length > 0)
            appCoins = (Number(this.props.drizzleState.contracts.wXEQ.allowance[Object.keys(this.props.drizzleState.contracts.wXEQ.allowance)[0]].value))
        if (value > appCoins)
            return


        const instance = new drizzle.web3.eth.Contract(contract.abi, contract.address);

                const stackId = contract.methods["addStake"].cacheSend( value,
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
                <h3>Lock wXEQ and Earn Rewards (you currently have {appCoins} approved)</h3>

                <input type="text" id={"inputText"} placeholder={"Amount to Stake"} onKeyDown={this.handleKeyDown} />
                <div id={"inputBox"}><p>{this.getTxStatus()}</p></div>
            </div>
        );
    }
}

export default AddStake;