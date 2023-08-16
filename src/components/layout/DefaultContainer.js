import React from 'react'
import { Container } from 'react-bootstrap'
import { isDesktop } from 'react-device-detect'
import { TOP_NAV_HEIGHT } from '../../features/navigation/TopNav';

const desktopClassNames = "pt-3 pb-3 col-11";
const mobileClassNames = "pt-3 pb-3 col-12 col-md-11 col-lg-10 col-xl-10 col-xxl-7";

const DefaultContainer = ({ children, heightSubtract }) => {
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

export default DefaultContainer