import { DeleteOutlined } from "@mui/icons-material";
import { IconButton, TableCell, TableRow } from "@mui/material";

function CustomerTableItem({ customer, isLoading, handleViewCustomer, handleDeleteCustomer }) {

    const onViewCustomer = () => handleViewCustomer(customer);
    const onDeleteCustomer = () => handleDeleteCustomer(customer);

    return (
        <TableRow>
            <TableCell padding="normal" className="col-4 clickable" onClick={onViewCustomer}>
                {customer.name}
            </TableCell>
            <TableCell padding="normal" className="col-2 clickable" onClick={onViewCustomer}>
                {customer.street}
            </TableCell>
            <TableCell padding="normal" className="col-2 clickable" onClick={onViewCustomer}>
                {customer.city}
            </TableCell>
            <TableCell padding="normal" align="center" className="col-1" >
                <IconButton
                    color='error'
                    onClick={onDeleteCustomer}
                    disabled={isLoading}
                >
                    <DeleteOutlined />
                </IconButton>
            </TableCell>
        </TableRow>
    );
}

export default CustomerTableItem;