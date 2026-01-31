"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    User,
    LogOut,
    Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function UserDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [userInfo, setUserInfo] = useState<{ name: string, email: string } | null>(null);

    useEffect(() => {
        // Basic User Check
        fetch("/api/auth/me").then(async (res) => {
            if (res.ok) {
                const data = await res.json();
                if (!data.user) router.push("/login");
                else setUserInfo(data.user);
            } else {
                router.push("/login");
            }
        });
    }, [router]);

    const sidebarLinks = [
        { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
        { label: "My Rentals", icon: ShoppingBag, href: "/dashboard/orders" },
        { label: "Profile", icon: User, href: "/dashboard/profile" },
    ];

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/");
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar - Desktop */}
            <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col sticky top-0 h-screen">
                <div className="p-6 border-b border-border">
                    <Link href="/">
                        <h1 className="text-2xl font-serif font-black tracking-tighter bg-gradient-to-tr from-primary to-purple-500 bg-clip-text text-transparent">
                            SmartRent
                        </h1>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {sidebarLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link key={link.href} href={link.href}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={`w-full justify-start gap-3 ${isActive ? 'bg-primary/10 text-primary hover:bg-primary/15' : 'text-muted-foreground'}`}
                                >
                                    <Icon size={18} />
                                    {link.label}
                                </Button>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-border space-y-4">
                    {userInfo && (
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                {userInfo.name.charAt(0)}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium truncate">{userInfo.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{userInfo.email}</p>
                            </div>
                        </div>
                    )}
                    <div className="flex gap-2">
                        <ThemeToggle />
                        <Button variant="ghost" className="flex-1 justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
                            <LogOut size={16} /> Logout
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-screen relative scroll-smooth">
                {/* Mobile Header */}
                <header className="md:hidden h-16 border-b border-border flex items-center justify-between px-4 bg-background/80 backdrop-blur-md sticky top-0 z-50">
                    <Link href="/">
                        <span className="font-serif font-bold text-xl">SmartRent</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Button variant="ghost" size="sm">
                            <Menu size={18} />
                        </Button>
                    </div>
                </header>

                <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
}
