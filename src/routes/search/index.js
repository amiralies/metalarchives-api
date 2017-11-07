const express = require('express');

const router = express.Router();

router.use('/band', require('./band'));

module.exports = router;
