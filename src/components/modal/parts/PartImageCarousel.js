import { Carousel } from 'react-bootstrap'
import PartImageCarouselItem from './PartImageCarouselItem'
import { useMemo } from 'react'

const PartImageCarousel = ({ part, images }) => {

    console.log("Rerender Carousel")

    return (
        <Carousel
            variant='dark'
            slide={false}
            // interval={2000}
            controls={images.length > 1}
        >
            {images.map((image, index) =>
                <PartImageCarouselItem
                    part={part}
                    image={image}
                    key={index}
                />
            )}
        </Carousel>
    )
}

export default PartImageCarousel