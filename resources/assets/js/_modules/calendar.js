class Calender {
  constructor() {
    this.el = document.getElementById('c-calendar-router');
    this.rt = document.getElementById('c-calendar');
    if(!this.rt) {
      return;
    }

    // 現在の年でカレンダーを描画
    this.y = dayjs(new Date()).locale('ja');
    this.init(this.el, this.y);

    // 年を変更した際の処理
    this.sy = document.getElementById('year');
    this.sy.onchange = () => {
      console.log(this.sy.value);
      this.v = dayjs(new Date(this.sy.value));
      this.removeElm(this.el);
      this.init(this.el, this.v);
    }

    // 前の年へ
    this.btnPrev = document.querySelector('.js--prev');
    if(this.btnPrev) {
      this.btnPrev.addEventListener('click', () => {
        let prev = parseInt(this.sy.value, 10);
        document.getElementById('year').querySelector('option[value="' + prev + '"]').setAttribute("selected", "selected");
        this.pr_v = document.getElementById('year').querySelector('option[selected="selected"]').value;
        this.pr = dayjs(new Date(this.pr_v)).subtract(1, 'y');
        this.scroll(this.rt);
        this.removeElm(this.el);
        this.init(this.el, this.pr);
      });
    }

    // 次の年へ
    this.btnNext = document.querySelector('.js--next');
    if(this.btnNext) {
      this.btnNext.addEventListener('click', () => {
        let next = parseInt(this.sy.value, 10);
        document.getElementById('year').querySelector('option[value="' + next + '"]').setAttribute("selected", "selected");
        this.nt_v = document.getElementById('year').querySelector('option[selected="selected"]').value;
        this.nt = dayjs(new Date(this.nt_v)).add(1, 'y');
        this.scroll(this.rt);
        this.removeElm(this.el);
        this.init(this.el, this.nt);
      });
    }
  }

  removeElm(_t) {
    const t = _t;
    while(t.firstChild) {
      t.removeChild(t.firstChild);
    }
  }

  init(_e, _y) {
    console.log('calendar');
    const e = _e;
    const n = _y;
    const data = {
      id: 1,
      schedules: [
        {
          startDay: '2024/1/13',
          atDay: '2024/1/15',
          endDay: '2024/2/5'
        },
        {
          startDay: '2024/2/12',
          atDay: '2024/2/15',
          endDay: '2024/2/18'
        },
        {
          startDay: '2024/4/28',
          atDay: '2024/5/6',
          endDay: '2024/5/13'
        }
      ]
    }
    this.rendarCalendar(e, data, n);
  }

  rendarCalendar(cl, _d, _n) {
    const setDate = _n;
    let setYear = setDate.format('YYYY');
    // 年を設定
    const sl = document.getElementById('year').querySelectorAll('option');
    sl.forEach(_sl => {
      _sl.removeAttribute('selected');
    });
    const selectYear = document.getElementById('year').querySelector('option[value="' + setYear + '"]');
    selectYear.setAttribute("selected", "selected");

    const START_YEAR = '2020';
    const END_YEAR = '2029';
    // if(setYear === START_YEAR) {
    //   document.querySelector('.js--prev').classList.add('is--enable');
    // }
    // else {
    //   document.querySelector('.js--prev').classList.remove('is--enable');
    // }
    if(setYear === END_YEAR) {
      document.querySelector('.js--next').classList.add('is--enable');
    }
    else {
      document.querySelector('.js--next').classList.remove('is--enable');
    }

    let renderPoint = false;
    let day = 1;
    let rows = 1;
    let month = 1;
    let leap = 0;
    const WEEK_ITEMS = ['日','月','火','水','木','金','土',];

    // 閏年かどうかを判定
    if( (setYear % 400) === 0 || (setYear % 4) === 0 && (setYear % 100) !== 0 ) {
      leap = 1;
    }

    for(let k=0; k<13; k++) {
      let clContent = document.createElement('div');
      clContent.classList.add('c-calendar-inner');
      let clBody = document.createElement('table');
      clBody.classList.add('c-calendar-tbl');
      let clMonth = document.createElement('div');
      clMonth.classList.add('c-calendar-month');

      // 翌年１月のみ表示
      if(month === 13) {
        month = 1;
        setYear++;
      }
      clMonth.innerHTML = month + "月";
      clContent.appendChild(clMonth);

      // ひと月を描画
      for(let h=0; h<3; h++) {
        let row = document.createElement('tr');
        row.classList.add('c-calendar-tbl__row');
        // 10日間を描画
        for(let i=0; i<11; i++) {
          let td = document.createElement('td');
          td.classList.add('c-calendar-tbl__cell');
          let clDay = document.createElement('span');
          clDay.classList.add('c-calendar-tbl__daily');

          let date = new Date(setYear, month-1, day);
          let week = date.getDay();
          date = date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate();
          // セルに日付データを持たせる
          td.setAttribute('data-date', date);
          let dayOfWeek = WEEK_ITEMS[week];
          switch (week) {
            case 0:
              td.classList.add('--sun');
              break;
            case 6:
              td.classList.add('--sat');
            default:
              break;
          }
          clDay.innerHTML = day + '/' + dayOfWeek;
          // clDay.innerHTML = date;

          let ds = td.getAttribute('data-date');
          // console.log(ds);
          // JSONデータと比較
          for(let l=0; l<_d.schedules.length; l++) {
            if(ds === _d.schedules[l].startDay) {
              td.classList.add('startDay');
              let tri = document.createElement('span');
              tri.classList.add('handle');
              td.appendChild(tri);
              renderPoint = true;
            }
            else if(ds === _d.schedules[l].atDay) {
              td.classList.add('atDay');
            }
            else if(ds === _d.schedules[l].endDay) {
              renderPoint = false;
              td.classList.add('endDay');
              let tri = document.createElement('span');
              tri.classList.add('handle');
              td.appendChild(tri);
            }
            else if(renderPoint === true && !(ds === _d.schedules[l].startDay) && !(ds === _d.schedules[l].endDay)) {
              td.classList.add('targetDay');
            }
          }

          // セルを空にする
          if(i === 10 && day === 11) {
            td.classList.add('empty');
            day--;
          }
          else if(month === 2 && day === 29 && leap === 0) {
            td.classList.add('empty');
            day--;
          }
          else if(i === 10 && day === 21) {
            td.classList.add('empty');
            day--;
          }
          else if(month === 2 && day === 30) {
            td.classList.add('empty');
            day--;
          }
          else if(month === 2 && day === 31) {
            td.classList.add('empty');
            day--;
          }
          else if(month === 4 && day === 31) {
            td.classList.add('empty');
            day--;
          }
          else if(month === 6 && day === 31) {
            td.classList.add('empty');
            day--;
          }
          else if(month === 9 && day === 31) {
            td.classList.add('empty');
            day--;
          }
          else if(month === 11 && day === 31) {
            td.classList.add('empty');
            day--;
          }

          day++;
          td.appendChild(clDay);
          row.appendChild(td);
        }
        rows++;
        clBody.appendChild(row);
      }
      day = 1;
      rows = 1;

      clContent.appendChild(clBody);
      cl.appendChild(clContent);
      month++;
    }
  }

  scroll(_r) {
    let r = _r.getBoundingClientRect().top;
    const scrollY = window.pageYOffset;
    r = r + scrollY;
    window.scroll({
      top: r,
      behavior: 'smooth'
    });
  }
}
