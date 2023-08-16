import { Delete, Edit } from '@mui/icons-material'
import { IconButton, Tooltip, Typography } from '@mui/material'
import React from 'react'
import { Col, Form } from 'react-bootstrap'

const SignatureDisplay = ({ title, signature, onEdit, onDelete }) => {
    return (
        <Form.Group as={Col} className="mt-3">
            <img src={signature} alt="nicht vorhanden" style={{ maxHeight: '75px', maxWidth: '100%', objectFit: 'contain', margin: 'auto' }} />
            <hr style={{ marginBottom: 0 }} />
            <div className='d-flex gap-2'>
                <Typography style={{ flexGrow: 1, alignSelf: 'center' }}>{title}</Typography>
                <Tooltip title="Neue Unterschrift erstellen"><IconButton onClick={onEdit}><Edit /></IconButton></Tooltip>
                <Tooltip title="Unterschrift löschen"><IconButton onClick={onDelete}><Delete color="error" /></IconButton></Tooltip>
            </div>
        </Form.Group>
    )
}

export default SignatureDisplay