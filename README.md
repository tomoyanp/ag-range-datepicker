# Angular用範囲指定可能なDatePicker

## Demo Play

![Demo](https://raw.githubusercontent.com/wiki/tomoyanp/ag-range-datepicker/image/rangeDatePicker.gif)

## Requirements
* angular2 (version >= 8)
* fontawesome

## How to use
好きなところに配置してカスタムディレクティブとして呼ぶだけ

```
<app-range-date-picker [title]="title" [minDate]="minDate" [maxDate]="maxDate" [from]="from" [to]="to" [today]="today" calendarPosition="bottom" (eventEmitter)="onEvent($event)"></app-range-date-picker>
```

### Pass Valiables 
* [require] from = 開始時点の初期値  
* [require] to = 終了時点の初期値  
* [require] today = 今日の日付
* [require] eventEmitter = 範囲指定後にオブジェクトを受け取るメソッドを指定。
* [optional] title = 表示タイトル
* [optional] minDate = 指定出来る最小値  
* [optional] maxDate = 指定出来る最大値  
* [optional] callendarPosition = カレンダーを表示する位置（top or bottom)

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
