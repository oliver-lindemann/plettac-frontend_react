import { getBytes, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { baseAuthApi } from './api';
import { storage } from './firebase';
import { EXCEL_TEMPLATE_PATH } from '../../config/template';
import { error } from 'jquery';

export const partsUrlEndpoint = '/parts';
export const partImagessUrlEndpoint = '/parts/images';

export const getParts = async () => {
    const response = await baseAuthApi.get(partsUrlEndpoint);
    const transformedData = response.data?.map(part => {
        return {
            ...part,
            id: part._id
        }
    })
    return transformedData;
}

export const getPart = async ([url, id]) => {
    const response = await baseAuthApi.get(`${url}/${id}`);
    if (response.data) {
        response.data.id = id;
    }
    return response.data;
}

export const getPartImages = async ([url, id]) => {
    const response = await baseAuthApi.get(`${url}/${id}`);
    return response.data;
}

export const createPart = async (part) => {
    const response = await baseAuthApi.post(`${partsUrlEndpoint}`, part);
    return response.data;
}

export const updatePart = async (part) => {
    const response = await baseAuthApi.patch(`${partsUrlEndpoint}`, part);
    return response.data;
}

export const downloadExcelTemplate = () => {
    const storageRef = ref(storage, EXCEL_TEMPLATE_PATH);
    return getBytes(storageRef);
}

export const updateExcelTemplate = async (file, setProgress) => {
    console.log("Upload Template API");
    return await uploadExcelTemplate(file, setProgress);
}

const uploadExcelTemplate = (file, setProgress) => {
    // get referencing object of firebase api to this file
    const storageRef = ref(storage, EXCEL_TEMPLATE_PATH);

    return new Promise(async (resolve, reject) => {
        // begin upload of file
        const uploadTask = uploadBytesResumable(storageRef, file);

        // listen for upload state changes
        uploadTask.on("state_changed",
            snapshot => updateProgressFromSnapshot(snapshot, setProgress),
            error => reject(error),
            async () => resolve()
        );
    });
}

const updateProgressFromSnapshot = (snapshot, setProgress) => {
    console.log("Updating Progress...");
    const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
    setProgress(progress.toFixed(2));
}