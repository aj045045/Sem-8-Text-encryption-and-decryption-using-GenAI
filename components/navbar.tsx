"use client";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import Link from "next/link";
import { Bookmark, CircleEllipsis, LucideMenu } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, } from "@/components/ui/drawer";
import { SearchBarComp } from "./search";
import { assetsLinks } from "@/constant/assets-links";
import { pageLinks } from "@/constant/page-links";
import { signOut, useSession } from "next-auth/react";
import { Home, Search, BookOpen, User, Tag, Mail, Info, LayoutDashboard } from 'lucide-react';

export function NavbarComp() {
    const { data: session } = useSession();
    const linkStyle = "flex items-center gap-2 px-3 hover:border-b hover:border-b-green-500 hover:border-b-2 hover:py-1 hover:text-green-950 transition-all duration-200 ";

    // NOTE Public links: accessible to all users
    const publicLinks = [
        { href: pageLinks.home, label: "Home", icon: <Home size={18} /> },
        { href: pageLinks.search, label: "Search", icon: <Search size={18} /> },
    ];

    const extraPublicLinks = [
        { href: pageLinks.blog, label: "Blog", icon: <BookOpen size={18} /> },
        { href: pageLinks.author, label: "Author", icon: <User size={18} /> },
        { href: pageLinks.tag, label: "Tag", icon: <Tag size={18} /> },
        { href: pageLinks.contact, label: "Contact", icon: <Mail size={18} /> },
        { href: pageLinks.about, label: "About", icon: <Info size={18} /> },
    ];

    // NOTE User-specific links
    const userLinks = [
        { href: pageLinks.user.dashboard, label: "Dashboard", icon: <LayoutDashboard size={18} /> },
        { href: pageLinks.user.bookmarks, label: "Bookmarks", icon: <Bookmark size={18} /> },
    ];

    // NOTE Admin-specific links
    const adminLinks = [
        { href: pageLinks.admin.dashboard, label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    ];

    const navigationLinks = () => {
        return (
            <div className="flex flex-col lg:flex-row items-center md:space-x-2 space-y-5 lg:space-y-0">
                {/* Public Links */}
                {publicLinks.map((link) => (
                    <Link key={link.href} className={linkStyle} href={link.href}>
                        {link.icon}
                        {link.label}
                    </Link>
                ))}

                {/* Authenticated User/Admin Links */}
                {session && session.user && (
                    <>
                        {(session.user ? adminLinks : userLinks).map((link) => (
                            <Link key={link.href} className={linkStyle} href={link.href}>
                                {link.icon}
                                {link.label}
                            </Link>
                        ))}
                    </>
                )}
            </div>
        );
    };


    return (
        <>
            <nav className="flex items-center justify-between bg-background backdrop-blur-lg w-full border-b border-b-border  z-50 h-16 overflow-hidden fixed px-5">
                {/*SECTION - Logo */}
                <div className="flex items-center space-x-4">
                    <Link
                        href={pageLinks.home}
                        passHref
                        className="flex items-center space-x-2"
                    >
                        <Image
                            src={assetsLinks.logo.src}
                            width={40}
                            height={40}
                            alt={assetsLinks.logo.alt}
                        />
                    </Link>
                    {/*!SECTION */}

                    {/*SECTION - Desktop Menu Bar */}
                    <NavigationMenu className="hidden lg:flex">
                        <NavigationMenuList>
                            <NavigationMenuItem className="group space-x-5 text-sm text-green-950">
                                {navigationLinks()}
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                {/*!SECTION */}

                {/*SECTION - Navigation Side View*/}
                <NavigationMenu className="right-0">
                    <NavigationMenuList>
                        <NavigationMenuItem className="group space-x-5 flex-row">
                            {/* Navigation Menu Mobile bar*/}
                            <Drawer>
                                <div className="flex-row flex items-center space-x-2">
                                    <SearchBarComp />
                                    {session ? (
                                        <Button
                                            onClick={() => signOut({ callbackUrl: "/login" })}
                                            variant={"destructive"}
                                        >
                                            Logout
                                        </Button>
                                    ) : (
                                        <>
                                            <Link href={pageLinks.login} passHref>
                                                <Button>Login</Button>
                                            </Link>
                                            <Link href={pageLinks.sign_up} passHref>
                                                <Button
                                                    className="hover:bg-lime-50 hover:text-lime-950"
                                                    variant={"outline"}
                                                >
                                                    Sign Up
                                                </Button>
                                            </Link>
                                        </>
                                    )}
                                    <DrawerTrigger className="flex lg:hidden">
                                        <LucideMenu />
                                    </DrawerTrigger>
                                </div>
                                <DrawerContent className="border-t">
                                    <div className="mx-auto md:w-5/6 w-full overflow-y-scroll no-scrollbar">
                                        <DrawerHeader className="space-y-1">
                                            <DrawerTitle></DrawerTitle>
                                            {navigationLinks()}
                                        </DrawerHeader>
                                        <DrawerFooter>
                                            <DrawerClose></DrawerClose>
                                        </DrawerFooter>
                                    </div>
                                </DrawerContent>
                            </Drawer>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
                {/*!SECTION */}
            </nav>
        </>
    );
}
