import { NavigateNext } from '@mui/icons-material'
import { Typography, Breadcrumbs as MUIBreadcrumbs } from '@mui/material'
import { Link } from 'react-router-dom'
import { asArray } from '../../utils/ArrayUtils'

const Breadcrumbs = ({ currentLocation, pathElements }) => {
    return (
        <MUIBreadcrumbs separator={<NavigateNext fontSize="small" />} className='mr-3 mb-3 mt-0 pt-3'>
            {
                asArray(pathElements).map((element, index) => (
                    <Link
                        key={index}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                        to={element.url}
                    >
                        {element.name}
                    </Link>
                ))
            }
            <Typography color="text.primary">{currentLocation}</Typography>
        </MUIBreadcrumbs>
    )
}

export default Breadcrumbs