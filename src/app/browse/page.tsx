"use client";

import { useEffect, useState } from "react";
import { IProduct } from "@/types";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Sparkles, Filter, Grid3X3, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function BrowsePage() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        let res = products;
        if (search) {
            res = res.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
        }
        if (category !== "all") {
            res = res.filter(p => p.category.toLowerCase() === category.toLowerCase());
        }
        setFilteredProducts(res);
    }, [search, category, products]);

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products");
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
                setFilteredProducts(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))];

    return (
        <div className="min-h-screen bg-background pt-24 pb-16">
            {/* Decorative Background */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none -z-10" />
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-primary/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="container mx-auto px-4 space-y-10">

                {/* Hero Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto space-y-4"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                        <Sparkles size={14} />
                        Premium Equipment Catalog
                    </div>
                    <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight bg-gradient-to-br from-foreground via-foreground to-muted-foreground bg-clip-text">
                        Browse Gear
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        Discover our curated collection of professional-grade equipment.
                        From cameras to drones, find what you need.
                    </p>
                </motion.div>

                {/* Filters Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl"
                >
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
                                className="pl-11 h-12 bg-background/50 border-border/50 rounded-xl focus:ring-2 focus:ring-primary/20"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Filter size={14} />
                            <span className="hidden sm:inline">Filter:</span>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                            {categories.map(c => (
                                <button
                                    key={c}
                                    onClick={() => setCategory(c)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${category === c
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                            : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                        }`}
                                >
                                    {c.charAt(0).toUpperCase() + c.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Results Count */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <p>
                        Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> products
                    </p>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                        <p className="text-muted-foreground">Loading equipment...</p>
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-24 bg-muted/20 rounded-3xl border border-dashed border-border"
                    >
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                            <Search size={32} className="text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No products found</h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            Try adjusting your search or filter to find what you're looking for.
                        </p>
                        <Button variant="outline" className="mt-6" onClick={() => { setSearch(""); setCategory("all"); }}>
                            Clear Filters
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {filteredProducts.map((product, index) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}

            </div>
        </div>
    );
}
