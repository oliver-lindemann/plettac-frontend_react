import { useState } from "react";

import SaveIcon from '@mui/icons-material/Save';
import { Col, FloatingLabel, Form, Spinner } from "react-bootstrap";
import DefaultSmallContainer from '../../components/layout/DefaultSmallContainer';

import { Button, Grid, Typography } from "@mui/material";
import FloatingButton from "../../components/layout/FloatingButton";
import { ROLES } from '../../config/roles';

import { getDefaultTimeTracking } from "../../config/timeTracking";
import useTimeTracking from "../../hooks/dialogs/useTimeTracking";
import "../../resources/styles/textFieldWithoutArrows.css";
import TimeTrackingTable from "./TimeTrackingTable";
import Breadcrumbs from "../../components/layout/Breadcrumbs";

const ROLES_DESCRIPTION = {
    Admin: 'Admin (Zugriff auf alle Funktionen)',
    Bauleiter: 'Bauleiter (Kann als Bauleiter für eine Baustelle eingetragen werden)',
    TimeTracking: 'Zeiterfassung (Benutzer kann seine Zeiten erfassen)',
    Lager: 'Lager (Zugriff auf alle freigegebenen Ladelisten und Lieferscheine)',
    Katalog: 'Katalog (Zugriff auf den Teilekatalog)',
    Listen: 'Listen (Zugriff auf die eigenen Ladelisten/Lieferscheine. Für Lager benötigt.)',
    Fotos: 'Fotos (Zugriff auf die eigenen Fotos)',
    Standard: 'Standard (Zugriff auf den Teilekatalog und seine Ladelisten)'
}

