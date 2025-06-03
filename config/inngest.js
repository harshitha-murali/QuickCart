import { Inngest } from "inngest";
import connectDB from "./db";
import { User } from "@clerk/nextjs/dist/types/server";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });

//Inngest function to save user data to database
export const syncUserCreation = inngest.createFunction(
    {
        id:'sync-user-free-clerk'
    },
    {event: 'clerk/user.created'},
    async ({ event }) => {
        const { id, email_addresses, first_name, last_name ,image_url} = event.data
        const userData = {
            _id: id,
            name: first_name + ' ' + last_name,
            email: email_addresses[0].email_address,
            imageUrl: image_url
        }
        await connectDB()
        await User.create(userData)
    }
)
// Inngest Function to update user data in database
export const syncUserUpdation = inngest.createFunction(
{
     id : 'update-user-from-clerk'
},
{ event: 'clerk/user.updated'},
async({event}) => {
    const { id, email_adress, first_name, last_name ,image_url} = event.data
        const userData = {
            _id: id,
            name: first_name + ' ' + last_name,
            email: email_addresses[0].email_address,
            imageUrl: image_url
        }
        await connectDB()
        await User.findByIdAndUpdate(id,userData)

}
)
// Inngest Function to declare user from database
export const syncUserDeletion = inngest.createFunction(
    {
        id : 'delete-user-with-clerk'
    },
    { event: 'clerk/user.deleted'},
    async({event}) =>{
        const {id} = event.data

        await connectDB()
        await User.findByIdAndDelete(id)
    }
)
// Inngest Function to get user data from database
export const syncUserData = inngest.createFunction(
    {
        id:'create-user-order',
        batchEvents:{
            maxSize:5,
            timeout:'5s'
        }
    },
    { event: 'order/created' },
    async ({events}) => {
        const orders = events.map((events) => {
        return {
            userId: events.data.userId,
            items:events.data.items,
            amount: events.data.amount,
            Address: events.data.address,
            date: events.data.date
        }
    })
    await connectDB()
    await Order.insertMany(orders)
    return { success: true, processed :orders.length};

}
)