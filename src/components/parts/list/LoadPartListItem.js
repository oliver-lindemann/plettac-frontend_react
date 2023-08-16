import PartItem from '../../../features/parts/PartItem';
import { Button, TableCell, TableRow, Typography } from '@mui/material';
import { LIST_PART_STATUS } from '../../../config/list'

import { ReactComponent as ForkliftIcon } from '../../../images/forklift.svg'

const isPartFullyLoaded = (partItem) => {
    // Falls das Element als 'deleted' markiert wurde, soll die geladene Menge = 0 sein
    // Andernfalls soll die vorgegebene Menge aufgeladen sein
    return getLoadedAmount(partItem) === (partItem.status === LIST_PART_STATUS.deleted ? 0 : partItem.amount);
}

const getLoadedAmount = (partItem) => {
    return +(partItem.loaded || 0);
}

const getPartItemCellStyle = (partItem) => {
    return partItem.status === LIST_PART_STATUS.deleted
        ? { textDecorationLine: 'line-through' }
        : {};
}

const getTableStyles = (partItem) => {
    let rowClasses = isPartFullyLoaded(partItem) ? 'loadingList__part__complete' : '';
    let cellClasses = '';
    switch (partItem.status) {
        case LIST_PART_STATUS.added:
            cellClasses = 'loadingList__part__status__added';
            break;
        case LIST_PART_STATUS.modified:
            cellClasses = 'loadingList__part__status__modified';
            break;
        case LIST_PART_STATUS.deleted:
            cellClasses = 'loadingList__part__status__deleted';
            break;
        default:
            break;
    }
    return { rowClasses, cellClasses };
}

const getLoadText = (partItem) => {
    const loadedAmount = getLoadedAmount(partItem);
    let loadValue = (+partItem.amount - loadedAmount) + ' zu laden';
    if (partItem.status === LIST_PART_STATUS.deleted) {
        loadValue = loadedAmount > 0
            ? <b>{loadedAmount} abzuladen</b>
            : <b>nicht laden</b>
    } else if (partItem.status === LIST_PART_STATUS.modified && loadedAmount > partItem.amount) {
        loadValue = <b>{loadedAmount - partItem.amount} abzuladen</b>;
    }
    return loadValue;
}

const LoadPartListItem = ({ partItem, onLoading, onLoadItem }) => {
    const { rowClasses, cellClasses } = getTableStyles(partItem);
    return (
        <TableRow className={rowClasses}>
            <TableCell padding='none'>
                <div className={cellClasses} style={{ width: '8px', minHeight: '60px', maxHeight: '100%', flexGrow: 1 }} />
            </TableCell>
            <TableCell padding='none' style={{ paddingLeft: 1 }}>
                {getLoadedAmount(partItem)} / <b>{partItem.amount}</b>
                <Typography variant="body2">
                    {getLoadText(partItem)}
                </Typography>
            </TableCell>
            <TableCell padding='none'>
                <PartItem part={partItem.part} style={getPartItemCellStyle(partItem)} />
            </TableCell>
            <TableCell padding='none' className='p-1' align='right'>
                <Button
                    variant="outlined"
                    color={onLoading ? "success" : "error"}
                    onClick={() => onLoadItem(partItem)}
                    style={{ width: '75px', height: '60px' }}
                >
                    <ForkliftIcon width="2em" height="2em" />
                </Button>
            </TableCell>
        </TableRow >
    )
}

export default LoadPartListItem