import { isIOS } from "react-device-detect";

export const TOP_NAV_HEIGHT = 64;

export const IOS_PADDING = 10;
export const PADDING = isIOS ? IOS_PADDING : 0;
export const BOTTOM_NAV_HEIGHT = 56 + PADDING;

