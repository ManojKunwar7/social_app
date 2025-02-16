import { Paperclip, Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Textarea } from "../ui/textarea"

const ChatArea = () => {
  return (
    <section className="flex flex-1 flex-col h-full" style={{ flexBasis: "70%" }}>
      <header style={{ "borderRight": `1px solid hsl(var(--border))`, "borderBottom": `1px solid hsl(var(--border))`, flexBasis: "4rem" }} className="px-4 h-full">
        <div className="flex max-w-fit gap-3 items-center h-full">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p className="font-bold">Manoj</p>
        </div>
      </header>
      <section className="social-custom-scroll overflow-y-auto" style={{ "borderRight": `1px solid hsl(var(--border))`, flexBasis: "calc(100% - 8rem)"}}>
        {/* Chat list */}
      </section>
      <footer className="p-2 flex items-center gap-2" style={{ flexBasis: "3rem", "borderRight": `1px solid hsl(var(--border))`, "borderBottom": `1px solid hsl(var(--border))`, }}>
        <Textarea placeholder="Enter your messsage" style={{minHeight: "30%", height: "80%"}}></Textarea>
        <div className="flex justify-end items-center gap-2">
          <Send />
          <Paperclip />
        </div>
      </footer>
    </section>
  )
}

export default ChatArea