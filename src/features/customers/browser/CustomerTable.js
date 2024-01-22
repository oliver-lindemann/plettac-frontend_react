import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import CustomerTableItem from "./CustomerTableItem";

function CustomerTable({ customers, isLoading, handleViewCustomer, handleDeleteCustomer }) {

    return (
        <TableContainer component={Paper} className="">
            <Table size="small">
                <TableHead style={{ backgroundColor: '#212529' }}>
                    <TableRow >
                        <TableCell padding="none" className="p-2 ps-3" style={{ color: 'white' }}><b>Name</b></TableCell>
                        <TableCell padding="none" className="p-2 ps-3" style={{ color: 'white' }}><b>Straße</b></TableCell>
                        <TableCell padding="none" className="p-2 ps-3" style={{ color: 'white' }}><b>Ort</b></TableCell>
                        <TableCell padding="none" className="p-2 ps-3" style={{ color: 'white' }}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        customers.length > 0
                            ? (customers.map((customer, index) =>
                                <CustomerTableItem
                                    key={customer._id}
                                    customer={customer}
                                    isLoading={isLoading}
                                    handleViewCustomer={handleViewCustomer}
                                    handleDeleteCustomer={handleDeleteCustomer}
                                />
                            ))
                            : (<TableRow><TableCell colSpan={4}>Keine Kunden vorhanden.</TableCell></TableRow>)
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default CustomerTable;