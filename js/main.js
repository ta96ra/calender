'use strict';

console.clear(); //コンソールをクリア（空）にする

{ 
  // 現在の年、月を取得
  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth();
  

  // 先月の末日周辺を配列で取得するための関数
  function getCalendarHead(){
    const dates = [];
    // 定数dateに末日周辺の日付を代入
    const d = new Date(year, month, 0).getDate();
    // 定数dに先月の末日を代入
    const n = new Date(year,month,1).getDay();
    // 定数nに今月1日の曜日(数値)を代入
    // この数値は、末日周辺の表示する日付の個数と等しくなる
    for(let i = 0; i < n; i++){
      dates.unshift({
        date: d - i,  //末日-0日,末日 -1日,…末日-n-1日
        isToday:false, //本日かどうか
        isDisabled:true,  //今月でないかどうか
      });
    }
    return dates;
  }

  // 今月の1日から末日を配列で取得するための関数
  function getCalendarBody(){
    const dates = []; 
    // 定数datesに取得した1日〜末日までの日付を代入する
    // ※ date:日付、 day:曜日であるため、datesにしてる
    const lastDate = new Date(year, month + 1,0).getDate();
    // lastDate = 末日。月の末日は翌月の0日を指定すれば取得できる
    for(let i = 1; i <= lastDate; i++){
      dates.push({
        date:i,
        isToday:false,
        isDisabled:false,
      }); 
      //配列datesに末尾にiを追加していくループさせる
      //  →当月の１日から末日が取得できる
    }
    if(year === today.getFullYear() && month === today.getMonth()){
      // 定数yearとmonthが現在年、月であれば、
      dates[today.getDate() -1].isToday = true;
      // 1日〜末日までの配列から現在日-1番目のオブジェクトのisTodayプロパティをtrueにする
    }

    return dates;
  }

  // 翌月分の１日周辺の日付を取得するための関数
  function getCalendarTail(){
    const dates = [];
    // 定数datesに翌日分の日付を配列で取得
    const lastDay = new Date(year, month + 1 ,0).getDay();
    // 定数lastDayに翌月1日の曜日を数値で代入
    // ループ処理で7-lastDayは翌月分の最後の日となる
    for(let i = 1; i < 7 - lastDay; i++){
      dates.push({
        date: i,
        isToday: false,
        isDisabled: true,
      });
    }
    return dates;
  }

  // + prev,nextボタンを押した時にcreateCalendar()されるのでそれを打ち消すための処理
  function clearCalendar(){
    const tbody = document.querySelector('tbody');
    // tbodyを取得

    while(tbody.firstChild){
      tbody.removeChild(tbody.firstChild);
      // tbodyの子要素(tr)の一番初めをなくなるまで削除していく
    }
  }

  // カレンダーの年月を表示するための処理
  function renderTitle(){
    const title = `${year}/${String(month + 1).padStart(2,'0')}`;
    // 定数titleにyear/monthとの表示であるが、monthはpadStartを使って2桁表示でする。それに満たなかったら、0で埋めるとする。
    // padStartは文字列にしか使えないため、(month + 1)をstringにする必要がある。
    document.getElementById('title').textContent = title;
  }

    // 全ての日付を統合した後、週ごとに配列を組み直し、カレンダーを描画するための関数 
  function renderWeeks(){
     // 全ての日付を統合する処理
     const dates =[
      ...getCalendarHead(), //先月分
      ...getCalendarBody(), //今月分
      ...getCalendarTail(), //翌月分
      // 定数datesにカレンダーで表示される全ての日付を統合する
      // スプレッド構文を使えば、配列が要素になるので、一つの配列の中に全ての日付を統合できる
      // 現在は日付の配列のそれぞれの日にオブジェクトが入っている状態
    ];
    const weeks = [];
    // 定数weeksに週ごとの配列を代入する
    const weeksCount = dates.length / 7;
    // 定数weeksCountに、カレンダーに表示される総日数/7とすることで、定数weeksを作る個数を設定する

    for(let i = 0; i < weeksCount; i++){
      weeks.push(dates.splice(0,7));
      // カレンダーに表示される全ての日数datesからsplice()を使って0番目から7個削除するとともに、削除された数値を配列で取得し、配列weeksの末尾に追加する
      // この動作をweekCountの回数だけ実施する
    }
    // これにより、週ごとに配列を組み直すことができた。
    // = 配列weeksにspliceで取得した１週間分の配列をweekCount個作ることができた。
    // 配列weeks＝[[1週目],[2週目],…[weekCount週目]]

    
    // 取得した配列を描画するための処理
    weeks.forEach(week =>{
      // 配列weeksのn週目の要素をweekとして以下の処理を展開
      const tr = document.createElement('tr');
      // tr要素の作成
      week.forEach(date =>{
        // n週目配列weekに対して日となる要素(オブジェクト)をdateとし、展開
        const td = document.createElement('td');
        // td要素の作成
        td.textContent = date.date;
        // tdのテキストを配列weekの要素(オブジェクト)のdateプロパティーとするとする
        if(date.isToday){
          td.classList.add('today');
          // オブジェクトdateのistodayプロパティがtrueなる、tdにtodayクラスをつける
        }
        if(date.isDisabled){
          td.classList.add('disabled');
          // オブジェクトdateのisDisabledプロパティがtrueならdisabledクラスをつける
        }
        tr.appendChild(td);
        // trの子クラス末尾にtdを追加する
      });
      document.querySelector('tbody').appendChild(tr);
      // tbodyの子クラス末尾にtrクラスをつける
    });
    // これで配列で得た結果を今月分のカレンダーを表示するとともに、本日と今月以外の日付を区別することができた。
  }


 
  // カレンダー全てを描画するための関数
  function createCalendar(){
    
    clearCalendar();
      // + prev,nextボタンを押した時にcreateCalendar()されるのでそれを打ち消すための関数
    renderTitle();  
      // カレンダーの年月を表示するための関数
    renderWeeks();
    //  カレンダーの中身(tbody)を描画するための関数
  }

  // #prevを押した時に前月を表示する処理
  document.getElementById('prev').addEventListener('click', () =>{
    month--;
    if(month < 0){
      year --;
      month = 11;
    }
    createCalendar();
  });

  // #nextボタンを押した時翌月を表示する処理
  document.getElementById('next').addEventListener('click', () =>{
    month++;
    if(month > 11){
      year ++;
      month = 0;
    }
    createCalendar();
  });

  // todayボタンを押した時に今月を表示する処理
  document.getElementById('today').addEventListener('click', () =>{
    year = today.getFullYear();
    month = today.getMonth();
    createCalendar();
  });

  createCalendar();


}