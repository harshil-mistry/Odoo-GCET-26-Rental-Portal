"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, PlusCircle, Package } from "lucide-react";

const navItems = [
    { href: "/vendor", label: "Dashboard", icon: LayoutDashboard },
    { href: "/vendor/page", label: "My Products", icon: Package }, // Redirects to dashboard basically
    { href: "/vendor/add-product", label: "Add Product", icon: PlusCircle },
];

export function VendorSidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 border-r border-border bg-card h-full p-4 flex flex-col">
            <div className="mb-8 px-2">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary-foreground bg-clip-text text-transparent">
                    Vendor Portal
                </h2>
            </div>
            <nav className="space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md transition-all",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon size={18} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
