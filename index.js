require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({extended:true}));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const originalUrls = [];
const shorturls = [];

app.post('/api/shorturl', function(req, res) {
  const url = req.body.url;
  const foundIndex = originalUrls.indexOf(url);
  if(!url.includes("https://") && !url.includes("http://")){
    return res.json({error:"invalid url"})
  }
  if(foundIndex<0){
    originalUrls.push(url);
    shorturls.push(shorturls.length);
    res.json({ 
      original_url: url,
      short_url: shorturls.length-1
    });
  }
  res.json({ 
    original_url: url,
    short_url: shorturls[foundIndex]
  });
 
});

app.get('/api/shorturl/:shorturl', function(req, res) {
  const shorturl = parseInt(req.params.shorturl);
  const foundIndex = shorturls.indexOf(shorturl);
  if(foundIndex<0){
    return res.json({ "error": "No Short URL found for the given input" });
  }
 res.redirect(originalUrls[foundIndex]);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
