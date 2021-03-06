import React from "react";

class ForceRewardUpdate extends React.Component {
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


        const instance = new drizzle.web3.eth.Contract(contract.abi, contract.address);
        instance.methods.checkPayout(
        )
            .estimateGas()
            .then(gasAmount => {
                const stackId = contract.methods["checkPayout"].cacheSend(
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
                <h4>Force Staking Rewards</h4>
                <input type="text" onKeyDown={this.handleKeyDown} />
                <div>{this.getTxStatus()}</div>
            </div>
        );
    }
}

export default ForceRewardUpdate;