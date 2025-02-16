import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

const ChatListItem = () => {
  return (
    <div className="flex w-full border-b gap-3 p-2">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex flex-col w-full">
        <div className="flex justify-between w-full">
          <p>Manoj</p>
          <p className="text-xs">10 / 12</p>
        </div>
        <p className="text-sm">
          Some msg
        </p>
      </div>
    </div>
  )
}

export default ChatListItem