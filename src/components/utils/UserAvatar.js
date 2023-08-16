import { Avatar, Tooltip } from '@mui/material';
import React from 'react';
import useUser from '../../hooks/users/useUser';
import { stringToPastelColor } from '../../utils/ColorUtils';
import { getInitialsOf } from '../../utils/StringUtils';

const small = { width: 28, height: 28, fontSize: 16 };
const normal = { width: 32, height: 32, fontSize: 18 }

const sizes = { small, normal }

const UserAvatar = ({ userId, size }) => {

    const { user: populatedUser } = useUser(userId);

    let sizeProps = {};
    if (!!size) {
        sizeProps = sizes[size] || {};
    }

    const backgroundColor = populatedUser?.settings?.customColor || stringToPastelColor(populatedUser?.name);
    const initials = getInitialsOf(populatedUser?.name);

    return (
        <Tooltip title={populatedUser?.name}>
            <Avatar
                variant="rounded"
                sx={{
                    ...sizeProps,
                    bgcolor: backgroundColor
                }}
            >
                {initials}
            </Avatar>
        </Tooltip>
    )
}

export default UserAvatar