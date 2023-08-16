import jwtDecode from 'jwt-decode';
import { useEffect, useState } from 'react';
import { preload, useSWRConfig } from 'swr';
import {
    login as apiLogin,
    refresh as apiRefresh,
    logout as apiLogout,
    accessToken
} from "../../app/api/api";
import { getParts, partsUrlEndpoint } from '../../app/api/partsApi';
import { ROLES } from '../../config/roles';
import { getLoadingLists, loadingListsUrlEndpoint } from '../../app/api/loadingListsApi';
import { deliveryNotesUrlEndpoint, getDeliveryNotes } from '../../app/api/deliveryNotesApi';
import { getWorkOrders, workOrdersUrlEndpoint } from '../../app/api/workOrdersApi';


const decodeUserFromToken = (token) => {
    if (!token) {
        return;
    }

    const decoded = jwtDecode(token);
    const user = decoded?.user;

    if (user) {
        user.isAdmin = user.roles.includes(ROLES.Admin);
        user.isLager = user.roles.includes(ROLES.Lager);
        user.isTimeTracking = user.roles.includes(ROLES.TimeTracking);
        user.status = user.isAdmin ? ROLES.Admin
            : user.isLager ? ROLES.Lager
                : ROLES.Standard;
    }
    return user;
}

export default function useProvideAuth() {

    const { mutate } = useSWRConfig();

    const decodedUser = decodeUserFromToken(accessToken);
    const [user, setUser] = useState(decodedUser);
    const [isLogin, setIsLogin] = useState(Boolean(user));
    const [isLoading, setIsLoading] = useState(false);

    const updateUser = () => {
        const decodedUser = decodeUserFromToken(accessToken);
        setUser(decodedUser);
    }

    // const clearCache = () => mutate(
    //     () => true,
    //     undefined,
    //     { revalidate: false }
    // );

    const login = async (credentials) => {
        console.log("Logging in...")
        setIsLoading(true);
        try {
            await apiLogin(credentials);
            updateUser();
            console.log("Login#Preloading Items...")
            try {
                preload(partsUrlEndpoint, getParts);
                preload(loadingListsUrlEndpoint, getLoadingLists);
                preload(deliveryNotesUrlEndpoint, getDeliveryNotes);
                preload(workOrdersUrlEndpoint, getWorkOrders);
            } catch (error) {
                console.log("Error while preloading...");
                console.log(error);
            }
        } finally {
            setIsLoading(false);
        }
        console.log("Login finished")
    };

    const refresh = async () => {
        const refreshResponse = await apiRefresh();
        updateUser();
    }

    const logout = async () => {
        setIsLoading(true);
        // logout
        try {
            // LocalStorage leeren, damit bspw. ungespeicherte Checklist-Änderungen 
            // nicht vom nächsten angemeldeten Benutzer eingesehen werden können
            localStorage.clear();
            // const response = 
            apiLogout();
            updateUser();
            mutate(/* match all keys */() => true, undefined, false)

        } finally {
            setIsLoading(false);
        }
    }

    // window.addEventListener('storage', () => {
    //     console.log("Storage changed");
    //     const newToken = readTokenFromLocalStorage();
    //     setToken(newToken);
    //     setUser(decodeUserFromToken(newToken))
    // });

    useEffect(() => { console.log("setIsLogin"); console.log(user); setIsLogin(Boolean(user)) }, [user])


    return { user, login, refresh, logout, isLogin, isLoading };
}