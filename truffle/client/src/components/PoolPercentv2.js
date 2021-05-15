import React from "react";
/* global BigInt */

class PoolPercentv2 extends React.Component {

    update() {
        const { drizzle } = this.props;
        let stakingAddress = drizzle.contracts.SoftStakingv2.address
        let wxeq = drizzle.contracts.wXEQ
        let dataKey = this.props.drizzle.contracts.SoftStaking.methods["getPendingReward"].cacheCall(drizzle.store.getState().accounts[0]);
        dataKey = this.props.drizzle.contracts.SoftStakingv2.methods["totalStaked"].cacheCall();
        let dataKeyStaking = this.props.drizzle.contracts.SoftStakingv2.methods["userInfo"].cacheCall(drizzle.store.getState().accounts[0]);


        this.setState({stakingAddress: stakingAddress, dataKey: dataKey, dataKeyStaking : dataKeyStaking })

    }

    componentDidMount() {
        this.update()
    }

    render() {
        let approvedCoins = 0
        let staked = 0;
        let totalStaked = 0
        try {
           staked = (Number(Number(this.props.drizzleState.contracts.StakingPools.getStakeTotalDeposited[Object.keys(this.props.drizzleState.contracts.StakingPools.getStakeTotalDeposited)[0]].value)/(10**18)))
           totalStaked = (Number(Number(this.props.drizzleState.contracts.StakingPools.getPoolTotalDeposited[Object.keys(this.props.drizzleState.contracts.StakingPools.getPoolTotalDeposited)[0]].value)/(10**18)))
           approvedCoins = staked/totalStaked
        } catch{}
        let coins = approvedCoins
        let coinDisplay = <p id={"bigNumber"} >{(Number(coins)*100).toFixed(2)}%</p>
        if (staked === 0)
            coinDisplay = <p id={"bigNumber"} style={{"color":"#ef101e"}}>{(0).toLocaleString()}% </p>

        return (
            <div>
                {coinDisplay}
            </div>
        );
    }
}

export default PoolPercentv2;
