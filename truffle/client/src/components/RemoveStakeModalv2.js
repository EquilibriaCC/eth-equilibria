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
import RemoveStakev2 from "./RemoveStakev2";

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

export default function RemoveStakeModalv2(props) {
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
            <button id={"submitButton"} onClick={handleOpen}><h3>Remove Stake</h3></button>

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
                    <div className={"App"} style={{"background":"transparent", "width":"60%"}} id={"modalPopup"} >
                        <Grid container spacing={0} id={"modalPopup"}
                        style={{"marginLeft": "auto", "marginRight": "auto"}}>
                            <Grid container item xs={12}>
                                <div id={"dataContainer"}
                                     style={{"width": "90%", "marginLeft": "auto", "marginRight": "auto"}}>
                                    <h1>Remove Stake</h1>
                                    <RemoveStakev2
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
