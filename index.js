const { nextISSTimesForMyLocation } = require('./iss');

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  for (let passes of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(passes.risetime);
    let message = `Next pass at ${datetime} for ${passes.duration} seconds!`;
    console.log(message);
  }
});