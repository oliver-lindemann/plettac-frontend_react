import useProvideAuth from "../../hooks/auth/useProvideAuth";
import AuthContext from "./AuthContext";

export const AuthProvider = ({ children }) => {
    const auth = useProvideAuth();
    return (
        <AuthContext.Provider value={ auth }>
            {children}
        </AuthContext.Provider>
    )
};
