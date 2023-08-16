import { FeedbackOutlined, Logout, RefreshOutlined } from '@mui/icons-material';
import { AppBar, Button, createTheme, Divider, IconButton, LinearProgress, ListItemIcon, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import React, { useState } from 'react';

import { useSnackbar } from 'notistack';
import { Link, useNavigate } from 'react-router-dom';
import UserAvatar from '../../components/utils/UserAvatar';
import useAuth from '../../hooks/auth/useAuth';
import logo from '../../images/PlettacAssco_Logo_small.jpg';

export const TOP_NAV_HEIGHT = 64;

const TopNav = () => {

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const { enqueueSnackbar } = useSnackbar();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const onReload = () => window.location.reload();

  const onLogout = async () => {
    await logout();
    enqueueSnackbar("Erfolgreich abgemeldet!", { variant: 'success', style: { marginTop: 0 } });
    navigate('/login')
  }

  const theme = createTheme({
    palette: {
      primary: {
        main: "#fff"
      }
    }
  });

  return (
    /* Show Login-Button or User-Icon depending on Logged-In-State (user exists) */
    !!user
      ? (
        <AppBar
          position="sticky"
          theme={theme}
          className="top-navigation"
        >
          <Toolbar>
            <Link to="/">
              <img
                src={logo}
                height="50"
                className="d-inline-block align-top"
                alt="GMW logo"
              />
            </Link>
            <Typography variant='h5' sx={{ flexGrow: 1, textAlign: 'center' }}>
              {/* !! TODO aktuellen Seitennamen darstellen */}
            </Typography>

            {
              /* Show Login-Button or User-Icon depending on Logged-In-State (user exists) */
              !!user
                ? (
                  <>
                    <IconButton
                      size="large"
                      onClick={handleMenu}
                      color="inherit"
                    >
                      <UserAvatar userId={user.id} />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={() => { handleClose(); navigate('/more/feedback') }}><ListItemIcon><FeedbackOutlined /></ListItemIcon>Fehler melden</MenuItem>
                      <MenuItem onClick={() => { handleClose(); onReload(); }}><ListItemIcon><RefreshOutlined /></ListItemIcon>App neu laden</MenuItem>
                      <Divider />
                      <MenuItem onClick={() => { handleClose(); onLogout(); }}><ListItemIcon><Logout color='error' /></ListItemIcon>Abmelden</MenuItem>
                    </Menu>
                  </>
                )
                : (
                  <Button color="inherit" sx={{ textTransform: 'none' }} onClick={() => navigate('/login')}>Login</Button>
                )
            }
          </Toolbar>
        </AppBar>
      )
      : null
  )
}

export default TopNav