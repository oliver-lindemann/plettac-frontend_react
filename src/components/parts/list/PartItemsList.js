import { GroupedVirtuoso } from "react-virtuoso";
import { useMemo } from "react";
import DefaulPartItemsListHeader from "./DefaultPartItemsListHeader";

const convertArrayValuesToObjectKeys = (arr) => {
    // eslint-disable-next-line
    return arr.reduce((acc, curr) => (acc[curr] = 0, acc), {});
}

const getPartsPerGroup = (partItems, partGroups) => {

    const counts = partItems.reduce((result, partItem) => {
        if (!result.hasOwnProperty(partItem.part.origin)) {
            result[partItem.part.origin] = 0;
        }
        result[partItem.part.origin]++;
        return result;
        // Alle Origins (LS-SYSTEM, LS-MODUL, ...) sollen in der finalen Suche
        // enthalten sein, auch wenn kein Element in diesen enthalten ist
        // Andernfalls würde die Darstellung durcheinander kommen und bspw.
        // Modulteile unter 'System' angezeigt werden.
    }, convertArrayValuesToObjectKeys(partGroups));

    console.log(counts);

    return Object.values(counts);
}

const defaultHeader = (group, index) => (<DefaulPartItemsListHeader group={group} />)

const PartItemsList = ({ partItems = [], head = defaultHeader, row }) => {

    console.log(partItems);

    const partGroups = useMemo(() => partItems?.reduce((origins, partItem) => {
        if (!origins.includes(partItem.part.origin)) {
            origins.push(partItem.part.origin);
        }
        return origins;
    }, []) || [], [partItems]);

    const groupCounts = getPartsPerGroup(partItems, partGroups);

    console.log(partGroups, groupCounts);

    return (
        <GroupedVirtuoso
            groupCounts={groupCounts}
            groupContent={index => head(partGroups[index], index)}
            itemContent={(index, groupIndex) => row(partItems[index], index)}
        />
    )
}

export default PartItemsList