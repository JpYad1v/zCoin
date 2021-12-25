// TIMESTAMP

function getTimeStamp() {

  const date = new Date();

  var dateday = date.toDateString();

  var time = date.toLocaleTimeString();

  var timestamp = dateday + " " + time;

  return timestamp
}

module.exports = {
  getTimeStamp
};
