import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { faCaretLeft, faCaretRight, faTintSlash } from '@fortawesome/free-solid-svg-icons';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { DatePipe } from '@angular/common';
import { CATCH_ERROR_VAR } from '@angular/compiler/src/output/output_ast';

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
  public calendarPositionClass;

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

  constructor() { }

  ngOnInit(): void {
    this.initialFrom = this.from;
    this.initialTo = this.to;

    this.minYear = this.minDate.getFullYear();
    this.minMonth = this.minDate.getMonth();

    this.maxYear = this.maxDate.getFullYear();
    this.maxMonth = this.maxDate.getMonth();

    this.selectYear = this.from.getFullYear();
    this.selectMonth = this.from.getMonth();


    if (this.calendarPosition === "top"){
      this.calendarPositionClass = "calendar-outer-top";
    } else {
      this.calendarPositionClass = "calendar-outer-bottom";
    }
    this.createDateJson();
    this.createCalendar();
    this.createShowDate();
    this.redrawCss();
  }

  onFocus() {
    this.displayCalendar = true;
  }

  createDateJson() {
    this.dateJson = {};
    let initialDate = new Date(this.minDate.getFullYear(), this.minDate.getMonth()-1, this.minDate.getDate());
    let endDate = new Date(this.maxDate.getFullYear(), this.maxDate.getMonth() + 1, this.maxDate.getDate());

    while (initialDate <= endDate) {
      if (this.dateJson[initialDate.getFullYear()] === undefined) {
        this.dateJson[initialDate.getFullYear()] = {};
      }

      if (this.dateJson[initialDate.getFullYear()][initialDate.getMonth()] === undefined) {
        this.dateJson[initialDate.getFullYear()][initialDate.getMonth()] = [];
      }

      if (initialDate < this.minDate || this.maxDate < initialDate) {
        this.dateJson[initialDate.getFullYear()][initialDate.getMonth()].push(
          { year: initialDate.getFullYear(), month: initialDate.getMonth(), week: initialDate.getDay(), date: initialDate.getDate(), class: "disable", status: false}
        )
      } else {
        this.dateJson[initialDate.getFullYear()][initialDate.getMonth()].push(
          { year: initialDate.getFullYear(), month: initialDate.getMonth(), week: initialDate.getDay(), date: initialDate.getDate(), class: "default", status: true}
        )
      }
      initialDate.setDate(initialDate.getDate() + 1);
    }
  }

  public showDate: string;

  public showCalendar = [];
  createCalendar() {
    this.showCalendar = [];
    let selectCalender = this.dateJson[this.selectYear][this.selectMonth];
    let beforeCalender = [];
    let afterCalender = [];

    let startWeek = selectCalender[0]["week"];
    let endWeek = selectCalender[selectCalender.length - 1]["week"];

    let afterMonth = (this.selectMonth == 11 ? this.dateJson[this.selectYear + 1]["0"] : this.dateJson[this.selectYear][this.selectMonth + 1]);

    let beforeMonth = (this.selectMonth == 0 ? this.dateJson[this.selectYear - 1]["11"] : this.dateJson[this.selectYear][this.selectMonth - 1]);

    for (var i = 0; i < startWeek; i++) {
      beforeCalender.push(
        beforeMonth[beforeMonth.length - (startWeek - i)]
      )
    }

    for (var i = 0;; i++) {
      afterCalender.push(
        afterMonth[i]
      )
      if ((beforeCalender.length + selectCalender.length + afterCalender.length) == 42) {
        break;
      }
    }


    let mergeCalender = beforeCalender.concat(selectCalender);
    mergeCalender = mergeCalender.concat(afterCalender);


    var i = 0;
    this.showCalendar[i] = [];
    for (let cal of mergeCalender) {
      this.showCalendar[i].push(cal);

      if (cal["week"] === 6) {
        i++;
        this.showCalendar[i] = [];
      }
    }
  }

  public selectFrom = new Date(this.from);
  public selectTo = new Date(this.to);

  redrawCss() {
    let startYear = this.from.getFullYear();
    let startMonth = this.from.getMonth();
    let startDate = this.from.getDate();

    if (this.to === undefined) {
      this.dateJson[startYear][startMonth][startDate-1]["class"] = "active";
      this.createCalendar();
      return null;
    }

    let endYear = this.to.getFullYear();
    let endMonth = this.to.getMonth();
    let endDate = this.to.getDate();


    while (true) {
      if (this.dateJson[startYear][startMonth][startDate-1] === undefined) {
        startMonth++;
        startDate = 1;
        if (this.dateJson[startYear][startMonth] == undefined) {
          startMonth = 0;
          startYear++;
        }
      }

      this.dateJson[startYear][startMonth][startDate-1]["class"] = "active";

      if (startYear == endYear && startMonth == endMonth && startDate == endDate) {
        break;
      } else {
        startDate++;
      }
    }
    this.createCalendar();
  }

  resetDate() {
    this.createDateJson();
    this.from = undefined;
    this.to = undefined;
  }


  selectDate(year, month, date) {
    let tmp = new Date(year, month, date);
    if (this.from && this.to) {
      this.resetDate()
      this.from = tmp;
      this.redrawCss();
    } else if (this.from) {
      if (tmp < this.from) {
        this.to = new Date(this.from.getFullYear(), this.from.getMonth(), this.from.getDate());
        this.from = tmp;
        this.redrawCss();
      } else {
        this.to = tmp;
        this.redrawCss();
      }
    } else {
      this.from = tmp;
      this.redrawCss();
    }
    this.createShowDate();
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

  public errorMessage = "";

  validDate(from, to){
    let flag = true;
    if (from === undefined || to === undefined) {
      this.errorMessage = "フォーマット不正。YYYY/MM/DD - YYYY/MM/DDの形式で入力してください"
      flag = false;
    } else {
      from = from.replace(/ /g, "");
      to = to.replace(/ /, "");
      if (from.split("/").length !== 3 || to.split("/").length !== 3) {
        this.errorMessage = "フォーマット不正。YYYY/MM/DD - YYYY/MM/DDの形式で入力してください"
        flag = false;
      } else if (isNaN(from.replace(/\//g, "")) || isNaN(to.replace(/\//g, ""))) {
        this.errorMessage = "入力値不正。数字以外の文字が入力されています"
        flag = false;
      } else {
        let fromDate = new Date(from);
        let toDate = new Date(to);

        if (fromDate.toString() === "Invalid Date" || toDate.toString() === "Invalid Date") {
          this.errorMessage = "日付入力不正。存在しない年月日が入力されています。"
          flag = false;
        } else if (fromDate > toDate) {
          this.errorMessage = "入力値不正。開始より終了日時が先になっています。"
          flag = false;
        } else if (fromDate < this.minDate) {
          let minDate = new DatePipe('ja-JP').transform(this.minDate, 'yyyy/MM/dd');
          this.errorMessage = `入力値不正。${minDate}より前の日付は指定できません。`;
          flag = false;
        } else if (this.maxDate < toDate) {
          let maxDate = new DatePipe('ja-JP').transform(this.maxDate, 'yyyy/MM/dd');
          this.errorMessage = `入力値不正。${maxDate}以降の日付は指定できません。`;
          flag = false;
        } else {
          this.errorMessage = "";
          this.resetDate();
          this.from = undefined;
          this.to = undefined;
          this.selectDate(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
          this.selectDate(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
          this.changeMonth(this.from.getMonth());
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
    this.createShowDate();
  }

  public errorCalMessage;

  emitDate() {
    if (this.to === undefined || this.from === undefined) {
      this.errorCalMessage = "日付を選択してください。"
    } else {
      this.errorCalMessage = "";
      this.errorMessage = "";
      this.displayCalendar = false;
      this.eventEmitter.emit({
          from: this.from,
          to: this.to
        });
    }
  }
}
