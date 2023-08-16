import { CheckOutlined, CloseOutlined } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Step, StepButton, StepContent, Stepper, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";

const SCROLL_Y_VALUE = 50;

const checklistSteps = [
    {
        label: 'Schäden am Gerüst?',
        value: 'scaffoldDamaged',
        desiredValues: false
    },
    {
        label: 'Gerüst vollständig?',
        value: 'scaffoldComplete',
        desiredValues: true
    },
    {
        label: 'Auslegerlage vollständig?',
        value: 'cantileverComplete',
        desiredValues: true
    },
    {
        label: 'Gerüst sauber?',
        value: 'scaffoldClean',
        desiredValues: true
    },
    {
        label: 'Zustand obere Gerüstlage/Netze i.O.?',
        value: 'topScaffoldLayerCondition',
        desiredValues: true
    },
    {
        label: 'Zustand Leiterdurchgänge i.O.?',
        value: 'ladderPassageCondition',
        desiredValues: true
    },
    {
        label: 'Zustand Gerüstteile i.O.?',
        value: 'scaffoldingParts',
        desiredValues: true
    },
];

export const useWorkOrderReport = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dialogProps, setDialogProps] = useState({});

    const isDisassembly = dialogProps.isDisassembly;

    const [completed, setCompleted] = useState(null);
    const [checklist, setChecklist] = useState({});
    const [note, setNote] = useState('');

    const [activeStep, setActiveStep] = useState(0);
    const contentRef = useRef(); // used for vertical scrolling in dialog 

    const openDialog = (props) => {
        setDialogProps(props);

        if (props.report) {
            setCompleted(props.report.completed);
            setNote(props.report.note);
            setChecklist(props.report.checklist);
        }

        setIsOpen(true);
    };

    const closeDialog = () => {
        setIsOpen(false);
    };

    const handleConfirm = () => {
        if (dialogProps.onConfirm) {
            dialogProps.onConfirm({ completed, checklist, note });
        }
        closeDialog();
    };

    const handleCancel = () => {
        if (dialogProps.onCancel) {
            dialogProps.onCancel();
        }
        closeDialog();
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);

        contentRef.current.scrollBy({ left: 0, top: SCROLL_Y_VALUE, behavior: 'smooth' })
    };

    const handleUpdateChecklist = (key, value) => {
        setChecklist(checklist => {
            const updatedChecklist = { ...checklist };
            updatedChecklist[key] = value;
            return updatedChecklist;
        });
        handleNext();
    }

    const isChecklistComplete = checklistSteps.every(step => checklist[step.value] !== undefined);

    let DialogComponent = null;
    if (isOpen) {
        DialogComponent = (
            <Dialog
                open={isOpen}
            >
                <DialogTitle>Arbeitsauftrag abschließen</DialogTitle>
                <DialogContent
                    ref={contentRef}>

                    <Stepper nonLinear activeStep={activeStep} orientation="vertical" >

                        <Step key={'completed'} completed={completed !== null}>
                            <StepButton color="inherit" onClick={() => setActiveStep(0)} optional={completed === null ? '' : <Typography color={!!completed ? '' : 'error'}>{completed ? 'Ja' : 'Nein'}</Typography>}>
                                Baustelle fertig?
                            </StepButton >
                            <StepContent >
                                <Box sx={{ mb: 2 }}>
                                    <div className="d-flex gap-1">
                                        <Button
                                            variant="outlined"
                                            color="success"
                                            startIcon={<CheckOutlined />}
                                            onClick={() => { setCompleted(true); handleNext(); }}
                                            sx={{ width: '50%' }}
                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            Ja
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            startIcon={<CloseOutlined />}
                                            onClick={() => { setCompleted(false); handleNext(); }}
                                            sx={{ width: '50%' }}
                                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        >
                                            Nein
                                        </Button>
                                    </div>
                                </Box>
                            </StepContent>
                        </Step>


                        {
                            !!isDisassembly && (
                                checklistSteps.map((step, index) => (
                                    <Step key={step.label} completed={checklist[step.value] !== undefined}>
                                        <StepButton color="inherit" onClick={() => setActiveStep(index + 1)} optional={checklist[step.value] === undefined ? '' : <Typography color={checklist[step.value] === step.desiredValues ? '' : 'error'}>{checklist[step.value] ? 'Ja' : 'Nein'}</Typography>}>
                                            {step.label}
                                        </StepButton >
                                        <StepContent >
                                            <Box sx={{ mb: 2 }}>
                                                <div className="d-flex gap-1">
                                                    <Button
                                                        variant="outlined"
                                                        color="success"
                                                        startIcon={<CheckOutlined />}
                                                        onClick={() => handleUpdateChecklist(step.value, true)}
                                                        sx={{ width: '50%' }}
                                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                    >
                                                        Ja
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        startIcon={<CloseOutlined />}
                                                        onClick={() => handleUpdateChecklist(step.value, false)}
                                                        sx={{ width: '50%' }}
                                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                                    >
                                                        Nein
                                                    </Button>
                                                </div>
                                            </Box>
                                        </StepContent>
                                    </Step>
                                ))
                            )
                        }
                    </Stepper>


                    <TextField
                        className="mt-3"
                        label="Anmerkung"
                        multiline
                        fullWidth

                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />

                </DialogContent>
                <DialogActions>
                    <Button color="inherit" onClick={handleCancel}>Abbrechen</Button>
                    <Button disabled={completed === null || (isDisassembly && !isChecklistComplete)} onClick={handleConfirm}>Baustelle abschließen</Button>
                </DialogActions>
            </Dialog>
        );
    }

    return [openDialog, DialogComponent];
};