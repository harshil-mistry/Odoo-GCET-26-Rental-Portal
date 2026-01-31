"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useEffect, useState } from "react";
import { IUser } from "@/types";
import { Loader2, LogOut, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function Navbar() {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const res = await fetch("/api/auth/me");
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            }
        } catch (error) {
            console.error("Auth check failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        // We need a logout API to clear cookie
        // Implementation: simple fetch to /api/auth/logout which we need to make or just expire cookie here?
        // HTTPOnly cookie can only be cleared by server.
        // I'll assume we'll make a logout route or simple expire trick if possible, but route is better.
        // Let's create the route next.
        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
        router.push("/");
        router.refresh();
    };

    return (
        <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50 rounded-full border border-border/40 bg-background/80 backdrop-blur-md shadow-sm px-6 py-3 flex items-center justify-between transition-all hover:shadow-md hover:border-primary/20">
            <Link href="/" className="font-bold text-xl tracking-tight bg-gradient-to-r from-primary to-secondary-foreground bg-clip-text text-transparent">
                SmartRent
            </Link>

            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
                <Link href="/browse" className="hover:text-primary transition-colors">Browse</Link>
                <Link href="/about" className="hover:text-primary transition-colors">How it works</Link>
            </div>

            <div className="flex items-center gap-3">
                <ThemeToggle />

                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : user ? (
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium hidden sm:block">Hi, {user.name}</span>
                        {user.role === 'admin' && <Link href="/admin"><Button size="sm" variant="outline">Admin</Button></Link>}
                        {user.role === 'vendor' && <Link href="/vendor"><Button size="sm" variant="outline">Dashboard</Button></Link>}
                        <Button size="sm" variant="ghost" onClick={handleLogout} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <LogOut size={16} />
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Link href="/login">
                            <Button variant="ghost" size="sm">Log in</Button>
                        </Link>
                        <Link href="/signup">
                            <Button size="sm" className="rounded-full px-5">Sign Up</Button>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
