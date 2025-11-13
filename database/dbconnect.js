import mongoose from "mongoose";

const connection = mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected"))
  .catch((error) => console.log("If initial then add Mongodb URL in env file\ndatabase/dbconnect.js::MONGODB connection error: ", error));

  export default connection 