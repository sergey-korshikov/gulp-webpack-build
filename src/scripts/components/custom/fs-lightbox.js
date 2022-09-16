import { fixationPage } from "../helpers/toggle-page-fix";

export const initFsLightbox = () => {
  if (typeof refreshFsLightbox == 'function') refreshFsLightbox();

  if (typeof fsLightboxInstances == 'undefined') return;

  for (const key in fsLightboxInstances) {
    if (Object.hasOwnProperty.call(fsLightboxInstances, key)) {
      const fsLightboxItem = fsLightboxInstances[key].props;

      fsLightboxItem.onOpen = () => fixationPage.fix();
      fsLightboxItem.onClose = () => fixationPage.unfix();
    }
  }
}
