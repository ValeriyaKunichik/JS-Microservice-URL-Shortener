require('dotenv').config();
var bodyParser = require('body-parser')
const express = require('express');
const cors = require('cors');
const app = express();
var short_url=0;
var url_map={};
var dns = require('dns');
var urlExists = require("url-exists");

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl',(req, res) => {
var new_url = req.body.url;
short_url+=1;
url_map[short_url]=new_url;

urlExists(new_url, function(err, exists) {
  if (exists) {
    res.json({"original_url":new_url,"short_url":short_url});
  } else {
    res.json({ error: 'invalid url' });
  }
});

});

app.get("/api/shorturl/:param", function (req, res) {
  let { param } = req.params;
  let my_url=url_map[param];
  
  console.log(my_url);
  res.status(301).redirect(my_url);
});
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
