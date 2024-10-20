const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');
const form = document.getElementById('coordinateForm');
const tableBody = document.querySelector('#inputTable tbody');

// 複数の点を保存する配列
let points = [];

// 「行を追加」ボタンのイベント
document.getElementById('addRowButton').addEventListener('click', () => {
  const rowCount = tableBody.rows.length + 1; // 現在の行数+1
  const newRow = tableBody.insertRow(); // 新しい行を追加
  
  // 行番号セル
  const cell1 = newRow.insertCell(0);
  cell1.textContent = rowCount-1;

  // X座標セル
  const cell2 = newRow.insertCell(1);
  cell2.innerHTML = '<input type="number" step = "0.001" name="xCoord[]" required>';

  // Y座標セル
  const cell3 = newRow.insertCell(2);
  cell3.innerHTML = '<input type="number" step = "0.001" name="yCoord[]" required>';
});

// 「行を削除」ボタンのイベント
document.getElementById('deleteRowButton').addEventListener('click', () => {
  const rowCount = tableBody.rows.length - 1;
  if(rowCount > 1){
    const newRow = tableBody.deleteRow(rowCount);
  }
});


// フォーム送信時のイベント
form.addEventListener('submit', (event) => {
  event.preventDefault(); // ページリロードを防ぐ

  points = []; // 配列を初期化

  // 入力された座標をすべて取得して配列に保存
  const xAxis = document.getElementsByName('xAxis[]');
  const yAxis = document.getElementsByName('yAxis[]');
  const xCoords = document.getElementsByName('xCoord[]');
  const yCoords = document.getElementsByName('yCoord[]');
  for (let i = 0; i < xCoords.length; i++) {
    const x = parseFloat(xCoords[i].value);
    const y = parseFloat(yCoords[i].value);

    if (!isNaN(x) && !isNaN(y)) {
      points.push({ x, y });
      console.log(x+","+y);
    }
  }
  
  drawAxis(xAxis[0].value,yAxis[0].value);
  drawPoints();
});

//「一次近似」ボタンのイベント
document.getElementById('linearFitting').addEventListener('click', () => {
  if(points.length > 1){
    const { a, b } = calculateLeastSquares(points);
    console.log(`回帰直線: y = ${a}x + ${b}`);
    drawLine(a, b);
  }
});

// 最小二乗法で係数aとbを計算する関数
function calculateLeastSquares(data) {
  const n = data.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

  data.forEach(({ x, y }) => {
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  });

  const a = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const b = (sumY - a * sumX) / n;

  return { a, b };
}


// 点を描画する関数
//center = [canvas.width/2,canvas.height/2];
center = [10,490];
scale = 100;//-10~490 -> -1~49
function drawPoints() {
  
  var maxXY = 0;
  
  for (let i = 0; i < points.length; i++) {
    const cood = points[i];
//    console.log(cood);
    if(cood.x > maxXY){
      maxXY = cood.x;
    }
    if(cood.y > maxXY){
      maxXY = cood.y;
    }
  }
//  console.log(maxXY);
  
  scale = 400 / ((maxXY - maxXY%1.25)/1.25 + 1);
//  console.log(scale);
  
  points.forEach(point => {
    const canvasX = center[0] + point.x*scale;
    const canvasY = center[1] - point.y*scale;
    ctx.beginPath();
    ctx.arc(canvasX,canvasY,5,0,Math.PI*2);
    ctx.fill();
  });
}


// 回帰直線を描画する関数
function drawLine(a, b) {
  console.log(scale);
  const xStart = 0 + center[0];
  const yStart = center[1] - (a * 0 + b)*scale;
  const xEnd = canvas.width + center[0];
  const yEnd = center[1] - (a * canvas.width/scale + b)*scale;
  
  ctx.beginPath();
  ctx.moveTo(xStart, yStart);
  ctx.lineTo(xEnd, yEnd);
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  ctx.font = "20px serif";
  ctx.fillText("y= "+a+" x + "+b,40,50);
}

//軸を描画する関数
function drawAxis(xAxis,yAxis){
  ctx.clearRect(0, 0, canvas.width, canvas.height); // キャンバスをクリア
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.moveTo(0,center[1]);
  ctx.lineTo(canvas.width,center[1]);
  ctx.moveTo(center[0],0);
  ctx.lineTo(center[0],canvas.height);
  ctx.strokeStyle="black";
  ctx.stroke();
  
  ctx.moveTo(canvas.width,center[1]);
  ctx.lineTo(canvas.width - 10,center[1] - 7);
  ctx.lineTo(canvas.width - 10,center[1] + 7);
  ctx.moveTo(center[0],0);
  ctx.lineTo(center[0] - 7,10);
  ctx.lineTo(center[0] + 7,10);
  ctx.fill();
  
  ctx.font = "20px serif";
  ctx.beginPath();
  ctx.fillText(xAxis,420,480);
  ctx.fillText(yAxis,20,20);
}
