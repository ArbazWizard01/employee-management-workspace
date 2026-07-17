import mongoose from "mongoose";

declare const process: { env: { MONGO_URI?: string } };

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI ?? "";
    await mongoose.connect(mongoUri);
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};
