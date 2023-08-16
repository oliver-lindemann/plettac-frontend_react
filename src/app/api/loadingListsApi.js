import { baseAuthApi } from './api';

export const loadingListsUrlEndpoint = '/loadingLists';

export const getLoadingLists = async (url) => {
    const response = await baseAuthApi.get(url);
    const transformedData = response.data
        // Nach Status und Datum sortieren
        ?.sort((a, b) => (a.status < b.status || a.dateOfCreation < b.dateOfCreation) ? 1 : -1)
        .map(loadingList => {
            return {
                ...loadingList,
                id: loadingList._id
            }
        })
    return transformedData;
}

export const addLoadingList = async (loadingList) => {
    const response = await baseAuthApi.post(loadingListsUrlEndpoint, loadingList);
    return response;
}

export const updateLoadingList = async (loadingList) => {
    const response = await baseAuthApi.patch(`${loadingListsUrlEndpoint}/${loadingList._id}`, loadingList)
    return response.data;
}

export const deleteLoadingList = async (loadingListId) => {
    return await baseAuthApi.delete(`${loadingListsUrlEndpoint}/${loadingListId}`)
}

export const downloadExcelFile = async (loadingListId) => {
    return await baseAuthApi.get(`${loadingListsUrlEndpoint}/file/${loadingListId}`, {
        responseType: 'blob'
    });
}

export const getHistory = async (loadingListId) => {
    const response = await baseAuthApi.get(`${loadingListsUrlEndpoint}/history/${loadingListId}`);
    return response.data;
}