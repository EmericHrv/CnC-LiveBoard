import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import createAdminUser from './utils/createAdminUser.js';
import connectToDatabase from './models/db.js';
import routes from './routes/index.js';

dotenv.config();
const { NODE_ENV, HTTP_PORT, MONGO_URL } = process.env;

const app = express();
const port = HTTP_PORT || 8080;

// Middleware for JSON parsing
app.use(express.json());

app.set('trust proxy', 1); // Active la prise en charge des proxys (comme Caddy, Nginx, etc.)

// Serve static files assets/uploads
app.use('/assets/uploads', express.static('assets/uploads'));

// CORS configuration
if (NODE_ENV === 'dev') {
    console.log('Running in development mode.');
    app.use(cors());
} else {
    console.log('Running in production mode.');
    app.use(cors({
        origin: 'https://liveboard.esmorannes.com',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));
}

// Verify JWT_SECRET exists
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the environment variables.');
}

// Initialize database and start app
const initializeApp = async () => {
    try {
        console.log(`Connecting to database at ${MONGO_URL}`);
        await connectToDatabase(MONGO_URL);
        console.log('Database and collections are ready.');
        await createAdminUser();

        // Mount routes
        app.use('/api', routes);

        // Middleware for 404
        app.use((req, res) => {
            res.status(404).json({ error: '404 not found' });
        });

        // Start the server
        app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    } catch (error) {
        console.error('Database initialization error:', error);
    }
};

// Centralized error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    // Add database disconnect logic if necessary
    process.exit(0);
});

// Start the app
initializeApp();
