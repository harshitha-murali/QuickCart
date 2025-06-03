export async function POST(request) {
    try {
        const  { userId } = getAuth()
        const {address } = await request.json();


          await connectDB()
        const newAddress = await address.create({...address, userId });
       
        return new Response.json ({ success: true, message: "Address added successfully", address: newAddress })

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });

        
    }
    }