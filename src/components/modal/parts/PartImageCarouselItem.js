import React, { useMemo } from 'react';
import { Carousel } from 'react-bootstrap';
import { BASE_URL } from '../../../app/api/api';

const PartImageCarouselItem = (props) => {
    const { part, image } = props;

    const modifiedProps = {
        ...props
    }

    delete modifiedProps.part;
    delete modifiedProps.image;

    const CarouselItem = useMemo(() => (
        <Carousel.Item {...modifiedProps}>
            <img
                src={`${BASE_URL}${image}`}
                className="carousel-img"
                alt={part.name}
            />
            {/* <IKImage
                path={`parts/${imageName}`}
                // transformation={[{ height: 300, width: 400 }]}
                // lqip={{ active: true, quality: 20 }}
                // loading="lazy"
                className='carousel-img'
                alt='part'
            /> */}
        </Carousel.Item>
    ), [image])

    return (
        <>{CarouselItem}</>
    )
}

export default PartImageCarouselItem