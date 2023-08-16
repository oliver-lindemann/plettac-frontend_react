import { useState } from 'react';
import DeliveryNoteItem from './DeliveryNoteItem'
import { useSWRConfig } from "swr";
import {
    updateDeliveryNote,
    deliveryNotesUrlEndpoint as cacheKey
} from '../../../../app/api/deliveryNotesApi';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const DeliveryNoteTable = ({ deliveryNotes }) => {

    const { mutate } = useSWRConfig()
    const [isChangingVisibility, setIsChangingVisibility] = useState(null);

    const handleChangeDeliveryNoteVisible = async (deliveryNote) => {
        try {
            setIsChangingVisibility(deliveryNote);
            deliveryNote.visible = !deliveryNote.visible;
            await updateDeliveryNote(deliveryNote);
            mutate(cacheKey);
        } finally {
            setIsChangingVisibility(null)
        }
    }

    const handleChangeVehicle = async (deliveryNote, newVehicle) => {
        try {
            setIsChangingVisibility(deliveryNote);
            deliveryNote.vehicle = newVehicle || ''
            await updateDeliveryNote(deliveryNote);
            mutate(cacheKey);
        } finally {
            setIsChangingVisibility(null)
        }
    }

    const handleChangeWarehouseWorker = async (deliveryNote, newWarehouseWorker) => {
        console.log(newWarehouseWorker)
        try {
            setIsChangingVisibility(deliveryNote);
            deliveryNote.warehouseWorker = newWarehouseWorker || ''
            await updateDeliveryNote(deliveryNote);
            mutate(cacheKey);
        } finally {
            setIsChangingVisibility(null)
        }
    }

    return (
        <TableContainer component={Paper} className="">
            <Table>
                <TableHead style={{ backgroundColor: '#212529' }}>
                    <TableRow >
                        <TableCell padding="none" align="center" className="p-2" style={{ color: 'white' }}><b>Von</b></TableCell>
                        <TableCell padding="none" className="p-2 ps-3" style={{ color: 'white' }}><b>Kunde</b></TableCell>
                        <TableCell padding="none" className="p-2 ps-3" style={{ color: 'white' }}><b>Kennzeichen</b></TableCell>
                        <TableCell padding="none" align='center' className="p-2 ps-3" style={{ color: 'white' }}><b>Typ</b></TableCell>
                        <TableCell padding="none" align='center' className="p-2" style={{ color: 'white' }}><b>Bearbeiter</b></TableCell>
                        <TableCell padding="none" align='center' className="p-2" style={{ color: 'white' }}><b>Status</b></TableCell>
                        <TableCell padding="none" className="p-2 ps-3" style={{ color: 'white' }}></TableCell>
                        <TableCell padding="none" className="p-2 ps-3" style={{ color: 'white' }}><b>Datum</b></TableCell>
                        <TableCell padding="none" className="p-2 ps-3" style={{ color: 'white' }}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        deliveryNotes.length > 0
                            ? (deliveryNotes.map((deliveryNote, index) =>
                                <DeliveryNoteItem
                                    key={index}
                                    deliveryNote={deliveryNote}
                                    isChangingVisibility={isChangingVisibility}
                                    handleChangeDeliveryNoteVisible={handleChangeDeliveryNoteVisible}
                                    handleChangeWarehouseWorker={handleChangeWarehouseWorker}
                                    handleChangeVehicle={handleChangeVehicle}
                                />
                            ))
                            : (<TableRow><TableCell colSpan="7">Es gibt momentan keine offenen Lieferscheine.</TableCell></TableRow>)
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default DeliveryNoteTable