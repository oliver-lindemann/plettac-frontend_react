import React from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { updateTokens } from '../../app/api/api';
import useAuth from '../../hooks/auth/useAuth';

const Redirect = () => {

    const { updateUser } = useAuth();

    const [searchParams] = useSearchParams();
    const username = searchParams?.get('username');
    const passedAccessToken = searchParams?.get('accessToken');
    const passedRefreshToken = searchParams?.get('refreshToken');

    console.log(username, passedAccessToken, passedRefreshToken);

    updateTokens({
        accessToken: passedAccessToken,
        refreshToken: passedRefreshToken
    });

    updateUser();

    return (
        <Navigate replace to='/login' />
    )
}

export default Redirect