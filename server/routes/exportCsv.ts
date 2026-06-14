import { RequestHandler } from "express";
import fs from "fs";
import path from "path";

const reportsFile = path.join(
  process.cwd(),
  "server",
  "data",
  "reports.json"
);

export const exportCsv: RequestHandler = (
  _req,
  res
) => {
  const reports = JSON.parse(
    fs.readFileSync(reportsFile, "utf8")
  );

  const csvRows = [
    "ID,Type,Title,Status,Reported By,Created At",
    ...reports.map(
      (report: any) =>
        `${report.id},${report.type},${report.title},${report.status},${report.reportedBy},${report.createdAt}`
    ),
  ];

  const csvContent = csvRows.join("\n");

  res.setHeader(
    "Content-Type",
    "text/csv"
  );

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=reports.csv"
  );

  res.send(csvContent);
};