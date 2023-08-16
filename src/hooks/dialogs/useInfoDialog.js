import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";

const useInfoDialog = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [dialogProps, setDialogProps] = useState({});

    const openDialog = (props) => {
        setDialogProps(props);
        setIsOpen(true);
    };
    const closeDialog = () => setIsOpen(false);

    let DialogComponent = null;
    if (isOpen) {
        DialogComponent = (
            <Dialog onClose={closeDialog} open={isOpen}>
                <DialogTitle className='d-flex justify-content-between centertext'>
                    <Typography variant='inherit' style={{ display: 'flex', alignItems: 'center' }}>{dialogProps.title}</Typography>
                    <IconButton onClick={closeDialog}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {dialogProps.content}
                </DialogContent>
            </Dialog>
        )
    }

    return [openDialog, DialogComponent];
}

export default useInfoDialog