//const url = process.env.APP_URL || 'http://localhost:3000';
const web = process.env.WEB_URL || 'http://localhost:3005';

export default () => ({
  name: 'test_qtim',
  port: parseInt(process.env.APP_PORT) || 3000,
  jwt: {
    secret: process.env.JWT_SECRET_KEY || '!secret@key_',
    signOptions: {
      expiresIn: '1d',
    },
  },
  cors: {
    origin: [web],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  },
  swagger: {
    title: 'qtim API',
    desription: 'The API description',
    version: '1.0',
    bearer: {
      options: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      slug: 'JWT-auth',
    },
  },
});
