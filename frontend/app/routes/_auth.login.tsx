import { Button, buttonVariants } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Link } from "@remix-run/react"
import { SyntheticEvent } from "react"
import axios from "axios"
import { toast } from "sonner"
import { Ban, Check } from "lucide-react"

interface loginpayload {
  email: string | undefined,
  password: string | undefined
}


export default function Login() {

  const onSubmitHandler = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    try {
      e.preventDefault()
      const formdata = new FormData(e.currentTarget)
      const payload: loginpayload = {
        email: formdata.get('email')?.toString(),
        password: formdata.get('password')?.toString(),
      }
      const axios_payload = {
        headers: { 'Content-Type': "application/json" },
        data: payload,
        method: "POST",
        url: `/backend/api/v1/login`
      }
      const loginResp = await axios(axios_payload)
      console.log("loginResp", loginResp);
      if (!loginResp.data?.Status) {
        toast.error(loginResp.data?.C_msg, {
          position: "top-right",
          icon: <Ban />,
          richColors: true
        })
        return
      }
      toast.success(loginResp.data?.C_msg, {
        position: "top-right",
        icon: <Check />,
        richColors: true
      })
      setTimeout(()=>{
      window.location.href = '/chat'
      },1000)
    } catch (error) {
      console.log("Register Error", error);
    }
  }
  return (
    <>
      <Card className="w-[30%]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Login into your account!</CardDescription>
        </CardHeader>
        <form onSubmit={onSubmitHandler}>
          <CardContent className="!pb-2">
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-col gap-2 w-full">
                <Label>Email</Label>
                <Input name="email" type="email" placeholder="Enter Email" required />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <Label>Password</Label>
                <Input name="password" type="password" placeholder="Enter Password" required />
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Label htmlFor="create-an-account" className="!text-[12px]">Don&apos;t have an account?</Label>
              <Link to={`/register`} id="create-an-account" className={buttonVariants({ variant: "link" }) + " m-0 !text-[12px] !p-0"}>Create an account</Link>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex items-center gap-4">
              <Button variant="default" type="submit">Login</Button>
              <Button variant="outline" type="reset">Reset</Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </>
  )
}
