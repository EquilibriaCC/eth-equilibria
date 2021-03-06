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
import React from "react";

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
let copied = false
export default function PresaleModal(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    let ethamount = 0
    let wXEQ_Minted = 0
    let remaining = 0
    let ethPrice = 0
    let xeqRate = 0
    if (Object.keys(props.drizzleState.contracts.PreSaleV2.ethMinted).length > 0)
        ethamount = (Number(props.drizzleState.contracts.PreSaleV2.ethMinted["0x0"].value)/(10**18)).toLocaleString()

    if (Object.keys(props.drizzleState.contracts.PreSaleV2.wXEQminted).length > 0)
        wXEQ_Minted = (Number(props.drizzleState.contracts.PreSaleV2.wXEQminted["0x0"].value)/(10**18)).toLocaleString()

    if (Object.keys(props.drizzleState.contracts.PreSaleV2.xeqRate).length > 0)
        xeqRate = (Number(props.drizzleState.contracts.PreSaleV2.xeqRate["0x0"].value)/(10**18)).toLocaleString()

    if (Object.keys(props.drizzleState.contracts.PreSaleV2.wXEQLeft).length > 0)
        remaining = (Number(props.drizzleState.contracts.PreSaleV2.wXEQLeft["0x0"].value)/(10**18)).toLocaleString()
    console.log(props.drizzleState.contracts.PreSaleV2)

    if (Object.keys(props.drizzleState.contracts.PreSaleV2.lastETHPrice).length > 0)
        ethPrice = (Number(props.drizzleState.contracts.PreSaleV2.lastETHPrice["0x0"].value)/(10**8)).toLocaleString()
    let text = props.drizzle.contracts.PreSaleV2.address
    // if (copied)
    //     text = "Copied"
    return (
        <div className={"App"} style={{"background":"transparent", "paddingBottom":"30px"}}>
            <button id={"submitButton"} onClick={handleOpen}><h3>Crowdsale</h3></button>

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
                        <Grid container spacing={0} id={"modalPopup"}
                        style={{"marginLeft": "auto", "marginRight": "auto"}}>
                        <Grid container item xs={12} >
                                <div id={"dataContainer"} style={{
                                    "width": "80%",
                                    "marginLeft": "auto",
                                    "marginRight": "auto",
                                }}>
                                    <h1>wXEQ Crowd Sale</h1>
                                    <h3>Deposit ETH and Recieve wXEQ</h3>
                                    <p>Send ETH (${ethPrice}) to the above address and receive 1 wXEQ for every ${xeqRate} worth of ETH sent.</p>
                                    <p>Total ETH Raised: {ethamount} | Total wXEQ Minted: {wXEQ_Minted} | Remaining wXEQ for sale: {remaining}</p>
                                    <PreSale drizzle={props.drizzle}
                                    drizzleState={props.drizzleState}></PreSale>
                                </div>
                        </Grid>
                    </Grid>
                    </div>
                </Fade>
            </Modal>
        </div>
);
}
