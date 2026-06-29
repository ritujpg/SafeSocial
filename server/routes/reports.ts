import { RequestHandler } from "express";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { pool } from "../db";

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

export const createReport: RequestHandler = async (
  req,
  res
) => {
  try {
    const {
      title,
      reportedUser,
      profileUrl,
      message,
      description,
      reportedBy,
    } = req.body;

    console.log(req.body);

    console.log("Message:", message);

    console.log("Profile URL:", profileUrl);

    const result = await pool.query(
      `
      INSERT INTO reports
      (
        title,
        reported_user,
        profile_url,
        message,
        description,
        reported_by
      )

      VALUES
      ($1,$2,$3,$4,$5,$6)

      RETURNING *;
      `,
      [
        title,
        reportedUser,
        profileUrl,
        message,
        description,
        reportedBy,
      ]
    );

    // Keep activity log for now
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

  // --------------------
  // Run AI Analysis
  // --------------------

  const python = spawn(
    "python3",
    [
      "server/ml/analyze_report.py",
      message || ""
    ]
  );

  let output = "";

  python.stdout.on("data", (data) => {
    output += data.toString();
  });

  python.stderr.on("data", (data) => {
    console.error(
      "Python Error:",
      data.toString()
    );
  });

  python.on("close", async () => {

    console.log(
      "Python Output:",
      output
    );

    try {

      const ai = JSON.parse(output);

      await pool.query(

        `
        UPDATE reports

        SET
            ai_status = $1,
            ai_result = $2,
            confidence = $3

        WHERE id = $4
        `,

        [

          "Completed",

          ai.category,

          ai.confidence,

          result.rows[0].id

        ]

      );

      if (ai.category === "Cyberbullying") {

        await pool.query(
          `
          INSERT INTO cyberbullying
          (
            report_id,
            target_username,
            message,
            severity,
            detected_keywords,
            status
          )

          VALUES
          ($1,$2,$3,$4,$5,$6)
          `,
          [
            result.rows[0].id,
            reportedUser,
            message,
            ai.confidence >= 90
              ? "High"
              : ai.confidence >= 70
              ? "Medium"
              : "Low",
            ai.keywords || [],
            "Open"
          ]
        );

        console.log(
          "Cyberbullying case created."
        );

      }

      if (ai.category === "Threat") {

        await pool.query(
          `
          INSERT INTO threat_cases
          (
            message_id,
            threat_type,
            confidence_score,
            severity,
            status
          )

          VALUES
          ($1,$2,$3,$4,$5)
          `,
          [
            result.rows[0].id,
            "Direct Threat",
            ai.confidence,
            ai.confidence >= 90
              ? "High"
              : ai.confidence >= 70
              ? "Medium"
              : "Low",
            "Open"
          ]
        );

        console.log(
          "Threat case created."
        );

      }

      console.log(
        "AI Result Saved."
      );

    } catch (err) {

      console.error(err);

    }

  });

  res.json({
    success: true,
    message: "Report submitted successfully",
    report: result.rows[0],
  });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to submit report.",
    });
  }
};
export const getReports: RequestHandler = async (
  _req,
  res
) => {
  try {

    const result = await pool.query(
      `
      SELECT *
      FROM reports
      ORDER BY created_at DESC;
      `
    );

    

    res.json({
      success: true,
      reports: result.rows,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch reports.",
    });

  }
};

export const updateReport: RequestHandler = async (
  req,
  res
) => {
  try {

    const { id } = req.params;

    const { status } = req.body;

    const result = await pool.query(

      `
      UPDATE reports

      SET status = $1

      WHERE id = $2

      RETURNING *;
      `,

      [
        status,
        id,
      ]

    );

    if (result.rows.length === 0) {

      return res.status(404).json({

        success: false,

        message: "Report not found.",

      });

    }

    res.json({

      success: true,

      message: "Report updated successfully.",

      report: result.rows[0],

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Failed to update report.",

    });

  }
};

export const getReportAnalytics: RequestHandler = async (
  _req,
  res
) => {
  try {

    const result = await pool.query(
      `
      SELECT *
      FROM reports;
      `
    );

    const reports = result.rows;

    const submitted = reports.filter(
      (r: any) => r.status === "Submitted"
    ).length;

    const underReview = reports.filter(
      (r: any) => r.status === "Under Review"
    ).length;

    const resolved = reports.filter(
      (r: any) => r.status === "Resolved"
    ).length;

    const rejected = reports.filter(
      (r: any) => r.status === "Rejected"
    ).length;

    res.json({

      success: true,

      analytics: {

        submitted,

        underReview,

        resolved,

        rejected,

      },

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Failed to fetch analytics.",

    });

  }
};
export const exportReportsPDF: RequestHandler = async (
  _req,
  res
) => {
  try {

    const result = await pool.query(
      `
      SELECT *
      FROM reports
      ORDER BY created_at DESC;
      `
    );

    const reports = result.rows;

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
        .fontSize(14)
        .text(`Report ${index + 1}`);

      doc.moveDown(0.5);

      doc.text(`ID: ${report.id}`);
      doc.text(`Title: ${report.title}`);
      doc.text(`Reported User: ${report.reported_user}`);
      doc.text(`Reported By: ${report.reported_by}`);
      doc.text(`Status: ${report.status}`);

      doc.text(
        `AI Status: ${
          report.ai_status || "Pending Analysis"
        }`
      );

      doc.text(
        `AI Result: ${
          report.ai_result || "-"
        }`
      );

      doc.text(
        `Confidence: ${
          report.confidence
            ? report.confidence + "%"
            : "-"
        }`
      );

      doc.moveDown();

      doc.text("Description:");

      doc.text(
        report.description || "-"
      );

      doc.moveDown();

      if (report.message) {

        doc.text("Message:");

        doc.text(report.message);

        doc.moveDown();

      }

      doc.text(
        `Created At: ${new Date(
          report.created_at
        ).toLocaleString()}`
      );

      doc.moveDown();
      doc.moveDown();

    });

    doc.end();

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Failed to export reports.",

    });

  }
};