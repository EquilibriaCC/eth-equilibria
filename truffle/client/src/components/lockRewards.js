import React from "react";

class LockRewards extends React.Component {
    state = { stackId: null};

    handleKeyDown = e => {
        // if the enter key is pressed, set the value with the string
            if (e.keyCode === 13) {
                this.setValue(e.target.value);
            }

    };

    setValue = value => {
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.SoftStakingv2



        const stackId = contract.methods["lockRewards"].cacheSend(
            { from: drizzleState.accounts[0] }
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
        return `Transaction status: ${transactions[txHash] && transactions[txHash].status}`
    };


    render() {
        return (
            <div className={"App"} style={{"background":"transparent", "paddingBottom":"30px"}}>
              <button id={"submitButton"}  onClick={() => {this.setValue()}}><h3>Claim Rewards</h3></button>

            </div>

        );
    }
}

export default LockRewards;
