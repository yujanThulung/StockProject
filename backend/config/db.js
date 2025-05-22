import mongoose from "mongoose";


const connectDB = async () =>{
    try {
        const start = Date.now();
        await mongoose.connect(process.env.MONGO_URI);
        const end = Date.now();
        const timeTaken = end - start;
        console.log(`Time taken to connect to MongoDB: ${timeTaken}ms`.yellow);
        
        console.log('✅ Connected to MongoDB'.green);
    } catch (error) {
        console.log(`❌ MongoDB connection error:${error.message}`.red);
        process.exit(1)
    }
}


export default connectDB;

