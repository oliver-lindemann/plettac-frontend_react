import { Tooltip } from "@mui/material"
import { LIST_STATUS } from "./list"
import { DoNotDisturbOutlined, FileDownloadOutlined, FileUploadOutlined } from "@mui/icons-material"

export const DELIVERY_NOTE_STATUS = {
    ...LIST_STATUS,
    BILLED: 'Abgerechnet'
}

export const DELIVERY_NOTE_TYPE = {
    RENTAL: 'Rental',
    SALE: 'Sale'
}

export const DELIVERY_NOTE_LOGISTICS = {
    INBOUND: 'INBOUND',
    OUTBOUND: 'OUTBOUND',
    CANCELLATION: 'CANCELLATION'
}

export const DELIVERY_NOTE_LOGISTICS_LANG = {
    INBOUND: "Mat.-Rücklieferung",
    OUTBOUND: 'Mat.-Ausgabe',
    CANCELLATION: 'Storno'
}

export const DELIVERY_NOTE_LOGISTICS_ICONS = {
    INBOUND: <Tooltip title="Rücklieferung"><FileDownloadOutlined color='success' /></Tooltip>,
    OUTBOUND: <Tooltip title="Ausgabe"><FileUploadOutlined color='error' /></Tooltip>,
    CANCELLATION: <Tooltip title="Stornierung"><DoNotDisturbOutlined color='error' /></Tooltip>
}

export const DELIVERY_NOTE_LOGISTICS_ICONS_TEXT = {
    INBOUND: <Tooltip title="Rücklieferung"><div className="d-flex gap-2 align-items-center"><FileDownloadOutlined color='success' />{DELIVERY_NOTE_LOGISTICS_LANG[DELIVERY_NOTE_LOGISTICS.INBOUND]}</div></Tooltip>,
    OUTBOUND: <Tooltip title="Ausgabe"><div className="d-flex gap-2 align-items-center"><FileUploadOutlined color='error' />{DELIVERY_NOTE_LOGISTICS_LANG[DELIVERY_NOTE_LOGISTICS.OUTBOUND]}</div></Tooltip>,
    CANCELLATION: <Tooltip title="Stornierung"><div className="d-flex gap-2 align-items-center"><DoNotDisturbOutlined color='error' />{DELIVERY_NOTE_LOGISTICS_LANG[DELIVERY_NOTE_LOGISTICS.CANCELLATION]}</div></Tooltip>
}

export const formatNumber = (number) => {
    const formattedNumber = (+number).toLocaleString('de-DE', {
        minimumIntegerDigits: 5,
        useGrouping: false
    });
    return `LS-${formattedNumber}`;
}

export const formatDeliveryNoteNumber = (deliveryNote) => {
    return formatNumber(deliveryNote.uniqueNumber);
}
