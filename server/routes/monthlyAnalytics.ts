import { RequestHandler } from "express";
import fs from "fs";
import path from "path";

const reportsFile = path.join(
  process.cwd(),
  "server",
  "data",
  "reports.json"
);

export const getMonthlyAnalytics: RequestHandler = (
  _req,
  res
) => {
  const reports = JSON.parse(
    fs.readFileSync(reportsFile, "utf8")
  );

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthlyData = monthNames.map((month, index) => {
    const reportsInMonth = reports.filter(
      (report: any) =>
        new Date(report.createdAt).getMonth() === index
    );

    return {
      month,
      alerts: reportsInMonth.length,
      cases: reportsInMonth.filter(
        (r: any) =>
          r.type === "Fake Account" ||
          r.type === "Cyberbullying"
      ).length,
      threats: reportsInMonth.filter(
        (r: any) => r.type === "Threat"
      ).length,
    };
  });

  res.json({
    success: true,
    monthlyData,
  });
};