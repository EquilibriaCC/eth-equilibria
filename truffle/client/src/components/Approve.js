import React from "react";
/* global BigInt */

class ApproveCoins extends React.Component {
    state = { stackId: null, stakingAddress: null, approvedCoins: 0, dataKey: null };

    handleKeyDown = e => {
        // if the enter key is pressed, set the value with the string
        if (this.state.stakingAddress) {
            if (e.keyCode === 13) {
                this.setValue(e.target.value);
            }
        }
    };

    setValue = value => {
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.wXEQ;
        value = BigInt(value) * BigInt(10**18)
        console.log(this.state.stakingAddress)

        const instance = new drizzle.web3.eth.Contract(contract.abi, contract.address);
        instance.methods.approve(this.state.stakingAddress, value
        )
            .estimateGas()
            .then(gasAmount => {
                const stackId = contract.methods["approve"].cacheSend(this.state.stakingAddress, value, {
                    from: drizzleState.accounts[0], gas: gasAmount
                });
                this.setState({ stackId });
            })
            .catch(error => {
                console.log(47, error);
            });

        // let drizzle know we want to call the `set` method with `value`
        const stackId = contract.methods["approve"].cacheSend(this.state.stakingAddress, value, {
            from: drizzleState.accounts[0]
        });

        // save the `stackId` for later reference
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

    componentDidMount() {
        const { drizzle } = this.props;
        let stakingAddress = drizzle.contracts.SoftStaking.address

        this.setState({stakingAddress: stakingAddress})
    }

    render() {
        return (
            <div>
                <h3>Approve Coins for Staking (Required before staking)</h3>
                <input type="text" id={"inputText"} placeholder={"Amount to Approve"} onKeyDown={this.handleKeyDown} />
                <div id={"inputBox"}><p>{this.getTxStatus()}</p></div>
            </div>
        );
    }
}

export default ApproveCoins;