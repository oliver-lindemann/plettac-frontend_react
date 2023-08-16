import useSWR from 'swr'
import { getUsers, usersUrlEndpoint } from '../../app/api/usersApi'
import useAuth from '../auth/useAuth';

const useUsers = ({ role } = {}) => {

    const { user } = useAuth();

    const {
        data: users,
        isLoading,
        error,
        mutate
    } = useSWR(user ? usersUrlEndpoint : null, getUsers, {
        refreshInterval: 60000,
        onSuccess: values => values.sort((a, b) => a.name > b.name ? 1 : -1)
    });

    return {
        users: !!role ? users?.filter(user => user.roles.includes(role)) : users,
        isLoading,
        error,
        mutate
    }
}

export default useUsers