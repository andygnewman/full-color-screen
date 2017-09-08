const fetch = require('node-fetch');
const cheerio = require('cheerio');
const SEARCH_SITE_HOST = 'https://www.e-paint.co.uk/';
const SEARCH_SITE_ROUTE = 'search_colour.asp';
const NEWLINE_REGEX = /\n|\r/g;
const TRAILING_SPACE_REGEX = /\s+$/;
const RANGE_REGEX = /(?:^\s*Colour Range: )(.*?)(?=Colour reference)/;
const DESCRIPTION_REGEX = /(?:Description:       )(.*?)(?=View L)/;

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
    const text = $(el).text().replace(NEWLINE_REGEX, "");
    console.log('Iteration: ', i, ', Text: ', text);
    const resultObject = {
      range: RANGE_REGEX.exec(text)[1].replace(TRAILING_SPACE_REGEX, ""),
      description: DESCRIPTION_REGEX.exec(text)[1].replace(TRAILING_SPACE_REGEX, ""),
      link: SEARCH_SITE_HOST + $(el).children('a').attr('href')
    };
    resultSet.push(resultObject);
  });
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
