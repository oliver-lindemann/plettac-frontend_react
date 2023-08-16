import { ROLES } from "../config/roles";

export const isAdmin = (user) => {
    return user?.roles?.includes(ROLES.Admin);
}

export const isTimeTracking = (user) => {
    return user?.roles?.includes(ROLES.TimeTracking)
}