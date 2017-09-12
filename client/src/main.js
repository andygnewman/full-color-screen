const Superstore = require('superstore');

const localStore = new Superstore('local', 'fullScreenPaintSample');

const buttonInitiate = document.querySelector('.button__initiate');
const buttonCloseOverlay = document.querySelector('.button__close--overlay');
const buttonCloseCookies = document.querySelector('.button__close--cookies');
const buttonColorSearch = document.querySelector('.button__color-search');
const inputHexCode = document.querySelector('.input__hex-code');
const inputColorSearch = document.querySelector('.input__color-search');
const overlay = document.querySelector('.overlay');
const cookieNotice = document.querySelector('.cookie-notice');
const errorPlaceholder = document.querySelector('.error');
const colorSearchPlaceholder = document.querySelector('.color-search__placeholder');
const colorSearchResults = document.querySelector('.color-search__results');
const colorSearchIframe = document.querySelector('.color-search__iframe');
const HEX_REGEX = /^#[0-9A-F]{6}$/i;

const checkCookieAcceptance = () => {
  return localStore.get('cookieAcceptance')
    .then(cookieAcceptance => cookieAcceptance);
};

const acceptCookieNotice = () => {
  localStore.set('cookieAcceptance', true)
    .then(() => cookieNotice.style.display = 'none');
}

const resetHexCodeError = () => {
  errorPlaceholder.textContent = '';
};

const checkHexCodeForError = (inputHexCodeValue) => {
  if (!HEX_REGEX.test(inputHexCodeValue)) {
    const errorMessage = 'HEX code needs to be # followed by 6 characters, 0 to 9, or A to F';
    errorPlaceholder.textContent = errorMessage;
    return false;
  };
  return inputHexCodeValue;
};

const initiateOverlay = () => {
  const inputHexCodeValue = checkHexCodeForError(inputHexCode.value);
  if (!inputHexCodeValue) {
    return;
  }
  overlay.style.backgroundColor = inputHexCodeValue;
  overlay.style.display = 'block';
};

const closeOverlay = () => {
  overlay.style.display = 'none';
};

const initiateColorSearch = () => {
  const searchText = inputColorSearch.value.split(' ').join('+');
  const searchSite = encodeURIComponent(document.querySelector('input[name=colorSearchLink]:checked').value);
  return fetch(`/search/${searchText}/${searchSite}`)
    .then(response => response.text())
    .then(colorResult => {
      console.log('colorResult: ', colorResult);
      colorSearchResults.innerHTML = colorResult;
      colorSearchPlaceholder.style.display = 'none';
    });
};

document.onkeydown = (evt) => {
  evt = evt || window.event;
  if (evt.keyCode === 27) {
    closeOverlay();
  }
};

inputHexCode && inputHexCode.addEventListener("click", resetHexCodeError);

if (buttonInitiate) { buttonInitiate.onclick = initiateOverlay };
if (buttonCloseOverlay) { buttonCloseOverlay.onclick = closeOverlay };
if (buttonColorSearch) { buttonColorSearch.onclick = initiateColorSearch };
if (buttonCloseCookies) { buttonCloseCookies.onclick = acceptCookieNotice };

checkCookieAcceptance()
  .then(cookieAcceptance => {
    if (!cookieAcceptance) {
      console.log('No cookie Acceptance!');
      cookieNotice.style.display = 'block';
    }
  })
