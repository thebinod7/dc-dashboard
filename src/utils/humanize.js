const sentence = (word, defaultTxt=null) => {
  if (!word || !word.length) {
    return defaultTxt || 'N/A';
  }
  return word
	.replace(/([A-Z])/g, ' $1')
    // uppercase the first character
    .replace(/^./, function(str){ return str.toUpperCase(); })
    .replace(/_/g, ' ')
    .trim()
    .replace(/\b[A-Z][a-z]+\b/g, function(word) {
      return word.toLowerCase();
    })
    .replace(/^[a-z]/g, function(first) {
      return first.toUpperCase();
    })
    .split(',')
    .join(', ');
};

const name = (word, defaultTxt=null) => {
  if (!word || !word.length || typeof word !== 'string') {
    return defaultTxt || 'N/A';
  }
  return word
	  .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .trim()
    // uppercase the first character
    .toLowerCase().replace(/\b[a-z](?=[a-z]{2})/g, function(letter) {
      return letter.toUpperCase();
    })
    .split(',')
    .join(', ');
};

const formatName = (word, defaultTxt = null) => {
  if (!word || !word.length || typeof word !== 'string') {
    return defaultTxt || 'N/A';
  }
  return word
    .replace(/\w\S*/g, (txt) =>
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
};

const phoneNumber = (number) => {
  if (!number || !number.length) {
    return '';
  }
  var s2 = (''+number).replace(/\D/g, '');
  var m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
  return (!m) ? null : m[1] + '-' + m[2] + '-' + m[3];
};

const excerpt = (str, maxlen, defaultTxt=null) => {
  if (!str || !str.length || typeof str !== 'string') {
    return defaultTxt || '';
  }
  if (str.length < maxlen) return str;
  //trim the string to the maximum length
  const trimmedString = str.substr(0, maxlen);
  //re-trim if we are in the middle of a word
  return trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(' '))) + '..';
};

const arrayToComma = (arr, key) => arr.map((i, k) => k === arr.length - 1 ? i[key] : i[key] + ', ');

const arrayToSentence = (arr) => {
  let str = '';
  if(arr.length === 1) {
    return str;
  }
  arr.forEach((item, k) => {
    if(k === arr.length - 2) {
      str += `${item} and `;
    } else if(k === arr.length - 1) {
      str += item;
    } else {
      str += `${item}, `;
    }
  });
  return str;
};

module.exports = { sentence, name, formatName, phoneNumber, excerpt, arrayToComma, arrayToSentence };
