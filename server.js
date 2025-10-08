import express from "express";
import { configDotenv } from "dotenv";
import connectDB from "./config/dbConfig.js";
import userRoute from "./routes/userRoute.js";

configDotenv();
const app = express();
const port = process.env.PORT || 5000;
connectDB();
app.use(express.json());
app.use("/api/user", userRoute);
app.listen(port, () => {
  console.log("node server started at port:", port);
});

// password: vwZVbyIB8A03fagS

// connection string mongodb+srv://yosefadolis_db_user:vwZVbyIB8A03fagS@cluster0.qoxapje.mongodb.net/
