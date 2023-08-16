import { useState } from 'react';
import { Close } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, IconButton, InputLabel, MenuItem, Select } from '@mui/material';
import { DEFAULT_WORKING_TIME, WORKING_TIME_LAGER, WORKING_TIME_OFFICE, WORKING_TIME_STANDARD } from '../../config/timeTracking';
import TimeTrackingTable from '../../features/users/TimeTrackingTable';

const useTimeTracking = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dialogProps, setDialogProps] = useState({});

    const [selectedTimeTracking, setSelectedTimeTracking] = useState(DEFAULT_WORKING_TIME);

    const openDialog = (props) => {
        setDialogProps(props);
        setIsOpen(true);
    };

    const closeDialog = () => {
        setIsOpen(false);
    };

    const handleConfirm = () => {
        if (dialogProps.onConfirm) {
            dialogProps.onConfirm(selectedTimeTracking);
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
                fullWidth
            >
                <DialogTitle className="d-flex justify-content-between align-items-center">
                    {dialogProps.title}
                    <IconButton onClick={closeDialog}>
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent>


                    <FormControl fullWidth sx={{ my: 1 }}>
                        <InputLabel>Arbeits- und Pausenzeiten zurücksetzen auf:</InputLabel>
                        <Select
                            label="Arbeits- und Pausenzeiten zurücksetzen auf:"
                            multiple={false}
                            value={selectedTimeTracking}
                            onChange={e => setSelectedTimeTracking(e.target.value)}
                        >
                            <MenuItem value={WORKING_TIME_STANDARD}>Standard</MenuItem>
                            <MenuItem value={WORKING_TIME_LAGER}>Lager</MenuItem>
                            <MenuItem value={WORKING_TIME_OFFICE}>Büro</MenuItem>
                        </Select>
                    </FormControl>

                    <TimeTrackingTable
                        timeTracking={selectedTimeTracking}
                        onUpdateTimeTracking={setSelectedTimeTracking}
                        season={'summer'}
                        title={'Sommer'}
                        subtitle={'(April - Okt.)'}
                        disabled
                    />
                    <TimeTrackingTable
                        timeTracking={selectedTimeTracking}
                        onUpdateTimeTracking={setSelectedTimeTracking}
                        season={'winter'}
                        title={'Winter'}
                        subtitle={'(Nov. - März)'}
                        disabled
                    />

                </DialogContent>
                <DialogActions className="d-flex justify-content-between">
                    <Button color="secondary" onClick={handleCancel}>Abbrechen</Button>
                    <Button type="submit" className="p-2" onClick={handleConfirm}>Ok</Button>
                </DialogActions>
            </Dialog>
        )
    }

    return [openDialog, DialogComponent];
}

export default useTimeTracking