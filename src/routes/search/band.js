const express = require('express');
const mongoose = require('mongoose');
const Utils = require('../../helpers/utils');

const Band = mongoose.model('Band');
const router = express.Router();

router.get('/', (req, res, next) => {
  const {
    genre, country, name,
  } = req.query;
  let { start, length } = req.query;

  const queryConditions = {};
  if (name) {
    const nameRegex = Utils.makeSearchRegex(name);
    if (nameRegex) {
      queryConditions.band_name = nameRegex;
    } else {
      res.status(400).json({ success: false, message: 'Bad input (name) parameter.' });
    }
  }
  if (genre) {
    const genreRegex = Utils.makeSearchRegex(genre);
    if (genreRegex) {
      queryConditions.band_genre = genreRegex;
    } else {
      res.status(400).json({ success: false, message: 'Bad input (genre) parameter.' });
    }
  }
  if (country) {
    const countryRegex = Utils.makeSearchRegex(country);
    if (countryRegex) {
      queryConditions.band_country = countryRegex;
    } else {
      res.status(400).json({ success: false, message: 'Bad input (country) parameter.' });
    }
  }

  if (start && Number.isInteger(parseInt(start, 10))) {
    start = parseInt(start, 10);
  } else start = 0;
  if (length && Number.isInteger(parseInt(length, 10))) {
    length = (parseInt(length, 10) > 20 || parseInt(length, 10) <= 0) ? 20 : parseInt(length, 10);
  } else length = 20;


  let totalResult = 0;
  Band.count(queryConditions)
    .then((result) => {
      totalResult = result;
      if (totalResult === 0) {
        res.status(404).json({ success: false, message: 'No match for query.' });
      }
      if (start < 0 || start >= totalResult) {
        res.status(400).json({ success: false, message: 'Bad start index parameter.' });
      }
      return Band.find(queryConditions).limit(length).skip(start);
    })
    .then((result) => {
      const currentResult = result.length;
      const bands = result.map((item) => {
        const band = {
          band_id: item.band_id,
          band_name: item.band_name,
          band_genre: item.band_genre,
          band_country: item.band_country,
        };
        return band;
      });

      res.status(200).json({ success: true, data: { totalResult, currentResult, bands } });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
