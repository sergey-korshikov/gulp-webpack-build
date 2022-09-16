import lozad from "lozad";
import { addEventListenerOnce } from "../helpers/one-event";

export const initIframes = (e) => {
  const selector = '.lozad-iframe';

  if (typeof lozad != 'function') return false;

  if (!window.pageYOffset) {
    addEventListenerOnce(window, 'scroll', () => lozad(selector).observe());
  } else {
    lozad(selector).observe();
  }
}