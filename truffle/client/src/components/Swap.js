import React from "react";
import TextField from "@material-ui/core/TextField";
import {delay} from "redux-saga";
/* global BigInt */

class AddStake extends React.Component {
    state = { stackId: null, val: "", claimable: false, loading: false};

    checkClaim = async value => {
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.XEQSwaps
        if (value.val == "")
            return

        let dataKeyStaking = contract.methods["isSwapRegistered"].cacheCall(value.val);
        this.state.loading = true
        await delay(1000);
        this.state.loading = false
        for (let i = 0; i < Object.keys(this.props.drizzleState.contracts.XEQSwaps.isSwapRegistered).length; i++) {
            console.log(this.props.drizzleState.contracts.XEQSwaps.isSwapRegistered[Object.keys(this.props.drizzleState.contracts.XEQSwaps.isSwapRegistered)[i]].args)
            if (this.props.drizzleState.contracts.XEQSwaps.isSwapRegistered[Object.keys(this.props.drizzleState.contracts.XEQSwaps.isSwapRegistered)[i]].value && value.val === this.props.drizzleState.contracts.XEQSwaps.isSwapRegistered[Object.keys(this.props.drizzleState.contracts.XEQSwaps.isSwapRegistered)[i]].args[0]) {
                this.setState({claimable: true, val: value.val})
                break
            } else {
                this.setState({claimable: false})
            }
        }
    };

    
    setValue = value => {
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.XEQSwaps

        const instance = new drizzle.web3.eth.Contract(contract.abi, contract.address);
        const stackId = contract.methods["claim_wxeq"].cacheSend(value,
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
        let claimable = false
        let status = ""

        // if (Object.keys(this.props.drizzleState.contracts.XEQSwap.isSwapRegistered).length > 0)
        //     claimable = this.props.drizzleState.contracts.XEQSwap.isSwapRegistered[Object.keys(this.props.drizzleState.contracts.XEQSwap.isSwapRegistered)[0]].value

        if(this.state.claimable)
            status = "Claimable"
        else if (this.state.loading)
            status = "Loading..."
        else
            status = "Not yet registered!"

        return (
            <div>
                <h1>Swap XEQ to wXEQ</h1>
                <p>Check if your swap is registered!</p>
                <input type="text" onChange={(e) => {this.checkClaim({val: e.target.value})}}  placeholder="XEQ Transaction Hash" onKeyDown={this.handleKeyDown} />
                <p>Tx Status: {status}</p>
                <div style={{"paddingBottom":"30px"}}>
                    {
                        status === "Claimable" ?
                            <button id={"submitButton"} onClick={ () => {this.setValue(this.state.val)}}><h3>Claim Swap</h3></button>

                            :
                            <button id={"swapdisabled"} disabled><h3>Claim Swap</h3></button>

                    }
                </div>
                <div id={"inputBox"}><p>{this.getTxStatus()}</p></div>
            </div>
        );
    }
}

export default AddStake;