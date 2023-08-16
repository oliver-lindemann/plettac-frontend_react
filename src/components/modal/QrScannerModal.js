import { QrReader } from 'react-qr-reader'
import { Button, Modal } from 'react-bootstrap';

function QrScannerModal({ show, setShow, onResult }) {

    const handleClose = () => setShow(false);

    const handleResult = (result, error) => {
        if (!!result) {
            onResult(result);
            setShow(false);
        }

        if (!!error) {
            // console.log(error);
        }
    }

    return (
        <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            centered
        >
            <Modal.Header closeButton>
                QR-Code einlesen
            </Modal.Header>
            <Modal.Body>
                Suche nach QR-Code...
                <QrReader
                    delay={300}
                    constraints={{
                        facingMode: 'environment'
                    }}
                    onResult={handleResult}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={handleClose}
                >
                    Schließen
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default QrScannerModal;