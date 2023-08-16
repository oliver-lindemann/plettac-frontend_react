import { useNavigate, useSearchParams } from 'react-router-dom'

import { useSWRConfig } from 'swr';
import { deliveryNotesUrlEndpoint, addDeliveryNote } from '../../app/api/deliveryNotesApi'

import Swal from 'sweetalert2'
import EditableDeliveryNoteContent, { DELIVERY_NOTE_DRAFT } from './editableContent/EditableDeliveryNoteContent'
import { useSnackbar } from 'notistack';

const NewDeliveryNote = () => {

    const navigate = useNavigate();
    const { mutate } = useSWRConfig();
    const { enqueueSnackbar } = useSnackbar();

    const [searchParams, setSearchParams] = useSearchParams();

    let deliveryNote = {};
    if (searchParams.get('draft')) {
        const savedDraft = localStorage.getItem(DELIVERY_NOTE_DRAFT);
        if (savedDraft) {
            deliveryNote = JSON.parse(savedDraft);
        }
    }

    const handleCreateDeliveryNote = async (deliveryNote) => {
        try {
            const response = await addDeliveryNote(deliveryNote);
            mutate(deliveryNotesUrlEndpoint);
            enqueueSnackbar(`Lieferschein erfolgreich erstellt!`, { variant: 'success' });

            const createdDeliveryNote = response.data?.id;
            if (createdDeliveryNote) {
                navigate(`/deliveryNotes/${createdDeliveryNote}`);
            } else {
                navigate('/lists');
            }

            return true;
        } catch (error) {
            let errorMessage;
            switch (error.response?.status) {
                case 400:
                    errorMessage = 'Bitte fülle alle geforderten Felder aus';
                    break;
                default:
                    errorMessage = 'Es ist ein Fehler aufgetreten: ' + error.message;
            }
            Swal.fire({
                title: "Nachricht vom Server",
                text: errorMessage || error.message,
                icon: 'warning'
            });
            return false;
        }
    }

    return (
        <EditableDeliveryNoteContent
            deliveryNote={deliveryNote}
            onSaveButtonClicked={handleCreateDeliveryNote}
        />
    )
}

export default NewDeliveryNote