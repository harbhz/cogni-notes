import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import DarkModeToggle from "./DarkModeToggle";
import LogOutButton from "./LogOutButton";
import { getUser } from "@/auth/server";

async function Header() {
  const user = await getUser();

  return (
    <header className="sticky top-0 z-20 flex min-h-[76px] w-full items-center justify-between border-b bg-card/90 px-4 backdrop-blur sm:px-8">
      <Link className="flex items-center gap-3" href="/">
        <Image
          src="/cogni-notes.png"
          height={42}
          width={42}
          alt="logo"
          className="rounded-xl ring-1 ring-border"
          priority
        />

        <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
          Cogni <span className="text-primary">Notes</span>
        </h1>
      </Link>

      <div className="flex items-center gap-2 sm:gap-3">
        {user ? (
          <LogOutButton />
        ) : (
          <>
            <Button asChild>
              <Link href="/sign-up" className="hidden sm:block">
                Sign Up
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
          </>
        )}
        <DarkModeToggle />
      </div>
    </header>
  );
}

export default Header;
