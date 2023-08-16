import { CancelOutlined, PhoneEnabledOutlined, RadioButtonUnchecked, TaskAltOutlined } from "@mui/icons-material";
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Table, TableBody, TableCell, TableRow, TextField } from "@mui/material";
import { useState } from "react";

export const DEFAULT_PHONE = '03981447712'

export const useReportDamage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dialogProps, setDialogProps] = useState({});

    const [damageCaused, setDamageCaused] = useState(false);
    const [damageReported, setDamageReported] = useState(false);
    const [note, setNote] = useState('');

    const openDialog = (props) => {
        setDialogProps(props);

        if (props.annotation) {
            setDamageCaused(props.annotation?.damageCaused);
            setDamageReported(props.annotation?.damageReported);
            setNote(props.annotation?.note);
        }

        setIsOpen(true);
    };

    const closeDialog = () => {
        setIsOpen(false);
    };

    const handleConfirm = () => {
        if (dialogProps.onConfirm) {
            dialogProps.onConfirm({ damageCaused, damageReported, note });
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
            >
                <DialogTitle>Verursachten Schaden melden / Anmerkung hinzufügen</DialogTitle>
                <DialogContent>

                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell padding="none">
                                    Schaden verursacht?
                                </TableCell>
                                <TableCell padding="none" align="right">
                                    <FormControlLabel control={
                                        <Checkbox
                                            value={'DamageCaused'}
                                            checked={damageCaused}
                                            onChange={(e, checked) => setDamageCaused(checked)}
                                        />
                                    }
                                        label="Ja"
                                        labelPlacement="start"
                                    />
                                </TableCell>
                            </TableRow>

                            {
                                !!damageCaused && (
                                    <TableRow>
                                        <TableCell padding="none">
                                            An Bauleiter gemeldet?
                                        </TableCell>
                                        <TableCell padding="none" align="right">
                                            <FormControlLabel control={
                                                <Checkbox
                                                    value={'DamageNotReported'}
                                                    checked={!damageReported}
                                                    onChange={(e, checked) => setDamageReported(false)}
                                                    color="error"
                                                    icon={<RadioButtonUnchecked />}
                                                    checkedIcon={<CancelOutlined />}
                                                />
                                            }
                                                label="Nein"
                                                labelPlacement="start"
                                            />
                                            <FormControlLabel control={
                                                <Checkbox
                                                    value={'DamageReported'}
                                                    checked={damageReported}
                                                    onChange={(e, checked) => setDamageReported(true)}
                                                    color="success"
                                                    icon={<RadioButtonUnchecked />}
                                                    checkedIcon={<TaskAltOutlined />}

                                                />
                                            }
                                                label="Ja"
                                                labelPlacement="start"
                                            />
                                        </TableCell>
                                    </TableRow>
                                )
                            }

                            {
                                !!damageCaused && !damageReported && (
                                    <TableRow >
                                        <TableCell colSpan={2} align="right" sx={{ borderBottom: 0 }} >
                                            <a href={`tel:${dialogProps.phone || DEFAULT_PHONE}`}>Bauleiter anrufen <PhoneEnabledOutlined /></a>
                                        </TableCell>
                                    </TableRow>
                                )
                            }

                        </TableBody>
                    </Table>

                    <TextField
                        className="mt-3"
                        label="Anmerkung"
                        multiline
                        fullWidth

                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />

                </DialogContent>
                <DialogActions className="d-flex justify-content-between">
                    <Button color="inherit" onClick={handleCancel}>Abbrechen</Button>
                    <Button onClick={handleConfirm}>Ok</Button>
                </DialogActions>
            </Dialog>
        );
    }

    return [openDialog, DialogComponent];
};