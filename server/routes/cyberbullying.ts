import { RequestHandler } from "express";
import { pool } from "../db";

export const getCyberbullyingCases: RequestHandler = async (
  req,
  res
) => {

  try {

    const { userId, role } = req.query;
    console.log("Cyberbullying route:");
    console.log("role =", role);
    console.log("userId =", userId);

    const result =
  role === "ADMIN"

    ? await pool.query(

        `
        SELECT

    c.id,

    c.report_id,

    c.target_username AS reported_user,

    r.title,

    c.message,

    'Cyberbullying' AS prediction,

    CASE
        WHEN c.severity = 'severe' THEN 95
        WHEN c.severity = 'moderate' THEN 75
        ELSE 55
    END AS confidence_score,

    c.severity,

    c.detected_keywords,

    'Random Forest' AS ai_model,

    'Offensive language detected.' AS reason,

    c.detected_at,

    i.id AS investigation_id,

    ir.sent_to_user

FROM cyberbullying c

LEFT JOIN reports r
ON c.report_id = r.id

LEFT JOIN investigations i
ON i.report_id = c.report_id

LEFT JOIN investigation_reports ir
ON ir.investigation_id = i.id
        `

      )

    : await pool.query(

        `
        SELECT

          c.id,

          c.report_id,

          c.target_username,

          c.message,

          c.severity,

          c.detected_keywords,

          c.status,

          c.detected_at,

          i.id AS investigation_id,

          ir.sent_to_user

        FROM cyberbullying c

        LEFT JOIN investigations i
        ON i.report_id = c.report_id

        LEFT JOIN investigation_reports ir
        ON ir.investigation_id = i.id

        WHERE c.user_id = $1

        ORDER BY c.detected_at DESC;
        `,

        [userId]

      );
 const cases = result.rows.map((row) => ({

    id: row.id,

    report_id: row.report_id,

    reported_user: row.reported_user,

    title: row.title,

    message: row.message,

    prediction: row.prediction,

    confidence_score: row.confidence_score,

    severity: row.severity,

    keywords: row.detected_keywords,

    ai_model: row.ai_model,

    reason: row.reason,

    detected_at: row.detected_at,

    investigation_id: row.investigation_id,

    sent_to_user: row.sent_to_user,

}));

    res.json(cases);

  } catch (err: any) {

    console.error("Cyberbullying Error:", err);

    res.status(500).json({

      success: false,

      message: err.message,

    });

  }

};