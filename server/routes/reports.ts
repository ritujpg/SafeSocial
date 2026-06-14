import { RequestHandler } from "express";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";

// Use project root paths instead of __dirname
const reportsFile = path.join(
  process.cwd(),
  "server",
  "data",
  "reports.json"
);

const logsFile = path.join(
  process.cwd(),
  "server",
  "data",
  "activityLogs.json"
);

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

  const logs = JSON.parse(
    fs.readFileSync(logsFile, "utf8")
  );

  logs.push({
    action: "Report Created",
    details: title,
    timestamp: new Date().toISOString(),
  });

  fs.writeFileSync(
    logsFile,
    JSON.stringify(logs, null, 2)
  );

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

export const getReportAnalytics: RequestHandler = (
  _req,
  res
) => {
  const reports = JSON.parse(
    fs.readFileSync(reportsFile, "utf8")
  );

  const fakeAccounts = reports.filter(
    (report: any) => report.type === "Fake Account"
  ).length;

  const cyberbullying = reports.filter(
    (report: any) => report.type === "Cyberbullying"
  ).length;

  const threats = reports.filter(
    (report: any) => report.type === "Threat"
  ).length;

  const pending = reports.filter(
    (report: any) => report.status === "Pending"
  ).length;

  const investigating = reports.filter(
    (report: any) => report.status === "Investigating"
  ).length;

  const resolved = reports.filter(
    (report: any) => report.status === "Resolved"
  ).length;

  res.json({
    success: true,
    analytics: {
      fakeAccounts,
      cyberbullying,
      threats,
      pending,
      investigating,
      resolved,
    },
  });
};

export const exportReportsPDF: RequestHandler = (
  _req,
  res
) => {
  const reports = JSON.parse(
    fs.readFileSync(reportsFile, "utf8")
  );

  const doc = new PDFDocument();

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=reports.pdf"
  );

  doc.pipe(res);

  doc
    .fontSize(20)
    .text("SafeSocial Reports", {
      align: "center",
    });

  doc.moveDown();

  reports.forEach((report: any, index: number) => {
    doc
      .fontSize(12)
      .text(`Report ${index + 1}`);

    doc.text(`ID: ${report.id}`);
    doc.text(`Type: ${report.type}`);
    doc.text(`Title: ${report.title}`);
    doc.text(`Status: ${report.status}`);
    doc.text(`Reported By: ${report.reportedBy}`);
    doc.text(`Created At: ${report.createdAt}`);

    doc.moveDown();
  });

  doc.end();
};