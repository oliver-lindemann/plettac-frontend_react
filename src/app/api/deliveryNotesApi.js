import { baseAuthApi } from './api';

export const deliveryNotesUrlEndpoint = '/plettac/deliveryNotes';

export const getDeliveryNotes = async (url) => {
    const response = await baseAuthApi.get(url);
    const transformedData = response.data
        // Nach Status und Datum sortieren
        ?.sort((a, b) => (a.status < b.status || a.dateOfCreation < b.dateOfCreation) ? 1 : -1)
        .map(deliveryNote => {
            return {
                ...deliveryNote,
                id: deliveryNote._id
            }
        })
    return transformedData;
}

export const addDeliveryNote = async (deliveryNote) => {
    const response = await baseAuthApi.post(deliveryNotesUrlEndpoint, deliveryNote);
    return response;
}

export const updateDeliveryNote = async (deliveryNote) => {
    const response = await baseAuthApi.patch(`${deliveryNotesUrlEndpoint}/${deliveryNote._id}`, deliveryNote)
    return response.data;
}

export const deleteDeliveryNote = async (deliveryNoteId) => {
    return await baseAuthApi.delete(`${deliveryNotesUrlEndpoint}/${deliveryNoteId}`)
}

export const downloadExcelFile = async (deliveryNoteId) => {
    return await baseAuthApi.get(`${deliveryNotesUrlEndpoint}/file/${deliveryNoteId}`, {
        responseType: 'blob'
    });
}

export const getHistory = async (deliveryNoteId) => {
    const response = await baseAuthApi.get(`${deliveryNotesUrlEndpoint}/history/${deliveryNoteId}`);
    return response.data;
}