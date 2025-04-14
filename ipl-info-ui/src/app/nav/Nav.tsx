'use client'
import { Navbar, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import { useRouter } from "next/navigation";

const Nav = () => {
    const router = useRouter();
  
    return (
    <Navbar fluid rounded>
      <NavbarToggle />
      <NavbarCollapse>
        <NavbarLink href="#" onClick={() => router.push("/")}>
          Home
        </NavbarLink>
        <NavbarLink href="#" onClick={() => router.push("/points")}>Points table</NavbarLink>
        <NavbarLink href="#" onClick={() => router.push("/schedule")}>Match Schedule</NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}

export default Nav;