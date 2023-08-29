import { useNavigate } from "react-router-dom";

import CenteredPulseLoader from "../../../../components/loading/CenteredPulseLoader";

import { LockOutlined } from "@mui/icons-material";
import { Button, Chip, TableCell, TableRow, Tooltip, Typography } from "@mui/material";
import { Spinner } from "react-bootstrap";
import { HiArrowDownTray, HiArrowUpTray } from "react-icons/hi2";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import useAuth from "../../../../hooks/auth/useAuth";
import { formatDate } from "../../../../utils/StringUtils";
import { LIST_STATUS_ICONS_MOBILE } from "../../../../config/list";
import { DELIVERY_NOTE_LOGISTICS, DELIVERY_NOTE_LOGISTICS_ICONS } from "../../../../config/deliveryNote";


const LOCKED = <Chip size="small" sx={{ bgcolor: '#fae17d' }} icon={<LockOutlined />} label='Gesperrt' />;
const visibleIcons = {
    'true': <MdOutlineVisibility color="#487d32" size={25} />,
    'false': <MdOutlineVisibilityOff color="#d32f2f" size={25} />,
}

function getIconOfStatus(status) {
    return LIST_STATUS_ICONS_MOBILE[status];
}

function DeliveryNoteItemCompact({ deliveryNote, isVisible, handleVisibleDeliveryNote }) {

    const navigate = useNavigate();
    const { user } = useAuth();

    if (!deliveryNote) {
        return <CenteredPulseLoader />
    }

    // Check if this deliveryNote gets visible/edited
    const isLoading = isVisible === deliveryNote;
    const deliveryNoteIcon = deliveryNote.locked
        ? LOCKED
        : getIconOfStatus(deliveryNote.status);

    const visibleIcon = user?.isAdmin ? (
        <Tooltip title={`Für das Lager ${deliveryNote.visible ? 'verstecken' : 'freischalten'}`}>
            <span>
                <Button
                    className="p-0"
                    onClick={() => handleVisibleDeliveryNote(deliveryNote)}
                    disabled={isLoading}
                >
                    {isLoading ? <Spinner size='sm' /> : visibleIcons[deliveryNote.visible]}
                </Button>
            </span>
        </Tooltip>
    ) : null;

    const handleViewDeliveryNote = () => navigate(`/deliveryNotes/${deliveryNote.id}`);

    return (
        <>
            <TableRow>
                <TableCell padding="normal" rowSpan={2} className="col-8" style={{ verticalAlign: 'top' }} onClick={handleViewDeliveryNote}>
                    <div className="d-flex" style={{ alignItems: 'center' }}>
                        <Typography variant="body1">
                            {deliveryNote.customer?.name}
                        </Typography>
                    </div>
                    <Typography variant="body2">
                        {deliveryNote.author?.name}
                    </Typography>
                </TableCell>
                <TableCell padding="normal" align="center" className="col-1" onClick={handleViewDeliveryNote}>
                    {formatDate(deliveryNote.dateOfCreation)}
                </TableCell>
                <TableCell padding="normal" align="center" className="col-1 pe-1">
                    <div className="d-flex justify-content-center">
                        {deliveryNoteIcon}
                        {visibleIcon}
                    </div>
                </TableCell>
            </TableRow>
            <TableRow className="m-0 p-0" onClick={handleViewDeliveryNote}>
                <TableCell padding="normal" colSpan={2} className="p-2 ps-0" >
                    <Typography variant="caption" display="block" style={{ textAlign: "end" }}>
                        {DELIVERY_NOTE_LOGISTICS_ICONS[deliveryNote.logistics]}
                    </Typography>
                </TableCell>
            </TableRow>
        </>
    );
}

export default DeliveryNoteItemCompact;