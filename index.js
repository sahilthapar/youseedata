const SpotifyWebApi = require('spotify-web-api-node');
const R = require('ramda');
const P = require('bluebird');
const request = require('superagent');
const csv2json = require('./csv2json');
const json2csv = require('./json2csv');


const collatedDataFilePath = "./collated_data_set.csv";

// Put your credentials in the credtials.js file;
// DO NOT PUSH IT TO IT
const accessToken = require('./credentials').access_token;
console.log(accessToken);
const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(accessToken);

// Did not include the credentials file

//To test if the branch will work or not. 




const getTrackQuery = function(song){
  return "track:" + song.Song + " artist:" + song.Artist;
};

const extractProps = function(flag){
  return function(song){
    const nestedProps = {
      album_type: song.album.album_type,
      album_id: song.album.id,
      album_name: song.album.name,
      artist_ids: R.compose(R.join(';'), R.pluck('id'))(song.artists),
      artist_names: R.compose(R.join(';'), R.pluck('name'))(song.artists),
      flag: flag
    };
    const flatProps = R.pick(['id', 'name', 'popularity', 'explicit'])(song)

    return R.merge(nestedProps)(flatProps);
  }
};

const extractSongDetails = function(tracks){
  return function(songBody, idx){
    const flag = tracks[start+idx].PlatinumGoldFlag
    const songs = R.map(extractProps(flag))(songBody.body.tracks.items);
    return songs;
  }
};
var tracksCopy = [];
var mapIndexed = R.addIndex(R.map);
const start = parseInt(process.env.START);
const end = parseInt(process.env.END);
var i = start;
csv2json('./collated_data_set.csv').then(function(tracks){
  P.mapSeries(R.slice(start, end, tracks), function (track){
    tracksCopy = tracks;
    const trackQuery = getTrackQuery(track);
    console.log(trackQuery);
    console.log(i);
    i = i+1;
    return new P(function(resolve){
      setTimeout(resolve, 250)
    }).then(function(r){
      return spotifyApi.searchTracks(trackQuery);
    })
  }).then(function(tracksRes){
    const cleanTracks = R.flatten(mapIndexed(extractSongDetails(tracksCopy))(tracksRes));
    console.log(cleanTracks)
    json2csv('records.csv', cleanTracks);
  }).catch(function(err){
    console.log(err);
  });
});




// console.log(songSearchQueries);
//
//
//
// const startIndex = process.env['START'];
// const endIndex = process.env['END'];
//
//
//
//
// const songs_attr = require('./song_attr');
//
// const trackIds = R.compose(R.join(','), R.pluck('id'))(R.slice(0, 2, songs_attr));
// console.log(trackIds);

// P.mapSeries(R.pluck('id'),songs_attr), function(track){
//   console.log(track);
//   return spotifyApi.getAudioFeaturesForTrack(track);
// }).then(function(tracks){
//   console.log(R.pluck('body')(tracks))
// });
