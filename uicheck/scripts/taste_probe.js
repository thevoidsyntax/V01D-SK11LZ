// Measures house-style facts from the rendered page. Returns plain data.
// The decisions live in taste_rules.py, so the rules stay testable.
() => {
  const out = {
    typeSizes: [], headings: [], eyebrows: [], gradients: [], hairlines: [],
    monospace: [], tinyCaps: [], pillBars: [], iconCards: [], nestedCards: [],
    emoji: [], indexNumbers: [], shadows: [], sectionGaps: [], trailingArrows: [], midDots: [],
    viewportHeight: window.innerHeight,
  };
  const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F000}-\u{1F0FF}\u{FE0F}]/u;
  const MONO = /mono|menlo|consolas|courier/i;
  const INDEX = /^\s*(0\d(?!\d)|\d{1,2}[.)]|step\s+\d)/i;
  const HEADING = 'h1,h2,h3,h4,h5,h6,[role="heading"]';
  const EXEMPT = 'table,pre,code,kbd,samp,[data-ui],input,select,textarea,button,th,td,tr';

  const visible = el => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 || r.height > 0;
  };
  const hasText = el => [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
  const text = el => (el.innerText || '').trim();
  const cls = el => (typeof el.className === 'string' ? el.className : '').slice(0, 60);

  const els = [...document.querySelectorAll('body *')].filter(visible);

  const sizes = new Set();
  for (const el of els) {
    if (!hasText(el)) continue;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs) sizes.add(Math.round(fs));
  }
  out.typeSizes = [...sizes].sort((a, b) => a - b);

  for (const el of document.querySelectorAll(HEADING)) {
    if (!visible(el)) continue;
    const lh = parseFloat(getComputedStyle(el).lineHeight);
    const r = el.getBoundingClientRect();
    const lines = lh && !isNaN(lh) ? Math.max(1, Math.round(r.height / lh)) : 1;
    out.headings.push({ tag: el.tagName.toLowerCase(), lines, text: text(el).slice(0, 80) });
  }

  for (const el of els) {
    if (!hasText(el)) continue;
    const cs = getComputedStyle(el);
    const fs = parseFloat(cs.fontSize);
    if (fs > 13) continue;
    if (!/uppercase/i.test(cs.textTransform)) continue;
    if (!(parseFloat(cs.letterSpacing) >= 0.5)) continue;
    const next = el.nextElementSibling;
    if (next && next.matches(HEADING)) {
      out.eyebrows.push({ tag: el.tagName.toLowerCase(), fontSize: Math.round(fs), text: text(el).slice(0, 60) });
    }
  }

  for (const el of els) {
    const cs = getComputedStyle(el);
    if (/gradient\(/i.test(cs.backgroundImage)) {
      out.gradients.push({ tag: el.tagName.toLowerCase(), cls: cls(el) });
    }
  }

  for (const el of els) {
    if (el.matches(EXEMPT) || el.closest(EXEMPT)) continue;
    const cs = getComputedStyle(el);
    for (const side of ['Top', 'Right', 'Bottom', 'Left']) {
      const w = parseFloat(cs['border' + side + 'Width']);
      const st = cs['border' + side + 'Style'];
      if (w === 1 && st !== 'none' && st !== 'hidden') {
        out.hairlines.push({ tag: el.tagName.toLowerCase(), cls: cls(el) });
        break;
      }
    }
  }

  for (const el of els) {
    if (el.closest('pre,code,kbd,samp') || !hasText(el)) continue;
    if (MONO.test(getComputedStyle(el).fontFamily)) {
      out.monospace.push({ tag: el.tagName.toLowerCase(), cls: cls(el) });
    }
  }

  for (const el of els) {
    if (el.closest('th,legend') || !hasText(el)) continue;
    const cs = getComputedStyle(el);
    const fs = parseFloat(cs.fontSize);
    if (fs <= 11 && /uppercase/i.test(cs.textTransform)) {
      out.tinyCaps.push({ tag: el.tagName.toLowerCase(), fontSize: Math.round(fs), text: text(el).slice(0, 60) });
    }
  }

  for (const el of els) {
    const cs = getComputedStyle(el);
    const r = parseFloat(cs.borderTopLeftRadius) || 0;
    if (r < 999) continue;
    const blur = /blur/.test(cs.backdropFilter || '');
    if (el.tagName === 'NAV' || blur) {
      out.pillBars.push({ tag: el.tagName.toLowerCase(), cls: cls(el) });
    }
  }

  const cardLike = el => {
    const cs = getComputedStyle(el);
    const pad = parseFloat(cs.paddingTop) || 0;
    const radius = parseFloat(cs.borderTopLeftRadius) || 0;
    const bg = cs.backgroundColor;
    const hasBg = bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent';
    const bw = parseFloat(cs.borderTopWidth) || 0;
    return radius > 0 && pad >= 8 && (hasBg || bw > 0);
  };
  const hasIcon = el => !!el.querySelector('svg') || EMOJI.test(el.innerText || '');

  const groups = new Map();
  for (const el of els) {
    if (!cardLike(el) || !hasIcon(el)) continue;
    const p = el.parentElement;
    if (!p) continue;
    if (!groups.has(p)) groups.set(p, []);
    groups.get(p).push(el);
  }
  for (const [parent, kids] of groups) {
    if (kids.length >= 3) out.iconCards.push({ count: kids.length, cls: cls(parent) });
  }

  for (const el of els) {
    if (!cardLike(el)) continue;
    for (const d of el.querySelectorAll('*')) {
      if (cardLike(d)) {
        out.nestedCards.push({ tag: el.tagName.toLowerCase(), cls: cls(el) });
        break;
      }
    }
  }

  for (const el of els) {
    if (!hasText(el)) continue;
    const t = text(el);
    if (EMOJI.test(t)) out.emoji.push({ tag: el.tagName.toLowerCase(), text: t.slice(0, 40) });
  }

  for (const el of els) {
    if (!hasText(el)) continue;
    const t = text(el);
    if (t.length <= 30 && INDEX.test(t)) {
      out.indexNumbers.push({ tag: el.tagName.toLowerCase(), text: t.slice(0, 40) });
    }
  }

  for (const el of els) {
    const cs = getComputedStyle(el);
    if (!cs.boxShadow || cs.boxShadow === 'none') continue;
    if (cs.position === 'fixed' || cs.position === 'sticky') continue;
    out.shadows.push({ tag: el.tagName.toLowerCase(), cls: cls(el) });
  }

  for (const el of els) {
    if (!el.matches('a,button,[role="button"],[role="link"]')) continue;
    const t = text(el);
    if (/(→|->|⟶)\s*$/.test(t)) out.trailingArrows.push({ tag: el.tagName.toLowerCase(), text: t.slice(0, 60) });
  }

  for (const el of els) {
    const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('');
    if (!own.includes('·')) continue;
    const t = text(el);
    if (t.length <= 120 && t.split('·').length >= 3) out.midDots.push({ tag: el.tagName.toLowerCase(), text: t.slice(0, 80) });
  }

  const root = document.querySelector('main') || document.body;
  const kids = [...root.children].filter(visible);
  for (let i = 1; i < kids.length; i++) {
    const prev = kids[i - 1].getBoundingClientRect();
    const cur = kids[i].getBoundingClientRect();
    const gap = Math.round(cur.top - prev.bottom);
    if (gap > 0) out.sectionGaps.push({ px: gap, tag: kids[i].tagName.toLowerCase() });
  }

  return out;
}
