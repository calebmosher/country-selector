const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app
  .use(express.static('dist'))
  .use(bodyParser.json())
  .post('/api/v1/submit-countries', (req, res) => {
    setTimeout(() => {
      const success = Math.random() < .75;
      console.log(`\n${success ? 'Accepted' : 'Rejected'} countries: ${req.body}`);
      res.status(success ? 200 : 500).send();
    }, 500);
  })
  .listen('8888', () => console.log('Listening on 8888.'));
