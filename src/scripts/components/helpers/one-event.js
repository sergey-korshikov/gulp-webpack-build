export const addEventListenerOnce = (el, ev, act) => {
  const fn = () => {
    el.removeEventListener(ev, fn);
    act();
  };

  el.addEventListener(ev, fn);
}