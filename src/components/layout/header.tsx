import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-transparent absolute top-0 left-0 right-0 z-20">
      <Link className="flex items-center justify-center" href="/">
        <Logo />
        <span className="sr-only">CoreMeet AI</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Button variant="ghost" asChild>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/login"
          >
            Login
          </Link>
        </Button>
        <Button asChild>
          <Link
            href="/signup"
          >
            Get Started
          </Link>
        </Button>
      </nav>
    </header>
  );
}
