import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { updateDeliveryNote } from '../../app/api/deliveryNotesApi';
import useDeliveryNote from "../../hooks/deliveryNotes/useDeliveryNote";

import { Alert } from "@mui/material";
import Swal from "sweetalert2";

import CenteredPulseLoader from "../../components/loading/CenteredPulseLoader";
import { isDraftDismissIcon } from "../../utils/checklist/ChecklistUtils";
import EditableDeliveryNoteContent from "./editableContent/EditableDeliveryNoteContent";
import { useSnackbar } from "notistack";

const EditDeliveryNote = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const { deliveryNote, isLoading, mutate } = useDeliveryNote(id);
    const { enqueueSnackbar } = useSnackbar();

    const savedDraft = localStorage.getItem(id);
    const [deliveryNoteDraft, setDeliveryNoteDraft] = useState();

    const handleEditDeliveryNoteDraft = () => { setDeliveryNoteDraft(JSON.parse(savedDraft)) };
    const handleDismissDeliveryNoteDraft = () => { setDeliveryNoteDraft(null); localStorage.removeItem(id); }

    let deliveryNoteDraftAlert = null;
    if (savedDraft) {
        deliveryNoteDraftAlert = (
            <Alert
                onClose={handleDismissDeliveryNoteDraft}
                severity="info"
                onClick={(e) => { !isDraftDismissIcon(e) && handleEditDeliveryNoteDraft() }}
            >
                Es sind ungespeicherte Änderungen verfügbar. Tippe hier, um diese anzuwenden.
            </Alert>
        );
    }

    const handleUpdateDeliveryNote = async (updatedDeliveryNote) => {
        try {
            const response = await updateDeliveryNote(updatedDeliveryNote);
            mutate();
            enqueueSnackbar("Lieferschein erfoglreich gespeichert!", { variant: 'success' });
            const createdDeliveryNote = response.id;
            if (createdDeliveryNote) {
                navigate(`/deliveryNotes/${createdDeliveryNote}`);
            } else {
                navigate('/lists');
            }
            return true;
        } catch (error) {
            let errorTitle = "Nachricht vom Server";
            let errorMessage = error.response?.data?.message;

            switch (error.response?.status) {
                case 400:
                    errorTitle = "Fehlende Daten";
                    errorMessage = "Bitte vergebe ein Bauvorhaben und füge mindestens 1 benötigtes Bauelement hinzu.";
                    break;
                case 409:
                    errorTitle = "Ungültige Eingabe";
                    errorMessage = "Die eingegebene Lieferschein-Nummer ist bereits vergeben. Bitte wähle eine andere.";
                    break;
                default:
                    break;
            }
            Swal.fire({
                title: errorTitle,
                text: errorMessage,
                icon: 'warning'
            });
            return false;
        }
    }

    // Falls der Benutzer die ungespeicherten Änderungen weiterbearbeiten möchte
    // sollen diese anstelle der geladenen DeliveryNote angezeigt werden.
    // Hierzu muss das Component im Parent neu geladen werden, da geänderte
    // Props keine Auswirkung auf den State des Childs haben
    if (deliveryNoteDraft) {
        return <EditableDeliveryNoteContent
            deliveryNote={deliveryNoteDraft}
            onSaveButtonClicked={handleUpdateDeliveryNote}
        />
    }

    if (!deliveryNote || isLoading) {
        return (<CenteredPulseLoader />);
    }

    return (
        <>
            {deliveryNoteDraftAlert}
            <EditableDeliveryNoteContent
                deliveryNote={deliveryNote}
                onSaveButtonClicked={handleUpdateDeliveryNote}
            />
        </>
    );
}

export default EditDeliveryNote