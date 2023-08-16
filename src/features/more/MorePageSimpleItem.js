import { Link, useNavigate } from 'react-router-dom'
import { Badge, Box, Card, CardActions, CardContent, Container, Grid, IconButton, Paper, Stack, Typography } from '@mui/material'
import { Bookmark, BookmarkBorder, Home, HomeOutlined } from '@mui/icons-material'

const MorePageSimpleItem = ({ linkTo, icon, text, color, isLoading, homeSelected, handleHomeSelected, navbarSelected, handleNavbarSelected }) => {
    const navigate = useNavigate();

    return (
        <Grid item xs={6} sm={6} md={4} lg={3} xl={2} style={{ textDecoration: 'none' }}>
            {/* <Container sx={{ p: 0, m: 0, width: '100%', position: 'relative' }}>
                <div className="d-flex justify-content-between" style={{ position: 'absolute', width: '100%' }}>
                    {
                        homeSelected !== undefined && (
                            <IconButton onClick={handleHomeSelected} disabled={isLoading}>
                                {homeSelected ? <Home /> : <HomeOutlined />}
                            </IconButton>
                        )
                    }
                    {
                        navbarSelected !== undefined && (
                            <IconButton onClick={handleNavbarSelected} disabled={isLoading}>
                                {navbarSelected ? <Bookmark /> : <BookmarkBorder />}
                            </IconButton>
                        )
                    }
                </div>
                <Paper className="centertext" sx={{ py: 2, bgcolor: color }} onClick={() => navigate(linkTo)}>
                    {icon}
                    <Typography className="pt-1">{text}</Typography>
                </Paper>
            </Container> */}
            <Card>
                <CardContent className="centertext" sx={{ p: 1, bgcolor: color, cursor: 'pointer' }} onClick={() => navigate(linkTo)}>
                    {icon}
                    <Typography className="pt-1" /*style={{wordWrap: 'break-word'}}*/>{text}</Typography>
                </CardContent>

                <CardActions sx={{ py: 0, textAlign: 'end', display: 'flex', justifyContent: 'space-between', backgroundColor: '#f3f3f3' }}>
                    {
                        homeSelected !== undefined && (
                            <IconButton onClick={handleHomeSelected} disabled={isLoading}>
                                {homeSelected ? <Home /> : <HomeOutlined />}
                            </IconButton>
                        )
                    }
                    {
                        navbarSelected !== undefined && (
                            <IconButton onClick={handleNavbarSelected} disabled={isLoading}>
                                {
                                    navbarSelected.includes(linkTo)
                                        ? <Badge
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right'
                                            }}
                                           badgeContent={navbarSelected.indexOf(linkTo) + 1}
                                        >
                                            <Bookmark />
                                        </Badge>
                                        : <BookmarkBorder />
                                }
                            </IconButton>
                        )
                    }
                </CardActions>
            </Card>
        </Grid>
    )
}

export default MorePageSimpleItem