import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";


const target = { protocol: "http", host: "localhost:3000", proxy_url: "/backend" };

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  url.protocol = target.protocol;
  url.host = target.host;

  return await fetch(
    url.toString(),
    new Request(request, { redirect: "manual" }),
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url);
  url.protocol = target.protocol;
  url.host = target.host;
  console.log('href', url.href);
  url.pathname = url.pathname.replace(`${target.proxy_url}`, "");

  
  return await fetch(
    url.toString(),
    new Request(request, { redirect: "manual" }),
  );
}