import { RequestHandler } from "express";
import { pool } from "../db";

export const getActivityLogs: RequestHandler = async (
  req,
  res
) => {
  try {

    const { userId } = req.query;

    let query = `
      SELECT
        id,
        user_id,
        activity_type,
        description,
        ip_address,
        created_at
      FROM activity_logs
    `;

    const values: any[] = [];

    if (userId) {
      query += " WHERE user_id = $1";
      values.push(userId);
    }

    query += " ORDER BY created_at DESC";

    const result = await pool.query(query, values);

    const logs = result.rows.map((log) => ({
      id: log.id,
      userId: log.user_id,
      activity: log.activity_type,
      description: log.description,
      ipAddress: log.ip_address,
      timestamp: log.created_at,
    }));

    res.json({
      success: true,
      count: logs.length,
      logs,
    });

  } catch (err: any) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};