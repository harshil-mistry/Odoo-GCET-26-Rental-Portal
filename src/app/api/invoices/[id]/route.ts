import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import Invoice from "@/models/Invoice";
import User from "@/models/User";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();

        const token = req.cookies.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded = verifyToken(token) as any;
        if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        const invoice = await Invoice.findById(id)
            .populate({ path: "vendorId", model: User, select: "name email address" })
            .populate({ path: "customerId", model: User, select: "name email address" });

        if (!invoice) return NextResponse.json({ message: "Invoice not found" }, { status: 404 });

        // Access check
        if (decoded.role === "vendor" && invoice.vendorId._id.toString() !== decoded.userId) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }
        if (decoded.role === "user" && invoice.customerId._id.toString() !== decoded.userId) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json({ invoice }, { status: 200 });

    } catch (error: any) {
        console.error("Invoice fetch error:", error);
        return NextResponse.json({ message: error.message || "Error fetching invoice" }, { status: 500 });
    }
}
