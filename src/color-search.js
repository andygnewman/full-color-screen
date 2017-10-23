const fetch = require('node-fetch');
const cheerio = require('cheerio');
const SEARCH_SITE_HOST = 'https://www.e-paint.co.uk/';
const SEARCH_SITE_ROUTE = 'search_colour.asp';
const NEWLINE_REGEX = /\n|\r/g;
const TRAILING_SPACE_REGEX = /\s+$/;
const RANGE_REGEX = /(?:^\s*Colour Range: )(.*?)(?=Colour reference)/;
const NAME_REGEX = /(?:Description:       )(.*?)(?=View)/;
const MAX_RESULTS = 5;

const constructUrl = (searchText, searchSite = SEARCH_SITE_HOST) => {
  const queryParam = searchSite === SEARCH_SITE_HOST ? 'cQuery' : 'q';
  const url = `${searchSite}${SEARCH_SITE_ROUTE}?${queryParam}=${searchText}`;
  return url;
};

const fetchSearch = (url) => {
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
    ignoreWhitespace: true
  });
  const results = $('.information');
  results.each((i, el) => {
    const text = $(el).text().replace(NEWLINE_REGEX, '');
    const resultObject = {
      range: RANGE_REGEX.exec(text)[1].replace(TRAILING_SPACE_REGEX, ''),
      name: NAME_REGEX.exec(text)[1].replace(TRAILING_SPACE_REGEX, ''),
      link: SEARCH_SITE_HOST + $(el).children('a').last().attr('href')
    };
    resultSet.push(resultObject);
    if (i === (MAX_RESULTS -1)) return false;
  });
  return {resultSet, resultMaxNumber: results.length > 5};
};

const extractRGBValues = (colourPages) => {
  const rgbValues = [];
  colourPages.forEach(page => {
    const $ = cheerio.load(page, {
      ignoreWhitespace: true
    });
    const rgbValue = $('.lab-result').children('span').eq(2)
      .children('div').eq(2)
      .children('p').eq(1)
      .text()
      .replace(/\s/g, '')
      .replace(/sRGB\:/, '')
      .split(';');
    rgbValues.push(rgbValue);
  });
  return rgbValues;
};

const getRGBValues = (resultObject) => {
  const {resultSet, resultMaxNumber} = resultObject;
  const promises = [];
  const links = resultSet.map(result => result.link);
  links.forEach(link => {
    promises.push(fetchSearch(link));
  });
  return Promise.all(promises)
    .then(colourPages => {
      const rgbValues = extractRGBValues(colourPages);
      resultSet.forEach((result, index) => result.rgb = rgbValues[index]);
      return {resultSet, resultMaxNumber};
    });
};

const returnResponse = (resultObject) => {
  return resultObject;
};

module.exports = (searchText, searchSite) => {
  const url = constructUrl(searchText, searchSite);
  return fetchSearch(url)
    .then(response => extractLinkToValues(response))
    .then(resultObject => getRGBValues(resultObject))
    .then(resultObject => resultObject);
};
