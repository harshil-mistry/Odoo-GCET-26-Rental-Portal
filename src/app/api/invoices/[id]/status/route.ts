import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import Invoice from "@/models/Invoice";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();

        const token = req.cookies.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded = verifyToken(token) as any;
        if (!decoded || decoded.role !== "vendor") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;
        const { status } = await req.json();

        if (status !== "paid" && status !== "pending") {
            return NextResponse.json({ message: "Invalid status" }, { status: 400 });
        }

        const invoice = await Invoice.findById(id);
        if (!invoice) return NextResponse.json({ message: "Invoice not found" }, { status: 404 });

        // Ensure the vendor owns this invoice
        if (invoice.vendorId.toString() !== decoded.userId) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        invoice.status = status;
        if (status === "paid") {
            invoice.paymentMethod = "manual";
        }
        await invoice.save();

        return NextResponse.json({ message: "Status updated", invoice }, { status: 200 });

    } catch (error: any) {
        console.error("Invoice update error:", error);
        return NextResponse.json({ message: error.message || "Error updating invoice" }, { status: 500 });
    }
}
