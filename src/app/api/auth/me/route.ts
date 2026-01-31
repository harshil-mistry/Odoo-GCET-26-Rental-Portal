import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        const decoded = verifyToken(token) as any;
        if (!decoded) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        await connectDB();
        const user = await User.findById(decoded.userId).select("-password -__v");

        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ user: null }, { status: 500 });
    }
}
