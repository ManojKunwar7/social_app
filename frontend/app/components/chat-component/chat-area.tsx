import { File, MessageSquare, Paperclip, Send, UploadCloud, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Textarea } from "../ui/textarea"
import { Card, CardContent } from "../ui/card"
import { Dispatch, Fragment, SetStateAction, useEffect, useRef, useState } from "react"
import { SearchResultInterface } from "./chat-conversation-header"
import { ConversationHistoryInterface } from "./chat-conversation-history"
import axios from "axios"
import { toast } from "sonner"

interface FileType {
  file_name: string,
  mime_type: string,
  created_at: string,
  file_size: string,
  file_type: string,
  file_url: string,
  caption: string
}

interface EmojiObj {
  user_id: string,
  reaction: string,
  created_at: string,
}

interface ChatListItem {
  msg: string,
  user_id: string,
  created_at: string,
  updated_at: string,
  receiver_id: string,
  file: FileType,
  msg_type: string
  reaction: EmojiObj[]
}

interface sendMediaFileInterface {
  files: FileType
}

const ChatArea = ({ userObj, chatUser, setChatUserObj }: { userObj: SearchResultInterface | null, chatUser: null | ConversationHistoryInterface, setChatUserObj: Dispatch<SetStateAction<ConversationHistoryInterface | null>> }) => {
  const fileInpRef = useRef(null)
  const [chats, setChats] = useState<ChatListItem[]>([])
  const [sendMediaFile, setSendMediaFile] = useState<sendMediaFileInterface[]>([])
  const [textMsg, setTextMsg] = useState<string>("")
  // const [caption, setCaption] = useState<string>("")
  const [showSendMedia, setShowSendMedia] = useState<boolean>(false)


  useEffect(() => {
    if (showSendMedia) setShowSendMedia(false);
    if (sendMediaFile?.length) setSendMediaFile([]);
    if (!chatUser) return
    const getPreviousChat = async () => {
      try {
        const chat_history = await axios({
          url: `/backend/api/private/v1/fetch/previous-chat`,
          method: "POST",
          data: { conversation_id: chatUser?._id },
          headers: { 'Content-Type': "application/json" },
        })
        console.log("chat_history", chat_history.data);
        setChats(chat_history.data?.data ?? [])
      } catch (error) {
        console.log("getPreviousChat error", error);
      }
    }
    getPreviousChat()
  }, [chatUser])

  const handleSendChat = async () => {
    try {
      if (!textMsg.length) {
        toast.error("Enter message before sending!", {
          position: "top-right",
        })
        return
      }
      const send_chat_resp = await axios({
        url: `/backend/api/private/v1/send/chat/text`,
        method: "POST",
        data: { conversation_id: chatUser?._id, text: textMsg, user_id: userObj?._id },
        headers: { 'Content-Type': "application/json" }
      })
      console.log("send_chat_resp", send_chat_resp);
    } catch (error) {
      console.log("send_chat_resp error", error);
      toast.error("Internal server error!", {
        position: "top-right",
        richColors: true
      })
    }
  }

  const handleSendMedia = async () => {
    try {
      // showSendMedia()
    } catch (error) {
      console.log("handleSendMedia error", error);
      toast.error("Internal server error!", {
        position: "top-right",
        richColors: true
      })
    }
  }

  const HandleAddFileToArr = (e: Event) => {
    try {
      const files = (e.target as HTMLInputElement).files
      console.log("--> ", files)
      if (((files?.length ?? 0) + sendMediaFile.length) >= 5) {
        toast.info(`You can upload 5 files at a time!`, {
          position: "top-right",
          richColors: true
        })
        return;
      }
      // sendMediaFile
    } catch (error) {
      console.log("HandleAddFileToArr error", error);
      toast.error("Internal server error!", {
        position: "top-right",
        richColors: true
      })
    }
  }

  const HandleAddFile = async () => {
    try {
      const inp = document.createElement('input');
      inp.type = "file"
      inp.multiple = true
      inp.onchange = HandleAddFileToArr
      inp.click()
    } catch (error) {
      toast.error("Unable to add file!", {
        position: "top-right",
        richColors: true
      })
    }
  }

  const HandleCloseSendMedia = () => {
    if (showSendMedia) setShowSendMedia(false);
    if (sendMediaFile?.length) setSendMediaFile([]);
  }

  return (
    <section className="flex flex-1 flex-col h-full relative" style={{ flexBasis: "70%" }}>
      {chatUser ? <>
        {!showSendMedia ?
          <>
            <header style={{ "borderRight": `1px solid hsl(var(--border))`, "borderBottom": `1px solid hsl(var(--border))`, flexBasis: "4rem" }} className="px-4 h-full">
              <div className="flex max-w-fit gap-3 items-center h-full">
                <Avatar>
                  <AvatarImage src={``} />
                  <AvatarFallback className="uppercase">{chatUser.sender_id == userObj?._id ? chatUser.sender_name ? chatUser.sender_name[0] : "" : chatUser.receiver_name ? chatUser.receiver_name[0] : ""}</AvatarFallback>
                </Avatar>
                <p className="font-bold">{chatUser.sender_id == userObj?._id ? chatUser.sender_name : chatUser.receiver_name}</p>
              </div>
            </header>
            <section className="social-custom-scroll overflow-y-auto flex flex-col-reverse px-3 py-2 gap-4" style={{ "borderRight": `1px solid hsl(var(--border))`, flexBasis: "calc(100% - 8rem)" }}>
              {/* Chat list */}
              {chats?.map((chat, idx) => (<BuildChatBubble data={chat} key={idx} />))}
            </section>
            <footer className="p-2 flex items-center gap-2" style={{ flexBasis: "3rem", "borderRight": `1px solid hsl(var(--border))`, "borderBottom": `1px solid hsl(var(--border))`, }}>
              <Textarea placeholder="Enter your messsage" value={textMsg} onInput={(e) => setTextMsg(e.currentTarget.value)} style={{ minHeight: "30%", height: "80%" }}></Textarea>
              <div className="flex justify-end items-center gap-2">
                <Send className="cursor-pointer" onClick={handleSendChat} />
                <Paperclip className="cursor-pointer" onClick={() => setShowSendMedia(true)} />
              </div>
            </footer>
          </>
          :
          <>
            {sendMediaFile?.length ?
              <>
                <X width={40} height={40} className="cursor-pointer absolute top-[10px] right-[10px]" onClick={HandleCloseSendMedia} />
                <div style={{ flexBasis: "100%" }} className="d-none items-center justify-center">
                  <div className="w-[50%] h-[50%] rounded-2xl flex " style={{ background: "hsl(var(--border))" }}>
                    <button onClick={HandleAddFile} className="flex flex-col items-center justify-center w-[100%] h-[100%] cursor-pointer">
                      <UploadCloud width={40} height={40} />
                      <span className="capitalize font-semibold">
                        Upload media
                      </span>
                    </button>
                  </div>
                </div>
              </> :
              <>
                <X width={40} height={40} className="cursor-pointer absolute top-[10px] right-[10px]" onClick={HandleCloseSendMedia} />
                <div style={{ flexBasis: "100%" }} className="flex items-center justify-center">
                  <div className="w-[50%] h-[50%] rounded-2xl flex " style={{ background: "hsl(var(--border))" }}>
                    <button onClick={HandleAddFile} ref={fileInpRef} className="flex flex-col items-center justify-center w-[100%] h-[100%] cursor-pointer">
                      <UploadCloud width={40} height={40} />
                      <span className="capitalize font-semibold">
                        Upload media
                      </span>
                    </button>
                  </div>
                </div>
                {
                  sendMediaFile.map((data, idx) => {
                    return (
                      <Fragment key={idx}>
                        <div style={{ flexBasis: "calc(100% - 4rem)" }} className="flex items-center justify-center">
                          <div className="w-[50%] h-[50%] rounded-2xl flex p-1" style={{ background: "hsl(var(--border))" }}>
                            <div className="w-full h-[90%] flex gap-1 flex-col justify-center items-center">
                              {/* Image */}
                              {data.files.file_type == "image" ?
                                <img style={{ height: "100%", width: "100%" }} alt={data.files.file_name} /> : ""}
                              {/* Audio */}
                              {data.files.file_type == "audio" ?
                                <audio style={{ height: "100%", width: "100%" }} controls>
                                  <source src={data.files.file_url} />
                                  <track kind="captions" srcLang="en" src="" default label="English" />
                                </audio>
                                : ""}
                              {/* Video */}
                              {data.files.file_type == "video" ?
                                <video style={{ height: "100%", width: "100%" }} controls>
                                  <source src={data.files.file_url} />
                                  <track kind="captions" srcLang="en" src="" default label="English" />
                                </video>
                                : ""}
                              {/* Document */}
                              {data.files.file_type == "document" ?
                                <button onClick={HandleAddFile} className="flex flex-col items-center justify-center w-[100%] h-[100%] cursor-pointer">
                                  <File width={40} height={40} />
                                </button> : ""}
                            </div>
                            <span className="font-semibold text-center">
                              {data.files.file_name}
                            </span>
                          </div>
                        </div>
                        <footer className="p-2 flex items-center gap-2" style={{ flexBasis: "3rem", "borderRight": `1px solid hsl(var(--border))`, "borderBottom": `1px solid hsl(var(--border))`, }}>
                          <Textarea placeholder="Enter caption" value={data.files.caption} onInput={() => { }} style={{ minHeight: "30%", height: "80%" }}></Textarea>
                          <div className="flex justify-end items-center gap-2">
                            <Send className="cursor-pointer" onClick={handleSendMedia} />
                            {/* <Paperclip className="cursor-pointer" onClick={() => setShowSendMedia(true)} /> */}
                          </div>
                        </footer>
                      </Fragment>
                    )
                  })
                }
              </>
            }
          </>
        }
      </> :
        <>
          <div className="flex flex-1 justify-center items-center">
            <div className="flex flex-col justify-center items-center gap-2">
              <MessageSquare height={50} width={50} />
              <p className="text-xl">Selece a conversation to start chatting!</p>
            </div>
          </div>
        </>
      }
    </section>
  )
}


export const BuildChatBubble = ({ data }: { data: ChatListItem }) => {
  return <Card>
    <CardContent className="!px-3 !py-2">
      <div>{data.msg}</div>
    </CardContent>
  </Card>
}

export const BuildAttachment = () => {

}

export default ChatArea