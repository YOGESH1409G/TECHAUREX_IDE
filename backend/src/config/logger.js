import pino from "pino";
import { loadEnv } from "./env.js";

const {NODE_ENV} = loadEnv();
const isDev = NODE_ENV === "development";

const logger = pino({
  level: "info",
  transport: isDev
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      }
    : undefined,
});

export default logger;
