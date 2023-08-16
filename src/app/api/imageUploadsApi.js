import { baseAuthApi } from './api';

export const imageUploadsUrlEndpoint = '/uploads';
export const QUERY_UPDATE_NOTE_ONLY = 'update=note';

export const getImageUploads = async () => {
    const response = await baseAuthApi.get(imageUploadsUrlEndpoint);
    const transformedData = response.data?.map(imageUpload => {
        return {
            ...imageUpload,
            id: imageUpload._id
        }
    })
    return transformedData;
}

export const getImageUpload = async ([url, id]) => {
    const response = await baseAuthApi.get(`${url}/${id}`);
    if (response.data) {
        response.data.id = id;
    }
    return response.data;
}

export const addImageUpload = async (imageUpload) => {
    const response = await baseAuthApi.post(imageUploadsUrlEndpoint, imageUpload);
    return response.data;
}

export const addImageToImageUpload = async (image) => {
    const response = await baseAuthApi.post(`${imageUploadsUrlEndpoint}/add`, image);
    return response.data;
}

export const updateImageUpload = async (imageUpload, ...queryParams) => {
    const queryParamsArray = Array.from(queryParams);
    const query = queryParamsArray.length > 0 ? `?${queryParamsArray.join(',')}` : '';
    const response = await baseAuthApi.patch(`${imageUploadsUrlEndpoint}/${imageUpload.id || imageUpload._id}${query}`, imageUpload)
    return response.data;
}

export const deleteImageUpload = async (imageUploadId) => {
    return await baseAuthApi.delete(`${imageUploadsUrlEndpoint}/${imageUploadId}`)
}