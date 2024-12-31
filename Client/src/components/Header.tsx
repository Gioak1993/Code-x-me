"use client" ;

import { Button, Navbar, DarkThemeToggle, Badge } from "flowbite-react";
import { useAuth } from "../api/authContext";
import { Link } from 'react-router-dom';

export function Header() {

  const {user, login, logout} = useAuth();

  return (
    <Navbar className="top-0 min-w-full" fluid rounded>
      <Link className="flex" to="/">
        <img src="/owl.svg" className="mr-3 h-6 sm:h-9" alt="CodexME Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          CodexME
        </span>
      </Link>
      <div className="flex p-1 md:order-2">
        <DarkThemeToggle></DarkThemeToggle>
          { user ? (<Button onClick={() => logout() } color="red">Sign Out</Button>) : (<Button onClick={() => login() } color="blue">Sign in</Button>)}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse className="items-center">
        <Link className="dark:text-gray-400" to="/">Home</Link>
        <Link className= "dark:text-gray-400" to="/playground">Playground</Link>
        <div className="flex items-center space-x-1">
        <Link className= "dark:text-gray-400" to="/challenges">Challenges</Link>
        <Badge className="text-xs px-2 py-1 rounded-full" color="info" size="sm" > Beta</Badge>
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
}
