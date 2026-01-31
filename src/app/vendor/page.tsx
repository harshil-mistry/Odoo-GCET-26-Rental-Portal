"use client";

import { useEffect, useState } from "react";
import { IProduct } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Trash2, Edit, Package, LayoutDashboard } from "lucide-react";

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

    // Calculated Stats
    const totalInventory = products.length;
    const inStock = products.filter(p => p.totalStock > 0).length;
    // Mock data for now until we have orders API connected here
    const activeRentals = 12;
    const totalRevenue = 45200;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight">Vendor Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Manage your inventory and track performance.</p>
                </div>
                <Link href="/vendor/add-product">
                    <Button className="gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                        <Plus size={18} /> Add New Product
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Inventory", value: totalInventory, icon: <Package className="text-blue-500" />, color: "bg-blue-500/10" },
                    { label: "Active Rentals", value: activeRentals, icon: <LayoutDashboard className="text-purple-500" />, color: "bg-purple-500/10" },
                    { label: "Items In Stock", value: inStock, icon: <Plus className="text-green-500" />, color: "bg-green-500/10" },
                    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: <Edit className="text-pink-500" />, color: "bg-pink-500/10" }
                ].map((stat, i) => (
                    <div key={i} className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 p-4 opacity-50 transition-transform group-hover:scale-110 ${stat.color} rounded-bl-3xl`}>
                            {stat.icon}
                        </div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                        <h3 className="text-3xl font-bold mt-2 font-serif">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Products Table */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold tracking-tight">Recent Inventory</h2>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading your gear...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border flex flex-col items-center">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                            <Package className="opacity-50" size={32} />
                        </div>
                        <p className="text-lg font-medium">No products found</p>
                        <p className="text-muted-foreground mb-6 max-w-sm">Get started by adding your first piece of equipment to the rental pool.</p>
                        <Link href="/vendor/add-product">
                            <Button variant="default">Create Product</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Product Name</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Price / Period</th>
                                        <th className="px-6 py-4">Stock</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {products.map((product) => (
                                        <tr key={product._id} className="group hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-muted flex-shrink-0 flex items-center justify-center overflow-hidden">
                                                        {product.images && product.images[0] ? (
                                                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Package size={16} className="opacity-50" />
                                                        )}
                                                    </div>
                                                    <span className="font-medium text-foreground">{product.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                <span className="px-2 py-1 rounded-md bg-muted text-xs">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium">
                                                ₹{product.basePrice} <span className="text-xs text-muted-foreground font-normal">/ {product.rentalPeriod}</span>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">{product.totalStock} units</td>
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${product.totalStock > 0
                                                    ? "bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400"
                                                    : "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400"
                                                    }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${product.totalStock > 0 ? "bg-green-500" : "bg-red-500"}`} />
                                                    {product.totalStock > 0 ? "Active" : "Out of Stock"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link href={`/vendor/edit-product/${product._id}`}>
                                                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                                            <Edit size={14} />
                                                        </Button>
                                                    </Link>
                                                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20" onClick={() => deleteProduct(product._id)}>
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
