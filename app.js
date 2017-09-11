const express = require('express');
const app = express();
const sassMiddleware = require('node-sass-middleware');
const port = process.env.PORT || 3000;
const colorSearch = require('./src/color-search');


app.set('view engine', 'ejs');

app.use(
   sassMiddleware({
       src: __dirname + '/client/sass',
       dest: __dirname + '/public',
       debug: true,
   })
);

app.use(express.static('public'));

app.get('/googled24e63e7a97d5253.html', (req, res) => {
  res.sendFile('googled24e63e7a97d5253.html', {
    root: __dirname + '/views/'
  })
});

app.get('/cookies', (req, res) => {
  res.render('cookies', {
    root: __dirname + '/views/'
  });
});

app.get('/search/:searchText/:searchSite?', (req, res) => {
  const searchText = req.params.searchText;
  const searchSite = req.params.searchSite;
  return colorSearch(searchText, searchSite)
  .then(response => res.json(response));
});

app.get('/', (req, res) => {
  res.render('home', {
    root: __dirname + '/views/'
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
