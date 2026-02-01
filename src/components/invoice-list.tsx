"use client";

import { useEffect, useState } from "react";
import { FileText, Loader2, Eye } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

interface Invoice {
    _id: string;
    invoiceNumber: string;
    amount: number;
    status: "paid" | "pending";
    issuedAt: string;
    dueDate: string;
    vendorId: { name: string };
    customerId: { name: string };
}

export function InvoiceList({ role }: { role: "vendor" | "user" }) {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const res = await fetch("/api/invoices");
                if (res.ok) {
                    const data = await res.json();
                    setInvoices(data.invoices);
                }
            } catch (error) {
                console.error("Failed to fetch invoices", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="animate-spin text-muted-foreground mr-2" />
                <span className="text-muted-foreground">Loading invoices...</span>
            </div>
        );
    }

    if (invoices.length === 0) {
        return (
            <div className="text-center py-12 bg-muted/30 rounded-3xl border border-dashed border-border">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="text-muted-foreground" size={24} />
                </div>
                <h3 className="text-lg font-semibold">No Invoices Found</h3>
                <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                    {role === "vendor"
                        ? "You haven't generated any invoices yet."
                        : "You don't have any invoices yet."}
                </p>
            </div>
        );
    }

    return (
        <div className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-muted/30 text-xs uppercase font-medium text-muted-foreground">
                        <tr>
                            <th className="px-6 py-4 text-left">Invoice #</th>
                            <th className="px-6 py-4 text-left">Date</th>
                            <th className="px-6 py-4 text-left">
                                {role === "vendor" ? "Customer" : "Vendor"}
                            </th>
                            <th className="px-6 py-4 text-right">Amount</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {invoices.map((invoice) => (
                            <tr key={invoice._id} className="hover:bg-muted/10 transition-colors">
                                <td className="px-6 py-4 font-medium font-mono text-sm">
                                    {invoice.invoiceNumber}
                                </td>
                                <td className="px-6 py-4 text-sm text-muted-foreground">
                                    {new Date(invoice.issuedAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium">
                                    {role === "vendor"
                                        ? invoice.customerId?.name || "Unknown"
                                        : invoice.vendorId?.name || "Unknown"}
                                </td>
                                <td className="px-6 py-4 text-right font-medium">
                                    ₹{invoice.amount.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${invoice.status === "paid"
                                            ? "bg-emerald-500/10 text-emerald-600"
                                            : "bg-amber-500/10 text-amber-600"
                                        }`}>
                                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link href={`/invoices/${invoice._id}`}>
                                        <Button size="sm" variant="outline" className="h-8 gap-2">
                                            <Eye size={14} /> View
                                        </Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
