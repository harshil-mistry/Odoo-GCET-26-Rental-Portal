import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import Product from "@/models/Product";
import Invoice from "@/models/Invoice";

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const token = req.cookies.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded = verifyToken(token) as any;
        if (!decoded || decoded.role !== "vendor") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const vendorId = decoded.userId;

        // 1. Total Inventory
        const totalInventory = await Product.countDocuments({ vendorId });

        // 2. Active Rentals (Invoices that are paid but not yet overdue/completed - simplified to just paid invoices)
        // Actually, let's just count invoices that are 'paid'
        const activeRentals = await Invoice.countDocuments({ vendorId, status: "paid" });

        // 3. Items In Stock
        const products = await Product.find({ vendorId });
        const inStock = products.filter((p: any) => p.totalStock > 0).length;

        // 4. Total Revenue
        const paidInvoices = await Invoice.find({ vendorId, status: "paid" });
        const totalRevenue = paidInvoices.reduce((sum: number, inv: any) => sum + inv.amount, 0);

        return NextResponse.json({
            stats: {
                totalInventory,
                activeRentals,
                inStock,
                totalRevenue
            }
        }, { status: 200 });

    } catch (error: any) {
        console.error("Vendor stats error:", error);
        return NextResponse.json({ message: error.message || "Error fetching stats" }, { status: 500 });
    }
}
