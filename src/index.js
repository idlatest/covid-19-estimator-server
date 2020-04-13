const express = require('express');
const cors = require('cors');
const fs = require('fs');
const router = require('./router')
const port = 3000
const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => {
    fs.appendFile('log.txt', `${req.method} \t\t ${req.originalUrl} \t\t ${res.statusCode} \t\t ${Date.now() - startTime}ms \n`, function (err) {
      if (err) throw err;
      console.log('Saved!');
    });
  });

  next();
})
app.use('/api/v1/on-covid-19', router);

app.listen(port, () => console.log(`Server listening on port ${port}`));