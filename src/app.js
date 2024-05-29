import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser());


import userRouter from "./routes/user.routes.js"
app.use("/api/users", userRouter)
import sellerRouter from "./routes/seller.routes.js"
app.use("/api/sellers", sellerRouter)
import bookRouter from "./routes/book.routes.js"
app.use("/api/books", bookRouter) 

export { app };