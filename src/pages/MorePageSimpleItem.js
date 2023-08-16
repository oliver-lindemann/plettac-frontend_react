import { Link } from 'react-router-dom'
import { Grid, Paper, Typography } from '@mui/material'

const MorePageSimpleItem = (linkTo, icon, text) => {
    return (
        <Grid item xs={6} sm={6} md={4} lg={3} xl={2} component={Link} to={linkTo} style={{ textDecoration: 'none' }}>
            <Paper className="centertext" sx={{ py: 2 }} >
                {icon}
                <Typography className="pt-1">{text}</Typography>
            </Paper>
        </Grid>
    )
}

export default MorePageSimpleItem