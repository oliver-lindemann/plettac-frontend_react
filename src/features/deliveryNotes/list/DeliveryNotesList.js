import { useMemo, useState } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { useNavigate } from "react-router-dom";

import { Search } from "@mui/icons-material";
import { Alert, CircularProgress, InputAdornment, TablePagination, TextField, ThemeProvider, Typography, createTheme, useTheme } from "@mui/material";

import useDeliveryNotes from "../../../hooks/deliveryNotes/useDeliveryNotes";
import { removeWhitespace } from "../../../utils/StringUtils";
import { isDraftDismissIcon } from "../../../utils/checklist/ChecklistUtils";
import { DELIVERY_NOTE_DRAFT } from "../editableContent/EditableDeliveryNoteContent";
import DeliveryNoteTable from "./browser/DeliveryNoteTable";
import DeliveryNoteTableCompact from "./mobile/DeliveryNoteTableCompact";

import { deDE } from '@mui/material/locale';
import { formatDeliveryNoteNumber } from "../../../config/deliveryNote";

function DeliveryNotesList() {

    const navigate = useNavigate();

    const {
        deliveryNotes,
    } = useDeliveryNotes();

    const populatedDeliveryNotes = deliveryNotes?.map(deliveryNote => ({ ...deliveryNote, uniqueNumber: formatDeliveryNoteNumber(deliveryNote) }));

    const theme = useTheme();
    const themeWithLocale = useMemo(() => createTheme(theme, deDE), [theme]);

    const [searchQuery, setSearchQuery] = useState('');
    const searchValues = searchQuery.toLowerCase().split(' ');
    const filteredDeliveryNotes = populatedDeliveryNotes?.filter(deliveryNote => searchValues.every(searchValue => removeWhitespace(JSON.stringify(deliveryNote)).toLowerCase().includes(searchValue)));

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [deliveryNoteDraft, setDeliveryNoteDraft] = useState(localStorage.getItem(DELIVERY_NOTE_DRAFT));

    if (!deliveryNotes) {
        return <div className="d-flex justify-content-center align-items-center gap-2">
            <CircularProgress color="error" />
            Lade Lieferscheine...
        </div>
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

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
                </div>
                <DeliveryNoteTableCompact deliveryNotes={filteredDeliveryNotes} />
            </MobileView>
            <BrowserView>
                <div className="d-flex justify-content-center">
                    <Typography fontSize={26}>Lieferscheine</Typography>
                </div>
                <hr className="p-0 m-0 mb-1" />
                <div className="d-flex justify-content-between align-items-center">

                    <TextField
                        type="text"
                        size='small'
                        sx={{ width: '30%' }}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Lieferscheine durchsuchen..."
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><Search /></InputAdornment>
                        }}
                    />
                    <ThemeProvider theme={themeWithLocale}>
                        <TablePagination
                            component="div"
                            className='tablePagination'
                            count={filteredDeliveryNotes?.length}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            rowsPerPageOptions={[5, 10, 20, 50]}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </ThemeProvider>
                </div>

                <DeliveryNoteTable deliveryNotes={filteredDeliveryNotes?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)} />

            </BrowserView>

        </>
    );
}

export default DeliveryNotesList;