import { Add, LocalShippingOutlined, TaskAltOutlined } from "@mui/icons-material";
import { Alert, Button, Chip, CircularProgress, Typography } from "@mui/material";
import { useState } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { useNavigate } from "react-router-dom";
import { dayjsUTC, getDayjsWithoutTime } from "../../../utils/DateUtils";
import { isDraftDismissIcon } from "../../../utils/checklist/ChecklistUtils";
import { LIST_STATUS } from "../../../config/list";

const texts = {
    deliveryNotes: {
        title: 'Lieferscheine',
        create: 'Lieferschein erstellen',
        loading: 'Lade Lieferscheine...',
        unsavedDraft: 'Du hast einen ungespeicherten Lieferschein-Entwurf. Tippe hier, um diesen zu bearbeiten.'
    },
    loadingLists: {
        title: 'Ladelisten',
        create: 'Ladeliste erstellen',
        loading: 'Lade Ladelisten...',
        unsavedDraft: 'Du hast einen ungespeicherten Ladelisten-Entwurf. Tippe hier, um diesen zu bearbeiten.'
    }
}

function ListsTable({ lists, variant, renderTable }) {

    const navigate = useNavigate();

    const draftName = `${variant}Draft`;
    const [deliveryNoteDraft, setDeliveryNoteDraft] = useState(localStorage.getItem(draftName));
    const [showAllCompleted, setShowAllCompleted] = useState(false);

    if (!lists) {
        return <div className="d-flex justify-content-center align-items-center gap-2">
            <CircularProgress color="error" />
            {texts[variant].loading}
        </div>
    }

    const isListCompletedToday = (list) => list.dateOfCompletion ? !getDayjsWithoutTime().isAfter(dayjsUTC(list.dateOfCompletion)) : false;
    const isListCompleted = (list) => list.status === LIST_STATUS.DONE;
    const openLists = lists.filter(list => !isListCompleted(list) || isListCompletedToday(list));
    // const closedLists = lists.filter(list => !openLists.includes(list));

    const handleEditDeliveryNoteDraft = () => navigate(`/${variant}/new?draft=true`);
    const handleDismissDeliveryNoteDraft = () => {
        localStorage.removeItem(draftName);
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
                {texts[variant].unsavedDraft}
            </Alert>
        )
    }

    return (
        <>
            <MobileView>
                <div className="d-flex justify-content-between m-1">
                    <Typography fontWeight='bold'>{texts[variant].title}</Typography>
                    <Chip
                        variant={showAllCompleted ? 'filled' : 'outlined'}
                        color="success"
                        size="small"
                        icon={<TaskAltOutlined />}
                        label='Fertig'
                        onClick={() => setShowAllCompleted(showAll => !showAll)}
                    />
                </div>
                {deliveryNoteDraftAlert}

                {renderTable(showAllCompleted ? lists : openLists)}
            </MobileView>
            <BrowserView>
                <div className="d-flex justify-content-center">
                    <Typography fontSize={26}>{texts[variant].title}</Typography>
                </div>
                <hr className="p-0 m-0 mb-1" />
                <div className="pb-1 d-flex justify-content-between align-items-center">
                    <Button
                        variant="text"
                        color="inherit"
                        startIcon={<Add />}
                        onClick={() => navigate(`/${variant}/new`)}
                    >
                        {texts[variant].create}
                    </Button>

                    <div className="d-flex justify-content-around">
                        {
                            // Only show 'Fertig'-Filter Option if there are more Lists to show
                            lists.length > openLists.length
                                ? (
                                    <Chip
                                        variant={showAllCompleted ? 'filled' : 'outlined'}
                                        color="success"
                                        size="small"
                                        icon={<TaskAltOutlined />}
                                        label='Fertig'
                                        // sx={{ bgcolor: showAllCompleted ? '#d7f5dd' : '' }}
                                        onClick={() => setShowAllCompleted(showAll => !showAll)}
                                    />
                                ) : null
                        }
                    </div>
                </div>
                {deliveryNoteDraftAlert}

                {renderTable(showAllCompleted ? lists : openLists)}
            </BrowserView>

        </>
    );
}

export default ListsTable;