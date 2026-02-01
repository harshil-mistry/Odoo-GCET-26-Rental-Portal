"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Printer, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function InvoicePage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const [invoice, setInvoice] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

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

    const handleDownloadPDF = async () => {
        const element = document.getElementById("invoice-content");
        if (!element) return;

        setDownloading(true);
        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                logging: false,
                backgroundColor: "#ffffff",
                useCORS: true
            });
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4"
            });

            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save(`invoice-${invoice.invoiceNumber}.pdf`);
        } catch (error) {
            console.error("PDF generation failed", error);
            alert("Failed to generate PDF");
        } finally {
            setDownloading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={32} />
        </div>
    );

    if (!invoice) return null;

    return (
        <div className="min-h-screen bg-muted/20 pt-28 pb-12 px-4 print:bg-white print:p-0">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Actions */}
                <div className="flex items-center justify-between print:hidden">
                    <Button variant="ghost" onClick={() => router.back()} className="gap-2">
                        <ArrowLeft size={16} /> Back
                    </Button>
                </div>

                {/* Invoice Card */}
                <div id="invoice-content" className="bg-[#ffffff] rounded-3xl border border-[#e5e5e5] p-8 md:p-12 space-y-8 print:shadow-none print:border-none print:p-0">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[#ec4899] font-bold text-xl mb-4">
                                <div className="w-8 h-8 rounded-lg bg-[#ec48991a] flex items-center justify-center">
                                    <FileText size={18} />
                                </div>
                                Rental Service
                            </div>
                            <h1 className="text-3xl font-serif font-bold text-black">Invoice</h1>
                            <p className="text-[#737373] font-mono">{invoice.invoiceNumber}</p>
                        </div>
                        <div className="text-right space-y-1">
                            <p className="text-sm font-medium text-[#737373]">Issued Date</p>
                            <p className="font-semibold text-black">{format(new Date(invoice.issuedAt), 'MMM d, yyyy')}</p>
                            <p className="text-sm font-medium text-[#737373] mt-4">Due Date</p>
                            <p className="font-semibold text-black">{format(new Date(invoice.dueDate), 'MMM d, yyyy')}</p>
                        </div>
                    </div>

                    <div className="h-px bg-[#e5e5e5]" />

                    {/* Parties */}
                    <div className="grid grid-cols-2 gap-12">
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-[#737373] uppercase tracking-wider">Billed To</h3>
                            <div>
                                <p className="font-bold text-lg text-black">{invoice.customerId?.name}</p>
                                <p className="text-[#737373]">{invoice.customerId?.email}</p>
                            </div>
                        </div>
                        <div className="space-y-3 text-right">
                            <h3 className="text-sm font-medium text-[#737373] uppercase tracking-wider">Pay To</h3>
                            <div>
                                <p className="font-bold text-lg text-black">{invoice.vendorId?.name}</p>
                                <p className="text-[#737373]">{invoice.vendorId?.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div>
                        <table className="w-full">
                            <thead className="bg-[#f5f5f5]">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-[#737373] rounded-l-lg">Description</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-[#737373]">Qty</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-[#737373]">Price</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-[#737373] rounded-r-lg">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e5e5e5]">
                                {invoice.items.map((item: any, i: number) => (
                                    <tr key={i}>
                                        <td className="px-4 py-4 font-medium text-black">{item.description}</td>
                                        <td className="px-4 py-4 text-right text-[#737373]">{item.quantity}</td>
                                        <td className="px-4 py-4 text-right text-[#737373]">₹{item.unitPrice.toLocaleString()}</td>
                                        <td className="px-4 py-4 text-right font-medium text-black">₹{item.total.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="h-px bg-[#e5e5e5]" />

                    {/* Total */}
                    <div className="flex justify-end">
                        <div className="w-full max-w-xs space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-[#737373]">Subtotal</span>
                                <span className="text-black">₹{invoice.amount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-[#737373]">Tax (0%)</span>
                                <span className="text-black">₹0</span>
                            </div>
                            <div className="h-px bg-[#e5e5e5]" />
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-lg text-black">Total</span>
                                <span className="font-bold text-2xl text-[#ec4899]">₹{invoice.amount.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="bg-[#f5f5f5] p-4 rounded-xl flex items-center justify-between">
                        <span className="font-medium text-sm text-[#737373]">Payment Status</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider ${invoice.status === "paid"
                            ? "bg-[#10b9811a] text-[#059669] border border-[#10b98133]"
                            : "bg-[#f59e0b1a] text-[#d97706] border border-[#f59e0b33]"
                            }`}>
                            {invoice.status}
                        </span>
                    </div>
                </div>

                <div className="flex justify-center print:hidden">
                    <Button
                        onClick={handleDownloadPDF}
                        disabled={downloading}
                        className="gap-2 shadow-lg shadow-primary/25 rounded-full px-8 py-6 h-auto text-lg"
                    >
                        {downloading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <Download size={20} />
                        )}
                        {downloading ? "Generating PDF..." : "Download Invoice PDF"}
                    </Button>
                </div>

                <p className="text-center text-sm text-muted-foreground print:hidden">
                    Thank you for your business.
                </p>
            </div>
        </div>
    );
}
