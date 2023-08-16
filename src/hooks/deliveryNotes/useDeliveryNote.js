import { useState, useEffect } from "react";
import useDeliveryNotes from "./useDeliveryNotes";

const useDeliveryNote = (deliveryNoteId) => {
    const {
        deliveryNotes,
        isLoading,
        error,
        mutate
    } = useDeliveryNotes();

    const [deliveryNote, setDeliveryNote] = useState();

    useEffect(() => {
        setDeliveryNote(deliveryNotes?.find(deliveryNote => deliveryNote._id === deliveryNoteId));
    }, [deliveryNotes])

    return {
        deliveryNote,
        isLoading,
        error,
        mutate
    };
}

export default useDeliveryNote;