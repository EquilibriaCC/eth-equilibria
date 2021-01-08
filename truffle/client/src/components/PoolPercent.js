import React from "react";
/* global BigInt */

class PoolPercent extends React.Component {

    update() {
        const { drizzle } = this.props;
        let stakingAddress = drizzle.contracts.SoftStaking.address
        let wxeq = drizzle.contracts.wXEQ
        let dataKey = this.props.drizzle.contracts.SoftStaking.methods["getPendingReward"].cacheCall(drizzle.store.getState().accounts[0]);
        dataKey = this.props.drizzle.contracts.SoftStaking.methods["totalStaked"].cacheCall();
        let dataKeyStaking = this.props.drizzle.contracts.SoftStaking.methods["userInfo"].cacheCall(drizzle.store.getState().accounts[0]);


        this.setState({stakingAddress: stakingAddress, dataKey: dataKey, dataKeyStaking : dataKeyStaking })
    }

    componentDidMount() {
        this.update()
    }

    render() {
        let approvedCoins = 0
        let staked = 0;
        try {
           staked = this.props.drizzleState.contracts.SoftStaking["userInfo"][this.state.dataKeyStaking].value.amount
           approvedCoins = staked/this.props.drizzleState.contracts.SoftStaking["totalStaked"][this.state.dataKey].value
        } catch{}
        let coins = (Number(approvedCoins))
        let coinDisplay = <p id={"bigNumber"} >{(Number(approvedCoins)*100).toFixed(4)}%</p>
        if (coins === 0)
            coinDisplay = <p id={"bigNumber"} style={{"color":"#ef101e"}}>{(Number(approvedCoins)/(10**18)*100).toLocaleString()}%</p>
        return (
            <div>
                {coinDisplay}
            </div>
        );
    }
}

export default PoolPercent;