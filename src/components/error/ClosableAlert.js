import React from 'react'
import { useState } from 'react';
import { Alert } from 'react-bootstrap';

const ClosableAlert = ({ show, variant, title, message }) => {
    const [isShown, setIsShown] = useState(show);

    if (isShown) {
        return (
            <Alert
                variant={variant}
                onClose={() => setIsShown(false)}
                dismissible>
                {/* <Alert.Heading>{title}</Alert.Heading> */}
                <p>{message}</p>
            </Alert>
        )
    }
}

export default ClosableAlert