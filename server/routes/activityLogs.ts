import { RequestHandler } from "express";
import fs from "fs";
import path from "path";

const logsFile = path.join(
  process.cwd(),
  "server",
  "data",
  "activityLogs.json"
);

export const getActivityLogs: RequestHandler = (
  _req,
  res
) => {
  const logs = JSON.parse(
    fs.readFileSync(logsFile, "utf8")
  );

  res.json({
    success: true,
    count: logs.length,
    logs,
  });
};