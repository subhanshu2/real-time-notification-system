import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => {
  res.json({ status: "OK" });
});

app.use("/api/auth", authRoutes);

app.use(errorMiddleware);

export default app;