import React from "react";
/* global BigInt */

class Allowance extends React.Component {

    update() {
        const { drizzle } = this.props;
        let stakingAddress = drizzle.contracts.SoftStaking.address
        let wxeq = drizzle.contracts.wXEQ
        let dataKey = this.props.drizzle.contracts.SoftStaking.methods["getPendingReward"].cacheCall(drizzle.store.getState().accounts[0]);

        dataKey = this.props.drizzle.contracts.SoftStaking.methods["totalAmountStaked"].cacheCall();


        this.setState({stakingAddress: stakingAddress, dataKey: dataKey})
    }

    componentDidMount() {
        this.update()
    }

    render() {
        let approvedCoins = 0
        try {
            approvedCoins = this.props.drizzleState.contracts.SoftStaking["getPendingReward"][this.state.dataKey].value
        } catch{}
        let coins = (Number(approvedCoins)/(10**18)).toLocaleString()
        let coinDisplay = <p id={"bigNumber"} style={{"font-size":"50px"}}>{(Number(approvedCoins)/(10**18)).toLocaleString()}</p>
        if (coins === "0")
            coinDisplay = <p id={"bigNumber"} style={{"color":"#ef101e", "font-size":"50px"}}>{(Number(approvedCoins)/(10**18)).toLocaleString()}</p>
        return (
            <div>
                <h1>Pending Rewards</h1>
                {coinDisplay}
            </div>
        );
    }
}

export default Allowance;