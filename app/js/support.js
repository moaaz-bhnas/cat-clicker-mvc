'use strict';
/* Fullback: browsers that don't support input[type="color"] --- */

if (!Modernizr.inputtypes.color) {
  // Normal text input
  this.colorInput = document.querySelector('#color');
  var colorInfo = document.querySelector('#color-info');
  var description = document.createElement('li');
  description.innerHTML = "<em>Any</em> color format is allowed (e.g. red, #ff0000 or rgb(255, 0, 0)).";
  colorInfo.insertAdjacentElement('afterbegin', description); // Add color feedback

  colorInput.addEventListener('input', function () {
    this.style.color = 'inherit';
    this.style.color = this.value;
  }); // Adjust the width with the other elements

  colorInput.style.width = '70%';
}
/* Fullback: browsers that don't support built-in HTML5 form validation --- */
// Inputs Patterns


var fileInputPattern = /\w+\.(png|jpg|jpeg)$/;
var urlInputPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

if (!Modernizr.formvalidation) {
  /* Validate.js --- */
  // Create the errors box
  var errorBox = document.createElement('p');
  errorBox.classList.add('error');
  errorBox.setAttribute('aria-live', 'polite'); // Insert it

  document.querySelector('#cats-adding-heading').insertAdjacentElement('afterend', errorBox); // The Validator

  var validator = new FormValidator('cats-adding-form', [{
    name: 'cat-imgfile',
    rules: 'required|is_file_type[png,jpg,jpeg]'
  }, {
    name: 'cat-url',
    rules: 'required|valid_url'
  }, {
    name: 'cat-name',
    rules: 'required'
  }], function (errors, event) {
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


var fileInput = document.querySelector('input[name="cat-imgfile"]');
var urlInput = document.querySelector('input[name="cat-url"]'); // Event Listeners
// File Input

fileInput.addEventListener('change', function (event) {
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
}); // URL Input

urlInput.addEventListener('input', function (event) {
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
/* Make the label respresent the button "upload image" */

var label = document.querySelector('label[for="cat-imgfile"]');
label.addEventListener('keydown', function (event) {
  if (event.keyCode === 32 || event.keyCode === 13) {
    fileInput.click();
  }
});
/* Service Worker */

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', {
    scope: '/sw-test/'
  }).then(function (reg) {
    // registration worked
    console.log('Registration succeeded. Scope is ' + reg.scope);
  }).catch(function (error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });
}