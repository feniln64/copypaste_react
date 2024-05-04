import {io}  from 'socket.io-client';

export const socket = io("https://socket-server.cpypst.online", { secure: true,autoConnect: false});