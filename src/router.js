const express = require('express');
const o2x = require('object-to-xml');
const fs = require('fs');
const estimator = require('./estimator');

const router = express.Router()

const validator = (data, callback) => {
  const errors = [];

  if (data.region.avgDailyIncomeInUSD === '') {
    errors.push('avgDailyIncomeInUSD is required');
  }

  if (data.region.avgDailyIncomePopulation === '') {
    errors.push('avgDailyIncomePopulation is required');
  }

  if (data.periodType === '') {
    errors.push('periodType is required');
  }

  if (data.timeToElapse === '') {
    errors.push('timeToElapse is required');
  }

  if (data.reportedCases === '') {
    errors.push('reportedCases is required');
  }

  if (data.population === '') {
    errors.push('population is required');
  }

  if (data.totalHospitalBeds === '') {
    errors.push('totalHospitalBeds is required');
  }

  if (errors.length) {
    return callback(data, errors);
  }

  return callback(data, null);
}

router.post('/', (req, res) => {
  validator(req.body, (data, errors) => {
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors
      });
    }

    const estimation = estimator(data);

    return res.json(estimation);
  });
});

router.post('/json', (req, res) => {
  validator(req.body, (data, errors) => {
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors
      });
    }

    const estimation = estimator(data);

    return res.json(estimation);
  });
});

router.post('/xml', (req, res) => {
  validator(req.body, (data, errors) => {
    if (errors) {
      return res.status(422).json({
        success: false,
        errors: errors
      });
    }

    const estimation = estimator(data);

    res.type('application/xml')

    return res.send(o2x(estimation));
  });
})

router.get('/logs', (req, res) => {
  fs.readFile('logs.txt', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write(data);
    res.end();
  });
})

module.exports = router

