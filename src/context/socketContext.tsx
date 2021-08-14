import {io} from "socket.io-client";
import React from 'react';
import config from '../configs/config';
const SOCKET_URL = config.apiUrl;

export const socket = io(SOCKET_URL, { transports: ['websocket', 'polling', 'flashsocket'] });
export const SocketContext = React.createContext<any>(null);
