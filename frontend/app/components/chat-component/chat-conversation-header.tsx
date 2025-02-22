import { List, Search, X } from "lucide-react"
import React, { useRef, useState } from "react"
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface SearchResultInterface {
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

const tempData: SearchResultInterface[] = [
  {
    "_id": "67b8c915b7008df62b574a87",
    "email": "manoj.kunwar@repushti.com",
    "created_at": "2025-02-21T18:42:29.090Z",
    "updated_at": "2025-02-21T18:42:29.090Z",
    "first_name": "manoj",
    "phone_no": "9930440542",
    "last_name": "kunwar",
    "user_name": "manoj.kunwar58105",
    profile_pic: "https://github.com/shadcn.png",

  },
  {
    "_id": "67b8c915b7008df62b574a87",
    "email": "manoj.kunwar@repushti.com",
    "created_at": "2025-02-21T18:42:29.090Z",
    "updated_at": "2025-02-21T18:42:29.090Z",
    "first_name": "manoj",
    "phone_no": "9930440542",
    "last_name": "kunwar",
    "user_name": "manoj.kunwar58105",
    profile_pic: "https://github.com/shadcn.png",

  },
  {
    "_id": "67b8c915b7008df62b574a87",
    "email": "manoj.kunwar@repushti.com",
    "created_at": "2025-02-21T18:42:29.090Z",
    "updated_at": "2025-02-21T18:42:29.090Z",
    "first_name": "manoj",
    "phone_no": "9930440542",
    "last_name": "kunwar",
    "user_name": "manoj.kunwar58105",
    profile_pic: "https://github.com/shadcn.png",

  },
  {
    "_id": "67b8c915b7008df62b574a87",
    "email": "manoj.kunwar@repushti.com",
    "created_at": "2025-02-21T18:42:29.090Z",
    "updated_at": "2025-02-21T18:42:29.090Z",
    "first_name": "manoj",
    "phone_no": "9930440542",
    "last_name": "kunwar",
    "user_name": "manoj.kunwar58105",
    profile_pic: "https://github.com/shadcn.png",

  },
  {
    "_id": "67b8c915b7008df62b574a87",
    "email": "manoj.kunwar@repushti.com",
    "created_at": "2025-02-21T18:42:29.090Z",
    "updated_at": "2025-02-21T18:42:29.090Z",
    "first_name": "manoj",
    "phone_no": "9930440542",
    "last_name": "kunwar",
    "user_name": "manoj.kunwar58105",
    profile_pic: "https://github.com/shadcn.png",

  },
  {
    "_id": "67b8c915b7008df62b574a87",
    "email": "manoj.kunwar@repushti.com",
    "created_at": "2025-02-21T18:42:29.090Z",
    "updated_at": "2025-02-21T18:42:29.090Z",
    "first_name": "manoj",
    "phone_no": "9930440542",
    "last_name": "kunwar",
    "user_name": "manoj.kunwar58105",
    profile_pic: "https://github.com/shadcn.png",

  },
  {
    "_id": "67b8c915b7008df62b574a87",
    "email": "manoj.kunwar@repushti.com",
    "created_at": "2025-02-21T18:42:29.090Z",
    "updated_at": "2025-02-21T18:42:29.090Z",
    "first_name": "manoj",
    "phone_no": "9930440542",
    "last_name": "kunwar",
    "user_name": "manoj.kunwar58105",
    profile_pic: "https://github.com/shadcn.png",
  },
]

const ChatConversationHeader = () => {
  const inputRef = useRef(null)
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchResult, setSearchResults] = useState<SearchResultInterface[]>(tempData);
  const handleToggleSearch = () => setShowSearch(!showSearch)
  const handleSearchUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      console.log("e", e.target.value)
    } catch (error) {
      console.log("Error handleSearchUser", error)
    }
  }
  const HandleOnSelectSearch = (data: unknown) => {
    console.log("data ", data)
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
          <Input placeholder="Search Users" onInput={handleSearchUser} ref={inputRef} />
          <X onClick={handleToggleSearch} className="cursor-pointer" />
          <InputSearchResult items={searchResult} eleRef={inputRef} onclick={HandleOnSelectSearch} />
        </div>
      }
    </>
  )
}


export const InputSearchResult = ({ items, eleRef, onclick }: { items: SearchResultInterface[], eleRef: React.RefObject<HTMLElement>, onclick: (data: unknown) => void }) => {
  const pos_left = eleRef.current?.clientLeft ? eleRef.current?.clientLeft : 0
  const pos_top = eleRef.current?.clientTop ? eleRef.current?.clientTop : 0
  const handleClickEvent = (data: SearchResultInterface) => onclick(data)
  console.log("SearchResultInterface", items);

  return <Card className="!p-1 z-10 absolute h-[250px] w-[250px] social-custom-scroll overflow-y-auto" style={{ top: `${pos_top + 40}px`, left: `${pos_left}px` }}>
    <CardContent className="!p-1 social-custom-scroll overflow-y-auto">
      {items.map((data, idx) => (
        <Button className="w-full flex items-center gap-2 h-auto justify-between" variant={"ghost"} key={idx} onClick={() => handleClickEvent(data)}>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span>{data.user_name}</span>
        </Button>
      ))}
    </CardContent>
  </Card>
}

export default ChatConversationHeader