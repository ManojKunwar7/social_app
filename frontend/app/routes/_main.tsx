import { useEffect, useState } from 'react'
import { Outlet, useLoaderData } from '@remix-run/react'
import { WSContext } from '~/ws/ws.context'
import { connect_io } from '~/ws/ws-client'
import { SidebarInset, SidebarProvider } from '~/components/ui/sidebar'
import { AppSidebar } from '~/components/app-sidebar'

export async function loader() {
  return Response.json({
    ENV: {
      socket_url: process.env.ws_url
    }
  })
}


const MainLayout = () => {
  const loaderdata = useLoaderData<typeof loader>();
  const [socket, setSocket] = useState<WebSocket | null>()

  useEffect(() => {
    console.log("loaderdata.ENV", loaderdata.ENV)
    const connection = connect_io(loaderdata.ENV.socket_url)
    console.log("connection", connection)
    setSocket(connection);
    return () => {
      connection?.close();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!socket) return;
    // console.log("socket.id", socket.connected, socket.id);
    socket.onopen = (resp) => {
      console.log("Websocket connection opened", resp);
    }
    socket.onclose = (resp) => {
      console.log("Websocket connection closed", resp);
    }
    socket.onmessage = (msg) => {
      console.log("msg from server", msg);
    }
  }, [socket])


  return (
    <WSContext.Provider value={socket}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
            <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </WSContext.Provider>
  )
}

export default MainLayout