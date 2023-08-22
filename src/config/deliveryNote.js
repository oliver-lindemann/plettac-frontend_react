import { LIST_STATUS } from "./list"

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
