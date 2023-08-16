import React from 'react'
import { Container } from 'react-bootstrap'
import { isDesktop } from 'react-device-detect';
import { TOP_NAV_HEIGHT } from '../../features/navigation/TopNav';

const desktopClassNames = "pt-3 pb-3 col-8";
const mobileClassNames = "pt-3 pb-3 col-12 col-md-8 col-lg-6 col-xl-5 col-xxl-4";

const DefaultSmallContainer = ({ children, heightSubtract }) => {
    return (
        <Container
            fluid
            className={isDesktop ? desktopClassNames : mobileClassNames}
            style={{ minHeight: `calc(100% - ${TOP_NAV_HEIGHT}px - ${heightSubtract || 0}px)`, }}
        >
            {children}
        </Container>
    )
}

export default DefaultSmallContainer