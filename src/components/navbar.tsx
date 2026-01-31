"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useEffect, useState } from "react";
import { IUser } from "@/types";
import { Loader2, LogOut, ShoppingCart } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { FloatingNav } from "@/components/ui/floating-nav";
import { useCart } from "@/context/cart-context";

export function Navbar() {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();
    const { openCart, cartCount } = useCart();

    // Hide Navbar on dashboard routes

    useEffect(() => {
        checkUser();
    }, [pathname]);

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
        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
        router.push("/");
        router.refresh();
    };

    const publicLinks = [
        { label: "Browse", href: "/browse" },
        { label: "How it works", href: "/about" },
    ];

    const rightSlot = (
        <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={openCart} className="h-9 w-9 p-0 relative rounded-full hover:bg-muted">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center rounded-full animate-bounce-subtle">
                        {cartCount}
                    </span>
                )}
            </Button>
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
    );

    // Hide Navbar on dashboard routes
    if (pathname.startsWith("/vendor") || pathname.startsWith("/admin")) {
        return null;
    }

    return <FloatingNav items={publicLinks} rightSlot={rightSlot} />;
}
