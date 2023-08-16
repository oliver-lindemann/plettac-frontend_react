import { Alert, Button, Dialog, DialogActions, DialogContent, FormControl, FormLabel, IconButton, Typography } from "@mui/material";
import { LocalizationProvider, TimeClock } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import { TYPES } from "../../../config/timeRecords";
import { cleanTime } from "../../../utils/DateUtils";
import TimeRangeType from './TimeRangeType';
import ChooseDriver from "./ChooseDriver";
import { TIME_SELECT_MINUTE_STEPS } from "../../../features/timeRecords/deviations/TimeRecordDeviationField";

const initialType = TYPES.HOF;
const initialStartTime = cleanTime('1970-01-01T06:00:00');
const initialEndTime = cleanTime('1970-01-01T07:30:00');


export const useTimeRangeDialog = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dialogProps, setDialogProps] = useState({});

    const [type, setType] = useState(initialType);
    const [driver, setDriver] = useState('');
    const [startTime, setStartTime] = useState(initialStartTime);
    const [endTime, setEndTime] = useState(initialEndTime);
    const [errorMsg, setErrorMsg] = useState(null);

    const [selectedIndex, setSelectedIndex] = useState(0);

    const getCurrentTime = (index) => {
        switch (index) {
            case 0:
                return {
                    view: 'hours',
                    type: 'start',
                    minTime: null,
                    time: startTime,
                    setTime: setStartTime
                }
            case 1:
                return {
                    view: 'minutes',
                    type: 'start',
                    minTime: null,
                    time: startTime,
                    setTime: setStartTime
                };
            case 2:
                return {
                    view: 'hours',
                    type: 'end',
                    minTime: startTime,
                    time: endTime,
                    setTime: setEndTime
                };
            case 3:
                return {
                    view: 'minutes',
                    type: 'end',
                    minTime: startTime,
                    time: endTime,
                    setTime: setEndTime
                };
            default: {

            }
        }
    }

    const currentTime = getCurrentTime(selectedIndex);

    const TimeButton = ({ index, formatTime }) => {

        const isCurrent = index === selectedIndex;

        return (
            <IconButton
                color={isCurrent ? 'secondary' : 'primary'}
                onClick={() => setSelectedIndex(index)}
                style={{ fontSize: isCurrent ? '20pt' : '16pt', width: '40px' }}

            >
                {getCurrentTime(index).time.format(formatTime)}
            </IconButton>
        )

    }


    const handleTypeChanged = (event) => setType(event.target.value);
    const handleDriverChanged = (event) => setDriver(event.target.value);

    const switchView = () => {
        if (selectedIndex < 3) {
            setSelectedIndex(index => index + 1)
        }

    }

    const openDialog = (props) => {
        setDialogProps(props);
        if (props.type) {
            setType(props.type);
        }
        if (props.startTime) {
            setStartTime(props.startTime);
        }
        if (props.endTime) {
            setEndTime(props.endTime);
        }
        if (props.possibleDrivers?.length > 0) {
            setDriver(props.possibleDrivers[0]);
        }
        if (props.driver || props.driver === null) {
            setDriver(props.driver || '');
        }
        if (props.startTimePreset) {
            setSelectedIndex(2);
        }
        setIsOpen(true);
    };
    const closeDialog = () => { setIsOpen(false); clearDialogProps() };

    const clearDialogProps = () => {
        setType(initialType);
        setStartTime(initialStartTime);
        setEndTime(initialEndTime);
        setSelectedIndex(0);
        setErrorMsg(null);
    }

    const checkValidity = () => {
        if (endTime <= startTime) {
            setErrorMsg('Bitte wähle eine Endzeit, die hinter der angegebenen Startzeit liegt.');
            return false;
        }

        if (dialogProps.onValidate) {
            const result = dialogProps.onValidate(startTime, endTime);
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
            dialogProps.onConfirm(type, driver, startTime, endTime);
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
                {/* {dialogProps.title && <DialogTitle>{dialogProps.title}</DialogTitle>} */}
                < DialogContent className="p-0">
                    {errorMsg ? <Alert severity="error">{errorMsg}</Alert> : null}

                    {!!dialogProps.startTimePreset ? <Alert severity="info">Die Startzeit knüpft an die Endzeit deines letzten Eintrages an.</Alert> : null}

                    <div className="d-flex">
                        <TimeRangeType
                            timeRangeType={type}
                            handleTypeChanged={handleTypeChanged}
                        />
                        {
                            type === TYPES.FAZ
                                ? (
                                    <ChooseDriver
                                        possibleDrivers={dialogProps.possibleDrivers}
                                        driver={driver}
                                        handleDriverChanged={handleDriverChanged}
                                    />
                                )
                                : null
                        }

                    </div>
                    <div>
                        <FormControl className="d-flex justify-content-center">
                            <FormLabel id="workTypeRadioGroup" className="ps-3">Start- und Endzeit</FormLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <div>
                                    <div className='d-flex justify-content-center' style={{ alignItems: 'center' }}>
                                        {/* Show only hour */}
                                        <div className='d-flex justify-content-center' style={{ alignItems: 'center' }}>
                                            <TimeButton index={0} formatTime='HH' />
                                            <Typography variant='h5'>:</Typography>
                                            <TimeButton index={1} formatTime='mm' />
                                        </div>
                                        <Typography variant='h5' marginX='20px'> - </Typography>
                                        <div className='d-flex justify-content-center' style={{ alignItems: 'center' }}>
                                            <TimeButton index={2} formatTime='HH' />
                                            <Typography variant='h5'>:</Typography>
                                            <TimeButton index={3} formatTime='mm' />
                                        </div>
                                    </div>

                                    <TimeClock
                                        views={['hours', 'minutes', 'seconds']}
                                        view={currentTime.view}
                                        minutesStep={TIME_SELECT_MINUTE_STEPS}
                                        onViewChange={(newValue) => switchView()}
                                        value={currentTime.time}
                                        onChange={(newValue) => currentTime.setTime(newValue)}
                                        ampm={false}
                                        minTime={currentTime.minTime}
                                        sx={{
                                            "&.MuiTimeClock-root": {
                                                margin: '0 auto',
                                                width: '220px'
                                            },
                                            "&.MuiClock-root": {
                                                margin: '0 auto',
                                                width: '220px'
                                            }
                                        }}
                                    />

                                </div>
                            </LocalizationProvider>
                        </FormControl>
                    </div>

                </DialogContent >
                <DialogActions className="d-flex justify-content-between">
                    <Button color="secondary" onClick={handleCancel}>Abbrechen</Button>
                    <div>
                        {
                            selectedIndex > 0 ? <Button className="p-2" onClick={() => setSelectedIndex(index => index - 1)}>Zurück</Button> : null
                        }
                        <Button type="submit" className="p-2" onClick={() => {
                            selectedIndex < 3
                                ? setSelectedIndex(index => index + 1)
                                : handleConfirm()
                        }}
                        >
                            {selectedIndex < 3 ? "Weiter" : "Ok"}
                        </Button>
                    </div>
                </DialogActions>
            </Dialog >
        )
    }

    return [openDialog, DialogComponent];
}