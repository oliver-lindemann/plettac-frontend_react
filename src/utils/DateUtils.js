import dayjs from "dayjs";
const utc = require('dayjs/plugin/utc');
const minMax = require('dayjs/plugin/minMax');
require('dayjs/locale/de');
dayjs.extend(utc);
dayjs.extend(minMax);
dayjs.locale('de');

export const WEEKDAY_FRIDAY = 5;
export const WEEKDAY_SATURDAY = 6;
export const WEEKDAY_SUNDAY = 0;

export const getDateDifference = (startTime, endTime, unit) => {
    return endTime.diff(startTime, unit);
}

export const getDateDifferenceInMinutes = (startTime, endTime) => {
    return getDateDifference(startTime, endTime, 'minutes');
}

export const getDateDifferenceInMinutesFormatted = (startTime, endTime) => {
    return formatMinutes(getDateDifferenceInMinutes(startTime, endTime));
}

export const formatMinutes = (minutes) => {
    const hourDiff = Math.floor(minutes / 60);
    const minuteDiff = Math.round(minutes % 60);

    return `${hourDiff}:${minuteDiff.toLocaleString('de-DE', { minimumIntegerDigits: 2, useGrouping: false })}`;
}

export const getDateWithoutTime = () => {
    const date = new Date();
    removeTimeFromDate(date);
    return date;
}

export const removeTimeFromDate = (date) => {
    if (date) {
        date.setUTCHours(0, 0, 0, 0);
    }
    return date;
}

export const isDateEqualWithoutTime = (date1, date2) => {
    if (!date1 || !date2) {
        return false;
    }

    return date1.getYear() === date2.getYear()
        && date1.getMonth() === date2.getMonth()
        && date1.getDate() === date2.getDate();
}

export const firstDayOfMonth = (date) => {
    removeTimeFromDate(date);
    if (date) {
        date.setDate(1);
    }
    return date;
}

export const lastDayOfMonth = (date) => {
    removeTimeFromDate(date);
    if (date) {
        firstDayOfMonth(date);
        date.setMonth(date.getMonth() + 1)
        date.setDate(0);
    }
    return date;
}


export const getDayjsWithoutTime = (date) => {
    return dayjsUTC(date).startOf('day');
}

export const dayjsUTC = (date) => {
    return dayjs.utc(date);
}

export const dayjsMin = (...values) => {
    return dayjs.min(...values);
}

export const dayjsMax = (...values) => {
    return dayjs.max(...values);
}

export const convertToUTC = (date) => {
    return dayjs.utc(date)
        .set('year', date.year())
        .set('month', date.month())
        .set('date', date.date())
        .set('hour', date.hour());
}

export const cleanTime = (date) => {
    if (!date) {
        return date;
    }

    const dayjsUTCDate = typeof (date) === 'object' ? date : dayjsUTC(date);
    return dayjs.utc(`1970-01-01 ${dayjsUTCDate.hour()}:${dayjsUTCDate.minute()}:00.000`, 'YYYY-MM-DD HH:mm:ss:SSS');
}

export const isWorkday = (date) => {
    return date.day() !== WEEKDAY_SUNDAY && date.day() !== WEEKDAY_SATURDAY;
}

export const isWeekend = (date) => {
    // return date.day() === 0 || date.day() === 6;
    return date.day() === WEEKDAY_SUNDAY;
}