import { Component, OnInit, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-range-date-picker',
  templateUrl: './range-date-picker.component.html',
  styleUrls: ['./range-date-picker.component.scss']
})
export class RangeDatePickerComponent implements OnInit {
  @Input() public minDate;
  @Input() public maxDate;
  @Input() public from;
  @Input() public to;
  @Input() public calendarPosition;
  @Input() public title;
  @Input() public today;
  public calendarPositionClass;
  public errorStatus = false;

  public initialFrom;
  public initialTo;

  public minYear;
  public minMonth;

  public maxYear;
  public maxMonth;

  public selectYear;
  public selectMonth;


  public dateJson = {};

  public pagingLeft = faCaretLeft;
  public pagingRight = faCaretRight;
  public calendarIcon = faCalendarAlt;

  public displayCalendar = false;

  @Output() public eventEmitter = new EventEmitter<object>();

  constructor(private elementRef: ElementRef) { }


  // 完全にバグっている
  // @HostListener('document:click', ['$event'])
  // onClickHtmlElement(event: MouseEvent, targetElement: HTMLElement) {
  //   let calendarSelector = this.elementRef.nativeElement.querySelector('#calendar');
  //   let calendarIconSelector = this.elementRef.nativeElement.querySelector('#calendar-icon');
  //   if (calendarSelector && calendarIconSelector) {
  //     if (!calendarSelector.contains(event.target) && !calendarIconSelector.contains(event.target)) {
  //       console.log(event.target);
  //       this.cancel();
  //     }
  //   }
  // }

  ngOnInit(): void {
    this.initialFrom = this.from;
    this.initialTo = this.to;

    this.minYear = this.minDate ? this.minDate.getFullYear() : undefined;
    this.minMonth = this.minDate ? this.minDate.getMonth() : undefined;

    this.maxYear = this.maxDate ? this.maxDate.getFullYear() : undefined;
    this.maxMonth = this.maxDate ? this.maxDate.getMonth() : undefined;

    this.selectYear = this.from.getFullYear();
    this.selectMonth = this.from.getMonth();


    if (this.calendarPosition === "top"){
      this.calendarPositionClass = "calendar-outer-top";
    } else {
      this.calendarPositionClass = "calendar-outer-bottom";
    }
    this.createCalendar();
    this.createShowDate();
  }

  onFocus() {
    this.displayCalendar = true;
  }

  public showDate: string;
  public showCalendar = [];
  createCalendar() {
    this.showCalendar = [];
    let calendarList = [];

    let baseDate = new Date(this.selectYear, this.selectMonth);

    calendarList.unshift(baseDate);
    for (let week = baseDate.getDay(); week != 0;) {
      calendarList.unshift(new Date(calendarList[0].getFullYear(), calendarList[0].getMonth(), calendarList[0].getDate()-1));
      week = calendarList[0].getDay();
    }

    while (calendarList.length < 42) {
      const index = calendarList.length - 1;
      calendarList.push(new Date(calendarList[index].getFullYear(), calendarList[index].getMonth(), calendarList[index].getDate()+1));
    }


    var i = 0;
    this.showCalendar[i] = [];
    for (let cal of calendarList) {
      let calClass = "default";
      let calStatus = true;
      if (this.minDate && cal < this.minDate) {
        calClass = "disable";
        calStatus = false;
      } 
      if (this.maxDate && cal > this.maxDate) {
        calClass = "disable";
        calStatus = false;
      }

      if (this.from) {
        const formattedFrom = new DatePipe('ja-jp').transform(this.from, 'yyyyMMdd');
        const formattedCal = new DatePipe('ja-JP').transform(cal, 'yyyyMMdd');
        if (formattedFrom === formattedCal) {
          calClass = "active";
        }
      }

      if (this.to) {
        const formattedFrom = new DatePipe('ja-jp').transform(this.from, 'yyyyMMdd');
        const formattedTo = new DatePipe('ja-JP').transform(this.to, 'yyyyMMdd');
        const formattedCal = new DatePipe('ja-JP').transform(cal, 'yyyyMMdd');

        if (formattedFrom <= formattedCal && formattedCal <= formattedTo) {
          calClass = "active";
        }
      }

      this.showCalendar[i].push({
        year: cal.getFullYear(),
        month: cal.getMonth(),
        date: cal.getDate(),
        class: calClass,
        status: calStatus
      });

      if (cal.getDay() === 6) {
        i++;
        this.showCalendar[i] = [];
      }

    }
  }


  public selectFrom = new Date(this.from);
  public selectTo = new Date(this.to);

  resetDate() {
    this.from = undefined;
    this.to = undefined;
    this.errorCalMessage = "";
    this.errorMessage = "";
    this.errorStatus = false;
  }


