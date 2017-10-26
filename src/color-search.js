const colorSearch1 = require('./color-search-1');
const colorSearch2 = require('./color-search-2');

const SEARCH_SITE_HOST_1 = 'https://www.e-paint.co.uk/';
const SEARCH_SITE_HOST_2 = 'http://encycolorpedia.com/'
const MAX_RESULTS = 5;

module.exports = (searchText, searchHost) => {

  if (searchHost === SEARCH_SITE_HOST_1) {
    return colorSearch1(searchText, SEARCH_SITE_HOST_1, MAX_RESULTS);
  } else if (searchHost === SEARCH_SITE_HOST_2) {
    return colorSearch2(searchText, SEARCH_SITE_HOST_2, MAX_RESULTS);
  } else {
    return null;
  }

};
