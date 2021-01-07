import React from "react";

class PresaleInfo extends React.Component {
    state = { dataKey: null, dataKeyXEQ: null, dataKeyStaking: null, dataKeySale: null, ethPrice: 0 };

    update() {
        const { drizzle } = this.props;
        let stakingAddress = drizzle.contracts.SoftStaking.address
        let wxeq = drizzle.contracts.PreSale
        let dataKey = this.props.drizzle.contracts.PreSale.methods["wXEQLeft"].cacheCall();
        dataKey = this.props.drizzle.contracts.PreSale.methods["ethMinted"].cacheCall();
        dataKey = this.props.drizzle.contracts.PreSale.methods["wXEQminted"].cacheCall();

        this.setState({dataKey: dataKey})
    }

    componentDidMount() {
        this.update();
    }

    render() {
        let wXEQLeft = 0
        try {
            let key = Object.keys(this.props.drizzleState.contracts.PreSale["wXEQLeft"])[0]
            wXEQLeft = this.props.drizzleState.contracts.PreSale["wXEQLeft"][key].value
        }
        catch {

        }
        // get the contract state from drizzleState
        let wXEQMinted = 0
        let ethMinted = 0
        let finalBlock = 0
        let cap = 0

        return (
            <div>
                <h1>Presale Info</h1>
                <h2>Presale Target</h2>
                <p id={"bigNumber"}>{(10000000).toLocaleString()}</p>
                <h2>Exchange Rate</h2>
                <p id={"bigNumber"}>$0.15</p>
                <h2>wXEQ Remaining</h2>
                <p id={"bigNumber"}>{(Number(wXEQLeft)/(10**18)).toLocaleString()}</p>
                {/*<h2>Presale Expiration Block</h2>*/}
                {/*<p id={"bigNumber"} style={{"color":"#ef101e"}}>{finalBlock}</p>*/}
            </div>
        )
    }
}

export default PresaleInfo;