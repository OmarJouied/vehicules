import mongoose from "mongoose"

let isConnected: boolean = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("mongodb connected!");
    isConnected = true;
  } catch (error: any) {
    console.log("Error connecting to MongoDB: ", error);
  }
};

export { connectDB };