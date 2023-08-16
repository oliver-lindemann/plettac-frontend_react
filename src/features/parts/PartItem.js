import { PulseLoader } from 'react-spinners';
import { parseColors } from "../../utils/ColorUtils";
import { formatNumber, formatWeight } from "../../utils/NumberUtils";

import { Typography } from "@mui/material";
import ColorCircle from "../../components/part/ColorCircle";
import useImageModal from '../../hooks/parts/useImageModal';

function PartItem({ part, onClick }) {

    const imageModal = useImageModal();

    if (!part) {
        return <td><PulseLoader /></td>;
    }

    if (part.origin === 'CUSTOM') {
        // Dieses Element ist nicht im Teilekatalog enthalten und wurde selbst hinzugefügt
        // Es besitzt nur einen Namen und keine weiteren Eigenschaften
        return (
            <div className="m-0 p-1 ps-2">
                {/* In der ersten Zeile steht der Name / die Beschreibung des Artikels */}
                {part.name}
            </div >
        )
    }

    const parsedColors = parseColors(part.color);

    return (
        // <Tooltip
        //     title={<PartItemHover part={part} />}
        //     placement="bottom-end"
        //     // enterDelay={1000}
        //     // Popper may be shown outside of window, prevent this behaviour
        //     PopperProps={{
        //         disablePortal: true,
        //         popperOptions: {
        //             positionFixed: true,
        //             modifiers: {
        //                 name: 'preventOverflow',
        //                 options: {
        //                     enabled: true,
        //                     boundariesElement: "window" // where "window" is the boundary
        //                 }
        //             }

        //         }
        //     }}
        // >
        <div
            className="m-0 p-1 ps-2"
            onClick={() => onClick ? onClick(part) : imageModal.openModal(part)}
            style={{ cursor: 'pointer' }}
        >
            {/* In der ersten Zeile steht der Name / die Beschreibung des Artikels */}
            <Typography>{part.name}</Typography>
            {/* {part.name} */}
            {/* In der zweiten Zeile folgen (sofern vorhanden):
            >> Länge | Farbe | Gewicht | Artikelnummer */}
            <div className="d-flex flex-wrap align-items-center fw-lighter" style={{ color: '#6d6d6d' }}>

                {/* Länge ggf. hinzufügen */}
                {part.length &&
                    <>
                        <b>L/H: {formatNumber(part.length)}</b>
                        <div className="mx-1">|</div>
                    </>
                }

                {/* Farbe ggf. hinzufügen */}
                {
                    parsedColors?.length > 0 || part.color === "keine Farbe"
                        ? (
                            <>
                                <b>{part.color}</b>
                                <div className="mx-1">|</div>
                                {
                                    part.color !== "keine Farbe"
                                    && parsedColors.map((color, index) =>
                                        <ColorCircle
                                            colorItem={color}
                                            variant='small'
                                            key={index}
                                        />
                                    )
                                }
                                <div className="mx-1">|</div>
                            </>
                        )
                        : null
                }

                {/* Gewicht ggf hinzufügen */}
                {
                    part.weight && (
                        <div style={{ whiteSpace: 'nowrap' }}>{formatWeight(part.weight)}</div>
                    )
                }

                {/* Artikelnummer hinzufügen */}
                <div className="mx-1">|</div>
                {part.articleNr}
            </div>
        </div >
        // </Tooltip >
    );
}

export default PartItem;