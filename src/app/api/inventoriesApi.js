import { baseAuthApi } from './api';

export const inventoriesUrlEndpoint = '/plettac/inventories';

export const getInventories = async () => {
    const response = await baseAuthApi.get(inventoriesUrlEndpoint);
    const transformedData = response.data?.map(inventory => {
        return {
            ...inventory,
            id: inventory._id
        }
    })
    return transformedData;
}

export const getInventory = async ([url, id]) => {
    const response = await baseAuthApi.get(`${url}/${id}`);
    if (response.data) {
        response.data.id = id;
    }
    return response.data;
}

export const addInventory = async (inventory) => {
    const response = await baseAuthApi.post(inventoriesUrlEndpoint, inventory);
    return response.data;
}

export const updateInventory = async (inventory) => {
    const response = await baseAuthApi.patch(`${inventoriesUrlEndpoint}/${inventory.id || inventory._id}`, inventory)
    return response.data;
}

export const deleteInventory = async (inventoryId) => {
    return await baseAuthApi.delete(`${inventoriesUrlEndpoint}/${inventoryId}`)
}