import { useRef, useState } from 'react';
import { Button, Col, FloatingLabel, Form, Modal } from 'react-bootstrap';

import Swal from 'sweetalert2';

import { useSWRConfig } from 'swr';
import {
    addCustomer,
    customersUrlEndpoint as cacheKey
} from '../../app/api/customersApi';
import { useSnackbar } from 'notistack';

const CreateCustomerDialog = ({ show, setShow, onCustomerCreated }) => {

    const { mutate } = useSWRConfig();

    const { enqueueSnackbar } = useSnackbar();

    const handleClose = () => setShow(false);

    const nameRef = useRef();
    const shortNameRef = useRef();
    const streetRef = useRef();
    const cityRef = useRef();

    const [validated, setValidated] = useState(false);

    const handleCustomerSave = async (customer) => {
        try {
            console.log("Adding Customer...");
            await addCustomer(customer);

            enqueueSnackbar("Kunde erfolgreich erstellt!", { variant: 'success' });
            await mutate(cacheKey);
            onCustomerCreated(customer);

            handleClose();
            // Reset fields on successful save
            setValidated(false);

        } catch (error) {
            let errorMessage;
            console.log("Error from save customer");
            console.log(error)
            switch (error.response?.status) {
                case 400:
                    errorMessage = 'Bitte fülle alle geforderten Felder aus';
                    break;
                case 409:
                    errorMessage = 'Der Kundenname oder Kurzname ist bereits vergeben. Bitte wähle einen anderen';
                    break;
                default:
                    errorMessage = 'Es ist ein Fehler aufgetreten: ' + error.message;
            }
            return Swal.fire({
                title: "Nachricht vom Server",
                text: errorMessage || error.message,
                icon: 'warning'
            });
        }
    }

    const handleSaveCustomer = (e) => {
        console.log("Submitted")
        e.preventDefault();
        setValidated(true);

        const form = e.currentTarget;
        if (form.checkValidity()) {
            const updatedCustomer = {
                name: nameRef.current.value,
                shortName: shortNameRef.current.value || nameRef.current.value,
                street: streetRef.current.value,
                city: cityRef.current.value
            }

            handleCustomerSave(updatedCustomer);
        }
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Form
                noValidate
                validated={validated}
                onSubmit={handleSaveCustomer}
                className="col-sm-12"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Neuen Kunden anlegen</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form.Group as={Col} className="mb-3">
                        <FloatingLabel label="Kundenname">
                            <Form.Control
                                type='text'
                                placeholder="Kundenname"
                                ref={nameRef}
                                required />
                            <Form.Control.Feedback type='invalid'>Bitte gib einen Kundennamen ein.</Form.Control.Feedback>
                        </FloatingLabel>
                    </Form.Group>

                    <Form.Group as={Col} className="mb-3">
                        <FloatingLabel label="Kurzname">
                            <Form.Control
                                type='text'
                                placeholder="Kurzname"
                                ref={shortNameRef}
                            />
                        </FloatingLabel>
                    </Form.Group>

                    <Form.Group as={Col} className="mb-3">
                        <FloatingLabel label="Straße und Hausnummer">
                            <Form.Control
                                type='text'
                                placeholder="Straße und Hausnummer"
                                ref={streetRef}
                            />
                        </FloatingLabel>
                    </Form.Group>

                    <Form.Group as={Col} className="mb-3">
                        <FloatingLabel label="PLZ & Stadt">
                            <Form.Control
                                type='text'
                                placeholder="PLZ & Stadt"
                                ref={cityRef}
                            />
                        </FloatingLabel>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Abbrechen
                    </Button>
                    <Button variant="primary" type="submit">
                        Kunde anlegen
                    </Button>
                </Modal.Footer>
            </Form >
        </Modal>
    )
}

export default CreateCustomerDialog