const UserContent = ({ user, onSaveButtonClicked }) => {

    const [name, setName] = useState(user?.name || '');
    const [username, setUsername] = useState(user?.username || '');
    const [password, setPassword] = useState('');
    const [roles, setRoles] = useState(user?.roles || [ROLES.Standard]);
    const [timeTracking, setTimeTracking] = useState(user?.timeTracking || getDefaultTimeTracking(user));

    const [openDialog, ResetTimeTrackingDialog] = useTimeTracking();

    const [validated, setValidated] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const onNameChanged = (e) => setName(e.target.value);
    const onUsernameChanged = (e) => setUsername(e.target.value);
    const onPasswordChanged = (e) => setPassword(e.target.value);
    const onRolesChanged = (role, selected) => {
        console.log("Select: ", selected, " role: ", role);
        console.log(roles);
        if (!selected) {
            setRoles(prevRoles => [...prevRoles.filter(value => role !== value)]);
        }
        else {
            setRoles(prevRoles => {
                const updatedRoles = [...prevRoles];
                updatedRoles.push(role);
                return updatedRoles;
            });
        }
    };

    const handleResetTo = () => {
        openDialog({
            title: 'Arbeits- und Pausenzeiten zurücksetzen',
            onConfirm: setTimeTracking
        })
    }

    const handleSaveUser = async (e) => {
        e.preventDefault();
        setValidated(true);

        const form = e.currentTarget;
        if (form.checkValidity()) {
            const updatedUser = {
                ...user,
                name: name,
                username: username,
                roles: [],
                timeTracking
            }

            // TODO Das ist unschön. Es soll eine feste Reihenfolge geben,
            // in der die Elemente im Array enthalten sind. Angefangen bei Standard, Lager, TimeTracking, ...
            const rolesAsArray = Object.keys(ROLES);
            [...rolesAsArray].reverse().forEach(role => {
                if (roles.includes(role)) {
                    updatedUser.roles.push(role);
                }
            });

            if (password) {
                updatedUser.password = password;
            }
            try {
                setIsSaving(true);
                await onSaveButtonClicked(updatedUser);
            } finally {
                setIsSaving(false);
            }
        }
    }

    return (

        <>
            {ResetTimeTrackingDialog}

            <DefaultSmallContainer>
                <Breadcrumbs
                    currentLocation={!!user?._id ? 'Benutzer bearbeiten' : 'Neuen Benutzer erstellen'}
                    pathElements={[{
                        name: 'Benutzerübersicht',
                        url: '/users'
                    }]}
                />

                <Form
                    noValidate
                    validated={validated}
                    onSubmit={handleSaveUser}
                    className="col-sm-12"
                >
                    <Typography variant="h5">Benutzer- und Zugangsdaten</Typography>
                    <hr />

                    <Form.Group as={Col} className="mt-3">
                        <FloatingLabel label="Vor- und Nachname">
                            <Form.Control
                                type='text'
                                placeholder="Vor- und Nachname"
                                value={name}
                                onChange={onNameChanged}
                                required />
                            <Form.Control.Feedback type='invalid'>Bitte gib den Vor- und Nachnamen ein.</Form.Control.Feedback>
                        </FloatingLabel>
                    </Form.Group>

                    { /* Hide username field if it is the 'admin'-User   */}
                    {
                        user?.username !== 'admin' &&
                        <Form.Group as={Col} className="mt-3">
                            <FloatingLabel label="Benutzername">
                                <Form.Control
                                    type='text'
                                    placeholder="Benutzername"
                                    value={username}
                                    onChange={onUsernameChanged}
                                    readOnly={user?.username === 'admin'}
                                    pattern="^(?!admin)([a-zA-Z0-9.-]+)$"
                                    required />
                                <Form.Text muted>Groß- und Kleinbuchstaben, Ziffern, '.' und '-' sind erlaubt</Form.Text>
                                <Form.Control.Feedback type='invalid'>Der eingegebene Benutzername ist ungültig oder bereits vergeben.</Form.Control.Feedback>
                            </FloatingLabel>
                        </Form.Group>
                    }

                    < Form.Group as={Col} className="mt-3">
                        <FloatingLabel label="Passwort">
                            <Form.Control
                                type='password'
                                placeholder="Passwort"
                                value={password}
                                onChange={onPasswordChanged}
                                pattern="^.{6,}$"
                                required={!user} />
                            <Form.Text muted>Mindestens 6 Zeichen</Form.Text>
                            <Form.Control.Feedback type='invalid'>Bitte gib ein gültiges Passwort ein.</Form.Control.Feedback>
                        </FloatingLabel>
                    </Form.Group>

                    { /* Hide username field if it is the 'admin'-User   */}
                    {
                        user?.username !== 'admin'
                            ? (
                                <>
                                    <br />
                                    <Typography variant="h5">Berechtigungen</Typography>
                                    <hr />

                                    < Form.Group as={Col} className="mt-3">
                                        <Form.Text>Bitte wähle die Berechtigungen für diesen Benutzer aus:</Form.Text>
                                        {
                                            Object.entries(ROLES).map((entry, index) => (
                                                <Form.Check
                                                    key={index}
                                                    type='checkbox'
                                                    id={entry[0]}
                                                    label={ROLES_DESCRIPTION[entry[1]] || entry[1]}
                                                    onChange={(e) => onRolesChanged(entry[0], e.target.checked)}
                                                    checked={roles.includes(entry[0])}
                                                    disabled={entry[0] === ROLES.Standard}
                                                />
                                            ))
                                        }
                                    </Form.Group>
                                </>
                            ) : null
                    }

                    {
                        roles.includes(ROLES.TimeTracking) ? (
                            <>
                                <br />
                                <div className="d-flex justify-content-between">
                                    <Typography variant="h5">Arbeitszeiten</Typography>
                                    <Button onClick={handleResetTo}>Zurücksetzen auf...</Button>
                                </div>
                                <hr />

                                <Grid container spacing={1}>
                                    <Grid item lg={12} xl={6}>
                                        <TimeTrackingTable
                                            timeTracking={timeTracking}
                                            onUpdateTimeTracking={setTimeTracking}
                                            season={'summer'}
                                            title={'Sommer'}
                                            subtitle={'(April - Okt.)'}
                                        />
                                    </Grid>
                                    <Grid item lg={12} xl={6}>
                                        <TimeTrackingTable
                                            timeTracking={timeTracking}
                                            onUpdateTimeTracking={setTimeTracking}
                                            season={'winter'}
                                            title={'Winter'}
                                            subtitle={'(Nov. - März)'}
                                        />
                                    </Grid>
                                </Grid>
                            </>
                        ) : null
                    }

                    <FloatingButton
                        type='submit'
                        disabled={isSaving}
                        icon={isSaving ? <Spinner /> : <SaveIcon width='1.5em' height='1.5em' />}
                    />
                </Form >


            </DefaultSmallContainer>
        </>
    )
}

export default UserContent