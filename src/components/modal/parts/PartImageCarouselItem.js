import React, { useState } from "react";
import { nanoid } from "nanoid";
import { Carousel } from "react-bootstrap";
import { Skeleton } from "@mui/material";

const PartImageCarouselItem = (props) => {
  const { part, thumbnail, imageUrl } = props;

  return (
    // Props has to be forwareded to Carousel.Item
    <Carousel.Item {...props} key={nanoid()}>
      <div
        className="carousel-img"
        style={{
          backgroundImage: `url(${imageUrl}?tr=w-100,q-50)`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "contain",
        }}
      >
        <img src={imageUrl} className="carousel-img" />
      </div>
    </Carousel.Item>
  );
};

export default PartImageCarouselItem;
