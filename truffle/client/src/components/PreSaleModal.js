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

    const copyToClipboard = str => {
        // const el = document.createElement('textarea');
        // el.value = str;
        // document.body.appendChild(el);
        // el.select();
        // document.execCommand('copy');
        // document.body.removeChild(el);
    };

    let ethamount = 0
    let wXEQ_Minted = 0
    let remaining = 0

    if (Object.keys(props.drizzleState.contracts.PreSale.ethMinted).length > 0)
        ethamount = (Number(props.drizzleState.contracts.PreSale.ethMinted["0x0"].value)/(10**18)).toLocaleString()

    if (Object.keys(props.drizzleState.contracts.PreSale.wXEQminted).length > 0)
        wXEQ_Minted = (Number(props.drizzleState.contracts.PreSale.wXEQminted["0x0"].value)/(10**18)).toLocaleString()

    if (Object.keys(props.drizzleState.contracts.PreSale.wXEQLeft).length > 0)
        remaining = (Number(props.drizzleState.contracts.PreSale.wXEQLeft["0x0"].value)/(10**18)).toLocaleString()
    let text = props.drizzle.contracts.PreSale.address
    // if (copied)
    //     text = "Copied"
    return (
        <div className={"App"} style={{"background":"transparent", "padding-bottom":"30px"}}>
            <button id={"submitButton"} onClick={handleOpen}><h3>Presale</h3></button>

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
                                <div id={"dataContainer"} style={{
                                    "width": "80%",
                                    "margin-left": "auto",
                                    "margin-right": "auto",
                                }}>
                                    <h1>wXEQ Presale</h1>
                                    <h3><button style={{"width":"40%"}} onClick={copyToClipboard(props.drizzle.contracts.PreSale.address)} id={"submitButton"}><p>{text}</p></button></h3>
                                    <p>Send ETH to the above address and receive 1 wXEQ for every $0.15 worth of ETH sent.</p>
                                    <p>Total ETH Raised: {ethamount} | Total wXEQ Minted: {wXEQ_Minted} | Remaining wXEQ for sale: {remaining}</p>
                                </div>
                        </Grid>
                    </Grid>
                    </div>
                </Fade>
            </Modal>
        </div>
);
}