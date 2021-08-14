import axios from 'axios'
import config from '../configs/config';
import { handleError } from './errorHandling.service';

export const login = async (userData: any, setCredentialError: any): Promise<Boolean> => {
    try {
        const res = await axios.post(`${config.apiUrl}/account/login`, userData)
        if (res.status === 200) {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('username', userData.username);
            return true;
        } else {
            setCredentialError(res.data.message);
            return false;
        }
    } catch (error) {
        setCredentialError('There was an error! please try again!');
        handleError(error);
        return false;
    }
}

export const register = async (userData: Object, setUsernameError: any) => {
    try {
        const res = await axios.post(`${config.apiUrl}/account/register`, userData)
        if (res.status === 200) {
            return true;
        } else {
            setUsernameError(res.data);
            return false;
        }
    } catch (error) {
        setUsernameError('There was an error! please try again!');
        handleError(error);
        return false;
    }
};
export const logout = () => {
    try {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
    } catch (error) {
        handleError(error)
    }
};
export const getCurrentUser = (): String => {
    try {
        const username = localStorage.getItem('username');
        return username ? username : "";
    } catch (error) {
        handleError(error)
        return "";
    }
};

export const isAuthorized = async (): Promise<Boolean> => {
    try {
        const dataToSend = {
            authorization: localStorage.getItem('token')
        }
        const response = await axios.post(`${config.apiUrl}/account/isconnected`, dataToSend)
        console.log(response);
        
        if (response.status === 200) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.username);
            return true;
        } else {
            logout();
            return false;
        }
    } catch (error) {
        handleError(error)
        return false;

    };
}