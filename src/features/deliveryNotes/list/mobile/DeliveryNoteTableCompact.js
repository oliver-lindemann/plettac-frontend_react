import { useState } from 'react';
import { useSWRConfig } from "swr";
import {
    updateDeliveryNote,
    deliveryNotesUrlEndpoint as cacheKey
} from '../../../../app/api/deliveryNotesApi';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import DeliveryNoteItemCompact from './DeliveryNoteItemCompact';

const DeliveryNoteTableCompact = ({ deliveryNotes }) => {

    const { mutate } = useSWRConfig()
    const [isVisible, setIsVisible] = useState(null);

    const handleVisibleDeliveryNote = async (deliveryNote) => {
        try {
            setIsVisible(deliveryNote);
            deliveryNote.visible = !deliveryNote.visible;
            await updateDeliveryNote(deliveryNote);
            mutate(cacheKey);
        } finally {
            setIsVisible(null)
        }
    }

    return (
        <TableContainer component={Paper} className="mb-5">
            <Table>
                <TableHead style={{ backgroundColor: '#212529' }}>
                    <TableRow >
                        <TableCell padding="none" className="p-2 ps-3" style={{ color: 'white' }}><b>Firma</b></TableCell>
                        <TableCell padding="none" className="p-2 ps-3" style={{ color: 'white' }}><b>Datum</b></TableCell>
                        <TableCell padding="none" className="p-2 ps-3" style={{ color: 'white' }}><b>Status</b></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        deliveryNotes.length > 0
                            ? (deliveryNotes.map(deliveryNote =>
                                <DeliveryNoteItemCompact
                                    deliveryNote={deliveryNote}
                                    isVisible={isVisible}
                                    handleVisibleDeliveryNote={handleVisibleDeliveryNote}
                                    key={deliveryNote.id} />
                            ))
                            : (<TableRow><TableCell colSpan="3">Momentan gibt es keine unbearbeiteten Ladelisten!</TableCell></TableRow>)
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default DeliveryNoteTableCompact