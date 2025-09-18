import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    const conn_detail_obj = await mongoose.connect(
      process.env.MONGODB_CONN_STRING
    );
    console.log(
      `connected to mongo DB successfully to instance : ${conn_detail_obj.connection.host}`
    );
  } catch (error) {
    console.log("Error while connecting to DB", error.message);
  }
};

export { connectMongoDB };
