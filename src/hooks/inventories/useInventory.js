import { useState, useEffect } from "react";
import useInventories from "./useInventories";

const useInventory = (inventoryId) => {
    const {
        inventories,
        isLoading,
        error,
        mutate
    } = useInventories();

    const [inventory, setInventory] = useState();
    useEffect(() => {
        setInventory(inventories?.find(inventory => inventory._id === inventoryId));
    }, [inventories])

    return { inventory, isLoading, error, mutate };
}

export default useInventory;