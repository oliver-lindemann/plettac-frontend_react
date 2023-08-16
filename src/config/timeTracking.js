import { ROLES } from "./roles";

export const DEFAULT_BREAK_TIME_MINUTES = 60;
export const TIME_TRACKING_SUMMER_BEGIN = 3; // Summer WorkingHours begins at April (3)
export const TIME_TRACKING_SUMMER_ENDS = 9; // Summer WorkingHours begins at Oktober (9)

const AZ_WINTER_STANDARD = [7.5, 7.5, 7.5, 7.5, 6.5, 0];
const AZ_SUMMER_STANDARD = [8.5, 8.5, 8.5, 8.5, 8, 0];

const AZ_LAGER = [8.5, 8.5, 8.5, 8.5, 6.5, 0];
const AZ_OFFICE = [7.5, 7.5, 7.5, 7.5, 5, 0];

const PAUSE_STANDARD = [1, 1, 1, 1, 1, 1];
const PAUSE_LAGER = [1, 1, 1, 1, 1, 1];
const PAUSE_OFFICE = [1, 1, 1, 1, 0.5, 1];

export const getWorkingHoursOfMonth = (month) => {
    if (month >= TIME_TRACKING_SUMMER_BEGIN
        && month <= TIME_TRACKING_SUMMER_ENDS) {
        return 'summer';
    }
    return 'winter';
}

export const WORKING_TIME_STANDARD = {
    summer: {
        workingHours: AZ_SUMMER_STANDARD,
        breakTimes: PAUSE_STANDARD
    },
    winter: {
        workingHours: AZ_WINTER_STANDARD,
        breakTimes: PAUSE_STANDARD
    }
}

export const WORKING_TIME_LAGER = {
    summer: {
        workingHours: AZ_LAGER,
        breakTimes: PAUSE_LAGER
    },
    winter: {
        workingHours: AZ_LAGER,
        breakTimes: PAUSE_LAGER
    }
}

export const WORKING_TIME_OFFICE = {
    summer: {
        workingHours: AZ_OFFICE,
        breakTimes: PAUSE_OFFICE
    },
    winter: {
        workingHours: AZ_OFFICE,
        breakTimes: PAUSE_OFFICE
    }
}

export const DEFAULT_WORKING_TIME = WORKING_TIME_STANDARD;

export const getDefaultTimeTracking = (user) => {
    if (!user || !user?.roles) {
        return DEFAULT_WORKING_TIME;
    }

    if (user.roles.includes(ROLES.Admin)) {
        return WORKING_TIME_OFFICE;
    }

    if (user.roles.includes(ROLES.Lager)) {
        return WORKING_TIME_LAGER
    }

    return WORKING_TIME_STANDARD;
}