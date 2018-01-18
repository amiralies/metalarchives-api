const cheerio = require('cheerio');
const axios = require('axios');

const GET_BAND_URL = 'https://www.metal-archives.com/bands/sieversiever/';
const GET_DISCOG_URL = 'https://www.metal-archives.com/band/discography/id/';
const SEARCH_SONGS_URL = 'https://www.metal-archives.com/search/ajax-advanced/searching/songs';

class Scraper {
  static searchSongs(songTitle, bandName, lyrics, start, length) {
    return new Promise((resolve, reject) => {
      const searchUrl = `${SEARCH_SONGS_URL}?songTitle=${songTitle}&bandName=${bandName}&lyrics=${lyrics}&iDisplayStart=${start}&releaseType[]=1&releaseType[]=3&releaseType[]=4&releaseType[]=5`;
      console.log(searchUrl);
      axios.get(searchUrl, { timeout: 10000 })
        .then(({ data }) => {
          const totalResult = data.iTotalRecords;
          let currentResult = length > totalResult - start ? totalResult - start : length;
          if (start < 0 || start >= totalResult) {
            currentResult = -1;
          }
          let songs = data.aaData.slice(0, currentResult);
          songs = songs.map((song) => {
            const band = cheerio.load(song[0])('a').text();
            const album = cheerio.load(song[1])('a').text();
            const type = song[2];
            const title = song[3];
            const lyricsLink = cheerio.load(song[4])('a').attr('id');
            const lyricsId = lyricsLink.slice(11, lyricsLink.length);
            return {
              title,
              band,
              type,
              album,
              lyricsId,
            };
          });
          resolve({ totalResult, currentResult, songs });
        })
        .catch(err => reject(err));
    });
  }

  static getBand(bandID) {
    return new Promise((resolve, reject) => {
      axios.get(GET_BAND_URL + bandID.toString(), { timeout: 5000 }).then(({ data }) => {
        const $ = cheerio.load(data);
        const id = bandID;
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
          id,
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
