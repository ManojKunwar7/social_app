import ChatListItem from "./conversation-list-item"
import ChatConversationHeader, { SearchResultInterface } from "./chat-conversation-header";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import axios from "axios";

export interface ConversationHistoryInterface {
  _id: string,
  msg: string,
  sender_id: string,
  sender_name: string,
  receiver_name: string,
  receiver_id: string,
  creator_id: string,
  last_msg_by_id: string,
  msg_timestamp: string,
}


const ChatConversationHistory = ({ userObj, chatUser, setChatUserObj }: { userObj: SearchResultInterface | null, chatUser: ConversationHistoryInterface | null, setChatUserObj: Dispatch<SetStateAction<ConversationHistoryInterface | null>> }) => {
  const [conversations, setConversations] = useState<ConversationHistoryInterface[]>([]);
  useEffect(() => {
    const getConversationReq = async () => {
      try {
        console.log("userObj", userObj)
        const conversation_history = await axios({
          url: `/backend/api/private/v1/fetch/conversation-history`,
          method: "POST",
          data: { user_id: userObj?._id },
          headers: { 'Content-Type': "application/json" },
        })
        console.log("conversation_history", conversation_history.data);
        setConversations(conversation_history.data?.data ?? [])
      } catch (error) {
        console.log("getConversationReq error", error);
      }
    }
    getConversationReq()
  }, [userObj])

  return (
    <section className="flex flex-1 flex-col h-full " style={{ flexBasis: "30%" }}>
      <header style={{ flexBasis: "4rem" }}>
        <div className="w-full px-3 flex items-center justify-start h-full gap-3">
          <ChatConversationHeader userObj={userObj} conversations={conversations} setConversations={setConversations} />
        </div>
      </header>
      <section className="p-1 overflow-y-auto h-auto social-custom-scroll" style={{ flexBasis: "calc(100% - 4rem)", "border": `1px solid hsl(var(--border))`, borderLeft: "none", borderRight: "none", borderBottom: "1px solid hsl(var(--border))" }}>
        {conversations?.map((conversation, key) => <ChatListItem me={userObj?._id == conversation.sender_id ? true : false} key={key} data={conversation} setChatUserObj={setChatUserObj} />)}
      </section>
    </section>
  )
}

export default ChatConversationHistory