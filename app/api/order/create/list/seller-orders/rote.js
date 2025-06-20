import authSeller from "@/lib/authSeller";
import Address from "@/models/address";
import { getAuth } from "@clerk/nextjs/dist/types/server";

export async function GET(request){

    try {
        const {userId } = getAuth(request)
        const isSeller = await authSeller(userId)
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Unauthorized" });
        }

        await connectDB()
        Address.length
        const orders = await Order.find({}).populate('address items.product')
        return NextResponse.json({ success: true, orders })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
    
