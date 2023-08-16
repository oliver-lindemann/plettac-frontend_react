import { LIST_STATUS } from "./list"

export const PLETTAC = 'PLETTAC';
export const GMW = 'GMW';

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
    OUTBOUND: 'OUTBOUND'
}

export const DELIVERY_NOTE_LOGISTICS_LANG = {
    INBOUND: "Mat.-Rücklieferung",
    OUTBOUND: 'Mat.-Ausgabe'
}

export const formatDeliveryNoteNumber = (deliveryNote) => {
    const formattedNumber = deliveryNote.uniqueNumber?.toLocaleString('de-DE', {
        minimumIntegerDigits: 5,
        useGrouping: false
    });
    return `LS-${formattedNumber}`;
}
