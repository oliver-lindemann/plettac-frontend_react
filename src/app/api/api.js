import axios from "axios";

console.log(process.env.NODE_ENV);
console.log(process.env.REACT_APP_BACKEND_URL_PRODUCTION);
console.log(process.env.REACT_APP_BACKEND_URL_DEVELPMENT);
export const BASE_URL = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_BACKEND_URL_PRODUCTION
    : process.env.REACT_APP_BACKEND_URL_DEVELOPMENT;

console.log("BASE_URL");
console.log(BASE_URL);


const REFRESH_TOKEN_STORAGE_KEY = 'refresh_token';

let refreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
export let accessToken = '';

const baseApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export const baseAuthApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

baseApi.interceptors.request.use(
    async (config) => injectTokenIntoHeader(config),
    (error) => Promise.reject(error)
);

baseAuthApi.interceptors.request.use(
    async (config) => injectTokenIntoHeader(config),
    (error) => Promise.reject(error)
);

const injectTokenIntoHeader = (config) => {
    console.log("Perform Request");
    // const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
}

baseAuthApi.interceptors.response.use(response => response, async (error) => {
    const originalRequest = error?.config;
    console.log("OriginalRequest");
    console.log(originalRequest);
    if ((error?.response?.status === 403) && !originalRequest._retry) {
        originalRequest._retry = true;
        console.log("Retry with refresh")
        console.log("interceptor#refresh")
        const refreshResponse = await refresh();
        console.log("Now got response: ");
        console.log(refreshResponse);
        if (refreshResponse) {
            // localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
            accessToken = refreshResponse.accessToken;
        }
        console.log("Do next request with ");
        console.log(originalRequest);
        return baseApi(originalRequest);
    }
    console.log("already retried or no 403 error");
    console.log(error);
    return Promise.reject(error);
})

export const authUrlEndpoint = '/auth';

export const updateTokens = ({ accessToken: at, refreshToken: rt }) => {
    accessToken = at;
    refreshToken = rt;
}

export const login = async (credentials) => {
    const response = await baseApi.post(`${authUrlEndpoint}/login`, credentials);
    refreshToken = response.data?.refreshToken;
    localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
    accessToken = response.data?.accessToken;
    return response.data;
}

export const refresh = async () => {
    console.log("Refresh called-----");
    const response = await baseApi.post(`${authUrlEndpoint}/refresh`, {
        refresh_token: refreshToken
    });
    accessToken = response.data?.accessToken;
    console.log("-----Refresh done");
    return response.data;
}

export const logout = () => {
    refreshToken = '';
    accessToken = '';

    baseApi.post(`${authUrlEndpoint}/logout`);
}

export default baseApi;