'use client'
import { Navbar, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import { useRouter, usePathname } from "next/navigation";

const Nav = () => {
    const router = useRouter();
    const pathName = usePathname();
    const navItems = [
        {
            label : 'Home',
            href : '/'
        },

        {
            label : 'Points table',
            href : '/points'
        },

        {
            label : 'Match Schedule',
            href : '/schedule'
        }
    ]
  
    return (
    <Navbar fluid rounded>
      <NavbarToggle />
      <NavbarCollapse>
        {
            navItems.map(item => {
                const isActive = pathName === item.href;
                
                return (
                <NavbarLink 
                    key={item.href}
                    href="#"
                    active={isActive}
                    onClick={(e) => {
                        e.preventDefault();
                        router.push(item.href);
                    }}
                >
                    {item.label}
                </NavbarLink>)
            })
        }
      </NavbarCollapse>
    </Navbar>
  );
}

export default Nav;