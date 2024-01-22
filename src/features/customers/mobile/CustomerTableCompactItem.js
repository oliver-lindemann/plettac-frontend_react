import { DeleteOutlined } from "@mui/icons-material";
import { IconButton, TableCell, TableRow, Typography } from "@mui/material";

function CustomerTableCompactItem({ customer, isLoading, handleViewCustomer, handleDeleteCustomer }) {

    const onViewCustomer = () => handleViewCustomer(customer);
    const onDeleteCustomer = () => handleDeleteCustomer(customer);

    return (
        <TableRow>
            <TableCell padding="normal" className="clickable" onClick={onViewCustomer}>
                <Typography variant="body1">
                    {customer.name}
                </Typography>
                <Typography variant="body2">
                    {customer.street}<br />
                    {customer.city}
                </Typography>
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

export default CustomerTableCompactItem;