import React from 'react'

const ColorCircle = ({ colorItem, variant }) => {

    const isSmall = variant === 'small';

    let colorClass;
    let colorStyle;
    const minWidth = isSmall ? '16px' : '32px';

    if (colorItem.variant === 'Ring') {
        colorClass = "rounded-circle";
        if (isSmall) {
            colorStyle = { border: `4px solid ${colorItem.color}` };
        } else {
            colorStyle = { border: `8px solid ${colorItem.color}` };
        }
    } else {
        colorClass = "rounded";
        colorStyle = { backgroundColor: colorItem.color, border: "1px solid #343a40" };
    }

    return <div
        className={`${isSmall ? 'small-dot' : 'dot'} ${colorClass}`}
        style={{ ...colorStyle, minWidth }} />
}

export default ColorCircle