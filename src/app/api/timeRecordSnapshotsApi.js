import { asArray } from '../../utils/ArrayUtils';
import { dayjsUTC } from '../../utils/DateUtils';
import { baseAuthApi } from './api';

export const timeRecordSnapshotsUrlEndpoint = '/timeRecordSnapshots';

export const getTimeRecordSnapshots = async () => {

    const response = await baseAuthApi.get(timeRecordSnapshotsUrlEndpoint);
    const dataToTransform = asArray(response.data);

    const transformedData = dataToTransform?.map(timeRecordSnapshot => {
        return {
            ...timeRecordSnapshot,
            timeRecords: timeRecordSnapshot.timeRecords?.map(timeRecord => {
                return {
                    ...timeRecord,
                    entries: timeRecord.entries?.map(entry => {
                        return {
                            ...entry,
                            startTime: dayjsUTC(entry.startTime),
                            endTime: dayjsUTC(entry.endTime)
                        }
                    })
                }
            }),
            id: timeRecordSnapshot._id
        }
    })
    return transformedData;
}

export const addTimeRecordSnapshot = async (timeRecordSnapshot) => {
    const response = await baseAuthApi.post(timeRecordSnapshotsUrlEndpoint, timeRecordSnapshot);
    return response.data;
}

export const updateTimeRecordSnapshot = async (timeRecordSnapshot) => {
    const response = await baseAuthApi.patch(`${timeRecordSnapshotsUrlEndpoint}/${timeRecordSnapshot.id || timeRecordSnapshot._id}`, timeRecordSnapshot)
    return response.data;
}

export const restoreTimeRecordSnapshot = async (timeRecordSnapshotId) => {
    return await baseAuthApi.post(`${timeRecordSnapshotsUrlEndpoint}/restore/${timeRecordSnapshotId}`)
}

export const deleteTimeRecordSnapshot = async (timeRecordSnapshotId) => {
    return await baseAuthApi.delete(`${timeRecordSnapshotsUrlEndpoint}/${timeRecordSnapshotId}`)
}