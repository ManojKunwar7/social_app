import axios from "axios";
import { List, Search, X } from "lucide-react"
// import React, { Dispatch, SetStateAction, useRef, useState } from "react"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { ConversationHistoryInterface } from "./chat-conversation-history";


export interface SearchResultInterface {
  _id: string,
  email: string,
  created_at: string,
  updated_at: string,
  first_name: string,
  phone_no: string,
  last_name: string,
  user_name: string,
  profile_pic: string,
}

const ChatConversationHeader = ({ userObj, conversations, setConversations }: { userObj: SearchResultInterface | null, conversations: ConversationHistoryInterface[], setConversations: Dispatch<SetStateAction<ConversationHistoryInterface[]>> }) => {
  const inputRef = useRef(null)
  const abortController = useRef<AbortController>(new AbortController());
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchResultLoader, setSearchResultLoader] = useState<boolean>(true);
  const [searchResult, setSearchResults] = useState<SearchResultInterface[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const handleToggleSearch = () => setShowSearch(!showSearch)

  const handleSearchUser = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setSearchResultLoader(true);
      const val = e.target.value?.trim()
      setSearchQuery(val)
      if (e.target.value?.length <= 3) return
      abortController.current.abort()
      abortController.current = new AbortController()
      const query_resp = await axios({
        url: `/backend/api/private/v1/query/profile?query=${val}`,
        signal: abortController.current.signal,
        method: "GET"
      })
      if (query_resp.data?.data?.length) {
        setSearchResults([])
      }
      setSearchResults(query_resp.data.data)
    } catch (error: unknown) {
      console.log("Error handleSearchUser", error)
    } finally {
      setSearchResultLoader(false);
    }
  }

  const HandleOnSelectSearch = (data: SearchResultInterface) => {
    try {
      const { _id: receiver_id, first_name, last_name } = data
      console.log("data", data, userObj);
      
      const temp_conversation = conversations
      const conversation_receiver_idx = temp_conversation.findIndex(conversation => conversation.receiver_id == receiver_id)
      const conversation_sender_idx = temp_conversation.findIndex(conversation => conversation.sender_id == receiver_id)
      if (conversation_sender_idx >= 0) {
        const conversationObj = temp_conversation[conversation_sender_idx]
        temp_conversation.splice(conversation_sender_idx, 1)
        setConversations([conversationObj, ...temp_conversation]);
      } else if (conversation_receiver_idx >= 0) {
        const conversationObj = temp_conversation[conversation_receiver_idx]
        temp_conversation.splice(conversation_receiver_idx, 1)
        setConversations([conversationObj, ...temp_conversation]);
      } else {
        const conversationObj: ConversationHistoryInterface = {
          _id: "",
          msg: "-",
          creator_id: userObj?._id ?? "",
          sender_id: userObj?._id ?? "",
          last_msg_by_id: userObj?._id ?? "",
          receiver_id: receiver_id,
          msg_timestamp: new Date().toISOString(),
          receiver_name: `${first_name} ${last_name}`,
          sender_name: `${userObj?.first_name ?? ""} ${userObj?.last_name ?? ""}`
        }
        setConversations([conversationObj, ...temp_conversation]);
      }
      setSearchQuery("")
    } catch (error) {
      console.log("ERROR: HandleOnSelectSearch", error);
    }
  }

  return (
    <>
      {!showSearch ?
        <>
          <List />
          <div className="flex items-center justify-between w-full">
            <p className="m-0 text-base font-bold">Conversation history</p>
            <Search onClick={handleToggleSearch} className="cursor-pointer" />
          </div>
        </> :
        <div className="flex items-center justify-between w-full gap-3 relative">
          <Input placeholder="Search Users" onInput={handleSearchUser} ref={inputRef} value={searchQuery} />
          <X onClick={handleToggleSearch} className="cursor-pointer" />
          {
            searchQuery?.length ?
              searchResultLoader ?
                <InputSearchResultSekelton items={Array(5).fill(0)} eleRef={inputRef} /> :
                <InputSearchResult items={searchResult} eleRef={inputRef} onclick={HandleOnSelectSearch} />
              : <></>
          }
        </div>
      }
    </>
  )
}


export const InputSearchResultSekelton = ({ items, eleRef }: { items: number[], eleRef: React.RefObject<HTMLElement> }) => {
  const pos_left = eleRef.current?.clientLeft ? eleRef.current?.clientLeft : 0
  const pos_top = eleRef.current?.clientTop ? eleRef.current?.clientTop : 0
  return <Card className="!p-1 z-10 absolute min-h-[auto] max-h-[250px] w-[100%] social-custom-scroll overflow-y-auto" style={{ top: `${pos_top + 40}px`, left: `${pos_left}px` }}>
    <CardContent className="!p-1 social-custom-scroll overflow-y-auto">
      {items.map((data, idx) => (
        <Button className="w-full !px-1 flex items-center gap-2 h-auto justify-start" variant={"ghost"} key={idx}>
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </Button>
      ))}
    </CardContent>
  </Card>
}

export const InputSearchResult = ({ items, eleRef, onclick }: { items: SearchResultInterface[], eleRef: React.RefObject<HTMLElement>, onclick: (data: SearchResultInterface) => void }) => {
  const pos_left = eleRef.current?.clientLeft ? eleRef.current?.clientLeft : 0
  const pos_top = eleRef.current?.clientTop ? eleRef.current?.clientTop : 0
  const handleClickEvent = (data: SearchResultInterface) => onclick(data)
  console.log("SearchResultInterface", items);

  return <Card className="!p-1 z-10 absolute min-h-[auto] max-h-[250px] w-[100%] social-custom-scroll overflow-y-auto" style={{ top: `${pos_top + 40}px`, left: `${pos_left}px` }}>
    <CardContent className="!p-1 social-custom-scroll overflow-y-auto">
      {items.map((data, idx) => (
        <Button className="w-full !px-1 flex items-center gap-2 h-auto justify-start" variant={"ghost"} key={idx} onClick={() => handleClickEvent(data)}>
          <Avatar>
            <AvatarImage src={data?.profile_pic} />
            <AvatarFallback className="uppercase">{data.first_name[0]}{data.last_name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start gap-1">
            <span>{data.first_name} {data.last_name}</span>
            <div className="flex items-center">
              <span className="text-xs">{data.email}</span>
            </div>
          </div>
        </Button>
      ))}
    </CardContent>
  </Card>
}

export default ChatConversationHeader