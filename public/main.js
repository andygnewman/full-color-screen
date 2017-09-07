/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const Superstore = __webpack_require__(1);

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


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Superstore
 *
 * @author Matt Andrews <matthew.andrews@ft.com>
 * @copyright The Financial Times [All Rights Reserved]
 */
var sync = __webpack_require__(2);

var keys = {};
var store = {};

function Superstore(type, namespace) {
  if(!namespace) {
    throw "Namespace required";
  }
  this.store = sync[type];
  this.namespace = "_ss."+namespace+".";
}

Superstore.prototype.get = function(key) {
  return new Promise(function(resolve) {
	resolve(this.store.get(this.namespace+key));
  }.bind(this));
};

Superstore.prototype.set = function(key, value) {
  return new Promise(function(resolve){
    resolve(this.store.set(this.namespace+key, value));
  }.bind(this));
};

Superstore.prototype.unset = function(key) {
  return new Promise(function(resolve) {
    resolve(this.store.unset(this.namespace+key));
  }.bind(this));
};

/**
 * #clear(true) and #clear() clear cache and persistent layer, #clear(false) only clears cache
 *
 */
Superstore.prototype.clear = function() {
  return new Promise(function(resolve) {
    resolve(this.store.clear(this.namespace));
  }.bind(this));
};

Superstore.isPersisting = sync.isPersisting;

module.exports = Superstore;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/**
 * Superstore synchronous library
 *
 * @author Matt Andrews <matthew.andrews@ft.com>
 * @copyright The Financial Times [All Rights Reserved]
 */

var escapeRegex = function(str){
  return String(str).replace(/([.*+?=^!:${}()|[\]\/\\])/g, '\\$1');
};

var keys = {};
var store = {};
var persist = true;

// Watch for changes from other tabs


function Superstore(type) {
	this.storage = window[type];
  this.keys = {};
  this.store = {};
  // TODO: check the storageArea so that we only refresh the key when we need to
  window.addEventListener("storage", function(e) {
    if (this.keys[e.key]) {
      this.keys[e.key] = true;
      this.store[e.key] = JSON.parse(e.newValue);
    }
  }.bind(this));
}

/**
 * get localstorage value for key falling back to in memory for iOS private browsing bug
 * <http://stackoverflow.com/questions/9077101/iphone-localstorage-quota-exceeded-err-issue>
 * @param {String} key
 * @return {*} data for supplied key
 *
 */
Superstore.prototype.get = function(key) {
  if (arguments.length !== 1) {
    throw Error("get expects 1 argument, " + arguments.length + " given; " + key);
  }
  if (!this.keys[key] && persist) {
    var data;
    try {
      data = this.storage[key];
    } catch(e) {
      persist = false; // Safari 8 with Cookies set to 'Never' throws on every read
    }

    // Slightly weird hack because JSON.parse of an undefined value throws
    // a weird exception "SyntaxError: Unexpected token u"
    if (data) data = JSON.parse(data);
    this.store[key] = data;
    this.keys[key] = true;
  }
  return this.store[key];
};

/**
 * set localstorage key,value falling back to in memory for iOS private browsing bug
 * <http://stackoverflow.com/questions/9077101/iphone-localstorage-quota-exceeded-err-issue>
 * @param {String} key
 * @param {*} value which will be passed via JSON.stringify
 * @return {*} value
 *
 */
Superstore.prototype.set = function(key, value) {
  if (arguments.length !== 2) {
    throw Error("set expects 2 arguments, " + arguments.length + " given; " + key);
  }
  if (persist) {
    try {
      this.storage[key] = JSON.stringify(value);
    } catch(err) {

      // Known iOS Private Browsing Bug - fall back to non-persistent storage
      if (err.code === 22) {
        persist = false;
      } else {
        throw err;
      }
    }
  }

  this.store[key] = value;
  this.keys[key] = true;
  return value;
};


/**
 * unset value in store for key
 * @param {String} key
 */
Superstore.prototype.unset = function(key) {
  delete this.store[key];
  delete this.keys[key];
  this.storage.removeItem(key);
};

/**
 * clear localstorage
 * @param clearPrefix will clear keys starting with `clearPrefix`
 * #clear(true) and #clear() clear cache and persistent layer, #clear(false) only clears cache
 *
 */
Superstore.prototype.clear = function(clearPrefix) {
  if (!clearPrefix) {
    if (persist) {
      this.storage.clear();
    }
    this.store = {};
    this.keys = {};
    return;
  }

  clearPrefix = escapeRegex(clearPrefix);
  var clearKeyRegex = new RegExp("^" + clearPrefix);
  for (var key in this.keys) {
    if (key.match(clearKeyRegex)) {
      this.unset(key);
    }
  }
};

module.exports.isPersisting = function() {
	return persist;
};

module.exports.local = new Superstore('localStorage');
module.exports.session = new Superstore('sessionStorage');


/***/ })
/******/ ]);