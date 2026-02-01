import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import Invoice from "@/models/Invoice";
import Razorpay from "razorpay";

// Razorpay instance moved inside handler to ensure fresh env vars


export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();

        const token = req.cookies.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded = verifyToken(token) as any;
        if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        const invoice = await Invoice.findById(id);

        if (!invoice) return NextResponse.json({ message: "Invoice not found" }, { status: 404 });

        // Create Razorpay Order
        const options = {
            amount: Math.round(invoice.amount * 100), // amount in paisa
            currency: "INR",
            receipt: invoice.invoiceNumber,
        };

        const razorpay = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
            key_secret: process.env.RAZORPAY_KEY_SECRET || "",
        });

        const order = await razorpay.orders.create(options);


        return NextResponse.json({ order }, { status: 200 });

    } catch (error: any) {
        console.error("Razorpay order error:", error);
        return NextResponse.json({ message: error.message || "Error creating payment order" }, { status: 500 });
    }
}
