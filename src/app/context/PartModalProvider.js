import { useEffect, useState } from "react";
import { getPartImages, partImagessUrlEndpoint } from "../api/partsApi";
import Swal from "sweetalert2";
import PartModalContext from "./PartModalContext";

// Der Zurück-Button soll den Modal-Dialog schließen 
// anstatt eine Seite zurückzunavigieren

const neutralizeBack = (callback) => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
        window.history.pushState(null, "", window.location.href);
        callback();
    };
};

const revivalBack = () => {
    window.onpopstate = undefined;
};

const PartModalProvider = ({ children }) => {

    const [visible, setVisible] = useState(false);
    const [item, setItem] = useState({});

    useEffect(() => {
        if (visible) {
            neutralizeBack(closeModalHandler);
        } else {
            revivalBack();
        }
    }, [visible])

    const openModalHandler = async (part) => {
        // Prüfen, ob eine Artikelnummer hinterlegt ist.
        // Falls nicht, soll eine Nachricht an den Anwender angezeigt werden
        // und der Server _nicht_ nach einem Bild gefragt werden (return)
        if (!part?.articleNr) {
            // Kein Bild vorhanden, Nachricht anzeigen
            Swal.fire({
                title: 'Kein Bild vorhanden',
                text: 'Zu diesem Element sind keine Bilder vorhanden.',
                icon: 'info'
            });
            return;
        }

        setVisible(true);

        // Alle Bilder dieses Artikels abfragen
        try {
            const response = await getPartImages([partImagessUrlEndpoint, part._id]);
            if (!response
                || !response.imageFiles
                || response.imageFiles.length <= 0) {
                console.log(response);
                throw new Error("No images available")
            }
            setItem({ part, images: response.imageFiles })
        } catch (error) {
            closeModalHandler();
            Swal.fire({
                title: 'Kein Bild vorhanden',
                text: 'Zu diesem Element sind keine Bilder vorhanden.',
                icon: 'info',
                confirmButtonColor: '#3085d6'
            });
        }
    }

    const closeModalHandler = () => {
        setVisible(false);
        setItem({});
    }

    const partModalContext = {
        item: item,
        visible: visible,
        openModal: openModalHandler,
        closeModal: closeModalHandler
    }

    return (
        <PartModalContext.Provider value={partModalContext}>
            {children}
        </PartModalContext.Provider>
    );
};

export default PartModalProvider;