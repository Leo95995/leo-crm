// src/index.ts
import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
// ROUTERS
import userRouter from "./routes/user/user-routes";
import contactRouter from "./routes/contact/contact-routes";
import opportunityRouter from "./routes/opportunity/opportunity-routes";
import { allowedHeaders } from "./config/allowedHeaders";
import { setupSwagger } from "./swagger";
import rateLimit from "express-rate-limit";

dotenv.config();

const app: Express = express();

app.use(bodyParser.json());
app.use(express.static("./public"));
app.use(express.json());

const allowedOrigins = [
  process.env.FRONTEND_URL_ORIGIN,
  "https://leolab.dev",
  "https://www.leolab.dev",
  "http://localhost:5173",
];

const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "PUT"],
  allowedHeaders: allowedHeaders,
};

app.use(cors(corsOptions));

const internalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: "Limite richieste superato, riprova più tardi.",
});
//  ratelimiter che metto per le rotte interne che richiedono autenticazione
app.use(internalLimiter);

//per swagger
setupSwagger(app);

app.use((req, res, next) => {
  const realIp = req.headers["x-real-ip"] || req.ip;
  const host = req.headers["host"];
  if (process.env.NODE_ENV === "production") {
  } else if (process.env.NODE_ENV === "test") {
  } else {
    console.log("IP reale:", realIp);
    console.log("Host richiesto:", host);
  }

  next();
});

app.use("/users", userRouter);
app.use("/opportunities", opportunityRouter);
app.use("/contacts", contactRouter);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json("pong");
});

export default app;
