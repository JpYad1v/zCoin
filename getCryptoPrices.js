// API KEY - 1f72151d3ea004f9305149cabf5698b386786850

const request = require('sync-request');

function getPrice(coinID) {

  var req = "https://api.nomics.com/v1/currencies/ticker?key=1f72151d3ea004f9305149cabf5698b386786850&ids=" + coinID + "&interval=1d,30d&convert=INR&per-page=100&page=1";

  var response = request('GET', req);

  var responseBody = response.getBody().toString();

  var jsonBody = JSON.parse(responseBody);

  return jsonBody[0].price;

}

function getRank(coinID) {

  var req = "https://api.nomics.com/v1/currencies/ticker?key=1f72151d3ea004f9305149cabf5698b386786850&ids=" + coinID + "&interval=1d,30d&convert=INR&per-page=100&page=1";

  var response = request('GET', req);

  var responseBody = response.getBody().toString();

  var jsonBody = JSON.parse(responseBody);

  return jsonBody[0].rank;

}

function getDescription(coinID) {

  var req = "https://api.nomics.com/v1/currencies?key=1f72151d3ea004f9305149cabf5698b386786850&ids=" + coinID + "&attributes=description";

  var response = request('GET', req);

  var responseBody = response.getBody().toString();

  var jsonBody = JSON.parse(responseBody);

  return jsonBody[0].description;

}

module.exports = {
  getPrice,
  getRank,
  getDescription
};
