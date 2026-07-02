import { RequestHandler } from "express";
import { pool } from "../db";

export const getFakeAccounts: RequestHandler = async (
  req,
  res
) => {

  try {

    const { userId } = req.query;

    const result = await pool.query(

      `
      SELECT

        fa.id,

        fa.report_id,

        fa.anomaly_score,

        fa.severity,

        fa.suspicion_reason,

        fa.status,

        fa.detected_at,

        r.title,

        r.reported_user,

        r.message,

        r.description,

        r.confidence,

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