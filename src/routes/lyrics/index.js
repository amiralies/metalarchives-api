const express = require('express');
const Scraper = require('../../helpers/scraper');
const Utils = require('../../helpers/utils');

const router = express.Router();

router.get('/:lyricsId', (req, res, next) => {
  const lyricsId = parseInt(req.params.lyricsId, 10);
  if (Number.isNaN(lyricsId)) {
    return next(Utils.sendError(400, 'Bad lyrics id parameter.'));
  }
  Scraper.getLyrics(lyricsId)
    .then(data => res.status(200).json({ success: true, data: { lyrics: data } }))
    .catch(err => next(err));
});

module.exports = router;
