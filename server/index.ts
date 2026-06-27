import { getActivityLogs } from "./routes/activityLogs";
import "dotenv/config";
import express from "express";
import { getFakeAccounts } from "./routes/fakeAccounts";
import cors from "cors";
import {
  getDashboardStats,
} from "./routes/dashboard";
import { handleDemo } from "./routes/demo";
import { register, login } from "./routes/auth";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "./routes/users";
import {
  createReport,
  getReports,
  updateReport,
  getReportAnalytics,
  exportReportsPDF,
} from "./routes/reports";
import {getMonthlyAnalytics } from "./routes/monthlyAnalytics";
import { exportCsv } from "./routes/exportCsv";



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
  app.get("/api/users/:id", getUserById);
  app.post("/api/users", createUser);
  app.put("/api/users/:id", updateUser);
  app.delete("/api/users/:id", deleteUser);
  // Reports routes
  app.post("/api/reports", createReport);
  app.get("/api/reports", getReports);
  app.get(
  "/api/reports/analytics",
  getReportAnalytics
);
  app.patch("/api/reports/:id", updateReport);
  app.get(
  "/api/reports/monthly",
  getMonthlyAnalytics
);
  app.get(
  "/api/reports/export/csv",
  exportCsv
);
app.get(
  "/api/reports/export/pdf",
  exportReportsPDF
);
  // Dashboard routes
  app.get("/api/dashboard/stats", getDashboardStats);
  app.get("/api/dashboard/analytics", getMonthlyAnalytics);

  app.get("/api/fake-accounts", getFakeAccounts);
  app.get("/api/activity-logs", getActivityLogs);

  return app;
}
