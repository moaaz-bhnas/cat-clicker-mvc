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
};

var colorIsValid = function colorIsValid(input) {
  var testingEl = document.createElement('div');
  testingEl.style.color = input;
  return testingEl.style.color ? true : false;
}; // Cat constructor


var Cat = function Cat(name, url, color) {
  _classCallCheck(this, Cat);

  this.name = name, this.url = url, this.clicks = 0;
  this.color = colorIsValid(color) ? color : '#000';
};
/* Model --- */


var model = {
  cats: [new Cat('Garfield', 'images/garfield.png', '#FCAA16'), new Cat('Sylvester', 'images/sylvester.png', '#1F2831'), new Cat('Meowth', 'images/meowth.png', '#DF7645'), new Cat('Marie', 'images/marie.png', '#F06594'), // new Cat('Chloe', 'images/chloe.png', '#505A73'),
  new Cat('Tom', 'images/tom.png', '#90979F')],
  currentIndex: 0
  /* Octopus --- */

};
var octopus = {
  getCats: function getCats() {
    return model.cats;
  },
  getCurrentCat: function getCurrentCat() {
    var currentCat = model.cats[model.currentIndex];
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
    appView.render();
  },
  removeCat: function removeCat(index) {
    model.cats.splice(index, 1); // Adjusting the currentIndex

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
    appView.render();
  },
  addCat: function addCat(name, url, color) {
    name = name[0].toUpperCase() + name.slice(1).toLowerCase();
    model.cats.push(new Cat(name, url, color)); // Update the current cat

    model.currentIndex = model.cats.length - 1;
    menuView.render();
    catView.render();
    formView.resetForm();
    appView.render();
  },
  getLightTint: function getLightTint() {
    return appView.lightTint;
  },
  init: function init() {
    appView.init();
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
    var cats = octopus.getCats();
    var fragment = document.createDocumentFragment();
    cats.forEach(function (cat) {
      var menuItem = document.createElement('li');
      menuItem.innerHTML = "<button style=\"color: ".concat(tinycolor(cat.color).darken(25).toString(), "; background-color: #").concat(new Values(cat.color).tints(7)[10].hex, "\" type=\"button\" role=\"menuitem\" class=\"name-btn\">").concat(cat.name, "</button>\n      <button style=\"color: ").concat(tinycolor(cat.color).darken(25).toString(), "; background-color: #").concat(new Values(cat.color).tints(7)[10].hex, "\" type=\"button\" class=\"remove-btn\" title=\"remove\">\n          <abbr title=\"Remove\">x</abbr>\n      </button>");
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
      var color = _this.color.value;
      octopus.addCat(name, url, color);
    });
  },
  resetForm: function resetForm() {
    this.form.reset();
    this.url.required = true;
    this.url.disabled = false;
    this.imgUpload.required = true;
    this.imgUpload.disabled = false;
  }
};
var appView = {
  init: function init() {
    // Sections
    this.header = document.querySelector('header');
    this.catViewSection = document.querySelector('.cat-view-section');
    this.footer = document.querySelector('footer'); // Buttons

    this.formBtns = document.querySelectorAll('.form-btn');
    this.catBtn = document.querySelector('.cat-btn');
    this.links = document.querySelectorAll('a');
    this.render();
  },
  render: function render() {
    /* Colors --- */
    var baseColor = octopus.getCurrentCat().color;
    var tintsShades = new Values(baseColor).all(7); // 29

    var dark = '#' + tintsShades[23].hex; // dark

    var light = '#' + tintsShades[6].hex; // light
    // Complementary

    var complementary = tinycolor(dark).complement().toHexString();
    var tintsShadesComplementary = new Values(complementary).all(7);
    var darkComplementary = '#' + tintsShadesComplementary[18].hex; // dark

    var lightComplementary = '#' + tintsShadesComplementary[3].hex; // light

    /* Fill --- */
    // Section backgrounds

    (function setBackground() {
      for (var _len = arguments.length, elements = new Array(_len), _key = 0; _key < _len; _key++) {
        elements[_key] = arguments[_key];
      }

      for (var _i = 0; _i < elements.length; _i++) {
        var element = elements[_i];
        element.style.backgroundColor = light;
      }
    })(this.header, this.catViewSection, this.footer); // Text


    document.documentElement.style.color = dark; // Links & buttons

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this.formBtns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var btn = _step.value;
        btn.style.color = darkComplementary;
        btn.style.backgroundColor = lightComplementary;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = this.links[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var link = _step2.value;
        link.style.color = darkComplementary;
      } // Body background

    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    document.body.style.backgroundColor = light;
  }
};
octopus.init();