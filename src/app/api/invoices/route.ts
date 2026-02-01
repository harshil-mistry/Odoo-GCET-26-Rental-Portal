import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import Invoice from "@/models/Invoice";
import User from "@/models/User";

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const token = req.cookies.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded = verifyToken(token) as any;
        if (!decoded) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        let query = {};
        if (decoded.role === "vendor") {
            query = { vendorId: decoded.userId };
        } else {
            query = { customerId: decoded.userId };
        }

        const invoices = await Invoice.find(query)
            .sort({ createdAt: -1 })
            .populate({
                path: "vendorId",
                model: User,
                select: "name email"
            })
            .populate({
                path: "customerId",
                model: User,
                select: "name email"
            });

        return NextResponse.json({ invoices }, { status: 200 });

    } catch (error: any) {
        console.error("Invoice fetch error:", error);
        return NextResponse.json({ message: error.message || "Error fetching invoices" }, { status: 500 });
    }
}
