import React from 'react'
import { useNavigate } from 'react-router-dom'

import InventoryContent from './InventoryContent'
import Swal from 'sweetalert2'


import { useSWRConfig } from 'swr';
import {
    addInventory,
    inventoriesUrlEndpoint as cacheKey
} from '../../app/api/inventoriesApi';
import { useSnackbar } from 'notistack';

const NewInventory = () => {

    const navigate = useNavigate();
    const { mutate } = useSWRConfig();
    const { enqueueSnackbar } = useSnackbar();

    const handleInventorySave = async (inventory) => {
        try {
            await addInventory(inventory);
            enqueueSnackbar("Inventur erfolgreich erstellt", { variant: 'success' });
            mutate(cacheKey);
            navigate('/inventories')
        } catch (error) {
            let errorMessage;
            switch (error.response?.status) {
                case 400:
                    errorMessage = 'Bitte fülle alle geforderten Felder aus';
                    break;
                case 409:
                    errorMessage = 'Der Inventurname ist bereits vergeben. Bitte wähle einen anderen';
                    break;
                default:
                    errorMessage = 'Es ist ein Fehler aufgetreten: ' + error.message;
            }
            return Swal.fire({
                title: "Nachricht vom Server",
                text: errorMessage || error.message,
                icon: 'warning'
            });
        }
    }

    return (

        <InventoryContent
            onSaveButtonClicked={handleInventorySave}
        />
    )
}

export default NewInventory