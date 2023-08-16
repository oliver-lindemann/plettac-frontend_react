import { asArray } from '../../utils/ArrayUtils';
import { dayjsUTC } from '../../utils/DateUtils';
import { baseAuthApi } from './api';

export const timeRecordsUrlEndpoint = '/timeRecords';

export const getTimeRecords = async ({ startDate, endDate, users }) => {

    console.log("Preparing API Request: ", startDate, endDate, users);

    const params = [];
    if (startDate) {
        params.push(`startDate=${startDate.format('YYYY-MM-DD')}`)
    }
    if (endDate) {
        params.push(`endDate=${endDate.format('YYYY-MM-DD')}`)
    }
    if (users) {
        params.push(`users=${asArray(users).join(',')}`);
    }
    const queryString = params.length > 0 ? `?${params.join('&')}` : '';
    console.log("QueryString: ", queryString);

    const response = await baseAuthApi.get(timeRecordsUrlEndpoint + queryString);
    const dataToTransform = asArray(response.data);

    const transformedData = dataToTransform?.map(timeRecord => {
        return {
            ...timeRecord,
            entries: timeRecord.entries?.map(entry => {
                return {
                    ...entry,
                    startTime: dayjsUTC(entry.startTime),
                    endTime: dayjsUTC(entry.endTime)
                }
            }),
            // deviations: timeRecord.deviations?.map(deviation => {
            //     return {
            //         ...deviation,
            //         startTime: dayjsUTC(deviation.startTime),
            //         endTime: dayjsUTC(deviation.endTime)
            //     }
            // }),
            id: timeRecord._id
        }
    })
    return transformedData;
}

export const getTimeRecord = async ([url, id]) => {
    const response = await baseAuthApi.get(`${url}/${id}`);
    if (response.data) {
        response.data.id = id;
    }
    return response.data;
}

export const addTimeRecord = async (timeRecord, overrideExisting) => {
    const response = await baseAuthApi.post(`${timeRecordsUrlEndpoint}${overrideExisting ? '?overrideExisting=true' : ''}`, timeRecord);
    return response.data;
}

export const updateTimeRecord = async (timeRecord, overrideExisting) => {
    const response = await baseAuthApi.patch(`${timeRecordsUrlEndpoint}/${timeRecord.id || timeRecord._id}${overrideExisting ? '?overrideExisting=true' : ''}`, timeRecord)
    return response.data;
}

export const deleteTimeRecord = async (timeRecordId) => {
    return await baseAuthApi.delete(`${timeRecordsUrlEndpoint}/${timeRecordId}`)
}