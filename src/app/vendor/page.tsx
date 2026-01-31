"use client";

import { useEffect, useState } from "react";
import { IProduct } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Trash2, Edit, Package, LayoutDashboard, TrendingUp, DollarSign, Eye } from "lucide-react";
import { motion } from "framer-motion";

export default function VendorDashboard() {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/products");
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
            if (res.ok) {
                setProducts(products.filter(p => p._id !== id));
            } else {
                alert("Failed to delete");
            }
        } catch (err) {
            console.error(err);
        }
    }

    const totalInventory = products.length;
    const inStock = products.filter(p => p.totalStock > 0).length;
    const activeRentals = 12;
    const totalRevenue = 45200;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            className="space-y-10"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white shadow-lg shadow-primary/25">
                        <LayoutDashboard size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-serif font-bold tracking-tight">Vendor Dashboard</h1>
                        <p className="text-muted-foreground">Manage your inventory and track performance.</p>
                    </div>
                </div>
                <Link href="/vendor/add-product">
                    <Button className="gap-2 rounded-xl px-6 shadow-lg shadow-primary/25 hover:scale-105 transition-transform">
                        <Plus size={18} /> Add New Product
                    </Button>
                </Link>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Inventory", value: totalInventory, icon: Package, color: "from-blue-500/10 to-blue-500/5", iconBg: "bg-blue-500/10", iconColor: "text-blue-500" },
                    { label: "Active Rentals", value: activeRentals, icon: TrendingUp, color: "from-purple-500/10 to-purple-500/5", iconBg: "bg-purple-500/10", iconColor: "text-purple-500" },
                    { label: "Items In Stock", value: inStock, icon: Eye, color: "from-emerald-500/10 to-emerald-500/5", iconBg: "bg-emerald-500/10", iconColor: "text-emerald-500" },
                    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "from-primary/10 to-primary/5", iconBg: "bg-primary/10", iconColor: "text-primary" }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -4, scale: 1.02 }}
                        className={`group relative bg-gradient-to-br ${stat.color} via-card to-card border border-border/50 p-6 rounded-3xl overflow-hidden transition-all hover:shadow-xl hover:border-primary/30`}
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform" />
                        <div className="relative">
                            <div className={`w-12 h-12 rounded-2xl ${stat.iconBg} flex items-center justify-center mb-4`}>
                                <stat.icon className={stat.iconColor} size={24} />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                            <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Products Table */}
            <motion.div variants={itemVariants} className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Recent Inventory</h2>
                    <span className="text-sm text-muted-foreground">{products.length} products</span>
                </div>

                {loading ? (
                    <div className="text-center py-20 bg-muted/20 rounded-3xl border border-border/50">
                        <div className="animate-spin w-10 h-10 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading your gear...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 bg-gradient-to-br from-muted/20 to-transparent rounded-3xl border-2 border-dashed border-border flex flex-col items-center">
                        <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mb-6">
                            <Package className="text-muted-foreground" size={36} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No products yet</h3>
                        <p className="text-muted-foreground mb-6 max-w-sm">Get started by adding your first piece of equipment to the rental pool.</p>
                        <Link href="/vendor/add-product">
                            <Button className="rounded-xl">Create Product</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="bg-card border border-border/50 rounded-3xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/30 text-muted-foreground uppercase text-xs font-semibold tracking-wider">
                                    <tr>
                                        <th className="px-6 py-5">Product</th>
                                        <th className="px-6 py-5">Category</th>
                                        <th className="px-6 py-5">Price</th>
                                        <th className="px-6 py-5">Stock</th>
                                        <th className="px-6 py-5">Status</th>
                                        <th className="px-6 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {products.map((product, index) => (
                                        <motion.tr
                                            key={product._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group hover:bg-muted/20 transition-colors"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-muted flex-shrink-0 overflow-hidden border border-border/50">
                                                        {product.images && product.images[0] ? (
                                                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <Package size={18} className="text-muted-foreground" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="font-semibold">{product.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="px-3 py-1 rounded-full bg-muted/50 text-xs font-medium">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="font-semibold">₹{product.basePrice.toLocaleString()}</span>
                                                <span className="text-xs text-muted-foreground ml-1">/ {product.rentalPeriod}</span>
                                            </td>
                                            <td className="px-6 py-5 text-muted-foreground">{product.totalStock} units</td>
                                            <td className="px-6 py-5">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${product.totalStock > 0
                                                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                                    : "bg-red-500/10 text-red-600 border-red-500/20"
                                                    }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${product.totalStock > 0 ? "bg-emerald-500" : "bg-red-500"}`} />
                                                    {product.totalStock > 0 ? "Active" : "Out of Stock"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link href={`/vendor/edit-product/${product._id}`}>
                                                        <Button variant="outline" size="sm" className="h-9 w-9 rounded-xl">
                                                            <Edit size={14} />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-9 w-9 rounded-xl text-destructive hover:bg-destructive/10 border-destructive/20"
                                                        onClick={() => deleteProduct(product._id)}
                                                    >
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}
