import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Alert } from '@mui/material';
import useAuth from '../../hooks/auth/useAuth';

const RequireAuth = ({ allowedRoles }) => {

    const location = useLocation();
    const { user } = useAuth();

    if (!user) {
        // Falls kein Benutzer angemeldet ist, wird der Anwender
        // zu der Login-Seite weitergeleitet
        return <Navigate to='/login' state={{ from: location }} replace />;
    }

    if (!user.roles.some(role => allowedRoles.includes(role))) {
        // Verfügt der angemeldete Benutzer nicht über die angegebenen Rollen,
        // wird dem Anwender eine Fehlermeldung angezeigt
        return <Alert severity='error'>Du bist nicht berechtigt, auf den angefragten Inhalt zuzugreifen.</Alert>;
    }

    // Andernfalls (der Benutzer ist angemeldet und verfügt über die benötigten Berechtigungen)
    // wird der Benutzer zu der angefragten Seite weitergeleitet
    return <Outlet />;
}

export default RequireAuth