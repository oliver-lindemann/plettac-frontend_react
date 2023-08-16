import { Fab } from '@mui/material'
import React from 'react'

const FloatingButton = ({ onClick, color, icon, type, disabled, text }) => {
    return (
        <Fab
            type={type || ''}
            color={color || "primary"}
            onClick={onClick}
            disabled={disabled || false}
            sx={{
                position: 'fixed',
                bottom: (theme) => theme.spacing(10),
                right: (theme) => theme.spacing(4)
            }}
        // variant={text ? 'extended' : null}
        >
            {/* {!!text ? (<div className='mx-1'>{text}</div>) : null} */}
            {icon}
        </Fab>
    )
}

export default FloatingButton