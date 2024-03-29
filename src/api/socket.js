import {io}  from 'socket.io-client';
let baseURL  = ""
if (process.env.NODE_ENV === 'development') {
  baseURL = "http://localhost:9000"
} else {
  baseURL = "https://node.cpypst.online"
}
// "undefined" means the URL will be computed from the `window.location` object
const URL =baseURL;

export const socket = io(URL, { secure: true});