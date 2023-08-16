import { Close } from '@mui/icons-material';
import { Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import { useState } from 'react';
import { addConstructionSite } from '../../../app/api/constructionSitesApi';
import ConstructionSiteContent from '../../../features/constructionSites/ConstructionSiteContent';

const useConstructionSiteAssignment = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [dialogProps, setDialogProps] = useState({});

    const openDialog = (props) => {
        setDialogProps(props);
        setIsOpen(true);
    };


    const closeDialog = () => setIsOpen(false);

    const createConstructionSite = async (constructionSite) => {
        const result = await addConstructionSite(constructionSite);
        if (result.id) {
            dialogProps.onConfirm({ _id: result.id, ...constructionSite });
            closeDialog();
        }
    }

    let DialogComponent = null;
    if (isOpen) {
        DialogComponent = (
            <Dialog fullWidth open={isOpen}>
                <DialogTitle className='d-flex justify-content-between centertext'>
                    <Typography variant='inherit' style={{ display: 'flex', alignItems: 'center' }}>Baustellen-Zuordnung</Typography>
                    <IconButton onClick={closeDialog}>
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent className='m-0 p-0'>
                    <ConstructionSiteContent
                        isPopup
                        onSaveButtonClicked={createConstructionSite}
                    />
                </DialogContent>
            </Dialog>
        )
    }

    return [openDialog, DialogComponent];
}

export default useConstructionSiteAssignment