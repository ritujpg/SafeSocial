import { RequestHandler } from "express";
import { pool } from "../db";

export const getCyberbullyingCases: RequestHandler = async (
  _req,
  res
) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        target_username,
        message,
        severity,
        detected_keywords,
        status,
        detected_at
      FROM cyberbullying
      ORDER BY detected_at DESC;
    `);

    const cases = result.rows.map((row) => ({
      id: row.id,
      targetUsername: row.target_username,
      message: row.message,
      severity: row.severity.toLowerCase(),
      keywords: row.detected_keywords,
      status: row.status,
      timestamp: row.detected_at,
    }));

    res.json(cases);

  } catch (err: any) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};