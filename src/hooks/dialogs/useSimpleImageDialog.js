import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";

const useSimpleImageDialog = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [dialogProps, setDialogProps] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);

    const openDialog = (props) => {
        setDialogProps(props);
        setIsOpen(true);
        setIsLoaded(false);
    };
    const closeDialog = () => setIsOpen(false);

    let DialogComponent = null;
    if (isOpen) {
        DialogComponent = (
            <Dialog maxWidth='xl' onClose={closeDialog} open={isOpen}>
                <DialogTitle style={{ textAlign: 'end' }}>
                    <IconButton onClick={closeDialog}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <div style={{ backgroundImage: `url(${dialogProps.image}?tr=w-20)`, backgroundSize: 'cover', backgroundPosition: 'center', height: 'calc(100vh - 200px)', width: 'auto' }}>
                        <img src={dialogProps.image} alt={dialogProps.image?.toString()} loading="lazy"
                            onLoad={() => setIsLoaded(true)}
                            style={{
                                height: 'calc(100vh - 200px)',
                                objectFit: 'contain',
                                opacity: isLoaded ? 1 : 0
                            }} />
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    return [openDialog, DialogComponent];
}

export default useSimpleImageDialog