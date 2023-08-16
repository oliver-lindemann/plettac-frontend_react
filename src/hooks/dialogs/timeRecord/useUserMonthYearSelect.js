import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert, FormControlLabel, Checkbox, FormGroup, IconButton } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import useUsers from "../../users/useUsers";
import UserSelect from "../../../components/forms/UserSelect";
import { dayjsUTC } from "../../../utils/DateUtils";
import { ROLES } from "../../../config/roles";
import { Close } from "@mui/icons-material";

const initialStartTime = dayjsUTC().startOf('month');
const initialEndTime = dayjsUTC().endOf('month');

export const useUserMonthYearSelect = () => {

    const { users } = useUsers({ role: ROLES.TimeTracking });

    const [isOpen, setIsOpen] = useState(false);
    const [dialogProps, setDialogProps] = useState({});

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [startDate, setStartDate] = useState(initialStartTime);
    const [endDate, setEndDate] = useState(initialEndTime);

    const [errorMsg, setErrorMsg] = useState(null);

    const openDialog = (props) => {
        setDialogProps(props);
        if (props.selectedUsers) {
            setSelectedUsers(props.type);
        }
        if (props.startTime) {
            setStartDate(props.startTime);
        }
        if (props.endTime) {
            setEndDate(props.endTime);
        }
        setIsOpen(true);
    };

    const closeDialog = () => {
        setIsOpen(false);
    };

    const checkValidity = () => {

        if (endDate && endDate < startDate) {
            setErrorMsg('Bitte wähle eine Endzeit, die hinter der angegebenen Startzeit liegt.');
            return false;
        }

        if (selectedUsers.length <= 0) {
            setErrorMsg('Bitte wähle mindestens einen Benutzer aus.');
            return false;
        }

        if (dialogProps.onValidate) {
            const result = dialogProps.onValidate(startDate, endDate);
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
            dialogProps.onConfirm(selectedUsers, startDate, endDate);
        }
        if (dialogProps.clearOnConfirm) {
            setSelectedUsers([]);
            setStartDate(initialStartTime);
            setEndDate(initialEndTime);
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
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleConfirm();
                    }
                }}
                fullWidth
            >
                <DialogTitle className="d-flex justify-content-between align-items-center">
                    {dialogProps.title}
                    <IconButton onClick={closeDialog}>
                        <Close />
                    </IconButton>
                </DialogTitle>
                < DialogContent className="p-0">
                    {errorMsg ? <Alert severity="error">{errorMsg}</Alert> : null}

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div className="m-3">
                            <p className="mb-4">Ab welchem Monat sollen die Tagesberichte erstellt werden?</p>

                            <DatePicker
                                label={'Monat & Jahr'}
                                views={['year', 'month']}
                                openTo="month"
                                value={startDate}
                                onChange={newValue => setStartDate(newValue ? newValue.startOf('month') : null)}
                            />
                        </div>
                        <div className="m-3">
                            <p className="mb-4">Bis zu welchem Monat sollen die Tagesberichte erstellt werden? (optional)</p>
                            <DatePicker
                                label={'Monat & Jahr'}
                                views={['year', 'month']}
                                openTo="month"
                                value={endDate}
                                minDate={startDate}
                                onChange={newValue => setEndDate(newValue ? newValue.endOf('month') : null)}
                            />
                        </div>
                        <div className="m-3">

                            <p className="mb-4">Für welche Mitarbeiter sollen die Tagesberichte erstellt werden?</p>

                            <FormGroup className="mb-3">
                                <FormControlLabel control={
                                    <Checkbox
                                        checked={selectedUsers.length === users?.length}
                                        onChange={(e) => setSelectedUsers(e.target.checked ? users.map(user => user._id) : [])}
                                    />
                                } label="Alle Benutzer" />
                            </FormGroup>
                            <UserSelect
                                users={users}
                                title='Mitarbeiterauswahl'
                                assignedUsers={selectedUsers}
                                setAssignedUsers={setSelectedUsers}
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