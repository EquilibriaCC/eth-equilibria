import React from "react";

class PresaleInfo extends React.Component {
    state = { dataKey: null, dataKeyXEQ: null, dataKeyStaking: null, dataKeySale: null, ethPrice: 0 };

    update() {
        const { drizzle } = this.props;
        let stakingAddress = drizzle.contracts.SoftStaking.address
        let wxeq = drizzle.contracts.PreSale
        let dataKey = this.props.drizzle.contracts.PreSaleV2.methods["wXEQLeft"].cacheCall();
        dataKey = this.props.drizzle.contracts.PreSaleV2.methods["ethMinted"].cacheCall();
        dataKey = this.props.drizzle.contracts.PreSaleV2.methods["wXEQminted"].cacheCall();
        dataKey = this.props.drizzle.contracts.PreSaleV2.methods["lastETHPrice"].cacheCall();
        dataKey = this.props.drizzle.contracts.PreSaleV2.methods["xeqRate"].cacheCall();
        dataKey = this.props.drizzle.contracts.PreSaleV2.methods["cap"].cacheCall();

        this.setState({dataKey: dataKey})
    }

    componentDidMount() {
        this.update();
    }

    render() {
        let wXEQLeft = 0
        let xeqRate = 0
        let c = 0
        try {
            let key = Object.keys(this.props.drizzleState.contracts.PreSaleV2["wXEQLeft"])[0]
            wXEQLeft = this.props.drizzleState.contracts.PreSaleV2["wXEQLeft"][key].value
            xeqRate = (Number(this.props.drizzleState.contracts.PreSaleV2.xeqRate["0x0"].value)/(10**18)).toLocaleString()
            c = (2500000).toLocaleString()
        }
        catch {

        }
        // get the contract state from drizzleState
        let wXEQMinted = 0
        let ethMinted = 0
        let finalBlock = 0

        return (
            <div style={{"paddingTop":"0"}}>
                <h1>Crowdsale Info</h1>
                <h2>Crowdsale Target</h2>
                <p id={"bigNumber"}>{c}</p>
                <h2>Exchange Rate</h2>
                <p id={"bigNumber"}>{xeqRate}</p>
                <h2>wXEQ Remaining</h2>
                <p id={"bigNumber"}>{(Number(wXEQLeft)/(10**18)).toLocaleString()}</p>
                {/*<h2>Presale Expiration Block</h2>*/}
                {/*<p id={"bigNumber"} style={{"color":"#ef101e"}}>{finalBlock}</p>*/}
            </div>
        )
    }
}

export default PresaleInfo;