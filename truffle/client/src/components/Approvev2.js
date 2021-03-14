import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { ToastContainer, toast } from 'react-toastify';
/* global BigInt */

class ApproveCoinsv2 extends React.Component {
    state = { stackId: null, stakingAddress: null, approvedCoins: 0, dataKey: null, val: 0 };

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
        const contract = drizzle.contracts.IERC20;
        if (value <= 0)
            return
        value = Math.round(value * (10**10))
        value = BigInt(value) * BigInt(10**8)
        // const instance = new drizzle.web3.eth.Contract(contract.abi, contract.address);
        // instance.methods.approve(this.state.stakingAddress, value
        // )
        //     .estimateGas()
        //     .then(gasAmount => {
        //         const stackId = contract.methods["approve"].cacheSend(this.state.stakingAddress, value, {
        //             from: drizzleState.accounts[0], gas: gasAmount
        //         });
        //         this.setState({ stackId });
        //     })
        //     .catch(error => {
        //         console.log(47, error);
        //     });

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
        let stakingAddress = drizzle.contracts.SoftStakingv2.address

        this.setState({stakingAddress: stakingAddress})
    }

    render() {
        return (

            <div>
                <h6>Approve LP tokens for Staking<br/>(required before staking)</h6>
                <input type="text" onChange={(e) => {this.setState({val: e.target.value})}}  placeholder="Amount to Approve" onKeyDown={this.handleKeyDown} />
                <div id={"inputBox"}><p>{this.getTxStatus()}</p></div>
                <div style={{"paddingBottom":"30px"}}>
                    <button id={"submitButton"} onClick={ () => {this.setValue(this.state.val)}}><h3>Approve</h3></button>
                </div>
            </div>
        );
    }
}

export default ApproveCoinsv2;
