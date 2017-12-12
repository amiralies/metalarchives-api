const { DB_HOST, DB_PORT } = process.env;

module.exports = {
  DB_CONNECTION_STRING: `mongodb://${DB_HOST}:${DB_PORT}/metalarchives`,
};
