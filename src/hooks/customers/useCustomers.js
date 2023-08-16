import useSWR from 'swr'
import { getCustomers, customersUrlEndpoint } from '../../app/api/customersApi'
import useAuth from '../auth/useAuth';

const useCustomers = () => {

    const { user } = useAuth();

    const {
        data: customers,
        isLoading,
        error,
        mutate
    } = useSWR(user ? customersUrlEndpoint : null, getCustomers, {
        onSuccess: values => values.sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1)
    });

    return {
        customers,
        isLoading,
        error,
        mutate
    }
}

export default useCustomers