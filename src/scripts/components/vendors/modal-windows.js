import axios from "axios";
import { toggleVisibility } from "../helpers/toggle-visibility";

export class ModalWindow {
  constructor(options = {}) {
    const fn = function() {};

    const defaultClasses = {
      js: 'js-modal-window',
      loading: 'loading',
      opened: 'opened',
      closed: 'closed',
      added: ''
    };

    const defaultLazyLoad = {
      url: '',
      submit: function(data, self) {
        if (data) {
          self.options.data = data;
          self.content.innerHTML = data;
        }
      },
      error: function(error, self) {
        console.error(error);
        self.content.innerHTML = self.options.textError || 'Ошибка: ' + error.message;
      }
    };

    const defaultTransitionModal = {
      display: 'flex',
      timeout: 200,
      changeHeight: false
    };

    const defaultTransitionPopup = {
      timeout: 200,
      changeOpacity: false
    };

    const defaultOptions = {
      name: 'modal-window',
      textError: '',
      unique: true,
      data: '',

      // transitions: {},

      template: function(self) {
        const options = self.options;
        const classes = options.classes;

        return '' +
          `<div class="modalWindow ${classes.js} ${classes.closed} ${classes.added}" data-modal-window="${options.name}" data-modal-close data-id="${self.id}">` +
            `<div class="modalWindow__popup ${classes.closed}" data-modal-popup>` +
              `<button class="modalWindow__close" data-modal-close type="button" aria-label="Закрыть окно"><svg width="24" height="24" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M13.3 0.70875C12.91 0.31875 12.28 0.31875 11.89 0.70875L7 5.58875L2.11 0.69875C1.72 0.30875 1.09 0.30875 0.700001 0.69875C0.310001 1.08875 0.310001 1.71875 0.700001 2.10875L5.59 6.99875L0.700001 11.8887C0.310001 12.2787 0.310001 12.9087 0.700001 13.2987C1.09 13.6887 1.72 13.6887 2.11 13.2987L7 8.40875L11.89 13.2987C12.28 13.6887 12.91 13.6887 13.3 13.2987C13.69 12.9087 13.69 12.2787 13.3 11.8887L8.41 6.99875L13.3 2.10875C13.68 1.72875 13.68 1.08875 13.3 0.70875Z"/></svg></button>` +
              `<div class="modalWindow__content" data-modal-content>${options.data}</div>` +
            `</div>` +
          `</div>` +
        '';
      },

      onInit: fn,
      onInited: fn,
      onLoad: fn,
      onLoaded: fn,
      onLoadedError: fn,
      onCreate: fn,
      onCreated: fn,
      onUpdate: fn,
      onUpdated: fn,
      onModalOpen: fn,
      onModalOpened: fn,
      onModalClose: fn,
      onModalClosed: fn,
      onPopupOpen: fn,
      onPopupOpened: fn,
      onPopupClose: fn,
      onPopupClosed: fn,
    };

    if (!options.transitions) options.transitions = {};

    this.options = Object.assign(defaultOptions, options);
    this.options.classes = Object.assign(defaultClasses, options.classes);
    this.options.lazyLoad = Object.assign(defaultLazyLoad, options.lazyLoad);
    this.options.transitions.modal = Object.assign(defaultTransitionModal, options.transitions.modal);
    this.options.transitions.popup = Object.assign(defaultTransitionPopup, options.transitions.popup);
    this.states = {
      init: false,
      load: false,
      create: false,
      update: false,
      modal: 'closed',
      popup: 'closed',
    }

    this.init();
  }

  init() {
    this.setState('init');

    this.id = Date.now();

    if (this.options.unique) {
      this.options.name = this.options.name + '-' + this.id;
    }

    let modal = document.querySelector('.'+this.options.classes.js+'[data-modal-window="'+this.options.name+'"]');

    if (!modal) {
      this.create();
      modal = document.querySelector('.'+this.options.classes.js+'[data-modal-window="'+this.options.name+'"]');
    }

    this.modal = modal;
    this.popup = modal.querySelector('[data-modal-popup]');
    this.content = modal.querySelector('[data-modal-content]');

    this.events();

    this.setState('inited');

    return this;
  }

  create() {
    this.setState('create');

    const html = this.options.template(this);
    document.body.insertAdjacentHTML('beforeend', html);

    this.setState('created');

    return this;
  }

  update(data) {
    this.setState('update');

    this.content.innerHTML = data;

    this.setState('updated');

    return this;
  }

