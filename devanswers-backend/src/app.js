import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import router from './routes/index.js';
import errorhandler from './middleware/errorHandler.js';

const app = express();

// Security middlewares
app.use(helmet());

// CORS must run before rate limiter so all responses (including 429) include the header
app.use(cors());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: 'draft-8', // RFC 6585 combined RateLimit header (v8.x API)
    legacyHeaders: false,
});
app.use(limiter);

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ 
    limit: '10mb', 
    extended: true 
}));

// Use router
app.use('/api', router);

// Error handling middleware
app.use(errorhandler);

export default app;