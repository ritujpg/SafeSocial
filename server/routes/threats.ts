import { RequestHandler } from "express";
import { pool } from "../db";

export const getThreats: RequestHandler = async (
  _req,
  res
) => {

  try {

    const result = await pool.query(

      `
      SELECT

        tc.id,

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

        r.confidence

      FROM threat_cases tc

      JOIN reports r

      ON tc.message_id = r.id

      ORDER BY tc.created_at DESC;

      `

    );

    res.json(result.rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({

      success: false,

      message: "Failed to fetch threats",

    });

  }

};