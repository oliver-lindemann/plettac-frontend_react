import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Spinner } from "react-bootstrap";

import useAuth from "../../hooks/auth/useAuth";

import CenteredPulseLoader from "../../components/loading/CenteredPulseLoader";
import DefaultSmallContainer from "../../components/layout/DefaultSmallContainer";

import FloatingButton from "../../components/layout/FloatingButton";
import { submitFeedback } from "../../app/api/usersApi";
import Swal from "sweetalert2";
import { SendOutlined } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { useSnackbar } from "notistack";

const Feedback = () => {

    const navigate = useNavigate();

    const { user } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    const [text, setText] = useState('');
    const [validated, setValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onTextChanged = (e) => setText(e.target.value);

    const handleSubmitFeedback = async (e) => {
        e.preventDefault();
        setValidated(true);

        const form = e.currentTarget;
        if (form.checkValidity()) {
            try {
                setIsLoading(true);
                await submitFeedback(text);
                enqueueSnackbar("Dein Feedback wurde gesendet.", { variant: 'success' });
                navigate('/');
            } catch (error) {
                Swal.fire({
                    title: 'Bitte gib eine Nachricht ein.',
                    text: error.response?.data?.message,
                    icon: 'error'
                })
            } finally {
                setIsLoading(false);
            }
        }
    }

    if (!user) {
        return <CenteredPulseLoader />
    }

    return (
        <DefaultSmallContainer>
            <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmitFeedback}
            >
                <Typography fontSize={18}>Du hast einen Fehler gefunden oder Vorschläge für Verbesserungen?</Typography>
                <Typography color='text.secondary'>Solltest du einen Fehler gefunden haben, beschreibe bitte kurz, wobei der Fehler aufgetreten ist.</Typography>

                <Form.Group className="mt-3">
                    <Form.Control
                        as='textarea'
                        rows={10}
                        placeholder="Deine Nachricht..."
                        value={text}
                        onChange={onTextChanged}
                        required />
                    <Form.Control.Feedback type='invalid'>Bitte gib eine Nachricht ein.</Form.Control.Feedback>
                </Form.Group>

                <Typography></Typography>

                <FloatingButton
                    type='submit'
                    icon={isLoading ? <Spinner /> : <SendOutlined />}
                    disabled={isLoading}
                />
            </Form >
        </DefaultSmallContainer >
    )
}

export default Feedback