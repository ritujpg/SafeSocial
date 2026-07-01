import { Request, Response } from "express";
import { pool } from "../db";
import { generateReportPDF } from "../pdf/generatePdf";
// ======================================
// GENERATE OFFICIAL INVESTIGATION REPORT
// ======================================

export const generateInvestigationReport = async (
  req: Request,
  res: Response
) => {

  try {

    const { investigationId } = req.params;

    // -----------------------------------
    // Get Investigation
    // -----------------------------------

    const investigationResult = await pool.query(

      `
      SELECT *
      FROM investigations
      WHERE id = $1;
      `,

      [investigationId]

    );

    if (investigationResult.rows.length === 0) {

      return res.status(404).json({

        success: false,

        message: "Investigation not found."

      });

    }

    const investigation =
      investigationResult.rows[0];

    // -----------------------------------
    // Get Original Report
    // -----------------------------------

    const reportResult = await pool.query(

      `
      SELECT *
      FROM reports
      WHERE id = $1;
      `,

      [investigation.report_id]

    );

    const report = reportResult.rows[0];

    if (!report) {

      return res.status(404).json({

        success: false,

        message: "Original report not found."

      });

    }

    // -----------------------------------
    // Build AI Summary
    // -----------------------------------

    const aiSummary =

      `The AI system classified this case as ${report.ai_result}
with a confidence score of ${report.confidence}%.
The severity level was assessed as ${investigation.severity}.`;

    // -----------------------------------
    // Incident Summary
    // -----------------------------------

    const incidentSummary =

      `The user reported ${report.ai_result.toLowerCase()}
against ${report.reported_user}. The report was
reviewed and approved before investigation.`;

    // -----------------------------------
    // Investigation Summary
    // -----------------------------------

    const investigationSummary =

      `SafeSocial investigators reviewed the submitted
evidence together with AI analysis before preparing
this official investigation report.`;
    // -----------------------------------
    // Check if report already exists
    // -----------------------------------

    const existingReport = await pool.query(

      `
      SELECT *
      FROM investigation_reports
      WHERE investigation_id = $1;
      `,

      [investigationId]

    );

    if (existingReport.rows.length > 0) {

      return res.json({

        success: true,

        report: existingReport.rows[0],

        message: "Official report already exists."

      });

    }

    // -----------------------------------
    // Create Official Report
    // -----------------------------------

    const title =

      `SafeSocial Official Investigation Report - ${report.ai_result}`;

    const furtherAction =

      `SafeSocial recommends preserving all evidence,
reporting the incident to the relevant platform,
and contacting the National Cyber Crime Portal
if additional legal assistance is required.`;

    const reportInsert = await pool.query(

      `
      INSERT INTO investigation_reports
      (

        investigation_id,

        title,

        incident_summary,

        ai_summary,

        investigation_summary,

        findings,

        recommendations,

        suggested_actions,

        further_action,

        generated_at,

        sent_to_user

      )

      VALUES

      (

        $1,$2,$3,$4,$5,$6,$7,$8,$9,NOW(),FALSE

      )

      RETURNING *;
      `,

      [

        investigationId,

        title,

        incidentSummary,

        aiSummary,

        investigationSummary,

        investigation.findings,

        investigation.recommendations,

        investigation.suggested_actions,

        furtherAction

      ]

    );

    // -----------------------------------
    // Update Investigation
    // -----------------------------------

    await pool.query(

      `
      UPDATE investigations

      SET

        report_generated = TRUE,

        report_generated_at = NOW()

      WHERE id = $1;
      `,

      [investigationId]

    );
        // -----------------------------------
    // Return Generated Report
    // -----------------------------------

    res.json({

      success: true,

      report: reportInsert.rows[0],

      message: "Official investigation report generated successfully."

    });

  } catch (err: any) {

    console.error("Generate Report Error:", err);

    res.status(500).json({

      success: false,

      message: err.message,

    });

  }

};

// ======================================
// GET OFFICIAL REPORT
// ======================================

export const getInvestigationReport = async (
  req: Request,
  res: Response
) => {

  try {

    const { investigationId } = req.params;

    const result = await pool.query(

      `
      SELECT *
      FROM investigation_reports
      WHERE investigation_id = $1;
      `,

      [investigationId]

    );

    res.json({

      success: true,

      report: result.rows[0] || null,

    });

  } catch (err: any) {

    console.error(err);

    res.status(500).json({

      success: false,

      message: err.message,

    });

  }

};

// ======================================
// SEND REPORT TO USER
// ======================================

export const sendReportToUser = async (
  req: Request,
  res: Response
) => {

  try {

    const { investigationId } = req.params;

    const result = await pool.query(

      `
      UPDATE investigation_reports

      SET

        sent_to_user = TRUE

      WHERE investigation_id = $1

      RETURNING *;
      `,

      [investigationId]

    );

    res.json({

      success: true,

      report: result.rows[0],

      message: "Report sent to user successfully."

    });

  } catch (err: any) {

    console.error(err);

    res.status(500).json({

      success: false,

      message: err.message,

    });

  }

};

// ======================================
// DOWNLOAD OFFICIAL PDF
// ======================================

export const downloadInvestigationPDF = async (
  req: Request,
  res: Response
) => {

  try {

    const { investigationId } = req.params;

    const result = await pool.query(

      `
      SELECT *
      FROM investigation_reports
      WHERE investigation_id = $1;
      `,

      [investigationId]

    );

    if (result.rows.length === 0) {

      return res.status(404).json({

        success: false,

        message: "Official report not found."

      });

    }

    const report = result.rows[0];

    const pdf = await generateReportPDF(report);

    res.setHeader(

      "Content-Type",

      "application/pdf"

    );

    res.setHeader(

      "Content-Disposition",

      `attachment; filename=SafeSocial_Report_${investigationId}.pdf`

    );

    res.send(pdf);

  } catch (err: any) {

    console.error(err);

    res.status(500).json({

      success: false,

      message: err.message,

    });

  }

};