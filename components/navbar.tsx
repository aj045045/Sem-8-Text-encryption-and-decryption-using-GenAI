"use client";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import Link from "next/link";
import { LucideMenu, MessageSquareText, User2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, } from "@/components/ui/drawer";
import { SearchBarComp } from "./search";
import { assetsLinks } from "@/constant/assets-links";
import { pageLinks } from "@/constant/page-links";
import { signOut, useSession } from "next-auth/react";
import { Home } from 'lucide-react';
import { ModeToggle } from "./ui/toggle-theme";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function NavbarComp() {
    const { data: session } = useSession();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const linkStyle = "flex items-center gap-2 px-3 hover:border-b hover:border-b-primary hover:border-b-2 hover:py-1 transition-all duration-200 ";

    useEffect(() => {
        setMounted(true);
    }, []);

    const renderLogo = () => {
        if (!mounted) return null;

        const logo = resolvedTheme === 'dark' ? assetsLinks.logo_dark : assetsLinks.logo_white;

        return (
            <Link
                href={pageLinks.home}
                passHref
                className="flex items-center space-x-2">
                <Image
                    src={logo.src}
                    width={40}
                    height={40}
                    alt={logo.alt}
                    priority
                />
            </Link>
        );
    };

    // NOTE Public links: accessible to all users
    const publicLinks = [
        { href: pageLinks.home, label: "Home", icon: <Home size={18} /> },
    ];

    // NOTE User-specific links
    const userLinks = [
        { href: pageLinks.user.profile, label: "Profile", icon: <User2 size={18} /> },
        { href: pageLinks.user.decrypt_message, label: "Decrypt message", icon: <MessageSquareText size={18} /> },
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
                        {(userLinks).map((link) => (
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
            <nav className="flex items-center justify-between bg-background backdrop-blur-lg w-full border-b border-b-border z-50 h-16 overflow-hidden fixed px-5">
                {/*SECTION - Logo */}
                <div className="flex items-center space-x-4">
                    {renderLogo()}
                    {/*!SECTION */}

                    {/*SECTION - Desktop Menu Bar */}
                    <NavigationMenu className="hidden lg:flex">
                        <NavigationMenuList>
                            <NavigationMenuItem className="group space-x-5 text-sm text-accent-foreground">
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
                                    <ModeToggle />
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
