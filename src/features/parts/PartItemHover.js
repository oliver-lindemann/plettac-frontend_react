import { useState, useEffect } from "react";
import { BASE_URL } from "../../app/api/api";
import { getPartImages, partImagessUrlEndpoint } from "../../app/api/partsApi";
import { CircularProgress } from "@mui/material";

const PartItemHover = ({ part }) => {
  const [images, setImages] = useState(null);

  const loadPartImage = async () => {
    if (!part) {
      return;
    }

    const response = await getPartImages([partImagessUrlEndpoint, part._id]);

    if (!response || !response.imageFiles || response.imageFiles.length <= 0) {
      setImages([]);
    }

    setImages(response.imageFiles);
  };

  //eslint-disable-next-line
  useEffect(() => {
    loadPartImage();
  }, []);

  if (!part || !images) {
    return <CircularProgress disableShrink color="error" />;
  }

  return (
    <>
      {images.length <= 0 ? (
        <p>Keine Bilder vorhanden.</p>
      ) : (
        <img
          src={`${BASE_URL}${images[0]}`}
          style={{
            maxWidth: 200,
            maxHeight: 200,
            objectFit: "contain",
            margin: "auto",
          }}
          alt={part.name}
        />
      )}
    </>
  );
};

export default PartItemHover;
