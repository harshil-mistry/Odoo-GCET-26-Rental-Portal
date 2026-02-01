"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Printer, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";

export default function InvoicePage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const [invoice, setInvoice] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchInvoice = async () => {
            try {
                const res = await fetch(`/api/invoices/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setInvoice(data.invoice);
                } else {
                    alert("Failed to load invoice");
                    router.back();
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoice();
    }, [id, router]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={32} />
        </div>
    );

    if (!invoice) return null;

    return (
        <div className="min-h-screen bg-muted/20 py-12 px-4 print:bg-white print:p-0">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Actions */}
                <div className="flex items-center justify-between print:hidden">
                    <Button variant="ghost" onClick={() => router.back()} className="gap-2">
                        <ArrowLeft size={16} /> Back
                    </Button>
                    <Button onClick={() => window.print()} variant="outline" className="gap-2">
                        <Printer size={16} /> Print Results
                    </Button>
                </div>

                {/* Invoice Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-border/50 p-8 md:p-12 space-y-8 print:shadow-none print:border-none print:p-0">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-primary font-bold text-xl mb-4">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <FileText size={18} />
                                </div>
                                Rental Service
                            </div>
                            <h1 className="text-3xl font-serif font-bold">Invoice</h1>
                            <p className="text-muted-foreground font-mono">{invoice.invoiceNumber}</p>
                        </div>
                        <div className="text-right space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">Issued Date</p>
                            <p className="font-semibold">{format(new Date(invoice.issuedAt), 'MMM d, yyyy')}</p>
                            <p className="text-sm font-medium text-muted-foreground mt-4">Due Date</p>
                            <p className="font-semibold">{format(new Date(invoice.dueDate), 'MMM d, yyyy')}</p>
                        </div>
                    </div>

                    <div className="h-px bg-border/50" />

                    {/* Parties */}
                    <div className="grid grid-cols-2 gap-12">
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Billed To</h3>
                            <div>
                                <p className="font-bold text-lg">{invoice.customerId?.name}</p>
                                <p className="text-muted-foreground">{invoice.customerId?.email}</p>
                            </div>
                        </div>
                        <div className="space-y-3 text-right">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pay To</h3>
                            <div>
                                <p className="font-bold text-lg">{invoice.vendorId?.name}</p>
                                <p className="text-muted-foreground">{invoice.vendorId?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div>
                        <table className="w-full">
                            <thead className="bg-muted/30">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground rounded-l-lg">Description</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-muted-foreground">Qty</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-muted-foreground">Price</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-muted-foreground rounded-r-lg">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {invoice.items.map((item: any, i: number) => (
                                    <tr key={i}>
                                        <td className="px-4 py-4 font-medium">{item.description}</td>
                                        <td className="px-4 py-4 text-right text-muted-foreground">{item.quantity}</td>
                                        <td className="px-4 py-4 text-right text-muted-foreground">₹{item.unitPrice.toLocaleString()}</td>
                                        <td className="px-4 py-4 text-right font-medium">₹{item.total.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="h-px bg-border/50" />

                    {/* Total */}
                    <div className="flex justify-end">
                        <div className="w-full max-w-xs space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>₹{invoice.amount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground">Tax (0%)</span>
                                <span>₹0</span>
                            </div>
                            <div className="h-px bg-border/50" />
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-lg">Total</span>
                                <span className="font-bold text-2xl text-primary">₹{invoice.amount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="bg-muted/30 p-4 rounded-xl flex items-center justify-between">
                        <span className="font-medium text-sm text-muted-foreground">Payment Status</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider ${invoice.status === "paid"
                                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                            }`}>
                            {invoice.status}
                        </span>
                    </div>
                </div>

                <p className="text-center text-sm text-muted-foreground print:hidden">
                    Thank you for your business.
                </p>
            </div>
        </div>
    );
}
