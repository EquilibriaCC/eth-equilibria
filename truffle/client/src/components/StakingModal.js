import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import PreSale from "./PreSale";
import AddStake from "./SoftStake";
import ApproveCoins from "./Approve";
import RemoveStake from "./RemoveStake";
import Grid from '@material-ui/core/Grid';
import WithdrawStake from "./WithdrawStake";
import Allowance from "./Allowance";

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

export default function TransitionsModal(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className={"App"} style={{"background":"transparent"}}>
            <button id={"submitButton"} onClick={handleOpen}><h3>Stake</h3></button>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open} style={{"width":"80%"}}>
                    <div className={"App"} style={{"background":"transparent", "width":"80%"}} id={"modalPopup"} >
                        <Grid container spacing={10} id={"modalPopup"}
                        style={{"margin-left": "auto", "margin-right": "auto"}}>
                        <Grid container item xs={12} >
                            <Grid container item xs={12} lg={6} >
                                <div id={"dataContainer"}
                                     style={{"width": "80%", "margin-left": "auto", "margin-right": "auto"}}>
                                    <h1>Approve Tokens</h1>
                                    <ApproveCoins
                                        drizzle={props.drizzle}
                                        drizzleState={props.drizzleState}/>
                                </div>
                            </Grid>
                            <Grid container item xs={12} lg={6} >
                                <div id={"dataContainer"} style={{
                                    "width": "80%",
                                    "margin-left": "auto",
                                    "margin-right": "auto",
                                    // "margin-top": "20px"
                                }}>
                                    <Allowance drizzle={props.drizzle}
                                               drizzleState={props.drizzleState}
                                    />
                                </div>
                            </Grid>
                        </Grid>

                            <Grid container item xs={12}>
                                <div id={"dataContainer"}
                                     style={{"width": "90%", "margin-left": "auto", "margin-right": "auto"}}>
                                    <h1>Withdraw Staking Rewards</h1>
                                    <WithdrawStake drizzle={props.drizzle}
                                                   drizzleState={props.drizzleState}
                                    />
                                </div>
                            </Grid>
                            <Grid container item xs={12} lg={6} >
                                <div id={"dataContainer"}  style={{
                                    "width": "80%",
                                    "margin-left": "auto",
                                    "margin-right": "auto",
                                    // "margin-top": "20px"
                                }}>
                                    <h1>Remove Stake</h1>
                                    <RemoveStake
                                        drizzle={props.drizzle}
                                        drizzleState={props.drizzleState}/>
                                </div>
                            </Grid>
                            <Grid container item xs={12} lg={6} >
                                <div id={"dataContainer"} style={{
                                    "width": "80%",
                                    "margin-left": "auto",
                                    "margin-right": "auto",
                                    // "margin-top": "20px"
                                }}>
                                    <h1>Stake wXEQ</h1>
                                    <AddStake
                                        drizzle={props.drizzle}
                                        drizzleState={props.drizzleState}/>
                                </div>
                            </Grid>

                    </Grid>
                    </div>
                </Fade>
            </Modal>
        </div>
);
}