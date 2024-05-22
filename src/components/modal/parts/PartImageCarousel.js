import { Carousel } from "react-bootstrap";
import PartImageCarouselItem from "./PartImageCarouselItem";

const PartImageCarousel = ({ part, images }) => {
  return (
    <Carousel
      variant="dark"
      slide={false}
      // interval={2000}
      controls={images.length > 1}
    >
      {images.map((image, index) => (
        <PartImageCarouselItem
          part={part}
          thumbnail={image.thumbnail}
          imageUrl={image.url}
          key={index}
        />
      ))}
    </Carousel>
  );
};

export default PartImageCarousel;
