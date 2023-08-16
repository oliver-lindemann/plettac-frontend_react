import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

export const useOptionDialog = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dialogProps, setDialogProps] = useState({});

    const openDialog = (props) => {
        setDialogProps(props);
        setIsOpen(true);
    };

    const closeDialog = () => {
        setIsOpen(false);
    };

    let DialogComponent = null;
    if (isOpen) {
        DialogComponent = (
            <Dialog
                open={isOpen}
                onClose={closeDialog}
            >
                {dialogProps.title && <DialogTitle>{dialogProps.title}</DialogTitle>}
                {dialogProps.content && <DialogContent>{dialogProps.content}</DialogContent>}
                <DialogActions className="d-flex justify-content-around">
                    {dialogProps.options?.map((option, index) => (
                        <Button key={index} {...option.props} onClick={() => { closeDialog(); option.onClick() }}>{option.text}</Button>
                    ))}
                </DialogActions>
            </Dialog>
        );
    }

    return [openDialog, DialogComponent];
};