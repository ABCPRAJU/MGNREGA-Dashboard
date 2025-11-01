const pool = require("../db");

exports.getPerformanceData = async (req, res) => {
  const { state, district, month, year } = req.query;

  try {
    let query = `
      SELECT *
      FROM performance
      WHERE 1=1
    `;
    const params = [];

    // 🔹 Match state (case-insensitive and space-trimmed)
    if (state && state.trim() !== "") {
      params.push(state);
      query += ` AND UPPER(TRIM(state_name)) = UPPER(TRIM($${params.length}))`;
    }

    // 🔹 Match district (case-insensitive and space-trimmed)
    if (district && district.trim() !== "") {
      params.push(district);
      query += ` AND UPPER(TRIM(district_name)) = UPPER(TRIM($${params.length}))`;
    }

    // 🔹 Optional month filter
    if (month && month.trim() !== "") {
      params.push(month);
      query += ` AND UPPER(TRIM(month)) = UPPER(TRIM($${params.length}))`;
    }

    // 🔹 Safely include year only if it’s a valid number
    if (year && !isNaN(year)) {
      params.push(year);
      query += ` AND year = $${params.length}`;
    }

    // 🔹 Order newest first
    query += " ORDER BY year DESC, month DESC";

    // 🧠 Debug log to confirm what’s being sent
    console.log("📊 Fetch Query:", query);
    console.log("📦 Parameters:", params);

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching performance data:", err);
    res.status(500).json({ error: "Failed to fetch performance data" });
  }
};
