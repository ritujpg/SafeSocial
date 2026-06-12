import { getActivityLogs } from "./routes/activityLogs";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { getDashboardStats } from "./routes/dashboard";
import { handleDemo } from "./routes/demo";
import { register, login } from "./routes/auth";
import { getUsers } from "./routes/users";
import {
  createReport,
  getReports,
  updateReport,
} from "./routes/reports";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // Demo route
  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/register", register);
  app.post("/api/login", login);

  // Users route
  app.get("/api/users", getUsers);
  app.get("/api/activity-logs", getActivityLogs);
  // Reports routes
  app.post("/api/reports", createReport);
  app.get("/api/reports", getReports);
  app.patch("/api/reports/:id", updateReport);

  // Dashboard routes
  app.get("/api/dashboard/stats", getDashboardStats);

  return app;
}