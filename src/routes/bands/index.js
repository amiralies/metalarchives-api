const express = require('express');
const mongoose = require('mongoose');
const Utils = require('../../helpers/utils');
const Scraper = require('../../helpers/scraper');

const Band = mongoose.model('Band');
const router = express.Router();

/**
 * @api {get} /bands Get Bands
 * @apiName GetBands
 * @apiGroup Bands
 *
 * @apiParam {String}     [name]      Band name query.
 * @apiParam {String}     [genre]     Band genre query.
 * @apiParam {String}     [country]   Band country query.
 * @apiParam {Integer}    [start]     Start index of the data.
 * @apiParam {Integer}    [length]    Length of the data.
 * @apiParamExample Request-Example :
 *  /bands/?name=Death&start=0&length=5
 *
 * @apiError {Boolean}    success     <Code>false</Code>
 * @apiError {String}     message     Error message.
 * @apiErrorExample {json} Error-Example:
 * {
   "success":false,
   "message":"Bad start index parameter."
  }
 *
 * @apiSuccess {Boolean}    success                   <Code>true</Code>
 * @apiSuccess {Object}     data                      Data for the query.
 * @apiSuccess {Integer}    data.totalResult          Total result count for the query.
 * @apiSuccess {Integer}    data.currentResult        Current retrived result count for the query.
 * @apiSuccess {Array[]}    data.bands                Total bands retrived by query.
 * @apiSuccess {Integer}    data.bands.band_id        Band id for certain band.
 * @apiSuccess {String}     data.bands.band_name      Band name.
 * @apiSuccess {String}     data.bands.band_genre     Band Genre(s).
 * @apiSuccess {String}     data.bands.band_country   Band Country.
 * @apiSuccessExample {json} Success-Example:
 * {
   "success":true,
   "data":{
      "totalResult":627,
      "currentResult":5,
      "bands":[
         {
            "band_id":141,
            "band_name":"Death",
            "band_genre":"Death Metal (early), Death/Progressive Metal (later)",
            "band_country":"United States"
         },
         {
            "band_id":3540425861,
            "band_name":"Death &amp; Destruction",
            "band_genre":"Thrash Metal/Crossover/Hardcore",
            "band_country":"Australia"
         },
         {
            "band_id":3540377475,
            "band_name":"Death &amp; Legacy",
            "band_genre":"Heavy/Melodic Death Metal",
            "band_country":"Spain"
         },
         {
            "band_id":3540343973,
            "band_name":"Death &amp; Taxe$",
            "band_genre":"Progressive Metal",
            "band_country":"United States"
         },
         {
            "band_id":3540407204,
            "band_name":"Death &amp; the Miser",
            "band_genre":"Stoner Metal/Rock",
            "band_country":"United Kingdom"
         }
      ]
   }
  }

 */
router.get('/', (req, res, next) => {
  const {
    genre, country, name,
  } = req.query;
  let { start, length } = req.query;
  const queryConditions = {};
  let totalResult = 0;

  if (name) {
    const nameRegex = Utils.makeSearchRegex(name);
    if (nameRegex) {
      queryConditions.band_name = nameRegex;
    } else {
      return next(Utils.sendError(400, 'Bad input (name) parameter.'));
    }
  }

  if (genre) {
    const genreRegex = Utils.makeSearchRegex(genre);
    if (genreRegex) {
      queryConditions.band_genre = genreRegex;
    } else {
      return next(Utils.sendError(400, 'Bad input (genre) parameter.'));
    }
  }

  if (country) {
    const countryRegex = Utils.makeSearchRegex(country);
    if (countryRegex) {
      queryConditions.band_country = countryRegex;
    } else {
      return next(Utils.sendError(400, 'Bad input (country) parameter.'));
    }
  }

  if (start && Number.isInteger(parseInt(start, 10))) {
    start = parseInt(start, 10);
  } else start = 0;

  if (length && Number.isInteger(parseInt(length, 10))) {
    length = (parseInt(length, 10) > 20 || parseInt(length, 10) <= 0) ? 20 : parseInt(length, 10);
  } else length = 20;

  return Band.count(queryConditions)
    .then((result) => {
      totalResult = result;
      if (totalResult === 0) {
        throw Utils.sendError(404, 'No match for query.', next);
      }
      if (start < 0 || start >= totalResult) {
        throw Utils.sendError(400, 'Bad start index.', next);
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
    .catch(err => next(err));
});

/**
 * @api {get} /bands/:band_id Get Band
 * @apiName GetBand
 * @apiGroup Bands
 *
 * @apiParam {String}     [band_id]      band id.
 * @apiParamExample Request-Example :
 *  /bands/44
 *
 * @apiError {Boolean}    success     <Code>false</Code>
 * @apiError {String}     message     Error message.
 * @apiErrorExample {json} Error-Example:
 * {
   "success":false,
   "message":"Invalid band id parameter"
  }
 *
 * @apiSuccess {Boolean}    success                   <Code>true</Code>
 * @apiSuccess {Object}     data                      Data.
 * @apiSuccess {Object}     data.band                 band's info object.
 * @apiSuccess {String}     data.band.name            band's name.
 * @apiSuccess {String}     data.band.genre           band's genre.
 * @apiSuccess {String}     data.band.name            band's origin country.
 * @apiSuccess {String}     data.band.location        band's location (State, City ...).
 * @apiSuccess {String}     data.band.themes          band's lyrical themes.
 * @apiSuccess {String}     data.band.status          band's current status.
 * @apiSuccess {String}     data.band.label           band's last label.
 * @apiSuccess {String}     data.band.formYear        band's formation year.
 * @apiSuccess {String}     data.band.yearsActive     band's years active.
 * @apiSuccess {String}     data.band.photoUrl        band's photo url.
 * @apiSuccess {String}     data.band.logoUrl         band's logo url.

 * @apiSuccessExample {json} Success-Example:
 * {
   "success":true,
   "data":{
      "band":{
         "name":"Nevermore",
         "genre":"Power/Thrash Metal (early), Groove/Progressive Metal (later)",
         "country":"United States",
         "location":"Seattle, Washington",
         "themes":"Politics, Philosophy, Human issues, Misanthropy",
         "status":"Split-up",
         "label":"Century Media Records",
         "formYear":"1992",
         "yearsActive":"1992-2011",
         "photoUrl":"https://www.metal-archives.com/images/4/4/44_photo.jpg?0824",
         "logoUrl":"https://www.metal-archives.com/images/4/4/44_logo.jpg?3214"
      }
   }
  }
 */
router.get('/:band_id', (req, res, next) => {
  const bandID = parseInt(req.params.band_id, 10);

  if (bandID === Number(req.params.band_id)) {
    Scraper.getBand(bandID)
      .then(band =>
        res.status(200).json({ success: true, data: { band } }))
      .catch(err => next(err));
  } else return next(Utils.sendError(400, 'Invalid band id parameter'));
});


module.exports = router;
