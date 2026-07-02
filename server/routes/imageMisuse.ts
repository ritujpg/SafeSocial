import { RequestHandler } from "express";
import { pool } from "../db";

export const getImageMisuseCases: RequestHandler = async (req, res) => {
  try {
    const { userId, role } = req.query;

    const result =
      role === "ADMIN"
        ? await pool.query(
            `
            SELECT

              im.id,

              im.report_id,

              r.reported_user,

              r.title,

              r.message,

              'Image Misuse' AS prediction,

              im.confidence_score,

              im.severity,

              'CNN' AS ai_model,

              im.reason,

              im.created_at AS detected_at,

              i.id AS investigation_id,

              ir.sent_to_user

            FROM image_misuse_cases im

            JOIN reports r
            ON im.report_id = r.id

            LEFT JOIN investigations i
            ON i.report_id = im.report_id

            LEFT JOIN investigation_reports ir
            ON ir.investigation_id = i.id

            ORDER BY im.created_at DESC;
            `
          )
        : await pool.query(
            `
            SELECT

              im.id,

              im.report_id,

              r.reported_user,

              r.title,

              r.message,

              'Image Misuse' AS prediction,

              im.confidence_score,

              im.severity,

              'CNN' AS ai_model,

              im.reason,

              im.created_at AS detected_at,

              i.id AS investigation_id,

              ir.sent_to_user

            FROM image_misuse_cases im

            JOIN reports r
            ON im.report_id = r.id

            LEFT JOIN investigations i
            ON i.report_id = im.report_id

            LEFT JOIN investigation_reports ir
            ON ir.investigation_id = i.id

            WHERE im.user_id = $1

            ORDER BY im.created_at DESC;
            `,
            [userId]
          );

    const cases = result.rows.map((row) => ({
      id: row.id,
      report_id: row.report_id,
      reported_user: row.reported_user,
      title: row.title,
      message: row.message,
      prediction: row.prediction,
      confidence_score: row.confidence_score,
      severity: row.severity,
      ai_model: row.ai_model,
      reason: row.reason,
      detected_at: row.detected_at,
      investigation_id: row.investigation_id,
      sent_to_user: row.sent_to_user,
    }));

    res.json(cases);
  } catch (err: any) {
    console.error("Image Misuse Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};