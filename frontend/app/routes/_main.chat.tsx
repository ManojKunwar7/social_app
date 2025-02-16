import ChatArea from "~/components/chat-component/chat-area"
import ChatConversationHistory from "~/components/chat-component/chat-conversation-history"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, } from "~/components/ui/breadcrumb"
import { Separator } from "~/components/ui/separator"
import { SidebarTrigger } from "~/components/ui/sidebar"

const ChatWindow = () => {
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
      <section className="flex flex-1" style={{height: "calc(100% - 4rem)"}}>
        <ChatConversationHistory />
        <div className="h-full">
          <div className="h-full" style={{ "borderRight": `1px solid hsl(var(--border))` }} />
        </div>
        <ChatArea />
      </section>
    </>
  )
}

export default ChatWindow