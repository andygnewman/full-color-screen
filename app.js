const express = require('express');
const app = express();
const sassMiddleware = require('node-sass-middleware');
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(
   sassMiddleware({
       src: __dirname + '/client/sass',
       dest: __dirname + '/public',
       debug: true,
   })
);

app.use(express.static('public'));

app.get('/cookies', function (req, res) {
  res.render('cookies', {
    root: __dirname + '/views/'
  });
});

app.get('/', function (req, res) {
  res.render('home', {
    root: __dirname + '/views/'
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
