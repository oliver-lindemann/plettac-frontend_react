import { ROLES } from "../config/roles";
import { asArray } from "./ArrayUtils";

export const userHasRoles = (user, roles) => {
  const rolesArray = asArray(roles);
  return user?.roles?.some((role) => rolesArray.includes(role));
};

export const userHasRole = (user, role) => user?.roles?.includes(role) || false;

export const isAdmin = (user) => userHasRole(user, ROLES.Admin);
export const isBauleiter = (user) => userHasRole(user, ROLES.Bauleiter);

export const isAdminOrBauleiter = (user) =>
  userHasRoles(user, [ROLES.Admin, ROLES.Bauleiter]);

export const isLager = (user) => userHasRole(user, ROLES.Lager);

export const isTimeTracking = (user) => userHasRole(user, ROLES.TimeTracking);
