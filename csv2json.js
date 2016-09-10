const fs = require('fs');
const csv = require('fast-csv');
const tracks = [];
const P = require('bluebird');

const getJSONfromCSV = function(filepath){
  return (new P(function(resolve, reject){
    fs.createReadStream(filepath)
      .pipe(csv({headers: true}))
      .on("data", function(data){
        // console.log(data);
        tracks.push(data);
      })
      .on("end", function(){
        resolve(tracks);
      });
  }));
};

module.exports = getJSONfromCSV;

