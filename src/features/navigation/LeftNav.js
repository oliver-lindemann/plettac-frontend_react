import { useLocation } from 'react-router-dom'

import { BusinessOutlined, ChecklistOutlined, Inventory2Outlined, MenuOutlined, Search } from '@mui/icons-material'
import { Badge, Divider, Drawer, List, Toolbar } from '@mui/material'

import useAuth from '../../hooks/auth/useAuth'
import useDeliveryNotes from '../../hooks/deliveryNotes/useDeliveryNotes'

import { useMemo } from 'react'
import { LIST_STATUS } from '../../config/list'
import DrawerListItem from './DrawerListItem'
import useInventories from '../../hooks/inventories/useInventories'

const getNumberOfOpenLists = (lists) => {
    return lists?.reduce((result, list) => result + (list.status === LIST_STATUS.OPEN ? 1 : 0), 0)
}

const LeftNav = () => {

    const { user } = useAuth();
    const { inventories } = useInventories();
    const { deliveryNotes } = useDeliveryNotes();
    const location = useLocation();

    const baseRoute = location?.pathname;

    const openChecklistsCount = useMemo(() => getNumberOfOpenLists(deliveryNotes), [deliveryNotes]);

    if (!user) {
        return null;
    }

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 240,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
            }}
        >
            <Toolbar />
            <List>
                <DrawerListItem
                    text='Teilekatalog'
                    icon={<Search />}
                    route='/parts'
                    baseRoute={baseRoute}
                />
                <DrawerListItem
                    text='Lieferscheine'
                    icon={
                        <Badge
                            badgeContent={openChecklistsCount || null}
                            color="error">
                            <ChecklistOutlined />
                        </Badge>
                    }
                    route='/deliveryNotes'
                    baseRoute={baseRoute}
                />
                {/* {
                    (user?.isAdmin || user?.isLager || user?.roles?.includes(ROLES.Bauleiter)) && (
                        <Collapse in={baseRoute?.startsWith('/deliveryNotes')} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                <DrawerListItem
                                    text='Archiv'
                                    icon={<ArchiveOutlined />}
                                    route='/deliveryNotes/archive'
                                    baseRoute={baseRoute}
                                    sx={{ pl: 4 }}
                                />
                            </List>
                        </Collapse>
                    )
                } */}

{(user?.isAdmin || inventories?.length > 0) && (
          <DrawerListItem
            text="Inventuren"
            icon={<Inventory2Outlined />}
            route="/inventories"
            baseRoute={baseRoute}
          />
        )}

            </List>
            {
                (user?.isLager || user?.isAdmin) && (
                    <>
                        <Divider />
                        <List>
                            {
                                user?.isLager
                                    ? (
                                        <>
                                            <DrawerListItem
                                                text='Kundenverwaltung'
                                                icon={<BusinessOutlined />}
                                                route='/customers'
                                                baseRoute={baseRoute}
                                            />
                                        </>
                                    )
                                    : null
                            }
                        </List>
                    </>
                )
            }
            <Divider />
            <List>
                <DrawerListItem
                    text='Mehr...'
                    icon={<MenuOutlined />}
                    route='/more'
                    baseRoute={baseRoute}
                />
            </List>

        </Drawer >
    )
}

export default LeftNav