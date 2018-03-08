const { MONGO_URL } = process.env;

module.exports = {
  mongoUrl: MONGO_URL || 'mongodb://localhost:27017/metalarchives',
};
