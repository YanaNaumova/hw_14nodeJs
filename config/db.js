import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connect to DB");
  } catch (error) {
    console.log("Failed connect to DB", error);
    process.exit(1);
  }
};
