import cors from "cors";
import dotenv from "dotenv";
import express, { Express, NextFunction, Request, Response } from "express";
import connectDB from "./utils/db";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

dotenv.config();

// APP
export const app: Express = express();
// BODY PARSER
app.use(express.json({ limit: "50mb" }));
// COOKIE PARSER
app.use(cookieParser());
// CORS [CROSS ORIGIN RESOURCE SHARING]
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
// SWAGGER API DOCS
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ROUTES
import userRouter from "./routes/user.route";
import gigRouter from "./routes/gig.route";
import bidRouter from "./routes/bid.route";

app.use("/api/auth", userRouter);
app.use("/api/bids", bidRouter);
app.use("/api/gigs", gigRouter);

// TESTING API
app.get("/", (req: Request, res: Response) =>
  res.status(200).json({ success: true, message: "API is working, PING/PONG" })
);

// UNKNOWN ROUTE
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found!`);
  next(err);
});

// SERVER
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is connected with port ${process.env.PORT}`);
  connectDB();
});
