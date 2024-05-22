import { useEffect, useState } from "react";
import { getPartImages, partImagessUrlEndpoint } from "../../app/api/partsApi";
import PartImageCarousel from "../../components/modal/parts/PartImageCarousel";

import {
  Edit,
  ImageNotSupportedOutlined,
  OpenInNewOutlined,
} from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import ColorCircle from "../../components/part/ColorCircle";
import useAuth from "../../hooks/auth/useAuth";
import { parseColors } from "../../utils/ColorUtils";
import { formatNumber, formatWeight } from "../../utils/NumberUtils";
import useImageModal from "../../hooks/parts/useImageModal";
import usePartImages from "../../hooks/parts/images/usePartImages";
import { PulseLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import AuthComponent from "../../components/auth/AuthComponent";
import { ROLES } from "../../config/roles";

const PartDetails = ({ part }) => {
  const { user } = useAuth();
  const imageModal = useImageModal();
  const navigate = useNavigate();

  const { partImages, isLoading } = usePartImages(part?._id);
  const images = partImages?.imageFiles || [];

  // const canvasRef = useRef();
  // const downloadLinkRef = useRef();

  //   useEffect(() => {
  //     if (part) {
  //       setImages([]);
  //       getImages(part);
  //     }
  //   }, [part]);

  if (!part) {
    return (
      <div
        className="d-flex align-items-center"
        style={{ height: "100%", textAlign: "center" }}
      >
        Wähle aus der nebenstehenden Liste ein Bauteil aus, um mehr
        Informationen über dieses zu erhalten.
      </div>
    );
  }

  //   const getImages = async (part) => {
  //     const response = await getPartImages([partImagessUrlEndpoint, part._id]);
  //     if (!response || !response.imageFiles || response.imageFiles.length <= 0) {
  //       setImages([]);
  //       return;
  //     }

  //     setImages(response.imageFiles);
  //     // QRCode.toCanvas(
  //     //     canvasRef.current,
  //     //     part.articleNr || '',
  //     //     {
  //     //         width: 512,
  //     //         height: 512
  //     //     },
  //     //     (error) => {
  //     //         if (error) {
  //     //             console.log(error);
  //     //         }
  //     //     })
  //   };

  // const handleDownloadQrCode = () => {
  //     const link = downloadLinkRef.current;
  //     link.href = canvasRef.current.toDataURL();
  //     link.download = `${part?.articleNr}_qr.png`;
  //     link.click();
  // }

  const parsedColors = parseColors(part.color);

  return (
    <Card>
      <CardContent>
        <div className="d-flex justify-content-between align-items-center">
          <Typography variant="h6">{part.name}</Typography>
          <IconButton onClick={() => imageModal.openModal(part)}>
            <OpenInNewOutlined />
          </IconButton>
        </div>
        <Typography color="text.secondary">{part.origin}</Typography>

        <div style={{ height: "500px" }}>
          {images.length <= 0 ? (
            <div
              className="d-flex justify-content-center align-items-center gap-2"
              style={{ height: "100%", textAlign: "center" }}
            >
              {!!isLoading ? (
                <PulseLoader />
              ) : (
                <>
                  <ImageNotSupportedOutlined /> Keine Bilder vorhanden
                </>
              )}
            </div>
          ) : (
            <PartImageCarousel part={part} images={images} />
          )}
        </div>

        <Table size="small" className="mt-3">
          <TableBody>
            <TableRow>
              <TableCell width={"40%"}>Länge/Höhe</TableCell>
              <TableCell>
                {part.length ? formatNumber(part.length) : "-"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Farbe</TableCell>
              <TableCell>
                <div className="d-flex gap-1 align-items-center">
                  {!part.color || part.color === "keine Farbe" ? (
                    "keine Farbe"
                  ) : (
                    <>
                      {parsedColors.map((color, index) => (
                        <ColorCircle
                          colorItem={color}
                          variant="small"
                          key={index}
                        />
                      ))}
                      ({part.color})
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Gewicht</TableCell>
              <TableCell>{formatWeight(part.weight)}</TableCell>
            </TableRow>
            {user?.isAdmin ? (
              <TableRow>
                <TableCell>Preis</TableCell>
                <TableCell>{formatNumber(part.price)} €</TableCell>
              </TableRow>
            ) : null}
            <TableRow>
              <TableCell>Artikelnummer</TableCell>
              <TableCell>{part.articleNr}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <AuthComponent requiredRoles={[ROLES.Admin]}>
        <CardActions>
          <Button
            startIcon={<Edit />}
            onClick={() => navigate(`/parts/manage/${part._id}`)}
          >
            Bearbeiten
          </Button>
        </CardActions>
      </AuthComponent>
    </Card>
  );
};

export default PartDetails;
