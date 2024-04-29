import useSWR from "swr";
import { getCustomers, customersUrlEndpoint } from "../../app/api/customersApi";
import useAuth from "../auth/useAuth";

const useCustomers = () => {
  const { user } = useAuth();

  const { data, isLoading, error, mutate } = useSWR(
    user ? customersUrlEndpoint : null,
    getCustomers,
    {
      onSuccess: (values) =>
        values.sort((a, b) =>
          a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
        ),
    }
  );

  return {
    // customers: data?.filter(
    //   //Filter for customers that has a customer number
    //   // Only these are relevant for this app because only they are authorized to get material
    //   (cs) =>
    //     cs.customerNr !== undefined &&
    //     cs.customerNr !== null &&
    //     cs.customerNr.trim() !== ""
    // ),
    customers: data,
    isLoading,
    error,
    mutate,
  };
};

export default useCustomers;
