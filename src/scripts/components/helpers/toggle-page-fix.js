export const fixationPage = {
  fix: () => {
    if (!document.body.classList.contains('disable-scroll')) {
      const pagePosition = window.scrollY;
      const widthScroll = window.innerWidth - document.body.offsetWidth;

      document.body.classList.add('disable-scroll');
      document.body.dataset.position = pagePosition;
      document.body.style.top = -pagePosition + 'px';
      if (widthScroll > 0) {
        document.body.style.paddingRight = widthScroll + 'px';
        document.querySelectorAll('header').forEach(header => header.style.right = widthScroll + 'px');
      }
    }
  },

  unfix: () => {
    if (document.body.classList.contains('disable-scroll')) {
      const pagePosition = parseInt(document.body.dataset.position, 10);

      document.body.removeAttribute('data-position');
      document.body.style.overflowY = 'auto';
      document.body.style.top = 'auto';
      document.body.style.paddingRight = 0;
      document.body.classList.remove('disable-scroll');
      document.querySelectorAll('header').forEach(header => header.style.right = 0);
      window.scroll({ top: pagePosition, left: 0 });
    }
  }
};