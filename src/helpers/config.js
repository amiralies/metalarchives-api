const { MONGO_URL } = process.env;

module.exports = {
  mongoUrl: 'mongodb://localhost:27017/metalarchives' || MONGO_URL,
};
