"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useEffect, useState, useRef } from "react";
import { IUser } from "@/types";
import { Loader2, ShoppingCart, LayoutDashboard, ShoppingBag, LogOut, ChevronDown, Store, Shield, FileText } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { FloatingNav } from "@/components/ui/floating-nav";
import { useCart } from "@/context/cart-context";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { openCart, cartCount } = useCart();
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
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
        checkUser();
    }, [pathname]);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
        router.push("/");
        router.refresh();
    };

    const navLinks = user ? [
        { label: "Dashboard", href: "/dashboard" },
        { label: "My Orders", href: "/dashboard/orders" },
        { label: "Invoices", href: "/dashboard?tab=invoices" },
        { label: "Browse", href: "/browse" },
    ] : [
        { label: "Browse", href: "/browse" },
        { label: "About", href: "/about" },
    ];

    const rightSlot = (
        <div className="flex items-center gap-2 sm:gap-4">
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
                <div className="relative" ref={menuRef}>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 pl-2 pr-1 rounded-full border border-border/50 hover:bg-muted/50"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-purple-500 text-[10px] font-bold text-white flex items-center justify-center">
                            {user.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium hidden sm:block max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                        <ChevronDown size={14} className={`text-muted-foreground transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                    </Button>

                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.1 }}
                                className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
                            >
                                <div className="p-3 border-b border-border bg-muted/30">
                                    <p className="font-medium text-sm truncate">{user.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                </div>
                                <div className="p-1">
                                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                                        <div className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors">
                                            <LayoutDashboard size={16} /> Dashboard
                                        </div>
                                    </Link>
                                    <Link href="/dashboard/orders" onClick={() => setIsMenuOpen(false)}>
                                        <div className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors">
                                            <ShoppingBag size={16} /> My Orders
                                        </div>
                                    </Link>
                                    <Link href="/dashboard?tab=invoices" onClick={() => setIsMenuOpen(false)}>
                                        <div className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors">
                                            <FileText size={16} /> My Invoices
                                        </div>
                                    </Link>
                                    {user.role === 'vendor' && (
                                        <>
                                            <Link href="/vendor" onClick={() => setIsMenuOpen(false)}>
                                                <div className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors text-blue-600 dark:text-blue-400">
                                                    <Store size={16} /> Vendor Dashboard
                                                </div>
                                            </Link>
                                            <Link href="/vendor?tab=invoices" onClick={() => setIsMenuOpen(false)}>
                                                <div className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors text-blue-600 dark:text-blue-400">
                                                    <FileText size={16} /> Vendor Invoices
                                                </div>
                                            </Link>
                                        </>
                                    )}
                                    {user.role === 'admin' && (
                                        <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                                            <div className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors text-red-600 dark:text-red-400">
                                                <Shield size={16} /> Admin Panel
                                            </div>
                                        </Link>
                                    )}
                                </div>
                                <div className="p-1 border-t border-border">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-destructive/10 hover:text-destructive cursor-pointer transition-colors text-red-500"
                                    >
                                        <LogOut size={16} /> Log out
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
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

    return <FloatingNav items={navLinks} rightSlot={rightSlot} />;
}
