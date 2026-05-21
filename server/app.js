import express from "express";
import cors from "cors";
import helmet from "helmet";

// Routes
import authRoutes from "./src/routes/auth.routes.js";
import aiRoutes from "./src/routes/ai.routes.js";
import chatRoutes from "./src/routes/chat.routes.js";
import bookRoutes from "./src/routes/book.routes.js";
import uploadRoutes from "./src/routes/upload.routes.js";
import transactionRoutes from "./src/routes/transaction.routes.js";

// Middlewares
import { notFound, errorHandler } from "./src/middlewares/error.js";

const app = express();

/* ---------- Security & parsing ---------- */
app.use(helmet());
app.use(express.json({ limit: "1mb" }));

const configuredOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

const ALLOW = new Set([
  ...configuredOrigins,
  "http://localhost:5173",
  "http://localhost:3000",
]);

function isAllowedOrigin(origin) {
  if (!origin) return true; // server-to-server, curl, health checks
  const clean = origin.replace(/\/+$/, "");
  if (ALLOW.has(clean)) return true;

  return /^https:\/\/book-cycle-[a-z0-9-]+\.vercel\.app$/i.test(clean);
}

app.use(
  cors({
    origin: (origin, cb) => {
      if (isAllowedOrigin(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ---------- Health ---------- */
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.get("/", (_req, res) => res.send("API is working"));

/* ---------- Routes ---------- */
app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api", chatRoutes);
app.use("/api", uploadRoutes);
app.use("/api/transactions", transactionRoutes);

/* ---------- Errors ---------- */
app.use(notFound);
app.use(errorHandler);

export default app;
