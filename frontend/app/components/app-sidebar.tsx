import { LogOut, MessageCircle, User2 } from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "./ui/sidebar";
import { useNavigate } from "@remix-run/react";

const items = [
  {
    title: "Chat",
    url: "/chat",
    icon: MessageCircle,
  },

  {
    title: "Profile",
    url: "/profile",
    icon: User2,
  },

  // {
  //   title: "Settings",
  //   url: "#",
  //   icon: Settings,
  // },
]


export function AppSidebar() {
  const navigate = useNavigate();
  const onHandleLickClick = (url: string) => {
    navigate(url);
  }

  const HandleLogout = ()=>{
    try {
      document.cookie = "sessionId" +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      // TODO Handle on the server :0
      window.location.href = "/login"
    } catch (error) {
      console.log("HandleLogout err",error)
    }
  }
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="w-full">
            <span>The Social App</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <button onClick={() => onHandleLickClick(item.url)} >
                      <item.icon />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter >
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button onClick={HandleLogout} >
                <LogOut />
                <span>Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
