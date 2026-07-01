import { RequestHandler } from "express";
import { pool } from "../db";

export const getAlerts: RequestHandler = async (
  _req,
  res
) => {

  try {

    const result = await pool.query(

      `
      SELECT

        r.id,

        r.user_id,

        r.title,

        r.reported_user,

        r.message,

        r.description,

        r.ai_result,

        r.confidence,

        r.status,

        r.created_at,

        u.username,

        u.display_name,

        u.email

      FROM reports r

      JOIN users u
      ON r.user_id = u.id

      WHERE r.status = 'PENDING'

      ORDER BY r.created_at DESC;
      `

    );

    res.json({

      success: true,

      alerts: result.rows,

    });

  } catch (err: any) {

    console.error("Alerts Error:", err);

    res.status(500).json({

      success: false,

      message: err.message,

    });

  }

};