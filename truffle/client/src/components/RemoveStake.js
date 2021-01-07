import React from "react";
/* global BigInt */

class RemoveStake extends React.Component {
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
        value = BigInt(value) * BigInt(10**18)


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
        return (
            <div>
                <h3>Unlock some of your wXEQ from the staking pool</h3>
                <input type="text" id={"inputText"} placeholder={"Amount to Remove"} onKeyDown={this.handleKeyDown} />
                <div id={"inputBox"}><p>{this.getTxStatus()}</p></div>
            </div>
        );
    }
}

export default RemoveStake;