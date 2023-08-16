import { useState, useRef, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Autocomplete, TextField, Alert } from "@mui/material";
import { Form } from "react-bootstrap";

export const useTextInputDialog = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dialogProps, setDialogProps] = useState({});
    const [inputValue, setInputValue] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);
    const inputRef = useRef();

    // Wenn dieser Dialog nach einem anderen Dialog angezeigt wird,
    // wird das Input-Feld nicht fokussiert. Selbst nicht, wenn man es direkt
    // in diesen Effekt einbaut. Deshalb der Timeout
    useEffect(() => { setTimeout(() => inputRef.current?.focus(), 100) }, [isOpen]);

    const onInputValueChanged = (e, newValue) => setInputValue(newValue);

    const openDialog = (props) => {
        setDialogProps(props);
        setIsOpen(true);
    };

    const closeDialog = () => {
        setIsOpen(false);
    };

    const checkValidity = () => {
        if (!inputValue?.trim()) {
            setErrorMsg('Dieses gib einen Namen ein.');
            return false;
        }

        return true;
    }

    const handleConfirm = () => {
        if (!checkValidity()) {
            return;
        }

        if (dialogProps.onConfirm) {
            console.log(inputValue);
            dialogProps.onConfirm(inputValue);
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
            >

                {dialogProps.title && <DialogTitle>{dialogProps.title}</DialogTitle>}
                {errorMsg ? <Alert severity="error">{errorMsg}</Alert> : null}
                < DialogContent >
                    {dialogProps.content}

                    <Autocomplete
                        freeSolo
                        autoSelect
                        options={dialogProps.options || []}

                        value={inputValue}
                        onChange={onInputValueChanged}
                        required
                        renderInput={(params) => <TextField {...params} inputRef={inputRef} />}
                    />

                </DialogContent >
                <DialogActions className="d-flex justify-content-between">
                    <Button color="secondary" onClick={handleCancel}>Abbrechen</Button>
                    <Button type="submit" className="p-2" onClick={handleConfirm}>{dialogProps.confirmLabel || "Ok"}</Button>
                </DialogActions>
            </Dialog >
        )
    }

    return [openDialog, DialogComponent];
}