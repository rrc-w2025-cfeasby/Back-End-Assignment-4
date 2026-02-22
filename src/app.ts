import express from "express";

const app = express();
app.use(express.json());

// Logging middleware (should be applied early in the middleware stack)
if (process.env.NODE_ENV === "production") {
    // In production, log to files
    //app.use(accessLogger);
    //app.use(errorLogger);
} else {
    // In development, log to console for immediate feedback
    //app.use(consoleLogger);
}

// Body parsing middleware
app.use(express.json());

// API Routes
//app.use("/api/v1", postRoutes);
// Define a route
app.get("/", (req, res) => {
    res.send("Hello, World!");
});


// Global error handling middleware (MUST be applied last)
//app.use(errorHandler);

export default app;