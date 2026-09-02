import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";
import morgan from "morgan";
import cors from "cors";

const app = express();

// Allowed Frontend Origins
const allowedOrigins = [
    "http://localhost:5173",
    "https://nexora-ai-ten-fawn.vercel.app",
];

// Middleware
app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(cookieParser());

app.use(morgan("dev"));

// CORS
app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests without an origin
            // (Postman, server-to-server, etc.)
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },

        credentials: true,

        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
        ],
    })
);

// Health Check
app.get("/", (req, res) => {
    res.json({
        message: "Server is running Successfully",
    });
});

// Routes
app.use("/api/auth", authRouter);

app.use("/api/chats", chatRouter);

export default app;