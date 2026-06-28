import { Request, Response } from "express";
import { pool } from "../db";

// ==============================
// GET ALL INVESTIGATIONS
// ==============================
export const getInvestigations = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM investigations
      ORDER BY opened_at DESC;
    `);

    res.json({
      success: true,
      investigations: result.rows,
    });

  } catch (err: any) {
    console.error("Investigations Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================
// CREATE INVESTIGATION
// ==============================
export const createInvestigation = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      source_case_id,
      source_module,
      target_username,
      severity,
      evidence,
      assigned_to,
      created_by,
      findings,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO investigations
      (
        source_case_id,
        source_module,
        target_username,
        severity,
        evidence,
        assigned_to,
        created_by,
        findings,
        status,
        opened_at
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,'OPEN',NOW())
      RETURNING *;
      `,
      [
        source_case_id,
        source_module,
        target_username,
        severity,
        evidence,
        assigned_to,
        created_by,
        findings,
      ]
    );

    res.json({
      success: true,
      investigation: result.rows[0],
    });

  } catch (err: any) {
    console.error("Create Investigation Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};