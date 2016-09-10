const elasticsearch = require('elasticsearch');
const moment = require("moment");
const client = new elasticsearch.Client({
  host: '192.168.99.100:9200',
  log: 'trace'
});
const R = require('ramda');

const csv2json = require('./csv2json');

const createBody = function(record){
  return [
    {
      index: {_index: 'song_attr', _type: 'song_attr', _id: record.id}
    },
    R.assoc('timestamp')(moment.utc())(record)
  ]
}
csv2json('./Final_Final_Probability.csv').then(function(records){
  client.bulk({
    body: R.compose(R.flatten, R.map(createBody))(R.slice(0, 9406, records))
  }, function(err, resp){
    // console.log(err)
    // console.log(resp)
  })
});