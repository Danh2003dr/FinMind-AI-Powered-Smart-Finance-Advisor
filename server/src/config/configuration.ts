export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  database: {
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
      uri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/finmind',
    },
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY ?? '',
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'dev-only-change-me',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },
});
