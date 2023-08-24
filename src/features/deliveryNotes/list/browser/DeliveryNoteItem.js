import { useNavigate } from "react-router-dom";

import { DoNotDisturbOutlined, FileDownloadOutlined, FileUploadOutlined } from "@mui/icons-material";
import { TableCell, TableRow, Tooltip, Typography } from "@mui/material";

import CenteredPulseLoader from "../../../../components/loading/CenteredPulseLoader";
import UserAvatar from "../../../../components/utils/UserAvatar";
import AdditionalListInformationCells from "../../../lists/table/AdditionalListInformationCells";
import { DELIVERY_NOTE_LOGISTICS_ICONS } from "../../../../config/deliveryNote";


function DeliveryNoteItem({ deliveryNote, isChangingVisibility, handleChangeDeliveryNoteVisible, handleChangeWarehouseWorker }) {

    const navigate = useNavigate();

    if (!deliveryNote) {
        return <CenteredPulseLoader />
    }

    // Check if this deliveryNote gets visible/edited
    const isLoading = isChangingVisibility === deliveryNote;
    const handleViewDeliveryNote = () => navigate(`/deliveryNotes/${deliveryNote.id}`);

    return (
        <>
            <TableRow style={{ backgroundColor: deliveryNote?.visible ? '' : '#f5f5f5' }}>
                <TableCell padding="normal" className="px-3" align="center" >
                    <UserAvatar userId={deliveryNote.author?._id} size='normal' />
                </TableCell>
                <TableCell padding="normal" className="col-5 clickable" onClick={handleViewDeliveryNote}>
                    <Typography variant="body1">
                        {deliveryNote.customer?.name}
                    </Typography>
                    <Typography variant="subtitle2">
                        {deliveryNote.uniqueNumber}
                    </Typography>
                </TableCell>
                <TableCell padding="normal" className="col-1" >
                    {deliveryNote.licensePlate}
                </TableCell>
                <TableCell padding="normal" align="center" className="col-1" >
                    {DELIVERY_NOTE_LOGISTICS_ICONS[deliveryNote.logistics]}
                </TableCell>
                <AdditionalListInformationCells
                    list={deliveryNote}
                    isLoading={isLoading}
                    isVisible={deliveryNote.visible}
                    handleChangeVisibility={handleChangeDeliveryNoteVisible}
                    handleChangeWarehouseWorker={handleChangeWarehouseWorker}
                    onClick={handleViewDeliveryNote}
                />
            </TableRow>
        </>
    );
}

export default DeliveryNoteItem;