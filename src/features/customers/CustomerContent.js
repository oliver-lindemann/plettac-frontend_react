import { useState } from "react";
import { Col, FloatingLabel, Form, Spinner } from "react-bootstrap";
import DefaultSmallContainer from '../../components/layout/DefaultSmallContainer'
import SaveIcon from '@mui/icons-material/Save';

import FloatingButton from "../../components/layout/FloatingButton";

const CustomerContent = ({ customer, onSaveButtonClicked }) => {

    const [name, setName] = useState(customer?.name || '');
    const [street, setStreet] = useState(customer?.street || '');
    const [city, setCity] = useState(customer?.city || '');

    const [validated, setValidated] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const onNameChanged = (e) => setName(e.target.value);
    const onStreetChanged = (e) => setStreet(e.target.value);
    const onCityChanged = (e) => setCity(e.target.value);

    const handleSaveCustomer = async (e) => {
        e.preventDefault();
        setValidated(true);

        const form = e.currentTarget;
        if (form.checkValidity()) {
            const updatedCustomer = {
                ...customer,
                name: name,
                street: street,
                city: city
            }
            try {
                setIsSaving(true);
                await onSaveButtonClicked(updatedCustomer);
            } finally {
                setIsSaving(false);
            }
        }
    }

    return (
        <DefaultSmallContainer>

            <Form
                noValidate
                validated={validated}
                onSubmit={handleSaveCustomer}
                className="col-sm-12"
            >

                <Form.Group as={Col} className="mb-3">
                    <FloatingLabel label="Kundenname">
                        <Form.Control
                            type='text'
                            placeholder="Kundenname"
                            value={name}
                            onChange={onNameChanged}
                            required />
                        <Form.Control.Feedback type='invalid'>Bitte gib einen Kundennamen ein.</Form.Control.Feedback>
                    </FloatingLabel>
                </Form.Group>

                <Form.Group as={Col} className="mb-3">
                    <FloatingLabel label="Straße und Hausnummer">
                        <Form.Control
                            type='text'
                            placeholder="Straße und Hausnummer"
                            value={street}
                            onChange={onStreetChanged}
                        />
                    </FloatingLabel>
                </Form.Group>

                <Form.Group as={Col} className="mb-3">
                    <FloatingLabel label="PLZ & Stadt">
                        <Form.Control
                            type='text'
                            placeholder="PLZ & Stadt"
                            value={city}
                            onChange={onCityChanged}
                        />
                    </FloatingLabel>
                </Form.Group>

                <FloatingButton
                    type='submit'
                    disabled={isSaving}
                    icon={isSaving ? <Spinner /> : <SaveIcon width='1.5em' height='1.5em' />}
                />
            </Form >


        </DefaultSmallContainer>
    )
}

export default CustomerContent