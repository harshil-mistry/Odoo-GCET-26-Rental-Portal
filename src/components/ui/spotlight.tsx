"use client";
import React from "react";
import { cn } from "@/lib/utils";

type SpotlightProps = {
    className?: string;
    fill?: string;
};

export function Spotlight({ className, fill = "white" }: SpotlightProps) {
    return (
        <svg
            className={cn(
                "animate-spotlight pointer-events-none absolute z-[1]  h-[169%] w-[138%] lg:w-[84%] opacity-0",
                className
            )}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 3787 2842"
            fill="none"
        >
            <g filter="url(#filter0_f_29_215)">
                <path
                    fillOpacity="0.21"
                    d="M208.672 2868.39C74.8872 2808.58 -4.82136 2616.63 7.55129 2077.34C19.9239 1538.05 411.233 1339.77 1515.65 1461.35C2620.07 1582.94 2861.94 1530.13 3259.08 1162.97C3656.22 795.807 3862.66 845.241 3704.14 1354.91C3545.62 1864.58 2908.56 2111.96 2445.45 2379.79C1982.35 2647.62 1215.1 3192.35 706.772 3144.13C198.444 3095.91 342.457 2928.2 208.672 2868.39Z"
                    fill={fill}
                />
            </g>
            <defs>
                <filter
                    id="filter0_f_29_215"
                    x="0.860352"
                    y="0.838989"
                    width="3785.16"
                    height="2840.26"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                    />
                    <feGaussianBlur
                        stdDeviation="151"
                        result="effect1_foregroundBlur_29_215"
                    />
                </filter>
            </defs>
        </svg>
    );
}
