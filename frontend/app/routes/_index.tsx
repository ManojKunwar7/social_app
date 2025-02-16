import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { buttonVariants } from "~/components/ui/button";
import { ModeToggleBtn } from "~/components/mode-toggle";

export const meta: MetaFunction = () => {
  return [
    { title: "Social App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="flex items-center gap-2">
      <ModeToggleBtn />
      <Link to={`/login`} className={buttonVariants({ variant: "link" })}>Login</Link>
      <Link to={`/Register`} className={buttonVariants({ variant: "link" })}>Register</Link>
    </div>
  );
}

