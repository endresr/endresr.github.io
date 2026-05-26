(function () {
  'use strict';
  var cv = document.getElementById('canvas-ordstige');
  if (!cv) return;
  var ctx = cv.getContext('2d');

  var WORDS    = ['SQL', 'OSLO', 'LØSE'];
  var NUM_ROWS = 3;
  var MAX_COLS = 4;

  var C = {
    bg:        '#0a0806',
    cell:      '#f7f3ea',
    highlight: '#e9c25a',
    correct:   '#6fae5b',
    text:      '#1a1410',
    correctTxt:'#ffffff'
  };

  var LETTER_DELAY = 130;
  var ROW_PAUSE    = 200;
  var CORRECT_STEP = 80;

  var totalCells   = WORDS.reduce(function (s, w) { return s + w.length; }, 0); // 11

  var T_TYPING  = 500;
  var T_FILLED  = T_TYPING  + (NUM_ROWS * MAX_COLS * LETTER_DELAY) + (NUM_ROWS - 1) * ROW_PAUSE;
  var T_CORRECT = T_FILLED  + 600;
  var T_HOLD_C  = T_CORRECT + totalCells * CORRECT_STEP;
  var T_FADE    = T_HOLD_C  + 1200;
  var CYCLE     = T_FADE    + 600;

  var W, H, cellSize, cellGap, startX, startY;

  function layout() {
    W = cv.offsetWidth; H = cv.offsetHeight;
    cv.width = W; cv.height = H;
    cellGap = 4;
    var pad = 12;
    var maxCellW = (W - 2 * pad - (MAX_COLS - 1) * cellGap) / MAX_COLS;
    var maxCellH = (H - 2 * pad - (NUM_ROWS - 1) * cellGap) / NUM_ROWS;
    cellSize = Math.max(16, Math.min(40, Math.min(maxCellW, maxCellH)));
    startX = (W - (MAX_COLS * cellSize + (MAX_COLS - 1) * cellGap)) / 2;
    startY = (H - (NUM_ROWS * cellSize + (NUM_ROWS - 1) * cellGap)) / 2;
  }

  function letterTime(r, c) {
    return r * (MAX_COLS * LETTER_DELAY + ROW_PAUSE) + c * LETTER_DELAY;
  }

  function rrect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function drawGrid(t, alpha) {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = alpha;

    var typingT  = t - T_TYPING;
    var correctT = t - T_CORRECT;
    var cellIdx  = 0;

    ctx.font = 'bold ' + Math.round(cellSize * 0.52) + 'px Georgia';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (var r = 0; r < NUM_ROWS; r++) {
      var word = WORDS[r];
      for (var c = 0; c < word.length; c++) {
        var x = startX + c * (cellSize + cellGap);
        var y = startY + r * (cellSize + cellGap);

        var isVisible = t >= T_TYPING && typingT >= letterTime(r, c);
        var isCorrect = t >= T_HOLD_C ||
                        (t >= T_CORRECT && cellIdx <= Math.floor(correctT / CORRECT_STEP));

        ctx.fillStyle = isCorrect ? C.correct : (c === 0 ? C.highlight : C.cell);
        rrect(x, y, cellSize, cellSize, 2);
        ctx.fill();

        if (isVisible) {
          ctx.fillStyle = isCorrect ? C.correctTxt : C.text;
          ctx.fillText(word[c], x + cellSize / 2, y + cellSize / 2);
        }
        cellIdx++;
      }
    }
    ctx.globalAlpha = 1;
  }

  var t0 = null, raf = null, running = false;

  function tick(ts) {
    if (!running) return;
    if (!t0) t0 = ts;
    var t = (ts - t0) % CYCLE;
    var alpha = t >= T_FADE ? Math.max(0, 1 - (t - T_FADE) / 600) : 1;
    drawGrid(t, alpha);
    raf = requestAnimationFrame(tick);
  }

  function start() { if (!running) { running = true; t0 = null; raf = requestAnimationFrame(tick); } }
  function stop()  { running = false; if (raf) { cancelAnimationFrame(raf); raf = null; } }

  new IntersectionObserver(function (es) {
    es[0].isIntersecting ? start() : stop();
  }, { threshold: 0.1 }).observe(cv);

  document.addEventListener('visibilitychange', function () {
    document.hidden ? stop() : start();
  });

  window.addEventListener('resize', function () { layout(); });

  layout();
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    drawGrid(T_HOLD_C, 1);
  } else {
    start();
  }
})();
