import { RequestHandler } from "express";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import { pool } from "../db";

// ----------------------------
// Local JSON files
// ----------------------------

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

// ----------------------------
// Create Report
// ----------------------------

export const createReport: RequestHandler = async (
  req,
  res
) => {

  try {

    const {

      userId,

      title,

      reportedUser,

      profileUrl,

      message,

      description,

      reportedBy,

    } = req.body;

    // ----------------------------
    // Save Report
    // ----------------------------

    const result = await pool.query(

      `
      INSERT INTO reports
        (
          user_id,
          title,
          reported_user,
          profile_url,
          message,
          description,
          reported_by
        )

        VALUES
        ($1,$2,$3,$4,$5,$6,$7)

      RETURNING *;
      `,

      [
        userId,
        title,
        reportedUser,
        profileUrl,
        message,
        description,
        reportedBy,
      ]

    );

    // ----------------------------
    // Activity Log
    // ----------------------------

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

    // ----------------------------
    // Run Python AI
    // ----------------------------

    const python = spawn(
      "python3",
      [
        "server/ml/analyze_report.py",
        message || description || ""
      ]
    );

    let output = "";

    python.stdout.on(
      "data",
      (data) => {

        output += data.toString();

      }
    );

    python.stderr.on(
      "data",
      (data) => {

        console.error(
          "Python Error:",
          data.toString()
        );

      }
    );

    python.on(
      "close",
      async () => {

        try {

          console.log(
            "Python Output:",
            output
          );

          const ai = JSON.parse(output);

          // ----------------------------
          // Update Report AI Result
          // ----------------------------

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

              result.rows[0].id,

            ]

          );

                    // --------------------------------
          // Cyberbullying
          // --------------------------------

          if (ai.category === "Cyberbullying") {

            await pool.query(

              `
              INSERT INTO cyberbullying
              (
                user_id,
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
                  userId,
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

          // --------------------------------
          // Threat
          // --------------------------------

          if (ai.category === "Threat") {

            console.log("Entered Threat block");

            console.log("AI:", ai);

            console.log("Report ID:", result.rows[0].id);

            await pool.query(

              `
              INSERT INTO threat_cases
              (
                user_id,
                message_id,
                threat_type,
                confidence_score,
                severity,
                status
              )

              VALUES
              ($1,$2,$3,$4,$5,$6)

              RETURNING *;
              `,

              

                [
                  userId,
                  result.rows[0].id,

                "Direct Threat",

                ai.confidence,

                ai.confidence >= 90
                  ? "CRITICAL"
                  : ai.confidence >= 70
                  ? "HIGH"
                  : "MEDIUM",

                "OPEN"

              ]

            );

            console.log(
              "Threat case created."
            );

          }

         // --------------------------------
        // Fake Account
        // --------------------------------

        if (ai.category === "Fake Account") {

          console.log("Entered Fake Account block");

          console.log("AI:", ai);

          console.log("Report ID:", result.rows[0].id);

          console.log("=== ENTERED FAKE ACCOUNT BLOCK ===");
          try {
            console.log("Attempting fake account insert...");
            await pool.query(

              `
              INSERT INTO fake_accounts
              (
                user_id,
                report_id,
                suspicion_reason,
                anomaly_score,
                severity,
                status
              )

              VALUES
              ($1,$2,$3,$4,$5,$6)
              `,

              

                [
                  userId,
                  result.rows[0].id,

                description || message,

                ai.confidence,

                ai.confidence >= 90
                  ? "HIGH"
                  : ai.confidence >= 70
                  ? "MEDIUM"
                  : "LOW",

                "ACTIVE"

              ]

            );

            console.log("Fake Account case created.");

          } catch (error) {

            console.error(
              "Fake Account Insert Error:",
              error
            );

          }

        }
          console.log(
            "AI Analysis Completed."
          );

        } catch (error) {

          console.error(
            "AI Error:",
            error
          );

        }

      }
      
    );

    res.json({

      success: true,

      message:
        "Report submitted successfully",

      report: result.rows[0],

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message:
        "Failed to submit report.",

    });

  }

};

// ----------------------------
// Get Reports
// ----------------------------

export const getReports: RequestHandler = async (
  _req,
  res
) => {

  try {

    const { userId } = _req.query;

    const result = await pool.query(

    `
    SELECT *
    FROM reports
    WHERE
    user_deleted = FALSE
    AND user_id = $1
    ORDER BY created_at DESC;
    `,

    [userId]

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

// ----------------------------
// Update Report Status
// ----------------------------

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
        id
      ]

    );

    if (result.rows.length === 0) {

      return res.status(404).json({

        success: false,

        message: "Report not found."

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

// ----------------------------
// Analytics
// ----------------------------

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
      (r: any) =>
        r.status === "Pending" ||
        r.status === "Under Review"
    ).length;

    const resolved = reports.filter(
      (r: any) =>
        r.status === "Resolved"
    ).length;

    const rejected = reports.filter(
      (r: any) =>
        r.status === "Rejected"
    ).length;

    res.json({

      success: true,

      analytics: {

        submitted,

        underReview,

        resolved,

        rejected,

      }

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message:
        "Failed to fetch analytics.",

    });

  }

};
// ----------------------------
// Export Reports PDF
// ----------------------------

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
      .text(
        "SafeSocial Reports",
        {
          align: "center",
        }
      );

    doc.moveDown();

    reports.forEach(
      (report: any, index: number) => {

        doc
          .fontSize(14)
          .text(
            `Report ${index + 1}`
          );

        doc.moveDown(0.5);

        doc.text(`ID: ${report.id}`);

        doc.text(
          `Title: ${report.title}`
        );

        doc.text(
          `Reported User: ${report.reported_user}`
        );

        doc.text(
          `Reported By: ${report.reported_by}`
        );

        doc.text(
          `Status: ${report.status}`
        );

        doc.text(
          `AI Status: ${
            report.ai_status ||
            "Pending Analysis"
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

          doc.text(
            report.message
          );

          doc.moveDown();

        }

        doc.text(
          `Created At: ${new Date(
            report.created_at
          ).toLocaleString()}`
        );

        doc.moveDown();
        doc.moveDown();

      }

    );

    doc.end();

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message:
        "Failed to export reports.",

    });

  }

};

// ----------------------------
// Delete Report
// ----------------------------

export const deleteReport: RequestHandler = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    await pool.query(

      `
      UPDATE reports

      SET user_deleted = TRUE

      WHERE id = $1;
      `,

      [id]

    );

    res.json({

      success: true,

      message:
        "Report removed successfully."

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message:
        "Failed to remove report."

    });

  }

};