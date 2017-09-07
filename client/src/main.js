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
const colorSearchIframe = document.querySelector('.color-search__iframe');
const hexRegex = /^#[0-9A-F]{6}$/i;

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
  if (!hexRegex.test(inputHexCodeValue)) {
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
  const searchValue = inputColorSearch.value.split(' ').join('+');
  const searchLink = document.querySelector('input[name=colorSearchLink]:checked').value + searchValue;
  colorSearchIframe.src = searchLink;
  colorSearchPlaceholder.style.display = 'none';
  colorSearchIframe.style.display = 'block';
};

document.onkeydown = (evt) => {
  evt = evt || window.event;
  if (evt.keyCode === 27) {
    closeOverlay();
  }
};

inputHexCode.addEventListener("click", resetHexCodeError);

buttonInitiate.onclick = initiateOverlay;
buttonCloseOverlay.onclick = closeOverlay;
buttonColorSearch.onclick = initiateColorSearch;
buttonCloseCookies.onclick = acceptCookieNotice;

checkCookieAcceptance()
  .then(cookieAcceptance => {
    if(!cookieAcceptance) {
      console.log('No cookie Acceptance!');
      cookieNotice.style.display = 'block';
    }
  })
