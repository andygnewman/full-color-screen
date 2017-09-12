const Superstore = require('superstore');
const localStore = new Superstore('local', 'fullScreenPaintSample');

const buttonCloseOverlay = document.querySelector('.button__close--overlay');
const buttonCloseCookies = document.querySelector('.button__close--cookies');
const buttonColorSearch = document.querySelector('.button__color-search');
const inputColorSearch = document.querySelector('.input__color-search');
const overlay = document.querySelector('.overlay');
const cookieNotice = document.querySelector('.cookie-notice');
const colorSearchPlaceholder = document.querySelector('.color-search__placeholder');
const colorSearchResults = document.querySelector('.color-search__results');

const checkCookieAcceptance = () => {
  return localStore.get('cookieAcceptance')
    .then(cookieAcceptance => cookieAcceptance);
};

const acceptCookieNotice = () => {
  localStore.set('cookieAcceptance', true)
    .then(() => cookieNotice.style.display = 'none');
}

const initiateOverlay = (evt) => {
  console.log('Event: ', evt.srcElement.dataSet.rgb);
  const rgbValue = evt.srcElement.dataSet.rgb;
  overlay.style.backgroundColor = `rgb(${rgbValue})`;
  overlay.style.display = 'block';
};

const closeOverlay = () => {
  overlay.style.display = 'none';
};

const colorSearch = () => {
  const searchText = inputColorSearch.value.split(' ').join('+');
  const searchSite = encodeURIComponent(document.querySelector('input[name=colorSearchLink]:checked').value);
  return fetch(`/search/${searchText}/${searchSite}`)
    .then(response => response.text())
    .then(colorResult => {
      colorSearchResults.innerHTML = colorResult;
      const initiateOverlayButtons = document.querySelectorAll('.button__initiate--overlay');
      initiateOverlayButtons.forEach(button => button.onclick = initiateOverlay);
      colorSearchPlaceholder.style.display = 'none';
    });
};

document.onkeydown = (evt) => {
  evt = evt || window.event;
  if (evt.keyCode === 27) {
    closeOverlay();
  }
};

if (buttonCloseOverlay) { buttonCloseOverlay.onclick = closeOverlay };
if (buttonColorSearch) { buttonColorSearch.onclick = colorSearch };
if (buttonCloseCookies) { buttonCloseCookies.onclick = acceptCookieNotice };

checkCookieAcceptance()
  .then(cookieAcceptance => {
    if (!cookieAcceptance) {
      cookieNotice.style.display = 'block';
    }
  })
