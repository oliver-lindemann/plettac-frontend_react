import React from 'react'
import { Typography } from '@mui/material'

const WheelItem = ({ value, height, fontSize }) => {
    return (
        <div
            style={{
                height: height,
                scrollSnapAlign: 'center',
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <Typography fontSize={fontSize}>
                {value}
            </Typography>
        </div>
    )
}

export default WheelItem