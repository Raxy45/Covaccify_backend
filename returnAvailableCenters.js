function returnAvailableCentersArray(user, centers) {
  var metaData = [];
  var metaDataOP = [];
  centers.forEach((center) => {
    var intermediate = {
      centerName: center.name,
      centerAddress: center.address,
      sessionVaccineFee: center.fee_type,
      sessionsInCenter: [],
    };
    center.sessions.forEach((session, currentSessionIndex) => {
      if (
        session.min_age_limit == user.minimumAge &&
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
  // console.log(user.pincode, metaDataOP.length);
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
