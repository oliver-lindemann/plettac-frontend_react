import { toCapitalCase } from '../../../utils/StringUtils';
import { TableCell, TableRow } from '@mui/material';

export const getGroupAsString = (group) => {
    if (!group) return '';

    const strippedGroup = toCapitalCase(group.replace('LS-', ''));
    if (strippedGroup === 'Custom') {
        return 'Benutzerdefiniert'
    }
    return strippedGroup;
}

const DefaultPartItemsListHeader = ({ group, colSpan }) => {
    return (
        <TableRow
            style={{ backgroundColor: '#212529', position: 'sticky', top: 0, zIndex: 1 }}
        >
            <TableCell
                colSpan={colSpan}
                padding='none'
                className='text-md-center p-1 shadow border border-dark'
            >
                <p
                    className="font-monospace p-0 m-0 fw-bold"
                    style={{ color: '#fff' }}
                >
                    {getGroupAsString(group)}
                </p>
            </TableCell>
        </TableRow>
    )
}

export default DefaultPartItemsListHeader