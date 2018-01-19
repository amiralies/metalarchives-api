const express = require('express');
const Scraper = require('../../helpers/scraper');
const Utils = require('../../helpers/utils');

const router = express.Router();

router.get('/', (req, res, next) => {
  let {
    title,
    band,
    lyrics,
    start,
    length,
  } = req.query;

  title = title === undefined ? '' : title;
  band = band === undefined ? '' : band;
  lyrics = lyrics === undefined ? '' : lyrics;

  if (start && Number.isInteger(parseInt(start, 10))) {
    start = parseInt(start, 10);
  } else start = 0;

  if (length && Number.isInteger(parseInt(length, 10))) {
    length = (parseInt(length, 10) > 20 || parseInt(length, 10) <= 0) ? 20 : parseInt(length, 10);
  } else length = 20;

  Scraper.searchSongs(title, band, lyrics, start, length)
    .then((data) => {
      if (data.totalResult === 0) {
        throw Utils.sendError(404, 'No match for query.');
      }
      if (data.currentResult === -1) {
        throw Utils.sendError(400, 'Bad start index.');
      }
      return res.status(200).send(data);
    })
    .catch(err => next(err));
});
module.exports = router;
