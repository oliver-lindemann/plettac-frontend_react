import { useState, useEffect } from "react";
import useCustomers from "./useCustomers";

const useCustomer = (customerId) => {
    const {
        customers,
        isLoading,
        error,
        mutate
    } = useCustomers();

    const [customer, setCustomer] = useState();
    useEffect(() => {
        setCustomer(customers?.find(customer => customer._id === customerId));
    }, [customers])

    return { customer, isLoading, error, mutate };
}

export default useCustomer;