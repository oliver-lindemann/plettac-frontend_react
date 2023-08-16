import { useState } from "react";
import { cleanTime } from "../../../utils/DateUtils";
import { Alert, Button, Dialog, DialogActions, DialogContent, FormControl, FormLabel, Typography } from "@mui/material";
import TimeRangeType from './TimeRangeType';
import { LocalizationProvider, TimeField } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import TimePickerWheel from "../../../components/forms/TimePickerWheel/TimePickerWheel";
import { BrowserView, MobileView } from "react-device-detect";
import ChooseDriver from "./ChooseDriver";
import { TYPES } from "../../../config/timeRecords";

const initialType = TYPES.HOF;
const initialStartTime = cleanTime('1970-01-01T06:00:00');
const initialEndTime = cleanTime('1970-01-01T07:30:00');

export const useTimeRangeWheelDialog = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dialogProps, setDialogProps] = useState({});

    const [type, setType] = useState(initialType);
    const [driver, setDriver] = useState(null);
    const [startTime, setStartTime] = useState(initialStartTime);
    const [endTime, setEndTime] = useState(initialEndTime);
    const [errorMsg, setErrorMsg] = useState(null);

    const handleTypeChanged = (event) => setType(event.target.value);
    const handleDriverChanged = (event) => setDriver(event.target.value);

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
        setIsOpen(true);
    };
    const closeDialog = () => { setIsOpen(false); clearDialogProps() };

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
        // if (dialogProps.clearOnConfirm) {
        //     setType(initialType);
        //     setStartTime(initialStartTime);
        //     setEndTime(initialEndTime);
        //     setErrorMsg(null);
        // }
        closeDialog();
    };

    const handleCancel = () => {
        if (dialogProps.onCancel) {
            dialogProps.onCancel();
        }
        closeDialog();
    };

    const clearDialogProps = () => {
        setType(initialType);
        setStartTime(initialStartTime);
        setEndTime(initialEndTime);
        setErrorMsg(null);
    }


    let DialogComponent = null;
    if (isOpen) {
        DialogComponent = (
            <Dialog
                open={isOpen}
                // onClose={closeDialog}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleConfirm();
                    }
                }}
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

                        <FormControl className="p-3">
                            <FormLabel id="workTypeRadioGroup">Start- und Endzeit</FormLabel>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>

                                <MobileView>
                                    <div className="d-flex pt-2">
                                        <TimePickerWheel
                                            value={startTime}
                                            onChange={setStartTime}
                                            minutesStep={5}
                                        // title='Startzeit'
                                        />

                                        <Typography className='m-auto mx-1' fontSize={20}> - </Typography>

                                        <TimePickerWheel
                                            value={endTime}
                                            onChange={setEndTime}
                                            minTime={startTime}
                                            minutesStep={5}
                                        // title='Endzeit'
                                        />
                                    </div>
                                </MobileView>
                                <BrowserView>
                                    <div className="d-flex">
                                        <TimeField
                                            value={startTime}
                                            onChange={(newValue) => {
                                                setStartTime(newValue);
                                                // setEndTime(newValue.add(2, 'hour'))
                                            }}
                                            ampm={false}
                                            minutesStep={5}
                                        />
                                        <Typography className='m-auto mx-1' fontSize={20}> - </Typography>

                                        <TimeField
                                            value={endTime}
                                            onChange={setEndTime}
                                            ampm={false}
                                            minutesStep={5}
                                        />
                                    </div>

                                </BrowserView>

                                {/* <Typography className='m-auto mx-1' fontSize={20}> Uhr </Typography> */}

                            </LocalizationProvider>
                        </FormControl>
                    </div>
                    {/* </div> */}

                </DialogContent >
                <DialogActions className="d-flex justify-content-between">
                    <Button color="secondary" onClick={handleCancel}>Abbrechen</Button>
                    <div>
                        <Button type="submit" className="p-2" onClick={handleConfirm}>
                            Ok
                        </Button>
                    </div>
                </DialogActions>
            </Dialog >
        )
    }

    return [openDialog, DialogComponent];
}