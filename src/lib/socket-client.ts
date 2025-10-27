import { io, Socket } from 'socket.io-client';

const ROLE_PORTS = {
  gerant: 3000,
  serveur: 3001,
  bar: 3002,
  cuisine: 3003,
} as const;

export const getSocketUrl = (): string => {
  const role = (process.env.NEXT_PUBLIC_APP_ROLE as keyof typeof ROLE_PORTS) || 'gerant';
  const port = ROLE_PORTS[role] || 3000;

  // Respect custom host if provided
  const host = process.env.NEXT_PUBLIC_SOCKET_HOST || 'localhost';
  return `http://${host}:${port}`;
};

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(getSocketUrl(), {
      path: '/api/socketio',
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
};

export default getSocket;
