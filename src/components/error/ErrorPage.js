import React from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/auth/useAuth';
import { Alert } from '@mui/material';

const ErrorPage = ({ error }) => {
    let content = (
        <Alert
            severity='error'
        // variant='filled'
        >
            {error.message}
        </Alert>
    );

    console.log("ErrorPage#error");
    console.log(error);
    console.log(error.stack)

    const navigate = useNavigate();
    const { user, logout } = useAuth();

    if (error.response?.status === 401) {
        if (!!user) {
            console.log("ErrorPage# User available, retry again...");
            // window.location.reload();
            // return;
        }

        // logout();
        // Swal.fire({
        //     title: 'Sitzung abgelaufen',
        //     text: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.",
        //     icon: 'warning',
        //     showConfirmButton: true
        // });
    }

    if (error.response?.status === 403) {
        Swal.fire({
            title: 'Nicht genügend Berechtigungen',
            message: "Du verfügst nicht über ausreichende Berechtigungen, um die geforderte Seite aufzurufen.",
            icon: 'warning',
            showConfirmButton: true
        }).then(() => {
            console.log("ErrorPage -> not enough Permissions. Navigate to login page");
            navigate('/login');
        });
    }

    if (error.response?.status === 500) {
        Swal.fire({
            title: 'Serverfehler',
            message: "Beim Bearbeiten deiner Anfrage ist ein Fehler aufgetreten. Bitte versuche es später erneut.",
            icon: 'danger',
            showConfirmButton: true
        });
    }

    return (content);
}

export default ErrorPage