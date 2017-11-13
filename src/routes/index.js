const express = require('express');

const router = express.Router();

router.use('/bands', require('./bands'));

router.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running.' });
});

module.exports = router;
