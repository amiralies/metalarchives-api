const express = require('express');

const router = express.Router();

router.use('/bands', require('./bands'));
router.use('/songs', require('./songs'));

router.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running.' });
});

module.exports = router;
