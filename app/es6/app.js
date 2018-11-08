'use strict';

/* Helper Functions --- */
const getElementIndex = el => {
  let index = 0;
  el = el.previousElementSibling; 
  while (el) {
    index++;
    el = el.previousElementSibling;
  }
  return index;
}

/* Cat Class --- */
class Cat {
  constructor(name, url) {
    this.name = name;
    this.url = url;
    this.clicks = 0;
  }
}

/* Cat Instances --- */
const catObjects = [
  new Cat('Garfield', 'images/garfield.png'),
  new Cat('Marie', 'images/marie.png'),
  new Cat('Meowth', 'images/meowth.png'),
  new Cat('Sylvester', 'images/sylvester.png'),
  new Cat('Tom', 'images/tom.png')
];

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
const catsListEl = document.querySelector('.cats-list');
(function listCats() {
  const documentFragment = document.createDocumentFragment();
  for (const i in catObjects) {
    // Create the list item
    const listItem = document.createElement('li');
    listItem.innerHTML = `<button class="name-btn" type="button" role="menuitem">${catObjects[i].name}</button>
                          <button class="remove-btn" type="button">
                            <abbr title="Remove">x</abbr>
                          </button>`;
    // Append it into the fragment                      
    documentFragment.appendChild(listItem);
  }
  catsListEl.appendChild(documentFragment);
})();

/* -----------------------------------------
  DOM - Cat View 
  ------------------------------------------ */
let viewedCatIndex = 0;
const catView = {
  nameEl: document.querySelector('.cat-name'),
  clicksEl: document.querySelector('.cat-clicks'),
  imageEl: document.querySelector('.cat-image'),
  BtnEl: document.querySelector('.cat-btn'),
  fill(indexToView) {
    console.log(indexToView);
    const catObj = catObjects[indexToView];
    this.nameEl.textContent = catObj.name;
    this.clicksEl.textContent = catObj.clicks;
    this.imageEl.src = catObj.url;
  },
  clear() {
    this.nameEl.textContent = '';
    this.clicksEl.textContent = '';
    this.imageEl.src = '';
  }
};

/* Displaying The model into view --- */
// Default Cat
let defaultCatIndex = 0;
catView.fill(defaultCatIndex);

/* Functionality (when the cat btn clicked) --- */ 
catView.BtnEl.addEventListener('click', function incrementClicks() {
  const viewedCat = catObjects[viewedCatIndex];
  viewedCat.clicks++;
  // Update DOM
  catView.clicksEl.textContent = viewedCat.clicks;
});

/* Functionality (when a cat is selected from the list) --- */
catsListEl.addEventListener('click', function handleClick(event) {
  const target = event.target;
  if (target.nodeName !== 'UL') { // inside a menu item
    if (target.className === 'name-btn') { // name clicked 
      const listItem = target.parentElement;
      const selectedCatIndex = getElementIndex(listItem);
      catView.fill(selectedCatIndex);
      // Update 'viewedCatIndex' variable
      viewedCatIndex = selectedCatIndex;
    } else { // 'x' clicked
      const listItem = (target.nodeName === 'BUTTON') ? target.parentElement 
                                                      : target.parentElement.parentElement; /* <abbr> inside <button> */ 
      const selectedCatIndex = getElementIndex(listItem);
      // Remove from the model & view
      /* From VIEW (before model to maintain the indexes order when accessing the next catObj): --- */
      // First: from list
      this.removeChild(listItem);
      // Second: from cat view
      if (catObjects.length === 1) { // This was the last one
        catView.clear();
      } else if (selectedCatIndex === catObjects.length-1) {
        console.log('test');
        catView.fill(defaultCatIndex);
      } else if (selectedCatIndex === viewedCatIndex) {
        catView.fill(selectedCatIndex+1);
      }
      /* From MODEL --- */
      catObjects.splice(selectedCatIndex, 1);
    }
  }
});

/* -----------------------------------------
  DOM - Cat Add 
  ------------------------------------------ */
const addForm = {
  form: document.querySelector('form[name="cats-adding-form"]'),
  imgUploadInp: document.querySelector('#cat-imgfile'),
  urlInp: document.querySelector('#cat-url'),
  nameInp: document.querySelector('#cat-name'),
  colorInp: document.querySelector('#color'),
  clear() {
    this.imgUploadInp.value = '';
    this.urlInp.value = '';
    this.nameInp.value = '';
    this.colorInp.value = '';
  }
}

addForm.form.addEventListener('submit', function(event) {
  event.preventDefault();
  // Collect user input
  const name = addForm.nameInp.value;
  const url = (addForm.urlInp.value) ? addForm.urlInp.value
                                     : window.URL.createObjectURL(addForm.imgUploadInp.files[0]);

  // Add to model
  catObjects.push(new Cat((name[0].toUpperCase() + name.slice(1).toLowerCase()), url));
  // Add to view - (cat view section)
  catView.fill(catObjects.length-1);
  // Add to view - (list)
  (function listCat(newCat) {
    // Create the list item
    const listItem = document.createElement('li');
    listItem.innerHTML = `<button class="name-btn" type="button" role="menuitem">${newCat.name}</button>
                          <button class="remove-btn" type="button">
                            <abbr title="Remove">x</abbr>
                          </button>`;
    catsListEl.appendChild(listItem);
  })(catObjects[catObjects.length-1]);

  // Update (viewedCatIndex)
  viewedCatIndex = catObjects.length-1;

  // Clear and re-enable inputs
  (function clearRequireEnableInputs() {
    addForm.clear();
    addForm.imgUploadInp.required = true;
    addForm.imgUploadInp.disabled = false;
    addForm.urlInp.required = true;
    addForm.urlInp.disabled = false;
  })();
})