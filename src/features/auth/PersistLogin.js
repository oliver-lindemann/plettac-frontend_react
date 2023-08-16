import { useRef, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom"
import useAuth from "../../hooks/auth/useAuth";

const PersistLogin = () => {

    const navigate = useNavigate();
    const { refresh, logout } = useAuth();
    const effectRan = useRef(false)

    const verifyRefreshToken = async () => {
        try {
            console.log("PresistLogin#refresh")
            await refresh();
        }
        catch (err) {
            console.log("Could not refresh token, login again");
            await logout();
            navigate('/login');
        }
    }

    useEffect(() => {
        // Do only refresh if effect was not previously executed or not Dev-Mode
        if (!effectRan.current || process.env.NODE_ENV !== 'development') {
            verifyRefreshToken();
        }

        return () => effectRan.current = true;
        // eslint-disable-next-line
    }, [])

    return <Outlet />
}
export default PersistLogin