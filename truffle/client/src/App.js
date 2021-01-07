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

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loading: true, drizzleState: null, dataKey: null, dataKeyXEQ: null, ethPrice: 0};
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

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        if (this.state.loading) return "Loading Drizzle...";
        console.log(this.state.drizzleState, this.props)


        return (
            <Container fluid>

                <div className="App">
                    <div id={"header"}>
                        <h1 style={{"font-size":"60px"}}>Equilibria</h1>
                    </div>
                    <div id={"body"}>
                        <Grid container spacing={10}
                              style={{"margin-left": "auto", "margin-right": "auto", "width": "70%"}}>
                            <Grid container item xs={12} lg={6}  style={{"margin-top": window.outerHeight / 8}}>
                                <Grid container item xs={12} spacing={3}>

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
                                    <h2>Staked wXEQ</h2>
                                    <GetStake drizzle={this.props.drizzle}
                                              drizzleState={this.state.drizzleState}
                                    />
                                    <h2>Pending Rewards</h2>

                                    <PendingRewards drizzle={this.props.drizzle}
                                                    drizzleState={this.state.drizzleState}
                                    />
                                    <TransitionsModal
                                        drizzle={this.props.drizzle}
                                        drizzleState={this.state.drizzleState}/>
                                    <PresaleModal
                                        drizzle={this.props.drizzle}
                                        drizzleState={this.state.drizzleState}/>

                                </div>
                                </Grid>
                            </Grid>

                            <Grid container item xs={12} lg={6}  style={{"margin-top": window.outerHeight / 8}}>
                                <Grid container item xs={12} spacing={3}>
                                    <div id={"dataContainer"}
                                         style={{"width": "80%", "margin-left": "auto", "margin-right": "auto"}}>
                                        <PresaleInfo drizzle={this.props.drizzle}
                                                     drizzleState={this.state.drizzleState}/>
                                    </div>
                                </Grid>
                            </Grid>

                        </Grid>
                        <Grid container spacing={10}
                              style={{"margin-left": "auto", "margin-right": "auto", "width": "80%"}}>
                            <Grid container item xs={12} spacing={3}>
                                <div id={"dataContainer"}
                                     style={{"width": "80%", "margin-left": "auto", "margin-right": "auto"}}>
                                    <h1>Contract Addresses</h1>
                                    <BasicTable drizzle={this.props.drizzle}
                                                drizzleState={this.state.drizzleState}/>
                                </div>
                            </Grid>
                        </Grid>
                        <div style={{"width":"40%", "margin-left":"auto", "margin-right":"auto"}}>
                            <Grid container spacing={10}
                                  style={{"margin-left": "auto", "margin-right": "auto", "width": "100%"}}>
                                <Grid container item xs={4} spacing={3}>

                                        <TelegramIcon/>
                                </Grid>
                                <Grid container item xs={4} spacing={3}>

                                        <TwitterIcon/>
                                </Grid>
                                <Grid container item xs={4} spacing={3}>

                                        <GitHubIcon />
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                    <ReadOwner
                        drizzle={this.props.drizzle}
                        drizzleState={this.state.drizzleState}
                    />
                </div>
            </Container>

        );
    }
}

export default App;
