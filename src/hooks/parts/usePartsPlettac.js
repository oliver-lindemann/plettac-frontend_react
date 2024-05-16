import useSWR from "swr";
import { getParts, partsUrlEndpoint } from "../../app/api/partsApi";
import useAuth from "../auth/useAuth";

const usePartsPlettac = () => {
  const { user } = useAuth();

  const {
    data: parts,
    isLoading,
    error,
    mutate,
  } = useSWR(user ? partsUrlEndpoint : null, getParts, {
    onSuccess: (data) =>
      data.sort((a, b) => (a.orderIndex > b.orderIndex ? 1 : -1)),
  });

  return {
    parts: parts?.filter((part) => part.availableAt?.includes("Konsi")),
    isLoading,
    error,
    mutate,
  };
};

export default usePartsPlettac;
