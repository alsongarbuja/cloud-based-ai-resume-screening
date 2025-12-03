export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    name: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
  oauth: {
    googleId: process.env.OAUTH_GOOGLE_ID,
    googleSecret: process.env.OAUTH_GOOGLE_SECRET,
    callbackUrl: process.env.OAUTH_GOOGLE_CALLBACK_URL,
    jwtSecret: process.env.JWT_SECRET,
    domain: process.env.DOMAIN,
  },
  client: {
    url: process.env.CLIENT_URL,
  },
});
