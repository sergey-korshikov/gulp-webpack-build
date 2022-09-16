import lozad from 'lozad';
// import { addEventListenerOnce } from '../helpers/one-event';

export const initPhoneMask = () => {
  const selector = '.js-form-phone';

  lozad(selector, {
    load: input => {
      // addEventListenerOnce(input, 'focus', () => {
      import('../vendors/phone-mask').then(({ PhoneMask }) => new PhoneMask(input));
      // });
    },
  }).observe();
};
