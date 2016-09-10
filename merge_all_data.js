const SpotifyWebApi = require('spotify-web-api-node');
const R = require('ramda');
const P = require('bluebird');
const csv2json = require('./csv2json');
const json2csv = require('./json2csv');


const artistPath = "./FINAL_PROBABILITY.csv";

// Put your credentials in the credtials.js file;
// DO NOT PUSH IT TO IT
const accessToken = require('./credentials').access_token;
const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(accessToken);


const start = parseInt(process.env.START);
const end = parseInt(process.env.END);
var i = start;
var recordsDone = [];
const n = 50;
csv2json(artistPath).then(function(records) {
  // const a = R.uniqBy(R.prop('id'), records);
  csv2json("./clean_artist_details.csv").then(function(artists){
    const indexedArtists = R.indexBy(R.prop('id'))(artists);
    const a = R.map(function(x){
      const obj = indexedArtists[x.Primary];
      if (obj){
        return R.merge(x)(R.pick(['genres', 'artist_popularity', 'followers'])(obj));
      }
      return null;
    })(records);
    json2csv('Final_Final_Probability.csv', R.reject(R.isNil)(a));
  });
});












