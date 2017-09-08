const fetch = require('node-fetch');
const cheerio = require('cheerio');
const SEARCH_SITE_DEFAULT = 'https://www.e-paint.co.uk/search_colour.asp';

const constructUrl = (searchText, searchSite = SEARCH_SITE_DEFAULT) => {
  const queryParam = searchSite === SEARCH_SITE_DEFAULT ? 'cQuery' : 'q';
  const url = `${searchSite}?${queryParam}=${searchText}`;
  return url;
};

const fetchSearch = (url) => {
  console.log('URL: ', url);
  const options = {
    method: 'POST'
  };
  return fetch(url, options)
    .then(response => {
      return response.text();
    });
};

const extractLinkToValues = (responseText) => {
  const resultSet = [];
  const $ = cheerio.load(responseText, {
    ignoreWhitespace: true,
    xmlMode: true
  });
  const results = $('.information');
  console.log('Length: ', $('.results').length);
  results.each((i, el) => {
    console.log('Iteration: ', i, ' content', $(this).children('b'));
    resultSet.push($(this).html());
  });
  // console.log('Cheerio ResultSet: ', resultSet);
  return resultSet;
};

const returnResponse = (response) => {
  return { body: response };
};

module.exports = (searchText, searchSite) => {
  const url = constructUrl(searchText, searchSite);
  return fetchSearch(url)
    .then(response => {
      return returnResponse(extractLinkToValues(response));
    });
};
