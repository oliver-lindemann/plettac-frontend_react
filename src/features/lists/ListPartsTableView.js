import { TableCell, TableRow } from '@mui/material'
import CustomizablePartsList from '../../components/parts/CustomizablePartsList';
import PartItemTd from '../parts/PartItemTd';

const ListPartsTableView = ({ list }) => {
    return (
        <CustomizablePartsList
            partItems={[...list.parts, ...list.customParts]}
            columnCount={2}
            getRow={(partItem, index) => (
                <TableRow>
                    <TableCell padding="normal" className='centertext'>
                        {`${partItem.loaded || 0} / `}
                        <b>{partItem.amount}</b>
                    </TableCell>
                    <PartItemTd part={partItem.part} />
                </TableRow>
            )}
        />
    )
}

export default ListPartsTableView