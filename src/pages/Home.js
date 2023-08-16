import { Alert } from "@mui/material";
import { useSnackbar } from "notistack";
import { Navigate } from "react-router-dom";
import CenteredPulseLoader from "../components/loading/CenteredPulseLoader";
import { ROLES } from "../config/roles";
import useAuth from "../hooks/auth/useAuth";
import useUser from "../hooks/users/useUser";

function StartPage() {

    const { user, logout } = useAuth();
    const { user: currentUser } = useUser(user?.id);
    const { enqueueSnackbar } = useSnackbar();

    if (!user) {
        return <Navigate replace to='/login' />
    }

    if (!currentUser) {
        return <CenteredPulseLoader />
    }

    if (currentUser.roles?.includes(ROLES.Lager) || currentUser.roles?.includes(ROLES.Admin) || currentUser.roles?.includes(ROLES.Bauleiter)) {
        return <Navigate replace to={'/deliveryNotes' || '/more'} />
    }

    enqueueSnackbar('Du hast nicht die nötigen Berechtigungen, um diese App zu nutzen.', { variant: 'error' });
    logout();

    return <Alert>Du bist nicht berechtigt auf den angefragten Inhalt zuzugreifen.</Alert>


    // return <Link to='/checklists'>Click here if you are not redirected...</Link>


    // return (
    //     <Row xs={1} md={2} lg={3} xl={4} className="g-4 m-1">

    //         {
    //             !user && (
    //                 <Col>
    //                     <Card as={Link} to='/login' style={{ textDecoration: 'none', color: 'black' }}>
    //                         <Card.Body>
    //                             <Card.Title>Anmelden</Card.Title>
    //                             <Card.Text>Um auf diese Funktionen zuzugreifen, melde dich bitte über die folgende Schaltfläche an.</Card.Text>
    //                             <Button as={Link} to='/login' variant='outline-success'>Anmelden</Button>
    //                         </Card.Body>
    //                     </Card>
    //                 </Col>
    //             )
    //         }

    //         <Col>
    //             <Card as={Link} to='/parts' style={{ textDecoration: 'none', color: 'black' }}>
    //                 <Card.Body>
    //                     <Card.Title>Teilekatalog</Card.Title>
    //                     <Card.Text>Tippe auf diese Schaltfläche, um den Teilekatalog aufzurufen.</Card.Text>
    //                     <Button as={Link} to='/parts'>Teilekatalog</Button>
    //                     <Button as={Link} to='/parts/63d62179aaf80e75de0970d8'>Gewindefußplatte</Button>
    //                 </Card.Body>
    //             </Card>
    //         </Col>
    //         <Col>
    //             <Card>
    //                 <Card.Body as={Link} to='/checklists' style={{ textDecoration: 'none', color: 'black' }}>
    //                     <Card.Title>Ladeliste</Card.Title>
    //                     <Card.Text>Tippe hier, um zu den Ladelisten zu gelangen.</Card.Text>
    //                     <Button as={Link} to='/checklists' variant='secondary'>Ladelisten</Button>
    //                 </Card.Body>
    //                 <ListGroup className="list-group-flush">
    //                     <ListGroup.Item>Übersicht</ListGroup.Item>
    //                     <ListGroup.Item>Ladeliste erstellen</ListGroup.Item>
    //                     <ListGroup.Item>Archiv</ListGroup.Item>
    //                 </ListGroup>
    //             </Card>
    //         </Col>

    //         <Col>
    //             <Card>
    //                 <Card.Body as={Link} to='/inventory' style={{ textDecoration: 'none', color: 'black' }}>
    //                     <Card.Title>Inventur</Card.Title>
    //                     <Card.Text>In dieser Sektion findest du alle Inventuren.</Card.Text>
    //                     <Button as={Link} to='/inventory' variant='outline-warning'>Inventuren abrufen</Button>
    //                 </Card.Body>
    //                 <ListGroup className="list-group-flush">
    //                     <ListGroup.Item>Übersicht</ListGroup.Item>
    //                     <ListGroup.Item>Neue Inventur</ListGroup.Item>
    //                 </ListGroup>
    //             </Card>
    //         </Col>

    //         <Col>
    //             <Card>
    //                 <Card.Body as={Link} to='/users' style={{ textDecoration: 'none', color: 'black' }}>
    //                     <Card.Title>Benutzerverwaltung</Card.Title>
    //                     <Card.Text>In dieser Sektion findest du die Benutzerverwaltung.</Card.Text>
    //                     <Button as={Link} to='/users' variant='outline-danger'>Benutzerverwaltung</Button>
    //                 </Card.Body>
    //                 <ListGroup className="list-group-flush">
    //                     <ListGroup.Item>Übersicht</ListGroup.Item>
    //                     <ListGroup.Item>Benutzer erstellen</ListGroup.Item>
    //                     <ListGroup.Item>Kontoübersicht</ListGroup.Item>
    //                 </ListGroup>
    //             </Card>
    //         </Col>

    //         <Col>
    //             <Card>
    //                 <Card.Body as={Link} to='/statistics' style={{ textDecoration: 'none', color: 'black' }}>
    //                     <Card.Title>Statistiken</Card.Title>
    //                     <Card.Text>In dieser Sektion findest du Statistiken zur Nutzung der app.</Card.Text>
    //                     <Button as={Link} to='/statistics' variant='outline-secondary'>Statistiken abrufen</Button>
    //                 </Card.Body>
    //                 <ListGroup className="list-group-flush">
    //                     <ListGroup.Item>Abgerufene Elemente</ListGroup.Item>
    //                     <ListGroup.Item>Gesuchte Elemente</ListGroup.Item>
    //                     <ListGroup.Item>Anzahl der Anfragen</ListGroup.Item>
    //                 </ListGroup>
    //             </Card>
    //         </Col>

    //         <Col>
    //             <Card>
    //                 <Card.Img variant='top' src={qrImage} />
    //                 <Card.Body>
    //                     <Card.Title>Link zur Webseite:</Card.Title>
    //                     <Card.Text>http://www.werdermann.com</Card.Text>
    //                 </Card.Body>
    //             </Card>
    //         </Col>
    //     </Row>
    // );
}

export default StartPage;