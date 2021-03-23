import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import PreSale from "./PreSale";
import AddStakev2 from "./SoftStakev2";
import ApproveCoins from "./Approve";
import RemoveStake from "./RemoveStake";
import Grid from '@material-ui/core/Grid';
import WithdrawStake from "./WithdrawStake";
import Allowance from "./Allowance";
import ApproveCoinsv2 from "./Approvev2";

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

export default function TransitionsModalv2(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className={"App"} style={{"background":"transparent", "paddingBottom":"30px"}}>
            <button id={"submitButton"} onClick={handleOpen}><h3>Add Stake</h3></button>

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
                    <div className={"App"} style={{"background":"transparent", "width":"60%", "marginRight":"auto", "marginLeft":"auto"}} id={"modalPopup"} >
                        <Grid container spacing={0} id={"modalPopup"}
                        style={{"marginLeft": "auto", "marginRight": "auto"}}>
                        <Grid container item xs={12} >

                            <Grid container item xs={12} lg={6} >
                                <div id={"dataContainer"}
                                     style={{"width": "80%", "marginLeft": "auto", "marginRight": "auto"}}>
                                    <h1>Approve wXEQ LP Tokens</h1>
                                    <ApproveCoinsv2
                                        drizzle={props.drizzle}
                                        drizzleState={props.drizzleState}/>
                                </div>
                            </Grid>

                            <Grid container item xs={12} lg={6} >
                                <div id={"dataContainer"} style={{
                                    "width": "80%",
                                    "marginLeft": "auto",
                                    "marginRight": "auto",
                                    // "marginTop": "20px"
                                }}>
                                    <h1>Stake wXEQ LP Tokens</h1>
                                    <h2>Tokens are locked for 30 days!</h2>
                                    <AddStakev2
                                        drizzle={props.drizzle}
                                        drizzleState={props.drizzleState}/>
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                    </div>
                </Fade>
            </Modal>
        </div>
);
}
