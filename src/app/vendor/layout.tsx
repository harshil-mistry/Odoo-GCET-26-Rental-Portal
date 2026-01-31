"use client";

import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { FloatingNav } from "@/components/ui/floating-nav";
import { LayoutDashboard, PlusCircle, Package, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IUser } from "@/types";

export default function VendorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [user, setUser] = useState<IUser | null>(null);

    useEffect(() => {
        // Simple auth check or relying on middleware?
        // Middleware handles protection, but we need user info for "Hi, User"
        fetch("/api/auth/me").then(r => r.json()).then(d => setUser(d.user));
    }, []);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/");
        router.refresh();
    };

    const vendorLinks = [
        { href: "/vendor", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
        { href: "/vendor/add-product", label: "Add Product", icon: <PlusCircle size={16} /> },
    ];

    const rightSlot = (
        <div className="flex items-center gap-3">
            <ThemeToggle />
            {user && <span className="text-sm font-medium">Hi, {user.name}</span>}
            <Button size="sm" variant="ghost" onClick={handleLogout} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                <LogOut size={16} />
            </Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-background/95 text-foreground pt-24 selection:bg-pink-500/30">
            {/* Background Texture */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />

            <FloatingNav items={vendorLinks} rightSlot={rightSlot} logoHref="/vendor" />

            <main className="container mx-auto px-4 pb-10">
                {children}
            </main>
        </div>
    );
}
