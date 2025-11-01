const express = require("express");
const cors = require("cors");
const pool = require("./db");
const performanceRoutes = require("./routes/performanceRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/performance", performanceRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
