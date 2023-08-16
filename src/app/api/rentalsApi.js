import { baseAuthApi } from './api';

export const rentalsUrlEndpoint = '/rentals';

export const getRentals = async () => {
    const response = await baseAuthApi.get(rentalsUrlEndpoint);
    const transformedData = response.data?.map(rental => {
        return {
            ...rental,
            id: rental._id
        }
    })
    return transformedData;
}

export const getRental = async ([url, id]) => {
    const response = await baseAuthApi.get(`${url}/${id}`);
    if (response.data) {
        response.data.id = id;
    }
    return response.data;
}

export const addRental = async (rental) => {
    const response = await baseAuthApi.post(rentalsUrlEndpoint, rental);
    return response.data;
}

export const updateRental = async (rental) => {
    const response = await baseAuthApi.patch(`${rentalsUrlEndpoint}/${rental.id || rental._id}`, rental)
    return response.data;
}

export const deleteRental = async (rentalId) => {
    return await baseAuthApi.delete(`${rentalsUrlEndpoint}/${rentalId}`)
}