"use client";

import { useEffect, useState } from "react";
import { IProduct } from "@/types";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";

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

    // Extract unique categories
    const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))];

    return (
        <div className="min-h-screen bg-background pt-24 pb-12">
            <div className="container mx-auto px-4 space-y-8">

                {/* Header & Filters */}
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Browse Gear</h1>
                        <p className="text-muted-foreground">Find the perfect equipment for your needs.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
                                className="pl-9"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <select
                            className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            {categories.map(c => (
                                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-lg text-muted-foreground">No products found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}
