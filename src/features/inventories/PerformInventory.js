import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import useParts from "../../hooks/parts/useParts";
import useInventory from "../../hooks/inventories/useInventory";

import AddablePartsList from "../../components/parts/AddablePartsList";
import DefaultContainer from "../../components/layout/DefaultContainer";
import { formatDate } from "../../utils/StringUtils";
import { updateInventory } from "../../app/api/inventoriesApi";
import FloatingButton from "../../components/layout/FloatingButton";
import { BsUpcScan } from "react-icons/bs";
import QrScannerModal from "../../components/modal/QrScannerModal";
import { openNumberInputDialog } from "../../components/utils/messages";
import Swal from "sweetalert2";
import CenteredPulseLoader from "../../components/loading/CenteredPulseLoader";
import { Button, Fab } from "@mui/material";
import { AirlineStops } from "@mui/icons-material";
import { useGuidedInventory } from "../../hooks/dialogs/inventory/useGuidedInventory";

const PerformInventory = () => {
  const { id } = useParams();
  const { inventory, isLoading, error, mutate } = useInventory(id);

  const { parts } = useParts();
  const plettacParts = parts?.filter(part =>  part.availableAt.includes('Konsi'));
  
  const [inventoryPartsList, setInventoryPartsList] = useState(
    inventory?.parts || []
  );

  const updateRequested = useRef();
  const [showQRModal, setShowQRModal] = useState(false);
  const [openDialog, GuidedDialog] = useGuidedInventory();

  useEffect(() => {
    if (!!inventory) {
      console.log("Update Inventory");
      setInventoryPartsList(inventory.parts || []);
    }
  }, [inventory]);

  const performInventoryPartsUpdate = async (inventoryPartsList) => {
    const updatedInventory = {
      ...inventory,
      parts: inventoryPartsList,
    };
    await updateInventory(updatedInventory);
    mutate();
  };

  useEffect(() => {
    if (updateRequested.current === true) {
      performInventoryPartsUpdate(inventoryPartsList);

      updateRequested.current = false;
    }
  }, [inventoryPartsList]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Do not update Inventory if there is an update pending
      if (updateRequested.current === true) return;

      mutate();
      console.log("Logs every half minute");
    }, 30_000);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, []);

  if (!inventory) {
    return <CenteredPulseLoader />;
  }

  const openGuidedInventoryExecutionDialog = () => {
    const onItemAdded = ({ part, amount }) => {
      const addedPartItem = { part, amount };

      updateInventoryParts((oldVal) => [...oldVal, addedPartItem]);
    };

    openDialog({ inventory, onConfirm: onItemAdded });
  };

  const handleQRResult = async (result) => {
    const mappedPart = parts?.find(
      (value) =>
        value.articleNr.replace(/\s/g, "") ===
        result.toString().replace(/\s/g, "")
    );
    if (!mappedPart) {
      Swal.fire({
        title: "Element nicht gefunden",
        text: `Es konnte kein passendes Element zu dem eingescannten Code '${result}' gefunden werden.`,
        icon: "warning",
      });
      return;
    }

    const inputValue = await openNumberInputDialog("Anzahl der Elemente?");
    if (inputValue > 0) {
      updateInventory([
        ...inventoryPartsList,
        {
          part: mappedPart,
          amount: inputValue,
        },
      ]);
    }
  };

  const updateInventoryParts = async (updatedInventoryPartsFunc) => {
    // const updatedParts = updatedInventoryPartsFunc(inventoryPartsList);
    // console.log("UpdatedParts: ", updatedParts);
    setInventoryPartsList(updatedInventoryPartsFunc);
    updateRequested.current = true;
  };

  return (
    <DefaultContainer>
      <QrScannerModal
        show={showQRModal}
        setShow={setShowQRModal}
        onResult={handleQRResult}
      />

      {GuidedDialog}

      <div className="d-flex justify-content-between">
        <h5>{inventory?.name}</h5>
        <h5>{formatDate(inventory?.date)}</h5>
      </div>

      <AddablePartsList
        parts={plettacParts}
        partsList={inventoryPartsList}
        setPartsList={updateInventoryParts}
      />

      <Fab
        color="primary"
        onClick={openGuidedInventoryExecutionDialog}
        sx={{
          position: "fixed",
          bottom: (theme) => theme.spacing(19),
          right: (theme) => theme.spacing(4),
        }}
      >
        <AirlineStops />
      </Fab>

      <FloatingButton
        onClick={() => setShowQRModal(true)}
        icon={<BsUpcScan />}
      />
    </DefaultContainer>
  );
};

export default PerformInventory;
