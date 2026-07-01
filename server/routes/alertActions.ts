import { RequestHandler } from "express";
import { pool } from "../db";

// ======================================
// APPROVE ALERT
// ======================================

export const approveAlert: RequestHandler = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const {

      adminId,

      actions,

      notes,

    } = req.body;

    // -------------------------
    // Get Report
    // -------------------------

    const reportResult = await pool.query(

      `
      SELECT *
      FROM reports
      WHERE id = $1;
      `,

      [id]

    );

    if (reportResult.rows.length === 0) {

      return res.status(404).json({

        success: false,

        message: "Report not found."

      });

    }

    const report = reportResult.rows[0];

    // -------------------------
    // Update Report
    // -------------------------

    await pool.query(

        `
        UPDATE reports

        SET

            status = 'APPROVED',

            reviewed_by = $2,

            reviewed_at = NOW()

        WHERE id = $1;
        `,

        [

            id,

            adminId

        ]

        );

    // -------------------------
    // Insert into Module Tables
    // -------------------------

    switch (report.ai_result) {

      case "Threat":

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
          `,

          [

            report.user_id,

            report.id,

            "Direct Threat",

            report.confidence,

            report.confidence >= 90
              ? "CRITICAL"
              : report.confidence >= 70
              ? "HIGH"
              : "MEDIUM",

            "OPEN"

          ]

        );

        break;

      case "Cyberbullying":

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
          ($1,$2,$3,$4,$5,$6,$7)
          `,

          [

            report.user_id,

            report.id,

            report.reported_user,

            report.message,

            report.confidence >= 90
              ? "HIGH"
              : report.confidence >= 70
              ? "MEDIUM"
              : "LOW",

            [],

            "OPEN"

          ]

        );

        break;

      case "Fake Account":

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

            report.user_id,

            report.id,

            report.description,

            report.confidence,

            report.confidence >= 90
              ? "HIGH"
              : report.confidence >= 70
              ? "MEDIUM"
              : "LOW",

            "ACTIVE"

          ]

        );

        break;

      case "Image Misuse":

        await pool.query(

          `
          INSERT INTO image_misuse_cases
          (
            user_id,
            image_hash,
            original_owner,
            misuse_type,
            severity,
            status
          )

          VALUES
          ($1,$2,$3,$4,$5,$6)
          `,

          [

            report.user_id,

            "",

            report.reported_user,

            "Image Misuse",

            report.confidence >= 90
              ? "HIGH"
              : report.confidence >= 70
              ? "MEDIUM"
              : "LOW",

            "OPEN"

          ]

        );

        break;

    }

    // -------------------------
    // Save Case Actions
    // -------------------------

    await pool.query(

      `
      INSERT INTO case_actions
      (
        report_id,
        admin_id,
        action_type,
        notes
      )

      VALUES
      ($1,$2,$3,$4)
      `,

      [

        report.id,

        adminId,

        actions.join(", "),

        notes

      ]

    );

    res.json({

      success: true,

      message: "Report approved."

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
// REJECT ALERT
// ======================================

export const rejectAlert: RequestHandler = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const {

      adminId,

      reason,

      comments,

    } = req.body;

    await pool.query(

        `
        UPDATE reports

        SET

            status='REJECTED',

            reviewed_by=$2,

            reviewed_at=NOW()

        WHERE id=$1;
        `,

        [

            id,

            adminId

        ]

        );

    await pool.query(

      `
      INSERT INTO ai_feedback
      (
        report_id,
        admin_id,
        reason,
        comments
      )

      VALUES
      ($1,$2,$3,$4)
      `,

      [

        id,

        adminId,

        reason,

        comments

      ]

    );

    res.json({

      success: true,

      message: "Report rejected."

    });

  } catch (err: any) {

    console.error(err);

    res.status(500).json({

      success: false,

      message: err.message,

    });

  }

};