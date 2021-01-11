import logo from './logo.svg';
import './App.css';
import React from 'react';
import ReadString from "./components/ReadString";
import SetString from "./components/Approve";
import ReadOwner from "./ReadOwner"
import ApproveCoins from "./components/Approve";
import AddStake from "./components/SoftStake";
import RemoveStake from "./components/RemoveStake";
import RemoveStakeModal from "./components/RemoveStakeModal";
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
import Loader from 'react-loader-spinner'
import {css} from "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import TextField from "@material-ui/core/TextField";
import {ReactNavbar} from "react-responsive-animate-navbar";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            drizzleState: null,
            dataKey: null,
            dataKeyXEQ: null,
            ethPrice: 0,
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
        if (this.state.stakeClick === 0) {
            return (
                <div id={"dataContainer"} style={{
                    "width": "80%",
                    "marginLeft": "auto",
                    "marginRight": "auto",
                    "paddingBottom": "0px"
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
                    <button id={"submitButton"} onClick={() => {
                        this.handleStakeClick()
                    }}><h3>Start Staking</h3>
                    </button>

                </div>
            )
        } else if (this.state.stakeClick === 1) {
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

                    <button id={"submitButton"} onClick={() => {
                        this.handleStakeClick()
                    }}><h3>Next</h3>
                    </button>

                </div>
            )
        } else if (this.state.stakeClick === 2) {
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

                </div>
            )
        }
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        if (this.state.loading) return (
            <Container fluid>
            <div className={"App"} style={{
                "height":window.outerHeight, "width":window.outerWidth,
                background: "linear-gradient(125deg, rgba(17,17,17,1) 20%, rgba(17,20,24,1) 44%, rgba(10,57,113,1) 73%, rgba(0,115,252,1) 100%)",
            }}>
                <div id={"header"}>
                    <h2 id={"headerText"}>Wrapped Equilibria Dashboard</h2>
                </div>
                <div style={{"width":"50%", "marginLeft":"auto", "marginRight":"auto", "paddingTop":"10%"}}><h2>Please open up your preferred wallet provider to connect.</h2></div>
                <Loader style={{position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}
                        type="Puff"
                        color="rgba(0,115,252,1)"
                        height={100}
                        width={100}
                        timeout={3000} //3 secs

                />
                {/*<div id={"body"}>*/}
                {/*    <div style={{"width":"50%"}}><p>"TEST</p></div>*/}
                {/*</div>*/}
            </div>
            </Container>


        );

        // if (!this.state.initialized) return (
        //     <div>No Meta Mask Found!</div>
        // )

        return (
            <Container fluid style={{
                "backgroundColor": "#252525"
            }}>
                {/* <ReactNavbar
                color="rgb(25, 25, 25)"
                logo="/xeq_logo_with_padding.png"
                menu={[]}
                social={[
                {
                    name: "Linkedin",
                    url: "https://www.linkedin.com/in/nazeh-taha/",
                    icon: ["fab", "linkedin-in"],
                },
                {
                    name: "Facebook",
                    url: "https://www.facebook.com/nazeh200/",
                    icon: ["fab", "facebook-f"],
                },
                {
                    name: "Instagram",
                    url: "https://www.instagram.com/nazeh_taha/",
                    icon: ["fab", "instagram"],
                },
                {
                    name: "Twitter",
                    url: "http://nazehtaha.herokuapp.com/",
                    icon: ["fab", "twitter"],
                },
                ]}
                style={{"marginTop":"auto", "marginBottom":"0", "marginRight": "0", "padding-bottom":"20px"}}
                /> */}
                <div className="App">
            
                    <div id={"header"}>
                        <h2 id={"headerText"}>Wrapped Equilibria Dashboard</h2>
                    </div>
                    <div id={"body"}>
                        <Grid container spacing={10}
                              style={{"marginTop":"auto","marginLeft": "auto", "marginRight": "auto"}} id={"gridContainer"}>
                            <Grid container item xs={12} lg={6} style={{"marginTop": window.outerHeight / 10}}>
                                <Grid container item xs={12} spacing={3}>
                                    {this.stakingBox()
                                    }
                                </Grid>
                            </Grid>

                            <Grid container item xs={12} lg={6} style={{"marginTop": window.outerHeight / 10}}>
                                <Grid container item xs={12} spacing={3}>
                                    <div id={"dataContainer"}
                                         style={{"width": "80%", "marginLeft": "auto", "marginRight": "auto"}}>
                                        <PresaleInfo drizzle={this.props.drizzle}
                                                     drizzleState={this.state.drizzleState}/>
                                        <PresaleModal
                                            drizzle={this.props.drizzle}
                                            drizzleState={this.state.drizzleState}/>
                                    </div>
                                </Grid>
                            </Grid>

                        </Grid>
                        <div style={{"marginTop": "8%"}}>
                            <a href={"https://info.uniswap.org/pair/0xc76ff45757091b2a718da1c48a604de6cbec7f71"}
                               target={"_blank"}>
                                <button id={"submitButton"} style={{"width": "25%", "backgroundColor": "#ff007a"}}
                                        onClick={() => {
                                            //this.handleStakeClick()
                                        }}><h2>Uniswap</h2>
                                </button>
                            </a>
                        </div>
                    </div>
                    {/*<ReadOwner*/}
                    {/*    drizzle={this.props.drizzle}*/}
                    {/*    drizzleState={this.state.drizzleState}*/}
                    {/*/>*/}
                </div>
                <div className={"footer"}>
                    <Grid container xm={12}
                    >
                        <Grid container item xs={1} style={{"marginLeft": "auto", "marginTop": "8px"}}>
                            <a href={"https://t.me/EquilibriaNetwork"} target={"_blank"}>

                                <TelegramIcon style={{"color": "#fff", "margin": "auto", "height": "80px"}}/>
                            </a>
                        </Grid>
                        <Grid container item xs={1}
                              style={{"marginLeft": "auto", "marginRight": "auto", "marginTop": "8px"}}>
                            <a href={"https://twitter.com/EquilibriaCC"} target={"_blank"}>

                                <TwitterIcon style={{"color": "#fff", "margin": "auto", "height": "80px"}}/>
                            </a>
                        </Grid>
                        <Grid container item xs={1} style={{"marginRight": "auto", "marginTop": "8px"}}>
                            <a href={"https://github.com/EquilibriaCC/eth-equilibria"} target={"_blank"}>
                                <GitHubIcon style={{"color": "#fff", "margin": "auto", "height": "80px"}}/>
                            </a>
                        </Grid>
                    </Grid>


                </div>
            </Container>

        );
    }
}

export default App;
