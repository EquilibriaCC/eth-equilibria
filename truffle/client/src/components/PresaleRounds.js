import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
        backgroundColor: "#1d2126",
        borderColor: "#fff",
        width: "90%",
        marginLeft: "auto",
        marginRight: "auto",
        borderTopRightRadius: "25px",
        borderTopLeftRadius: "25px",
        height: "5%"
    },
});

function createData(tier, price, amount, raised, status) {
    return {tier, price, amount, raised, status};
}

export default function PresaleRoundsTable(props) {
    const classes = useStyles();
    let rows
    if (props.drizzleState.contracts.Master.initialized) {
        rows = [
            createData('1', 0.03, "500,000/500,000", "14.2", "Complete",),
            createData('2', 0.05, ((-500000) + (Number(props.drizzleState.contracts.PreSaleV2.wXEQminted["0x0"].value)/(10**18))).toLocaleString() + "/" + ((-500000) + (Number(props.drizzleState.contracts.PreSaleV2.cap["0x0"].value)/(10**18))).toLocaleString(), ((-14.2) + Number(props.drizzleState.contracts.PreSaleV2.ethMinted["0x0"].value)/(10**18)).toLocaleString(),"Ongoing"),
            createData('3', 0.1, "0/2,500,000", "0","Awaiting"),
            createData('4', 0.15, "0/4,800,000", "0","Awaiting"),
        ]
    }

    return (
        <TableContainer component={Paper} style={{"backgroundColor": "transparent", "width": "65%"}} id={"modalPopup"}>
            <Table className={classes.table} aria-label="simple table" id={"modalPopup"}>
                <TableHead>
                    <TableRow>
                        <TableCell><h2>Tier</h2></TableCell>
                        <TableCell><h2>Price (USD)</h2></TableCell>
                        <TableCell><h2>Amount (wXEQ)</h2></TableCell>
                        <TableCell><h2>Raised (ETH)</h2></TableCell>
                        <TableCell><h2>Status</h2></TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.tier}>
                            <TableCell component="th" scope="row">
                                <h3>{row.tier}</h3>
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <h3>{row.price.toLocaleString()}</h3>
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <h3>{row.amount.toLocaleString()}</h3>
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <h3>{row.raised}</h3>
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <h3>{row.status}</h3>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div style={{"height": "100px"}}></div>
        </TableContainer>
    );
}