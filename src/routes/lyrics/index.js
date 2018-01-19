const express = require('express');
const Scraper = require('../../helpers/scraper');
const Utils = require('../../helpers/utils');

const router = express.Router();

/* eslint-disable */
/**
 * @api {get} /lyrics/:lyricsId Get Song Lyrics
 * @apiName GetSongLyrics
 * @apiGroup Lyrics
 *
 * @apiParam {Integer}     lyricsId      Lyrics id.
 * @apiParamExample Request-Example :
 *  /lyrics/1279
 *
 * @apiError {Boolean}    success     <Code>false</Code>
 * @apiError {String}     message     Error message.
 * @apiErrorExample {json} Error-Example:
 * {
   "success":false,
   "message":"Bad lyrics id parameter."
  }
 *
 * @apiSuccess {Boolean}    success                   <Code>true</Code>
 * @apiSuccess {Object}     data                      Data.
 * @apiSuccess {String}     data.lyrics               Song lyrics.

 * @apiSuccessExample {json} Success-Example:
 * {
   "success":true,
   "data":{
       "lyrics":"\"What has been put asunder\nshall again be whole\"\n\nIn this neon black gloom I still see her face\nShe comes to me bringing darkest hour, I am forlorn\nThe pain is reborn\n\nYou are forever in my heart you never died\nYou are forever I still wonder where you are\n\nI know you're dreaming, I know you're at peace\nI'll meet you in the dreamtime\nWhenever you call me I'll go under, I'll swim through you\n\nYou are forever in my heart you never died\nYou are forever I still wonder where you are\nI know you're dreaming neon black\n\n\"As the curtain calls, and the cast recedes,\nI am all that ever was and all that ever will be.\nIn wither and repose this frayed chapter\n\"What has been put asunder\nshall again be whole\"\n\nIn this neon black gloom I still see her face\nShe comes to me bringing darkest hour, I am forlorn\nThe pain is reborn\n\nYou are forever in my heart you never died\nYou are forever I still wonder where you are\n\nI know you're dreaming, I know you're at peace\nI'll meet you in the dreamtime\nWhenever you call me I'll go under, I'll swim through you\n\nYou are forever in my heart you never died\nYou are forever I still wonder where you are\nI know you're dreaming neon black\n\n\"As the curtain calls, and the cast recedes,\nI am all that ever was and all that ever will be.\nIn wither and repose this frayed chapter\n"
   }
  }
 */
/* eslint-enable */
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
