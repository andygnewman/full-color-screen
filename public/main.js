const buttonInitiate = document.querySelector('.button__initiate');
const buttonClose = document.querySelector('.button__close');
const buttonColorSearch = document.querySelector('.button__color-search');
const inputHexCode = document.querySelector('.input__hex-code');
const inputColorSearch = document.querySelector('.input__color-search');
const overlay = document.querySelector('.overlay');
const errorPlaceholder = document.querySelector('.error');
const colorSearchPlaceholder = document.querySelector('.color-search__placeholder');
const colorSearchIframe = document.querySelector('.color-search__iframe');
const hexRegex = /^#[0-9A-F]{6}$/i;

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
buttonClose.onclick = closeOverlay;
buttonColorSearch.onclick = initiateColorSearch;

checkForCookieAcceptance()
  .then(cookieAcceptance => console.log('Cookie Acceptance: ', cookieAcceptance));
