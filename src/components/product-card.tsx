"use client";

import { IProduct } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

function StatusBadge({ inStock }: { inStock: boolean }) {
    return (
        <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${inStock
            ? "bg-green-500/20 text-green-400 border-green-500/30"
            : "bg-red-500/20 text-red-400 border-red-500/30"
            }`}>
            {inStock ? "Available" : "Unavailable"}
        </span>
    )
}

export function ProductCard({ product }: { product: IProduct }) {
    const imageUrl = product.images?.[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80";

    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative bg-gradient-to-b from-card to-card/80 border border-border/50 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
        >
            {/* Image Container */}
            <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <StatusBadge inStock={product.totalStock > 0} />
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs">
                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                        <span>4.9</span>
                    </div>
                </div>

                {/* Quick Action - Appears on Hover */}
                <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <Link href={`/products/${product._id}`}>
                        <Button className="w-full rounded-xl h-11 bg-white/90 text-black hover:bg-white backdrop-blur-md shadow-xl">
                            View Details
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-primary font-bold uppercase tracking-widest px-2 py-0.5 bg-primary/10 rounded-full">
                            {product.category}
                        </span>
                    </div>
                    <h3 className="font-bold text-lg leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>
                </div>

                <div className="flex items-end justify-between pt-2 border-t border-border/50">
                    <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Starting from</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                                ₹{product.basePrice.toLocaleString()}
                            </span>
                            <span className="text-xs text-muted-foreground">/{product.rentalPeriod}</span>
                        </div>
                    </div>
                    <Link href={`/products/${product._id}`}>
                        <Button size="sm" variant="outline" className="rounded-full px-5 border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all">
                            Rent
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
