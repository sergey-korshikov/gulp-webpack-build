export const toggleVisibility = (element, action = 'auto', params = {}, callback) => {
  if (!element) return false;

  const options = Object.assign({
    display: 'block',
    changeHeight: true,
    changeOpacity: true,
    animation: 'ease-in-out',
    timeout: 200,
    styles: ''
  }, params);

  const transition = `all ${options.timeout}ms ${options.animation}`;
  const isVisibleElement = checkVisible(element);

  if (action === 'show') {
    options._targetVisible = true;
  } else if (action === 'hide') {
    options._targetVisible = false;
  } else {
    options._targetVisible = !isVisibleElement;
  }

  if (options._targetVisible === isVisibleElement) return false;

  options.styles && element.setAttribute('style', options.styles); // get attr style

  if (options._targetVisible) {

    element.style.visibility = 'hidden';
    element.style.overflow = 'hidden';
    element.style.display = options.display;

    if (options.changeOpacity) {
      element.style.opacity = '0';
    }

    if (options.changeHeight) {
      const styles = getStyles(element);

      options._h = styles.h;
      options._pt = styles.pt;
      options._pb = styles.pb;
      options._mt = styles.mt;
      options._mb = styles.mb;
      options._btw = styles.btw;
      options._bbw = styles.bbw;

      element.style.height = '0';
      element.style.marginTop = '0';
      element.style.paddingTop = '0';
      element.style.marginBottom = '0';
      element.style.paddingBottom = '0';
      element.style.borderTopWidth = '0';
      element.style.borderBottomWidth = '0';
    }

    setTimeout(function() {
      element.style.transition = transition;
      element.style.visibility = 'visible';
    }, 0);

  } else {

    if (options.changeOpacity) {
      element.style.opacity = '1';
    }

    if (options.changeHeight) {
      const styles = getStyles(element);

      element.style.height = styles.h + 'px';
      element.style.marginTop = styles.mt + 'px';
      element.style.paddingTop = styles.pt + 'px';
      element.style.marginBottom = styles.mb + 'px';
      element.style.paddingBottom = styles.pb + 'px';
      element.style.borderTopWidth = styles.btw + 'px';
      element.style.borderBottomWidth = styles.bbw + 'px';
    }

    setTimeout(function() {
      element.style.overflow = 'hidden';
      element.style.transition = transition;
    }, 0);

  }

  setTimeout(function() {
    if (options.changeOpacity) {
      element.style.opacity = options._targetVisible ? '1' : '0';
    }

    if (options.changeHeight) {
      element.style.height = options._targetVisible ? (options._h + 'px') : '0';
      element.style.marginTop = options._targetVisible ? (options._mt + 'px') : '0';
      element.style.paddingTop = options._targetVisible ? (options._pt + 'px') : '0';
      element.style.marginBottom = options._targetVisible ? (options._mb + 'px') : '0';
      element.style.paddingBottom = options._targetVisible ? (options._pb + 'px') : '0';
      element.style.borderTopWidth = options._targetVisible ? (options._btw + 'px') : '0';
      element.style.borderBottomWidth = options._targetVisible ? (options._bbw + 'px') : '0';
    }
  }, 0);

  setTimeout(function() {
    element.setAttribute(
      'style',
      (options._targetVisible ? ('display:' + options.display + ';') : 'display:none;') + options.styles
    );

    typeof callback === 'function' && callback();
  }, options.timeout);

  function checkVisible(e) {
    const box = e.getBoundingClientRect();
    const height = box.height || (box.bottom - box.top);
    const width = box.width || (box.right - box.left);

    return !!height || !!width;
  }

  function getStyle(e, style) {
    return parseInt(getComputedStyle(e)[style], 10);
  }

  function getStyles(e) {
    return {
      h: e.offsetHeight,
      mt: getStyle(e, 'marginTop'),
      pt: getStyle(e, 'paddingTop'),
      mb: getStyle(e, 'marginBottom'),
      pb: getStyle(e, 'paddingBottom'),
      btw: getStyle(e, 'borderTopWidth'),
      bbw: getStyle(e, 'borderBottomWidth'),
    }
  }

  return true;
};

// Example use:
// toggleVisibility(
//   document.querySelector('.element'),   // DOM element (!)
//   'auto',                               // action: 'show' | 'hide' | 'auto' (default) (?)
//   {                                     // object params (?)
//     display: 'block',                   // style display (default: 'block')
//     changeHeight: true,                 // use animation height (default: true)
//     changeOpacity: true,                // use animation opacity (default: true)
//     animation: 'ease-in-out',           // style animation toggle (default: 'ease-in-out')
//     timeout: 200,                       // timeout animation toggle (default: 200)
//     styles: ''                          // add styles (default: '')
//   },
//   function() {}                         // callback (?)
// )
