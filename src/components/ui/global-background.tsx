"use client";

import { useTheme } from "next-themes";
// Removed useState and useEffect imports

export const GlobalBackground = () => {
    // Removed mounted state and useEffect hook
    const { theme } = useTheme(); // Keep useTheme as it's still used for dark mode classes

    // Removed if (!mounted) return null;

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden h-full w-full">
            {/* Background Base Color */}
            <div className="absolute inset-0 bg-background transition-colors duration-500" />

            {/* Grid Pattern (Subtle technical feel) */}
            <div
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]"
                style={{
                    backgroundImage: `linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Gradient Orbs - Animated via CSS or simple positioning */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px] mix-blend-multiply dark:bg-purple-900/20 dark:mix-blend-normal animate-pulse-slow" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-500/20 blur-[120px] mix-blend-multiply dark:bg-pink-900/20 dark:mix-blend-normal animate-pulse-slow delay-1000" />

            {/* Center spotlight hint */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-blue-500/5 blur-[150px] mix-blend-multiply dark:bg-blue-900/10 dark:mix-blend-normal" />
        </div>
    );
};
