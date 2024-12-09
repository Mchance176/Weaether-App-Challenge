import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import weatherRoutes from './routes/weatherRoutes.js';

// ES modules fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables with explicit path
dotenv.config({ path: path.join(__dirname, '../.env') });

// Debug environment variables
console.log('Environment variables loaded:');
console.log('API_BASE_URL:', process.env.API_BASE_URL);
console.log('API_KEY exists:', !!process.env.API_KEY);
console.log('PORT:', process.env.PORT);

// Validate required environment variables
if (!process.env.API_KEY) {
    console.error('ERROR: API_KEY is not set in .env file');
    process.exit(1);
}

if (!process.env.API_BASE_URL) {
    console.error('ERROR: API_BASE_URL is not set in .env file');
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/weather', weatherRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Server error:', err);
    res.status(500).json({ error: err.message });
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 