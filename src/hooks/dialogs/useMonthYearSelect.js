import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Tabs, Tab, Alert, FormControlLabel, Checkbox, FormGroup } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { dayjsUTC } from "../../utils/DateUtils";

const initialStartTime = dayjsUTC().startOf('month');

export const useMonthYearSelect = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [dialogProps, setDialogProps] = useState({});

    const [month, setMonth] = useState(initialStartTime);

    const openDialog = (props) => {
        setDialogProps(props);
        if (props.month) {
            setMonth(props.month);
        }
        setIsOpen(true);
    };

    const closeDialog = () => {
        setIsOpen(false);
        setMonth(initialStartTime);
    };

    const handleConfirm = () => {
        if (dialogProps.onConfirm) {
            dialogProps.onConfirm(month);
        }
        closeDialog();
    };

    const handleCancel = () => {
        if (dialogProps.onCancel) {
            dialogProps.onCancel();
        }
        closeDialog();
    };


    let DialogComponent = null;
    if (isOpen) {
        DialogComponent = (
            <Dialog
                open={isOpen}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleConfirm();
                    }
                }}
                fullWidth
            >
                {dialogProps.title && <DialogTitle>{dialogProps.title}</DialogTitle>}
                < DialogContent className="p-0">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div className="m-3">
                            <p className="mb-4">Für welchen Monat soll eine Kopie der Zeiterfassungseinträge erstellt werden</p>

                            <DatePicker
                                label={'Monat & Jahr'}
                                views={['year', 'month']}
                                openTo="month"
                                value={month}
                                disableFuture={dialogProps.disableFuture}
                                onChange={newValue => setMonth(newValue ? newValue.startOf('month') : null)}
                            />
                        </div>
                    </LocalizationProvider>
                </DialogContent >
                <DialogActions className="d-flex justify-content-between">
                    <Button color="secondary" onClick={handleCancel}>Abbrechen</Button>
                    <Button type="submit" className="p-2" onClick={handleConfirm}>Ok</Button>
                </DialogActions>
            </Dialog >
        )
    }

    return [openDialog, DialogComponent];
}