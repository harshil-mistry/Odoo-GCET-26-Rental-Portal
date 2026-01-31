import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

// GET: List all products (Public for now, or filtered by query)
export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");

        // Filter object
        let filter: any = {};
        if (category) filter.category = category;

        const products = await Product.find(filter).sort({ createdAt: -1 });
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching products" }, { status: 500 });
    }
}

// POST: Create a new product (Protected: Admin/Vendor only)
export async function POST(req: Request) {
    try {
        await connectDB();

        // Auth Check
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const decoded = verifyToken(token) as any;
        if (!decoded || (decoded.role !== "admin" && decoded.role !== "vendor")) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();

        const newProduct = new Product({
            ...body,
            vendorId: decoded.userId,
            isRentable: true, // Default
        });

        await newProduct.save();
        return NextResponse.json({ message: "Product created", product: newProduct }, { status: 201 });

    } catch (error) {
        console.error("Create Product Error:", error);
        return NextResponse.json({ message: "Error creating product" }, { status: 500 });
    }
}
