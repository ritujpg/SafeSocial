import { RequestHandler } from "express";
import { pool } from "../db";

export const register: RequestHandler = async (
  req,
  res
) => {

  try {

    const {

      name,

      username,

      email,

      password,

    } = req.body;

    const existing = await pool.query(

      `
      SELECT *
      FROM users
      WHERE
        username = $1
        OR email = $2;
      `,

      [

        username,

        email,

      ]

    );

    if (existing.rows.length > 0) {

      return res.status(400).json({

        success: false,

        message: "Username or Email already exists.",

      });

    }

    const result = await pool.query(

      `
      INSERT INTO users
      (

        username,

        display_name,

        email,

        password_hash,

        risk_score,

        risk_level,

        status

      )

      VALUES
      (

        $1,

        $2,

        $3,

        $4,

        0,

        'LOW',

        'ACTIVE'

      )

      RETURNING *;
      `,

      [

        username,

        name,

        email,

        password,

      ]

    );

    res.json({

      success: true,

      message: "Registration Successful",

      user: result.rows[0],

    });

  }

  catch (err) {

    console.error(err);

    res.status(500).json({

      success: false,

      message: "Registration Failed",

    });

  }

};

export const login: RequestHandler = async (

  req,

  res

) => {

  try {

    const {

      email,

      password,

    } = req.body;

    const result = await pool.query(

      `
      SELECT *
      FROM users
      WHERE
      (

        email = $1

        OR

        username = $1

      )

      AND

      password_hash = $2;
      `,

      [

        email,

        password,

      ]

    );

    if (result.rows.length === 0) {

      return res.status(401).json({

        success: false,

        message: "Invalid Credentials",

      });

    }

    res.json({

      success: true,

      message: "Login Successful",

      user: result.rows[0],

    });

  }

  catch (err) {

    console.error(err);

    res.status(500).json({

      success: false,

      message: "Login Failed",

    });

  }

};