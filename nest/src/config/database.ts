export default () => ({
  cache: {
    host: process.env.REDIS_HOST || 'cache',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || 'secret',
    ttl: 3600,
    db: 0,
  },
  userCache: {
    host: process.env.REDIS_HOST || 'cache',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || 'secret',
    ttl: 60 * 60 * 24,
    db: 1,
  },
  database: {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_DATABASE || 'test-qtim',
    username: process.env.DB_USERNAME || undefined,
    password: process.env.DB_PASSWORD || undefined,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [
      /*...*/
    ],
    synchronize: false,
    logging: false,
  },
  mongo: {
    uri:
      `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mongo:27017/` ||
      'mongodb://localhost:27017/',
    dbName: process.env.MONGO_DATABASE || 'test-qtim',
  },
});
