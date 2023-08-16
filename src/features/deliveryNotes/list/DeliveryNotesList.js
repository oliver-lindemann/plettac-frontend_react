import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserView, MobileView } from "react-device-detect";

import { LocalShippingOutlined, TaskAltOutlined } from "@mui/icons-material";
import { Alert, Button, Chip, CircularProgress, Typography } from "@mui/material";

import { dayjsUTC, getDayjsWithoutTime } from "../../../utils/DateUtils";
import { isDraftDismissIcon } from "../../../utils/checklist/ChecklistUtils";
import DeliveryNoteTable from "./browser/DeliveryNoteTable";
import DeliveryNoteTableCompact from "./mobile/DeliveryNoteTableCompact";
import useDeliveryNotes from "../../../hooks/deliveryNotes/useDeliveryNotes";
import { LIST_STATUS } from "../../../config/list";
import { DELIVERY_NOTE_DRAFT } from "../editableContent/EditableDeliveryNoteContent";

function DeliveryNotesList() {

    const navigate = useNavigate();

    const {
        deliveryNotes,
    } = useDeliveryNotes();

    const [deliveryNoteDraft, setDeliveryNoteDraft] = useState(localStorage.getItem(DELIVERY_NOTE_DRAFT));
    const [showAllCompleted, setShowAllCompleted] = useState(false);

    if (!deliveryNotes) {
        return <div className="d-flex justify-content-center align-items-center gap-2">
            <CircularProgress color="error" />
            Lade Lieferscheine...
        </div>
    }

    const isChecklistCompletedToday = (checklist) => checklist.dateOfCompletion ? !getDayjsWithoutTime().isAfter(dayjsUTC(checklist.dateOfCompletion)) : false;
    const isChecklistCompleted = (checklist) => checklist.status === LIST_STATUS.DONE;
    const openDeliveryNotes = deliveryNotes.filter(checklist => !isChecklistCompleted(checklist) || isChecklistCompletedToday(checklist));
    // const closedDeliveryNotes = deliveryNotes.filter(checklist => !openDeliveryNotes.includes(checklist));

    console.log(deliveryNoteDraft);

    const handleEditDeliveryNoteDraft = () => navigate(`/deliveryNotes/new?draft=true`);
    const handleDismissDeliveryNoteDraft = () => {
        localStorage.removeItem(DELIVERY_NOTE_DRAFT);
        setDeliveryNoteDraft(null);
    }

    let deliveryNoteDraftAlert = null;
    if (deliveryNoteDraft) {
        deliveryNoteDraftAlert = (
            <Alert
                severity="info"
                className="mb-3"
                onClose={handleDismissDeliveryNoteDraft}
                onClick={(e) => { !isDraftDismissIcon(e) && handleEditDeliveryNoteDraft() }}
            >
                Du hast einen ungespeicherten Lieferschein-Entwurf. Tippe hier, um diesen zu bearbeiten.
            </Alert>
        )
    }

    return (
        <>
            {deliveryNoteDraftAlert}
            <MobileView>
                <div className="d-flex justify-content-between m-1">
                    <Typography fontWeight='bold'>Lieferscheine</Typography>
                    <Chip
                        variant={showAllCompleted ? 'filled' : 'outlined'}
                        color="success"
                        size="small"
                        icon={<TaskAltOutlined />}
                        label='Fertig'
                        onClick={() => setShowAllCompleted(showAll => !showAll)}
                    />
                </div>
                <DeliveryNoteTableCompact deliveryNotes={showAllCompleted ? deliveryNotes : openDeliveryNotes} />
            </MobileView>
            <BrowserView>
                <div className="d-flex justify-content-center">
                    <Typography fontSize={26}>Lieferscheine</Typography>
                </div>
                <hr className="p-0 m-0 mb-1" />
                <div className="pb-1 d-flex justify-content-between align-items-center">
                    <Button
                        variant="text"
                        color="inherit"
                        startIcon={<LocalShippingOutlined />}
                        onClick={() => navigate(`/deliveryNotes/new`)}
                    >Lieferschein erstellen</Button>

                    <div className="d-flex justify-content-around">
                        <Chip
                            variant={showAllCompleted ? 'filled' : 'outlined'}
                            color="success"
                            size="small"
                            icon={<TaskAltOutlined />}
                            label='Fertig'
                            // sx={{ bgcolor: showAllCompleted ? '#d7f5dd' : '' }}
                            onClick={() => setShowAllCompleted(showAll => !showAll)}
                        />
                    </div>
                </div>

                <DeliveryNoteTable deliveryNotes={showAllCompleted ? deliveryNotes : openDeliveryNotes} />
            </BrowserView>

        </>
    );
}

export default DeliveryNotesList;