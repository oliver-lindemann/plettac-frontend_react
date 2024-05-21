import { useState } from "react";

import useParts from "../hooks/parts/useParts";
import useImageModal from "../hooks/parts/useImageModal";

import CenteredPulseLoader from '../components/loading/CenteredPulseLoader'
import DefaultContainer from "../components/layout/DefaultContainer";
import FloatingButton from "../components/layout/FloatingButton";
import QrScannerModal from "../components/modal/QrScannerModal";

import SearchablePartsList from "../features/parts/SearchablePartsList";

import { BsUpcScan } from "react-icons/bs";
import usePartsPlettac from "../hooks/parts/usePartsPlettac";

function AllPartsPage() {

    const {
        parts,
        isLoading,
        error
    } = usePartsPlettac();

    const imageModal = useImageModal();
    const [showQRModal, setShowQRModal] = useState(false);

    const handleQRResult = async (result) => {
        imageModal.openModal(parts.find(value => value.articleNr.replace(/\s/g, '') === result.toString().replace(/\s/g, '')))
    }

    if (!parts || isLoading) {
        return <CenteredPulseLoader />;
    }
    if (error) {
        return <p>{error.message}</p>
    }

    return (
        <DefaultContainer>
            <QrScannerModal
                show={showQRModal}
                setShow={setShowQRModal}
                onResult={handleQRResult}
            />

            <SearchablePartsList parts={parts} />

            <FloatingButton
                onClick={() => setShowQRModal(true)}
                icon={<BsUpcScan />}
            />
        </DefaultContainer>
    );
}

export default AllPartsPage;