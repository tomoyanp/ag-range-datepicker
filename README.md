# Angular用範囲指定可能なDatePicker

## Demo Play

![Demo](https://raw.githubusercontent.com/wiki/tomoyanp/ag-range-datepicker/image/rangeDatePicker.gif)

## Requirements
* angular2 (version >= 8)
* fontawesome

## How to use
好きなところに配置してカスタムディレクティブとして呼ぶだけ

```
<app-range-date-picker [title]="title" [minDate]="minDate" [maxDate]="maxDate" [from]="from" [to]="to" calendarPosition="bottom" (eventEmitter)="onEvent($event)"></app-range-date-picker>
```

### Pass Valiables 
* title = 表示タイトル
* minDate = 指定出来る最小値  
* maxDate = 指定出来る最大値  
* from = 開始時点の初期値  
* to = 終了時点の初期値  
* callendarPosition = カレンダーを表示する位置（top or bottom)
* eventEmitter = 範囲指定後にオブジェクトを受け取るメソッドを指定。

$eventのデータ構造は下記
```
$event = {
    from: Date,
    to: Date
}
```

### Validation Check
1. 日付の存在チェック
2. フォーマットチェック（YYYY/MM/DD）
3. 論理チェック（From > To == NG）
