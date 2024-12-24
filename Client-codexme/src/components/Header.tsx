"use client" ;

import { Button, Navbar, DarkThemeToggle } from "flowbite-react";
import { useAuth } from "../api/authContext";

export function Header() {

  const {user, login, logout} = useAuth();

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
          { user ? (<Button onClick={() => logout() } color="red">Sign Out</Button>) : (<Button onClick={() => login() } color="blue">Sign in</Button>)}
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
