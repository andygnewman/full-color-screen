const colorTemplate = require('../../views/shared/color-template.html');

const Superstore = require('superstore');
const localStore = new Superstore('local', 'fullScreenPaintSample');

const buttonCloseOverlay = document.querySelector('.button__close--overlay');
const buttonCloseCookies = document.querySelector('.button__close--cookies');
const buttonColorSearch = document.querySelector('.button__color-search');
const inputColorSearch = document.querySelector('.input__color-search');
const overlay = document.querySelector('.overlay');
const waitText = document.querySelector('.wait__text');
const cookieNotice = document.querySelector('.cookie-notice');
const colorSearchPlaceholder = document.querySelector('.color-search__placeholder');
const colorSearchResults = document.querySelector('.color-search__results');
const colorPrevious = document.querySelector('.color-search__previous');

const checkCookieAcceptance = () => {
  return localStore.get('cookieAcceptance')
    .then(cookieAcceptance => cookieAcceptance);
};

const acceptCookieNotice = () => {
  localStore.set('cookieAcceptance', true)
    .then(() => cookieNotice.style.display = 'none');
}

const attachOverlayAction = () => {
  const initiateOverlayButtons = document.querySelectorAll('.button__initiate--overlay');
  initiateOverlayButtons.forEach(button => button.onclick = initiateOverlay);
}

const saveColor = (colorObject) => {
  return localStore.get('savedColors')
    .then(savedColors => {
      if (savedColors) {
        const existingColorIndex = savedColors.findIndex(color => color.rgb === colorObject.rgb);
        if (existingColorIndex > -1) {
          savedColors.splice(existingColorIndex, 1);
        }
        savedColors.unshift(colorObject);
      } else {
        const storeArray = [];
        storeArray.push(colorObject);
        savedColors = storeArray;
      }
      localStore.set('savedColors', savedColors);
      return displayStoredColor();
    });
};

const displayStoredColor = () => {
  return localStore.get('savedColors')
    .then(savedColors => {
      let savedColorHTML = '<p>No previously viewed colours</p>';
      if (savedColors) {
        savedColorHTML = colorTemplate({resultObject: {resultSet: savedColors}});
      }
      colorPrevious.innerHTML = savedColorHTML;
      attachOverlayAction();
    });
};

const applyOverlayStyle = (rgb, opacity = 1) => {
  document.body.style.overflow = 'hidden';
  overlay.style.backgroundColor = `rgb(${rgb})`;
  overlay.style.display = 'block';
  overlay.style.opacity = opacity;
};

const initiateOverlay = (evt) => {
  const dataSetJSON = Object.assign({}, evt.srcElement.dataset);
  const {rgb} = dataSetJSON;
  return saveColor(dataSetJSON)
  .then(() => {
    applyOverlayStyle(rgb);
  });
};

const closeOverlay = () => {
  overlay.style.display = 'none';
  waitText.style.display = 'none';
  document.body.style.overflow = 'auto';
};

const colorSearch = () => {
  applyOverlayStyle('211,211,211', 0.8);
  waitText.style.display = 'flex';
  const searchText = inputColorSearch.value.split(' ').join('+');
  const searchSite = encodeURIComponent(document.querySelector('input[name=colorSearchLink]:checked').value);
  return fetch(`/search/${searchText}/${searchSite}`)
    .then(response => response.text())
    .then(colorResult => {
      colorSearchResults.innerHTML = colorResult;
      attachOverlayAction();
      colorSearchPlaceholder.style.display = 'none';
      closeOverlay();
    });
};

displayStoredColor();

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
  });