  selectDate(year, month, date) {
    let tmp = new Date(year, month, date);
    if (this.from && this.to) {
      this.resetDate()
      this.from = tmp;
    } else if (this.from) {
      if (tmp < this.from) {
        this.to = new Date(this.from.getFullYear(), this.from.getMonth(), this.from.getDate());
        this.from = tmp;
      } else {
        this.to = tmp;
      }
    } else {
      this.from = tmp;
    }
    this.createCalendar();
    this.createShowDate();
    this.displayCalendar = true;
  }

  changeMonth(month) {
    if (month == 12) {
      this.selectYear++;
      this.selectMonth = 0;
    } else if (month == -1) {
      this.selectYear--;
      this.selectMonth = 11;
    } else {
      this.selectMonth = month;
    }
    this.createCalendar();
  }

  selectToday() {
    this.from = this.today;
    this.to = this.today;
    this.selectYear = this.from.getFullYear();
    this.changeMonth(this.from.getMonth());
    this.createCalendar();
    this.createShowDate();
  }

  public errorMessage = "";

  validDate(from, to){
    let flag = true;
    if (from === undefined || to === undefined) {
      this.errorMessage = "YYYY/MM/DD - YYYY/MM/DDの形式で入力してください"
      flag = false;
    } else {
      from = from.replace(/ /g, "");
      to = to.replace(/ /, "");
      if (from.split("/").length !== 3 || to.split("/").length !== 3) {
        this.errorMessage = "YYYY/MM/DD - YYYY/MM/DDの形式で入力してください"
        flag = false;
      } else if (isNaN(from.replace(/\//g, "")) || isNaN(to.replace(/\//g, ""))) {
        this.errorMessage = "数字以外の文字が入力されています"
        flag = false;
      } else {
        let fromDate = new Date(from);
        let toDate = new Date(to);

        if (fromDate.toString() === "Invalid Date" || toDate.toString() === "Invalid Date") {
          this.errorMessage = "存在しない年月日が入力されています。"
          flag = false;
        } else if (fromDate > toDate) {
          this.errorMessage = "開始より終了日時が先になっています。"
          flag = false;
        } else if (this.minDate && fromDate < this.minDate) {
          let minDate = new DatePipe('ja-JP').transform(this.minDate, 'yyyy/MM/dd');
          this.errorMessage = `${minDate}より前の日付は指定できません。`;
          flag = false;
        } else if (this.maxDate && this.maxDate < toDate) {
          let maxDate = new DatePipe('ja-JP').transform(this.maxDate, 'yyyy/MM/dd');
          this.errorMessage = `${maxDate}以降の日付は指定できません。`;
          flag = false;
        } else {
          this.errorMessage = "";
          this.resetDate();
          this.from = undefined;
          this.to = undefined;
          this.selectDate(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
          this.selectDate(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
        }
      }
    }

    return flag;
  }

  setDate($event) {
    let tmp = $event.split("-");
    let from = tmp[0];
    let to = tmp[1];
    if (this.validDate(from, to)) {
      this.emitDate();
      this.errorStatus = false;
    } else {
      this.errorStatus = true;
    }
  }

  createShowDate() {
    if (this.from === undefined && this.to === undefined) {
      return null;
    }

    let from;
    let to;

    if (this.from !== undefined && this.to === undefined) {
      try {
        from = new DatePipe('ja-JP').transform(this.from, 'yyyy/MM/dd');
      }
      catch(e) {
        from = this.from;
      }
      to = "";
    } else {
      try {
        from = new DatePipe('ja-JP').transform(this.from, 'yyyy/MM/dd');
      }
      catch(e) {
        from = this.from;
      }

      try {
        to =  new DatePipe('ja-JP').transform(this.to, 'yyyy/MM/dd');
      }
      catch(e) {
        to = this.to;
      }
    }

    this.showDate = `${from} - ${to}`
  }

  cancel() {
    this.from = this.initialFrom;
    this.to = this.initialTo;
    this.displayCalendar = false;
    this.selectYear = this.from.getFullYear();
    this.changeMonth(this.from.getMonth())
    this.createShowDate();
  }

  changeDisplay() {
    if (this.displayCalendar) {
      this.cancel();
    } else {
      this.initialFrom = this.from;
      this.initialTo = this.to;
      this.displayCalendar = true;
    }
  }

  public errorCalMessage;

  emitDate() {
    if (this.to === undefined && this.from === undefined) {
      this.errorCalMessage = "日付を選択してください。"
    } else {
      if (this.to === undefined) {
        this.to = this.from;
      }
      this.displayCalendar = false;
      this.eventEmitter.emit({
          from: this.from,
          to: this.to
      });
      this.selectYear = this.from.getFullYear();
      this.changeMonth(this.from.getMonth());
      this.createShowDate();
      this.errorStatus = false;
    }
  }
}
