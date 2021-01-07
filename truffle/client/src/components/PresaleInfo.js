import React from "react";

class PresaleInfo extends React.Component {
    state = { dataKey: null, dataKeyXEQ: null, dataKeyStaking: null, dataKeySale: null, ethPrice: 0 };

    componentDidMount() {
        const { drizzle } = this.props;
        const saleContract = drizzle.contracts.PreSale

        // saleContract.methods["ethMinted"].cacheCall();
        // saleContract.methods["wXEQminted"].cacheCall();
        //saleContract.methods["presaleActive"].cacheCall();
        //saleContract.methods["xeqRate"].cacheCall();
        //saleContract.methods["finalBlock"].cacheCall();
        // saleContract.methods["cap"].cacheCall();
        // saleContract.methods["minGoal"].cacheCall();
        // saleContract.methods["wXEQLeft"].cacheCall();

        // fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd\n')
        //     .then(function(response) {
        //         if (response.status >= 400) {
        //             throw new Error("Bad response from server");
        //         }
        //         // this.set response.json().ethereum.usd
        //
        //     })


        // save the `dataKey` to local component state for later reference
        //this.setState({ dataKeySale });

    }

    render() {
        // get the contract state from drizzleState
        let wXEQMinted = 0
        let ethMinted = 0
        let finalBlock = 0
        let cap = 0
        let wXEQLeft = 0
        let lastEthPrice = 0
        try {
            wXEQMinted = this.props.drizzleState.contracts.PreSale["wXEQminted"]["0x0"].value
            ethMinted = this.props.drizzleState.contracts.PreSale["ethMinted"]["0x0"].value
            finalBlock = this.props.drizzleState.contracts.PreSale["finalBlock"]["0x0"].value
            cap = this.props.drizzleState.contracts.PreSale["cap"]["0x0"].value
            wXEQLeft = this.props.drizzleState.contracts.PreSale["wXEQLeft"]["0x0"].value
            lastEthPrice = this.props.drizzleState.contracts.PreSale["lastETHPrice"]["0x0"].value
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
                <p id={"bigNumber"}>{lastEthPrice}</p>
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