import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

import { ChecklistOutlined, MenuOutlined, Search } from "@mui/icons-material";
import { Badge, BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";

import useAuth from "../../hooks/auth/useAuth";
import useDeliveryNotes from "../../hooks/deliveryNotes/useDeliveryNotes";

import { LINKS } from "../../config/accessiblePages";
import { LIST_STATUS } from "../../config/list";
import useUser from "../../hooks/users/useUser";

export const BOTTOM_NAV_HEIGHT = 56;

const getNumberOfOpenLists = (lists) => {
    return lists?.reduce((result, list) => result + (list.status === LIST_STATUS.OPEN ? 1 : 0), 0)
}

export const getPageIndex = (route, user) => {
    const baseRoute = route?.split('/')[1];

    // Monteur: <PART> <CHECKLIST> <UPLOADS> <MORE>
    // Lager: <PART> <CHECKLIST> <MORE>
    // Admin: <PART> <CHECKLIST> <UPLOADS> <MORE>

    // lastEntry only differs for Lager-User (!admin & lager)
    const index = user?.settings?.bottomNavItems?.indexOf(`/${baseRoute}`);
    if (index > -1) return index;
    return user?.settings?.bottomNavItems?.length || -1;
}

const BottomNav = () => {

    const { user } = useAuth();
    const { user: currentUser } = useUser(user?.id);
    const { deliveryNotes } = useDeliveryNotes();

    const location = useLocation();

    const value = useMemo(() => getPageIndex(location?.pathname, currentUser), [location, currentUser]);
    const openChecklistsCount = useMemo(() => getNumberOfOpenLists(deliveryNotes), [deliveryNotes]);

    if (!user) {
        return null;
    }

    return (
        <Paper
            elevation={3}
            sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
            }}
            className='bottom-navigation'
        >
            <BottomNavigation
                showLabels
                value={value}
            >
                <BottomNavigationAction
                    label={LINKS.Parts.text}
                    icon={<Search />}
                    to={LINKS.Parts.linkTo}
                    component={Link}
                    key='parts'
                />

                <BottomNavigationAction
                    label={LINKS.DeliveryNotes.text}
                    icon={
                        <Badge
                            badgeContent={openChecklistsCount || null}
                            color="error">
                            <ChecklistOutlined />
                        </Badge>
                    }
                    to={LINKS.DeliveryNotes.linkTo}
                    component={Link}
                    key='deliveryNotes'
                />

                <BottomNavigationAction
                    label="Mehr..."
                    icon={<MenuOutlined />}
                    to="/more"
                    component={Link}
                    key='more'
                />
            </BottomNavigation>
        </Paper>
    )
}

export default BottomNav