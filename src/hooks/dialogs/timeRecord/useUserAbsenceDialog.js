import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert, FormControlLabel, Checkbox, FormGroup, FormControl, InputLabel, Select, MenuItem, IconButton } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import useUsers from "../../users/useUsers";
import UserSelect from "../../../components/forms/UserSelect";
import { getDayjsWithoutTime, isWorkday } from "../../../utils/DateUtils";
import { absenceOptions } from "../../../config/absenceOptions";
import { ROLES } from "../../../config/roles";
import { Close } from "@mui/icons-material";

const initialStartTime = getDayjsWithoutTime();
const initialEndTime = getDayjsWithoutTime();

export const useUserAbsenceDialog = () => {

    const { users } = useUsers({ role: ROLES.TimeTracking });

    const [isOpen, setIsOpen] = useState(false);
    const [dialogProps, setDialogProps] = useState({});

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [absence, setAbsence] = useState('');
    const [startDate, setStartDate] = useState(initialStartTime);
    const [endDate, setEndDate] = useState(initialEndTime);

    const [errorMsg, setErrorMsg] = useState(null);

    const onAbsenceChanged = (e) => {
        setAbsence(e.target.value);
        setErrorMsg(null);
    };

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

        if (selectedUsers.length <= 0) {
            setErrorMsg('Bitte wähle mindestens einen Benutzer aus.');
            return false;
        }

        if (!absence || absence === '') {
            setErrorMsg('Bitte wähle eine Art der Fehlzeit aus.');
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
            dialogProps.onConfirm(selectedUsers, absence, startDate, endDate);
        }
        if (dialogProps.clearOnConfirm) {
            setSelectedUsers([]);
            setAbsence('');
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
                            <p className="mb-4">Für welche(n) Mitarbeiter soll eine Fehlzeit eingetragen werden?</p>
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
                        <FormControl className='m-3 d-flex'>
                            <InputLabel id="typeSelect">Art der Fehlzeit</InputLabel>
                            <Select
                                labelId='typeSelect'
                                id='Typauswahl'
                                label="Grund für Fehlzeit"
                                value={absence}
                                onChange={onAbsenceChanged}
                            >
                                {absenceOptions.map((option, index) =>
                                    <MenuItem key={index} value={option.value}>{option.text}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                        <div className="m-3">
                            <p className="mb-4">Von welchem Tag soll die Fehlzeit eingetragen werden?</p>

                            <DatePicker
                                label={'Anfangsdatum'}
                                views={['year', 'month', 'day']}
                                format="dddd, DD.MM.YYYY"
                                value={startDate}
                                shouldDisableDate={date => !isWorkday(date)}
                                onChange={newValue => setStartDate(newValue)}
                            />
                        </div>
                        <div className="m-3">
                            <p className="mb-4">Bis zu welchem Tag soll die Fehlzeit eingetragen werden?</p>
                            <DatePicker
                                label={'Enddatum'}
                                views={['year', 'month', 'day']}
                                format="dddd, DD.MM.YYYY"
                                value={endDate}
                                minDate={startDate}
                                shouldDisableDate={date => !isWorkday(date)}
                                onChange={newValue => setEndDate(newValue)}
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