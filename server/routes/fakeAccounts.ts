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
        u.id AS user_id,
        u.username,
        u.email,
        u.risk_score,
        fa.anomaly_score,
        fa.severity,
        fa.suspicion_reason,
        fa.status,
        fa.detected_at
      FROM fake_accounts fa
      JOIN users u
        ON fa.user_id = u.id
      ORDER BY fa.detected_at DESC;
    `);

    const accounts = await Promise.all(
      result.rows.map(async (row) => {

        // Use the AI-generated risk score from the users table
        const riskScore = Number(row.risk_score);

        // Fetch activity logs
        const logs = await pool.query(
          `
          SELECT
            activity_type,
            description,
            ip_address
          FROM activity_logs
          WHERE user_id = $1
          ORDER BY created_at DESC
          LIMIT 10;
          `,
          [row.user_id]
        );

        return {
          id: row.id,
          username: row.username,
          email: row.email,

          riskScore: riskScore,

          status: row.status,

          createdAt: row.detected_at,

          suspiciousIndicators: row.suspicion_reason
            .split(",")
            .map((item: string) => item.trim()),

          activities: logs.rows.map(
            (log) => log.description
          ),

          ipAddresses: [
            ...new Set(
              logs.rows.map(
                (log) => log.ip_address
              )
            ),
          ],
        };
      })
    );

    res.json(accounts);

  } catch (err: any) {
    console.error("Fake Accounts Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};