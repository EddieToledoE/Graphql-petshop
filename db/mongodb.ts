import { connect } from "mongoose";

const DB_URI = `${process.env.MONGODB_URI}`;

const dbInit = async () => {
  await connect(DB_URI);
  console.log("MongoDB connected!");
};

export default dbInit;
