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