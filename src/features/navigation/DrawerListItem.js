import { ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { Link } from 'react-router-dom'

const DrawerListItem = (props) => {
    const { baseRoute, route, text, icon } = props;
    return (
        <ListItem key={text} as={Link} to={route} style={{ color: 'black' }} disablePadding>
            {/* <ListItemButton selected={baseRoute?.startsWith(route)}> */}
            <ListItemButton selected={baseRoute === route} sx={props.sx}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
            </ListItemButton>
        </ListItem>
    )
}

export default DrawerListItem