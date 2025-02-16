import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "~/components/ui/breadcrumb"
import { Separator } from "~/components/ui/separator"
import { SidebarTrigger } from "~/components/ui/sidebar"

const ProfilePage = () => {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink>
                  Profile
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <section className="flex flex-1" style={{height: "calc(100% - 4rem)"}}>

      </section>
    </>
  )
}

export default ProfilePage