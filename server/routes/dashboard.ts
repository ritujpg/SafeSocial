import { RequestHandler } from "express";
import { pool } from "../db";

export const getDashboardStats: RequestHandler = async (
  _req,
  res
) => {
  try {

    const [
      users,
      fakeAccounts,
      cyberbullying,
      threats,
      imageMisuse,
      highRiskUsers,
      recentAlerts,
      activityLogs,
    ] = await Promise.all([

      pool.query(`
        SELECT COUNT(*)::int AS count
        FROM users;
      `),

      pool.query(`
        SELECT COUNT(*)::int AS count
        FROM fake_accounts;
      `),

      pool.query(`
        SELECT COUNT(*)::int AS count
        FROM cyberbullying;
      `),

      pool.query(`
        SELECT COUNT(*)::int AS count
        FROM threat_cases;
      `),

      pool.query(`
        SELECT COUNT(*)::int AS count
        FROM image_misuse_cases;
      `),

      pool.query(`
        SELECT COUNT(*)::int AS count
        FROM users
        WHERE risk_level = 'HIGH';
      `),

      pool.query(`
        SELECT
          id,
          title,
          alert_type,
          severity,
          status,
          created_at
        FROM alerts
        ORDER BY created_at DESC
        LIMIT 5;
      `),

      pool.query(`
        SELECT created_at
        FROM activity_logs
        ORDER BY created_at ASC;
      `),

    ]);

    // Activity Trend

    const groupedActivity: Record<string, number> = {};

    activityLogs.rows.forEach((row) => {

      const date = new Date(
        row.created_at
      ).toLocaleDateString();

      groupedActivity[date] =
        (groupedActivity[date] || 0) + 1;

    });

    const activityTrend = Object.entries(
      groupedActivity
    ).map(([date, value]) => ({
      date,
      alerts: value,
      cases: value,
      threats: value,
    }));

    // Pie Chart Data

    const alertDistribution = [
      {
        type: "Fake Accounts",
        value: fakeAccounts.rows[0].count,
        color: "#F59E0B",
      },
      {
        type: "Cyberbullying",
        value: cyberbullying.rows[0].count,
        color: "#EF4444",
      },
      {
        type: "Threats",
        value: threats.rows[0].count,
        color: "#8B5CF6",
      },
      {
        type: "Image Misuse",
        value: imageMisuse.rows[0].count,
        color: "#14B8A6",
      },
    ].filter((item) => item.value > 0);

    res.json({

      success: true,

      stats: {

        totalUsers: users.rows[0].count,

        fakeAccounts: fakeAccounts.rows[0].count,

        cyberbullyingCases:
          cyberbullying.rows[0].count,

        threatCases:
          threats.rows[0].count,

        imageMisuseCases:
          imageMisuse.rows[0].count,

        highRiskUsers:
          highRiskUsers.rows[0].count,

      },

      recentAlerts: recentAlerts.rows.map(
        (alert) => ({

          id: alert.id,

          user: "System",

          type: alert.alert_type,

          timestamp: alert.created_at,

          riskLevel:
            alert.severity.toLowerCase(),

          status:
            alert.status.toLowerCase(),

          title: alert.title,

        })
      ),

      activityTrend,

      alertDistribution,

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

    analytics: {

      fakeAccounts: 0,

      cyberbullying: 0,

      threats: 0,

    },

  });

};