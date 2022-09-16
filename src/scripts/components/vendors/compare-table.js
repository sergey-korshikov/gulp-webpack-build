export class CompareTable {
  constructor(table, options = {}) {
    const defaultOptions = {
      columns:    1,       // колличество видимых колонок свойств
      mouseDrag:  false,   // скролл мышью
      swipeTouch: false,   // свайп тачем
      responsive: false,   // адаптивность
    }

    this.table = table;
    this.groupControl = table.querySelectorAll('[data-group-control]');
    this.buttonPrev = table.querySelector('[data-button-prev]');
    this.buttonNext = table.querySelector('[data-button-next]');
    this.wrappers = table.querySelectorAll('.tw');
    this.rows = table.querySelectorAll('.tr');
    this.cells = table.querySelectorAll('.td, .th');

    this.currentPage = 1;
    this.currentColumn = 0;

    this.options = Object.assign(defaultOptions, options);

    this.dragProps = {
      interval: false,
      pressed: false,
      startX: 0,
      x: 0,
    };

    this.changeWidthPage = false;
    this.currentBreakpoint = false;
    this.widthPage = window.innerWidth;

    if (this.options.mouseDrag || this.options.swipeTouch) table.classList.add("drag");

    this.update();
    this.events();
  }

  // Updating
  update() {
    return this.updateBreakpoint().updateColumns().updateRows().updateCells().updateStepPositionColumns().updateControls();
  }

  // Updating breakpoints
  updateBreakpoint() {
    let currentBreakpoint = false;
    let settings = {};

    if (this.options.responsive) {
      for (let i = 0; i < this.options.responsive.length; i++) {
        let element = this.options.responsive[i];

        if (window.innerWidth >= element.breakpoint) {
          currentBreakpoint = element.breakpoint;
          settings = element.settings;
        }
      }
    }

    if (currentBreakpoint !== this.currentBreakpoint) {
      this.options = Object.assign(this.options, settings);
    }

    return this;
  }

  // Updating table
  updateColumns() {
    this.allColumns = this.rows[0].children.length;
    this.workColumns = this.allColumns < this.options.columns ? this.allColumns : this.options.columns;

    this.wrappers.forEach(wrapper => wrapper.style.flex = this.workColumns * 4 + ' 0 0');

    return this;
  }

  updateRows() {
    let widthRow = 100;

    if (this.workColumns < this.allColumns) {
      widthRow = this.allColumns * (100 / this.workColumns);
    }

    this.rows.forEach(row => {
      row.style.width = widthRow + '%';
    });

    return this;
  }

  updateCells() {
    const widthCell = 100 / this.allColumns;

    this.cells.forEach(cell => cell.style.width = widthCell + '%');

    return this;
  }

  updateStepPositionColumns(way) {
    let left;

    if (way === "prev" && this.currentColumn > 0) {
      this.currentColumn--;
    } else if (way === "next" && this.currentColumn < this.allColumns - this.workColumns) {
      this.currentColumn++;
    }

    if (this.currentColumn > this.allColumns - this.workColumns) {
      this.currentColumn = this.allColumns - this.workColumns;
    } else if (this.currentColumn < 0) {
      this.currentColumn = 0;
    }

    if (this.workColumns < this.allColumns) {
      left = -(100 / this.workColumns) * this.currentColumn;
    } else {
      this.currentColumn = 0;
      left = 0;
    }

    this.rows.forEach(row => row.style.left = left + '%');

    this.toggleClass(this.buttonPrev, 'remove', 'disabled');
    this.toggleClass(this.buttonNext, 'remove', 'disabled');

    if (this.currentColumn === 0) {
      this.toggleClass(this.buttonPrev, 'add', 'disabled');
    } else if (this.currentColumn === this.allColumns - this.workColumns) {
      this.toggleClass(this.buttonNext, 'add', 'disabled');
    }

    return this;
  }

  updateDragPositionColumns(position, isEnd) {
    const widthCell = this.wrappers[0].offsetWidth / this.workColumns;
    const widthCellPercent = 100 / this.workColumns;
    const startLeft = -(100 / this.workColumns) * this.currentColumn;

    if (isEnd) {
      this.currentColumn = this.currentColumn - Math.round(position / widthCell);
      this.updateStepPositionColumns();
    } else if (this.workColumns < this.allColumns) {
      const left = startLeft + (position / widthCell) * widthCellPercent;
      this.rows.forEach(row => row.style.left = left + '%');
    }

    return this;
  }

  // Updating arrows
  updateControls() {
    if (this.workColumns >= this.allColumns) {
      this.toggleClass(this.buttonPrev, 'add', 'hide');
      this.toggleClass(this.buttonNext, 'add', 'hide');
    } else {
      this.toggleClass(this.buttonPrev, 'remove', 'hide');
      this.toggleClass(this.buttonNext, 'remove', 'hide');
    }

    return this;
  }

  // Change table
  removeColumn(number) {
    this.rows.forEach(row => {
      const cells = Array.from(row.children);
      cells[number].remove();
    });

    this.update();

    if (this.rows[0].children.length < 1) this.table.classList.add('empty');
  }

  // Mouse and touch control
  moveController(e) {
    if (this.dragProps.pressed) {
      const clientX = e.clientX !== undefined ? e.clientX : e.changedTouches[0].clientX;
      this.dragProps.x = clientX - this.dragProps.startX;
    }
  }

  pressController(action, e, self) {
    if (action == "down") {
      const clientX = e.clientX !== undefined ? e.clientX : e.changedTouches[0].clientX;

      this.toggleClass(this.table, 'add', 'pressed');

      self.dragProps.pressed = true;
      self.dragProps.startX = clientX;
      self.dragProps.x = 0;
      self.dragProps.interval = setInterval(function () {
        if (self.dragProps.pressed) {
          self.updateDragPositionColumns(self.dragProps.x);
        } else {
          self.updateDragPositionColumns(self.dragProps.x, true);
          clearInterval(self.dragProps.interval);
        }
      }, 20);
    } else {
      this.toggleClass(this.table, 'remove', 'pressed');
      self.dragProps.pressed = false;
    }
  }

  // Resize page
  resizePage() {
    if (!this.changeWidthPage) {
      const self = this;

      this.changeWidthPage = true;

      setTimeout(function run() {
        if (window.innerWidth === self.widthPage) {
          self.changeWidthPage = false;
          self.update();
        } else {
          setTimeout(run);
        }

        self.widthPage = window.innerWidth;
      });
    }
  }

  // Events
  events() {
    const self = this;
    const moveController = (e) => self.moveController(e);

    self.buttonPrev.addEventListener('click', (e) => {
      e.preventDefault();
      self.updateStepPositionColumns('prev');
    });

    self.buttonNext.addEventListener('click', (e) => {
      e.preventDefault();
      self.updateStepPositionColumns('next');
    });

    if (self.groupControl[0]) {
      self.groupControl.forEach(control => {
        const button = control.querySelector('button');
        const name = control.getAttribute('data-group-control');
        const group = self.table.querySelector('[data-group="'+name+'"]');

        button.addEventListener('click', () => {
          if (control.classList.contains('open')) {
            control.classList.remove('open');
            control.classList.add('close');

            toggleVisibility(group, 'hide', {}, () => {
              group.classList.add('close');
            });

            group.classList.remove('open');
          } else {
            control.classList.remove('close');
            control.classList.add('open');

            toggleVisibility(group, 'show', {}, () => {
              group.classList.add('open');
            });

            group.classList.remove('close');
          }
        });
      });
    }

    if (self.options.mouseDrag) {
      self.table.addEventListener('mousedown', (e) => {
        e.preventDefault();
        if (
          e.target.closest('a') ||
          e.target.closest('img') ||
          e.target.closest('button') ||
          e.target.closest('[data-button-prev]') ||
          e.target.closest('[data-button-next]')
        ) return false;

        self.pressController('down', e, self);
        window.addEventListener('mousemove', moveController);
      })

      window.addEventListener('mouseup', (e) => {
        e.preventDefault();
        self.pressController('up', e, self);
        window.removeEventListener('mousemove', moveController);
      });
    }

    if (self.options.swipeTouch) {
      self.table.addEventListener('touchstart', (e) => {
        if (
          e.target.closest('a') ||
          e.target.closest('img') ||
          e.target.closest('button') ||
          e.target.closest('[data-button-prev]') ||
          e.target.closest('[data-button-next]')
        ) return false;

        self.pressController('down', e, self);
        window.addEventListener('touchmove', moveController);
      })

      window.addEventListener('touchend', (e) => {
        self.pressController('up', e, self);
        window.removeEventListener('touchmove', moveController);
      });

      window.addEventListener('touchcancel', (e) => {
        self.pressController('up', e, self);
        window.removeEventListener('touchmove', moveController);
      });
    }

    self.options.responsive && window.addEventListener('resize', () => self.resizePage());
  }

  // Help
  toggleClass(el, act, value) {
    if (!el || !value) return false;
    if (act == 'add') el.classList.add(value);
    if (act == 'remove') el.classList.remove(value);
  }
}
