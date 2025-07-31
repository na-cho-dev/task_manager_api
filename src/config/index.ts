import dotenv from "dotenv";

dotenv.config();

export const config = {
  // Server Configuration
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "3330"),
  HOST: process.env.HOST || "0.0.0.0",

  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
};
