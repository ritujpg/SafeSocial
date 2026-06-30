import { RequestHandler } from "express";
import { pool } from "../db";

export const getMonthlyAnalytics: RequestHandler = async (
  _req,
  res
) => {

  try {

    const result = await pool.query(`
      SELECT
        created_at,
        ai_result
      FROM reports;
    `);

    const reports = result.rows;

    const monthNames = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    const monthlyData = monthNames.map((month, index) => {

      const reportsInMonth = reports.filter(
        (report: any) =>
          new Date(report.created_at).getMonth() === index
      );

      return {

        month,

        alerts: reportsInMonth.length,

        cases: reportsInMonth.filter(
          (r: any) =>
            r.ai_result === "Cyberbullying" ||
            r.ai_result === "Fake Account"
        ).length,

        threats: reportsInMonth.filter(
          (r: any) =>
            r.ai_result === "Threat"
        ).length,

      };

    });

    res.json({

      success: true,

      monthlyData,

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message: "Failed to fetch analytics.",

    });

  }

};