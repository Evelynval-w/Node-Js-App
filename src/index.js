import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import config from "./config/config.js";
import { logMiddleware } from "./middleware/logger.js";
import { validateApiKey, validateApiKeyProduction } from "./middleware/apiKey.js";
import userRoutes from "./routes/userRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import { initializeDatabase } from "./config/database.js";

const app = express();

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize database before starting server
await initializeDatabase();

// Global middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logMiddleware);

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, '../public')));

// Health check (useful for Render)
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv
    });
});

// API info endpoint
app.get('/api', (req, res) => {
    res.json({ 
        message: "Welcome to the API",
        version: "1.0.0",
        environment: config.nodeEnv,
        endpoints: {
            users: "/api/users",
            recipes: "/api/recipes",
            randomRecipe: "/api/recipes/random",
            searchRecipes: "/api/recipes?search=pasta"
        }
    });
});

// API routes (with /api prefix)
app.use('/api/users', validateApiKeyProduction, userRoutes);
app.use('/api/recipes', recipeRoutes);

// Catch-all middleware for serving frontend (MUST BE LAST!)
// This handles both 404s for API and serving the SPA
app.use((req, res, next) => {
    // If it's an API route that wasn't matched, return 404 JSON
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ 
            error: 'Not Found',
            message: `Route ${req.method} ${req.path} not found` 
        });
    }
    
    // Otherwise, serve the frontend index.html
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        ...(config.isDevelopment() && { stack: err.stack })
    });
});

// Start server
app.listen(config.port, () => {
    console.log(`✅ Server running on http://localhost:${config.port}`);
    console.log(`📊 Environment: ${config.nodeEnv}`);
    console.log(`🔒 API Key protection: ${config.apiKey ? 'ENABLED' : 'DISABLED'}`);
    console.log(`\n🌐 Frontend: http://localhost:${config.port}`);
    console.log(`\n📡 API Endpoints:`);
    console.log(`  GET    /api              - API info (public)`);
    console.log(`  GET    /health           - Health check (public)`);
    console.log(`  GET    /api/users        - Get all users (protected)`);
    console.log(`  GET    /api/users/:id    - Get user by ID (protected)`);
    console.log(`  POST   /api/users        - Create new user (protected)`);
    console.log(`  PUT    /api/users/:id    - Update user (protected)`);
    console.log(`  DELETE /api/users/:id    - Delete user (protected)`);
    console.log(`  GET    /api/recipes      - Get all recipes (public)`);
    console.log(`  GET    /api/recipes/:id  - Get recipe by ID (public)`);
    console.log(`  GET    /api/recipes/random - Random recipe (public)`);
});

export default app;