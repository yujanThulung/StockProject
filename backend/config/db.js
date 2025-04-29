import mongoose from "mongoose";


const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB'.green);
    } catch (error) {
        console.log(`❌ MongoDB connection error:${error.message}`.red);
        process.exit(1)
    }
}


export default connectDB;

