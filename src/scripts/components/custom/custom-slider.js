export const initCustomSlider = () => {
  const selector = '.js-custom-slider';
  const sliders = document.querySelectorAll(selector + ':not([data-slider])');

  if (!sliders[0]) return;

  for (let i = 0; i < sliders.length; i++) {
    const id = Date.now() + '-' + i;
    const uniqueSelector = selector + '[data-slider="'+id+'"]';
    const qty = sliders[i].getAttribute('data-qty');
    const options = {
      slidesPerView: 1,
      spaceBetween: 24,

      navigation: {
        nextEl: uniqueSelector + ' [data-button-next]',
        prevEl: uniqueSelector + ' [data-button-prev]',
      },

      breakpoints: {},
    };

    if (qty == '4') {
      options.breakpoints[600] = {
        slidesPerView: 2,
      };
      options.breakpoints[992] = {
        slidesPerView: 3,
      };
      options.breakpoints[1260] = {
        slidesPerView: 4,
      };
    }

    if (qty == '3') {
      options.breakpoints[768] = {
        slidesPerView: 2,
      };
      options.breakpoints[1260] = {
        slidesPerView: 3,
      };
    }

    sliders[i].setAttribute('data-slider', id);

    import('./swiper-init').then(({ initSwiper }) => initSwiper(uniqueSelector + ' .swiper', options));
  }
}
