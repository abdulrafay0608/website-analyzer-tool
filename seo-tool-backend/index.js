import express from "express";
import cors from "cors";

import analyzeRouter from "./routes/routes.analyze.js";

const app = express();
const port = process.env.PORT || 5000;
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://website-analyzer-tool.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.get("/", (_, res) => {
  res.send("Welcome to the website analyzer tool!");
});

app.use("/api/analyze", analyzeRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
