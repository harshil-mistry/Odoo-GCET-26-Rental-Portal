"use client";

import { useEffect, useState } from "react";
import { IProduct } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Trash2, Edit } from "lucide-react";

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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Inventory</h1>
                <Link href="/vendor/add-product">
                    <Button className="gap-2">
                        <Plus size={18} /> Add Product
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading inventory...</div>
            ) : products.length === 0 ? (
                <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed border-border">
                    <p className="text-muted-foreground mb-4">No products found.</p>
                    <Link href="/vendor/add-product">
                        <Button variant="outline">Create your first product</Button>
                    </Link>
                </div>
            ) : (
                <div className="border border-border rounded-md overflow-hidden bg-card">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted text-muted-foreground uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-3">Product Name</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3">Price</th>
                                <th className="px-6 py-3">Stock</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-muted/50 transition-colors">
                                    <td className="px-6 py-4 font-medium">{product.name}</td>
                                    <td className="px-6 py-4">{product.category}</td>
                                    <td className="px-6 py-4">
                                        ₹{product.basePrice} <span className="text-xs text-muted-foreground">/{product.rentalPeriod}</span>
                                    </td>
                                    <td className="px-6 py-4">{product.totalStock} units</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${product.totalStock > 0
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                }`}
                                        >
                                            {product.totalStock > 0 ? "In Stock" : "Out of Stock"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Link href={`/vendor/edit-product/${product._id}`}>
                                            <Button variant="ghost" size="sm">
                                                <Edit size={16} />
                                            </Button>
                                        </Link>
                                        <Button variant="ghost" size="sm" onClick={() => deleteProduct(product._id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                            <Trash2 size={16} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
