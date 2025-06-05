import { inngest } from "@/config/inngest";
import Product from "@/models/product";
import { getAuth } from "@clerk/nextjs/dist/types/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request)
        const { address,Items } = await request.json();


        if (!address || Items.length === 0) {
            return NextResponse.json({ success: false, message: "Invalid Data" });
        }

        // calculate amount using Items
        const amount = await Items.reduce(async(acc, item) => {
            const product = await Product.findById(item.productId);
            return await acc + product.offerprice * item.quantity;
            }, 0)
            await inngest.send({
                name: "Order/Created",
                data: {
                    userId,
                    address,
                    Items,
                    amount: amount +Math.floor(amount* 0.02),
                    date:Date.now()
                    
                }
            })

            //clear user cart
            const user = await user.findById(userId);
            user.cartItems = {}
            await user.save();

            return NextResponse.json({ success: true, message: "Order Placed Successfully" });

    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: error.message });
        
    }
}