const express = require('express');

const router = express.Router();

router.use('/bands', require('./bands'));

router.get('/', (req, res) => {
  res.send('expres');
});

module.exports = router;
