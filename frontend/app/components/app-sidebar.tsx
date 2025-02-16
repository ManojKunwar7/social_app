import { MessageCircle, User2 } from "lucide-react"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from "./ui/sidebar";
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
      <SidebarRail />
    </Sidebar>
  )
}
