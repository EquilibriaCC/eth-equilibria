import React from "react";
/* global BigInt */

class PoolPercent extends React.Component {

    update() {
        const { drizzle } = this.props;
        let stakingAddress = drizzle.contracts.SoftStaking.address
        let wxeq = drizzle.contracts.wXEQ
        let dataKey = this.props.drizzle.contracts.SoftStaking.methods["pendingRewards"].cacheCall(drizzle.store.getState().accounts[0]);
        dataKey = this.props.drizzle.contracts.SoftStaking.methods["totalStaked"].cacheCall();


        this.setState({stakingAddress: stakingAddress, dataKey: dataKey})
    }

    componentDidMount() {
        this.update()
    }

    render() {
        // this.update()
        let approvedCoins = 0
        try {
            let key = Object.keys(this.props.drizzleState.contracts.SoftStaking["getStake"])[0]
            approvedCoins = this.props.drizzleState.contracts.SoftStaking["getStake"][key].value/this.props.drizzleState.contracts.SoftStaking["totalStaked"][this.state.dataKey].value
        } catch{}
        let coins = (Number(approvedCoins))
        console.log(coins)
        let coinDisplay = <p id={"bigNumber"} >{(Number(approvedCoins)*100).toFixed(4)}%</p>
        if (coins === "0")
            coinDisplay = <p id={"bigNumber"} style={{"color":"#ef101e"}}>{(Number(approvedCoins)/(10**18)*100).toLocaleString()}%</p>
        return (
            <div>
                {coinDisplay}
            </div>
        );
    }
}

export default PoolPercent;