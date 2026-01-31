"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItem {
    label: string;
    href: string;
    icon?: React.ReactNode;
}

interface FloatingNavProps {
    items: NavItem[];
    rightSlot?: React.ReactNode; // For auth buttons, theme toggle, etc.
    className?: string;
    logoHref?: string;
}

export const FloatingNav = ({
    items,
    rightSlot,
    className,
    logoHref = "/",
}: FloatingNavProps) => {
    const pathname = usePathname();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Animation variants
    const navVariants: Variants = {
        hidden: { y: -100, opacity: 0, x: "-50%" },
        visible: {
            y: 0,
            opacity: 1,
            x: "-50%",
            transition: {
                type: "spring",
                stiffness: 260,
                damping: 20
            }
        },
    };

    return (
        <AnimatePresence mode="wait">
            <motion.nav
                initial="hidden"
                animate="visible"
                variants={navVariants}
                className={cn(
                    "fixed top-4 left-1/2 z-50 flex items-center justify-between px-6 py-3",
                    "w-[95%] max-w-5xl rounded-full border border-border/40",
                    "bg-background/70 backdrop-blur-xl shadow-lg hover:shadow-xl transition-shadow duration-300",
                    className
                )}
            >
                {/* Logo */}
                <Link
                    href={logoHref}
                    className="font-bold text-xl tracking-tight bg-gradient-to-r from-primary to-secondary-foreground bg-clip-text text-transparent mr-8"
                >
                    SmartRent
                </Link>

                {/* Nav Items */}
                <div className="flex items-center justify-center gap-2 flex-1">
                    {items.map((item, idx) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                            <Link
                                key={idx}
                                href={item.href}
                                className={cn(
                                    "relative px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                                    isActive ? "text-primary" : "text-muted-foreground"
                                )}
                                onMouseEnter={() => setHoveredIndex(idx)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {item.icon}
                                    {item.label}
                                </span>

                                {/* Hover Background Animation */}
                                {hoveredIndex === idx && (
                                    <motion.span
                                        className="absolute inset-0 z-0 bg-muted/60 rounded-full"
                                        layoutId="hoverBackground"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1, transition: { duration: 0.15 } }}
                                        exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
                                    />
                                )}

                                {/* Active Indicator */}
                                {isActive && (
                                    <motion.span
                                        layoutId="activeIndicator"
                                        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                                    />
                                )}

                            </Link>
                        );
                    })}
                </div>

                {/* Right Slot (Auth, Theme Toggle) */}
                <div className="flex items-center gap-4 pl-4 border-l border-border/50 ml-4">
                    {rightSlot}
                </div>
            </motion.nav>
        </AnimatePresence>
    );
};
