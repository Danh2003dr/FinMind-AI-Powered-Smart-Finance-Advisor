export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  database: {
    /** `true` = SQLite trong RAM (mất dữ liệu khi tắt server) */
    skip: process.env.SKIP_DB === 'true',
    /** sqlite | mssql */
    driver: (process.env.DB_DRIVER ?? 'sqlite').toLowerCase(),
    sqlite: {
      path: process.env.SQLITE_PATH ?? 'data/finmind.sqlite',
      synchronize: process.env.SQLITE_SYNC !== 'false',
    },
    sql: {
      host: process.env.SQLSERVER_HOST ?? 'localhost',
      port: parseInt(process.env.SQLSERVER_PORT ?? '1433', 10),
      username: process.env.SQLSERVER_USER ?? 'sa',
      password: process.env.SQLSERVER_PASSWORD ?? '',
      database: process.env.SQLSERVER_DATABASE ?? 'finmind',
      encrypt: process.env.SQLSERVER_ENCRYPT !== 'false',
      trustServerCertificate: process.env.SQLSERVER_TRUST_CERT !== 'false',
      synchronize: process.env.SQLSERVER_SYNCHRONIZE === 'true',
    },
    mongo: {
      enabled: process.env.MONGODB_ENABLED === 'true',
      uri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/finmind',
    },
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY ?? '',
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY ?? '',
    // 1.5 đã gỡ khỏi API (404); dùng 2.5 Flash stable — xem https://ai.google.dev/gemini-api/docs/models/gemini
    model: process.env.GEMINI_MODEL ?? 'gemini-2.5-flash',
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'dev-only-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },
});
