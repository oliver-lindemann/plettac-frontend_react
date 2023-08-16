import { useEffect, useState, useRef } from 'react';

import { Paper } from '@mui/material'
import WheelItem from './WheelItem';
import WheelOverlay from './WheelOverlay';

import { CONTAINER_HEIGHT, CONTAINER_WIDTH, ITEM_MAX_FONT_SIZE, ITEM_MAX_HEIGHT, ITEM_MIN_FONT_SIZE } from './PickerWheelConstants';
import { prependZero } from '../../../utils/NumberUtils'

const PADDING_ITEMS_AMOUNT = 2;
// const SIZE_DIFFERENCE = ITEM_MIN_HEIGHT / PADDING_ITEMS_AMOUNT;

const PickerWheel = ({ value, values, minValue, onChange, prependingZero }) => {

    if (values?.length <= 0 || values.indexOf(value) < 0) {
        throw new Error("Nicht genügend Werte übergeben oder Wert nicht in gegebenen Werten vorhande.");
    }

    const listRef = useRef();
    const scrollHandled = useRef(false);

    const [selectedIndex, setSelectedIndex] = useState(values.indexOf(value));

    const scrollListener = (e) => {
        const scrollContainer = e.target;
        const calculatedScrollIndex = scrollContainer.scrollTop / ITEM_MAX_HEIGHT;

        if (calculatedScrollIndex < (values.indexOf(minValue))) {
            if (!scrollHandled.current) {
                scrollHandled.current = true;
                setTimeout(() => {
                    scrollContainer.scrollTo({ top: (values.indexOf(minValue)) * ITEM_MAX_HEIGHT, left: 0, behavior: 'smooth' });
                    scrollHandled.current = false;
                }, 500);
            }
            return;
        }

        setSelectedIndex(calculatedScrollIndex);

        if (calculatedScrollIndex % 1 === 0) {
            onChange(values[calculatedScrollIndex]);
        }
    }

    useEffect(() => {
        const minIndex = values.indexOf(minValue);
        const newIndex = selectedIndex < minIndex ? minIndex : selectedIndex;
        listRef.current.scrollTop = newIndex * ITEM_MAX_HEIGHT;

        if (selectedIndex !== newIndex) {
            onChange(values[newIndex]);
        }
        // const newIndex = values.indexOf(value < minValue ? minValue : value);
        // const newIndex = selectedIndex < minIndex ? minIndex : selectedIndex;
    }, [value, values])

    useEffect(() => {
        const scrollElement = listRef.current;
        scrollElement?.addEventListener('scroll', scrollListener);
        return () => scrollElement.removeEventListener('scroll', scrollListener);
        //eslint-disable-next-line
    }, [listRef, minValue]);

    return (
        <Paper>
            {/* <Button variant="contained" color="error" style={{ width: CONTAINER_WIDTH }}><KeyboardArrowUp /></Button> */}
            <Paper
                ref={listRef}
                style={{
                    height: CONTAINER_HEIGHT,
                    width: CONTAINER_WIDTH,
                    overflow: 'auto',
                    padding: 0,
                    scrollSnapType: 'y mandatory',
                    position: 'relative',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'  /* IE and Edge */
                }}
            >

                <WheelOverlay />

                {[...Array(PADDING_ITEMS_AMOUNT)].map((_, index) => <WheelItem height={ITEM_MAX_HEIGHT} key={index - PADDING_ITEMS_AMOUNT} />)}
                {values.map((value, index) => {
                    const difference = Math.min(Math.abs(selectedIndex - index), 1);
                    const fontSize = ITEM_MAX_FONT_SIZE - (difference * (ITEM_MAX_FONT_SIZE - ITEM_MIN_FONT_SIZE));
                    // const height = ITEM_MAX_HEIGHT - ((ITEM_MAX_HEIGHT - ITEM_MIN_HEIGHT) / PADDING_ITEMS_AMOUNT) * difference
                    return <WheelItem
                        key={index}
                        value={value < minValue ? '' : (prependingZero ? prependZero(value) : value)}
                        selected={index === values.indexOf(selectedIndex)}
                        height={ITEM_MAX_HEIGHT}
                        fontSize={fontSize}
                    />
                }
                )}
                {[...Array(PADDING_ITEMS_AMOUNT)].map((_, index) => <WheelItem height={ITEM_MAX_HEIGHT} key={index + values.length} />)}



            </Paper>
            {/* <Button variant="contained" color="error" style={{ width: CONTAINER_WIDTH }}><KeyboardArrowDown /></Button> */}
        </Paper>
    )
}

export default PickerWheel