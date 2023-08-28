import { useNavigate, useParams } from 'react-router-dom';

import CustomerContent from './CustomerContent'
import Swal from 'sweetalert2';
import CenteredPulseLoader from '../../components/loading/CenteredPulseLoader';

import { updateCustomer } from '../../app/api/customersApi';
import useCustomer from '../../hooks/customers/useCustomer';
import { useSnackbar } from 'notistack';


const EditCustomer = () => {

    const navigate = useNavigate();

    const { id } = useParams();
    const {
        customer,
        isLoading,
        mutate
    } = useCustomer(id);
    const { enqueueSnackbar } = useSnackbar();

    const handleCustomerSave = async (updatedCustomer) => {
        try {
            await updateCustomer(updatedCustomer);
            mutate();
            enqueueSnackbar("Kunde erfoglreich gespeichert!", { variant: 'success' });
            navigate('/customers');
        } catch (error) {
            let errorMessage;
            switch (error.response?.status) {
                case 400:
                    errorMessage = 'Es sind nicht genügend Daten an den Server gesendet worden';
                    break;
                case 409:
                    errorMessage = 'Der Kundenname ist bereits vergeben. Bitte wähle einen anderen';
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

    if (!customer || isLoading) {
        return (<CenteredPulseLoader />);
    }

    return (
        <CustomerContent
            customer={customer}
            onSaveButtonClicked={handleCustomerSave}
        />
    );
}

export default EditCustomer