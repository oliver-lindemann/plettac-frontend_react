import { useMemo } from 'react';
import { IconButton, InputAdornment, TableCell, TableRow, TextField, Tooltip } from '@mui/material';
import { DeleteOutlined } from '@mui/icons-material';
import PartItem from '../../../features/parts/PartItem';
import { LIST_PART_STATUS } from '../../../config/list';

const CustomPartsListItem = ({ part, amount, status, onAmountChanged, onItemDeleted }) => {

    const onPartItemAmountChanged = (e) => onAmountChanged(part, e.target.value);
    const onDeleteChecklistPart = () => onItemDeleted(part);

    let rowClasses = '';
    let cellClasses = '';
    switch (status) {
        case LIST_PART_STATUS.added:
            cellClasses = 'checklist__part__status__added pe-1';
            break;
        case LIST_PART_STATUS.modified:
            cellClasses = 'checklist__part__status__modified pe-1';
            break;
        case LIST_PART_STATUS.deleted:
            cellClasses = 'checklist__part__status__deleted pe-1';
            rowClasses += 'checklist__part__status__deleted-tr';
            break;
        default:
            break;
    }

    const PartItemCell = useMemo(() => (
        !!part ? (<PartItem part={part} key={part._id} />) : 'Loading...'
        //eslint-disable-next-line
    ), [part])

    const AmountField = useMemo(() => (
        <TextField
            type='number'
            min='1'
            // style={{ fontSize: "16pt" }}
            value={amount}
            onChange={onPartItemAmountChanged}
            InputProps={{
                endAdornment: <InputAdornment position='end'>Stk.</InputAdornment>
            }}
        />
        //eslint-disable-next-line
    ), [amount, onAmountChanged]);

    const DeleteButton = useMemo(() => (
        <Tooltip title='Löschen'>
            <IconButton
                variant='outlined'
                color="error"
                style={{ height: '100%' }}
                onClick={onDeleteChecklistPart}
            >
                <DeleteOutlined />
            </IconButton>
        </Tooltip>
        //eslint-disable-next-line
    ), [onItemDeleted]);

    return (
        <TableRow className='m-0 p-0'>
            <TableCell
                className={rowClasses}
                style={{ margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'space-between' }}
            >
                <div className='d-flex gap-2 align-items-center' style={{ flexGrow: 1 }} key={part._id}>
                    <div className={cellClasses}></div>
                    {PartItemCell}
                </div>
                <div
                    className='d-flex gap-2 align-items-center justify-content-end py-1'
                    style={{ flexGrow: 1 }}
                >
                    {AmountField}
                    {DeleteButton}
                </div>
            </TableCell>
        </TableRow>
    )
}

export default CustomPartsListItem