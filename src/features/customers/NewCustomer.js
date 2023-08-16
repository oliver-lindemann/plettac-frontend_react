import React from 'react'
import { useNavigate } from 'react-router-dom'

import CustomerContent from './CustomerContent'
import Swal from 'sweetalert2'


import { useSWRConfig } from 'swr';
import {
    addCustomer,
    customersUrlEndpoint as cacheKey
} from '../../app/api/customersApi';
import { useSnackbar } from 'notistack';

const NewCustomer = ({ onCustomerSaved }) => {

    const navigate = useNavigate();
    const { mutate } = useSWRConfig();
    const { enqueueSnackbar } = useSnackbar();

    const handleCustomerSave = async (customer) => {
        try {
            console.log("Adding Customer...");
            await addCustomer(customer);
            enqueueSnackbar("Kunde erfolgreich erstellt", { variant: 'success' });
            mutate(cacheKey);
            onCustomerSaved ? onCustomerSaved(customer) : navigate('/customers');
        } catch (error) {
            let errorMessage;
            console.log("Error from save customer");
            console.log(error)
            switch (error.response?.status) {
                case 400:
                    errorMessage = 'Bitte fülle alle geforderten Felder aus';
                    break;
                case 409:
                    errorMessage = 'Der Kundenname oder Kurzname ist bereits vergeben. Bitte wähle einen anderen';
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

        <CustomerContent
            onSaveButtonClicked={handleCustomerSave}
        />
    )
}

export default NewCustomer