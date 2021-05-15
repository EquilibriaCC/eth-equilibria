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
            createData('Access', "0x2fA24549002d507a0490eA0d04E5F23B8043C2B0 "),
            createData('wXEQ v2', "0x4a5b3d0004454988c50e8de1bcfc921ee995ade3 "),
            createData('Snapshot', "0xE946502872DA09009Aa6dc975272AC24Ab5B4f36"),
            createData('Swaps', "0x50cEB6AA41787f45d3dA5cF8432A27c451471af1 "),
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
