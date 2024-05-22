import useSWR, { useSWRConfig } from "swr";
import {
  getPartImages,
  partImagessUrlEndpoint,
} from "../../../app/api/partsApi";
import useAuth from "../../auth/useAuth";

const usePartImages = (partId) => {
  const { user } = useAuth();
  const { mutate } = useSWRConfig();

  const {
    data: partImages,
    isLoading,
    error,
    mutate: mutatePartImages,
  } = useSWR(user ? [partImagessUrlEndpoint, partId] : null, getPartImages);

  const mutateAllLists = () => {
    mutatePartImages();
    mutate(partImagessUrlEndpoint);
  };

  return {
    partImages,
    isLoading,
    error,
    mutate: mutateAllLists,
  };
};

export default usePartImages;
