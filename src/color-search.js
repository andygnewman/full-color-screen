const colorSearchSite1 = require('./color-search-site-1');
const colorSearchSite2 = require('./color-search-site-2');

const SEARCH_SITE_HOST_1 = 'http://encycolorpedia.com/'
const SEARCH_SITE_HOST_2 = 'https://www.e-paint.co.uk/';
const MAX_RESULTS = 5;

module.exports = (searchText, searchHost) => {
  searchText = searchText.toLowerCase();
  if (searchHost === SEARCH_SITE_HOST_1) {
    return colorSearchSite1(searchText, SEARCH_SITE_HOST_1, MAX_RESULTS);
  } else if (searchHost === SEARCH_SITE_HOST_2) {
    return colorSearchSite2(searchText, SEARCH_SITE_HOST_2, MAX_RESULTS);
  } else {
    return null;
  }
};
