import { getAuth } from "@clerk/nextjs/server";
import Address from "@/models/address";
import connectDB from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const { userId } = getAuth(request)
        await connectDB();

        const address = await Address.find({ userId })
        return NextResponse.json({ success: true, address });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}