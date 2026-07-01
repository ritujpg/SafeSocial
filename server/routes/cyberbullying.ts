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

        id,

        target_username,

        message,

        severity,

        detected_keywords,

        status,

        detected_at

      FROM cyberbullying

      WHERE user_id = $1

      ORDER BY detected_at DESC;
      `,

      [userId]

    );

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

    console.error("Cyberbullying Error:", err);

    res.status(500).json({

      success: false,

      message: err.message,

    });

  }

};