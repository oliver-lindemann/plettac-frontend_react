import useSWR from 'swr'
import { getInventories, inventoriesUrlEndpoint } from '../../app/api/inventoriesApi'
import useAuth from '../auth/useAuth';

const useInventories = () => {

    const { user } = useAuth();

    const {
        data: inventories,
        isLoading,
        error,
        mutate
    } = useSWR(user ? inventoriesUrlEndpoint : null, getInventories, {
        onSuccess: values => values.sort((a, b) => a.date > b.date ? 1 : -1)
    });

    return {
        inventories,
        isLoading,
        error,
        mutate
    }
}

export default useInventories