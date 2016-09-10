const SpotifyWebApi = require('spotify-web-api-node');
const R = require('ramda');
const P = require('bluebird');
const csv2json = require('./csv2json');
const json2csv = require('./json2csv');


const recordsPath = "./Artist_ID.csv";

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
csv2json(recordsPath).then(function(records){
  P.mapSeries(R.compose(R.splitEvery(n), R.slice(start, end), R.pluck('x'))(records), function(nrecords){
    // console.log(nrecords)
    return (new P(function(resolve, reject){
      const primaryArtists = R.compose(R.map(R.head), R.map(R.split(';')))(nrecords);
      spotifyApi.getArtists(primaryArtists).then(function(r){
        var artist = R.map(R.pick(['genres', 'popularity', 'name', 'id', 'followers']))(r.body.artists);
        artist = R.map(function(a){
          return R.merge(a)({genres: R.ifElse(
            R.identity,
            R.join(';'),
            R.identity
          )(a.genres), followers: a.followers.total})
        })(artist);
        recordsDone.push(artist);
        resolve(true);
      }).catch(function(err){
        console.log(err)
        recordsDone.push(artist);
        reject(err)
      })
    }));
  }).then(function(r){
    const toWrite = R.flatten(recordsDone);
    json2csv('artist_details.csv', toWrite);
  }).catch(function(err){
    const toWrite = R.flatten(recordsDone);
    console.log(err);
    json2csv('artist_details.csv', toWrite);

  })
  // P.mapSeries(R.compose(R.splitEvery(n), R.slice(start, end), R.pluck('id'))(records), function (nrecords){
  //   console.log(i);
  //   i = i+n;
  //   return (new P(function(resolve, reject){
  //     spotifyApi.getAudioFeaturesForTracks(nrecords).then(function(track){
  //       recordsDone.push(track);
  //       resolve(true);
  //     }).catch(function(err){
  //       console.log(err)
  //       reject(err)
  //     })
  //   }));
  // }).then(function(tracks){
  //   const toWrite = R.compose(R.flatten, R.pluck('audio_features'), R.pluck('body'))(recordsDone)
  //   // console.log(toWrite)
  //   json2csv('audio_features_multiple.csv', toWrite);
  // }).catch(function(err){
  //   console.log(err);
  //   const toWrite = R.compose(R.flatten, R.pluck('audio_features'), R.pluck('body'))(recordsDone)
  //   // console.log(toWrite)
  //   json2csv('audio_features_multiple.csv', toWrite);
  // });
});











