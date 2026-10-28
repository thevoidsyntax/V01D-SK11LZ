// Measures accessibility facts from the rendered page. Returns plain data.
// The decisions live in a11y_rules.py. hook() runs before the page loads and
// records click listeners; scan() runs once; stop() runs after each Tab press.
({
  hook() {
    const clicks = new WeakSet();
    window.__a11yClicks = clicks;
    const add = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type, ...rest) {
      if (this instanceof Element && /^(click|mousedown|pointerdown)$/.test(type)) clicks.add(this);
      return add.call(this, type, ...rest);
    };
  },

  visible(el) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  },

  label(el) {
    return (el.innerText || el.value || el.getAttribute('aria-label') || '').trim().slice(0, 60);
  },

  ring(cs) {
    return {
      outline: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0,
      look: [cs.boxShadow, cs.borderTopColor, cs.borderTopWidth, cs.backgroundColor,
             cs.color, cs.textDecorationLine].join('|'),
    };
  },

  scan() {
    const meta = document.querySelector('meta[name="viewport"]');
    const all = [...document.querySelectorAll('body *')];
    const focusable = all.filter(el => el.tabIndex >= 0 && !el.disabled && this.visible(el));
    this.rest = new Map(focusable.map(el => [el, this.ring(getComputedStyle(el)).look]));

    const positiveTabindex = all
      .filter(el => parseInt(el.getAttribute('tabindex'), 10) > 0)
      .map(el => ({ tag: el.tagName.toLowerCase(), value: el.tabIndex, text: this.label(el) }));

    const NATIVE = 'a[href],button,input,select,textarea,summary,label,[contenteditable]';
    const clicks = window.__a11yClicks || new WeakSet();
    const pointer = el => el && getComputedStyle(el).cursor === 'pointer';
    const clickNotFocusable = all
      .filter(el => this.visible(el) && el.tabIndex < 0 && !el.closest(NATIVE))
      .filter(el => el.hasAttribute('onclick') || clicks.has(el) || (pointer(el) && !pointer(el.parentElement)))
      .map(el => ({ tag: el.tagName.toLowerCase(), text: this.label(el) }));

    return {
      viewport: meta ? meta.getAttribute('content') || '' : '',
      focusable: focusable.length,
      positiveTabindex,
      clickNotFocusable: clickNotFocusable.slice(0, 12),
    };
  },

  stop() {
    const el = document.activeElement;
    if (!el || el === document.body || el === document.documentElement) return null;
    const now = this.ring(getComputedStyle(el));
    const rest = this.rest.get(el);
    const ring = now.outline || (rest !== undefined && rest !== now.look);

    const r = el.getBoundingClientRect();
    const points = [[r.left + r.width / 2, r.top + r.height / 2], [r.left + 2, r.top + 2],
                    [r.right - 2, r.top + 2], [r.left + 2, r.bottom - 2], [r.right - 2, r.bottom - 2]];
    const seen = points.some(([x, y]) => {
      if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) return false;
      const hit = document.elementFromPoint(x, y);
      return hit && (hit === el || el.contains(hit));
    });

    return { id: this.key(el), tag: el.tagName.toLowerCase(), text: this.label(el), ring, obscured: !seen };
  },

  key(el) {
    if (!this.keys) { this.keys = new WeakMap(); this.next = 0; }
    if (!this.keys.has(el)) this.keys.set(el, ++this.next);
    return this.keys.get(el);
  },
})
