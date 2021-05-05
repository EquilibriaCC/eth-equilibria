import './App.css';
import React from 'react';
import RemoveStakeModal from "./components/RemoveStakeModal";
import WithdrawStake from "./components/WithdrawStake";
import Grid from '@material-ui/core/Grid';
import Container from 'react-bootstrap/Container';
import Balance from "./components/Balance";
import GetStake from "./components/GetStake";
import PendingRewards from "./components/PendingRewards";
import PresaleInfo from "./components/PresaleInfo";
import TelegramIcon from '@material-ui/icons/Telegram';
import TwitterIcon from '@material-ui/icons/Twitter';
import GitHubIcon from '@material-ui/icons/GitHub';
import TransitionsModal from "./components/StakingModal";
import PresaleModal from "./components/PreSaleModal";
import SmartContractModal from "./components/SmartContractModal";
import PoolPercent from "./components/PoolPercent";
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import PresaleRounds from "./components/PresaleRoundsModal";
import PresaleRoundsModal from "./components/PresaleRoundsModal";
import Swap from "./components/Swap";
import GetStakev2 from "./components/GetStakev2";
import PoolPercentv2 from "./components/PoolPercentv2";
import PendingRewardsv2 from "./components/PendingRewardsv2";
import TransitionsModalv2 from "./components/StakingModalv2";
import RemoveStakeModalv2 from "./components/RemoveStakeModalv2";
import WithdrawStakev2 from "./components/WithdrawStakev2";
import LPBalance from "./components/LPBalance";
import LockRewards from "./components/lockRewards";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            drizzleState: null,
            dataKey: null,
            dataKeyXEQ: null,
            ethPrice: 0,
            stakingType: 2,
            stakeClick: 0,
            mul: 1
        };
    }

    componentDidMount() {
        const {drizzle} = this.props;
        if (window.outerWidth < 1280)
            this.setState({mul: 2.25})
        // subscribe to changes in the store
        this.unsubscribe = drizzle.store.subscribe(() => {

            // every time the store updates, grab the state from drizzle
            const drizzleState = drizzle.store.getState();

            // check to see if it's ready, if so, update local component state
            if (drizzleState.drizzleStatus.initialized) {
                this.setState({loading: false, initialized: true, drizzleState});
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
        if (this.state.stakeClick === 0 && this.state.stakingType === 2) {
            return (
                <div id={"dataContainer"} style={{
                    "width": "80%",
                    "marginLeft": "auto",
                    "marginRight": "auto",
                    "paddingBottom": "0px"
                }}>
                    <h1>Account Info</h1>
                    <h2>wXEQ-ETH LP Balance</h2>

                    <LPBalance drizzle={this.props.drizzle}
                             drizzleState={this.state.drizzleState}
                    />
                    <div style={{"paddingBottom":"30px"}}>
                    <button id={"submitButton"} disabled onClick={() => {
                        this.handleStakeClick()
                    }}><h3>LP Staking Coming Soon</h3>
                        {/*Start LP Staking*/}
                    </button>
                    </div>
                    {window.outerWidth < 1280 &&
                    <div style={{"padding": "1.75vh", "background-color": "transparent"}}/>}

                </div>
            )
        } else if (this.state.stakeClick === 1 && this.state.stakingType === 1) {
            return (
                <div id={"dataContainer"} style={{
                    "width": "80%",
                    "marginLeft": "auto",
                    "marginRight": "auto",
                    "paddingBottom": "0px"
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


                    <div style={{"paddingBottom":"30px"}}>
                        <button id={"submitButton"} onClick={() => {
                            this.handleStakeClick()
                        }}><h3>Next</h3>
                        </button>
                    </div>
                    {window.outerWidth < 1280 &&
                    <div style={{"padding": "1.75vh", "background-color": "transparent"}}/>}

                </div>
            )
        } else if (this.state.stakeClick === 1 && this.state.stakingType === 2) {
            return (
                <div id={"dataContainer"} style={{
                    "width": "80%",
                    "marginLeft": "auto",
                    "marginRight": "auto",
                    "paddingBottom": "0px"
                }}>
                    <h1>Staking Stats</h1>
                    <h2>Current Stake</h2>
                    <GetStakev2 drizzle={this.props.drizzle}
                              drizzleState={this.state.drizzleState}
                    />

                    <h2>Staking Pool %</h2>
                    <PoolPercentv2 drizzle={this.props.drizzle}
                                 drizzleState={this.state.drizzleState}
                    />
                    <h2>Pending Rewards</h2>
                    <PendingRewardsv2 drizzle={this.props.drizzle}
                                    drizzleState={this.state.drizzleState}
                    />

                    <div style={{"paddingBottom":"30px"}}>
                        <button id={"submitButton"} onClick={() => {
                            this.handleStakeClick()
                        }}><h3>Next</h3>
                        </button>
                    </div>
                    {window.outerWidth < 1280 &&
                    <div style={{"padding": "1.75vh", "background-color": "transparent"}}/>}

                </div>
            )
        } else if (this.state.stakeClick === 2 && this.state.stakingType === 1) {
            return (
                <div id={"dataContainer"} style={{
                    "width": "80%",
                    "marginLeft": "auto",
                    "marginRight": "auto",
                    "paddingBottom": "0px"
                }}>
                    <h1>Change Stake</h1>

                    <TransitionsModal
                        drizzle={this.props.drizzle}
                        drizzleState={this.state.drizzleState}/>
                    <RemoveStakeModal drizzle={this.props.drizzle}
                                      drizzleState={this.state.drizzleState}/>
                    <WithdrawStake drizzle={this.props.drizzle}
                                   drizzleState={this.state.drizzleState}/>
                    <button id={"submitButton"} onClick={() => {
                        this.handleStakeClick()
                    }}><h3>Back</h3>
                    </button>
                    {window.outerWidth < 1280 &&
                    <div style={{"padding": "1.75vh", "background-color": "transparent"}}/>}


                </div>
            )
        } else if (this.state.stakeClick === 1 && this.state.stakingType === 2) {
            return (
                <div id={"dataContainer"} style={{
                    "width": "80%",
                    "marginLeft": "auto",
                    "marginRight": "auto",
                    "paddingBottom": "0px"
                }}>
                    <h1>Staking v2 Stats</h1>
                    <h2>Current Stake</h2>
                    <GetStakev2 drizzle={this.props.drizzle}
                                drizzleState={this.state.drizzleState}
                    />

                    <h2>Staking Pool %</h2>
                    <PoolPercentv2 drizzle={this.props.drizzle}
                                   drizzleState={this.state.drizzleState}
                    />
                    <h2>Pending Rewards</h2>
                    <PendingRewardsv2 drizzle={this.props.drizzle}
                                      drizzleState={this.state.drizzleState}
                    />

                    <button id={"submitButton"} onClick={() => {
                        this.handleStakeClick()
                    }}><h3>Next</h3>
                    </button>
                    {window.outerWidth < 1280 &&
                    <div style={{"padding": "1.75vh", "background-color": "transparent"}}/>}

                </div>
            )
        } else if (this.state.stakeClick === 2 && this.state.stakingType === 2) {
            return (
                <div id={"dataContainer"} style={{
                    "width": "80%",
                    "marginLeft": "auto",
                    "marginRight": "auto",
                    "paddingBottom": "0px"
                }}>
                    <h1>Change Stake</h1>

                    <TransitionsModalv2
                        drizzle={this.props.drizzle}
                        drizzleState={this.state.drizzleState}/>
                    <RemoveStakeModalv2 drizzle={this.props.drizzle}
                        drizzleState={this.state.drizzleState}/>
                    <WithdrawStakev2 drizzle={this.props.drizzle}
                        drizzleState={this.state.drizzleState}/>
                    <LockRewards drizzle={this.props.drizzle}
                        drizzleState={this.state.drizzleState}/>
                    <button id={"submitButton"} onClick={() => {
                        this.handleStakeClick()
                    }}><h3>Back</h3>
                    </button>
                    <div style={{"padding-top":"5%"}}/>
                    {window.outerWidth < 1280 &&
                    <div style={{"padding": "1.75vh", "background-color": "transparent"}}/>}


                </div>
            )
        }
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        console.log(this.props.drizzle.contracts)

        if (this.state.loading) return (
            <Container fluid>
                <div className={"App"} style={{
                    "height": window.outerHeight, "width": "100%"
                }}>
                    <div id={"header"}>
                        <h2 id={"headerText"}>wXEQ Dashboard</h2>
                    </div>
                    <div style={{"width": "50%", "marginLeft": "auto", "marginRight": "auto", "paddingTop": "10%"}}>
                        <h2>Please open up your preferred wallet provider to connect.</h2></div>
                </div>
            </Container>


        );

        return (
            <Container fluid style={{
                "backgroundColor": "#1d2126"
            }}>
                <div className={"footer"} style={{
                    "border-bottom": "3px solid #fff",
                    "width": "100%",
                    "box-shadow": "rgba(0, 0, 0, 0.01) 0 0 1px, rgba(0, 0, 0, 0.04) 0 4px 8px, rgba(0, 0, 0, 0.04) 0 16px 24px, rgba(0, 0, 0, 0.01) 0 24px 32px"
                }}>

                    <Grid container xs={12}

                    >
                        <Grid container item xs={2} style={{}}>
                            <h2 style={{"margin-left": "1.5vw"}}>wXEQ Dashboard</h2>
                        </Grid>
                        <Grid container item xs={2} style={{}}>
                        </Grid>
                        {window.outerWidth > 1280 &&

                        <Grid container item xs={1} style={{}}>
                            <a href={"https://equilibria.network"} target={"_blank"}
                               style={{"margin-left": "auto", "margin-right": "auto"}}>
                                <button id={"submitButton"} style={{
                                    "width": "100%",
                                    "backgroundColor": "transparent",
                                    "box-shadow": "none"
                                }}
                                ><h2>Home</h2>
                                </button>
                            </a>
                        </Grid>
                        }
                        {window.outerWidth > 1280 ?

                            <Grid container item xs={1} style={{}}>
                                <a href={"https://etherscan.io/address/0x0F1aB924fbAd4525578011b102604D3e2F11F9Ef"}
                                   target={"_blank"} style={{"margin-left": "auto", "margin-right": "auto"}}>
                                    <button id={"submitButton"} style={{
                                        "width": "100%",
                                        "backgroundColor": "transparent",
                                        "box-shadow": "none"
                                    }}
                                    ><h2>Explorer</h2>
                                    </button>
                                </a>
                            </Grid>
                            :
                            <Grid container item xs={3} style={{}}>
                                <a href={"https://etherscan.io/address/0x0F1aB924fbAd4525578011b102604D3e2F11F9Ef"}
                                   target={"_blank"} style={{"margin-left": "auto", "margin-right": "auto"}}>
                                    <button id={"submitButton"} style={{
                                        "width": "100%",
                                        "backgroundColor": "transparent",
                                        "box-shadow": "none"
                                    }}
                                    ><h2>Explorer</h2>
                                    </button>
                                </a>
                            </Grid>
                        }
                        {window.outerWidth > 1280 &&

                        <Grid container item xs={1}
                              style={{}}>
                            <SmartContractModal drizzle={this.props.drizzle}
                                                drizzleState={this.state.drizzleState}/>
                        </Grid>
                        }
                        {window.outerWidth > 1280 &&

                        <Grid container item xs={1} style={{}}>
                            <PresaleRoundsModal drizzle={this.props.drizzle}
                                                drizzleState={this.state.drizzleState}/>
                        </Grid>
                        }
                        <Grid container item xs={2} style={{}}>
                        </Grid>
                        <Grid container item xs={2} style={{"width": "100%"}}>
                            <a href={"https://info.uniswap.org/pair/0x631540a0f8908559f6c09f5bf1510e467f66715d"}
                               target={"_blank"} style={{"text-decoration": "none", "margin-left": "auto"}}>
                                <h2 style={{"margin-right": "1.5vw"}}>Uniswap</h2>
                            </a>
                        </Grid>
                    </Grid>

                    {/*<div style={{"marginTop": "8%"}}>*/}
                    {/*    <a href={"https://info.uniswap.org/pair/0xc76ff45757091b2a718da1c48a604de6cbec7f71"}*/}
                    {/*       target={"_blank"}>*/}
                    {/*        <button id={"submitButton"} style={{"width": "25%", "backgroundColor": "#ff007a"}}*/}
                    {/*                onClick={() => {*/}
                    {/*                    //this.handleStakeClick()*/}
                    {/*                }}><h2>Uniswap</h2>*/}
                    {/*        </button>*/}
                    {/*    </a>*/}
                    {/*</div>*/}


                </div>
                <div className="App">
                    {/*<div id={"header"}>*/}
                    {/*    <h2 id={"headerText"}>wXEQ Dashboard</h2><br/>*/}

                    {/*</div>*/}
                    <div id={"body"}>
                        <Grid container spacing={10}
                              style={{
                                  "marginTop": "auto",

                                  "marginLeft": "auto",
                                  "marginRight": "auto",

                              }} id={"gridContainer"}>
                            <Grid container item xs={12} lg={6} style={{
                                "marginTop": window.outerHeight / 15,
                                "margin-left": "auto",
                                "margin-right": "auto"
                            }}>
                                <Grid container item xs={12}>
                                    {this.stakingBox()
                                    }
                                </Grid>
                            </Grid>

                            {/*<Grid container item xs={12} lg={6} style={{*/}
                            {/*    "marginTop": window.outerHeight / 15,*/}
                            {/*    "margin-left": "auto",*/}
                            {/*    "margin-right": "auto"*/}
                            {/*}}>*/}
                            {/*    <Grid container item xs={12}>*/}
                            {/*        <div id={"dataContainer"}*/}
                            {/*             style={{"width": "80%", "marginLeft": "auto", "marginRight": "auto"}}>*/}
                            {/*            <PresaleInfo drizzle={this.props.drizzle}*/}
                            {/*                         drizzleState={this.state.drizzleState}/>*/}
                            {/*            /!*<PresaleModal*!/*/}
                            {/*            /!*    drizzle={this.props.drizzle}*!/*/}
                            {/*            /!*    drizzleState={this.state.drizzleState}/>*!/*/}
                            {/*        </div>*/}
                            {/*    </Grid>*/}
                            {/*</Grid>*/}

                            <Grid container item xs={12} lg={6} style={{
                                "marginTop": window.outerHeight / 15,
                                "margin-left": "auto",
                                "margin-right": "auto"
                            }}>
                                <Grid container item xs={12}>
                                    <div id={"dataContainer"}
                                         style={{"width": "80%", "marginLeft": "auto", "marginRight": "auto"}}>
                                        <Swap drizzle={this.props.drizzle}
                                              drizzleState={this.state.drizzleState}/>
                                        {/* <PresaleModal
                                            drizzle={this.props.drizzle}
                                            drizzleState={this.state.drizzleState}/> */}
                                    </div>
                                </Grid>
                            </Grid>

                        </Grid>
                    </div>
                </div>
                {window.outerWidth < 1280 && <div style={{"padding": "10vh", "background-color": "#1d212663"}}/>}
                <div className={"footer"} style={{"border-top": "1px solid #fff", "width": "100%", "padding": "auto"}}>

                    <Grid container xm={12}

                    ><Grid container item xs={4} style={{"marginRight": "auto", "marginTop": "8px"}}>
                    </Grid>

                        <Grid container item xs={1} style={{"marginLeft": "auto", "marginTop": "8px"}}>
                            <a href={"https://wiki.equilibria.network"} target={"_blank"}
                               style={{"marginLeft": "auto", "marginRight": "auto"}}>

                                <HelpOutlineIcon style={{"color": "#fff", "margin": "auto", "height": "80px"}}/>
                            </a>
                        </Grid>
                        <Grid container item xs={1}
                              style={{"marginLeft": "auto", "marginRight": "auto", "marginTop": "8px"}}>
                            <a href={"https://t.me/EquilibriaNetwork"} target={"_blank"}
                               style={{"marginLeft": "auto", "marginRight": "auto"}}>

                                <TelegramIcon style={{"color": "#fff", "margin": "auto", "height": "80px"}}/>
                            </a>
                        </Grid>
                        <Grid container item xs={1}
                              style={{"marginLeft": "auto", "marginRight": "auto", "marginTop": "8px"}}>
                            <a href={"https://twitter.com/EquilibriaCC"} target={"_blank"}
                               style={{"marginLeft": "auto", "marginRight": "auto"}}>

                                <TwitterIcon style={{"color": "#fff", "margin": "auto", "height": "80px"}}/>
                            </a>
                        </Grid>
                        <Grid container item xs={1} style={{"marginRight": "auto", "marginTop": "8px"}}>
                            <a href={"https://github.com/EquilibriaCC/eth-equilibria"} target={"_blank"}
                               style={{"marginLeft": "auto", "marginRight": "auto"}}>
                                <GitHubIcon style={{"color": "#fff", "margin": "auto", "height": "80px"}}/>
                            </a>
                        </Grid>
                        <Grid container item xs={4} style={{"marginLeft": "auto", "marginTop": "8px"}}>
                        </Grid>
                    </Grid>


                </div>
            </Container>

        );
    }
}

export default App;
