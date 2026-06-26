import { RequestHandler } from "express";
import { pool } from "../db";
import { exec } from "child_process";

export const getUsers: RequestHandler = async (
  _req,
  res
) => {
  try {

    const result = await pool.query(`
      SELECT
        id,
        username,
        display_name,
        email,
        risk_score,
        risk_level,
        status,
        created_at
      FROM users
      ORDER BY created_at DESC;
    `);

    const users = result.rows.map((user) => ({
      id: user.id,
      fullName: user.display_name,
      username: user.username,
      email: user.email,
      accountStatus: user.status,
      riskScore: user.risk_score,
      riskLevel: user.risk_level,
      lastLogin: user.created_at,
      alertsCount: 0,
      activityCount: 0,
    }));

    res.json({
      success: true,
      count: users.length,
      users,
    });

  } catch (err: any) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

export const createUser: RequestHandler = async (
  req,
  res
) => {

  try {

    const {
      fullName,
      username,
      email,
      accountStatus,
    } = req.body;

    const dbStatus =
      accountStatus === "active"
        ? "ACTIVE"
        : accountStatus === "suspended"
        ? "SUSPENDED"
        : "UNDER_REVIEW";

    const result = await pool.query(
      `
      INSERT INTO users
      (
        username,
        display_name,
        email,
        risk_score,
        risk_level,
        status,
        created_at
      )
      VALUES
      (
        $1,
        $2,
        $3,
        0,
        'LOW',
        $4,
        NOW()
      )
      RETURNING *;
      `,
      [
        username,
        fullName,
        email,
        dbStatus,
      ]
    );

    exec(
      "python3 server/ml/isolation_forest.py",
      (err, stdout, stderr) => {

        if (err) {
          console.error(err);
          return;
        }

        console.log(stdout);

        if (stderr) {
          console.log(stderr);
        }

      }
    );

    res.status(201).json({
      success: true,
      user: result.rows[0],
    });

  } catch (err: any) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};

export const updateUser: RequestHandler = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const {
      fullName,
      username,
      email,
      accountStatus,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE users
      SET
        username = $1,
        display_name = $2,
        email = $3,
        status = $4
      WHERE id = $5
      RETURNING *;
      `,
      [
        username,
        fullName,
        email,
        accountStatus,
        id,
      ]
    );

    if (result.rowCount === 0) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    }

    res.json({
      success: true,
      user: result.rows[0],
    });

  } catch (err: any) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};

export const deleteUser: RequestHandler = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    await pool.query(
      `
      DELETE FROM users
      WHERE id = $1;
      `,
      [id]
    );

    res.json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (err: any) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};