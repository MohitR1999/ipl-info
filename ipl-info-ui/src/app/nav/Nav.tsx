'use client'
import { Navbar } from "flowbite-react";
import { useRouter, usePathname } from "next/navigation";

import {
    Button,
    Drawer,
    DrawerHeader,
    DrawerItems,
    Sidebar,
    SidebarItem,
    SidebarItemGroup,
    SidebarItems,
} from "flowbite-react";
import { useState } from "react";
import {
    HiMenu,
    HiHome,
    HiTable,
    HiCalendar
} from "react-icons/hi";


const Nav = () => {

    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathName = usePathname();
    const navItems = [
        {
            label: 'Home',
            href: '/',
            icon: () => <HiHome />
        },
        {
            label: 'Points table',
            href: '/points',
            icon: () => <HiTable />
        },
        {
            label: 'Match Schedule',
            href: '/schedule',
            icon: () => <HiCalendar />
        }
    ]

    const handleClose = () => setIsOpen(false);

    return (
        <>
            <Navbar fluid style={{
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                position: 'fixed', // Fixes the Navbar at the top
                top: 0, // Aligns it to the top
                left: 0, // Aligns it to the left
                zIndex: 1000, // Ensures it stays above other elements
                backdropFilter: 'blur(10px)',
                width: '100%', 
                WebkitBackdropFilter: 'blur(10px)',
            }}>
                <Button color="dark" style={{
                    padding: 10,
                    borderRadius: 300,
                    backgroundColor: 'rgba(0, 0, 0, 0)'
                }} onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(!isOpen);
                }}>
                    <HiMenu className="h-6 w-6" />
                </Button>
                <Drawer open={isOpen} onClose={handleClose} style={{
                }}>
                    <DrawerHeader title="MENU" titleIcon={() => <></>} />
                    <DrawerItems>
                        <Sidebar
                            aria-label="Sidebar with multi-level dropdown example"
                            className="[&>div]:bg-transparent [&>div]:p-0"
                        >
                            <div className="flex h-full flex-col justify-between py-2">
                                <div>
                                    <SidebarItems>
                                        <SidebarItemGroup>
                                            {
                                                navItems.map(item => {
                                                    const isActive = pathName === item.href;

                                                    return (
                                                        <SidebarItem
                                                            key={item.href}
                                                            href="#"
                                                            active={isActive}
                                                            icon={item.icon}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                router.push(item.href);
                                                                setIsOpen(false);
                                                            }}
                                                        >
                                                            {item.label}
                                                        </SidebarItem>
                                                    );
                                                })
                                            }
                                        </SidebarItemGroup>
                                    </SidebarItems>
                                </div>
                            </div>
                        </Sidebar>
                    </DrawerItems>
                </Drawer>
            </Navbar>

        </>
    );
}

export default Nav;



