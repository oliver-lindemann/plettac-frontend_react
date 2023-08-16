import { useState } from "react";
import { BrowserView, MobileView } from "react-device-detect";

import { updateUser } from "../../app/api/usersApi";

import useAuth from "../../hooks/auth/useAuth";
import useUser from "../../hooks/users/useUser";

import { FeedbackOutlined, InfoOutlined, MenuBookOutlined, UploadFileOutlined } from "@mui/icons-material";
import { Grid, Paper, Typography } from "@mui/material";
import DefaultContainer from "../../components/layout/DefaultContainer";
import MorePageSimpleItem from './MorePageSimpleItem';

import { useSnackbar } from "notistack";
import { LINKS } from '../../config/accessiblePages';
import { ROLES } from "../../config/roles";
import { ReactComponent as QRLogo } from '../../images/gmwqr.svg';

function MorePage() {

    const { user } = useAuth();
    const {
        user: currentUser,
        mutate
    } = useUser(user?.id);
    const { enqueueSnackbar } = useSnackbar();

    const [isLoading, setIsLoading] = useState(false);

    const landingPage = currentUser?.settings?.landingPage;
    const bottomNavItems = currentUser?.settings?.bottomNavItems || [];

    const mobileCards = [];

    if (user?.roles.includes(ROLES.Katalog)) {
        mobileCards.push(LINKS.Parts);
    }

    if (user?.roles.includes(ROLES.Listen)) {
        mobileCards.push(LINKS.DeliveryNotes);
    }

    if (user?.isLager) {
        mobileCards.push(LINKS.Customers);
    }

    if (user?.isAdmin) {
        mobileCards.push(LINKS.Users);
    }

    const handleHomeChanged = async (card) => {

        try {
            setIsLoading(true);
            const updatedUser = {
                ...currentUser,
                landingPage: card
            }
            const result = await updateUser(updatedUser);
            mutate();

        } finally {
            setIsLoading(false);
        }
    }

    const handleNavbarChanged = async (card) => {

        const indexOfCard = bottomNavItems.indexOf(card);
        if (indexOfCard < 0 && bottomNavItems.length >= 3) {
            enqueueSnackbar({
                message: 'Du kannst nicht mehr als 3 Favoriten auswählen.',
                variant: 'info',
            })
            return;
        }

        if (indexOfCard > -1) {
            bottomNavItems.splice(indexOfCard, 1);
        } else {
            bottomNavItems.push(card);
        }

        try {
            setIsLoading(true);
            const updatedUser = {
                ...currentUser,
                bottomNavItems: bottomNavItems
            }
            const result = await updateUser(updatedUser);
            mutate();
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <DefaultContainer>
            <BrowserView>
                <Grid
                    container
                    spacing={2}
                    alignItems='stretch'
                >

                    <MorePageSimpleItem
                        linkTo='/more/feedback'
                        icon={<FeedbackOutlined fontSize="large" />}
                        text='Fehler melden'
                        color='#fff4e5'
                    />

                    <MorePageSimpleItem
                        icon={<InfoOutlined fontSize="large" />}
                        text={`Version: ${process.env.REACT_APP_VERSION}`}
                        linkTo='/more/changelog'
                    />

                    <Grid item xs={12} sm={12} md={6} lg={4} xl={3} style={{ textDecoration: 'none' }}>
                        <Paper className="centertext" sx={{ py: 2, }} >
                            <Typography fontWeight='bold'>Gerüstbau Werdermann<br />GmbH & Co. KG</Typography>
                            <Typography>
                                Mühlenberg 4<br />
                                17235 Neustrelitz<br />
                                Tel. <a href="tel:03981-447712">(03981) 44 77 12</a><br />
                                Fax. (03981) 44 73 27<br />
                                <a href="https://werdermann.com" target="_blank" onClick={(e) => console.log("Click")}>https://werdermann.com</a><br />
                            </Typography>
                            <QRLogo />
                        </Paper>
                    </Grid>

                    {/* <Col>
                        <Card style={{ textDecoration: 'none', color: 'black' }}>
                            <Card.Body>https://werdermann.com</Card.Body>
                            <QRLogo />
                        </Card>
                    </Col>

                    <p>Version: 0.1.16</p> */}
                </Grid>
            </BrowserView>
            <MobileView>

                <Grid
                    container
                    spacing={2}
                    alignItems='stretch'
                    flexDirection='row'
                    style={{ fontSize: '28px' }}
                >

                    {
                        mobileCards.map((mobileCard, index) => (
                            <MorePageSimpleItem
                                key={index}
                                linkTo={mobileCard.linkTo}
                                icon={mobileCard.icon}
                                text={mobileCard.text}

                                isLoading={isLoading}

                                homeSelected={mobileCard.linkTo === landingPage}
                                navbarSelected={bottomNavItems}

                                handleHomeSelected={() => handleHomeChanged(mobileCard.linkTo)}
                                handleNavbarSelected={() => handleNavbarChanged(mobileCard.linkTo)}

                            />
                        ))
                    }

                    <MorePageSimpleItem
                        linkTo='/more/feedback'
                        icon={<FeedbackOutlined fontSize="large" />}
                        text='Fehler melden'
                        color='#fff4e5'
                    />

                    <MorePageSimpleItem
                        icon={<InfoOutlined fontSize="large" />}
                        text={`Version: ${process.env.REACT_APP_VERSION}`}
                        linkTo='/more/changelog'
                    />

                    <Grid item xs={12} sm={12} md={6} lg={4} xl={3} style={{ textDecoration: 'none' }}>
                        <Paper className="centertext" sx={{ py: 2, }} >
                            <Typography fontWeight='bold'>Gerüstbau Werdermann<br />GmbH & Co. KG</Typography>
                            <Typography>
                                Mühlenberg 4<br />
                                17235 Neustrelitz<br />
                                Tel. <a href="tel:03981-447712">(03981) 44 77 12</a><br />
                                Fax. (03981) 44 73 27<br />
                                <a href="https://werdermann.com" target="_blank" onClick={(e) => console.log("Click")}>https://werdermann.com</a><br />
                            </Typography>
                            <QRLogo />
                        </Paper>
                    </Grid>

                </Grid>
            </MobileView>
        </DefaultContainer>
    );
}

export default MorePage;