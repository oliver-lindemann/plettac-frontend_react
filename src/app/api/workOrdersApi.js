import { baseAuthApi } from './api';

export const workOrdersUrlEndpoint = '/workOrders';

export const getWorkOrders = async ({ includeArchived }) => {
    const response = await baseAuthApi.get(workOrdersUrlEndpoint, { includeArchived });
    const transformedData = response.data?.map(workOrder => {
        return {
            ...workOrder,
            id: workOrder._id
        }
    })
    return transformedData;
}

export const addWorkOrder = async (workOrder) => {
    const response = await baseAuthApi.post(workOrdersUrlEndpoint, workOrder);
    return response.data;
}

export const updateWorkOrder = async (workOrder) => {
    const response = await baseAuthApi.patch(`${workOrdersUrlEndpoint}/${workOrder.id || workOrder._id}`, workOrder)
    return response.data;
}

export const deleteWorkOrder = async (workOrderId) => {
    return await baseAuthApi.delete(`${workOrdersUrlEndpoint}/${workOrderId}`)
}