import {
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";

import { PreventFlashOnWrongTheme, ThemeProvider, useTheme } from "remix-themes"
import { themeSessionResolver } from "./sessions.server";
import clsx from "clsx";
import "./tailwind.css"
import GlobalLoading from "./components/global-loading";
import { Toaster } from "./components/ui/sonner";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];


export async function loader({ request }: LoaderFunctionArgs) {
  const { getTheme } = await themeSessionResolver(request)
  try {
    const fetch_resp = await fetch(`${process.env.backend_url}/api/v1/check/token`, {
      method: "GET",
      headers: {
        "Cookie": request.headers.get("Cookie") ?? ""
      }
    })

    const token_resp = await fetch_resp.json()
    const url = new URL(request?.url)
    console.log("fetch_resp", fetch_resp, url);
    if (token_resp?.authenticated) {
      console.log("token_resp", token_resp?.authenticated);
      if ((["/login", "/register"].includes(url.pathname))) {
        return redirect('/chat')
      }
    } else {
      if (!(["/login", "/register"].includes(url.pathname))) {
        return redirect('/login')
      }
    }
    return {
      theme: getTheme(),
    }
  } catch (error) {
    console.log("Error on loading", error)
    return {
      theme: getTheme(), 
    }
  }
}

// export function Layout({ children }: { children: React.ReactNode }) {
//   const data = useLoaderData<typeof loader>()
//   const [theme] = useTheme()
//   console.log("theme", theme);
//   return (
//     <html lang="en">
//       <head>
//         <meta charSet="utf-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <Meta />
//         <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
//         <Links />
//       </head>
//       <body>
//         <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
//           {children}
//         </ThemeProvider>
//         <ScrollRestoration />
//         <Scripts />
//       </body>
//     </html>
//   );
// }

// export default function App() {
//   return <Outlet />;
// }

// export async function loader({ request }: LoaderFunctionArgs) {
//   const cookies = request.headers.get("Cookie");
//   console.log('cookies', cookies);

//   // const checkAuth = await fetch() 
//   return Response.json({

//   })
// }


export function App() {
  const data = useLoaderData<typeof loader>()
  const [theme] = useTheme()
  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <title>Social App</title>
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
      </head>
      <body className="absolute min-w-full flex flex-col h-full">
        <GlobalLoading />
        <Outlet />
        <Toaster closeButton={true} />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>()
  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <App />
    </ThemeProvider>
  )
}
