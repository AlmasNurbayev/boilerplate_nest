export default () => {
  return {
    sms: {
      host: process.env.SMSC_HOST,
      user: process.env.SMSC_USER,
      password: process.env.SMSC_PASSWORD,
    },
  };
};
