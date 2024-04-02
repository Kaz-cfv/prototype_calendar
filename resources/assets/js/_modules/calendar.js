class Calender {
  constructor() {
    this.el = document.getElementById('c-calendar');
    if(!this.el) {
      return;
    }
    this.init(this.el);
  }

  init(e) {
    console.log('calendar');
    const _e = e;
    const data = {
      schedules: [
        {
          startDay: '2024/1/12',
          atDay: '2024/1/14',
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
    this.rendarCalendar(_e, data);
  }

  rendarCalendar(cl, d) {
    const now = dayjs(new Date());
    let nowYear = now.format('YYYY');
    // let nowYear = 2011;
    const selectYear = document.getElementById('year');
    const option = document.createElement('option');
    option.text = nowYear;
    selectYear.appendChild(option);

    let renderPoint = false;
    let day = 1;
    let rows = 1;
    let month = 1;
    let leap = 0;
    // 閏年かどうかを判定
    if( (nowYear % 400) === 0 || (nowYear % 4) === 0 && (nowYear % 100) !== 0 ) {
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
        nowYear++;
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

          let date = new Date(nowYear, month-1, day);
          date = date.getFullYear() + '/' + (date.getMonth()+1) + '/' + date.getDate();
          // セルに日付データを持たせる
          td.setAttribute('data-date', date);
          clDay.innerHTML = day;

          let ds = td.getAttribute('data-date');
          // console.log(ds);
          // JSONデータと比較
          for(let l=0; l<d.schedules.length; l++) {
            if(ds === d.schedules[l].startDay) {
              td.classList.add('startDay');
              let tri = document.createElement('span');
              tri.classList.add('triangle');
              td.appendChild(tri);
              renderPoint = true;
            }
            else if(ds === d.schedules[l].atDay) {
              td.classList.add('atDay');
            }
            else if(ds === d.schedules[l].endDay) {
              renderPoint = false;
              td.classList.add('endDay');
              let tri = document.createElement('span');
              tri.classList.add('triangle');
              td.appendChild(tri);
            }
            else if(renderPoint === true && !(ds === d.schedules[l].startDay) && !(ds === d.schedules[l].endDay)) {
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
}
