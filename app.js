const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');
const sassMiddleware = require('node-sass-middleware');
const port = process.env.PORT || 3000;
const colorSearch = require('./src/color-search');


app.engine('html', exphbs({
  defaultLayout: 'main',
  extname: '.html'
}));
app.set('view engine', 'html');

app.use(
   sassMiddleware({
       src: __dirname + '/client/sass',
       dest: __dirname + '/public',
       debug: true,
   })
);

app.use(express.static('public'));

app.get('/googled24e63e7a97d5253.html', (req, res) => {
  res.render('googled24e63e7a97d5253');
});

app.get('/cookies', (req, res) => {
  res.render('cookies');
});

app.get('/search/:searchText/:searchSite?', (req, res) => {
  const searchText = req.params.searchText;
  const searchSite = decodeURIComponent(req.params.searchSite);
  return colorSearch(searchText, searchSite)
  .then(colors => res.render('color-search', {
    colors,
    layout: false
  }));
});

app.get('/', (req, res) => {
  res.render('home', {
    root: __dirname + '/views/'
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
