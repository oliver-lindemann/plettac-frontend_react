import CenteredPulseLoader from "../components/loading/CenteredPulseLoader";
import DefaultContainer from "../components/layout/DefaultContainer";
import ErrorPage from "../components/error/ErrorPage";
import UsersList from "../features/users/UsersList";
import useUsers from "../hooks/users/useUsers";
import { useNavigate } from "react-router-dom";
import FloatingButton from "../components/layout/FloatingButton";
import { AddOutlined } from "@mui/icons-material";

function AllUsersPage() {

    const navigate = useNavigate();
    const {
        users,
        isLoading,
        error
    } = useUsers();

    const handleCreateNewUser = () => {
        navigate('/users/new');
    }

    if (!users || isLoading) {
        return <CenteredPulseLoader />;
    }
    if (error) {
        return <ErrorPage error={error} />
    }

    return (
        <DefaultContainer>
            <UsersList users={users} />

            <FloatingButton
                onClick={handleCreateNewUser}
                icon={<AddOutlined />}
            />
        </DefaultContainer>
    );
}

export default AllUsersPage;