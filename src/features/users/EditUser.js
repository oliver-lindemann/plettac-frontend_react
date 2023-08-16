import { useNavigate, useParams } from 'react-router-dom';

import UserContent from './UserContent'
import Swal from 'sweetalert2';
import CenteredPulseLoader from '../../components/loading/CenteredPulseLoader';

import { updateUser } from '../../app/api/usersApi';
import useUser from '../../hooks/users/useUser';
import { useSnackbar } from 'notistack';


const EditUser = () => {

    const navigate = useNavigate();

    const { id } = useParams();
    const {
        user,
        isLoading,
        mutate
    } = useUser(id);
    const { enqueueSnackbar } = useSnackbar();

    const handleUserSave = async (updatedUser) => {
        try {
            await updateUser(updatedUser);
            mutate();
            enqueueSnackbar("Benutzer erfoglreich gespeichert!", { variant: 'success' });
            navigate('/users');
        } catch (error) {
            let errorMessage;
            switch (error.response?.status) {
                case 400:
                    errorMessage = 'Es sind nicht genügend Daten an den Server gesendet worden';
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

    if (!user || isLoading) {
        return (<CenteredPulseLoader />);
    }

    return (
        <UserContent
            user={user}
            onSaveButtonClicked={handleUserSave}
        />
    );
}

export default EditUser