import express from "express";
import cors from "cors";
import morgan from "morgan";
import { ApiError } from "./utils/ApiError.js";
import errorHandler from "./middleware/error.middleware.js";
import routes from "./routes/index.js";
import checkRoutes from "./checkRoutes/index.js"
import passport from "./config/passport.js"
const app = express();

// Basic Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173", // 👈 Dynamic origin for local/production
  credentials: true,                          // 👈 allow cookies
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(morgan("dev"));

// Routes
app.use("/api/v1", routes);
//checkRoutes
app.use("/api/v1", checkRoutes)

// 404 Handler
// app.all("*", (req, res, next) => {
//   next(new ApiError(404, `Route ${req.originalUrl} not found`));
// });

// Central Error Handler
app.use(errorHandler);

//intialise paasport
app.use(passport.initialize());

export { app };
