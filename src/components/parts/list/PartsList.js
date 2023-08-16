import { GroupedVirtuoso } from "react-virtuoso";
import { useMemo } from "react";

const convertArrayValuesToObjectKeys = (arr) => {
    // eslint-disable-next-line
    return arr.reduce((acc, curr) => (acc[curr] = 0, acc), {});
}

const getPartsPerGroup = (parts, partGroups) => {

    const counts = parts.reduce((result, part) => {
        if (!result.hasOwnProperty(part.origin)) {
            result[part.origin] = 0;
        }
        result[part.origin]++;
        return result;
        // Alle Origins (LS-SYSTEM, LS-MODUL, ...) sollen in der finalen Suche
        // enthalten sein, auch wenn kein Element in diesen enthalten ist
        // Andernfalls würde die Darstellung durcheinander kommen und bspw.
        // Modulteile unter 'System' angezeigt werden.
    }, convertArrayValuesToObjectKeys(partGroups));

    console.log(counts);

    return Object.values(counts);
}

const PartsList = ({ parts, head, row }) => {

    const partGroups = useMemo(() => parts?.reduce((origins, part) => {
        if (!origins.includes(part.origin)) {
            origins.push(part.origin);
        }
        return origins;
    }, []) || [], [parts]);

    const groupCounts = getPartsPerGroup(parts, partGroups);

    return (
        <GroupedVirtuoso
            groupCounts={groupCounts}
            groupContent={index => head(partGroups[index])}
            itemContent={(index, groupIndex) => row(parts[index])}
        />
    )
}

export default PartsList