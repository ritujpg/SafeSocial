import { RequestHandler } from "express";
import fs from "fs";
import path from "path";

const reportsFile = path.join(
  process.cwd(),
  "server",
  "data",
  "reports.json"
);

export const getDashboardStats: RequestHandler = (
  _req,
  res
) => {
  const reports = JSON.parse(
    fs.readFileSync(reportsFile, "utf8")
  );

  const totalReports = reports.length;

  const pendingReports = reports.filter(
    (report: any) => report.status === "Pending"
  ).length;

  const investigatingReports = reports.filter(
    (report: any) => report.status === "Investigating"
  ).length;

  const resolvedReports = reports.filter(
    (report: any) => report.status === "Resolved"
  ).length;

  res.json({
    success: true,
    stats: {
      totalReports,
      pendingReports,
      investigatingReports,
      resolvedReports,
    },
    riskLevels: {
      low: resolvedReports,
      medium: investigatingReports,
      high: pendingReports,
      critical: 0,
    },
  });
};

export const getMonthlyAnalytics: RequestHandler = (
  _req,
  res
) => {
  const reports = JSON.parse(
    fs.readFileSync(reportsFile, "utf8")
  );

  const analytics = {
    fakeAccounts: reports.filter(
      (r: any) => r.type === "Fake Account"
    ).length,

    cyberbullying: reports.filter(
      (r: any) => r.type === "Cyberbullying"
    ).length,

    threats: reports.filter(
      (r: any) => r.type === "Threat"
    ).length,
  };

  res.json({
    success: true,
    analytics,
  });
};