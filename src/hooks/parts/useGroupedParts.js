import { useState, useEffect } from 'react';
import { groupBy } from '../../utils/ArrayUtils';

import useParts from './useParts';

function groupPartsByOrigin(parts) {
    const dataGroupedByOriginArray = [];
    const dataGroupedByOrigin = groupBy(parts, "origin");
    for (const key in dataGroupedByOrigin) {
        const part = {
            id: key,
            parts: [...dataGroupedByOrigin[key]]
        }
        dataGroupedByOriginArray.push(part);
    }
    return dataGroupedByOriginArray;
}

const useGroupedParts = () => {
    const {
        parts,
        isLoading,
        error
    } = useParts();

    const [groupedParts, setGroupedParts] = useState([]);
    useEffect(() => {
        if (parts) {
            setGroupedParts(groupPartsByOrigin(parts));
        }
    }, [parts])

    return {
        groupedParts,
        isLoading: isLoading || (!error && !groupedParts),
        error: error
    }
}

export default useGroupedParts