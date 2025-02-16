// import { io } from "socket.io-client"

export const connect_io = (url: string | null | undefined) => {
  const ws_url = url
  if (!ws_url) return null
  const socket = new WebSocket(url);
  return socket;
  // return io(ws_url, {
  //   transports: ['websocket', "polling"]
  // })
}