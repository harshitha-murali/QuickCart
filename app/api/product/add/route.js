import { getAuth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";


// Congfigure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,

})

export async function POST(request) {
    try{

        const{ userId } = getAuth(request);

        if (!isSeller) {
            return NextResponse.json({ success: false, message: "User not found" })
        }
        const formData = await request.formData();
        const name = formData.get("name");
        const description = formData.get("description");
        const price = formData.get("price");
        const category = formData.get("category");
        const offer = formData.get("offer");
        const files = formData.get("image");

        if(!files || files.length === 0) {
            return NextResponse.json({ success: false, message: "Please upload an image" })
        }

        const result = await promise .all(
            files.map(async (file) => {
               const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer)

                return new Promise((resolve, reject) => {
                   const stream  = cloudinary.uploader.upload_stream(
                    {resource_type: 'auto'},
                    (error,result) => {
                        if (error) {
                            reject(error)
                        } else {
                            resolve(result)
                        }
                    }
                   )
                   stream.end(buffer);
                })
            })
      )
      const image = result.map((result) => result.secure_url)
      await connectDB()
      const newProduct = await Product.create ({
        userId,
        name,
        description,
        price:Number(price),
        category,
        offerPrice: Number(offerPrice),
        image,
        date: Date.now(),
      })

      return NextResponse.json({ success: true, message: "Product added successfully" ,newProduct })


    } catch (error) {
        NextResponse.json({ success: false, message: error.message })
    }
}
