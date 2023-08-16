import { useEffect } from 'react';
import PickerWheel from './PickerWheel'
import { useState } from 'react';

const MAX_HOUR = 23;
const MAX_MINUTES = 59;

const TimePickerWheel = ({ value, onChange, minutesStep = 1, minTime }) => {

    const minHours = minTime?.hour() || 0;
    const minMinutes = minTime?.minute() || 0;

    const [selectedTime, setSelectedTime] = useState(value);

    useEffect(() => {
        if (minTime?.isAfter(value)) {
            setSelectedTime(minTime);
            onChange(minTime);
        }
    }, [minTime])

    const isRemainingMinutesAvailable = minMinutes + minutesStep <= MAX_MINUTES;
    const availableHours = [...Array((MAX_HOUR + 1)).keys()]

    const isSelectedHourEqualToMinHour = selectedTime.hour() === minHours;
    const availableMinutes = [...Array((MAX_MINUTES + 1) / minutesStep).keys()]
        .map(value => value * minutesStep);

    const onHourChanged = (updatedHour) => {
        setSelectedTime((prevValue) => {
            if (!updatedHour) {
                const newTime = prevValue.clone().hour(0);
                onChange(newTime);
                return newTime;
            }

            if (prevValue.hour() === updatedHour) {
                return prevValue;
            }


            const newTime = prevValue.clone().hour(updatedHour);
            onChange(newTime);
            return newTime;
        });
    }
    const onMinuteChanged = (updatedMinute) => {
        setSelectedTime((prevValue) => {
            if (!updatedMinute) {
                const newTime = prevValue.clone().minute(0);
                onChange(newTime);
                return newTime;
            }

            if (prevValue.minute() === updatedMinute) {
                return prevValue;
            }

            const newTime = prevValue.clone().minute(updatedMinute);
            onChange(newTime);
            return newTime;
        });
    }

    return (
        <div className="d-flex">
            <PickerWheel
                values={availableHours}
                minValue={!!minTime ? (isRemainingMinutesAvailable ? minHours : minHours + 1) : 0}
                value={selectedTime.hour()}
                onChange={onHourChanged} />
            {/* <Typography className='m-auto mx-1' fontSize={20}>:</Typography> */}
            <PickerWheel
                values={availableMinutes}
                minValue={!!minTime && isSelectedHourEqualToMinHour ? minMinutes + minutesStep : 0}
                // maxValue={!!minTime ? undefined : availableHours[availableHours.length - 1]}
                value={selectedTime.minute()}
                prependingZero
                onChange={onMinuteChanged} />
            {/* <Typography className='m-auto mx-1' fontSize={20}>Uhr</Typography> */}
        </div>
    )
}

export default TimePickerWheel