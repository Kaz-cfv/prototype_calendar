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
    this.rendarCalendar(_e);
  }

  rendarCalendar(cl) {
    console.log('111');
  }
}
