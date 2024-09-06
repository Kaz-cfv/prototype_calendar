class Calendar {
  constructor() {
    this.calendarElement = document.getElementById('c-calendar-router');
    this.calendarRoot = document.getElementById('c-calendar');
    if (!this.calendarRoot) return;

    this.yearSelect = document.getElementById('year');
    this.prevButton = document.querySelector('.js--prev');
    this.nextButton = document.querySelector('.js--next');

    this.currentYear = dayjs(new Date()).locale('ja');
    this.init();
    this.bindEvents();
  }

  init() {
    this.renderCalendar(this.calendarElement, this.currentYear);
  }

  bindEvents() {
    this.yearSelect.onchange = () => {
      this.currentYear = dayjs(new Date(this.yearSelect.value));
      this.updateCalendar();
    };

    if (this.prevButton) {
      this.prevButton.addEventListener('click', () => {
        this.currentYear = this.currentYear.subtract(1, 'y');
        this.updateCalendar();
        this.scrollToCalendar();
      });
    }

    if (this.nextButton) {
      this.nextButton.addEventListener('click', () => {
        this.currentYear = this.currentYear.add(1, 'y');
        this.updateCalendar();
        this.scrollToCalendar();
      });
    }
  }

  updateCalendar() {
    this.removeChildren(this.calendarElement);
    this.renderCalendar(this.calendarElement, this.currentYear);
  }

  removeChildren(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  renderCalendar(calendarElement, currentYear) {
    const data = this.fetchCalendarData(); // APIからデータを取得する予定の箇所
    this.setYearOptions(currentYear);

    let renderPoint = false;
    let day = 1;
    let month = 1;
    const WEEK_ITEMS = ['日', '月', '火', '水', '木', '金', '土'];

    for (let k = 0; k < 12; k++) {
      const calendarContent = this.createCalendarContent(currentYear, month);
      const calendarBody = this.createCalendarBody(currentYear, month, day, data, WEEK_ITEMS, renderPoint);

      calendarContent.appendChild(calendarBody);
      calendarElement.appendChild(calendarContent);

      day = 1;
      month++;
    }
  }

  fetchCalendarData() {
    // APIからデータを取得する予定の箇所
    // 現在は静的なデータを返す
    return {
      id: 1,
      schedules: [
        {
          startDay: '2024/1/13',
          atDay: '2024/1/15',
          endDay: '2024/2/5',
          type: '',
          typeClass: '',
          pattern: 'A',
          bride: '',
          bridegroom: '',
        },
        {
          startDay: '2024/2/12',
          atDay: '2024/2/15',
          endDay: '2024/2/18',
          type: '',
          typeClass: '',
          pattern: 'B',
          bride: '',
          bridegroom: '',
        },
        {
          startDay: '2024/4/28',
          atDay: '2024/5/6',
          endDay: '2024/5/13',
          type: '',
          typeClass: '',
          pattern: 'C',
          bride: '',
          bridegroom: '',
        },
      ],
    };
  }

  setYearOptions(currentYear) {
    const yearOptions = this.yearSelect.querySelectorAll('option');
    yearOptions.forEach((option) => {
      option.removeAttribute('selected');
    });

    const selectedOption = this.yearSelect.querySelector(`option[value="${currentYear.format('YYYY')}"]`);
    selectedOption.setAttribute('selected', 'selected');

    const END_YEAR = '2029';
    if (currentYear.format('YYYY') === END_YEAR) {
      this.nextButton.classList.add('is--enable');
    } else {
      this.nextButton.classList.remove('is--enable');
    }
  }

  createCalendarContent(currentYear, month) {
    const calendarContent = document.createElement('div');
    calendarContent.classList.add('c-calendar-inner');

    const calendarMonth = document.createElement('div');
    calendarMonth.classList.add('c-calendar-month');
    calendarMonth.textContent = `${month}月`;

    calendarContent.appendChild(calendarMonth);
    return calendarContent;
  }

  createCalendarBody(currentYear, month, day, data, WEEK_ITEMS, renderPoint) {
    const calendarBody = document.createElement('table');
    calendarBody.classList.add('c-calendar-tbl');

    for (let h = 0; h < 3; h++) {
      const row = document.createElement('tr');
      row.classList.add('c-calendar-tbl__row');

      for (let i = 0; i < 11; i++) {
        if (h === 0 && i === 10) {
          const emptyCell = document.createElement('td');
          emptyCell.classList.add('c-calendar-tbl__cell', 'empty');
          const emptyCellDate = document.createElement('span');
          emptyCellDate.classList.add('c-calendar-tbl__daily');
          emptyCell.appendChild(emptyCellDate);
          row.appendChild(emptyCell);
        } else if (h === 1 && i === 10) {
          const emptyCell = document.createElement('td');
          emptyCell.classList.add('c-calendar-tbl__cell', 'empty');
          const emptyCellDate = document.createElement('span');
          emptyCellDate.classList.add('c-calendar-tbl__daily');
          emptyCell.appendChild(emptyCellDate);
          row.appendChild(emptyCell);
        } else {
          const cell = this.createCalendarCell(currentYear, month, day, data, WEEK_ITEMS, renderPoint);
          row.appendChild(cell);
          day++;
        }
      }

      calendarBody.appendChild(row);

      if (h === 0) {
        day = 11;
      } else if (h === 1) {
        day = 21;
      }
    }

    return calendarBody;
  }

  createCalendarCell(currentYear, month, day, data, WEEK_ITEMS, renderPoint) {
    const cell = document.createElement('td');
    cell.classList.add('c-calendar-tbl__cell');

    const cellDate = document.createElement('span');
    cellDate.classList.add('c-calendar-tbl__daily');

    const daysInMonth = this.getDaysInMonth(currentYear, month);
    if (day > daysInMonth) {
      cell.classList.add('empty');
      cellDate.textContent = '';
    } else {
      const date = new Date(currentYear.format('YYYY'), month - 1, day);
      const week = date.getDay();
      const formattedDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
      cell.setAttribute('data-date', formattedDate);

      const dayOfWeek = WEEK_ITEMS[week];
      if (week === 0) {
        cell.classList.add('--sun');
      } else if (week === 6) {
        cell.classList.add('--sat');
      }

      cellDate.textContent = `${day}/${dayOfWeek}`;

      for (let l = 0; l < data.schedules.length; l++) {
        const schedule = data.schedules[l];
        const startDate = new Date(schedule.startDay);
        const endDate = new Date(schedule.endDay);
        const currentDate = new Date(formattedDate);

        if (formattedDate === schedule.startDay) {
          cell.classList.add('startDay');
          const handle = document.createElement('span');
          handle.classList.add('handle');
          cell.appendChild(handle);
          renderPoint = true;
        } else if (formattedDate === schedule.atDay) {
          cell.classList.add('atDay');
          const caption = document.createElement('div');
          caption.innerHTML = `
            <div class="type_wrapper">
              <span class="type">試</span><span class="type">試</span>
            </div>
            <span class="date">2024/10/25</span>
            <span class="pattern">${data.schedules[l].pattern}</span>
            <span class="caption">山田</span>
            <span class="caption">高嶺野</span>
          `;
          caption.classList.add('content');
          cell.appendChild(caption);
        } else if (formattedDate === schedule.endDay) {
          cell.classList.add('endDay');
          const handle = document.createElement('span');
          handle.classList.add('handle');
          cell.appendChild(handle);
          renderPoint = false;
        } else if (currentDate > startDate && currentDate < endDate && formattedDate !== schedule.atDay) {
          cell.classList.add('targetDay');
        }
      }
    }

    cell.appendChild(cellDate);
    return cell;
  }

  getDaysInMonth(currentYear, month) {
    return new Date(currentYear.format('YYYY'), month, 0).getDate();
  }

  setCellAsEmpty(cell, currentYear, month, day) {
    const isLeapYear = (year) => {
      return (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0);
    };

    if (
      (month === 2 && day === 29 && !isLeapYear(currentYear.year())) ||
      (month === 2 && day === 30) ||
      (month === 2 && day === 31) ||
      (month === 4 && day === 31) ||
      (month === 6 && day === 31) ||
      (month === 9 && day === 31) ||
      (month === 11 && day === 31) ||
      (day === 11 && month !== 2) ||
      (day === 21 && month !== 2)
    ) {
      cell.classList.add('empty');
      cell.querySelector('.handle')?.remove();
    }
  }

  scrollToCalendar() {
    const calendarRect = this.calendarRoot.getBoundingClientRect();
    const scrollPosition = window.pageYOffset + calendarRect.top;
    window.scrollTo({
      top: scrollPosition,
      behavior: 'smooth',
    });
  }
}
