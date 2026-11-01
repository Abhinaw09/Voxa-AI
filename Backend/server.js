import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routers/chat.js";


const app =express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.use("/api",chatRoutes);

app.listen(PORT,() => {
  console.log(`Server is running succesfully with ${PORT}`);
  connectDB();
});



const connectDB =async()=>{
  try{
    await mongoose.connect(process.env.MONGOODB_URI);
    console.log("Succesfully connected to Database");
  }catch(err){
    console.log("Connection Failed !!",err);
  }
}

