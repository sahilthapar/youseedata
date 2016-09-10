const SpotifyWebApi = require('spotify-web-api-node');
const R = require('ramda');
const P = require('bluebird');
const csv2json = require('./csv2json');
const json2csv = require('./json2csv');


const recordsPath = "./records.csv";

// Put your credentials in the credtials.js file;
// DO NOT PUSH IT TO IT
const accessToken = require('./credentials').access_token;
const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(accessToken);


const start = parseInt(process.env.START);
const end = parseInt(process.env.END);
var i = start;
csv2json(recordsPath).then(function(records){
  P.mapSeries(R.slice(start, end, R.pluck('id')(records)), function (record){
    i = i+1;
    console.log(i);
    return spotifyApi.getAudioFeaturesForTrack(record);
  }).then(function(tracks){
    json2csv('audio_features.csv', R.pluck('body')(tracks));
  }).catch(function(err){
    console.log(err);
  });
});




//
// P.mapSeries(R.pluck('id'),songs_attr), function(track){
//   console.log(track);
//
// }).then(function(tracks){
//   console.log()
// });










