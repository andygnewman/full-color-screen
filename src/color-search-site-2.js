const fetch = require('node-fetch');
const cheerio = require('cheerio');
const SEARCH_SITE_ROUTE = 'search';
const SEARCH_SITE_QUERY_PARAM = 'q';
const HEX_REGEX = /#[a-z0-9]{6}\s\/\s/;
const RGB_REGEX = /(?:rgb\()(.*?)(?=\))/;

const constructUrl = (searchText, searchHost) => {
  const queryParam = 'cQuery';
  const url = `${searchHost}${SEARCH_SITE_ROUTE}?${SEARCH_SITE_QUERY_PARAM}=${searchText}`;
  return url;
};

const fetchSearch = (url) => {
  const options = {
    method: 'GET'
  };
  return fetch(url, options)
    .then(response => {
      return response.text();
    });
};

const extractResults = (responseText, maxResults, searchText) => {
  const resultSet = [];
  const $ = cheerio.load(responseText, {
    ignoreWhitespace: true
  });
  const results = $('#search').children().first().children();
  results.each((i, el) => {
    const nameText = $(el).children('ul').first().children('li').eq(1).children('h2').text();
    const nameTextArray = nameText.replace(HEX_REGEX, '').split(',');
    const resultName = nameTextArray.find(name => name.toLowerCase().includes(searchText.replace('+', ' ')));
    const rgbText = $(el).children('ul').first().children('li').eq(1).children('p').eq(1).text();
    const resultRgb = RGB_REGEX.exec(rgbText)[1].split(',');
    const resultObject = {
      name: resultName,
      rgb: resultRgb
    };
    resultSet.push(resultObject);
    if (i === (maxResults -1)) return false;
  });
  const resultMaxNumber = results.length > maxResults ? maxResults : false;
  return {resultSet, resultMaxNumber};
};

const returnResponse = (resultObject) => {
  return resultObject;
};

module.exports = (searchText, searchHost, maxResults) => {
  const url = constructUrl(searchText, searchHost);
  return fetchSearch(url)
    .then(responseText => extractResults(responseText, maxResults, searchText))
    .then(resultObject => returnResponse(resultObject))
};
