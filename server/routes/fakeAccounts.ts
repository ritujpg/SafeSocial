import { Request, Response } from "express";
import { pool } from "../db";

export const getFakeAccounts = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(`
    SELECT

        fa.id,

        fa.anomaly_score,

        fa.severity,

        fa.suspicion_reason,

        fa.status,

        fa.detected_at,

        r.title,

        r.reported_user,

        r.message,

        r.description,

        r.confidence

    FROM fake_accounts fa

    JOIN reports r

    ON fa.report_id = r.id

    ORDER BY fa.detected_at DESC;
    `);

   res.json(result.rows);
   
  } catch (err: any) {
    console.error("Fake Accounts Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};