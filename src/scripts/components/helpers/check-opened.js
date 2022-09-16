export const initCheckOpenedElements = function() {
  const click = function(e) {
    if (!window.projectOptions || !window.projectOptions.states) return false;

    for (const key in window.projectOptions.states) {
      if (Object.hasOwnProperty.call(window.projectOptions.states, key)) {
        const close = window.projectOptions.states[key];
        const hasClosest = e.target.closest(key);

        if (!hasClosest && typeof close == 'function') close(e);
      }
    }
  }

  document.addEventListener('click', click);
}