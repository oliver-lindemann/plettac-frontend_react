import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

export const useConfirmDialog = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dialogProps, setDialogProps] = useState({});

    const openDialog = (props) => {
        setDialogProps(props);
        setIsOpen(true);
    };

    const closeDialog = () => {
        setIsOpen(false);
    };

    const handleConfirm = () => {
        if (dialogProps.onConfirm) {
            dialogProps.onConfirm();
        }
        closeDialog();
    };

    const handleDeny = () => {
        if (dialogProps.onDeny) {
            dialogProps.onDeny();
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
                // maxWidth='lg'
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleConfirm();
                    }
                }}
            >
                {dialogProps.title && <DialogTitle>{dialogProps.title}</DialogTitle>}
                {dialogProps.content && <DialogContent>{dialogProps.content}</DialogContent>}
                <DialogActions>
                    {dialogProps.showCancel && <Button onClick={handleCancel}>Abbrechen</Button>}
                    <Button color="error" onClick={handleDeny}>{dialogProps.denyLabel || "Nein"}</Button>
                    <Button onClick={handleConfirm}>{dialogProps.confirmLabel || "Ja"}</Button>
                </DialogActions>
            </Dialog>
        );
    }

    return [openDialog, DialogComponent];
};