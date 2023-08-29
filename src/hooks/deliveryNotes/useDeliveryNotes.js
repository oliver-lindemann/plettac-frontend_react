import useSWR from 'swr';
import { deliveryNotesUrlEndpoint, getDeliveryNotes } from '../../app/api/deliveryNotesApi';
import useAuth from '../auth/useAuth';

const useDeliveryNotes = () => {

    const { user } = useAuth();

    const {
        data: deliveryNotes,
        isLoading,
        error,
        mutate
    } = useSWR(user ? deliveryNotesUrlEndpoint : null, user?.isLager ? getDeliveryNotes : (async () => []), {
        refreshInterval: 30_000,
        onSuccess: values => values.sort((a, b) => a.uniqueNumber < b.uniqueNumber ? 1 : -1)
    });

    return {
        deliveryNotes,
        isLoading,
        error,
        mutate
    }
}

export default useDeliveryNotes