import React from "react";

class PresaleInfo extends React.Component {
    state = { dataKey: null, dataKeyXEQ: null, dataKeyStaking: null, dataKeySale: null, ethPrice: 0 };

    componentDidMount() {
        const { drizzle } = this.props;
        const saleContract = drizzle.contracts.PreSale

        // let dataKeySale = saleContract.methods["ethMinted"].cacheCall();
        // dataKeySale = saleContract.methods["wXEQminted"].cacheCall();
        // dataKeySale = saleContract.methods["presaleActive"].cacheCall();
        // dataKeySale = saleContract.methods["xeqRate"].cacheCall();
        // dataKeySale = saleContract.methods["finalBlock"].cacheCall();
        // dataKeySale = saleContract.methods["cap"].cacheCall();
        // dataKeySale = saleContract.methods["minGoal"].cacheCall();
        // dataKeySale = saleContract.methods["wXEQLeft"].cacheCall();

        // fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd\n')
        //     .then(function(response) {
        //         if (response.status >= 400) {
        //             throw new Error("Bad response from server");
        //         }
        //         // this.set response.json().ethereum.usd
        //
        //     })


        // save the `dataKey` to local component state for later reference
        // this.setState({ dataKeySale });

    }

    render() {
        // get the contract state from drizzleState
        let wXEQMinted = 0
        let ethMinted = 0
        let finalBlock = 0
        let cap = 0
        let wXEQLeft = 0
        try {
            wXEQMinted = this.props.drizzleState.contracts.PreSale["wXEQminted"][this.state.dataKeySale].value
            ethMinted = this.props.drizzleState.contracts.PreSale["ethMinted"][this.state.dataKeySale].value
            finalBlock = this.props.drizzleState.contracts.PreSale["finalBlock"][this.state.dataKeySale].value
            cap = this.props.drizzleState.contracts.PreSale["cap"][this.state.dataKeySale].value
            wXEQLeft = this.props.drizzleState.contracts.PreSale["wXEQLeft"][this.state.dataKeySale].value
        } catch {
        }
        return (
            <div>
                <h1>Presale Info</h1>
                <h2>Presale Goal</h2>
                <p id={"bigNumber"}>{(Number(cap)/(10**18)).toLocaleString()}</p>
                <h2>Exchange Rate</h2>
                <p id={"bigNumber"}>$0.15</p>
                <h2>Last ETH Price</h2>
                <p id={"bigNumber"}>{this.state.ethPrice}</p>
                <h2>Total wXEQ Created</h2>
                <p id={"bigNumber"}>{(Number(wXEQMinted)/(10**18)).toLocaleString()}</p>
                <h2>Total ETH Raised</h2>
                <p id={"bigNumber"}>{(Number(ethMinted)/(10**18)).toLocaleString()}</p>
                <h2>wXEQ Remaining</h2>
                <p id={"bigNumber"}>{(Number(wXEQLeft)/(10**18)).toLocaleString()}</p>
                {/*<h2>Presale Expiration Block</h2>*/}
                {/*<p id={"bigNumber"} style={{"color":"#ef101e"}}>{finalBlock}</p>*/}
            </div>
        )
    }
}

export default PresaleInfo;