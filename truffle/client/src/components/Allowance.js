import React from "react";
/* global BigInt */

class Allowance extends React.Component {

    componentDidMount() {
        const { drizzle } = this.props;
        let stakingAddress = drizzle.contracts.SoftStaking.address
        let wxeq = drizzle.contracts.wXEQ
        let dataKey = wxeq.methods["allowance"].cacheCall(drizzle.store.getState().accounts[0], stakingAddress);

        this.setState({stakingAddress: stakingAddress, dataKey: dataKey})
    }

    render() {
        let approvedCoins = 0
        try {
            approvedCoins = this.props.drizzleState.contracts.wXEQ.allowance[this.state.dataKey].value
        } catch{}
        let coins = (Number(approvedCoins)/(10**18)).toLocaleString()
        let coinDisplay = <p id={"bigNumber"} style={{"font-size":"50px"}}>{(Number(approvedCoins)/(10**18)).toLocaleString()}</p>
        if (coins === "0")
            coinDisplay = <p id={"bigNumber"} style={{"color":"#ef101e", "font-size":"50px"}}>{(Number(approvedCoins)/(10**18)).toLocaleString()}</p>
        return (
            <div>
                <h1>Staking Allowance</h1>
                {coinDisplay}
            </div>
        );
    }
}

export default Allowance;