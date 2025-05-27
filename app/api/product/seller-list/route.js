import authSeller from "@/lib/authSeller";
import { getAuth } from "@clerk/nextjs/server";



export async function GET(request) {
    try{
        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);

        if (!isSeller) {
            return NextResponse.JSON({ success: false, message: "User not found" });
         }
         await connectDB();
         const products = await Product.find({})
         return NextResponse.json({ success: true, products });

    }catch (error) {
        return NextResponse.json({ success: false, message: error.message })
        
    
    }
}