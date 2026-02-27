import express, { Express } from "express";
import loanRoutes from "./api/v1/routes/loanRoutes";
import adminRoutes from "./api/v1/routes/adminRoutes";
import { accessLogger, errorLogger, consoleLogger } from "./api/v1/middleware/logger";
import errorHandler from "./api/v1/middleware/errorHandler";

const app: Express = express();

if (process.env.NODE_ENV === "production") {
    app.use(accessLogger);
    app.use(errorLogger);
} else {
    app.use(consoleLogger);
}

app.use(express.json());

// Health Route
app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// API Admin routes
app.use("/api/v1", adminRoutes);

// API Loan routes
app.use("/api/v1", loanRoutes);

// Define a route
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.use(errorHandler);

export default app;