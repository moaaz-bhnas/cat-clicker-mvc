'use strict';

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

// Cat constructor
class Cat {
  constructor(name, url, color = 'black') {
    this.name = name,
    this.url = url,
    this.clicks = 0
    this.color = color;
  }
}

/* Model --- */
const model = {
  cats: [
    new Cat('Garfield', 'images/garfield.png'),
    new Cat('Marie', 'images/marie.png'),
    new Cat('Meowth', 'images/meowth.png'),
    new Cat('Sylvester', 'images/sylvester.png'),
    new Cat('Tom', 'images/tom.png')
  ],
  currentIndex: 0
}

/* Octopus --- */
const octopus = {
  getNames() {
    const names = model.cats.map(cat => cat.name);
    return names;
  },
  getCurrentCat() {
    const currentCat = model.cats[model.currentIndex];
    console.log(model.currentIndex, model.cats, currentCat);
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
  },
  removeCat(index) {
    model.cats.splice(index, 1);
    // Adjusting the currentIndex
    console.log(index, model.cats.length-1, index === model.cats.length-1);
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
  addCat(name, url) {
    name = name[0].toUpperCase() + name.slice(1).toLowerCase();
    model.cats.push(new Cat(name, url));
    // Update the current cat
    model.currentIndex = model.cats.length-1;
    menuView.render();
    catView.render();
    formView.resetForm();
  },
  init() {
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
    const names = octopus.getNames();
    const fragment = document.createDocumentFragment();
    names.forEach(name => {
      const menuItem = document.createElement('li');
      menuItem.innerHTML = `<button type="button" role="menuitem" class="name-btn">${name}</button>
      <button type="button" class="remove-btn" title="remove">
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

const formView = {
  init() {
    this.form = document.querySelector('form[name="cats-adding-form"]');
    this.imgUpload = document.querySelector('#cat-imgfile');
    this.url = document.querySelector('#cat-url');
    this.name = document.querySelector('#cat-name');
    this.color = document.querySelector('#color');
    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      // Collect user input
      const name = this.name.value;
      const url = (this.url.value) ? this.url.value
      : window.URL.createObjectURL(this.imgUpload.files[0]);
      octopus.addCat(name, url);
    })
  },
  resetForm() {
    this.form.reset();
  }
}

octopus.init();