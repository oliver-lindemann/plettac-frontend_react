import useSWR from 'swr'
import { getParts, partsUrlEndpoint } from '../../app/api/partsApi'
import useAuth from '../auth/useAuth';

const useParts = () => {

    const { user } = useAuth();

    const {
        data: parts,
        isLoading,
        error,
        mutate
    } = useSWR(user ? partsUrlEndpoint : null, getParts, {
        onSuccess: data => data.sort((a, b) => a.orderIndex > b.orderIndex ? 1 : -1)
    });

    return {
        parts,
        isLoading,
        error,
        mutate
    }
}

export default useParts