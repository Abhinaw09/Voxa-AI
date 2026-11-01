
import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routers/chat.js";

const app = express();
const PORT = 8080;

app.use(express.json());

app.use(cors({
    origin: [
        "http://localhost:5173",
        process.env.FRONTEND_URL
    ].filter(Boolean)
}));

app.use("/api", chatRoutes);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Successfully connected to Database");

        app.listen(PORT, () => {
            console.log(`Server is running successfully on port ${PORT}`);
        });

    } catch (err) {
        console.log("Database connection failed:", err);
    }
};

connectDB();
