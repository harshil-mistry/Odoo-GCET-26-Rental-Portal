import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import Invoice from "@/models/Invoice";
import crypto from "crypto";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();

        const token = req.cookies.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded = verifyToken(token) as any;
        if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        const { razorpay_payment_id } = await req.json();

        const invoice = await Invoice.findById(id);
        if (!invoice) return NextResponse.json({ message: "Invoice not found" }, { status: 404 });

        invoice.status = "paid";
        invoice.paymentId = razorpay_payment_id;
        invoice.paymentMethod = "razorpay";
        await invoice.save();

        return NextResponse.json({ message: "Payment successful" }, { status: 200 });

    } catch (error: any) {
        console.error("Payment verification error:", error);
        return NextResponse.json({ message: error.message || "Error verifying payment" }, { status: 500 });
    }
}
