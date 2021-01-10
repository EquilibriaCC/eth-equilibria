import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
        backgroundColor: "#252525",
        width: "70%",
        marginLeft: "auto",
        marginRight: "auto",
        borderRadius: "25px"
    },
});

function createData(name, address) {
    return { name, address };
}

let rows = [
    createData('Master', "0xDf5295b6C6a9aE5EFE835a835B08108849c4E6C8"),
    createData('wXEQ', "0xB32a0fA07078abF5F8F8646d1EbE56C92e718A59"),
    createData('Data Store', "0xf45600fa6b472643147f1000c34355DE59EE0Bd9"),
    createData('PreSale', "0x1a3612aE3376353fA6FCB201565C9cFeFfb787f6"),
    createData('Staking', "0x88A536B406E2381Ce63EfE7B82934080d16bfF88"),
    createData('Swaps', "0xDC01d087F16411A76B517889A59DfA73beBCbf17"),
]

export default function BasicTable(props) {
    const classes = useStyles();
    console.log(props.drizzleState)
    // if (props.drizzleState.contracts.Master.initialized) {
    //     rows = [
    //         createData('Master', props.drizzleState.contracts.Master.masterContract["0x0"]),
    //         createData('wXEQ', "0xB32a0fA07078abF5F8F8646d1EbE56C92e718A59"),
    //         createData('Data Store', "0xf45600fa6b472643147f1000c34355DE59EE0Bd9"),
    //         createData('PreSale', "0x1a3612aE3376353fA6FCB201565C9cFeFfb787f6"),
    //         createData('Staking', "0x88A536B406E2381Ce63EfE7B82934080d16bfF88"),
    //         createData('Swaps', "0xDC01d087F16411A76B517889A59DfA73beBCbf17"),
    //     ]
    // }

    return (
        <TableContainer component={Paper} style={{"backgroundColor":"transparent"}} id={"modalPopup"}>
            <Table className={classes.table} aria-label="simple table" id={"modalPopup"}>
                <TableHead>
                    <TableRow>
                        <TableCell><h2>Contract Name</h2></TableCell>
                        <TableCell ><h2>Address</h2></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.name}>
                            <TableCell component="th" scope="row">
                                <h3>{row.name}</h3>
                            </TableCell>
                            <TableCell ><h3>{row.address}</h3></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}