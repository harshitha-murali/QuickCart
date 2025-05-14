import connectDB from "@/config/db";
import { getAuth, User } from "@clerk/nextjs/dist/types/server";

export async function GET(request) {
    try {
        const{ useId } = getAuth(request)
        await connectDB()
        const user = await User.findById(useId)

        if (!user) {
            return NextResponse.json({ success:false, message: "User not found" })
            
        }
        return NextResponse.json({ success:true, user })

    } catch (error) {
         return NextResponse.json({ success:false, message: "error.message" })
    }
    }