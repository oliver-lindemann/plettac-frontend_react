import { Link, Breadcrumbs as MUIBreadcrumbs } from '@mui/material'
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const pathMapping = {
    'checklists': 'Ladelisten',
    'parts': 'Katalog',
    'new': 'Neu',
    'edit': { label: 'Ladeliste', navigate: '' },
    'more': 'Mehr',
    'user': 'Benutzer',
    'settings': 'Einstellungen',
    'uploads': 'Fotos'
}

const Breadcrumbs = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const pathnames = location.pathname.split('/').filter(x => x);
    console.log("Breadcrumbs:");
    console.log(pathnames);
    return (
        <MUIBreadcrumbs aria-label="breadcrumb">
            {
                pathnames.map((name, index) =>
                    <Link onClick={() => navigate('/')}>{pathMapping[name]}</Link>
                )
            }
        </MUIBreadcrumbs>
    )
}

export default Breadcrumbs