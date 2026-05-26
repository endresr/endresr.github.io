(function () {
  'use strict';
  var cv = document.getElementById('canvas-knitting');
  if (!cv) return;
  var ctx = cv.getContext('2d');

  // 5 rows indexed 0 (bottom) to 4 (top)
  // Each entry is the list of table-column positions (0–20) where nodes exist
  var rowCols = [
    [10, 12, 14],                             // row 0: bottom (3 nodes)
    [3, 5, 7, 9, 11, 13, 15, 17, 19],         // row 1 (9 nodes)
    [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20], // row 2: middle (11 nodes)
    [1, 3, 5, 7, 9, 11, 13, 15, 17],          // row 3 (9 nodes)
    [4, 6, 8]                                 // row 4: top (3 nodes)
  ];

  // Fast column-membership lookup per row
  var rowSets = rowCols.map(function (cols) {
    var s = {}; cols.forEach(function (c) { s[c] = true; }); return s;
  });

  // nodesByCol[c] = list of row indices that have a node at column c
  var nodesByCol = {};
  rowCols.forEach(function (cols, ri) {
    cols.forEach(function (c) {
      if (!nodesByCol[c]) nodesByCol[c] = [];
      nodesByCol[c].push(ri);
    });
  });

  // arrowsByDestCol[tc] = list of arrows {fr, fc, tr, tc} whose tip is at column tc
  // Arrow rule: from (ri, c) go right to (ri+1, c+1) and/or (ri-1, c+1) if they exist
  var arrowsByDestCol = {};
  rowCols.forEach(function (cols, ri) {
    cols.forEach(function (fc) {
      var tc = fc + 1;
      [ri + 1, ri - 1].forEach(function (tr) {
        if (tr >= 0 && tr < rowCols.length && rowSets[tr][tc]) {
          if (!arrowsByDestCol[tc]) arrowsByDestCol[tc] = [];
          arrowsByDestCol[tc].push({ fr: ri, fc: fc, tr: tr, tc: tc });
        }
      });
    });
  });

  var NUM_COLS = 21;
  var STEP = 300, HOLD = 2000, FADE_OUT = 700;
  var CYCLE = NUM_COLS * STEP + HOLD + FADE_OUT;

  var W, H, r, xUnit, pad, yRows;

  function layout() {
    W = cv.offsetWidth; H = cv.offsetHeight;
    cv.width = W; cv.height = H;
    pad = 12;
    xUnit = (W - 2 * pad) / 20;
    r = Math.max(4, Math.min(8, xUnit * 0.37));
    // y positions: row 0 at bottom, row 4 at top
    yRows = [H * 0.90, H * 0.70, H * 0.50, H * 0.30, H * 0.10];
  }

  function drawArrow(fc, fr, tc, tr) {
    var x1 = pad + fc * xUnit, y1 = yRows[fr];
    var x2 = pad + tc * xUnit, y2 = yRows[tr];
    var dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy);
    if (len < 1) return;
    var ux = dx / len, uy = dy / len;
    var sx = x1 + ux * (r + 2), sy = y1 + uy * (r + 2);
    var ex = x2 - ux * (r + 4), ey = y2 - uy * (r + 4);
    ctx.strokeStyle = 'rgba(200,210,195,0.28)';
    ctx.fillStyle   = 'rgba(200,210,195,0.28)';
    ctx.lineWidth   = 1;
    ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
    var bx = ex - ux * 5, by = ey - uy * 5;
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.lineTo(bx + (-uy * 2.5), by + (ux * 2.5));
    ctx.lineTo(bx - (-uy * 2.5), by - (ux * 2.5));
    ctx.closePath(); ctx.fill();
  }

  function drawColumn(c, alpha) {
    ctx.globalAlpha = alpha;
    if (nodesByCol[c]) {
      nodesByCol[c].forEach(function (ri) {
        ctx.beginPath();
        ctx.arc(pad + c * xUnit, yRows[ri], r, 0, Math.PI * 2);
        ctx.fillStyle = '#b0b0b0'; ctx.fill();
      });
    }
    if (arrowsByDestCol[c]) {
      arrowsByDestCol[c].forEach(function (a) { drawArrow(a.fc, a.fr, a.tc, a.tr); });
    }
    ctx.globalAlpha = 1;
  }

  var t0 = null, raf = null, running = false;

  function tick(ts) {
    if (!running) return;
    if (!t0) t0 = ts;
    var t = (ts - t0) % CYCLE;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0a0806'; ctx.fillRect(0, 0, W, H);

    var buildEnd = NUM_COLS * STEP;
    var holdEnd  = buildEnd + HOLD;
    var nDrawn, alpha;

    if (t < buildEnd) {
      nDrawn = Math.min(Math.floor(t / STEP) + 1, NUM_COLS);
      alpha  = 1;
    } else if (t < holdEnd) {
      nDrawn = NUM_COLS;
      alpha  = 1;
    } else {
      nDrawn = NUM_COLS;
      alpha  = Math.max(0, 1 - (t - holdEnd) / FADE_OUT);
    }

    for (var c = 0; c < nDrawn; c++) drawColumn(c, alpha);

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
    ctx.fillStyle = '#0a0806'; ctx.fillRect(0, 0, W, H);
    for (var c = 0; c < NUM_COLS; c++) drawColumn(c, 1);
  } else {
    start();
  }
})();
