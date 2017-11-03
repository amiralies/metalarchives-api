const axios = require('axios');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const cheerio = require('cheerio');
require('../models/band');

const MA_URL =
  'https://www.metal-archives.com/search/ajax-advanced/searching/bands/?iDisplayStart=';

const startTime = Date.now();

console.log('Updating...');

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost:27017/metalarchives', {
  useMongoClient: true
});
const Band = mongoose.model('Band');

const requestBands = index => axios.get(MA_URL + (index * 200).toString());

const getBands = requestArr =>
  Promise.map(requestArr, item => requestBands(item));

const saveBands = bands => {
  const bandsToSave = [];
  bands.forEach(band => {
    const $ = cheerio.load(band[0]);
    const aHref = $('a').attr('href');
    const bandObj = {
      band_name: $('a').html(),
      band_id: parseInt(aHref.substr(aHref.lastIndexOf('/') + 1), 10),
      band_genre: band[1],
      band_country: band[2]
    };
    bandsToSave.push(bandObj);
  });
  return Band.insertMany(bandsToSave);
};

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
    .then(res => {
      const data = res.map(item => item.data.aaData);
      const bands = [];
      data.forEach(item => {
        bands.push(...item);
      });
      return saveBands(bands);
    })
    .catch(err => {
      console.log(err);
    })
    .then(() => {
      console.log(
        `Done.\nTotal Time spent : ${(Date.now() - startTime).toString()} ms`
      );
      mongoose.connection.close();
    });
};

main.call();
