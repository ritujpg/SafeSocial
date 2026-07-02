import { RequestHandler } from "express";
import { pool } from "../db";

export const getFakeAccounts: RequestHandler = async (
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

    fa.id,

    fa.report_id,

    r.reported_user AS reported_user,

    r.title,

    r.message,

    'Fake Account' AS prediction,

    ROUND(fa.anomaly_score::numeric, 0) AS confidence_score,

    fa.severity,

    'Isolation Forest' AS ai_model,

    'Suspicious account behaviour detected.' AS reason,

    fa.detected_at,

    i.id AS investigation_id,

    ir.sent_to_user

FROM fake_accounts fa

JOIN reports r
ON fa.report_id = r.id

LEFT JOIN investigations i
ON i.report_id = fa.report_id

LEFT JOIN investigation_reports ir
ON ir.investigation_id = i.id

ORDER BY fa.detected_at DESC;
        `

      )

    : await pool.query(

        `
       SELECT

    fa.id,

    fa.report_id,

    r.reported_user AS reported_user,

    r.title,

    r.message,

    'Fake Account' AS prediction,

    ROUND((fa.anomaly_score * 100)::numeric, 0) AS confidence_score,

    fa.severity,

    'Isolation Forest' AS ai_model,

    'Suspicious account behaviour detected.' AS reason,

    fa.detected_at,

    i.id AS investigation_id,

    ir.sent_to_user

FROM fake_accounts fa

JOIN reports r
ON fa.report_id = r.id

LEFT JOIN investigations i
ON i.report_id = fa.report_id

LEFT JOIN investigation_reports ir
ON ir.investigation_id = i.id

WHERE fa.user_id = $1

ORDER BY fa.detected_at DESC;
        `,

        [userId]

      );

    res.json(result.rows);

  } catch (err: any) {

    console.error(
      "Fake Accounts Error:",
      err
    );

    res.status(500).json({

      success: false,

      message: err.message,

    });

  }

};