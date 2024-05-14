import {
  DrawOutlined,
  PrintOutlined,
  RefreshOutlined,
} from "@mui/icons-material";
import { Button, Checkbox, Fab, FormControlLabel } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import FloatingButton from "../../../components/layout/FloatingButton";
import useSignatureDialog from "../../../hooks/dialogs/useSignatureDialog";
import { isMobile } from "react-device-detect";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const DeliveryNoteSignatureView = ({
  pdfFileAsString,
  generateAndSetPdfFile,
  updateSignatures,
  deliveryNote,
  handlePrintPdfFile,
}) => {
  const [openSignatureDialog, SignatureDialog] = useSignatureDialog();
  const [numPages, setNumPages] = useState(0);

  const [useLoadedElements, setUseLoadedElements] = useState(false);

  useEffect(() => {
    generateAndSetPdfFile(deliveryNote, useLoadedElements);
  }, [useLoadedElements]);

  const openSignatureCustomer = () => {
    openSignatureDialog({
      title: "Unterschrift Kunde",
      onConfirm: (signature) =>
        updateSignatures({
          ...deliveryNote?.signatures,
          customer: signature,
        }),
    });
  };

  const openSignatureWarehouseWorker = () => {
    openSignatureDialog({
      title: "Unterschrift Lagermitarbeiter",
      onConfirm: (signature) =>
        updateSignatures({
          ...deliveryNote?.signatures,
          warehouseWorker: signature,
        }),
    });
  };

  return (
    <>
      {SignatureDialog}

      <div className="d-flex gap-2 justify-content-between">
        <Button
          className="my-1"
          variant="outlined"
          startIcon={<RefreshOutlined />}
          onClick={() => generateAndSetPdfFile(deliveryNote, useLoadedElements)}
        >
          PDF erneut erstellen
        </Button>

        {/* <FormControlLabel
          control={
            <Checkbox
              checked={useLoadedElements}
              onChange={(e, selected) => setUseLoadedElements(selected)}
            />
          }
          label="Drucke nur verladene Elemente / Anzahl"
          // sx={{ width: "100%" }}
        /> */}
      </div>

      <div style={{ marginBottom: "100px" }}>
        <Document
          file={pdfFileAsString}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        >
          <Grid container spacing={1}>
            {Array.apply(null, Array(numPages))
              .map((x, i) => i + 1)
              .map((page) => (
                <Grid>
                  <Page
                    key={page}
                    size="A4"
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    pageNumber={page}
                  />
                </Grid>
              ))}
          </Grid>
        </Document>
      </div>

      <Fab
        color="success"
        variant="extended"
        onClick={openSignatureWarehouseWorker}
        sx={{
          position: "fixed",
          bottom: (theme) => theme.spacing(isMobile ? 10 : 4),
          right: (theme) => theme.spacing(15),
        }}
      >
        <DrawOutlined /> Lager
      </Fab>
      <Fab
        color="error"
        variant="extended"
        onClick={openSignatureCustomer}
        sx={{
          position: "fixed",
          bottom: (theme) => theme.spacing(isMobile ? 10 : 4),
          right: (theme) => theme.spacing(30),
        }}
      >
        <DrawOutlined /> Kunde
      </Fab>

      <FloatingButton onClick={handlePrintPdfFile} icon={<PrintOutlined />} />
    </>
  );
};

export default DeliveryNoteSignatureView;
