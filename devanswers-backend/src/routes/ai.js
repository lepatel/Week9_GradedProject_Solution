import express from 'express';
import { improveQuestion, summarizeAnswers } from '../controllers/aiController.js';
import authenticate from '../middleware/authHandler.js';

const aiRouter = express.Router();

aiRouter.post('/improve-question', authenticate, improveQuestion);
aiRouter.post('/summarize-answers', authenticate, summarizeAnswers);

export default aiRouter;
