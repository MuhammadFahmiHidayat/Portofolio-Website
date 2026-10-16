// Portfolio interactions: mobile menu, project filter + detail, tabs, lightbox.
(function () {
  'use strict';

  // ---------- mobile menu ----------
  var nav = document.querySelector('.nav');
  var menuBtn = document.querySelector('.menu-btn');
  if (nav && menuBtn) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---------- tabs ----------
  document.querySelectorAll('[data-tabs]').forEach(function (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    function select(tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t); });
      t.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        var next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
        select(next);
        next.focus();
      });
    });
  });

  // ---------- projects: filter + detail ----------
  var dataEl = document.getElementById('projects-data');
  if (dataEl) {
    var projects = JSON.parse(dataEl.textContent);
    var cards = Array.prototype.slice.call(document.querySelectorAll('.pcard'));
    var $ = function (id) { return document.getElementById(id); };
    function show(i) {
      var p = projects[i];
      $('d-img').src = p.img;
      $('d-img').alt = p.alt;
      $('d-org').textContent = p.org;
      $('d-title').textContent = p.title;
      $('d-q').textContent = p.q;
      $('d-d').textContent = p.d;
      $('d-m').textContent = p.m;
      $('d-r').textContent = p.r;
      $('d-tags').innerHTML = '';
      p.tags.forEach(function (t) {
        var s = document.createElement('span');
        s.className = 'tag';
        s.textContent = t;
        $('d-tags').appendChild(s);
      });
      var link = $('d-case');
      if (p.caseId) { link.hidden = false; link.href = 'case-studies.html#' + p.caseId; } else { link.hidden = true; }
      cards.forEach(function (c) { c.setAttribute('aria-pressed', String(Number(c.dataset.idx) === i)); });
    }
    cards.forEach(function (c) {
      c.addEventListener('click', function () {
        show(Number(c.dataset.idx));
        var detail = $('detail');
        if (detail && detail.getBoundingClientRect().top < 0) detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
    document.querySelectorAll('[data-filter]').forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.dataset.filter;
        document.querySelectorAll('[data-filter]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        cards.forEach(function (c) { c.hidden = !(f === 'all' || c.dataset.cat === f); });
      });
    });
    var start = Number(new URLSearchParams(location.search).get('p'));
    show(start >= 0 && start < projects.length ? start : 0);
  }

  // ---------- lightbox ----------
  var lb = document.getElementById('lightbox');
  if (lb) {
    var img = lb.querySelector('img');
    var title = lb.querySelector('.t');
    var cap = lb.querySelector('.c');
    var sup = lb.querySelector('.s');
    var pos = lb.querySelector('.pos');
    var closeBtn = lb.querySelector('[data-close]');
    var items = [];
    var idx = 0;
    var opener = null;
    function render() {
      var it = items[idx];
      img.src = it.dataset.full;
      img.alt = it.dataset.title;
      title.textContent = it.dataset.title;
      cap.textContent = it.dataset.cap || '';
      cap.hidden = !it.dataset.cap;
      sup.innerHTML = '';
      if (it.dataset.sup) {
        var b = document.createElement('b');
        b.textContent = 'Supports: ';
        sup.appendChild(b);
        sup.appendChild(document.createTextNode(it.dataset.sup));
      }
      sup.hidden = !it.dataset.sup;
      pos.textContent = (idx + 1) + ' / ' + items.length;
    }
    function open(item) {
      var group = item.closest('[data-lb-group]');
      items = Array.prototype.slice.call(group.querySelectorAll('[data-full]'));
      idx = items.indexOf(item);
      opener = item;
      render();
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }
    function close() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
      if (opener) opener.focus();
    }
    function step(d) { idx = (idx + d + items.length) % items.length; render(); }
    document.querySelectorAll('[data-full]').forEach(function (it) {
      it.addEventListener('click', function () { open(it); });
    });
    lb.querySelector('[data-prev]').addEventListener('click', function () { step(-1); });
    lb.querySelector('[data-next]').addEventListener('click', function () { step(1); });
    closeBtn.addEventListener('click', close);
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }
})();
