import React from "react";
/* global BigInt */

class PreSale extends React.Component {
    state = { stackId: null, val: 0, dataKey: null};

    componentDidMount() {
        this.update();
    }

    update() {
        const { drizzle } = this.props;

        let dataKey = this.props.drizzle.contracts.PreSale.methods["lastETHPrice"].cacheCall();
        this.setState({dataKey: dataKey})
    }

    handleKeyDown = e => {
        // if the enter key is pressed, set the value with the string
        if (e.keyCode === 13) {
            this.setValue(e.target.value);
        }

    };

    setValue = value => {
        const { drizzle, drizzleState } = this.props;
        const contract = drizzle.contracts.PreSale

        if (value <= 0)
            return
        value = Math.round(value * (10**10))
        value = Number(value) * Number(10**8)

        const stackId = contract.methods["deposit"].cacheSend(
            { from: drizzleState.accounts[0], value: value }
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

    getAmount = () => {
        let coins = 0;
        let ethPrice = 0;
        if (this.state.val == 0)
            return;

        if (Object.keys(this.props.drizzleState.contracts.PreSale.lastETHPrice).length > 0)
            ethPrice = (Number(this.props.drizzleState.contracts.PreSale.lastETHPrice["0x0"].value)/(10**8))

        coins = ((ethPrice * this.state.val) / 0.15).toLocaleString()

        // otherwise, return the transaction status
        return `Receive ~${coins} wXEQ`;
    };



    render() {
        return (
            <div>
                <input type="text" style={{"width":"40%"}} onChange={(e) => {this.setState({val: e.target.value})}}  placeholder="Amount of ETH to Swap" onKeyDown={this.handleKeyDown} />
                <div id={"inputBox"}><p>{this.getAmount()}</p></div>
                <div style={{"padding-bottom":"30px"}}>
                    <button id={"submitButton"} style={{"width":"40%"}} onClick={ () => {this.setValue(this.state.val)}}><h3>Submit</h3></button>
                </div>
                <div id={"inputBox"}><p>{this.getTxStatus()}</p></div>
                <div id={"inputBox"}><p style={{"color":"#fff", "font-size":"16px"}}>{}</p></div>
            </div>
        );
    }
}

export default PreSale;