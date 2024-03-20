export default () => ({
  cache: {
    host: process.env.REDIS_HOST || 'cache',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || 'secret',
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
});
