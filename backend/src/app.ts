import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import swaggerUi from "swagger-ui-express";
import { generateOpenAPIDocument } from "./config/openapi.js";
import notificationRoutes from "./routes/notification.routes.js";
import { globalRateLimiter } from "./utils/rateLimiter.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(globalRateLimiter);

app.get("/health", (_, res) => {
  res.json({ status: "OK" });
});

app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);


const document = generateOpenAPIDocument();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(document));

app.use(errorMiddleware);

export default app;