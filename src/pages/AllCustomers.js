import CenteredPulseLoader from "../components/loading/CenteredPulseLoader";
import DefaultContainer from "../components/layout/DefaultContainer";
import ErrorPage from "../components/error/ErrorPage";
import CustomersList from "../features/customers/CustomersList";
import useCustomers from "../hooks/customers/useCustomers";
import { useNavigate } from "react-router-dom";
import FloatingButton from "../components/layout/FloatingButton";
import { AddOutlined } from "@mui/icons-material";

function AllCustomersPage() {
  const navigate = useNavigate();
  const { customers, mutate, isLoading, error } = useCustomers();

  const handleCreateNewCustomer = () => {
    navigate("/customers/new");
  };

  if (!customers || isLoading) {
    return <CenteredPulseLoader />;
  }
  if (error) {
    return <ErrorPage error={error} />;
  }

  return (
    <DefaultContainer>
      <CustomersList customers={customers} mutate={mutate} />

      <FloatingButton
        onClick={handleCreateNewCustomer}
        icon={<AddOutlined />}
      />
    </DefaultContainer>
  );
}

export default AllCustomersPage;
