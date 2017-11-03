const axios = require('axios');
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const cheerio = require('cheerio');
require('../models/band');

const MA_URL =
  'https://www.metal-archives.com/search/ajax-advanced/searching/bands/?iDisplayStart=';

mongoose.Promise = bluebird;
mongoose.connect(
  'mongodb://localhost:27017/metalarchives',
  {
    useMongoClient: true
  }
);
const Band = mongoose.model('Band');

const getBands = (i, cb) => {
  axios
    .get(MA_URL + (i * 200).toString())
    .then(({ data }) => {
      cb(null, data.aaData);
    })
    .catch(err => {
      console.log('Error in : ' + (i * 200 + 200));
      cb(err);
    });
};

const saveBands = bands => {
  bands.forEach(band => {
    const $ = cheerio.load(band[0]);
    const aHref = $('a').attr('href');
    const bandObj = {
      band_name: $('a').html(),
      band_id: parseInt(aHref.substr(aHref.lastIndexOf('/') + 1), 10),
      band_genre: band[1],
      band_country: band[2]
    };
    new Band(bandObj).save(err => {
      if (err) console.log(err);
    });
  });
};

axios
  .get(MA_URL)
  .then(({ data }) => {
    const bandCount = data.iTotalRecords;
    const totalRequests = Math.ceil(bandCount / 200);
    const startTime = Date.now();
    for (let i = 0; i <= totalRequests; i += 1) {
      getBands(i, (err, bands) => {
        if (err) console.log(err);
        else saveBands(bands);
      });
    }
  })
  .catch(err => {
    console.log('Initialize Error');
    console.log(err);
  });
