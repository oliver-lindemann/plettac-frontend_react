import CenteredPulseLoader from "../components/loading/CenteredPulseLoader";
import DefaultContainer from "../components/layout/DefaultContainer";
import ErrorPage from "../components/error/ErrorPage";
import InventoriesList from "../features/inventories/InventoriesList";
import useInventories from "../hooks/inventories/useInventories";
import { useNavigate } from "react-router-dom";
import FloatingButton from "../components/layout/FloatingButton";
import useAuth from "../hooks/auth/useAuth";
import { AddOutlined } from "@mui/icons-material";
import AuthComponent from "../components/auth/AuthComponent";
import { ROLES } from "../config/roles";

function AllInventoriesPage() {

    const navigate = useNavigate();
    const { user } = useAuth();
    const {
        inventories,
        isLoading,
        error
    } = useInventories();

    const handleCreateNewInventory = () => {
        navigate('/inventories/new');
    }

    if (!inventories || isLoading) {
        return <CenteredPulseLoader />;
    }
    if (error) {
        return <ErrorPage error={error} />
    }

    return (
        <DefaultContainer>
            <InventoriesList inventories={inventories} />

            <AuthComponent requiredRoles={[ROLES.Admin]}>
                <FloatingButton
                    onClick={handleCreateNewInventory}
                    icon={<AddOutlined />}
                />
            </AuthComponent>
        </DefaultContainer>
    );
}

export default AllInventoriesPage;