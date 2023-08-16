import { useState, useRef, useEffect } from "react";
import PartItem from "../../features/parts/PartItem";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

export const useAmountDialog = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dialogProps, setDialogProps] = useState({});
    const inputRef = useRef();

    // Wenn dieser Dialog nach einem anderen Dialog angezeigt wird,
    // wird das Input-Feld nicht fokussiert. Selbst nicht, wenn man es direkt
    // in diesen Effekt einbaut. Deshalb der Timeout
    useEffect(() => { setTimeout(() => inputRef.current?.focus(), 100) }, [isOpen]);

    const openDialog = (props) => {
        setDialogProps(props);
        setIsOpen(true);
    };

    const closeDialog = () => {
        setIsOpen(false);
    };

    const handleConfirm = () => {
        if (dialogProps.onConfirm) {
            dialogProps.onConfirm(inputRef.current.value);
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
                        e.preventDefault();
                        handleConfirm();
                    }
                }}
            >
                {dialogProps.title && <DialogTitle>{dialogProps.title}</DialogTitle>}
                < DialogContent >
                    {dialogProps.content}
                    {
                        dialogProps.part
                            ? <PartItem part={dialogProps.part} />
                            : null
                    }
                    <div className="d-flex justify-content-center mt-4">
                        <input
                            type='number'
                            min='1'
                            ref={inputRef}
                            autoFocus
                            required
                        />
                    </div>
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