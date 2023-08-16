import { LockOutlined } from "@mui/icons-material";
import { Box, Chip, CircularProgress, Typography } from "@mui/material";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { LIST_STATUS_ICONS_DESKTOP } from "../../../config/list";

export const LOCKED = <Chip size="small" sx={{ bgcolor: '#fae17d' }} icon={<LockOutlined />} label='Gesperrt' />;
export const VISIBLE_ICONS = {
    'true': <MdOutlineVisibility color="#487d32" size={25} />,
    'false': <MdOutlineVisibilityOff color="#d32f2f" size={25} />,
}

export const getIconOfStatus = (status) => {
    return LIST_STATUS_ICONS_DESKTOP[status];
}

export const CircularProgressWithLabel = (props) => {

    const progress = Math.round(props.value) || 0;

    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" {...props} />
            <Box
                sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="caption" component="div" color="text.secondary">
                    {`${progress}%`}
                </Typography>
            </Box>
        </Box>
    );
}