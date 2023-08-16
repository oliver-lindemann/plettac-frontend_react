import { useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import ReactSignatureCanvas from 'react-signature-canvas';
import { useRef } from 'react';
import { CheckRounded, ClearOutlined, ClearRounded } from '@mui/icons-material';

const useSignatureDialog = () => {

    const signatureCanvaseRef = useRef();

    const [isOpen, setIsOpen] = useState(false);
    const [dialogProps, setDialogProps] = useState({});
    const [errorMsg, setErrorMsg] = useState(null);

    const openDialog = (props) => {
        setDialogProps(props);
        setIsOpen(true);
    };
    const closeDialog = () => setIsOpen(false);

    const onConfirm = () => {
        const isSignatureAvailable = !signatureCanvaseRef.current?.isEmpty();
        const signaturePoints = signatureCanvaseRef.current?.toData();

        // !TODO Minimal Data Points?
        if (isSignatureAvailable) {
            if (dialogProps.onConfirm) {
                dialogProps.onConfirm(signatureCanvaseRef.current.getTrimmedCanvas().toDataURL('image/png'));
            }
            closeDialog();
        } else {
            setErrorMsg('Bitte füge deine Unterschrift ein');
        }
    }

    let DialogComponent = null;
    if (isOpen) {
        DialogComponent = (
            <Dialog open={isOpen}>

                <DialogTitle style={{ textAlign: 'end' }}>
                    {dialogProps.title}
                </DialogTitle>
                <DialogContent>
                    {errorMsg ? <Alert severity="error">{errorMsg}</Alert> : null}
                    <div style={{ border: 'solid black 1px', margin: '0 auto', height: '100%' }}>
                        <ReactSignatureCanvas
                            ref={signatureCanvaseRef}

                            penColor="black"
                            canvasProps={{ style: { width: '500px', height: '300px' } }}

                        />
                    </div>
                </DialogContent>
                <DialogActions className='d-flex justify-content-between'>
                    <Button
                        onClick={closeDialog}
                    >
                        Abbrechen
                    </Button>
                    <Button
                        variant='outlined'
                        color='error'
                        startIcon={<ClearRounded />}
                        onClick={() => signatureCanvaseRef.current.clear()}
                    >
                        Löschen
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<CheckRounded />}
                        onClick={onConfirm}
                    >
                        Bestätigen
                    </Button>

                </DialogActions>
            </Dialog>
        )
    }

    return [openDialog, DialogComponent];
}

export default useSignatureDialog