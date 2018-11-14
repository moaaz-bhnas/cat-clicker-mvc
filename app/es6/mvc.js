'use strict';

// Caching Images 
window.onload = () => {
  (function preloadImages(...urls) {
    var imgList = [];
    for (const url of urls) {
        var img = new Image();
        img.onload = function() {
            var index = imgList.indexOf(this);
            if (index !== -1) {
                // remove image from the urls once it's loaded
                // for memory consumption reasons
                imgList.splice(index, 1);
            }
        }
        imgList.push(img);
        img.src = url;
    }
  })('images/garfield.png', 'images/sylvester.png', 'images/meowth.png', 'images/marie.png', 'images/tom.png');
  console.log('images preloaded');
}

// Helper functions
const getElementOrder = el => {
  let index = 0;
  el = el.previousElementSibling; 
  while (el) {
    index++;
    el = el.previousElementSibling;
  }
  return index;
}

const colorIsValid = input => {
  const testingEl = document.createElement('div');
  testingEl.style.color = input;
  return (testingEl.style.color) ? true : false;
}

// Cat constructor
class Cat {
  constructor(name, url, color) {
    this.name = name,
    this.url = url,
    this.clicks = 0
    this.color = colorIsValid(color) ? color : '#000'; 
  }
}

/* Model --- */
const model = {
  cats: [
    new Cat('Garfield', 'images/garfield.png', '#FCAA16'),
    new Cat('Sylvester', 'images/sylvester.png', '#1F2831'),
    new Cat('Meowth', 'images/meowth.png', '#DF7645'),
    new Cat('Marie', 'images/marie.png', '#F06594'),
    // new Cat('Chloe', 'images/chloe.png', '#505A73'),
    new Cat('Tom', 'images/tom.png', '#90979F')
  ],
  currentIndex: 0
}

