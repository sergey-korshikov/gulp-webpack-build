import { toggleVisibility } from "../helpers/toggle-visibility";

export const initCustomAccordion = () => {
  const selector = '.js-custom-accordion';
  const elements = document.querySelectorAll(selector);

  if (!elements[0]) return false;

  elements.forEach(element => {
    const items = element.querySelectorAll('[data-accordion-item]');

    if (!items[0] || element.classList.contains('js-inited')) return false;

    element.classList.add('js-inited');

    items.forEach(item => init(item, items, element.hasAttribute('data-accordion-close-other')));
  });

  function init(current, items, isCloseOther) {
    const control = current.querySelector('[data-accordion-control]');
    const value = current.querySelector('[data-accordion-value]');

    if (!control || !value) return false;

    control.addEventListener('click', () => {
      items.forEach(item => {
        if (item.classList.contains('active') && (isCloseOther || item === current)) {
          const control = item.querySelector('[data-accordion-control]');
          const value = item.querySelector('[data-accordion-value]');

          item.classList.remove('active');
          value.classList.remove('active');
          control.classList.remove('active');
          toggleVisibility(value, 'hide');
        } else if (item === current && (isCloseOther || !item.classList.contains('active'))) {
          item.classList.add('active');
          value.classList.add('active');
          control.classList.add('active');
          toggleVisibility(value, 'show');
        }
      });
    });
  }
}
