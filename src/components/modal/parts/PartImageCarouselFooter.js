import { parseColors } from '../../../utils/ColorUtils';
import { formatNumber } from '../../../utils/NumberUtils';
import ColorCircle from '../../part/ColorCircle';

const PartImageCarouselFooter = ({ part }) => {

    let partLength = null;
    let partColors = null;

    if (part.length) {
        partLength = <p className="m-0 p-0 me-3">L/H: <b>{formatNumber(part.length)}</b></p>;
    }

    const parsedColors = parseColors(part.color);
    if (parsedColors.length > 0 || part.color === "keine Farbe") {
        partColors = (
            <div className="d-flex align-items-center">
                <p className="m-0 p-0 me-2">Farbe: <b>{part.color}</b></p>
                {
                    part.color !== "keine Farbe"
                    && parsedColors.map((color, index) => <ColorCircle colorItem={color} key={`Color_${index}`} />)
                }
            </div>
        )
    }

    return (
        <div className="">
            {partLength}
            {partColors}
        </div>
    )
}

export default PartImageCarouselFooter