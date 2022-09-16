import { initPhoneMask } from "./custom/phone-mask";
import { initLazyLoadBlock } from "./custom/lazy-load-block";
import { initCheckOpenedElements } from "./helpers/check-opened";
import { initDefaultElements } from "./loaded";

export const pageReady = e => {
  window.projectOptions = {
    states: {},
    error: {
      default: 'Ошибка при отправке данных! Пожалуйста, попробуйте позже.',
      request: 'Ошибка при отправке данных! Пожалуйста, свяжитесь с нами по телефону <a class="customLink" href="tel:89876543210"><nobr>8 (987) 654 32-10</nobr></a>',
    },
  };

  initPhoneMask(e);
  initLazyLoadBlock(e);
  initDefaultElements(e);
  initCheckOpenedElements(e);
};
