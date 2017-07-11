const buttonInitiate = document.querySelector('.button__initiate');
const buttonClose = document.querySelector('.button__close');
const buttonColorSearch = document.querySelector('.button__color-search');
const inputHexCode = document.querySelector('.input__hex-code');
const inputColorSearch = document.querySelector('.input__color-search');
const overlay = document.querySelector('.overlay');
const errorPlaceholder = document.querySelector('.error');
const colorSearchLinks = document.querySelectorAll('.link__color-search');
const hexRegex = /^#[0-9A-F]{6}$/i;

const resetHexCode = () => {
  inputHexCode.value = '';
  errorPlaceholder.textContent = '';
};

const checkHexCodeForError = (inputHexCodeValue) => {
  let errorMessage;
  if (!hexRegex.test(inputHexCodeValue)) {
    errorMessage = 'HEX code needs to be 6 characters, 0 to 9, or A to F';
    errorPlaceholder.textContent = errorMessage;
    return false;
  };
  return inputHexCodeValue;
};

const initiateOverlay = () => {
  let inputHexCodeValue = '#' + inputHexCode.value;
  inputHexCodeValue = checkHexCodeForError(inputHexCodeValue);
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
  window.open(searchLink, '__blank');
};

document.onkeydown = (evt) => {
  evt = evt || window.event;
  if (evt.keyCode === 27) {
    closeOverlay();
  }
  if (evt.keyCode === 13) {
    initiateOverlay();
  }
};

inputHexCode.addEventListener("click", resetHexCode);

buttonInitiate.onclick = initiateOverlay;

buttonClose.onclick = closeOverlay;

buttonColorSearch.onclick = initiateColorSearch;
