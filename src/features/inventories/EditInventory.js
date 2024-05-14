import { useNavigate, useParams } from "react-router-dom";

import InventoryContent from "./InventoryContent";
import Swal from "sweetalert2";
import CenteredPulseLoader from "../../components/loading/CenteredPulseLoader";

import { updateInventory } from "../../app/api/inventoriesApi";
import useInventory from "../../hooks/inventories/useInventory";
import INVENTORY_STATUS from "../../config/inventoryStatus";
import useAuth from "../../hooks/auth/useAuth";
import PerformInventory from "./PerformInventory";
import { useSnackbar } from "notistack";
import { Button } from "@mui/material";

const EditInventory = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { id } = useParams();
  const { user } = useAuth();
  const { inventory, isLoading, mutate } = useInventory(id);

  const handleInventorySave = async (updatedInventory) => {
    try {
      await updateInventory(updatedInventory);
      mutate();
      enqueueSnackbar("Inventur gespeichert!", { variant: "success" });
      navigate("/inventories");
    } catch (error) {
      let errorMessage;
      switch (error.response?.status) {
        case 400:
          errorMessage =
            "Es sind nicht genügend Daten an den Server gesendet worden";
          break;
        case 409:
          errorMessage =
            "Der Inventurname ist bereits vergeben. Bitte wähle einen anderen";
          break;
        default:
          errorMessage = "Es ist ein Fehler aufgetreten: " + error.message;
      }
      return Swal.fire({
        title: "Nachricht vom Server",
        text: errorMessage || error.message,
        icon: "warning",
      });
    }
  };

  const finishInventory = () => {
    const partSums = {};
    inventory.parts?.forEach((partItem) => {
      const partId = partItem.part._id;
      partSums[partId] = (partSums[partId] || 0) + partItem.amount;
    });

    const mergedParts = Object.keys(partSums).map((partId) => {
      const partOfId = inventory.parts.find(
        (partItem) => partItem.part._id === partId
      ).part;

      return {
        part: partOfId,
        amount: partSums[partId],
      };
    });

    const finishedInventory = {
      ...inventory,
      status: INVENTORY_STATUS.DONE,
      parts: mergedParts,
    };

    handleInventorySave(finishedInventory);
  };

  if (!inventory || isLoading) {
    return <CenteredPulseLoader />;
  }

  return user?.isAdmin ? (
    <InventoryContent
      inventory={inventory}
      onFinishInventory={finishInventory}
      onSaveButtonClicked={handleInventorySave}
    />
  ) : (
    <PerformInventory />
  );
};

export default EditInventory;
