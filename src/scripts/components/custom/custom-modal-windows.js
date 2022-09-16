import { fixationPage } from "../helpers/toggle-page-fix";
import { initDefaultElements } from "../loaded";
import { ModalWindow } from "../vendors/modal-windows";
import { initCustomForm } from "./custom-form";

export const initCustomModalWindow = function () {
  const buttons = document.querySelectorAll('.js-modal-window-init:not(.js-inited)');

  if (!buttons[0]) return false;

  for (let i = 0; i < buttons.length; i++) init(buttons[i]);

  function init(button) {
    if (button.classList.contains('js-inited')) return false;

    const url = button.getAttribute('data-url');
    const name = button.getAttribute('data-modal-window');

    let modalWindow;

    button.classList.add('js-inited');

    button.addEventListener('click', function () {
      if (modalWindow) {
        modalWindow.open();
      } else {
        modalWindow = new ModalWindow({
          name: name,
          unique: false,
          textError: projectOptions.error.request,
          lazyLoad: {
            url: url,
          },
          onInited: mw => mw.open(),
          onLoaded: mw => {
            const selectorModal = '.js-modal-window[data-modal-window="' + mw.options.name + '"]';
            const buttonClose = mw.popup.querySelector('.js-modal-window-init');

            buttonClose &&
              buttonClose.addEventListener('click', () => {
                mw.notUnfix = true;
                mw.close();
              });

            initDefaultElements();

            initCustomForm(selectorModal + ' form', () => mw.modal.classList.add('sent'));
          },
          onModalOpen: () => fixationPage.fix(),
          onModalOpened: mw => {
            const fieldDetail = mw.popup.querySelector('[name="DETAIL"]');
            const detailValue = button.getAttribute('data-detail');

            if (fieldDetail && detailValue) fieldDetail.value = detailValue;
          },
          onModalClosed: mw => {
            mw.modal.classList.remove('sent');

            if (mw.notUnfix) {
              mw.notUnfix = false;
            } else {
              fixationPage.unfix();
            }
          },
        });
      }
    });
  }
};
