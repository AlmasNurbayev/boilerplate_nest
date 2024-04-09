export default () => {
  return {
    mailer: {
      defaults: {
        from: `"No Reply" <${process.env.EMAIL_USER}>`,
      },
      transport: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
    },
  };
};
