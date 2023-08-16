import { useNavigate } from 'react-router-dom'

import UserContent from './UserContent'
import Swal from 'sweetalert2'

import { useSWRConfig } from 'swr';
import {
    addUser,
    usersUrlEndpoint as cacheKey
} from '../../app/api/usersApi';
import { useSnackbar } from 'notistack';

const NewUser = () => {

    const navigate = useNavigate();
    const { mutate } = useSWRConfig();
    const { enqueueSnackbar } = useSnackbar();

    const handleUserSave = async (user) => {
        try {
            await addUser(user);
            enqueueSnackbar(`Benutzer ${user.name} erfolgreich erstellt!`, { variant: 'success' });
            mutate(cacheKey);
            navigate('/users')
        } catch (error) {
            let errorMessage;
            switch (error.response?.status) {
                case 400:
                    errorMessage = 'Bitte fülle alle geforderten Felder aus';
                    break;
                case 409:
                    errorMessage = 'Der Benutzername ist bereits vergeben. Bitte wähle einen anderen';
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

        <UserContent
            onSaveButtonClicked={handleUserSave}
        />
    )
}

export default NewUser