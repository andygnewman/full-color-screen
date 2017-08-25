const express = require('express');
const app = express();
const sassMiddleware = require('node-sass-middleware');

app.use(
   sassMiddleware({
       src: __dirname + '/client/sass',
       dest: __dirname + '/public',
       debug: true,
   })
);

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile('home.html', {
    root: __dirname + '/views/'
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
