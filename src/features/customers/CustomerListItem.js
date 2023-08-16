import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { useSWRConfig } from "swr";
import {
    deleteCustomer,
    customersUrlEndpoint as cacheKey
} from '../../app/api/customersApi';

import { BsTrash } from 'react-icons/bs'
import { concatString } from "../../utils/StringUtils";
import { TableCell, TableRow, Typography } from "@mui/material";
import { useSnackbar } from "notistack";

function CustomerListItem({ customer }) {

    const { mutate } = useSWRConfig()
    const { enqueueSnackbar } = useSnackbar();

    const navigate = useNavigate();
    const handleEditCustomer = () => navigate(`/customers/${customer._id}`);

    async function handleDeleteCustomer() {
        const result = await Swal.fire({
            title: 'Kunden löschen?',
            text: 'Möchtest du den Kunden wirklich löschen?',
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: 'Abbrechen',
            confirmButtonText: 'Ja'
        });

        if (result.isConfirmed) {
            try {
                const result = await deleteCustomer(customer._id);
                mutate(cacheKey);
                enqueueSnackbar("Kunde " + customer.name + " gelöscht.", { variant: 'success' });
            } catch (err) {
                Swal.fire({
                    title: "Fehler beim Löschen des Kundens",
                    text: err.message,
                    icon: 'error'
                });
            }
        }
    }

    return (
        <TableRow className="container m-0 p-0 ">
            <TableCell padding="normal" className="col clickable" onClick={handleEditCustomer}>
                <Typography variant="body1">{customer.name}</Typography>
                <Typography variant="body2">{concatString(customer.street, customer.city, ', ')}</Typography>
            </TableCell>
            <TableCell padding="normal" className="col centertext">
                <Button
                    variant='outline-danger'
                    onClick={handleDeleteCustomer}
                >
                    <BsTrash size="1.5em" />
                </Button>
            </TableCell>
        </TableRow>
    );
}

export default CustomerListItem;