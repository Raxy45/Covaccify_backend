var metaData = [];
var metaDataOP = [];

function returnAvailableCentersArray(minimumAge, centers) {
  centers.forEach((center) => {
    var intermediate = {
      centerName: center.name,
      centerAddress: center.address,
      sessionVaccineFee: center.fee_type,
      sessionsInCenter: [],
    };
    center.sessions.forEach((session, currentSessionIndex) => {
      if (
        session.min_age_limit == minimumAge &&
        session.available_capacity > 0
      ) {
        var sessionInCenter = {
          sessionAvailableCapacity: session.available_capacity,
          sessionDate: session.date,
          sessionVaccine: session.vaccine,
        };
        intermediate.sessionsInCenter.push(sessionInCenter);
        //   if(center.sessions.length-1==currentSessionIndex){
        //       metaData.push(intermediate)
        //   }
      }
    });
    metaData.push(intermediate);
  });
  metaDataOP = dataRedundancySolver(metaData);
  return metaDataOP;
}

function dataRedundancySolver(m) {
  var hehe = m.filter((center) => {
    if (center.sessionsInCenter.length > 0) {
      return center;
    }
  });
  return hehe;
}

module.exports = returnAvailableCentersArray;
