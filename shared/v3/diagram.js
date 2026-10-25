/* Study Console v3 diagram helpers (window.StudyDiagram).

   One drawing standard for every console:
   - Colours come only from the diagram tokens (--sc-dg-1..6, --sc-dg-ink, --sc-dg-edge,
     --sc-dg-fill) and are written as inline style, so a diagram follows the theme with no
     redraw and still renders if a console stylesheet is missing.
   - Text is never smaller than 13px at the diagram's natural width; on narrow screens the
     drawing scales to at most minScale (default 0.7) and the figure scrolls beyond that.
   - Every diagram has an accessible name and a visible legend when colour carries meaning.

   Usage
     var d = StudyDiagram.create(host, { width: 560, height: 220, label: 'Root election' });
     var a = d.node({ x: 40, y: 40, w: 140, h: 56, label: 'SW1', sub: 'Root bridge', tone: 1 });
     var b = d.node({ x: 360, y: 40, w: 140, h: 56, label: 'SW2', tone: 2 });
     d.edge(a, b, { label: 'Gi0/1', arrow: true });
     d.legend([{ tone: 1, label: 'Root' }, { tone: 2, label: 'Non-root' }]);

   Tones: 1 teal, 2 violet, 3 amber, 4 rose, 5 blue, 6 green; 0 is neutral. */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var MIN_TEXT = 13;
  var uid = 0;

  function tone(t) { return t ? 'var(--sc-dg-' + t + ')' : 'var(--sc-dg-edge)'; }
  function svgEl(name, attrs, style) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) if (attrs[k] !== undefined && attrs[k] !== null) n.setAttribute(k, attrs[k]);
    if (style) n.setAttribute('style', style);
    return n;
  }
  function text(parent, x, y, str, o) {
    o = o || {};
    var size = Math.max(MIN_TEXT, o.size || 14);
    var t = svgEl('text', { x: x, y: y, 'text-anchor': o.anchor || 'middle', 'dominant-baseline': 'middle' },
      'fill:' + (o.color || 'var(--sc-dg-ink)') + ';font-family:' + (o.mono ? 'var(--sc-mono)' : 'var(--sc-sans)') +
      ';font-size:' + size + 'px;font-weight:' + (o.weight || 500));
    t.textContent = str;
    parent.appendChild(t);
    return t;
  }
  function center(n) { return { x: n.x + n.w / 2, y: n.y + n.h / 2 }; }
  // Point where the segment from the node centre towards (tx, ty) leaves the node's box.
  function boxExit(n, tx, ty) {
    var c = center(n), dx = tx - c.x, dy = ty - c.y;
    if (!dx && !dy) return c;
    var sx = dx ? (n.w / 2) / Math.abs(dx) : Infinity, sy = dy ? (n.h / 2) / Math.abs(dy) : Infinity, s = Math.min(sx, sy);
    return { x: c.x + dx * s, y: c.y + dy * s };
  }

  function create(host, opts) {
    opts = opts || {};
    var w = opts.width || 560, h = opts.height || 240, id = 'scdg' + (++uid);
    var fig = document.createElement('figure');
    fig.className = 'sc-diagram';
    fig.style.margin = '0';
    fig.style.overflowX = 'auto';
    var svg = svgEl('svg', { viewBox: '0 0 ' + w + ' ' + h, width: w, height: h, role: 'img', 'aria-labelledby': id + '-t' });
    // Scale down with the column, but never below minScale (text stays >= ~0.7 x 13px); scroll past that.
    svg.style.minWidth = Math.round(w * (opts.minScale || 0.7)) + 'px';
    var title = svgEl('title', { id: id + '-t' });
    title.textContent = opts.label || 'Diagram';
    svg.appendChild(title);
    var defs = svgEl('defs');
    svg.appendChild(defs);
    if (opts.background !== false) svg.appendChild(svgEl('rect', { x: 0, y: 0, width: w, height: h, rx: 12 }, 'fill:var(--sc-dg-fill)'));
    var edges = svgEl('g'), nodes = svgEl('g');
    svg.appendChild(edges); svg.appendChild(nodes);
    fig.appendChild(svg);
    if (opts.caption) {
      var cap = document.createElement('figcaption');
      cap.className = 'sc-muted';
      cap.style.fontSize = 'var(--sc-fs-sm)';
      cap.textContent = opts.caption;
      fig.appendChild(cap);
    }
    if (host) host.appendChild(fig);

    var markers = {};
    function marker(t) {
      var key = 'm' + (t || 0);
      if (markers[key]) return markers[key];
      var mid = id + '-' + key;
      var m = svgEl('marker', { id: mid, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' });
      m.appendChild(svgEl('path', { d: 'M0 0 10 5 0 10z' }, 'fill:' + tone(t)));
      defs.appendChild(m);
      return (markers[key] = 'url(#' + mid + ')');
    }

    var api = {
      svg: svg, figure: fig,
      node: function (o) {
        var g = svgEl('g');
        var shape = o.shape === 'circle'
          ? svgEl('ellipse', { cx: o.x + o.w / 2, cy: o.y + o.h / 2, rx: o.w / 2, ry: o.h / 2 })
          : svgEl('rect', { x: o.x, y: o.y, width: o.w, height: o.h, rx: o.radius === undefined ? 10 : o.radius });
        shape.setAttribute('style', 'fill:var(--sc-surface,#fff);stroke:' + tone(o.tone) + ';stroke-width:' + (o.strong ? 2.5 : 1.6) +
          (o.dashed ? ';stroke-dasharray:6 4' : ''));
        g.appendChild(shape);
        var c = center(o);
        if (o.label) text(g, c.x, o.sub ? c.y - 9 : c.y, o.label, { weight: 650, mono: o.mono, size: o.size });
        if (o.sub) text(g, c.x, c.y + 11, o.sub, { size: 13, color: 'var(--sc-muted)' });
        nodes.appendChild(g);
        return { x: o.x, y: o.y, w: o.w, h: o.h, el: g };
      },
      edge: function (a, b, o) {
        o = o || {};
        var ca = center(a), cb = center(b), p = boxExit(a, cb.x, cb.y), q = boxExit(b, ca.x, ca.y);
        var line = svgEl('line', { x1: p.x, y1: p.y, x2: q.x, y2: q.y },
          'stroke:' + tone(o.tone) + ';stroke-width:' + (o.strong ? 2.5 : 1.6) + (o.dashed ? ';stroke-dasharray:6 4' : ''));
        if (o.arrow) line.setAttribute('marker-end', marker(o.tone));
        if (o.both) line.setAttribute('marker-start', marker(o.tone));
        edges.appendChild(line);
        if (o.label) {
          var mx = (p.x + q.x) / 2, my = (p.y + q.y) / 2 - (o.offset === undefined ? 12 : o.offset);
          var lw = Math.max(28, o.label.length * 7.6 + 12);
          edges.appendChild(svgEl('rect', { x: mx - lw / 2, y: my - 11, width: lw, height: 22, rx: 6 }, 'fill:var(--sc-dg-fill)'));
          text(edges, mx, my, o.label, { size: 13, mono: o.mono !== false, color: 'var(--sc-dg-ink)' });
        }
        return line;
      },
      text: function (x, y, str, o) { return text(nodes, x, y, str, o); },
      legend: function (items) {
        var ul = document.createElement('ul');
        ul.className = 'sc-legend';
        items.forEach(function (it) {
          var li = document.createElement('li'), sw = document.createElement('i');
          sw.style.background = it.line ? 'transparent' : tone(it.tone);
          if (it.line) { sw.style.height = '0'; sw.style.borderTop = '2px ' + (it.dashed ? 'dashed ' : 'solid ') + tone(it.tone); sw.style.borderRadius = '0'; }
          sw.setAttribute('aria-hidden', 'true');
          li.appendChild(sw);
          li.appendChild(document.createTextNode(it.label));
          ul.appendChild(li);
        });
        fig.appendChild(ul);
        return ul;
      }
    };
    return api;
  }

  window.StudyDiagram = { create: create, tone: tone, MIN_TEXT: MIN_TEXT };
})();
