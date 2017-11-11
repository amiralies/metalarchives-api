const cheerio = require('cheerio');
const axios = require('axios');

const GET_BAND_URL = 'https://www.metal-archives.com/bands/sieversiever/';
const GET_DISCOG_URL = 'https://www.metal-archives.com/band/discography/id/';

class Scraper {
  static getBand(bandID) {
    return new Promise((resolve, reject) => {
      axios.get(GET_BAND_URL + bandID.toString(), { timeout: 5000 }).then(({ data }) => {
        const $ = cheerio.load(data);
        const name = $('.band_name a').text();
        const genre = $('#band_stats .float_right dt').nextAll().eq(0).text();
        const country = $('#band_stats .float_left dt').nextAll().eq(0).text();
        const location = $('#band_stats .float_left dt').nextAll().eq(2).text();
        const themes = $('#band_stats .float_right dt').nextAll().eq(2).text();
        const status = $('#band_stats .float_left dt').nextAll().eq(4).text();
        const label = $('#band_stats .float_right dt').nextAll().eq(4).text();
        const formYear = $('#band_stats .float_left dt').nextAll().eq(6).text();
        const yearsActive = $('#band_stats .float_right').nextAll().eq(0).children()
          .eq(1)
          .text()
          .replace(/\s/g, '');
        const photoUrl = $('#photo').attr('href');
        const logoUrl = $('#logo').attr('href');
        const band = {
          name,
          genre,
          country,
          location,
          themes,
          status,
          label,
          formYear,
          yearsActive,
          photoUrl,
          logoUrl,
        };
        resolve(band);
      }).catch(err => reject(err));
    });
  }

  static getDiscog(bandID) {
    return new Promise((resolve, reject) => {
      axios.get(`${GET_DISCOG_URL + bandID.toString()}?tab=all`, { timeout: 5000 }).then(({ data }) => {
        const $ = cheerio.load(data);
        const discog = [];

        $('tbody').children().each((i, element) => {
          const releaseUrl = $(element).children().eq(0).children()
            .attr('href');
          const id = parseInt(releaseUrl.substr(releaseUrl.lastIndexOf('/') + 1), 10);
          const name = $(element).children().eq(0).text();
          const type = $(element).children().eq(1).text();
          const year = $(element).children().eq(2).text();
          discog.push({
            id,
            name,
            type,
            year,
          });
        });
        resolve(discog);
      }).catch(err => reject(err));
    });
  }
}

module.exports = Scraper;
