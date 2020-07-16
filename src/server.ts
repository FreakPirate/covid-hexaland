import cookieParser from "cookie-parser";
import express from "express";
import { Request, Response } from "express";
import logger from "morgan";
import path from "path";
import BaseRouter from "@routes";
import { NOT_FOUND } from "http-status-codes";

/**
 * Initializing express
 */
const app = express();

// Serve static files from the React app
app.use(express.static(path.join("client/build")));

/**
 * Adding middlewares
 */
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "DELETE");
  next();
});

/**
 * Adding base route
 */
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

app.get("*", (req, res) => {
  res.sendFile(path.join("../client/build/index.html"));
});

export default app;
