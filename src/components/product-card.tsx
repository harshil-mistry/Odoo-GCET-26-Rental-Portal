"use client";

import { IProduct } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "lucide-react"; // Wait, Badge is usually a component
import { motion } from "framer-motion";

// Simple Badge component since we don't have one yet
function StatusBadge({ inStock }: { inStock: boolean }) {
    return (
        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${inStock
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            }`}>
            {inStock ? "Avail" : "Out"}
        </span>
    )
}

export function ProductCard({ product }: { product: IProduct }) {
    const imageUrl = product.images?.[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"; // Fallback placeholder

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
        >
            <div className="aspect-square relative overflow-hidden bg-muted">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3">
                    <StatusBadge inStock={product.totalStock > 0} />
                </div>
            </div>

            <div className="p-4 space-y-3">
                <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{product.category}</p>
                    <h3 className="font-bold text-lg leading-tight truncate group-hover:text-primary transition-colors">{product.name}</h3>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-xl font-bold">₹{product.basePrice}</span>
                        <span className="text-xs text-muted-foreground">/{product.rentalPeriod}</span>
                    </div>
                    <Link href={`/products/${product._id}`}>
                        <Button size="sm" className="rounded-full px-4">
                            Rent
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
