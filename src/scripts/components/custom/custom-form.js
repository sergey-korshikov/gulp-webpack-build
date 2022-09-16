import axios from "axios";
import JustValidate from "just-validate";
import lozad from "lozad";

export const initCustomForm = (selectorForm, onGood) => {
  if (!selectorForm) return false;

  lozad(selectorForm, {
    load: function() {
      const selectorText = selectorForm + ' [data-required="text"]';
      const selectorEmail = selectorForm + ' [data-required="email"]';
      const selectorPhone = selectorForm + ' [data-required="phone"]';
      const selectorFiles = selectorForm + ' [data-validate="files"]';
      const selectorResult = selectorForm + ' [data-result-checking]';

      const form = document.querySelector(selectorForm);
      const text = document.querySelectorAll(selectorText);
      const email = document.querySelector(selectorEmail);
      const phone = document.querySelector(selectorPhone);
      const files = document.querySelector(selectorFiles);
      const result = document.querySelector(selectorResult);

      if (form && !form.getAttribute('novalidate')) {
        const validate = new JustValidate(form, {
          errorFieldCssClass: 'error',
          errorLabelCssClass: 'form__error',
          errorLabelStyle: ''
        });

        if (text[0]) {
          text.forEach(item => {
            const name = item.getAttribute('name');
            const selector = selectorText + '[name="'+name+'"]';

            validate.addField(selector, [
              {
                rule: 'required',
                errorMessage: 'Это поле обязательно к заполнению',
              }
            ]);
          });
        }

        phone && validate.addField(selectorPhone, [
          {
            validator: (phoneValue) => {
              if (phone.inputmask) return phone.inputmask.isComplete();

              if (phoneValue) return phoneValue.match(/\d/g).length >= 10;

              return false;
            },
            errorMessage: 'Это поле обязательно к заполнению',
          }
        ]);

        email && validate.addField(selectorEmail, [
          {
            rule: 'required',
            errorMessage: 'Это поле обязательно к заполнению',
          }, {
            rule: 'email',
            errorMessage: 'Заполните поле в виде _____@____.__',
          }
        ]);

        files && validate.addField(selectorFiles, [
          {
            rule: 'maxFilesCount',
            value: 10,
            errorMessage: 'Загрузите до 10 фото',
          },
          {
            rule: 'files',
            value: {
              files: {
                maxSize: 10000000,
                extensions: ['jpeg', 'jpg', 'png'],
                types: ['image/jpeg', 'image/jpg', 'image/png']
              },
            },
            errorMessage: 'Загрузите до 10 фото в форматах: JPEG, PNG (размер файла не более 10 Мб)',
          },
        ]);

        result && files && files.addEventListener('change', (e) => {
          const files = e.target.files;

          let value = '';

          if (!files[0]) return false;

          for (let f = 0; f < files.length; f++) {
            if (value) value += ', ';
            value += files[f].name;
          }

          result.innerHTML = value;

          if (value) {
            result.classList.add('active');
          } else {
            result.classList.remove('active');
          }
        });

        validate.onSuccess((e) => {
          const url = form.getAttribute('action');
          const method = form.getAttribute('method');
          const info = form.querySelector('[data-form-info]');
          const btnSubmit = form.querySelector('[type="submit"]');
          const successful = btnSubmit.getAttribute('data-success');
          const data = new FormData(form);

          const good = data => {
            if (!info) return false;

            info.innerHTML = data.message;
            info.classList.add('active', 'good');
          }

          const error = error => {
            console.warn(error);

            if (!info) return false;

            info.innerHTML = projectOptions.error.request;
            info.classList.add('active', 'error');
          }

          if (btnSubmit.classList.contains('loading')) return false;

          btnSubmit.classList.add('loading');
          info && info.classList.remove('active', 'good', 'error');

          axios({
            url: url,
            data: data,
            method: method,
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then(response => {
            if (response.data?.result == "success" || response.data?.status == "success") {
              form.reset();

              if (result) {
                result.innerHTML = '';
                result.classList.remove('active');
              }

              if (typeof onGood == 'function') {
                onGood();
              } else {
                good(response.data);
              }

              if (successful) window.eval(successful);
            } else {
              error(response.data);
            }
          })
          .catch(error)
          .then(() => btnSubmit.classList.remove('loading'));
        });
      }
    }
  }).observe();
}

export const initDefaultForm = () => initCustomForm('.js-form');
