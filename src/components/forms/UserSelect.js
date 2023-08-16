import { Box } from '@mui/system';
import { Checkbox, Chip, FormControl, IconButton, InputLabel, ListItemText, MenuItem, OutlinedInput, Select } from '@mui/material'
import { v4 as uuidv4 } from 'uuid';
import { Clear } from '@mui/icons-material';
import { asArray } from '../../utils/ArrayUtils';

const UserSelect = ({ title, singleSelect, users, excludedUser, alwaysAssignedUsers, assignedUsers, setAssignedUsers, disabled, clearable }) => {

    // Es wird teils ein Array von Objekten übergeben: {_id: <id>, name: <name>}
    // Dieses muss in ein reines _id-Array transformiert werden.
    const transformedAssignedUsers = asArray(assignedUsers).map(user => typeof (user) !== 'string' ? user._id : user).filter(userId => users?.some(user => user._id === userId));
    const transformedAlwaysAssignedUsers = alwaysAssignedUsers?.map(user => typeof (user) !== 'string' ? user._id || user.id : user) || [];

    const selectedValue = singleSelect
        ? (transformedAssignedUsers.length > 0 ? transformedAssignedUsers[0] : '')
        : transformedAssignedUsers;

    const id = uuidv4();
    const onAssignedUsersChanged = (e) => {
        const selectedUsers = Array.isArray(e.target.value) ? e.target.value : [e.target.value];
        let updatedUsers = [].concat(transformedAlwaysAssignedUsers);
        updatedUsers = updatedUsers.concat(selectedUsers?.filter(value => !transformedAlwaysAssignedUsers?.includes(value)));
        setAssignedUsers(updatedUsers);
    }

    return (
        <FormControl fullWidth>
            <InputLabel id={id}>{title}</InputLabel>
            <Select
                labelId={id}
                multiple={!singleSelect}
                fullWidth
                disabled={disabled}
                value={selectedValue}
                onChange={onAssignedUsersChanged}
                input={<OutlinedInput label={title} />}
                endAdornment={
                    clearable
                        ? <IconButton
                            disabled={disabled}
                            onClick={() => setAssignedUsers([null])}
                            sx={{ visibility: selectedValue ? 'visible' : 'hidden', marginRight: '15px' }}>
                            <Clear />
                        </IconButton>
                        : null
                }
                renderValue={selectedUsers => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {
                            singleSelect
                                ? <Chip key={selectedUsers + "_chip"} label={users?.find(user => user._id === selectedUsers)?.name} />
                                : selectedUsers?.map(value => <Chip key={value + "_chip"} label={users?.find(user => user._id === value)?.name} />)
                        }
                    </Box>
                )}
                MenuProps={{ PaperProps: { style: { maxHeight: 225 } } }}
            >
                {
                    users?.filter(value => value._id !== excludedUser?.id).map((value) => (
                        <MenuItem key={value._id + "_menuitem"} value={value._id} >
                            {
                                !singleSelect
                                    ? <Checkbox checked={transformedAssignedUsers.includes(value._id)} disabled={disabled} />
                                    : null
                            }
                            <ListItemText primary={users?.find(user => user._id === value._id)?.name} />
                        </MenuItem>
                    ))
                }
            </Select>
        </FormControl>
    )
}

export default UserSelect