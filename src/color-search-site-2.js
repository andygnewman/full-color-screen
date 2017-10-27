const fetch = require('node-fetch');
const cheerio = require('cheerio');
const SEARCH_SITE_ROUTE = 'search';
const SEARCH_SITE_QUERY_PARAM = 'q';
const HEX_REGEX = /#[a-z0-9]{6}\s\/\s/;
const RGB_REGEX = /(?:rgb\()(.*?)(?=\))/;
const APOSTROPHE_REGEX = /(\'[a-z]+)(?=\+)/g;

const constructUrl = (searchText, searchHost) => {
  const apostropheText = APOSTROPHE_REGEX.exec(searchText);
  const normalizedSearchText = apostropheText ? searchText.replace(apostropheText.pop(), '') : searchText;
  const queryParam = 'cQuery';
  const url = `${searchHost}${SEARCH_SITE_ROUTE}?${SEARCH_SITE_QUERY_PARAM}=${normalizedSearchText}`;
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
    const resultName = nameTextArray.find(name => {
      const standardizeName = name.toLowerCase().replace(/\\/g, '').replace(/\s/g, '+');
      return standardizeName.includes(searchText);
    });
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
