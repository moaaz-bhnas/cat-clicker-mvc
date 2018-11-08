'use strict'; // Helper functions

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getElementOrder = function getElementOrder(el) {
  var index = 0;
  el = el.previousElementSibling;

  while (el) {
    index++;
    el = el.previousElementSibling;
  }

  return index;
}; // Cat constructor


var Cat = function Cat(name, url) {
  var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'black';

  _classCallCheck(this, Cat);

  this.name = name, this.url = url, this.clicks = 0;
  this.color = color;
};
/* Model --- */


var model = {
  cats: [new Cat('Garfield', 'images/garfield.png'), new Cat('Marie', 'images/marie.png'), new Cat('Meowth', 'images/meowth.png'), new Cat('Sylvester', 'images/sylvester.png'), new Cat('Tom', 'images/tom.png')],
  currentIndex: 0
  /* Octopus --- */

};
var octopus = {
  getNames: function getNames() {
    var names = model.cats.map(function (cat) {
      return cat.name;
    });
    return names;
  },
  getCurrentCat: function getCurrentCat() {
    var currentCat = model.cats[model.currentIndex];
    console.log(model.currentIndex, model.cats, currentCat);
    return currentCat;
  },
  incrementClicks: function incrementClicks() {
    var currentCat = model.cats[model.currentIndex];
    currentCat.clicks++;
    catView.render();
  },
  selectCat: function selectCat(index) {
    model.currentIndex = index;
    catView.render();
  },
  removeCat: function removeCat(index) {
    model.cats.splice(index, 1); // Adjusting the currentIndex

    console.log(index, model.cats.length - 1, index === model.cats.length - 1);

    if (index < model.currentIndex) {
      model.currentIndex--;
    } else if (index === model.cats.length) {
      model.currentIndex = 0;
    }

    if (model.cats.length === 0) {
      catView.clear();
    } else {
      catView.render();
    }

    menuView.render();
  },
  addCat: function addCat(name, url) {
    name = name[0].toUpperCase() + name.slice(1).toLowerCase();
    model.cats.push(new Cat(name, url)); // Update the current cat

    model.currentIndex = model.cats.length - 1;
    menuView.render();
    catView.render();
    formView.resetForm();
  },
  init: function init() {
    menuView.init();
    catView.init();
    formView.init();
  }
};
/* View (menu) --- */

var menuView = {
  init: function init() {
    this.menu = document.querySelector('.cats-list'); // Into the menu items (name | remove) (e.g. Chloe x)

    this.menu.addEventListener('click', function handleMenuClick(event) {
      var target = event.target;

      if (target.nodeName !== 'UL') {
        if (target.className === 'name-btn') {
          // A new cat views
          // Get the <li> order to display the corresponding cat from the array
          var menuItem = target.parentElement;
          var menuItemOrder = getElementOrder(menuItem);
          octopus.selectCat(menuItemOrder);
        } else {
          // A cat will be removed
          // Get the <li> order to remove the corresponding cat from the array
          var _menuItem = target.nodeName === 'BUTTON' ? target.parentElement : target.parentElement.parentElement; // <abbr> inside <button>


          var _menuItemOrder = getElementOrder(_menuItem);

          octopus.removeCat(_menuItemOrder);
        }
      }
    });
    this.render();
  },
  render: function render() {
    var names = octopus.getNames();
    var fragment = document.createDocumentFragment();
    names.forEach(function (name) {
      var menuItem = document.createElement('li');
      menuItem.innerHTML = "<button type=\"button\" role=\"menuitem\" class=\"name-btn\">".concat(name, "</button>\n      <button type=\"button\" name=\"remove-btn\">\n          <abbr title=\"Remove\">x</abbr>\n      </button>");
      fragment.appendChild(menuItem);
    });
    this.menu.innerHTML = '';
    this.menu.appendChild(fragment);
  }
};
/* View (cat) --- */

var catView = {
  init: function init() {
    this.name = document.querySelector('.cat-name');
    this.clicks = document.querySelector('.cat-clicks');
    this.img = document.querySelector('.cat-image');
    this.imgBtn = document.querySelector('.cat-btn');
    this.imgBtn.addEventListener('click', function incrementClicks() {
      octopus.incrementClicks();
    });
    this.render();
  },
  clear: function clear() {
    this.name.textContent = '';
    this.clicks.textContent = '';
    this.img.src = '';
  },
  render: function render() {
    var currentCat = octopus.getCurrentCat(); // Fill

    this.name.textContent = currentCat.name;
    this.clicks.textContent = currentCat.clicks;
    this.img.src = currentCat.url;
  }
};
var formView = {
  init: function init() {
    var _this = this;

    this.form = document.querySelector('form[name="cats-adding-form"]');
    this.imgUpload = document.querySelector('#cat-imgfile');
    this.url = document.querySelector('#cat-url');
    this.name = document.querySelector('#cat-name');
    this.color = document.querySelector('#color');
    this.form.addEventListener('submit', function (event) {
      event.preventDefault(); // Collect user input

      var name = _this.name.value;
      var url = _this.url.value ? _this.url.value : window.URL.createObjectURL(_this.imgUpload.files[0]);
      octopus.addCat(name, url);
    });
  },
  resetForm: function resetForm() {
    this.form.reset();
  }
};
octopus.init();