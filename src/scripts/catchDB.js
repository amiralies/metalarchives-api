const axios = require('axios');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const cheerio = require('cheerio');
const config = require('../helpers/config');
require('../models/band');

const Band = mongoose.model('Band');
const MA_URL =
  'https://www.metal-archives.com/search/ajax-advanced/searching/bands/?iDisplayStart=';
const startTime = Date.now();

console.log('DB CATCH: Catching...');

const saveBands = bands => new Promise((resolve, reject) => {
  const bandsToSave = [];
  bands.forEach((band) => {
    const $ = cheerio.load(band[0]);
    const aHref = $('a').attr('href');
    const bandObj = {
      band_name: $('a').text(),
      band_id: parseInt(aHref.substr(aHref.lastIndexOf('/') + 1), 10),
      band_genre: band[1],
      band_country: band[2],
    };
    bandsToSave.push(bandObj);
  });
  Band.insertMany(bandsToSave, { ordered: false })
    .then((res) => { resolve(res.length); })
    .catch((err) => {
      if (err.code === 11000) {
        resolve(0);
      } else reject(err);
    });
});

const requestBands = index => new Promise((resolve, reject) => {
  axios.get(MA_URL + (index * 200).toString())
    .then(({ data }) => {
      const bands = data.aaData;
      return saveBands(bands);
    })
    .then((res) => {
      resolve(res);
    })
    .catch(err => reject(err));
});

const getBands = requestArr =>
  Promise.mapSeries(requestArr, item => requestBands(item));

const main = () => {
  axios
    .get(MA_URL, { timeout: 10000 })
    .then(({ data }) => {
      const bandCount = data.iTotalRecords;
      const totalRequests = Math.ceil(bandCount / 200);
      const requestArr = [];
      for (let i = 0; i < totalRequests; i += 1) {
        requestArr[i] = i;
      }
      return getBands(requestArr);
    })
    .then((res) => {
      const newBandsCount = res.reduce((sum, item) => sum + item);
      console.log(`DB CATCH: Added ${newBandsCount} new bands.`);
    })
    .catch((err) => {
      if (err.code !== 11000) {
        console.log(`DB CATCH: ${err}`);
      }
    })
    .then(() => {
      console.log(`DB CATCH: Total Time spent : 
      ${(Date.now() - startTime).toString()}ms`);
      mongoose.connection.close();
      process.exit();
    });
};

mongoose.Promise = Promise;
mongoose.connect(config.DB_CONNECTION_STRING, {
  useMongoClient: true,
}, (err) => {
  if (err) {
    console.log(`DB CATCH: MongoDB Connection Error: ${err}`);
  } else main.call();
});
