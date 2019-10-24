class Select {
  constructor({selector = null, label = null, url = null, onSelect = null}) {
    this.selector = selector;
    this.label = label;
    this.url = url;
    this.onSelect = onSelect;

    this._elements = {};

    this._buildSelector();
  }

  _buildSelector() {
    document.querySelector(this.selector).innerHTML = '';
    this._createTemplate();
    this.setSelectorEvents();
  }

  _createTemplate() {
    this._createSelectorContainer();
    this._createSelectorLabel();
    this._createSelectorField();
    this._createArrowImage();
    this._createOptionsContainer();
  }

  _createSelectorContainer() {
    const container = document.createElement('div');
    const parent = document.querySelector(this.selector);

    container.setAttribute('id', 'selector-container');
    container.classList.add('selector-container');
    parent.appendChild(container);

    this._elements.container = container;
  }

  _createSelectorLabel() {
    const label = document.createElement('label');
    const parent = this._elements.container;

    label.setAttribute('id', 'label');
    label.classList.add('label');
    label.setAttribute('for', parent);
    label.innerHTML = this.label;
    parent.appendChild(label);

    this._elements.label = label;
  }

  _createSelectorField() {
    const selectorField = document.createElement('div');
    const parent = this._elements.container;

    selectorField.setAttribute('id', 'selectorField');
    selectorField.classList.add('selectorField');
    parent.appendChild(selectorField);

    this._elements.selectorField = selectorField;
  }

  _createArrowImage() {
    const arrow = document.createElement('img');
    const parent = this._elements.container;

    arrow.setAttribute('id', 'arrow');
    arrow.setAttribute('src', 'arrow.svg');
    parent.appendChild(arrow);

    this._elements.arrow = arrow;
  }

  _createOptionsContainer() {
    const options = document.createElement('div');
    const parent = document.querySelector(this.selector);

    options.setAttribute('id', 'options');
    options.classList.add('options');
    parent.appendChild(options);

    this._elements.options = options;
  }

  _createLoadingArrows() {
    const loadingArrows = document.createElement('img');
    const parent = this._elements.selectorField;

    loadingArrows.setAttribute('id', 'loading');
    loadingArrows.setAttribute('class', 'loading');
    loadingArrows.setAttribute('src', 'loading.svg');
    parent.appendChild(loadingArrows);

    this._elements.loadingArrows = loadingArrows;
  }

  _createOptions(optionsObject) {
    const optionsArray = Object.values(optionsObject);
    const optionsIDs = Object.keys(optionsObject);
    
    for (let i = 0; i < optionsArray.length; i++) {
      const option = document.createElement('div');

      option.classList.add('options-item');
      option.setAttribute('data-id', optionsIDs[i]);
      option.innerHTML = optionsArray[i].label;
      this._elements.options.appendChild(option);
  
      option.onclick = this._optionClickHandle.bind(this, option);
    }
  }

  _optionClickHandle(target) {
    console.log(target,'option click')
    const options = [...this._elements.options.children];
    options.forEach(option => {
      option.classList.remove('selected');
    });

    target.classList.add('selected');
    this._elements.label.classList.add('selected');
    this._elements.label.classList.add('special-style');
    this._elements.selectorField.innerHTML = target.innerHTML;
    this.onSelect(this._elements.selectorField.innerHTML);

    this._closeSelectorHandle(event);
  }

  async _getData() {
    const response = await fetch(this.url);
    return response.json();
  }

  setSelectorEvents() {
    this._elements.container.onclick = this._openSelectorHandle.bind(this);
    document.onclick = this._closeSelectorHandle.bind(this);
  }

  async _openSelectorHandle() {
    console.log('open click')
    this._elements.arrow.classList.remove('rotate-back');
    this._elements.arrow.classList.add('rotate');

    this._elements.label.classList.add('special-style');


    if (!this._elements.options.hasChildNodes()) {
      this._createLoadingArrows();

      const optionsObject = await this._getData();

      this._createOptions(optionsObject);
      this._elements.selectorField.innerHTML = '';
    }

    this._elements.options.classList.add('show');
  }

  _closeSelectorHandle(event) {
    console.log(event,'close click')
    if (!event.target.closest(`#${this._elements.container.id}`)) {
      console.log()
      this._elements.options.classList.remove('show');

      if (!this._elements.selectorField.hasChildNodes()) {
        this._elements.label.classList.remove('special-style');
      }
      
      if (this._elements.arrow.classList.contains('rotate')) {
        this._elements.arrow.classList.remove('rotate');
        this._elements.arrow.classList.add('rotate-back');
      }
    }
  }

  _set(index) {
    if (this._elements.options.hasChildNodes()) {
      this._elements.options.children[index].onclick(this._elements.options.children[index]);
    }
  }

  _get() {
    if (this._elements.selectorField.hasChildNodes()) {
      const options = [...this._elements.options.children];
      const option = options.find(option => this._elements.selectorField.innerHTML === option.innerHTML);
      return alert(JSON.stringify({label: option.innerHTML, id: option.dataset.id}));
    }
  }

  _clear() {
    this._elements.label.classList.remove('selected', 'special-style');
    this._elements.selectorField.innerHTML = '';
    this._closeSelectorHandle(event);
  }

  _destroy() {
    document.querySelector(this.selector).remove();
  }
}

const select = new Select({
  selector: '#select',
  label: 'Выберите технологию',
  url: 'https://vladilen-dev.firebaseio.com/technologies.json',
  onSelect(selectedItem) {
    const log = document.getElementById('log');
    log.innerHTML = `Selected item: ${selectedItem}`;
  }
})

document.querySelector('[data-type = open]').onclick = (e) => {
  e.stopPropagation();
  select._openSelectorHandle()
};
document.querySelector('[data-type = close]').onclick = (e) => select._closeSelectorHandle(e);
const indexFromSetField = document.querySelector('[data-type = set]').innerHTML.match(/(\d+)/)[0];
document.querySelector('[data-type = set]').onclick = () => select._set(indexFromSetField);
document.querySelector('[data-type = get]').onclick = () => select._get();
document.querySelector('[data-type = clear]').onclick = () => select._clear();
document.querySelector('[data-type = destroy]').onclick = () => select._destroy();