import { RequestHandler } from "express";
import { pool } from "../db";

export const getCyberbullyingCases: RequestHandler = async (
  req,
  res
) => {

  try {

    const { userId } = req.query;

    const result = await pool.query(

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

      investigation_id: row.investigation_id,

      sent_to_user: row.sent_to_user,

      targetUsername: row.target_username,

      message: row.message,

      severity: row.severity.toLowerCase(),

      keywords: row.detected_keywords,

      status: row.status,

      timestamp: row.detected_at,

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