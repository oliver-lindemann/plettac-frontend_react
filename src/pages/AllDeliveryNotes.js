import CenteredPulseLoader from '../components/loading/CenteredPulseLoader';

import useDeliveryNotes from '../hooks/deliveryNotes/useDeliveryNotes';
import ErrorPage from '../components/error/ErrorPage';
import DefaultContainer from '../components/layout/DefaultContainer';
import FloatingButton from '../components/layout/FloatingButton';
import { useNavigate } from 'react-router-dom';
import { AddOutlined } from '@mui/icons-material';
import DeliveryNotesList from '../features/deliveryNotes/list/DeliveryNotesList';

function AllDeliveryNotesPage() {

    const navigate = useNavigate();
    const {
        deliveryNotes,
        isLoading,
        error
    } = useDeliveryNotes();

    const handleCreateNewDeliveryNote = async () => navigate(`/deliveryNotes/new`);

    if (!deliveryNotes || isLoading) {
        return <CenteredPulseLoader />;
    }
    if (error) {
        return <ErrorPage error={error} />;
    }

    return (
        <DefaultContainer>
            <DeliveryNotesList deliveryNotes={deliveryNotes} />

            <FloatingButton
                onClick={handleCreateNewDeliveryNote}
                icon={<AddOutlined />}
            />
        </DefaultContainer>

    );
}

export default AllDeliveryNotesPage;