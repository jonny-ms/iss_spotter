const request = require("request");

const fetchMyIP = (callback) => {
  request("https://api.ipify.org/?format=json", (err, resp, body) => {
    if (err) return callback(err, null);
    if (resp.statusCode !== 200) {
      const msg = `Status Code ${resp.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const localIP = JSON.parse(body).ip;
    callback(null, localIP);
  });
};

const fetchCoordsByIP = (ip, callback) => {
  request(`https://ipvigilante.com/${ip}`, (err, resp, body) => {
    if (err) return callback(err, null);
    if (resp.statusCode !== 200) {
      const msg = `Status Code ${resp.statusCode} when fetching coords. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const { latitude, longitude } = JSON.parse(body).data;
    callback(null, { latitude, longitude});
  });
};

const fetchISSFlyOverTimes = (coords, callback) => {
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`, (err, resp, body) => {
    if (err) return callback(err, null);
    if (resp.statusCode !== 200) {
      const msg = `Status Code ${resp.statusCode} when fetching ISS fly over times. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    const flyOvers = JSON.parse(body).response;
    callback(null, flyOvers);
  });
};

const nextISSTimesForMyLocation = (callback) => {
  
  fetchMyIP((err, ip) => {
    if (err) return callback(err, null);

    fetchCoordsByIP(ip, (err, coords) => {
      if (err) return callback(err, null);

      fetchISSFlyOverTimes(coords, (err, flyOvers) => {
        if (err) return callback(err, null);

        callback(null, flyOvers);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };