const express = require('express');
const app = express();
const sassMiddleware = require('node-sass-middleware');
const port = process.env.PORT || 3000;

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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
