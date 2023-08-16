import React from 'react'

import { BsTrash } from 'react-icons/bs';
import { Button } from 'react-bootstrap';
import CHECKLIST_STATUS_PART from '../../config/checklistPartStatus';
import { TableCell, TableRow, TextField } from '@mui/material';
import PartItemTd from '../../features/parts/PartItemTd';

const PartsListItem = ({ part, amount, status, onAmountChanged, onItemDeleted }) => {

    const onPartItemAmountChanged = (e) => onAmountChanged(part._id, e.target.value);
    const onDeleteChecklistPart = () => onItemDeleted(part._id);

    if (!part) {
        return <tr><td>Loading...</td></tr>;
    }

    let rowClasses = '';
    let cellClasses = '';
    switch (status) {
        case CHECKLIST_STATUS_PART.added:
            cellClasses = 'checklist__part__status__added pe-1';
            break;
        case CHECKLIST_STATUS_PART.modified:
            cellClasses = 'checklist__part__status__modified pe-1';
            break;
        case CHECKLIST_STATUS_PART.deleted:
            cellClasses = 'checklist__part__status__deleted pe-1';
            rowClasses += 'checklist__part__status__deleted-tr';
            break;
        default:
            break;
    }

    return (
        <TableRow className={rowClasses}>
            <TableCell padding="none" className={cellClasses}></TableCell>
            <PartItemTd part={part} key={part._id} />
            <TableCell padding="none" className='pe-2'>
                <TextField
                    className="rounded"
                    type='number'
                    min='1'
                    // style={{ fontSize: "16pt" }}
                    value={amount}
                    onChange={onPartItemAmountChanged}
                />
            </TableCell>
            <TableCell padding="none" align='center' className='pe-2'>
                <Button
                    variant='outline-danger'
                    onClick={onDeleteChecklistPart}
                >
                    <BsTrash size="1.5em" />
                </Button>
            </TableCell>
        </TableRow>
    )
}

export default PartsListItem