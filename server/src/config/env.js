import "dotenv/config";

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  clientOrigin: process.env.CLIENT_ORIGIN,
  googleClientId: process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID,
};

if (!config.jwtSecret) {
  console.warn("JWT_SECRET is missing. Auth routes will fail until it is configured.");
}
