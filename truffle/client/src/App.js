import logo from './logo.svg';
import './App.css';
import React from 'react';
import ReadString from "./components/ReadString";
import SetString from "./components/Approve";
import ReadOwner from "./ReadOwner"
import ApproveCoins from "./components/Approve";
import AddStake from "./components/SoftStake";
import RemoveStake from "./components/RemoveStake";
import WithdrawStake from "./components/WithdrawStake";
import ForceRewardUpdate from "./components/ForceRewardUpdate";
import Grid from '@material-ui/core/Grid';
import Container from 'react-bootstrap/Container';
import Balance from "./components/Balance";
import GetStake from "./components/GetStake";
import PendingRewards from "./components/PendingRewards";
import PreSale from "./components/PreSale";
import PresaleInfo from "./components/PresaleInfo";
import BasicTable from "./components/SmartContracts";
import TelegramIcon from '@material-ui/icons/Telegram';
import TwitterIcon from '@material-ui/icons/Twitter';
import GitHubIcon from '@material-ui/icons/GitHub';
import Allowance from "./components/Allowance";
import TransitionsModal from "./components/StakingModal";
import PresaleModal from "./components/PreSaleModal";
import SmartContractModal from "./components/SmartContractModal";
import PoolPercent from "./components/PoolPercent";
import RemoveStakeModal from "./components/RemoveStakeModal";
import Loader from 'react-loader-spinner'
import { css } from "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loading: true, drizzleState: null, dataKey: null, dataKeyXEQ: null, ethPrice: 0, stakeClick: 0};
    }

    componentDidMount() {
        const {drizzle} = this.props;

        // subscribe to changes in the store
        this.unsubscribe = drizzle.store.subscribe(() => {

            // every time the store updates, grab the state from drizzle
            const drizzleState = drizzle.store.getState();

            // check to see if it's ready, if so, update local component state
            if (drizzleState.drizzleStatus.initialized) {
                this.setState({loading: false, drizzleState});
            }

        });
    }

    handleStakeClick() {
        let s = this.state.stakeClick
        s++
        if (s > 2)
            s = 0
        this.setState({stakeClick: s})
    }

    stakingBox() {
        if (this.state.stakeClick === 0) {
            return (
                <div id={"dataContainer"} style={{
                    "width": "80%",
                    "margin-left": "auto",
                    "margin-right": "auto",
                    "padding-bottom": "0px"
                }}>
                    <h1>Account Info</h1>
                    <h2>Balance</h2>

                    <Balance drizzle={this.props.drizzle}
                             drizzleState={this.state.drizzleState}
                    />
                    <h2>Staking Pool %</h2>
                    <PoolPercent drizzle={this.props.drizzle}
                                 drizzleState={this.state.drizzleState}
                    />
                    <button id={"submitButton"} onClick={ () => {this.handleStakeClick()}}><h3>Stake</h3>
                    </button>

                </div>
            )
        } else if (this.state.stakeClick === 1) {
            return (
                <div id={"dataContainer"} style={{
                    "width": "80%",
                    "margin-left": "auto",
                    "margin-right": "auto",
                    "padding-bottom": "0px"
                }}>
                    <h1>Staking Stats</h1>
                    <h2>Current Stake</h2>
                    <GetStake drizzle={this.props.drizzle}
                              drizzleState={this.state.drizzleState}
                    />

                    <h2>Staking Pool %</h2>
                    <PoolPercent drizzle={this.props.drizzle}
                                 drizzleState={this.state.drizzleState}
                    />
                    <h2>Pending Rewards</h2>
                    <PendingRewards drizzle={this.props.drizzle}
                                    drizzleState={this.state.drizzleState}
                    />

                    <button id={"submitButton"} onClick={ () => {this.handleStakeClick()}}><h3>Next</h3>
                    </button>

                </div>
            )
        } else if (this.state.stakeClick === 2) {
            return (
                <div id={"dataContainer"} style={{
                    "width": "80%",
                    "margin-left": "auto",
                    "margin-right": "auto",
                    "padding-bottom": "0px"
                }}>
                    <h1>Change Stake</h1>

                    <TransitionsModal
                        drizzle={this.props.drizzle}
                        drizzleState={this.state.drizzleState}/>
                        <RemoveStakeModal      drizzle={this.props.drizzle}
                                          drizzleState={this.state.drizzleState}/>
                        <WithdrawStake drizzle={this.props.drizzle}
                                       drizzleState={this.state.drizzleState}/>
                    <button id={"submitButton"} onClick={ () => {this.handleStakeClick()}}><h3>Back</h3>
                    </button>

                </div>
            )
        }
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        if (this.state.loading) return (<div 
            style={{background: "rgb(17,17,17)",
            background: "linear-gradient(125deg, rgba(17,17,17,1) 20%, rgba(17,20,24,1) 44%, rgba(10,57,113,1) 73%, rgba(0,115,252,1) 100%)"}}>
            <Loader style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        type="Puff"
        color="#00BFFF"
        height={100}
        width={100}
        timeout={3000} //3 secs

     />
     </div>
     
     
     );

        return (
            <Container fluid style={{"background-color":"#252525"}}>

                <div className="App">
                    <div id={"header"}>
                        <h2 style={{"font-size": "60px"}}>Wrapped Equilibria Dashboard</h2>
                    </div>
                    <div id={"body"}>
                        <Grid container spacing={10}
                              style={{"margin-left": "auto", "margin-right": "auto", "width": "70%"}}>
                            <Grid container item xs={12} lg={6} style={{"margin-top": window.outerHeight / 10}}>
                                <Grid container item xs={12} spacing={3}>
                                    {this.stakingBox()
                                    }
                                </Grid>
                            </Grid>

                            <Grid container item xs={12} lg={6} style={{"margin-top": window.outerHeight / 10}}>
                                <Grid container item xs={12} spacing={3}>
                                    <div id={"dataContainer"}
                                         style={{"width": "80%", "margin-left": "auto", "margin-right": "auto"}}>
                                        <PresaleInfo drizzle={this.props.drizzle}
                                                     drizzleState={this.state.drizzleState}/>
                                        <PresaleModal
                                            drizzle={this.props.drizzle}
                                            drizzleState={this.state.drizzleState}/>
                                    </div>
                                </Grid>
                            </Grid>

                        </Grid>
                        <div style={{
                            "width": "100%",
                            "height": "70px",
                            "margin-left": "auto",
                            "margin-right": "auto",
                            "background-color": "#252525",
                            "margin-top": "10%"
                        }}>

                            <Grid container xs={12}
                                  style={{"width": "30%", "margin-left": "auto", "margin-right": "auto", "margin-bottom":"0"
                                  }}>
                                <Grid container item xs={1} style={{"margin-left":"auto"}}>
                                    <a href={"https://t.me/EquilibriaNetwork"} target={"_blank"} >

                                        <TelegramIcon style={{"color": "#fff", "margin": "auto", "height":"80px"}}/>
                                    </a>
                                </Grid>
                                <Grid container item xs={1} style={{"margin-left":"auto", "margin-right":"auto"}}>
                                    <a href={"https://twitter.com/EquilibriaCC"} target={"_blank"}  >

                                        <TwitterIcon style={{"color": "#fff", "margin": "auto", "height":"80px"}} />
                                    </a>
                                </Grid>
                                <Grid container item xs={1} style={{"margin-right":"auto"}}>
                                    <a href={"https://github.com/EquilibriaCC/eth-equilibria"} target={"_blank"}  >
                                        <GitHubIcon style={{"color": "#fff", "margin": "auto", "height":"80px"}}/>
                                    </a>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                    {/*<ReadOwner*/}
                    {/*    drizzle={this.props.drizzle}*/}
                    {/*    drizzleState={this.state.drizzleState}*/}
                    {/*/>*/}
                </div>
            </Container>

        );
    }
}

export default App;
