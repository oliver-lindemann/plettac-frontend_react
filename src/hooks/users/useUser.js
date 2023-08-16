import { useState, useEffect } from "react";
import useUsers from "./useUsers";

const useUser = (userId) => {
    const {
        users,
        isLoading,
        error,
        mutate
    } = useUsers();

    const [user, setUser] = useState();
    useEffect(() => {
        setUser(users?.find(user => user._id === userId));
    }, [users])

    return { user, isLoading, error, mutate };
}

export default useUser;