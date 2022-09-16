import { initCustomModalWindow } from "./custom/custom-modal-windows";
import { initCustomAccordion } from "./custom/custom-accordion";
import { initCustomSlider } from "./custom/custom-slider";
import { initDefaultForm } from "./custom/custom-form";
import { initFsLightbox } from "./custom/fs-lightbox";
import { initIframes } from "./custom/iframes";
import { initImages } from "./custom/load-images";
import { initPhoneMask } from "./custom/phone-mask";

export const initDefaultElements = e => {
  initImages(e);
  initIframes(e);
  initPhoneMask(e);
  initFsLightbox(e);
  initDefaultForm(e);
  initCustomSlider(e);
  initCustomAccordion(e);
  initCustomModalWindow(e);
};
