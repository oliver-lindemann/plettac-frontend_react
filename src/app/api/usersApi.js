import { baseAuthApi } from './api';

export const usersUrlEndpoint = '/users';

export const getUsers = async () => {
    const response = await baseAuthApi.get(usersUrlEndpoint);
    const transformedData = response.data?.map(user => {
        return {
            ...user,
            id: user._id
        }
    })
    return transformedData;
}

export const getUser = async ([url, id]) => {
    const response = await baseAuthApi.get(`${url}/${id}`);
    if (response.data) {
        response.data.id = id;
    }
    return response.data;
}

export const addUser = async (user) => {
    const response = await baseAuthApi.post(usersUrlEndpoint, user);
    return response.data;
}

export const updateUser = async (user) => {
    const response = await baseAuthApi.patch(`${usersUrlEndpoint}/${user.id || user._id}`, user)
    return response.data;
}

export const deleteUser = async (userId) => {
    return await baseAuthApi.delete(`${usersUrlEndpoint}/${userId}`)
}

// ! TODO move into own file
export const submitFeedback = async (text) => {
    return await baseAuthApi.post(`/feedback`, { text });
}


export const subscribePushNotification = async (deviceToken) => {
    return await baseAuthApi.post(`/notification/subscribe`, { deviceToken });
}