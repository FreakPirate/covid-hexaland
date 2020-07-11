import cookieParser from "cookie-parser";
import express from "express";
import { Request, Response } from "express";
import logger from "morgan";
import path from "path";
import BaseRouter from "@routes";
import { NOT_FOUND } from "http-status-codes";

// Init express
const app = express();

// Add middleware/settings/routes to express.
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api", BaseRouter);

/**
 * Default redirect
 */
app.get("*", (req: Request, res: Response) => {
  res.status(NOT_FOUND).json({
    error: true,
    message: "resource not found",
  });
});

// Export express instance
export default app;
