import { LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { useState } from "react"
import ChatArea from "~/components/chat-component/chat-area"
import { SearchResultInterface } from "~/components/chat-component/chat-conversation-header"
import ChatConversationHistory, { ConversationHistoryInterface } from "~/components/chat-component/chat-conversation-history"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, } from "~/components/ui/breadcrumb"
import { Separator } from "~/components/ui/separator"
import { SidebarTrigger } from "~/components/ui/sidebar"

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const fetch_resp = await fetch(`${process.env.backend_url}/api/v1/check/token`, {
      method: "GET",
      headers: {
        "Cookie": request.headers.get("Cookie") ?? ""
      }
    })

    const token_resp = await fetch_resp.json()
    console.log("token_resp", token_resp);
    if (token_resp?.authenticated) {
      console.log("token_resp", token_resp?.authenticated);
      return {
        userObj: token_resp.data[0]
      }
    }
    return {
      userObj: null
    }
  } catch (error) {
    console.log("Error on loading", error)
    return {
      userObj: null
    }
  }
}


const ChatWindow = () => {
  const data = useLoaderData<typeof loader>()
  const [chatUser, setChatUser] = useState<ConversationHistoryInterface | null>(null);
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-r border-t">
        <div className="flex items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink>
                  Chat
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <section className="flex flex-1" style={{ height: "calc(100% - 4rem)" }}>
        <ChatConversationHistory userObj={data?.userObj} chatUser={chatUser} setChatUserObj={setChatUser} />
        <div className="h-full">
          <div className="h-full" style={{ "borderRight": `1px solid hsl(var(--border))` }} />
        </div>
        <ChatArea userObj={data?.userObj} chatUser={chatUser} setChatUserObj={setChatUser} />
      </section>
    </>
  )
}

export default ChatWindow