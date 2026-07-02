import { getCyberbullyingCases } from "./routes/cyberbullying";
import { getActivityLogs } from "./routes/activityLogs";
import "dotenv/config";
import express from "express";
import { getFakeAccounts } from "./routes/fakeAccounts";
import { getImageMisuseCases } from "./routes/imageMisuse";
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
  deleteReport,
  getReportAnalytics,
  exportReportsPDF,
} from "./routes/reports";
import {getMonthlyAnalytics } from "./routes/monthlyAnalytics";
import { exportCsv } from "./routes/exportCsv";

import { getThreats } from "./routes/threats";
import { getAlerts } from "./routes/alerts";
import {
  approveAlert,
  rejectAlert,
} from "./routes/alertActions";
import {
  getInvestigations,
  createInvestigation,
  completeInvestigation,
} from "./routes/investigations";

import {

  generateInvestigationReport,

  getInvestigationReport,

  sendReportToUser,

  downloadInvestigationPDF,

} from "./routes/investigationReports";



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
  app.delete(
    "/api/reports/:id",
    deleteReport
  );
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
  app.get("/api/cyberbullying", getCyberbullyingCases);
  app.get("/api/investigations", getInvestigations);
  app.patch(
  "/api/investigations/:id",
  completeInvestigation
);
  app.post("/api/investigations", createInvestigation);
  app.get("/api/threats", getThreats);
  app.get("/api/alerts", getAlerts);
  app.post(
    "/api/alerts/:id/approve",
    approveAlert
  );

  app.post(
    "/api/alerts/:id/reject",
    rejectAlert
  );

  app.post(
  "/api/investigation-reports/:investigationId/generate",
  generateInvestigationReport
);

app.get(
  "/api/investigation-reports/:investigationId",
  getInvestigationReport
);

app.patch(
  "/api/investigation-reports/:investigationId/send",
  sendReportToUser
);

app.get(
  "/api/investigation-reports/:investigationId/pdf",
  downloadInvestigationPDF
);

app.get("/api/image-misuse", getImageMisuseCases);

  return app;
}
