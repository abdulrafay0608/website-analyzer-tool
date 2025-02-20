import express from "express";
import cors from "cors";

import analyzeRouter from "./routes/routes.analyze.js";

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());

app.use(express.json());

// Routes
app.use("/api/analyze", analyzeRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
