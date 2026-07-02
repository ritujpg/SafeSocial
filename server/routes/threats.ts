import { RequestHandler } from "express";
import { pool } from "../db";

export const getThreats: RequestHandler = async (
  req,
  res
) => {

  try {

    const { userId, role } = req.query;

   const result =
  role === "ADMIN"

    ? await pool.query(

        `
        SELECT

          tc.id,

          tc.message_id AS report_id,

          tc.threat_type,

          tc.confidence_score,

          tc.severity,

          tc.status,

          tc.created_at,

          r.title,

          r.reported_user,

          r.message,

          r.description,

          r.ai_result,

          r.confidence,

          i.id AS investigation_id,

          ir.sent_to_user

        FROM threat_cases tc

        JOIN reports r
        ON tc.message_id = r.id

        LEFT JOIN investigations i
        ON i.report_id = tc.message_id

        LEFT JOIN investigation_reports ir
        ON ir.investigation_id = i.id

        ORDER BY tc.created_at DESC;
        `

      )

    : await pool.query(

        `
        SELECT

          tc.id,

          tc.message_id AS report_id,

          tc.threat_type,

          tc.confidence_score,

          tc.severity,

          tc.status,

          tc.created_at,

          r.title,

          r.reported_user,

          r.message,

          r.description,

          r.ai_result,

          r.confidence,

          i.id AS investigation_id,

          ir.sent_to_user

        FROM threat_cases tc

        JOIN reports r
        ON tc.message_id = r.id

        LEFT JOIN investigations i
        ON i.report_id = tc.message_id

        LEFT JOIN investigation_reports ir
        ON ir.investigation_id = i.id

        WHERE tc.user_id = $1

        ORDER BY tc.created_at DESC;
        `,

        [userId]

      );

    res.json(result.rows);

  } catch (err: any) {

    console.error("Threats Error:", err);

    res.status(500).json({

      success: false,

      message: err.message,

    });

  }

};