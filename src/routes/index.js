const express = require('express');

const router = express.Router();

router.use('/search', require('./search'));

router.get('/', (req, res) => {
  res.send('expres');
});

module.exports = router;
