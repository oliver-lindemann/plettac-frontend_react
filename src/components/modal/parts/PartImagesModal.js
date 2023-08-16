import useImageModal from '../../../hooks/parts/useImageModal';

import { Button, Modal } from 'react-bootstrap';
import CenteredPulseLoader from '../../loading/CenteredPulseLoader';
import PartImageCarousel from './PartImageCarousel';
import PartImageCarouselFooter from './PartImageCarouselFooter';
import { PulseLoader } from 'react-spinners';

function PartImagesModal() {

    const {
        visible,
        item: partToDisplay,
        closeModal: onCloseModal
    } = useImageModal();
    const { part, images } = partToDisplay || {};

    let modalTitle = <PulseLoader color={"#fff"} />;
    let modalBody = <CenteredPulseLoader />;
    let modalFooter = <PulseLoader />

    if (part) {
        modalTitle = part.name;
        modalFooter = <PartImageCarouselFooter part={part} />
    }

    if (part && images) {
        modalBody = <PartImageCarousel
            part={part}
            images={images}
        />
    }

    const content = (
        <Modal
            className='top-modal'
            show={visible}
            onHide={onCloseModal}
            fullscreen={true}
            animation={false}
        >
            <Modal.Header
                className="bg-dark text-white"
                closeButton
                closeVariant='white'>
                <Modal.Title>{modalTitle}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{modalBody}</Modal.Body>
            <Modal.Footer id="carouselFooter" className="justify-content-between">
                {modalFooter}
                <div>
                    {/* <Button
                        className="me-1"
                        variant="primary"
                        data-bs-dismiss="modal"
                        onClick={() => { onCloseModal(); navigate(`/parts/${part?._id}`) }}>
                        <div className='d-flex align-items-center p-1'>
                            <BsInfoCircle />
                        </div>
                    </Button> */}
                    <Button
                        variant="secondary"
                        data-bs-dismiss="modal"
                        onClick={onCloseModal}>
                        Schließen
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );

    return content;
}

export default PartImagesModal;