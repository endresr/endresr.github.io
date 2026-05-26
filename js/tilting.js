(function () {
  'use strict';
  var cv = document.getElementById('canvas-tilting');
  if (!cv) return;
  var ctx = cv.getContext('2d');

  var COL = { lg:'#404040', dg:'#b0b0b0', r:'#a83030', b:'#4d7fcc' };
  var XC  = { Cb:'#5580dd', Cr:'#cc3333', Cbl:'#999' };

  var frames = [
    {top:[{c:'dg'},{c:'dg'},{c:'dg'},{c:'dg'},{c:'dg'},{c:'dg'},{c:'dg'}],
     mid:[{c:'dg'},{c:'lg'},{c:'dg'},{c:'lg'},{c:'lg'},{c:'dg'},{c:'lg'},{c:'dg'}],
     bot:[{c:'dg'},{c:'lg'},{c:'lg'},{c:'dg'},{c:'lg'},{c:'dg'},{c:'lg'},{c:'lg'},{c:'dg'}]},
    {top:[{c:'dg',x:'Cb'},{c:'dg',x:'Cb'},{c:'r'},{c:'dg'},{c:'dg'},{c:'dg'},{c:'dg'}],
     mid:[{c:'dg'},{c:'lg'},{c:'dg'},{c:'lg'},{c:'lg'},{c:'dg'},{c:'lg'},{c:'dg'}],
     bot:[{c:'dg'},{c:'lg'},{c:'lg'},{c:'dg'},{c:'lg'},{c:'dg'},{c:'lg'},{c:'lg'},{c:'dg'}]},
    {top:[{c:'dg',x:'Cb'},{c:'dg',x:'Cb'},{c:'r',x:'Cb'},{c:'r'},{c:'dg'},{c:'dg'},{c:'dg'}],
     mid:[{c:'dg'},{c:'lg'},{c:'dg'},{c:'lg'},{c:'lg'},{c:'dg'},{c:'lg'},{c:'dg',x:'Cr'}],
     bot:[{c:'dg'},{c:'lg'},{c:'lg'},{c:'dg'},{c:'lg'},{c:'dg'},{c:'lg'},{c:'lg'},{c:'dg',x:'Cr'}]},
    {top:[{c:'dg',x:'Cb'},{c:'dg',x:'Cb'},{c:'r',x:'Cb'},{c:'r',x:'Cb'},{c:'r'},{c:'dg'},{c:'dg'}],
     mid:[{c:'dg'},{c:'lg'},{c:'dg'},{c:'lg'},{c:'lg'},{c:'dg'},{c:'lg'},{c:'dg',x:'Cr'}],
     bot:[{c:'dg'},{c:'lg'},{c:'lg'},{c:'dg'},{c:'lg'},{c:'dg'},{c:'lg'},{c:'lg'},{c:'dg',x:'Cr'}]},
    {top:[{c:'dg',x:'Cb'},{c:'dg',x:'Cb'},{c:'r',x:'Cb'},{c:'r',x:'Cb'},{c:'r'},{c:'b'},{c:'dg',x:'Cr'}],
     mid:[{c:'dg'},{c:'lg'},{c:'dg'},{c:'lg'},{c:'lg'},{c:'dg'},{c:'lg'},{c:'dg',x:'Cr'}],
     bot:[{c:'dg'},{c:'lg'},{c:'lg'},{c:'dg'},{c:'lg'},{c:'dg'},{c:'lg'},{c:'lg'},{c:'dg',x:'Cr'}]},
    {top:[{c:'dg',x:'Cb'},{c:'dg',x:'Cb'},{c:'r',x:'Cb'},{c:'r',x:'Cb'},{c:'r'},{c:'b'},{c:'b',x:'Cr'}],
     mid:[{c:'dg'},{c:'lg'},{c:'dg'},{c:'lg'},{c:'lg'},{c:'dg'},{c:'lg'},{c:'dg',x:'Cr'}],
     bot:[{c:'dg'},{c:'lg'},{c:'lg'},{c:'dg'},{c:'lg'},{c:'dg'},{c:'lg'},{c:'lg'},{c:'dg',x:'Cr'}]},
    {top:[{c:'dg',x:'Cbl'},{c:'dg',x:'Cbl'},{c:'r',x:'Cb'},{c:'r',x:'Cb'},{c:'r'},{c:'b'},{c:'b',x:'Cr'}],
     mid:[{c:'b'},{c:'lg'},{c:'dg'},{c:'lg'},{c:'lg'},{c:'dg'},{c:'lg'},{c:'dg',x:'Cr'}],
     bot:[{c:'dg'},{c:'lg'},{c:'lg'},{c:'dg'},{c:'lg'},{c:'dg'},{c:'lg'},{c:'lg'},{c:'dg',x:'Cr'}]},
    {top:[{c:'dg',x:'Cbl'},{c:'dg',x:'Cbl'},{c:'r',x:'Cb'},{c:'r',x:'Cb'},{c:'r'},{c:'b'},{c:'b',x:'Cr'}],
     mid:[{c:'b',x:'Cr'},{c:'lg'},{c:'dg'},{c:'lg'},{c:'lg'},{c:'dg'},{c:'lg'},{c:'dg',x:'Cr'}],
     bot:[{c:'b'},{c:'lg'},{c:'lg'},{c:'dg'},{c:'lg'},{c:'dg'},{c:'lg'},{c:'lg'},{c:'dg',x:'Cr'}]},
    {top:[{c:'dg',x:'Cbl'},{c:'dg',x:'Cbl'},{c:'r',x:'Cb'},{c:'r',x:'Cb'},{c:'r'},{c:'b'},{c:'b',x:'Cr'}],
     mid:[{c:'b',x:'Cr'},{c:'lg'},{c:'dg',x:'Cr'},{c:'lg'},{c:'lg'},{c:'r'},{c:'lg'},{c:'dg',x:'Cr'}],
     bot:[{c:'b'},{c:'lg'},{c:'lg'},{c:'dg',x:'Cr'},{c:'lg'},{c:'r'},{c:'lg'},{c:'lg'},{c:'dg',x:'Cr'}]}
  ];

  var HOLD = 1800, FADE = 400, CYCLE = frames.length * (HOLD + FADE);
  var W, H, r, u, pad, yT, yM, yB;

  function layout() {
    W = cv.offsetWidth; H = cv.offsetHeight;
    cv.width = W; cv.height = H;
    r   = Math.max(7, Math.min(11, W / 46));
    pad = r + 12;
    u   = (W - 2 * pad) / 16;
    yT  = H * 0.27;
    yM  = H * 0.56;
    yB  = H * 0.85;
  }

  function nx(row, i) {
    return pad + (row === 0 ? 2*i+2 : row === 1 ? 2*i+1 : 2*i) * u;
  }
  function ny(row) { return [yT, yM, yB][row]; }

  function drawArrow(x1, y1, x2, y2) {
    var dx = x2-x1, dy = y2-y1, len = Math.sqrt(dx*dx+dy*dy);
    if (len < 1) return;
    var ux = dx/len, uy = dy/len;
    ctx.beginPath();
    ctx.moveTo(x1 + ux*(r+2), y1 + uy*(r+2));
    ctx.lineTo(x2 - ux*(r+4), y2 - uy*(r+4));
    ctx.stroke();
    var ex = x2-ux*(r+4), ey = y2-uy*(r+4);
    var bx = ex-ux*5, by = ey-uy*5;
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.lineTo(bx + (-uy*2.5), by + (ux*2.5));
    ctx.lineTo(bx - (-uy*2.5), by - (ux*2.5));
    ctx.closePath(); ctx.fill();
  }

  function drawCross(cx, cy, type) {
    var s = Math.max(5, r * 0.65);
    ctx.strokeStyle = XC[type]; ctx.fillStyle = XC[type]; ctx.lineWidth = 1.5;
    if (type === 'Cr') {
      ctx.beginPath();
      ctx.moveTo(cx-s,cy-s); ctx.lineTo(cx+s,cy+s);
      ctx.moveTo(cx+s,cy-s); ctx.lineTo(cx-s,cy+s);
      ctx.stroke();
    } else {
      ctx.beginPath(); ctx.arc(cx, cy, s, 0, Math.PI*2); ctx.stroke();
      var d = s * 0.62;
      ctx.beginPath();
      ctx.moveTo(cx-d,cy-d); ctx.lineTo(cx+d,cy+d);
      ctx.moveTo(cx+d,cy-d); ctx.lineTo(cx-d,cy+d);
      ctx.stroke();
    }
  }

  function drawFrame(fr) {
    ctx.strokeStyle = 'rgba(200,210,195,0.28)';
    ctx.fillStyle   = 'rgba(200,210,195,0.28)';
    ctx.lineWidth   = 1;
    var i;
    for (i = 0; i < 8; i++) { drawArrow(nx(2,i),ny(2),nx(1,i),ny(1)); drawArrow(nx(1,i),ny(1),nx(2,i+1),ny(2)); }
    for (i = 0; i < 7; i++) { drawArrow(nx(1,i),ny(1),nx(0,i),ny(0)); drawArrow(nx(0,i),ny(0),nx(1,i+1),ny(1)); }
    [fr.top, fr.mid, fr.bot].forEach(function(row, ri) {
      row.forEach(function(nd, i) {
        var x = nx(ri, i), y = ny(ri);
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI*2);
        ctx.fillStyle = COL[nd.c]; ctx.fill();
        if (nd.x) drawCross(x, y - r - 8, nd.x);
      });
    });
  }

  var t0 = null, raf = null, running = false;

  function tick(ts) {
    if (!running) return;
    if (!t0) t0 = ts;
    var t = (ts - t0) % CYCLE;
    var period = HOLD + FADE;
    var fi = Math.floor(t / period) % frames.length;
    var ft = t - fi * period;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0a0806'; ctx.fillRect(0, 0, W, H);

    if (ft <= HOLD) {
      drawFrame(frames[fi]);
    } else {
      var a = (ft - HOLD) / FADE, fn = (fi + 1) % frames.length;
      ctx.globalAlpha = 1 - a; drawFrame(frames[fi]);
      ctx.globalAlpha = a;     drawFrame(frames[fn]);
      ctx.globalAlpha = 1;
    }
    raf = requestAnimationFrame(tick);
  }

  function start() { if (!running) { running = true; t0 = null; raf = requestAnimationFrame(tick); } }
  function stop()  { running = false; if (raf) { cancelAnimationFrame(raf); raf = null; } }

  new IntersectionObserver(function(es) {
    es[0].isIntersecting ? start() : stop();
  }, { threshold: 0.1 }).observe(cv);

  document.addEventListener('visibilitychange', function() {
    document.hidden ? stop() : start();
  });

  window.addEventListener('resize', function() { layout(); });

  layout();
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    ctx.fillStyle = '#0a0806'; ctx.fillRect(0, 0, W, H);
    drawFrame(frames[0]);
  } else {
    start();
  }
})();
