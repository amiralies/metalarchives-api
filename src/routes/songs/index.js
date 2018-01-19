const express = require('express');
const Scraper = require('../../helpers/scraper');
const Utils = require('../../helpers/utils');

const router = express.Router();

/**
 * @api {get} /songs Get Songs
 * @apiName GetSongs
 * @apiGroup Songs
 *
 * @apiParam {String}     [title]     Song title query.
 * @apiParam {String}     [band]      Song band query.
 * @apiParam {String}     [lyrics]    A part of lyrics of song query.
 * @apiParam {Integer}    [start]     Start index of the data.
 * @apiParam {Integer}    [length]    Length of the data.
 * @apiParamExample Request-Example :
 *  /songs/?title=death&band=nevermore&start=0&length=5
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
 * @apiSuccess {Array[]}    data.songs                Total songs retrived by query.
 * @apiSuccess {Integer}    data.songs.title          Song title.
 * @apiSuccess {String}     data.songs.band           Song band name.
 * @apiSuccess {String}     data.songs.type           Song type.
 * @apiSuccess {String}     data.songs.album          Song album.
 * @apiSuccess {Integer}    data.songs.lyricsId       Song lyrics id.
 * @apiSuccessExample {json} Success-Example:
 * {
   "success":true,
   "data":{
      "totalResult":3,
      "currentResult":3,
      "songs":[
         {
            "title":"Dream Death",
            "band":"Nevermore",
            "type":"Demo",
            "album":"Into the Black",
            "lyricsId":"3840410"
         },
         {
            "title":"The Death of Passion",
            "band":"Nevermore",
            "type":"Full-length",
            "album":"Dreaming Neon Black",
            "lyricsId":"1269"
         },
         {
            "title":"Moonrise (Through Mirrors of Death)",
            "band":"Nevermore",
            "type":"Full-length",
            "album":"The Obsidian Conspiracy",
            "lyricsId":"1882173"
         }
      ]
   }
  }
 */
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
      return res.status(200).json({ success: true, data });
    })
    .catch(err => next(err));
});
module.exports = router;
