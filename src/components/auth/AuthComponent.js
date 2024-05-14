import useAuth from "../../hooks/auth/useAuth";
import { userHasRoles } from "../../utils/UserUtils";

const AuthComponent = ({ requiredRoles, children }) => {

    const { user } = useAuth();

    const hasAccess = userHasRoles(user, requiredRoles);

    return (
        hasAccess
            ? <>{children}</>
            : null
    );
}

export default AuthComponent;