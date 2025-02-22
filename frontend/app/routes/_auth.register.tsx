import { Button, buttonVariants } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import { Link } from "@remix-run/react"
import { SyntheticEvent } from "react"
import axios from "axios"
import { toast } from "sonner"
import { Ban, Check } from "lucide-react"

interface RegisterPayload {
  first_name: string | undefined,
  last_name: string | undefined,
  email: string | undefined,
  phone_no: string | undefined,
  password: string | undefined,
  confirm_password: string | undefined,
}

export default function Register() {
  const onSubmitHandler = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    try {
      e.preventDefault()
      const formdata = new FormData(e.currentTarget)
      const payload: RegisterPayload = {
        first_name: formdata.get('first_name')?.toString(),
        last_name: formdata.get('last_name')?.toString(),
        email: formdata.get('email')?.toString(),
        phone_no: formdata.get('phone_no')?.toString(),
        password: formdata.get('password')?.toString(),
        confirm_password: formdata.get('confirm_password')?.toString(),
      }
      const axios_payload = {
        headers: { 'Content-Type': "application/json" },
        data: payload,
        method: "POST",
        url: `/backend/api/v1/register`
      }
      const registerResp = await axios(axios_payload)
      console.log("registerResp", registerResp.data);
      if (!registerResp.data?.Status) {
        toast.error(registerResp.data?.C_msg, {
          position: "top-right",
          icon: <Ban />,
          richColors: true
        })
        return
      }
      toast.success(registerResp.data?.C_msg, {
        position: "top-right",
        icon: <Check />,
        richColors: true
      })
    } catch (error) {
      console.log("Register Error", error);
    }
  }
  return (
    <>
      <Card className="w-[30%]">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Register your account!</CardDescription>
        </CardHeader>
        <form id="register-form" onSubmit={onSubmitHandler}>
          <CardContent className="!pb-2">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 w-full">
                <div className="flex flex-col gap-2 w-full">
                  <Label>First Name</Label>
                  <Input name="first_name" type="text" placeholder="Enter your First Name" required />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <Label>Last Name</Label>
                  <Input name="last_name" type="text" placeholder="Enter your Last Name" required />
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <Label>Email</Label>
                <Input name="email" type="email" placeholder="Enter your Email" required />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <Label>Phone No.</Label>
                <Input name="phone_no" type="tel" placeholder="Enter your Phone No." required />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <Label>Password</Label>
                <Input name="password" type="password" placeholder="Enter your Password" required />
              </div>
              <div className="flex flex-col gap-2 w-full">
                <Label>Confirm Password</Label>
                <Input name="confirm_password" type="password" placeholder="Enter your Password" required />
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <span className="!text-[12px]">Already have an account?</span>
              <Link to={`/login`} className={buttonVariants({ variant: "link" }) + " m-0 !text-[12px] !p-0"}>login</Link>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex items-center gap-4">
              <Button variant="default" type="submit">Register</Button>
              <Button variant="outline" type="reset">Reset</Button>
            </div>
          </CardFooter>
        </form>

      </Card>
    </>
  )
}
