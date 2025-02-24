import moment from "moment"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { ConversationHistoryInterface } from "./chat-conversation-history"
import { Dispatch, SetStateAction } from "react"

const ConversationListItem = ({ data, me, setChatUserObj }: { data: ConversationHistoryInterface, me: boolean, setChatUserObj: Dispatch<SetStateAction<ConversationHistoryInterface | null>> }) => {
  const { msg_timestamp, msg } = data
  const formatted_time = moment(msg_timestamp).format("DD/MM HH:mm A")
  const handleConversationClick = (e: React.MouseEvent<HTMLDivElement | HTMLElement>) => {
    try {
      // e.target.classList("selected-menu-item")
      document.querySelectorAll(".selected-menu-item").forEach(ele =>{
        ele.classList.remove("selected-menu-item")
      })
      e.currentTarget.classList.add("selected-menu-item")
      console.log("data", data);
      
      setChatUserObj(data)
    } catch (error) {
      console.log("ERROR handleConversationClick", error)
    }
  }
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className={`flex w-full border-b gap-3 p-2 cursor-pointer rounded`} onClick={handleConversationClick} >
      <Avatar>
        <AvatarImage src={""} />
        <AvatarFallback className="uppercase">{me ? data.sender_name ? data.sender_name[0] : "" : data.receiver_name ? data.receiver_name[0] : ""}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col w-full">
        <div className="flex justify-between w-full">
          <p>{me ? data.sender_name : data.receiver_name}</p>
          <p className="text-xs">{formatted_time}</p>
        </div>
        <p className="text-sm">
          {msg}
        </p>
      </div>
    </div>
  )
}

export default ConversationListItem