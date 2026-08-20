import { GoogleGenerativeAI } from '@google/generative-ai';
import { createAppError } from '../utils/createAppError.js';

const getModel = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw createAppError('AI service is not configured.', 503);
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });
};

export const improveQuestionService = async ({ title, description, tags }) => {
    const model = getModel();

    const prompt = `You are a helpful assistant that improves developer forum questions.
Given the following question details, return improved versions of each field.
Respond ONLY with a valid JSON object with keys "title", "description", and "tags" (tags as a comma-separated string).
Do not include any markdown, code fences, or extra explanation.

Input:
Title: ${title || ''}
Description: ${description || ''}
Tags: ${tags || ''}

Rules:
- title: make it clear, specific, and concise
- description: improve clarity, add structure if needed, keep technical accuracy
- tags: return relevant comma-separated tags (max 5)`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    try {
        return JSON.parse(text);
    } catch {
        throw createAppError('Failed to parse AI response. Please try again.', 502);
    }
};

export const summarizeAnswersService = async ({ question, answers }) => {
    const model = getModel();

    const answersText = answers
        .map((a, i) => `Answer ${i + 1}: ${a}`)
        .join('\n\n');

    const prompt = `You are a helpful assistant summarizing answers on a developer Q&A forum.
Given the question and its answers below, write a concise plain-text summary in 3-5 sentences that captures the key solutions and insights.
Do not use markdown, bullet points, or headers. Return only the summary text.

Question: ${question}

${answersText}`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
};
