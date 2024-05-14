import { useNavigate } from "react-router-dom";
import { useSWRConfig } from "swr";
import { useConfirmDialog } from "../../hooks/dialogs/useConfirm";
import InventoryListItem from "./InventoryListItem";
import {
    deleteInventory,
    inventoriesUrlEndpoint as cacheKey
} from '../../app/api/inventoriesApi';
import Swal from "sweetalert2";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useSnackbar } from "notistack";

function InventoriesList({ inventories }) {

    const { mutate } = useSWRConfig();
    const { enqueueSnackbar } = useSnackbar();

    const navigate = useNavigate();
    const handleEditInventory = (user) => navigate(`/inventories/${user._id}`);

    const [openDialog, DialogComponent] = useConfirmDialog();

    const handleDeleteInventory = (inventory) => {

        const onConfirm = async () => {
            try {
                const result = await deleteInventory(inventory._id);
                mutate(cacheKey);
                enqueueSnackbar(`Inventur ${inventory.name} gelöscht.`, { variant: 'success' });
            } catch (err) {
                Swal.fire({
                    title: "Fehler beim Löschen der Inventur",
                    text: err.message,
                    icon: 'error'
                });
            }
        }

        openDialog({
            title: "Inventur löschen?",
            content: `Möchtest du die Inventur '${inventory.name}' wirklich löschen?`,
            onConfirm: onConfirm,
        });

    }

    return (
        <>
            {DialogComponent}
            <TableContainer component={Paper} className="mb-5">
            <Table>
                <TableHead style={{ backgroundColor: '#212529' }}>
                        <TableRow>
                            <TableCell padding="none" className='p-2 ps-3 ' style={{ color: 'white' }}><b>Inventur</b></TableCell>
                            <TableCell padding="none" className='p-2 ps-3 ' style={{ color: 'white' }}><b>Datum</b></TableCell>
                            <TableCell padding="none" className='p-2 ps-3 '></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            inventories.length > 0
                                ? (inventories.map(inventory => {
                                    return <InventoryListItem
                                        inventory={inventory}
                                        handleEditInventory={handleEditInventory}
                                        handleDeleteInventory={handleDeleteInventory}
                                        key={inventory._id}
                                    />
                                }))
                                : (<TableRow><TableCell colSpan="3">Noch keine Inventur vorhanden!</TableCell></TableRow>)
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default InventoriesList;