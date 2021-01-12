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
import Balance from "./Balance";
import SmartContracts from "./SmartContracts";
import PresaleRounds from "./PresaleRounds";

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

export default function PresaleRoundsModal(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className={"App"} style={{"background":"transparent", "margin-left":"auto"}}>
            {/*<button id={"submitButton"} onClick={handleOpen}><h3>Smart Contracts</h3></button>*/}
            <div s>
                    <button id={"submitButton"} style={{"width": "100%", "backgroundColor": "transparent", "box-shadow":"none"}}
                            onClick={handleOpen}><h2 >Presale</h2>
                    </button>
            </div>

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
                <Fade in={open} style={{"width":"60%"}}>
                    <PresaleRounds drizzle={props.drizzle} id={"modalPopup"}
                                    drizzleState={props.drizzleState}/>

                </Fade>
            </Modal>
        </div>
);
}