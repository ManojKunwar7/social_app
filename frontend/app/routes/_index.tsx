import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, redirect } from "@remix-run/react";
import { buttonVariants } from "~/components/ui/button";
import { ModeToggleBtn } from "~/components/mode-toggle";


export const meta: MetaFunction = () => {
  return [
    { title: "Social App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const fetch_resp = await fetch(`${process.env.backend_url}/api/v1/check/token`, {
      method: "GET",
      headers: {
        "Cookie": request.headers.get("Cookie") ?? ""
      }
    })

    const token_resp = await fetch_resp.json()
    console.log("fetch_resp", fetch_resp, request?.url);
    if (token_resp?.authenticated) {
      console.log("token_resp", token_resp?.authenticated);
      if ((["/login", "/register"].includes(request?.url))) {
        return redirect('/chat')
      }
    } else {
      if (!(["/login", "/register"].includes(request?.url))) {
        return redirect('/login')
      }
    }
    return Response.json({})
  } catch (error) {
    console.log("Error on loading", error)
  }
}


export default function Index() {
  return (
    <div className="flex items-center gap-2">
      <ModeToggleBtn />
      <Link to={`/login`} className={buttonVariants({ variant: "link" })}>Login</Link>
      <Link to={`/Register`} className={buttonVariants({ variant: "link" })}>Register</Link>
    </div>
  );
}

