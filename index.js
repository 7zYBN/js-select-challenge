class Select {
  constructor({selector = null, label = null, url = null, onSelect = null}) {
    this.selector = selector;
    this.label = label;
    this.url = url;
    this.onSelect = onSelect;

    this.setDporDownEvent();
    this.setButtonsEvents();
  }

  _getData() {
    return fetch(this.url)
      .then(response => response.json())
      .then(items => {
        this._createOptions(items);
        document.querySelector('.selector').innerHTML = '';
      });
  }

  _createLoadingArrows() {
    const selector = document.querySelector('.selector');
    const img = document.createElement('img');
    img.setAttribute('id', 'loading');
    img.setAttribute('class', 'loading');
    img.setAttribute('src', 'loading.svg');
    selector.appendChild(img);
  }

  _open() {
    const arrow = document.querySelector('#arrow');
    const label = document.querySelector('#label');
    const log = document.querySelector('#log');
    const optionsList = document.querySelector('.options');
    arrow.classList.add('rotate');
    arrow.classList.remove('rotate-back');
    arrow.classList.remove('default');

    if (!optionsList.hasChildNodes()) {
      this._createLoadingArrows();
      this._getData();
    } else {
      optionsList.classList.remove('non-display');
      optionsList.classList.add('visible');
    }

    if (!log.hasChildNodes()) {
      label.classList.add('special-style');
    }
  }

  _close() {
    const arrow = document.querySelector('#arrow');
    const label = document.querySelector('#label');
    const log = document.querySelector('#log');
    const optionsList = document.querySelector('.options');
    arrow.classList.add('rotate-back');
    arrow.classList.remove('rotate');

    optionsList.classList.add('non-display');
    optionsList.classList.remove('visible');

    if (!log.hasChildNodes()) {
      label.classList.remove('special-style');
    }
  }

  _set() {
    return 5;
  }

  _get() {
    const log = document.querySelector('#log');
    const optionsList = document.querySelector('.options');

    if (!optionsList.hasChildNodes()) {
      this.onSelect('No data for select item')
    } else {
      this._changeLabelStyle();
      optionsList.children[this._set()].onclick();
    }
  }

  _changeArrowStyle() {
    const arrow = document.querySelector('#arrow');

    if (arrow.classList.contains('default')) {
      arrow.classList.remove('default');
      arrow.classList.add('rotate');
    } else {
      arrow.classList.toggle('rotate');
      arrow.classList.toggle('rotate-back');
    }
  }

  _changeLabelStyle() {
    const label = document.querySelector('#label');
    
    label.classList.toggle('special-style');
  }

  changeStylesOfSelector() {
    const log = document.querySelector('#log');

    if (!log.hasChildNodes()) {
      this._changeLabelStyle();
    }
    
    this._changeArrowStyle();
  }

  _selectorHandle() {
    const optionsList = document.querySelector('.options');

    if (!optionsList.hasChildNodes()) {
      this._createLoadingArrows();
      this._getData();
    } else {
      this._changeBlockVisible(optionsList);
    }
    
    this.changeStylesOfSelector();
  }

  setDporDownEvent() {
    const labelOfSelector = document.querySelector('#label');
    const containerOfSelector = document.querySelector('#selector-container');

    labelOfSelector.onclick = this._selectorHandle.bind(this);
    containerOfSelector.onclick = this._selectorHandle.bind(this);
  }

  setButtonsEvents() {
    document.querySelector('[data-type = open]').onclick = this._open.bind(this);
    document.querySelector('[data-type = close]').onclick = this._close.bind(this);
    document.querySelector('[data-type = set]').onclick = this._set.bind(this);
    document.querySelector('[data-type = get]').onclick = this._get.bind(this);
    // document.querySelector('[data-type = clear]').onclick = this._clear.bind(this);
    // document.querySelector('[data-type = destroy]').onclick = this._destroy.bind(this);
  }

  _changeBlockVisible(block) {
    block.classList.toggle('non-display');
    block.classList.toggle('visible');
  }

  _createOptions(optionsObject) {

    const optionsList = document.querySelector('.options');
    const optionsArray = Object.values(optionsObject);
    const optionsIDs = Object.keys(optionsObject);
    
    for (let i = 0; i < optionsArray.length; i++) {
      let option = document.createElement('div');

      option.classList.add('options-item');
      option.setAttribute('data-id',optionsIDs[i]);
      option.innerHTML = optionsArray[i].label;

      option.onclick = () => {
        const selector = document.querySelector('.selector');
        
        selector.innerHTML = option.innerHTML;
        this.onSelect(selector.innerHTML);
        this._changeBlockVisible(optionsList);

        this.changeStylesOfSelector();
      }

      optionsList.appendChild(option);
    }

    this._changeBlockVisible(optionsList);
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