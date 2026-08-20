import { createAppError } from '../utils/createAppError.js';
import { improveQuestionService, summarizeAnswersService } from '../services/aiService.js';

export const improveQuestion = async (req, res) => {
    const { title, description, tags } = req.body;

    if (!title && !description && !tags) {
        throw createAppError('At least one field (title, description, or tags) is required.', 400);
    }

    const suggestions = await improveQuestionService({ title, description, tags });

    res.status(200).json({
        success: true,
        message: 'Question improved successfully',
        data: suggestions,
    });
};

export const summarizeAnswers = async (req, res) => {
    const { question, answers } = req.body;

    if (!question || !Array.isArray(answers) || answers.length < 3) {
        throw createAppError('A question and at least 3 answers are required.', 400);
    }

    const summary = await summarizeAnswersService({ question, answers });

    res.status(200).json({
        success: true,
        message: 'Answers summarized successfully',
        data: { summary },
    });
};
