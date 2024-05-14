import { BadgeOutlined, BusinessOutlined, ChecklistOutlined, Inventory2Outlined, Search, SettingsOutlined } from "@mui/icons-material";

export const LINKS = {
    Settings: {
        linkTo: '/user/settings',
        icon: <SettingsOutlined fontSize="inherit" />,
        text: 'Einstellungen'
    },
    Parts: {
        linkTo: '/parts',
        icon: <Search fontSize="inherit" />,
        text: 'Katalog'
    },
    DeliveryNotes: {
        linkTo: '/deliveryNotes',
        icon: <ChecklistOutlined fontSize="inherit" />,
        text: 'Lieferscheine'
    },
    Inventories: {
        linkTo: '/inventories',
        icon: <Inventory2Outlined fontSize="inherit" />,
        text: 'Inventuren'
    },
    Customers: {
        linkTo: '/customers',
        icon: < BusinessOutlined fontSize="inherit" />,
        text: 'Kunden'
    },
    Users: {
        linkTo: '/users',
        icon: <BadgeOutlined fontSize="inherit" />,
        text: 'Benutzerverwaltung'
    },
}