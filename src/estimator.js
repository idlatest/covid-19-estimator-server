const normaliseDurationToDays = (periodType, duration) => {
  let days;

  if (periodType === 'days') {
    days = duration;
  } else if (periodType === 'weeks') {
    days = duration * 7;
  } else {
    days = duration * 30;
  }

  return days;
};

const currentlyInfected = (reportedCases, multiplier) => reportedCases * multiplier;

const infectionsByRequestedTime = (currentlyInfectedCount, days) => {
  const factor = 2 ** Math.trunc(days / 3);

  return currentlyInfectedCount * factor;
};

const severeCasesByRequestedTime = (infections, percentage) => {
  const cases = Math.trunc((percentage / 100) * infections);

  return cases;
};

const hospitalBedsByRequestedTime = (totalHospitalBeds, cases) => {
  const availableBeds = (totalHospitalBeds * (35 / 100));

  return Math.trunc(availableBeds - cases);
};

const casesForICUByRequestedTime = (infections) => Math.trunc((5 / 100) * infections);

const casesForVentilatorsByRequestedTime = (infections) => Math.trunc((2 / 100) * infections);

const dollarsInFlight = (infections, avgDailyIncomeInUSD, avgDailyIncomePopulation, days) => {
  const result = Math.trunc((infections * avgDailyIncomeInUSD * avgDailyIncomePopulation) / days);
  return result;
};

const covid19ImpactEstimator = (data) => {
  // currentlyInfected
  const iCurrentlyInfected = currentlyInfected(data.reportedCases, 10);
  const sCurrentlyInfected = currentlyInfected(data.reportedCases, 50);

  const days = normaliseDurationToDays(data.periodType, data.timeToElapse);

  // infectionsByRequestedTime
  const iInfectionsByRequestedTime = infectionsByRequestedTime(
    iCurrentlyInfected,
    days
  );
  const sInfectionsByRequestedTime = infectionsByRequestedTime(
    sCurrentlyInfected,
    days
  );

  // severeCasesByRequestedTime
  const iSevereCasesByRequestedTime = severeCasesByRequestedTime(
    iInfectionsByRequestedTime,
    15
  );
  const sSevereCasesByRequestedTime = severeCasesByRequestedTime(
    sInfectionsByRequestedTime,
    15
  );

  const iHospitalBedsByRequestedTime = hospitalBedsByRequestedTime(
    data.totalHospitalBeds,
    iSevereCasesByRequestedTime
  );
  const sHospitalBedsByRequestedTime = hospitalBedsByRequestedTime(
    data.totalHospitalBeds,
    sSevereCasesByRequestedTime
  );

  // casesForICUByRequestedTime
  const iCasesForICUByRequestedTime = casesForICUByRequestedTime(
    iInfectionsByRequestedTime
  );
  const sCasesForICUByRequestedTime = casesForICUByRequestedTime(
    sInfectionsByRequestedTime
  );

  // casesForVentilatorsByRequestedTime
  const iCasesForVentilatorsByRequestedTime = casesForVentilatorsByRequestedTime(
    iInfectionsByRequestedTime
  );
  const sCasesForVentilatorsByRequestedTime = casesForVentilatorsByRequestedTime(
    sInfectionsByRequestedTime
  );

  // dollarsInFlight
  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = data.region;

  const iDollarsInFlight = dollarsInFlight(
    iInfectionsByRequestedTime,
    avgDailyIncomeInUSD,
    avgDailyIncomePopulation,
    days
  );
  const sDollarsInFlight = dollarsInFlight(
    sInfectionsByRequestedTime,
    avgDailyIncomeInUSD,
    avgDailyIncomePopulation,
    days
  );

  const input = data;

  return {
    input, // the input data you got
    impact: {
      currentlyInfected: iCurrentlyInfected,
      infectionsByRequestedTime: iInfectionsByRequestedTime,
      severeCasesByRequestedTime: iSevereCasesByRequestedTime,
      hospitalBedsByRequestedTime: iHospitalBedsByRequestedTime,
      casesForICUByRequestedTime: iCasesForICUByRequestedTime,
      casesForVentilatorsByRequestedTime: iCasesForVentilatorsByRequestedTime,
      dollarsInFlight: iDollarsInFlight
    }, // your best case estimation
    severeImpact: {
      currentlyInfected: sCurrentlyInfected,
      infectionsByRequestedTime: sInfectionsByRequestedTime,
      severeCasesByRequestedTime: sSevereCasesByRequestedTime,
      hospitalBedsByRequestedTime: sHospitalBedsByRequestedTime,
      casesForICUByRequestedTime: sCasesForICUByRequestedTime,
      casesForVentilatorsByRequestedTime: sCasesForVentilatorsByRequestedTime,
      dollarsInFlight: sDollarsInFlight
    }
  };
};

module.exports = covid19ImpactEstimator;
