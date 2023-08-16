import { Button, CircularProgress, ListItemAvatar, ListItemText, MenuItem, TableCell, TextField, Tooltip } from '@mui/material';
import { Spinner } from 'react-bootstrap';

import useAuth from '../../../hooks/auth/useAuth';

import { CircularProgressWithLabel, LOCKED, VISIBLE_ICONS, getIconOfStatus } from './ListTableItemUtils';

import UserAvatar from '../../../components/utils/UserAvatar';
import { LIST_PART_STATUS } from '../../../config/list';
import useUsers from '../../../hooks/users/useUsers';
import { formatNumber, formatWeight } from '../../../utils/NumberUtils';
import { formatDate } from '../../../utils/StringUtils';
import { getWeightSumOf } from '../../../utils/checklist/ChecklistPartsUtils';

const AdditionalListInformationCells = ({ list, isVisible, isLoading, handleChangeVisibility, handleChangeWarehouseWorker, onClick }) => {

    const { user } = useAuth();
    const { users } = useUsers();

    const statusIcon = list.locked
        ? LOCKED
        : getIconOfStatus(list.status);

    // Do not include customParts because they have no weight
    const items = list.parts.filter(value => !!value && value.status !== LIST_PART_STATUS.deleted);
    const totalProgress = items.reduce((sum, value) => (sum + ((value.loaded || 0) * (value.part?.weight || 0))), 0);
    const calculatedProgress = (totalProgress / getWeightSumOf(items)) * 100;

    const warehouseWorker = list.warehouseWorker?._id || '';

    return (
        <>
            <TableCell padding="normal" align="center">
                {
                    user?.isAdmin
                        ? (
                            <TextField
                                select
                                required
                                disabled={isLoading}

                                size="small"
                                variant='outlined'
                                fullWidth

                                value={warehouseWorker}
                                onChange={(e) => handleChangeWarehouseWorker(list, e.target.value)}

                                SelectProps={{
                                    renderValue: _ => isLoading ? <CircularProgress size={20} color='inherit' /> : <UserAvatar key={warehouseWorker} size='small' userId={warehouseWorker} />
                                }}
                            >
                                <MenuItem
                                    key='none'
                                    className="mr-3"
                                    value={''}
                                >
                                    <ListItemText>-</ListItemText>
                                </MenuItem>
                                {
                                    users?.map(user =>
                                        <MenuItem
                                            key={user._id}
                                            className="mr-3"
                                            value={user._id}
                                        >
                                            <ListItemAvatar>
                                                <UserAvatar size='small' userId={user._id} />
                                            </ListItemAvatar>
                                            <ListItemText>{user.name}</ListItemText>
                                        </MenuItem>
                                    )
                                }
                            </TextField>
                        ) : (<div className="d-flex gap-2 justify-content-center align-items-center">
                            {
                                !!warehouseWorker && (
                                    <>
                                        <UserAvatar key={warehouseWorker} size='small' userId={warehouseWorker} />
                                        {/* {list.warehouseWorker?.name} */}
                                    </>
                                )
                            }
                        </div>)
                }
            </TableCell>
            <TableCell padding="normal" align="center">
                {statusIcon}
            </TableCell>
            <TableCell padding="none" align="center" className="col-1 px-3 clickable" onClick={onClick}>
                {
                    isNaN(calculatedProgress)
                        ? '-'
                        : (
                            <Tooltip title={`${formatNumber(totalProgress)} kg / ${formatWeight(getWeightSumOf(items))} geladen`}>
                                <span>
                                    <CircularProgressWithLabel value={calculatedProgress} />
                                </span>
                            </Tooltip>
                        )
                }
            </TableCell>
            <TableCell padding="normal" align="center" className='clickable' onClick={onClick}>
                {formatDate(list.createdAt)}
            </TableCell>
            <TableCell padding="normal" align="center" className="col-1">
                <div className="d-flex justify-content-center">
                    {
                        user?.isAdmin && (
                            <Tooltip title={`Für das Lager ${isVisible ? 'verstecken' : 'freischalten'}`}>
                                <span>
                                    <Button
                                        className="p-0"
                                        onClick={() => handleChangeVisibility(list)}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <Spinner size='sm' /> : VISIBLE_ICONS[isVisible]}
                                    </Button>
                                </span>
                            </Tooltip>
                        )
                    }
                </div>
            </TableCell>
        </>
    )
}

export default AdditionalListInformationCells