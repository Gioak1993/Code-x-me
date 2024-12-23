import { Button, Navbar, DarkThemeToggle } from "flowbite-react";

export function Header() {
  return (
    <Navbar className="top-0 min-w-full" fluid rounded>
      <Navbar.Brand href="/">
        <img src="/owl.svg" className="mr-3 h-6 sm:h-9" alt="CodexME Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          CodexME
        </span>
      </Navbar.Brand>
      <div className="flex p-1 md:order-2">
        <DarkThemeToggle></DarkThemeToggle>
        <a href="/login">
          <Button color="blue">Sign In</Button>
        </a>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse className="items-center">
        <Navbar.Link href="/">Home</Navbar.Link>
        <Navbar.Link href="/playground">Playground</Navbar.Link>
        <Navbar.Link href="/challenges">Challenges</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
