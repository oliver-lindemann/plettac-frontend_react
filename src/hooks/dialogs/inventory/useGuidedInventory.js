import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import PartItem from "../../../features/parts/PartItem";
import useParts from "../../parts/useParts";
import { ArrowLeft, Close } from "@mui/icons-material";

export const useGuidedInventory = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogProps, setDialogProps] = useState({});
  const [currentPart, setCurrentPart] = useState({});
  const [amount, setAmount] = useState("");
  const amountRef = useRef();

  const { parts } = useParts();
  const [inventory, setInventory] = useState({});

  const findNext = () => {
    const nextPart = parts
      .slice(parts.indexOf(currentPart) + 1)
      .find(
        (part) =>
          !inventory.parts?.some((partItem) => partItem.part._id === part._id)
      );

    setCurrentPart(nextPart);
    setAmount("");
    amountRef.current.focus();
  };

  useEffect(() => {
    if (!parts || !inventory) return;

    const firstPartNotInInventory = parts.find(
      (part) =>
        !inventory.parts?.some((partItem) => partItem.part._id === part._id)
    );
    setCurrentPart(firstPartNotInInventory);
  }, [parts, inventory]);

  const openDialog = (props) => {
    setDialogProps(props);

    if (props.inventory) {
      setInventory(props.inventory);
    }

    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const handleConfirm = () => {
    if (dialogProps.onConfirm) {
      dialogProps.onConfirm({
        part: currentPart,
        amount: amount,
      });
    }

    findNext();
  };

  const handleBack = () => {
    const lastPartNotInInventory = parts
      .slice(0, parts.indexOf(currentPart))
      .findLast(
        (part) =>
          !inventory.parts?.some((partItem) => partItem.part._id === part._id)
      );

    if (!lastPartNotInInventory) return;

    setCurrentPart(lastPartNotInInventory);
  };

  const handleSkip = () => {
    findNext();
  };

  const handleClose = () => {
    closeDialog();
  };

  let DialogComponent = null;
  if (isOpen) {
    DialogComponent = (
      <Dialog open={isOpen} onClose={handleClose} disableRestoreFocus fullWidth>
        <DialogTitle className="d-flex justify-content-between align-items-center">
          <Button onClick={handleBack} startIcon={<ArrowLeft />}>
            Zurück
          </Button>
          <IconButton onClick={closeDialog}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <PartItem part={currentPart} />

          <div className="mt-3 d-flex justify-content-center align-items-center">
            <TextField
              className="mt-3"
              label="Anzahl"
              type="number"
              autoFocus
              // fullWidth
              inputRef={amountRef}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </DialogContent>
        <DialogActions className="d-flex justify-content-between">
          <Button color="inherit" onClick={handleSkip}>
            Überspringen
          </Button>
          <Button
            disabled={amount === null || amount <= 0}
            onClick={handleConfirm}
          >
            Bestätigen & weiter
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return [openDialog, DialogComponent];
};
