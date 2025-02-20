// backend/routes/analyze.js
import express from 'express';
import { analyzeWebsite } from '../controllers/seo.controllers.js';

const router = express.Router();

// POST route to analyze website
router.post('/', analyzeWebsite);

export default router;
