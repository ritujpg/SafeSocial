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

   const { userId } = req.query;

    const result = userId
      ? await pool.query(
          `
          SELECT *
          FROM investigations
          WHERE user_id = $1
          ORDER BY opened_at DESC;
          `,
          [userId]
        )
      : await pool.query(
          `
          SELECT *
          FROM investigations
          ORDER BY opened_at DESC;
          `
        );

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

      report_id,

      user_id,

      target_username,

      severity,

      evidence,

      request_reason,

      priority,

    } = req.body;

    const result = await pool.query(

      `
      INSERT INTO investigations
      (

        report_id,

        user_id,

        target_username,

        severity,

        evidence,

        request_reason,

        priority,

        status,

        opened_at

      )

      VALUES

      (

        $1,$2,$3,$4,$5,$6,$7,'PENDING',NOW()

      )

      RETURNING *;
      `,

      [

        report_id,

        user_id,

        target_username,

        severity,

        evidence,

        request_reason,

        priority,

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
// ==============================
// COMPLETE INVESTIGATION
// ==============================

export const completeInvestigation = async (
  req: Request,
  res: Response
) => {

  try {

    const { id } = req.params;

    const {

      assigned_to,

      findings,

      recommendations,

      suggested_actions,

      can_assist,

      final_notes,

    } = req.body;

    const result = await pool.query(

      `
      UPDATE investigations

      SET

        assigned_to = $2,

        findings = $3,

        recommendations = $4,

        suggested_actions = $5,

        can_assist = $6,

        final_notes = $7,

        status = 'COMPLETED',

        closed_at = NOW(),

        updated_at = NOW()

      WHERE id = $1

      RETURNING *;
      `,

      [

        id,

        assigned_to,

        findings,

        recommendations,

        suggested_actions,

        can_assist,

        final_notes,

      ]

    );

    res.json({

      success: true,

      investigation: result.rows[0],

    });

  } catch (err: any) {

    console.error(err);

    res.status(500).json({

      success: false,

      message: err.message,

    });

  }

};