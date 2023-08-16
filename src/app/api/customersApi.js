import { baseAuthApi } from './api';

export const customersUrlEndpoint = '/customers';

export const getCustomers = async () => {
    const response = await baseAuthApi.get(customersUrlEndpoint);
    const transformedData = response.data?.map(customer => {
        return {
            ...customer,
            id: customer._id
        }
    })
    return transformedData;
}

export const getCustomer = async ([url, id]) => {
    const response = await baseAuthApi.get(`${url}/${id}`);
    if (response.data) {
        response.data.id = id;
    }
    return response.data;
}

export const addCustomer = async (customer) => {
    const response = await baseAuthApi.post(customersUrlEndpoint, customer);
    return response.data;
}

export const updateCustomer = async (customer) => {
    const response = await baseAuthApi.patch(`${customersUrlEndpoint}/${customer.id || customer._id}`, customer)
    return response.data;
}

export const deleteCustomer = async (customerId) => {
    return await baseAuthApi.delete(`${customersUrlEndpoint}/${customerId}`)
}