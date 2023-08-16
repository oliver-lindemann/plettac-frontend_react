import { Search } from "@mui/icons-material";
import { InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { useState } from "react";
import { removeWhitespace } from "../../utils/StringUtils";
import CustomerListItem from "./CustomerListItem";

function CustomersList({ customers }) {

    const [searchQuery, setSearchQuery] = useState('');
    const searchValues = searchQuery.toLowerCase().split(' ');
    const filteredCustomer = customers?.filter(customer => searchValues.every(searchValue => removeWhitespace(JSON.stringify(customer)).toLowerCase().includes(searchValue))) || [];

    return (
        <>
            <TextField
                type="text"
                fullWidth
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Kunden durchsuchen"
                InputProps={{
                    startAdornment: <InputAdornment position="start"><Search /></InputAdornment>
                }}
            />

            <TableContainer component={Paper} className="mt-3 mb-5">
                <Table>
                    <TableHead style={{ backgroundColor: '#212529' }}>
                        <TableRow>
                            <TableCell padding="none" className='p-2 ps-3' style={{ color: 'white' }}><b>Kunde</b></TableCell>
                            <TableCell padding="none" className='p-2 ps-3'></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            filteredCustomer.length > 0
                                ? (filteredCustomer.map(customer => <CustomerListItem customer={customer} key={customer._id} />))
                                : (<TableRow><TableCell colSpan="2">Noch keine Kunden vorhanden!</TableCell></TableRow>)
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default CustomersList;