  open() {
    const callback = self => {
      if (self.states.modal === 'opened') self.openElement('popup');
    };

    if (
      this.options.lazyLoad.url &&
      this.states.load !== 'loaded' &&
      this.states.load !== 'load'
    ) this.loadContent(callback);

    this.openElement('modal', self => {
      if (
        !self.options.lazyLoad.url ||
        self.states.load === 'loaded' ||
        self.states.load === 'loaded-error'
      ) callback(self);
    });

    return this;
  }

  close() {
    if (this.states.load === 'load') {
      this.closeElement('modal');
    } else {
      this.closeElement('popup', self => self.closeElement('modal'));
    }

    return this;
  }

  openElement(name, callback) {
    const self = this;

    self.setState(name+'-open');

    window.requestAnimationFrame(function() {
      toggleVisibility(self[name], 'show', self.options.transitions[name], function() {
        self.setState(name+'-opened');
        typeof callback === 'function' && callback(self);
      });
    });

    return self;
  }

  closeElement(name, callback) {
    const self = this;

    self.setState(name+'-close');

    window.requestAnimationFrame(function() {
      toggleVisibility(self[name], 'hide', self.options.transitions[name], function() {
        self.setState(name+'-closed');
        typeof callback === 'function' && callback(self);
      });
    });

    return self;
  }

  loadContent(callback) {
    const self = this;
    const lazyLoad = self.options.lazyLoad;

    self.setState('load');

    axios.get(lazyLoad.url)
    .then(function(response) {
      lazyLoad.submit(response.data, self);
      self.setState('loaded');

      typeof callback === 'function' && callback(self, true, response);
    })
    .catch(function(error) {
      lazyLoad.error(error, self);
      self.setState('loaded-error');

      typeof callback === 'function' && callback(self, false, error);
    });

    return self;
  }

  events() {
    const self = this;

    self.modal.addEventListener('click', function(e) {
      const element = e.target;

      if (element.hasAttribute('data-modal-close') || element.closest('[data-modal-close]:not(.'+self.options.classes.js+')')) {
        self.close();
      }
    });

    return self;
  }

  setState(name) {
    const options = this.options;
    const states = this.states;
    const modal = this.modal;
    const popup = this.popup;
    const classLoading = options.classes.loading;
    const classOpened = options.classes.opened;
    const classClosed = options.classes.closed;

    if (name === 'init') {
      options.onInit(this);
      states.init = 'init';
    }
    if (name === 'inited') {
      states.init = 'inited';
      options.onInited(this);
    }

    if (name === 'load') {
      options.onLoad(this);
      states.load = 'load';
      modal.classList.add(classLoading);
    }
    if (name === 'loaded') {
      states.load = 'loaded';
      modal.classList.remove(classLoading);
      options.onLoaded(this);
    }
    if (name === 'loaded-error') {
      states.load = 'loaded-error';
      modal.classList.remove(classLoading);
      options.onLoadedError(this);
    }

    if (name === 'create') {
      options.onCreate(this);
      states.create = 'create';
    }
    if (name === 'created') {
      states.create = 'created';
      options.onCreated(this);
    }

    if (name === 'update') {
      options.onUpdate(this);
      states.update = 'update';
    }
    if (name === 'updated') {
      states.update = 'updated';
      options.onUpdated(this);
    }

    if (name === 'modal-open') {
      options.onModalOpen(this);
      states.modal = 'open';
      modal.classList.remove(classClosed);
    }
    if (name === 'modal-opened') {
      states.modal = 'opened';
      modal.classList.add(classOpened);
      options.onModalOpened(this);
    }

    if (name === 'modal-close') {
      options.onModalClose(this);
      states.modal = 'close';
      modal.classList.remove(classOpened);
    }
    if (name === 'modal-closed') {
      states.modal = 'closed';
      modal.classList.add(classClosed);
      options.onModalClosed(this);
    }

    if (name === 'popup-open') {
      options.onPopupOpen(this);
      states.popup = 'open';
      popup.classList.remove(classClosed);
    }
    if (name === 'popup-opened') {
      states.popup = 'opened';
      popup.classList.add(classOpened);
      options.onPopupOpened(this);
    }

    if (name === 'popup-close') {
      options.onPopupClose(this);
      states.popup = 'close';
      popup.classList.remove(classOpened);
    }
    if (name === 'popup-closed') {
      states.popup = 'closed';
      popup.classList.add(classClosed);
      options.onPopupClosed(this);
    }

    return this;
  }
}
