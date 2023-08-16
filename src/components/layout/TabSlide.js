import React from 'react'
import { Carousel } from 'react-bootstrap'

const TabSlide = ({ tabIndex, setTabIndex, children }) => {
    return (
        <Carousel
            slide={true} // enable slide animation
            interval={null} // prevent auto slide
            touch={true} // enable touch
            wrap={false} // Do not jump from last slide to first slide
            controls={false} // do not show controls (arrows)
            indicators={false} // disable indicators
            activeIndex={tabIndex}
            onSelect={setTabIndex}
        // style={{ height: '100%' }}
        >
            {children}
        </Carousel>
    )
}

export default TabSlide