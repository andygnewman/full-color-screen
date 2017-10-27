const fetch = require('node-fetch');
const cheerio = require('cheerio');
const SEARCH_SITE_ROUTE = 'search_colour.asp';
const SEARCH_SITE_QUERY_PARAM = 'cQuery';
const NEWLINE_REGEX = /\n|\r/g;
const TRAILING_SPACE_REGEX = /\s+$/;
const RANGE_REGEX = /(?:^\s*Colour Range: )(.*?)(?=Colour reference)/;
const NAME_REGEX = /(?:Description:       )(.*?)(?=View)/;

const constructUrl = (searchText, searchHost) => {
  const queryParam = 'cQuery';
  const url = `${searchHost}${SEARCH_SITE_ROUTE}?${SEARCH_SITE_QUERY_PARAM}=${searchText}`;
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

const extractLinkToValues = (responseText, maxResults, searchHost) => {
  const resultSet = [];
  const $ = cheerio.load(responseText, {
    ignoreWhitespace: true
  });
  const results = $('.information');
  results.each((i, el) => {
    const text = $(el).text().replace(NEWLINE_REGEX, '');
    const range = RANGE_REGEX.exec(text)[1].replace(TRAILING_SPACE_REGEX, '');
    const name = NAME_REGEX.exec(text)[1].replace(TRAILING_SPACE_REGEX, '');
    const resultObject = {
      name: `${range} ${name}`,
      link: searchHost + $(el).children('a').last().attr('href')
    };
    resultSet.push(resultObject);
    if (i === (maxResults -1)) return false;
  });
  const resultMaxNumber = results.length > maxResults ? maxResults : false;
  return {resultSet, resultMaxNumber};
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

module.exports = (searchText, searchHost, maxResults) => {
  const url = constructUrl(searchText, searchHost);
  return fetchSearch(url)
    .then(responseText => extractLinkToValues(responseText, maxResults, searchHost))
    .then(resultObject => getRGBValues(resultObject))
    .then(resultObject => returnResponse(resultObject))
};
