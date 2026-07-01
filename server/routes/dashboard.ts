import { RequestHandler } from "express";
import { pool } from "../db";

export const getDashboardStats: RequestHandler = async (
  req,
  res
) => { const { userId } = req.query;

  try {

    const [

      users,

      fakeAccounts,

      cyberbullying,

      threats,

      imageMisuse,

      highRiskUsers,

      reports,

    ] = await Promise.all([

      pool.query(
        `
        SELECT COUNT(*)::int AS count
        FROM reports
        WHERE user_id = $1;
        `,
        [userId]
      ),
      
      pool.query(
`
        SELECT COUNT(*)::int AS count
        FROM fake_accounts
        WHERE user_id = $1;
        `,
        [userId]
        ),

      pool.query(
        `
        SELECT COUNT(*)::int AS count
        FROM cyberbullying
        WHERE user_id = $1;
        `,
        [userId]
      ),

      pool.query(
        `
        SELECT COUNT(*)::int AS count
        FROM threat_cases
        WHERE user_id = $1;
        `,
        [userId]
      ),

      pool.query(
        `
        SELECT COUNT(*)::int AS count
        FROM image_misuse_cases
        WHERE user_id = $1;
        `,
        [userId]
      ),

      pool.query(
        `
        SELECT COUNT(*)::int AS count
        FROM reports
        WHERE
          user_id = $1
          AND confidence >= 80;
        `,
        [userId]
      ),


      pool.query(
        `
        SELECT
          created_at,
          ai_result
        FROM reports
        WHERE user_id = $1
        ORDER BY created_at ASC;
        `,
        [userId]
      ),

    ]);

    // --------------------------
    // Monthly Graph
    // --------------------------

    const monthNames = [

      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",

    ];

    const activityTrend = monthNames.map(
      (month, index) => {

        const reportsInMonth =
          reports.rows.filter(
            (report: any) =>
              new Date(
                report.created_at
              ).getMonth() === index
          );

        return {

          month,

          reports:
            reportsInMonth.length,

          cyberbullying:
            reportsInMonth.filter(
              (r: any) =>
                r.ai_result ===
                "Cyberbullying"
            ).length,

          threats:
            reportsInMonth.filter(
              (r: any) =>
                r.ai_result ===
                "Threat"
            ).length,

          fakeAccounts:
            reportsInMonth.filter(
              (r: any) =>
                r.ai_result ===
                "Fake Account"
            ).length,

        };

      }
    );

    res.json({

      success: true,

      stats: {

        totalUsers:
          users.rows[0].count,

        fakeAccounts:
          fakeAccounts.rows[0].count,

        cyberbullyingCases:
          cyberbullying.rows[0].count,

        threatCases:
          threats.rows[0].count,

        imageMisuseCases:
          imageMisuse.rows[0].count,

        highRiskUsers:
          highRiskUsers.rows[0].count,

      },

      activityTrend,

    });

  } catch (err: any) {

    console.error(
      "Dashboard Error:",
      err
    );

    res.status(500).json({

      success: false,

      message: err.message,

    });

  }

};

export const getMonthlyAnalytics: RequestHandler = (
  _req,
  res
) => {

  res.json({

    success: true,

  });

};