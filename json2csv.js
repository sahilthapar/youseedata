const json2csv = require('json2csv');
const fs = require('fs');
const R = require('ramda');
// const audioFeatures = require('./audio_features');
// const songAttr = require('./song_attr');
// const fields1 = R.keys(audioFeatures[0]);
// const fields2 = R.keys(songAttr[0]);
//
// const csv1 = json2csv({ data: audioFeatures, fields: fields1 });
// const csv2 = json2csv({ data: songAttr, fields: fields2 });
//
// fs.writeFile('audio_features.csv', csv1, function(err) {
//   if (err) throw err;
//   console.log('file saved');
// });
// fs.writeFile('song_attr.csv', csv2, function(err) {
//   if (err) throw err;
//   console.log('file saved');
// });


module.exports = function(filepath, data){
  const fields  = R.keys(data[0]);
  const csv = json2csv({ data: data, fields: fields });
  return fs.appendFile(filepath, csv, function(err) {
    if (err) throw err;
    console.log('file saved');
  });
};