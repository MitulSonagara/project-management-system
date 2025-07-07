import { jwtDecode } from 'jwt-decode';
import { io } from "socket.io-client"
import { API_BASE_URL } from '../appConfig';


export const isTokenValid = (token) => {
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime;
    } catch (error) {
        return false;
    }
}

export const getToken = () => {
    return localStorage.getItem('token');
}

export const setToken = (token) => {
    localStorage.setItem('token', token);
}

export const removeToken = () => {
    localStorage.removeItem('token');
}

export const socket = io(API_BASE_URL, {
    transports: ["websocket", "polling"],
    withCredentials: true
})