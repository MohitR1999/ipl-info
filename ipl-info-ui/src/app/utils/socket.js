import { io } from 'socket.io-client'

const URL = `http://${process.env.NEXT_PUBLIC_BACKEND_HOST}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/`

export const socket = io(URL, {
    autoConnect : false
});