/* Octopus --- */
const octopus = {
  getCats() {
    return model.cats;
  },
  getCurrentCat() {
    const currentCat = model.cats[model.currentIndex];
    return currentCat;
  },
  incrementClicks() {
    const currentCat = model.cats[model.currentIndex];
    currentCat.clicks++;
    catView.render(); 
  },
  selectCat(index) {
    model.currentIndex = index;
    catView.render();
    appView.render();
  },
  removeCat(index) {
    model.cats.splice(index, 1);
    // Adjusting the currentIndex
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
  addCat(name, url, color) {
    name = name[0].toUpperCase() + name.slice(1).toLowerCase();
    model.cats.push(new Cat(name, url, color));
    // Update the current cat
    model.currentIndex = model.cats.length-1;
    menuView.render();
    catView.render();
    formView.resetForm();
    appView.render();
  },
  getLightTint() {
    return appView.lightTint;
  },
  init() {
    appView.init();
    menuView.init();
    catView.init();
    formView.init();
  }
}

/* View (menu) --- */
const menuView = {
  init() {
    this.menu = document.querySelector('.cats-list');
    // Into the menu items (name | remove) (e.g. Chloe x)
    this.menu.addEventListener('click', function handleMenuClick(event) {
      const target = event.target;
      if (target.nodeName !== 'UL') {
        if (target.className === 'name-btn') { // A new cat views
          // Get the <li> order to display the corresponding cat from the array
          const menuItem = target.parentElement;
          const menuItemOrder = getElementOrder(menuItem);
          octopus.selectCat(menuItemOrder);
        } else { // A cat will be removed
          // Get the <li> order to remove the corresponding cat from the array
          const menuItem = (target.nodeName === 'BUTTON') ? target.parentElement
          : target.parentElement.parentElement; // <abbr> inside <button>
          const menuItemOrder = getElementOrder(menuItem);
          octopus.removeCat(menuItemOrder);
        }
      }
    });
    this.render();
  },
  render() {
    const cats = octopus.getCats();
    const fragment = document.createDocumentFragment();
    cats.forEach(cat => {
      const menuItem = document.createElement('li');
      menuItem.innerHTML = `<button style="color: ${tinycolor(cat.color).darken(25).toString()}; background-color: #${new Values(cat.color).tints(7)[10].hex}" type="button" role="menuitem" class="name-btn">${cat.name}</button>
      <button style="color: ${tinycolor(cat.color).darken(25).toString()}; background-color: #${new Values(cat.color).tints(7)[10].hex}" type="button" class="remove-btn" title="remove">
          <abbr title="Remove">x</abbr>
      </button>`;
      fragment.appendChild(menuItem);
    })
    this.menu.innerHTML = '';
    this.menu.appendChild(fragment);
  }
}

/* View (cat) --- */
const catView = {
  init() {
    this.name = document.querySelector('.cat-name');
    this.clicks = document.querySelector('.cat-clicks');
    this.img = document.querySelector('.cat-image');
    this.imgBtn = document.querySelector('.cat-btn');
    this.imgBtn.addEventListener('click', function incrementClicks() {
      octopus.incrementClicks();
    });

    this.render();
  },
  clear() {
    this.name.textContent = '';
    this.clicks.textContent = '';
    this.img.src = '';
  },
  render() {
    const currentCat = octopus.getCurrentCat();
    // Fill
    this.name.textContent = currentCat.name;
    this.clicks.textContent = currentCat.clicks;
    this.img.src = currentCat.url;
  }
}

/* View (form) --- */
const formView = {
  init() {
    this.form = document.querySelector('form[name="cats-adding-form"]');
    this.imgUpload = document.querySelector('#cat-imgfile');
    this.imgUploadLabel = document.querySelector('label[for="cat-imgfile"]');
    this.url = document.querySelector('#cat-url');
    this.name = document.querySelector('#cat-name');
    this.color = document.querySelector('#color');
    // imgUploadLabel as button
    this.imgUploadLabel.addEventListener('keydown', function(event) {
      if (event.keyCode === 32 || event.keyCode === 13) {
        fileInput.click();
      }
    });
    // Add cat listener
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      // Collect user input
      const name = this.name.value;
      const url = (this.url.value) ? this.url.value
      : window.URL.createObjectURL(this.imgUpload.files[0]);
      const color = this.color.value;
      octopus.addCat(name, url, color);
    })
  },
  resetForm() {
    this.form.reset();
    this.url.required = true;
    this.url.disabled = false;
    this.imgUpload.required = true;
    this.imgUpload.disabled = false;
  }
}

const appView = {
  init() {
    // Sections
    this.header = document.querySelector('header');
    this.catViewSection = document.querySelector('.cat-view-section');
    this.footer = document.querySelector('footer');
    // Buttons
    this.formBtns = document.querySelectorAll('.form-btn');
    this.catBtn = document.querySelector('.cat-btn');
    this.links = document.querySelectorAll('a');
    this.render();
  },
  render() {
    /* Colors --- */
    const baseColor = octopus.getCurrentCat().color;
    const tintsShades = new Values(baseColor).all(7); // 29
    const dark = '#' + tintsShades[23].hex; // dark
    const light = '#' + tintsShades[6].hex; // light
    // Complementary
    const complementary = tinycolor(dark).complement().toHexString();
    const tintsShadesComplementary = new Values(complementary).all(7);
    const darkComplementary = '#' + tintsShadesComplementary[18].hex; // dark
    const lightComplementary = '#' + tintsShadesComplementary[3].hex; // light

    /* Fill --- */
    // Body background
    document.body.style.backgroundColor = light;
    // Section backgrounds
    (function setBackground(...elements) {
      for (const element of elements) {
        element.style.backgroundColor = light;
      }
    })(this.header, this.catViewSection, this.footer);
    // Text
    document.documentElement.style.color = dark;
    // Links & buttons
    for (const btn of this.formBtns) {
      btn.style.color = darkComplementary;
      btn.style.backgroundColor = lightComplementary;
    }
    for (const link of this.links) {
      link.style.color = darkComplementary;
    }
  }
}

octopus.init();

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.onload = function() {
    navigator.serviceWorker.register('./sw.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  }
}