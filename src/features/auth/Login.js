import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Alert, Box, Button, CircularProgress, Grid, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';

import useAuth from '../../hooks/auth/useAuth';

import logo from '../../images/PlettacAssco_Logo_small.jpg';
import { Visibility, VisibilityOff } from '@mui/icons-material';
const welcomImage = 'https://werdermann.com/wp-content/uploads/2019/09/gmw-geruestbau-werdermann-banner002.jpg';

const Login = () => {

    const navigate = useNavigate()
    const location = useLocation();
    const { user, login, isLoading } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errMsg, setErrMsg] = useState('')

    const [showPassword, setShowPassword] = useState(false);

    const handleUserInput = (e) => setUsername(e.target.value)
    const handlePasswordInput = (e) => setPassword(e.target.value)
    const handleShowPassword = (e) => setShowPassword(!showPassword);

    // Remove Error Message if User changes username or password
    useEffect(() => { setErrMsg(''); }, [username, password])
    // If there is a user present, navigate to landing page or the page which the user came from 
    // eslint-disable-next-line
    useEffect(() => { if (!!user) navigate(location.state?.from || '/'); }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedUsername = username.trim();
        if (trimmedUsername.length <= 0 || password.length <= 0) {
            setErrMsg('Bitte gib deinen Benutzernamen und dein Passwort ein.');
            return;
        }

        try {
            console.log(`Logging in: '${trimmedUsername}'`);
            await login({ username: trimmedUsername, password });

            navigate(location.state?.from || '/');

            enqueueSnackbar("Erfolgreich angemeldet!", { variant: 'success' });
        } catch (err) {
            console.log(err);
            if (!err.response?.status) {
                setErrMsg('Der Server ist zzt. nicht erreichbar. Bitte versuche es später erneut.');
            } else if (err.response?.status === 400) {
                setErrMsg('Bitte gib deinen Benutzernamen und dein Passwort ein.');
            } else if (err.response?.status === 401) {
                setErrMsg('Benutzername oder Passwort falsch!');
            } else {
                setErrMsg(err.response?.message);
            }
        }
    }

    return (

        <Grid container component="main" sx={{ height: '100vh' }}>
            <Grid
                item
                xs={false}
                md={7}
                sx={{
                    // backgroundImage: 'url(https://werdermann.com/wp-content/uploads/2019/11/geruestbau-neustrelitz.jpg)',
                    backgroundImage: `url(${welcomImage})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (t) =>
                        t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <Grid item xs={12} sm={12} md={5} component={Paper} elevation={6} square>
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <img
                        src={logo}
                        height="150"
                        className="d-inline-block align-top"
                        alt="Plettac logo"
                    />
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 5 }}>
                        {errMsg ? <Alert severity='warning' className="col-12">{errMsg}</Alert> : null}

                        <TextField
                            value={username}
                            onChange={handleUserInput}
                            margin="normal"
                            id="username"
                            label="Benutzername"
                            name="username"
                            fullWidth
                            autoFocus
                            required
                            disabled={isLoading}
                        />
                        <TextField
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={handlePasswordInput}
                            name="password"
                            label="Passwort"
                            id="password"
                            margin="normal"
                            required
                            fullWidth
                            disabled={isLoading}
                            autoComplete="on"

                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <IconButton
                                            onClick={handleShowPassword}>
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        <Button
                            type="submit"
                            color="error"
                            variant="contained"
                            fullWidth
                            className="mt-3"
                            disabled={isLoading}
                            startIcon={!!isLoading && <CircularProgress size={16} color='inherit' />}
                        >
                            Anmelden
                        </Button>
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 5 }} >
                            Copyright © Gerüstbau Werdermann GmbH & Co. KG - {new Date().getFullYear()}
                        </Typography>
                    </Box>
                </Box>
            </Grid>
        </Grid>

    )
}

export default Login