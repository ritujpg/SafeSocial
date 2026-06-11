import { RequestHandler } from "express";
import fs from "fs";
import path from "path";

const reportsFile = path.join(__dirname, "../data/reports.json");

export const createReport: RequestHandler = (req, res) => {
  const { type, title, description, reportedBy } = req.body;

  const reports = JSON.parse(
    fs.readFileSync(reportsFile, "utf8")
  );

  const newReport = {
    id: `RPT-${Date.now()}`,
    type,
    title,
    description,
    reportedBy,
    status: "Pending",
    createdAt: new Date().toISOString(),
  };

  reports.push(newReport);

  fs.writeFileSync(
    reportsFile,
    JSON.stringify(reports, null, 2)
  );

  res.json({
    success: true,
    message: "Report submitted successfully",
    report: newReport,
  });
};
export const getReports: RequestHandler = (_req, res) => {
  const reports = JSON.parse(
    fs.readFileSync(reportsFile, "utf8")
  );

  res.json({
    success: true,
    reports,
  });
};
export const updateReport: RequestHandler = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const reports = JSON.parse(
    fs.readFileSync(reportsFile, "utf8")
  );

  const reportIndex = reports.findIndex(
    (report: any) => report.id === id
  );

  if (reportIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Report not found",
    });
  }

  reports[reportIndex].status = status;

  fs.writeFileSync(
    reportsFile,
    JSON.stringify(reports, null, 2)
  );

  res.json({
    success: true,
    message: "Report status updated",
    report: reports[reportIndex],
  });
};