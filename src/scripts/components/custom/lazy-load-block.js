import { initDefaultElements } from "../loaded";

export const initLazyLoadBlock = function() {
  const selector = '.js-lazy-load-block';

  lozad(selector, {
    load: function(block) {
      const url = block.getAttribute('data-url');

      if (!url) return;

      axios.get(url)
      .then(function(response) {
        const data = response.data;

        block.classList.remove('loading');

        if (data['error']) {
          block.classList.add('error');
          block.innerHTML = '<div class="container">' + data['error'] + '</div>';
          console.warn(data['error']);
        } else {
          block.innerHTML = response.data;
          initDefaultElements();
        }
      })
      .catch(function(error) {
        block.classList.remove('loading');
        block.classList.add('error');
        block.innerHTML = '<div class="container">' + projectOptions.error.default + '</div>';
        console.warn(error);
      });
    }
  }).observe();
}
