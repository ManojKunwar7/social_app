import { List } from "lucide-react"
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import ChatListItem from "./chat-list-item"

const ChatConversationHistory = () => {
  const arr = Array(10).fill(1);
  console.log("arr", arr);
  
  return (
    <section className="flex flex-1 flex-col h-full " style={{ flexBasis: "30%" }}>
      <header style={{ flexBasis: "4rem", }}>
        <div className="w-full px-3 flex items-center justify-start h-full gap-3">
          <List />
          <p className="m-0 text-base font-bold">Conversation history</p>
        </div>
      </header>
      <section className="p-2 overflow-y-auto h-auto social-custom-scroll" style={{ flexBasis: "calc(100% - 4rem)" ,"border": `1px solid hsl(var(--border))`, borderLeft: "none", borderRight: "none", borderBottom: "1px solid hsl(var(--border))" }}>
        {/* Chat list */}
        {arr.map((_, key) => <ChatListItem key={key} />)}
      </section>
    </section>
  )
}

export default ChatConversationHistory