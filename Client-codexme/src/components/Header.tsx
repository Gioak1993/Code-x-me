
import { Button, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle, DarkThemeToggle } from "flowbite-react";


export function Header() {
    return (
        <Navbar className="top-0 min-w-full" fluid rounded>
        <NavbarBrand href="https://flowbite-react.com">
            {/* <img src="/favicon.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" /> */}
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">CodexME</span>
        </NavbarBrand>
        <div className="flex md:order-2 p-1">
            <DarkThemeToggle></DarkThemeToggle>
            <Button>Get started</Button>
            <NavbarToggle />
        </div>
        <NavbarCollapse>
            <NavbarLink href="/" active>
            Home
            </NavbarLink>
            <NavbarLink href="/playground">Playground</NavbarLink>
            <NavbarLink href="#">Challenges</NavbarLink>
        </NavbarCollapse>
        </Navbar>
    );
    }