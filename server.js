import bodyParser from "body-parser";
import dotenv from "dotenv";
import express from "express";
import configureRoutes from "./src/routes/routes.js";

// Load environment variables from .env file
dotenv.config();

const port = process.env.PORT || 5000;
const hostname = process.env.HOST || "localhost";

const app = express();

// Middleware to handle JSON data only for a specific route
app.use(bodyParser.json());
// Set up middleware to parse incoming JSON and urlencoded data
app.use(express.urlencoded({ extended: false }));

/**
 * Configure The Routes
 */
configureRoutes(app);

app.listen(port, hostname, () => {
  console.log(`Server is running at http://${hostname}:${port}/`);
});

export default app;
