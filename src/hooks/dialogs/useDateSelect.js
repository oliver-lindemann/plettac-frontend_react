import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { getDayjsWithoutTime, isWorkday } from "../../utils/DateUtils";

const initialDate = getDayjsWithoutTime();

export const useDateSelect = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [dialogProps, setDialogProps] = useState({});

    const [date, setDate] = useState(initialDate);

    const [errorMsg, setErrorMsg] = useState(null);

    const openDialog = (props) => {
        setDialogProps(props);
        if (props.date) {
            setDate(props.date);
        }
        setIsOpen(true);
    };

    const closeDialog = () => {
        setIsOpen(false);
    };

    const checkValidity = () => {

        if (dialogProps.onValidate) {
            const result = dialogProps.onValidate(date);
            if (result) {
                setErrorMsg(result);
                return false;
            }
        }

        return true;
    }

    const handleConfirm = () => {
        if (!checkValidity()) {
            return;
        }

        if (dialogProps.onConfirm) {
            dialogProps.onConfirm(date);
        }
        if (dialogProps.clearOnConfirm) {
            setDate(initialDate);
            setErrorMsg(null);
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
                onClose={closeDialog}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleConfirm();
                    }
                }}
                fullWidth
            >
                {dialogProps.title && <DialogTitle>{dialogProps.title}</DialogTitle>}
                < DialogContent className="p-0">
                    {errorMsg ? <Alert severity="error">{errorMsg}</Alert> : null}

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div className="m-3">
                            <p className="mb-4">Bitte wähle ein Datum aus</p>

                            <DatePicker
                                label={'Datum'}
                                views={['year', 'month', 'day']}
                                format="dddd, DD.MM.YYYY"
                                value={date}
                                shouldDisableDate={date => !isWorkday(date)}
                                onChange={newValue => setDate(newValue)}
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