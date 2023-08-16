import { Link } from 'react-router-dom'
import { Grid, Paper, Typography } from '@mui/material'

const MorePageSimpleItem = ({ linkTo, icon, image, text, color }) => {
    return (
        <Grid item xs={12} sm={12} md={6} lg={4} xl={3} component={Link} to={linkTo} style={{ textDecoration: 'none' }}>
            <Paper className="centertext" sx={{ py: 2, bgcolor: color }} >
                {icon}
                {text}
                {image}
            </Paper>
        </Grid>
    )
}

export default MorePageSimpleItem