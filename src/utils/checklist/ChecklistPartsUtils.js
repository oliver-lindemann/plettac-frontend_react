import { groupByCustom } from "../ArrayUtils";
import { formatNumber } from "../NumberUtils";

export const copyArray = (arrayToCopy) => {
    if (!arrayToCopy) {
        return [];
    }
    return arrayToCopy.map(item => { return { ...item } });
}

export const sortChecklistPartsByOrderIndex = (checklistParts) => {
    return checklistParts.sort((a, b) => a.part.orderIndex > b.part.orderIndex ? 1 : -1);
}

export function groupPartsByOrigin(parts) {
    const dataGroupedByOriginArray = [];
    const dataGroupedByOrigin = groupByCustom(parts, partItem => partItem.part.origin);
    for (const key in dataGroupedByOrigin) {
        const part = {
            id: key,
            parts: [...dataGroupedByOrigin[key]]
        }
        dataGroupedByOriginArray.push(part);
    }
    return dataGroupedByOriginArray;
}

const getTotalPartItemsWeight = (partItem) => {
    return (partItem.part.weight * partItem.amount) || 0;
}

export const getWeightSumOf = (checklistParts) => {
    if (!checklistParts) {
        return 0;
    }

    return formatNumber(
        checklistParts?.map(partItem => getTotalPartItemsWeight(partItem))
            .reduce((sum, weight) => sum + weight, 0)
    );
}