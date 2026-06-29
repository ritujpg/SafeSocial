import { RequestHandler } from "express";
import { pool } from "../db";

export const getThreats: RequestHandler = async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        tc.id,
        tc.threat_type,
        tc.confidence_score,
        tc.severity,
        tc.status,
        tc.created_at,

        m.message_text,

        sender.username AS sender,
        receiver.username AS receiver

      FROM threat_cases tc

      JOIN messages m
        ON tc.message_id = m.id

      JOIN users sender
        ON m.sender_id = sender.id

      JOIN users receiver
        ON m.receiver_id = receiver.id

      ORDER BY tc.created_at DESC;
    `);

    res.json(result.rows);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch threats",
    });
  }
};