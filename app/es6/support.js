'use strict';
/* Fullback: browsers that don't support input[type="color"] --- */
if (!Modernizr.inputtypes.color) { // Normal text input
  this.colorInput = document.querySelector('#color');
  const colorInfo = document.querySelector('#color-info');

  const description = document.createElement('li');
  description.innerHTML = `<em>Any</em> color format is allowed (e.g. red, #ff0000 or rgb(255, 0, 0)).`;
  colorInfo.insertAdjacentElement('afterbegin', description);

  // Add color feedback
  colorInput.addEventListener('input', function() {
    this.style.color = 'inherit';
    this.style.color = this.value;
  });

  // Adjust the width with the other elements
  colorInput.style.width = '70%';
}

/* Fullback: browsers that don't support built-in HTML5 form validation --- */
// Inputs Patterns
var fileInputPattern = /\w+\.(png|jpg|jpeg)$/;
var urlInputPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
if (!Modernizr.formvalidation) {
  /* Validate.js --- */
  // Create the errors box
  const errorBox = document.createElement('p');
  errorBox.classimgList.add('error');
  errorBox.setAttribute('aria-live', 'polite');
  // Insert it
  document.querySelector('#cats-adding-heading').insertAdjacentElement('afterend', errorBox);

  // The Validator
  var validator = new FormValidator('cats-adding-form', [{
      name: 'cat-imgfile',
      rules: 'required|is_file_type[png,jpg,jpeg]'
  }, {
      name: 'cat-url',
      rules: 'required|valid_url'
  }, {
      name: 'cat-name',
      rules: 'required'
  }], function(errors, event) {
      if (errors.length > 0) {
          var errorString = '';

          for (var i = 0, errorLength = errors.length; i < errorLength; i++) {
              errorString += errors[i].message + '<br />';
          }

          errorBox.innerHTML = errorString;
      }
  });
}

/* Make only one input element required for adding image file --- */
// Inputs
const fileInput = document.querySelector('input[name="cat-imgfile"]');
const urlInput = document.querySelector('input[name="cat-url"]');

// Event imgListeners
// File Input
fileInput.addEventListener('change', function(event) {
  console.log(1);
  if (this.validity.valid || fileInputPattern.test(event.value)) {
    urlInput.required = false;
    urlInput.disabled = true;
    if (validator) {
      validator.fields['cat-url'].rules = 'valid_url';
    }
  } else {
    urlInput.required = true;
    urlInput.disabled = false;
    if (validator) {
      validator.fields['cat-url'].rules = 'required|valid_url';
    }
  }
});
// URL Input
urlInput.addEventListener('input', function(event) {
  if (this.validity.valid || urlInputPattern.test(event.value)) {
    fileInput.required = false;
    fileInput.disabled = true;
    if (validator) {
      validator.fields['cat-imgfile'].rules = 'is_file_type[png,jpg,jpeg]';
    }
  } else {
    fileInput.required = true;
    fileInput.disabled = false;
    if (validator) {
      alidator.fields['cat-imgfile'].rules = 'required|is_file_type[png,jpg,jpeg]';
    }
  }
});

// Check if browser doesn't support indexOf() method
if (!Array.prototype.indexOf)  Array.prototype.indexOf = (function(Object, max, min){
  "use strict";
  return function indexOf(member, fromIndex) {
    if(this===null||this===undefined)throw TypeError("Array.prototype.indexOf called on null or undefined");
    
    var that = Object(this), Len = that.length >>> 0, i = min(fromIndex | 0, Len);
    if (i < 0) i = max(0, Len+i); else if (i >= Len) return -1;
    
    if(member===void 0){ for(; i !== Len; ++i) if(that[i]===void 0 && i in that) return i; // undefined
    }else if(member !== member){   for(; i !== Len; ++i) if(that[i] !== that[i]) return i; // NaN
    }else                           for(; i !== Len; ++i) if(that[i] === member) return i; // all else

    return -1; // if the value was not found, then return -1
  };
})(Object, Math.max, Math.min);