const SpotifyWebApi = require('spotify-web-api-node');
const R = require('ramda');
const P = require('bluebird');
const request = require('superagent');

const songs = require('./platinum-songs');

// Get credentials from command line
const clientId = process.env['CLIENT_ID'];
const clientSecret = process.env['CLIENT_SECRET'];
// Uncomment and enter your access token
// const accessToken =


const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

spotifyApi.setAccessToken(accessToken);

const songSearchQueries = R.map(function (song) {
    return "track:" + song.Title + " artist:" + song.Artist;
  })(songs);
// console.log(songSearchQueries);

const getCleanSong = function(song){
  const nestedProps = {
    album_type: song.album.album_type,
    album_id: song.album.id,
    album_name: song.album.name,
    artist_ids: R.compose(R.join(';'), R.pluck('id'))(song.artists),
    artist_names: R.compose(R.join(';'), R.pluck('name'))(song.artists)
  };
  const flatProps = R.pick(['id', 'name', 'popularity', 'explicit'])(song)

  return R.merge(nestedProps)(flatProps);
}
const cleanUpSong = function(songBody){
  // console.log(songBody.body.tracks.items);
  const songs = R.map(getCleanSong)(songBody.body.tracks.items);
  return songs;
};

// const songRecords = P.mapSeries(songSearchQueries, function (songQuery){
//   console.log(songQuery);
//   return spotifyApi.searchTracks(songQuery);
// }).then(function(songs){
//   const allSongs = R.flatten(R.map(cleanUpSong)(songs));
// });

const songs_attr = require('./song_attr');

const trackIds = R.compose(R.join(','), R.pluck('id'))(R.slice(0, 2, songs_attr));
console.log(trackIds);

// P.mapSeries(R.pluck('id'),songs_attr), function(track){
//   console.log(track);
//   return spotifyApi.getAudioFeaturesForTrack(track);
// }).then(function(tracks){
//   console.log(R.pluck('body')(tracks))
// });










