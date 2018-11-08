'use strict';
/* Helper Functions --- */

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getElementIndex = function getElementIndex(el) {
  var index = 0;
  el = el.previousElementSibling;

  while (el) {
    index++;
    el = el.previousElementSibling;
  }

  return index;
};
/* Cat Class --- */


var Cat = function Cat(name, url) {
  _classCallCheck(this, Cat);

  this.name = name;
  this.url = url;
  this.clicks = 0;
};
/* Cat Instances --- */


var catObjects = [new Cat('Garfield', 'images/garfield.png'), new Cat('Marie', 'images/marie.png'), new Cat('Meowth', 'images/meowth.png'), new Cat('Sylvester', 'images/sylvester.png'), new Cat('Tom', 'images/tom.png')];
/* -----------------------------------------
  DOM - Cats List 
  ------------------------------------------ */

/*
  <li>
      <button class="name-btn" type="button" role="menuitem"></button>
      <button class="remove-btn" type="button">
          <abbr title="Remove">x</abbr>
      </button>
  </li>
*/

var catsListEl = document.querySelector('.cats-list');

(function listCats() {
  var documentFragment = document.createDocumentFragment();

  for (var i in catObjects) {
    // Create the list item
    var listItem = document.createElement('li');
    listItem.innerHTML = "<button class=\"name-btn\" type=\"button\" role=\"menuitem\">".concat(catObjects[i].name, "</button>\n                          <button class=\"remove-btn\" type=\"button\">\n                            <abbr title=\"Remove\">x</abbr>\n                          </button>"); // Append it into the fragment                      

    documentFragment.appendChild(listItem);
  }

  catsListEl.appendChild(documentFragment);
})();
/* -----------------------------------------
  DOM - Cat View 
  ------------------------------------------ */


var viewedCatIndex = 0;
var catView = {
  nameEl: document.querySelector('.cat-name'),
  clicksEl: document.querySelector('.cat-clicks'),
  imageEl: document.querySelector('.cat-image'),
  BtnEl: document.querySelector('.cat-btn'),
  fill: function fill(indexToView) {
    console.log(indexToView);
    var catObj = catObjects[indexToView];
    this.nameEl.textContent = catObj.name;
    this.clicksEl.textContent = catObj.clicks;
    this.imageEl.src = catObj.url;
  },
  clear: function clear() {
    this.nameEl.textContent = '';
    this.clicksEl.textContent = '';
    this.imageEl.src = '';
  }
};
/* Displaying The model into view --- */
// Default Cat

var defaultCatIndex = 0;
catView.fill(defaultCatIndex);
/* Functionality (when the cat btn clicked) --- */

catView.BtnEl.addEventListener('click', function incrementClicks() {
  var viewedCat = catObjects[viewedCatIndex];
  viewedCat.clicks++; // Update DOM

  catView.clicksEl.textContent = viewedCat.clicks;
});
/* Functionality (when a cat is selected from the list) --- */

catsListEl.addEventListener('click', function handleClick(event) {
  var target = event.target;

  if (target.nodeName !== 'UL') {
    // inside a menu item
    if (target.className === 'name-btn') {
      // name clicked 
      var listItem = target.parentElement;
      var selectedCatIndex = getElementIndex(listItem);
      catView.fill(selectedCatIndex); // Update 'viewedCatIndex' variable

      viewedCatIndex = selectedCatIndex;
    } else {
      // 'x' clicked
      var _listItem = target.nodeName === 'BUTTON' ? target.parentElement : target.parentElement.parentElement;
      /* <abbr> inside <button> */


      var _selectedCatIndex = getElementIndex(_listItem); // Remove from the model & view

      /* From VIEW (before model to maintain the indexes order when accessing the next catObj): --- */
      // First: from list


      this.removeChild(_listItem); // Second: from cat view

      if (catObjects.length === 1) {
        // This was the last one
        catView.clear();
      } else if (_selectedCatIndex === catObjects.length - 1) {
        console.log('test');
        catView.fill(defaultCatIndex);
      } else if (_selectedCatIndex === viewedCatIndex) {
        catView.fill(_selectedCatIndex + 1);
      }
      /* From MODEL --- */


      catObjects.splice(_selectedCatIndex, 1);
    }
  }
});
/* -----------------------------------------
  DOM - Cat Add 
  ------------------------------------------ */

var addForm = {
  form: document.querySelector('form[name="cats-adding-form"]'),
  imgUploadInp: document.querySelector('#cat-imgfile'),
  urlInp: document.querySelector('#cat-url'),
  nameInp: document.querySelector('#cat-name'),
  colorInp: document.querySelector('#color'),
  clear: function clear() {
    this.imgUploadInp.value = '';
    this.urlInp.value = '';
    this.nameInp.value = '';
    this.colorInp.value = '';
  }
};
addForm.form.addEventListener('submit', function (event) {
  event.preventDefault(); // Collect user input

  var name = addForm.nameInp.value;
  var url = addForm.urlInp.value ? addForm.urlInp.value : window.URL.createObjectURL(addForm.imgUploadInp.files[0]); // Add to model

  catObjects.push(new Cat(name[0].toUpperCase() + name.slice(1).toLowerCase(), url)); // Add to view - (cat view section)

  catView.fill(catObjects.length - 1); // Add to view - (list)

  (function listCat(newCat) {
    // Create the list item
    var listItem = document.createElement('li');
    listItem.innerHTML = "<button class=\"name-btn\" type=\"button\" role=\"menuitem\">".concat(newCat.name, "</button>\n                          <button class=\"remove-btn\" type=\"button\">\n                            <abbr title=\"Remove\">x</abbr>\n                          </button>");
    catsListEl.appendChild(listItem);
  })(catObjects[catObjects.length - 1]); // Update (viewedCatIndex)


  viewedCatIndex = catObjects.length - 1; // Clear and re-enable inputs

  (function clearRequireEnableInputs() {
    addForm.clear();
    addForm.imgUploadInp.required = true;
    addForm.imgUploadInp.disabled = false;
    addForm.urlInp.required = true;
    addForm.urlInp.disabled = false;
  })();
});