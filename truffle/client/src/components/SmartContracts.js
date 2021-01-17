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

function createData(name, address) {
    return {name, address};
}

export default function BasicTable(props) {
    const classes = useStyles();
    console.log(props.drizzle)
    let rows
    if (props.drizzleState.contracts.Master.initialized) {
        rows = [
            createData('Master', props.drizzle.contracts.Master.address),
            createData('wXEQ', props.drizzle.contracts.wXEQ.address),
            // createData('Data Store', props.drizzle.contracts.Master.address),
            createData('Presale', props.drizzle.contracts.PreSaleV2.address),
            createData('Staking', props.drizzle.contracts.SoftStaking.address),
            // createData('Swaps', "0xDC01d087F16411A76B517889A59DfA73beBCbf17"),
        ]
    }

    return (
        <TableContainer component={Paper} style={{"backgroundColor": "transparent", "width": "65%"}} id={"modalPopup"}>
            <Table className={classes.table} aria-label="simple table" id={"modalPopup"} >
                <TableHead>
                    <TableRow>
                        <TableCell><h2>Name</h2></TableCell>
                        <TableCell><h2>Address</h2></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody >
                    {rows.map((row) => (
                        <TableRow key={row.name}>


                                <TableCell component="th" scope="row">
                                    <a style={{"text-decoration": "none"}} target={"_blank"}
                                       href={"https://etherscan.io/address/" + row.address}>
                                    <h3>{row.name}</h3>
                                    </a>

                                </TableCell>

                                <TableCell><a style={{"text-decoration": "none"}} target={"_blank"}
                                              href={"https://etherscan.io/address/" + row.address}><h3>{row.address}</h3>                            </a>
                        </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div style={{"height":"100px"}}></div>
        </TableContainer>
    );
}