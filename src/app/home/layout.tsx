'use client'

import { ReactNode, useEffect, useState } from "react";
import { CalendarDays, User, UserCog, LogOut } from 'lucide-react';
import { NavLink } from "@/components/ui/NavLink";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useUser } from "@/context/UserContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    // DropdownMenuLabel,
    // DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { coachMockUser, studentMockUser } from "@/constants/users";
  import { useRouter } from "next/navigation";
  import { useRedirectIfNoUser } from "../hooks/useRedirectIfNoUser";

export default function Layout({ children }: { children: ReactNode }) {
    const { user, setUser } = useUser();
    const router = useRouter();
    useRedirectIfNoUser();

    const handleChange = () => {
        const switchUser = user?.role === 'coach' ? studentMockUser : coachMockUser;
        setUser(switchUser);
    }

    const handleLogout = () => {
        setUser(null);
    }

    useEffect(() =>{
        if (user) router.push("/home")
    },[user])

    return (
        <>
        <header className="flex py-2 border container bg-card">
            <nav className="container flex items-center gap-6">
                <div className="flex items-center gap-2 mr-auto">
                    <CalendarDays className="size-6"/>
                    <span>Scheduly</span>
                </div>

                <NavLink href="/bookings">Appointments</NavLink>
                {user?.role === 'coach' ? <NavLink href={`/schedule?userId=${user?.id}`}>Availability</NavLink> : null}
                {user?.role === 'student' ? <NavLink href="/slots">Schedule</NavLink> : null}

                <div className="ml-auto flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Switch id="switch-role" checked={user?.role === 'coach'} onCheckedChange={handleChange}/>
                        <Label htmlFor="switch-role"> Switch Role </Label>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="outline">{user?.role === 'coach' ? <UserCog className="size-6"/> : <User className="size-6" /> }{user?.name} | {user?.role}</Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-50">
                            {/* <DropdownMenuSeparator /> */}
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut />
                                <span>Log out</span>
                                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </nav>
        </header>
        <main className="container my-6">{children}</main>
        </>
    )
}