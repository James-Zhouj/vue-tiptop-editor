import { defineComponent as Y, ref as Jr, onMounted as co, onBeforeUnmount as uo, h as $t, reactive as ru, markRaw as iu, getCurrentInstance as ou, watchEffect as su, nextTick as au, unref as lu, Teleport as cu, customRef as uu, createVNode as B } from "vue";
function Z(n) {
  this.content = n;
}
Z.prototype = {
  constructor: Z,
  find: function(n) {
    for (var e = 0; e < this.content.length; e += 2)
      if (this.content[e] === n)
        return e;
    return -1;
  },
  get: function(n) {
    var e = this.find(n);
    return e == -1 ? void 0 : this.content[e + 1];
  },
  update: function(n, e, t) {
    var r = t && t != n ? this.remove(t) : this, i = r.find(n), o = r.content.slice();
    return i == -1 ? o.push(t || n, e) : (o[i + 1] = e, t && (o[i] = t)), new Z(o);
  },
  remove: function(n) {
    var e = this.find(n);
    if (e == -1)
      return this;
    var t = this.content.slice();
    return t.splice(e, 2), new Z(t);
  },
  addToStart: function(n, e) {
    return new Z([n, e].concat(this.remove(n).content));
  },
  addToEnd: function(n, e) {
    var t = this.remove(n).content.slice();
    return t.push(n, e), new Z(t);
  },
  addBefore: function(n, e, t) {
    var r = this.remove(e), i = r.content.slice(), o = r.find(n);
    return i.splice(o == -1 ? i.length : o, 0, e, t), new Z(i);
  },
  forEach: function(n) {
    for (var e = 0; e < this.content.length; e += 2)
      n(this.content[e], this.content[e + 1]);
  },
  prepend: function(n) {
    return n = Z.from(n), n.size ? new Z(n.content.concat(this.subtract(n).content)) : this;
  },
  append: function(n) {
    return n = Z.from(n), n.size ? new Z(this.subtract(n).content.concat(n.content)) : this;
  },
  subtract: function(n) {
    var e = this;
    n = Z.from(n);
    for (var t = 0; t < n.content.length; t += 2)
      e = e.remove(n.content[t]);
    return e;
  },
  get size() {
    return this.content.length >> 1;
  }
};
Z.from = function(n) {
  if (n instanceof Z)
    return n;
  var e = [];
  if (n)
    for (var t in n)
      e.push(t, n[t]);
  return new Z(e);
};
function Ta(n, e, t) {
  for (let r = 0; ; r++) {
    if (r == n.childCount || r == e.childCount)
      return n.childCount == e.childCount ? null : t;
    let i = n.child(r), o = e.child(r);
    if (i == o) {
      t += i.nodeSize;
      continue;
    }
    if (!i.sameMarkup(o))
      return t;
    if (i.isText && i.text != o.text) {
      for (let s = 0; i.text[s] == o.text[s]; s++)
        t++;
      return t;
    }
    if (i.content.size || o.content.size) {
      let s = Ta(i.content, o.content, t + 1);
      if (s != null)
        return s;
    }
    t += i.nodeSize;
  }
}
function Ea(n, e, t, r) {
  for (let i = n.childCount, o = e.childCount; ; ) {
    if (i == 0 || o == 0)
      return i == o ? null : { a: t, b: r };
    let s = n.child(--i), a = e.child(--o), l = s.nodeSize;
    if (s == a) {
      t -= l, r -= l;
      continue;
    }
    if (!s.sameMarkup(a))
      return { a: t, b: r };
    if (s.isText && s.text != a.text) {
      let c = 0, u = Math.min(s.text.length, a.text.length);
      for (; c < u && s.text[s.text.length - c - 1] == a.text[a.text.length - c - 1]; )
        c++, t--, r--;
      return { a: t, b: r };
    }
    if (s.content.size || a.content.size) {
      let c = Ea(s.content, a.content, t - 1, r - 1);
      if (c)
        return c;
    }
    t -= l, r -= l;
  }
}
class x {
  constructor(e, t) {
    if (this.content = e, this.size = t || 0, t == null)
      for (let r = 0; r < e.length; r++)
        this.size += e[r].nodeSize;
  }
  nodesBetween(e, t, r, i = 0, o) {
    for (let s = 0, a = 0; a < t; s++) {
      let l = this.content[s], c = a + l.nodeSize;
      if (c > e && r(l, i + a, o || null, s) !== !1 && l.content.size) {
        let u = a + 1;
        l.nodesBetween(Math.max(0, e - u), Math.min(l.content.size, t - u), r, i + u);
      }
      a = c;
    }
  }
  descendants(e) {
    this.nodesBetween(0, this.size, e);
  }
  textBetween(e, t, r, i) {
    let o = "", s = !0;
    return this.nodesBetween(e, t, (a, l) => {
      a.isText ? (o += a.text.slice(Math.max(e, l) - l, t - l), s = !r) : a.isLeaf ? (i ? o += typeof i == "function" ? i(a) : i : a.type.spec.leafText && (o += a.type.spec.leafText(a)), s = !r) : !s && a.isBlock && (o += r, s = !0);
    }, 0), o;
  }
  append(e) {
    if (!e.size)
      return this;
    if (!this.size)
      return e;
    let t = this.lastChild, r = e.firstChild, i = this.content.slice(), o = 0;
    for (t.isText && t.sameMarkup(r) && (i[i.length - 1] = t.withText(t.text + r.text), o = 1); o < e.content.length; o++)
      i.push(e.content[o]);
    return new x(i, this.size + e.size);
  }
  cut(e, t = this.size) {
    if (e == 0 && t == this.size)
      return this;
    let r = [], i = 0;
    if (t > e)
      for (let o = 0, s = 0; s < t; o++) {
        let a = this.content[o], l = s + a.nodeSize;
        l > e && ((s < e || l > t) && (a.isText ? a = a.cut(Math.max(0, e - s), Math.min(a.text.length, t - s)) : a = a.cut(Math.max(0, e - s - 1), Math.min(a.content.size, t - s - 1))), r.push(a), i += a.nodeSize), s = l;
      }
    return new x(r, i);
  }
  cutByIndex(e, t) {
    return e == t ? x.empty : e == 0 && t == this.content.length ? this : new x(this.content.slice(e, t));
  }
  replaceChild(e, t) {
    let r = this.content[e];
    if (r == t)
      return this;
    let i = this.content.slice(), o = this.size + t.nodeSize - r.nodeSize;
    return i[e] = t, new x(i, o);
  }
  addToStart(e) {
    return new x([e].concat(this.content), this.size + e.nodeSize);
  }
  addToEnd(e) {
    return new x(this.content.concat(e), this.size + e.nodeSize);
  }
  eq(e) {
    if (this.content.length != e.content.length)
      return !1;
    for (let t = 0; t < this.content.length; t++)
      if (!this.content[t].eq(e.content[t]))
        return !1;
    return !0;
  }
  get firstChild() {
    return this.content.length ? this.content[0] : null;
  }
  get lastChild() {
    return this.content.length ? this.content[this.content.length - 1] : null;
  }
  get childCount() {
    return this.content.length;
  }
  child(e) {
    let t = this.content[e];
    if (!t)
      throw new RangeError("Index " + e + " out of range for " + this);
    return t;
  }
  maybeChild(e) {
    return this.content[e] || null;
  }
  forEach(e) {
    for (let t = 0, r = 0; t < this.content.length; t++) {
      let i = this.content[t];
      e(i, r, t), r += i.nodeSize;
    }
  }
  findDiffStart(e, t = 0) {
    return Ta(this, e, t);
  }
  findDiffEnd(e, t = this.size, r = e.size) {
    return Ea(this, e, t, r);
  }
  findIndex(e, t = -1) {
    if (e == 0)
      return pr(0, e);
    if (e == this.size)
      return pr(this.content.length, e);
    if (e > this.size || e < 0)
      throw new RangeError(`Position ${e} outside of fragment (${this})`);
    for (let r = 0, i = 0; ; r++) {
      let o = this.child(r), s = i + o.nodeSize;
      if (s >= e)
        return s == e || t > 0 ? pr(r + 1, s) : pr(r, i);
      i = s;
    }
  }
  toString() {
    return "<" + this.toStringInner() + ">";
  }
  toStringInner() {
    return this.content.join(", ");
  }
  toJSON() {
    return this.content.length ? this.content.map((e) => e.toJSON()) : null;
  }
  static fromJSON(e, t) {
    if (!t)
      return x.empty;
    if (!Array.isArray(t))
      throw new RangeError("Invalid input for Fragment.fromJSON");
    return new x(t.map(e.nodeFromJSON));
  }
  static fromArray(e) {
    if (!e.length)
      return x.empty;
    let t, r = 0;
    for (let i = 0; i < e.length; i++) {
      let o = e[i];
      r += o.nodeSize, i && o.isText && e[i - 1].sameMarkup(o) ? (t || (t = e.slice(0, i)), t[t.length - 1] = o.withText(t[t.length - 1].text + o.text)) : t && t.push(o);
    }
    return new x(t || e, r);
  }
  static from(e) {
    if (!e)
      return x.empty;
    if (e instanceof x)
      return e;
    if (Array.isArray(e))
      return this.fromArray(e);
    if (e.attrs)
      return new x([e], e.nodeSize);
    throw new RangeError("Can not convert " + e + " to a Fragment" + (e.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""));
  }
}
x.empty = new x([], 0);
const ci = { index: 0, offset: 0 };
function pr(n, e) {
  return ci.index = n, ci.offset = e, ci;
}
function Cr(n, e) {
  if (n === e)
    return !0;
  if (!(n && typeof n == "object") || !(e && typeof e == "object"))
    return !1;
  let t = Array.isArray(n);
  if (Array.isArray(e) != t)
    return !1;
  if (t) {
    if (n.length != e.length)
      return !1;
    for (let r = 0; r < n.length; r++)
      if (!Cr(n[r], e[r]))
        return !1;
  } else {
    for (let r in n)
      if (!(r in e) || !Cr(n[r], e[r]))
        return !1;
    for (let r in e)
      if (!(r in n))
        return !1;
  }
  return !0;
}
class z {
  constructor(e, t) {
    this.type = e, this.attrs = t;
  }
  addToSet(e) {
    let t, r = !1;
    for (let i = 0; i < e.length; i++) {
      let o = e[i];
      if (this.eq(o))
        return e;
      if (this.type.excludes(o.type))
        t || (t = e.slice(0, i));
      else {
        if (o.type.excludes(this.type))
          return e;
        !r && o.type.rank > this.type.rank && (t || (t = e.slice(0, i)), t.push(this), r = !0), t && t.push(o);
      }
    }
    return t || (t = e.slice()), r || t.push(this), t;
  }
  removeFromSet(e) {
    for (let t = 0; t < e.length; t++)
      if (this.eq(e[t]))
        return e.slice(0, t).concat(e.slice(t + 1));
    return e;
  }
  isInSet(e) {
    for (let t = 0; t < e.length; t++)
      if (this.eq(e[t]))
        return !0;
    return !1;
  }
  eq(e) {
    return this == e || this.type == e.type && Cr(this.attrs, e.attrs);
  }
  toJSON() {
    let e = { type: this.type.name };
    for (let t in this.attrs) {
      e.attrs = this.attrs;
      break;
    }
    return e;
  }
  static fromJSON(e, t) {
    if (!t)
      throw new RangeError("Invalid input for Mark.fromJSON");
    let r = e.marks[t.type];
    if (!r)
      throw new RangeError(`There is no mark type ${t.type} in this schema`);
    return r.create(t.attrs);
  }
  static sameSet(e, t) {
    if (e == t)
      return !0;
    if (e.length != t.length)
      return !1;
    for (let r = 0; r < e.length; r++)
      if (!e[r].eq(t[r]))
        return !1;
    return !0;
  }
  static setFrom(e) {
    if (!e || Array.isArray(e) && e.length == 0)
      return z.none;
    if (e instanceof z)
      return [e];
    let t = e.slice();
    return t.sort((r, i) => r.type.rank - i.type.rank), t;
  }
}
z.none = [];
class Tr extends Error {
}
class S {
  constructor(e, t, r) {
    this.content = e, this.openStart = t, this.openEnd = r;
  }
  get size() {
    return this.content.size - this.openStart - this.openEnd;
  }
  insertAt(e, t) {
    let r = Na(this.content, e + this.openStart, t);
    return r && new S(r, this.openStart, this.openEnd);
  }
  removeBetween(e, t) {
    return new S(Aa(this.content, e + this.openStart, t + this.openStart), this.openStart, this.openEnd);
  }
  eq(e) {
    return this.content.eq(e.content) && this.openStart == e.openStart && this.openEnd == e.openEnd;
  }
  toString() {
    return this.content + "(" + this.openStart + "," + this.openEnd + ")";
  }
  toJSON() {
    if (!this.content.size)
      return null;
    let e = { content: this.content.toJSON() };
    return this.openStart > 0 && (e.openStart = this.openStart), this.openEnd > 0 && (e.openEnd = this.openEnd), e;
  }
  static fromJSON(e, t) {
    if (!t)
      return S.empty;
    let r = t.openStart || 0, i = t.openEnd || 0;
    if (typeof r != "number" || typeof i != "number")
      throw new RangeError("Invalid input for Slice.fromJSON");
    return new S(x.fromJSON(e, t.content), r, i);
  }
  static maxOpen(e, t = !0) {
    let r = 0, i = 0;
    for (let o = e.firstChild; o && !o.isLeaf && (t || !o.type.spec.isolating); o = o.firstChild)
      r++;
    for (let o = e.lastChild; o && !o.isLeaf && (t || !o.type.spec.isolating); o = o.lastChild)
      i++;
    return new S(e, r, i);
  }
}
S.empty = new S(x.empty, 0, 0);
function Aa(n, e, t) {
  let { index: r, offset: i } = n.findIndex(e), o = n.maybeChild(r), { index: s, offset: a } = n.findIndex(t);
  if (i == e || o.isText) {
    if (a != t && !n.child(s).isText)
      throw new RangeError("Removing non-flat range");
    return n.cut(0, e).append(n.cut(t));
  }
  if (r != s)
    throw new RangeError("Removing non-flat range");
  return n.replaceChild(r, o.copy(Aa(o.content, e - i - 1, t - i - 1)));
}
function Na(n, e, t, r) {
  let { index: i, offset: o } = n.findIndex(e), s = n.maybeChild(i);
  if (o == e || s.isText)
    return r && !r.canReplace(i, i, t) ? null : n.cut(0, e).append(t).append(n.cut(e));
  let a = Na(s.content, e - o - 1, t);
  return a && n.replaceChild(i, s.copy(a));
}
function du(n, e, t) {
  if (t.openStart > n.depth)
    throw new Tr("Inserted content deeper than insertion position");
  if (n.depth - t.openStart != e.depth - t.openEnd)
    throw new Tr("Inconsistent open depths");
  return Da(n, e, t, 0);
}
function Da(n, e, t, r) {
  let i = n.index(r), o = n.node(r);
  if (i == e.index(r) && r < n.depth - t.openStart) {
    let s = Da(n, e, t, r + 1);
    return o.copy(o.content.replaceChild(i, s));
  } else if (t.content.size)
    if (!t.openStart && !t.openEnd && n.depth == r && e.depth == r) {
      let s = n.parent, a = s.content;
      return zt(s, a.cut(0, n.parentOffset).append(t.content).append(a.cut(e.parentOffset)));
    } else {
      let { start: s, end: a } = fu(t, n);
      return zt(o, Pa(n, s, a, e, r));
    }
  else
    return zt(o, Er(n, e, r));
}
function Ia(n, e) {
  if (!e.type.compatibleContent(n.type))
    throw new Tr("Cannot join " + e.type.name + " onto " + n.type.name);
}
function Fi(n, e, t) {
  let r = n.node(t);
  return Ia(r, e.node(t)), r;
}
function Ft(n, e) {
  let t = e.length - 1;
  t >= 0 && n.isText && n.sameMarkup(e[t]) ? e[t] = n.withText(e[t].text + n.text) : e.push(n);
}
function Fn(n, e, t, r) {
  let i = (e || n).node(t), o = 0, s = e ? e.index(t) : i.childCount;
  n && (o = n.index(t), n.depth > t ? o++ : n.textOffset && (Ft(n.nodeAfter, r), o++));
  for (let a = o; a < s; a++)
    Ft(i.child(a), r);
  e && e.depth == t && e.textOffset && Ft(e.nodeBefore, r);
}
function zt(n, e) {
  return n.type.checkContent(e), n.copy(e);
}
function Pa(n, e, t, r, i) {
  let o = n.depth > i && Fi(n, e, i + 1), s = r.depth > i && Fi(t, r, i + 1), a = [];
  return Fn(null, n, i, a), o && s && e.index(i) == t.index(i) ? (Ia(o, s), Ft(zt(o, Pa(n, e, t, r, i + 1)), a)) : (o && Ft(zt(o, Er(n, e, i + 1)), a), Fn(e, t, i, a), s && Ft(zt(s, Er(t, r, i + 1)), a)), Fn(r, null, i, a), new x(a);
}
function Er(n, e, t) {
  let r = [];
  if (Fn(null, n, t, r), n.depth > t) {
    let i = Fi(n, e, t + 1);
    Ft(zt(i, Er(n, e, t + 1)), r);
  }
  return Fn(e, null, t, r), new x(r);
}
function fu(n, e) {
  let t = e.depth - n.openStart, i = e.node(t).copy(n.content);
  for (let o = t - 1; o >= 0; o--)
    i = e.node(o).copy(x.from(i));
  return {
    start: i.resolveNoCache(n.openStart + t),
    end: i.resolveNoCache(i.content.size - n.openEnd - t)
  };
}
class Kn {
  constructor(e, t, r) {
    this.pos = e, this.path = t, this.parentOffset = r, this.depth = t.length / 3 - 1;
  }
  resolveDepth(e) {
    return e == null ? this.depth : e < 0 ? this.depth + e : e;
  }
  get parent() {
    return this.node(this.depth);
  }
  get doc() {
    return this.node(0);
  }
  node(e) {
    return this.path[this.resolveDepth(e) * 3];
  }
  index(e) {
    return this.path[this.resolveDepth(e) * 3 + 1];
  }
  indexAfter(e) {
    return e = this.resolveDepth(e), this.index(e) + (e == this.depth && !this.textOffset ? 0 : 1);
  }
  start(e) {
    return e = this.resolveDepth(e), e == 0 ? 0 : this.path[e * 3 - 1] + 1;
  }
  end(e) {
    return e = this.resolveDepth(e), this.start(e) + this.node(e).content.size;
  }
  before(e) {
    if (e = this.resolveDepth(e), !e)
      throw new RangeError("There is no position before the top-level node");
    return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1];
  }
  after(e) {
    if (e = this.resolveDepth(e), !e)
      throw new RangeError("There is no position after the top-level node");
    return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1] + this.path[e * 3].nodeSize;
  }
  get textOffset() {
    return this.pos - this.path[this.path.length - 1];
  }
  get nodeAfter() {
    let e = this.parent, t = this.index(this.depth);
    if (t == e.childCount)
      return null;
    let r = this.pos - this.path[this.path.length - 1], i = e.child(t);
    return r ? e.child(t).cut(r) : i;
  }
  get nodeBefore() {
    let e = this.index(this.depth), t = this.pos - this.path[this.path.length - 1];
    return t ? this.parent.child(e).cut(0, t) : e == 0 ? null : this.parent.child(e - 1);
  }
  posAtIndex(e, t) {
    t = this.resolveDepth(t);
    let r = this.path[t * 3], i = t == 0 ? 0 : this.path[t * 3 - 1] + 1;
    for (let o = 0; o < e; o++)
      i += r.child(o).nodeSize;
    return i;
  }
  marks() {
    let e = this.parent, t = this.index();
    if (e.content.size == 0)
      return z.none;
    if (this.textOffset)
      return e.child(t).marks;
    let r = e.maybeChild(t - 1), i = e.maybeChild(t);
    if (!r) {
      let a = r;
      r = i, i = a;
    }
    let o = r.marks;
    for (var s = 0; s < o.length; s++)
      o[s].type.spec.inclusive === !1 && (!i || !o[s].isInSet(i.marks)) && (o = o[s--].removeFromSet(o));
    return o;
  }
  marksAcross(e) {
    let t = this.parent.maybeChild(this.index());
    if (!t || !t.isInline)
      return null;
    let r = t.marks, i = e.parent.maybeChild(e.index());
    for (var o = 0; o < r.length; o++)
      r[o].type.spec.inclusive === !1 && (!i || !r[o].isInSet(i.marks)) && (r = r[o--].removeFromSet(r));
    return r;
  }
  sharedDepth(e) {
    for (let t = this.depth; t > 0; t--)
      if (this.start(t) <= e && this.end(t) >= e)
        return t;
    return 0;
  }
  blockRange(e = this, t) {
    if (e.pos < this.pos)
      return e.blockRange(this);
    for (let r = this.depth - (this.parent.inlineContent || this.pos == e.pos ? 1 : 0); r >= 0; r--)
      if (e.pos <= this.end(r) && (!t || t(this.node(r))))
        return new Ar(this, e, r);
    return null;
  }
  sameParent(e) {
    return this.pos - this.parentOffset == e.pos - e.parentOffset;
  }
  max(e) {
    return e.pos > this.pos ? e : this;
  }
  min(e) {
    return e.pos < this.pos ? e : this;
  }
  toString() {
    let e = "";
    for (let t = 1; t <= this.depth; t++)
      e += (e ? "/" : "") + this.node(t).type.name + "_" + this.index(t - 1);
    return e + ":" + this.parentOffset;
  }
  static resolve(e, t) {
    if (!(t >= 0 && t <= e.content.size))
      throw new RangeError("Position " + t + " out of range");
    let r = [], i = 0, o = t;
    for (let s = e; ; ) {
      let { index: a, offset: l } = s.content.findIndex(o), c = o - l;
      if (r.push(s, a, i + l), !c || (s = s.child(a), s.isText))
        break;
      o = c - 1, i += l + 1;
    }
    return new Kn(t, r, o);
  }
  static resolveCached(e, t) {
    for (let i = 0; i < ui.length; i++) {
      let o = ui[i];
      if (o.pos == t && o.doc == e)
        return o;
    }
    let r = ui[di] = Kn.resolve(e, t);
    return di = (di + 1) % pu, r;
  }
}
let ui = [], di = 0, pu = 12;
class Ar {
  constructor(e, t, r) {
    this.$from = e, this.$to = t, this.depth = r;
  }
  get start() {
    return this.$from.before(this.depth + 1);
  }
  get end() {
    return this.$to.after(this.depth + 1);
  }
  get parent() {
    return this.$from.node(this.depth);
  }
  get startIndex() {
    return this.$from.index(this.depth);
  }
  get endIndex() {
    return this.$to.indexAfter(this.depth);
  }
}
const hu = /* @__PURE__ */ Object.create(null);
class _e {
  constructor(e, t, r, i = z.none) {
    this.type = e, this.attrs = t, this.marks = i, this.content = r || x.empty;
  }
  get nodeSize() {
    return this.isLeaf ? 1 : 2 + this.content.size;
  }
  get childCount() {
    return this.content.childCount;
  }
  child(e) {
    return this.content.child(e);
  }
  maybeChild(e) {
    return this.content.maybeChild(e);
  }
  forEach(e) {
    this.content.forEach(e);
  }
  nodesBetween(e, t, r, i = 0) {
    this.content.nodesBetween(e, t, r, i, this);
  }
  descendants(e) {
    this.nodesBetween(0, this.content.size, e);
  }
  get textContent() {
    return this.isLeaf && this.type.spec.leafText ? this.type.spec.leafText(this) : this.textBetween(0, this.content.size, "");
  }
  textBetween(e, t, r, i) {
    return this.content.textBetween(e, t, r, i);
  }
  get firstChild() {
    return this.content.firstChild;
  }
  get lastChild() {
    return this.content.lastChild;
  }
  eq(e) {
    return this == e || this.sameMarkup(e) && this.content.eq(e.content);
  }
  sameMarkup(e) {
    return this.hasMarkup(e.type, e.attrs, e.marks);
  }
  hasMarkup(e, t, r) {
    return this.type == e && Cr(this.attrs, t || e.defaultAttrs || hu) && z.sameSet(this.marks, r || z.none);
  }
  copy(e = null) {
    return e == this.content ? this : new _e(this.type, this.attrs, e, this.marks);
  }
  mark(e) {
    return e == this.marks ? this : new _e(this.type, this.attrs, this.content, e);
  }
  cut(e, t = this.content.size) {
    return e == 0 && t == this.content.size ? this : this.copy(this.content.cut(e, t));
  }
  slice(e, t = this.content.size, r = !1) {
    if (e == t)
      return S.empty;
    let i = this.resolve(e), o = this.resolve(t), s = r ? 0 : i.sharedDepth(t), a = i.start(s), c = i.node(s).content.cut(i.pos - a, o.pos - a);
    return new S(c, i.depth - s, o.depth - s);
  }
  replace(e, t, r) {
    return du(this.resolve(e), this.resolve(t), r);
  }
  nodeAt(e) {
    for (let t = this; ; ) {
      let { index: r, offset: i } = t.content.findIndex(e);
      if (t = t.maybeChild(r), !t)
        return null;
      if (i == e || t.isText)
        return t;
      e -= i + 1;
    }
  }
  childAfter(e) {
    let { index: t, offset: r } = this.content.findIndex(e);
    return { node: this.content.maybeChild(t), index: t, offset: r };
  }
  childBefore(e) {
    if (e == 0)
      return { node: null, index: 0, offset: 0 };
    let { index: t, offset: r } = this.content.findIndex(e);
    if (r < e)
      return { node: this.content.child(t), index: t, offset: r };
    let i = this.content.child(t - 1);
    return { node: i, index: t - 1, offset: r - i.nodeSize };
  }
  resolve(e) {
    return Kn.resolveCached(this, e);
  }
  resolveNoCache(e) {
    return Kn.resolve(this, e);
  }
  rangeHasMark(e, t, r) {
    let i = !1;
    return t > e && this.nodesBetween(e, t, (o) => (r.isInSet(o.marks) && (i = !0), !i)), i;
  }
  get isBlock() {
    return this.type.isBlock;
  }
  get isTextblock() {
    return this.type.isTextblock;
  }
  get inlineContent() {
    return this.type.inlineContent;
  }
  get isInline() {
    return this.type.isInline;
  }
  get isText() {
    return this.type.isText;
  }
  get isLeaf() {
    return this.type.isLeaf;
  }
  get isAtom() {
    return this.type.isAtom;
  }
  toString() {
    if (this.type.spec.toDebugString)
      return this.type.spec.toDebugString(this);
    let e = this.type.name;
    return this.content.size && (e += "(" + this.content.toStringInner() + ")"), Ra(this.marks, e);
  }
  contentMatchAt(e) {
    let t = this.type.contentMatch.matchFragment(this.content, 0, e);
    if (!t)
      throw new Error("Called contentMatchAt on a node with invalid content");
    return t;
  }
  canReplace(e, t, r = x.empty, i = 0, o = r.childCount) {
    let s = this.contentMatchAt(e).matchFragment(r, i, o), a = s && s.matchFragment(this.content, t);
    if (!a || !a.validEnd)
      return !1;
    for (let l = i; l < o; l++)
      if (!this.type.allowsMarks(r.child(l).marks))
        return !1;
    return !0;
  }
  canReplaceWith(e, t, r, i) {
    if (i && !this.type.allowsMarks(i))
      return !1;
    let o = this.contentMatchAt(e).matchType(r), s = o && o.matchFragment(this.content, t);
    return s ? s.validEnd : !1;
  }
  canAppend(e) {
    return e.content.size ? this.canReplace(this.childCount, this.childCount, e.content) : this.type.compatibleContent(e.type);
  }
  check() {
    this.type.checkContent(this.content);
    let e = z.none;
    for (let t = 0; t < this.marks.length; t++)
      e = this.marks[t].addToSet(e);
    if (!z.sameSet(e, this.marks))
      throw new RangeError(`Invalid collection of marks for node ${this.type.name}: ${this.marks.map((t) => t.type.name)}`);
    this.content.forEach((t) => t.check());
  }
  toJSON() {
    let e = { type: this.type.name };
    for (let t in this.attrs) {
      e.attrs = this.attrs;
      break;
    }
    return this.content.size && (e.content = this.content.toJSON()), this.marks.length && (e.marks = this.marks.map((t) => t.toJSON())), e;
  }
  static fromJSON(e, t) {
    if (!t)
      throw new RangeError("Invalid input for Node.fromJSON");
    let r = null;
    if (t.marks) {
      if (!Array.isArray(t.marks))
        throw new RangeError("Invalid mark data for Node.fromJSON");
      r = t.marks.map(e.markFromJSON);
    }
    if (t.type == "text") {
      if (typeof t.text != "string")
        throw new RangeError("Invalid text node in JSON");
      return e.text(t.text, r);
    }
    let i = x.fromJSON(e, t.content);
    return e.nodeType(t.type).create(t.attrs, i, r);
  }
}
_e.prototype.text = void 0;
class Nr extends _e {
  constructor(e, t, r, i) {
    if (super(e, t, null, i), !r)
      throw new RangeError("Empty text nodes are not allowed");
    this.text = r;
  }
  toString() {
    return this.type.spec.toDebugString ? this.type.spec.toDebugString(this) : Ra(this.marks, JSON.stringify(this.text));
  }
  get textContent() {
    return this.text;
  }
  textBetween(e, t) {
    return this.text.slice(e, t);
  }
  get nodeSize() {
    return this.text.length;
  }
  mark(e) {
    return e == this.marks ? this : new Nr(this.type, this.attrs, this.text, e);
  }
  withText(e) {
    return e == this.text ? this : new Nr(this.type, this.attrs, e, this.marks);
  }
  cut(e = 0, t = this.text.length) {
    return e == 0 && t == this.text.length ? this : this.withText(this.text.slice(e, t));
  }
  eq(e) {
    return this.sameMarkup(e) && this.text == e.text;
  }
  toJSON() {
    let e = super.toJSON();
    return e.text = this.text, e;
  }
}
function Ra(n, e) {
  for (let t = n.length - 1; t >= 0; t--)
    e = n[t].type.name + "(" + e + ")";
  return e;
}
class Wt {
  constructor(e) {
    this.validEnd = e, this.next = [], this.wrapCache = [];
  }
  static parse(e, t) {
    let r = new mu(e, t);
    if (r.next == null)
      return Wt.empty;
    let i = Ba(r);
    r.next && r.err("Unexpected trailing text");
    let o = wu(xu(i));
    return Su(o, r), o;
  }
  matchType(e) {
    for (let t = 0; t < this.next.length; t++)
      if (this.next[t].type == e)
        return this.next[t].next;
    return null;
  }
  matchFragment(e, t = 0, r = e.childCount) {
    let i = this;
    for (let o = t; i && o < r; o++)
      i = i.matchType(e.child(o).type);
    return i;
  }
  get inlineContent() {
    return this.next.length != 0 && this.next[0].type.isInline;
  }
  get defaultType() {
    for (let e = 0; e < this.next.length; e++) {
      let { type: t } = this.next[e];
      if (!(t.isText || t.hasRequiredAttrs()))
        return t;
    }
    return null;
  }
  compatible(e) {
    for (let t = 0; t < this.next.length; t++)
      for (let r = 0; r < e.next.length; r++)
        if (this.next[t].type == e.next[r].type)
          return !0;
    return !1;
  }
  fillBefore(e, t = !1, r = 0) {
    let i = [this];
    function o(s, a) {
      let l = s.matchFragment(e, r);
      if (l && (!t || l.validEnd))
        return x.from(a.map((c) => c.createAndFill()));
      for (let c = 0; c < s.next.length; c++) {
        let { type: u, next: d } = s.next[c];
        if (!(u.isText || u.hasRequiredAttrs()) && i.indexOf(d) == -1) {
          i.push(d);
          let f = o(d, a.concat(u));
          if (f)
            return f;
        }
      }
      return null;
    }
    return o(this, []);
  }
  findWrapping(e) {
    for (let r = 0; r < this.wrapCache.length; r += 2)
      if (this.wrapCache[r] == e)
        return this.wrapCache[r + 1];
    let t = this.computeWrapping(e);
    return this.wrapCache.push(e, t), t;
  }
  computeWrapping(e) {
    let t = /* @__PURE__ */ Object.create(null), r = [{ match: this, type: null, via: null }];
    for (; r.length; ) {
      let i = r.shift(), o = i.match;
      if (o.matchType(e)) {
        let s = [];
        for (let a = i; a.type; a = a.via)
          s.push(a.type);
        return s.reverse();
      }
      for (let s = 0; s < o.next.length; s++) {
        let { type: a, next: l } = o.next[s];
        !a.isLeaf && !a.hasRequiredAttrs() && !(a.name in t) && (!i.type || l.validEnd) && (r.push({ match: a.contentMatch, type: a, via: i }), t[a.name] = !0);
      }
    }
    return null;
  }
  get edgeCount() {
    return this.next.length;
  }
  edge(e) {
    if (e >= this.next.length)
      throw new RangeError(`There's no ${e}th edge in this content match`);
    return this.next[e];
  }
  toString() {
    let e = [];
    function t(r) {
      e.push(r);
      for (let i = 0; i < r.next.length; i++)
        e.indexOf(r.next[i].next) == -1 && t(r.next[i].next);
    }
    return t(this), e.map((r, i) => {
      let o = i + (r.validEnd ? "*" : " ") + " ";
      for (let s = 0; s < r.next.length; s++)
        o += (s ? ", " : "") + r.next[s].type.name + "->" + e.indexOf(r.next[s].next);
      return o;
    }).join(`
`);
  }
}
Wt.empty = new Wt(!0);
class mu {
  constructor(e, t) {
    this.string = e, this.nodeTypes = t, this.inline = null, this.pos = 0, this.tokens = e.split(/\s*(?=\b|\W|$)/), this.tokens[this.tokens.length - 1] == "" && this.tokens.pop(), this.tokens[0] == "" && this.tokens.shift();
  }
  get next() {
    return this.tokens[this.pos];
  }
  eat(e) {
    return this.next == e && (this.pos++ || !0);
  }
  err(e) {
    throw new SyntaxError(e + " (in content expression '" + this.string + "')");
  }
}
function Ba(n) {
  let e = [];
  do
    e.push(gu(n));
  while (n.eat("|"));
  return e.length == 1 ? e[0] : { type: "choice", exprs: e };
}
function gu(n) {
  let e = [];
  do
    e.push(yu(n));
  while (n.next && n.next != ")" && n.next != "|");
  return e.length == 1 ? e[0] : { type: "seq", exprs: e };
}
function yu(n) {
  let e = ku(n);
  for (; ; )
    if (n.eat("+"))
      e = { type: "plus", expr: e };
    else if (n.eat("*"))
      e = { type: "star", expr: e };
    else if (n.eat("?"))
      e = { type: "opt", expr: e };
    else if (n.eat("{"))
      e = bu(n, e);
    else
      break;
  return e;
}
function Wo(n) {
  /\D/.test(n.next) && n.err("Expected number, got '" + n.next + "'");
  let e = Number(n.next);
  return n.pos++, e;
}
function bu(n, e) {
  let t = Wo(n), r = t;
  return n.eat(",") && (n.next != "}" ? r = Wo(n) : r = -1), n.eat("}") || n.err("Unclosed braced range"), { type: "range", min: t, max: r, expr: e };
}
function vu(n, e) {
  let t = n.nodeTypes, r = t[e];
  if (r)
    return [r];
  let i = [];
  for (let o in t) {
    let s = t[o];
    s.groups.indexOf(e) > -1 && i.push(s);
  }
  return i.length == 0 && n.err("No node type or group '" + e + "' found"), i;
}
function ku(n) {
  if (n.eat("(")) {
    let e = Ba(n);
    return n.eat(")") || n.err("Missing closing paren"), e;
  } else if (/\W/.test(n.next))
    n.err("Unexpected token '" + n.next + "'");
  else {
    let e = vu(n, n.next).map((t) => (n.inline == null ? n.inline = t.isInline : n.inline != t.isInline && n.err("Mixing inline and block content"), { type: "name", value: t }));
    return n.pos++, e.length == 1 ? e[0] : { type: "choice", exprs: e };
  }
}
function xu(n) {
  let e = [[]];
  return i(o(n, 0), t()), e;
  function t() {
    return e.push([]) - 1;
  }
  function r(s, a, l) {
    let c = { term: l, to: a };
    return e[s].push(c), c;
  }
  function i(s, a) {
    s.forEach((l) => l.to = a);
  }
  function o(s, a) {
    if (s.type == "choice")
      return s.exprs.reduce((l, c) => l.concat(o(c, a)), []);
    if (s.type == "seq")
      for (let l = 0; ; l++) {
        let c = o(s.exprs[l], a);
        if (l == s.exprs.length - 1)
          return c;
        i(c, a = t());
      }
    else if (s.type == "star") {
      let l = t();
      return r(a, l), i(o(s.expr, l), l), [r(l)];
    } else if (s.type == "plus") {
      let l = t();
      return i(o(s.expr, a), l), i(o(s.expr, l), l), [r(l)];
    } else {
      if (s.type == "opt")
        return [r(a)].concat(o(s.expr, a));
      if (s.type == "range") {
        let l = a;
        for (let c = 0; c < s.min; c++) {
          let u = t();
          i(o(s.expr, l), u), l = u;
        }
        if (s.max == -1)
          i(o(s.expr, l), l);
        else
          for (let c = s.min; c < s.max; c++) {
            let u = t();
            r(l, u), i(o(s.expr, l), u), l = u;
          }
        return [r(l)];
      } else {
        if (s.type == "name")
          return [r(a, void 0, s.value)];
        throw new Error("Unknown expr type");
      }
    }
  }
}
function La(n, e) {
  return e - n;
}
function qo(n, e) {
  let t = [];
  return r(e), t.sort(La);
  function r(i) {
    let o = n[i];
    if (o.length == 1 && !o[0].term)
      return r(o[0].to);
    t.push(i);
    for (let s = 0; s < o.length; s++) {
      let { term: a, to: l } = o[s];
      !a && t.indexOf(l) == -1 && r(l);
    }
  }
}
function wu(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return t(qo(n, 0));
  function t(r) {
    let i = [];
    r.forEach((s) => {
      n[s].forEach(({ term: a, to: l }) => {
        if (!a)
          return;
        let c;
        for (let u = 0; u < i.length; u++)
          i[u][0] == a && (c = i[u][1]);
        qo(n, l).forEach((u) => {
          c || i.push([a, c = []]), c.indexOf(u) == -1 && c.push(u);
        });
      });
    });
    let o = e[r.join(",")] = new Wt(r.indexOf(n.length - 1) > -1);
    for (let s = 0; s < i.length; s++) {
      let a = i[s][1].sort(La);
      o.next.push({ type: i[s][0], next: e[a.join(",")] || t(a) });
    }
    return o;
  }
}
function Su(n, e) {
  for (let t = 0, r = [n]; t < r.length; t++) {
    let i = r[t], o = !i.validEnd, s = [];
    for (let a = 0; a < i.next.length; a++) {
      let { type: l, next: c } = i.next[a];
      s.push(l.name), o && !(l.isText || l.hasRequiredAttrs()) && (o = !1), r.indexOf(c) == -1 && r.push(c);
    }
    o && e.err("Only non-generatable nodes (" + s.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
  }
}
function $a(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n) {
    let r = n[t];
    if (!r.hasDefault)
      return null;
    e[t] = r.default;
  }
  return e;
}
function Fa(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  for (let r in n) {
    let i = e && e[r];
    if (i === void 0) {
      let o = n[r];
      if (o.hasDefault)
        i = o.default;
      else
        throw new RangeError("No value supplied for attribute " + r);
    }
    t[r] = i;
  }
  return t;
}
function za(n) {
  let e = /* @__PURE__ */ Object.create(null);
  if (n)
    for (let t in n)
      e[t] = new Mu(n[t]);
  return e;
}
class Dr {
  constructor(e, t, r) {
    this.name = e, this.schema = t, this.spec = r, this.markSet = null, this.groups = r.group ? r.group.split(" ") : [], this.attrs = za(r.attrs), this.defaultAttrs = $a(this.attrs), this.contentMatch = null, this.inlineContent = null, this.isBlock = !(r.inline || e == "text"), this.isText = e == "text";
  }
  get isInline() {
    return !this.isBlock;
  }
  get isTextblock() {
    return this.isBlock && this.inlineContent;
  }
  get isLeaf() {
    return this.contentMatch == Wt.empty;
  }
  get isAtom() {
    return this.isLeaf || !!this.spec.atom;
  }
  get whitespace() {
    return this.spec.whitespace || (this.spec.code ? "pre" : "normal");
  }
  hasRequiredAttrs() {
    for (let e in this.attrs)
      if (this.attrs[e].isRequired)
        return !0;
    return !1;
  }
  compatibleContent(e) {
    return this == e || this.contentMatch.compatible(e.contentMatch);
  }
  computeAttrs(e) {
    return !e && this.defaultAttrs ? this.defaultAttrs : Fa(this.attrs, e);
  }
  create(e = null, t, r) {
    if (this.isText)
      throw new Error("NodeType.create can't construct text nodes");
    return new _e(this, this.computeAttrs(e), x.from(t), z.setFrom(r));
  }
  createChecked(e = null, t, r) {
    return t = x.from(t), this.checkContent(t), new _e(this, this.computeAttrs(e), t, z.setFrom(r));
  }
  createAndFill(e = null, t, r) {
    if (e = this.computeAttrs(e), t = x.from(t), t.size) {
      let s = this.contentMatch.fillBefore(t);
      if (!s)
        return null;
      t = s.append(t);
    }
    let i = this.contentMatch.matchFragment(t), o = i && i.fillBefore(x.empty, !0);
    return o ? new _e(this, e, t.append(o), z.setFrom(r)) : null;
  }
  validContent(e) {
    let t = this.contentMatch.matchFragment(e);
    if (!t || !t.validEnd)
      return !1;
    for (let r = 0; r < e.childCount; r++)
      if (!this.allowsMarks(e.child(r).marks))
        return !1;
    return !0;
  }
  checkContent(e) {
    if (!this.validContent(e))
      throw new RangeError(`Invalid content for node ${this.name}: ${e.toString().slice(0, 50)}`);
  }
  allowsMarkType(e) {
    return this.markSet == null || this.markSet.indexOf(e) > -1;
  }
  allowsMarks(e) {
    if (this.markSet == null)
      return !0;
    for (let t = 0; t < e.length; t++)
      if (!this.allowsMarkType(e[t].type))
        return !1;
    return !0;
  }
  allowedMarks(e) {
    if (this.markSet == null)
      return e;
    let t;
    for (let r = 0; r < e.length; r++)
      this.allowsMarkType(e[r].type) ? t && t.push(e[r]) : t || (t = e.slice(0, r));
    return t ? t.length ? t : z.none : e;
  }
  static compile(e, t) {
    let r = /* @__PURE__ */ Object.create(null);
    e.forEach((o, s) => r[o] = new Dr(o, t, s));
    let i = t.spec.topNode || "doc";
    if (!r[i])
      throw new RangeError("Schema is missing its top node type ('" + i + "')");
    if (!r.text)
      throw new RangeError("Every schema needs a 'text' type");
    for (let o in r.text.attrs)
      throw new RangeError("The text node type should not have attributes");
    return r;
  }
}
class Mu {
  constructor(e) {
    this.hasDefault = Object.prototype.hasOwnProperty.call(e, "default"), this.default = e.default;
  }
  get isRequired() {
    return !this.hasDefault;
  }
}
class _r {
  constructor(e, t, r, i) {
    this.name = e, this.rank = t, this.schema = r, this.spec = i, this.attrs = za(i.attrs), this.excluded = null;
    let o = $a(this.attrs);
    this.instance = o ? new z(this, o) : null;
  }
  create(e = null) {
    return !e && this.instance ? this.instance : new z(this, Fa(this.attrs, e));
  }
  static compile(e, t) {
    let r = /* @__PURE__ */ Object.create(null), i = 0;
    return e.forEach((o, s) => r[o] = new _r(o, i++, t, s)), r;
  }
  removeFromSet(e) {
    for (var t = 0; t < e.length; t++)
      e[t].type == this && (e = e.slice(0, t).concat(e.slice(t + 1)), t--);
    return e;
  }
  isInSet(e) {
    for (let t = 0; t < e.length; t++)
      if (e[t].type == this)
        return e[t];
  }
  excludes(e) {
    return this.excluded.indexOf(e) > -1;
  }
}
class Ou {
  constructor(e) {
    this.cached = /* @__PURE__ */ Object.create(null);
    let t = this.spec = {};
    for (let i in e)
      t[i] = e[i];
    t.nodes = Z.from(e.nodes), t.marks = Z.from(e.marks || {}), this.nodes = Dr.compile(this.spec.nodes, this), this.marks = _r.compile(this.spec.marks, this);
    let r = /* @__PURE__ */ Object.create(null);
    for (let i in this.nodes) {
      if (i in this.marks)
        throw new RangeError(i + " can not be both a node and a mark");
      let o = this.nodes[i], s = o.spec.content || "", a = o.spec.marks;
      o.contentMatch = r[s] || (r[s] = Wt.parse(s, this.nodes)), o.inlineContent = o.contentMatch.inlineContent, o.markSet = a == "_" ? null : a ? Ko(this, a.split(" ")) : a == "" || !o.inlineContent ? [] : null;
    }
    for (let i in this.marks) {
      let o = this.marks[i], s = o.spec.excludes;
      o.excluded = s == null ? [o] : s == "" ? [] : Ko(this, s.split(" "));
    }
    this.nodeFromJSON = this.nodeFromJSON.bind(this), this.markFromJSON = this.markFromJSON.bind(this), this.topNodeType = this.nodes[this.spec.topNode || "doc"], this.cached.wrappings = /* @__PURE__ */ Object.create(null);
  }
  node(e, t = null, r, i) {
    if (typeof e == "string")
      e = this.nodeType(e);
    else if (e instanceof Dr) {
      if (e.schema != this)
        throw new RangeError("Node type from different schema used (" + e.name + ")");
    } else
      throw new RangeError("Invalid node type: " + e);
    return e.createChecked(t, r, i);
  }
  text(e, t) {
    let r = this.nodes.text;
    return new Nr(r, r.defaultAttrs, e, z.setFrom(t));
  }
  mark(e, t) {
    return typeof e == "string" && (e = this.marks[e]), e.create(t);
  }
  nodeFromJSON(e) {
    return _e.fromJSON(this, e);
  }
  markFromJSON(e) {
    return z.fromJSON(this, e);
  }
  nodeType(e) {
    let t = this.nodes[e];
    if (!t)
      throw new RangeError("Unknown node type: " + e);
    return t;
  }
}
function Ko(n, e) {
  let t = [];
  for (let r = 0; r < e.length; r++) {
    let i = e[r], o = n.marks[i], s = o;
    if (o)
      t.push(o);
    else
      for (let a in n.marks) {
        let l = n.marks[a];
        (i == "_" || l.spec.group && l.spec.group.split(" ").indexOf(i) > -1) && t.push(s = l);
      }
    if (!s)
      throw new SyntaxError("Unknown mark type: '" + e[r] + "'");
  }
  return t;
}
class qt {
  constructor(e, t) {
    this.schema = e, this.rules = t, this.tags = [], this.styles = [], t.forEach((r) => {
      r.tag ? this.tags.push(r) : r.style && this.styles.push(r);
    }), this.normalizeLists = !this.tags.some((r) => {
      if (!/^(ul|ol)\b/.test(r.tag) || !r.node)
        return !1;
      let i = e.nodes[r.node];
      return i.contentMatch.matchType(i);
    });
  }
  parse(e, t = {}) {
    let r = new _o(this, t, !1);
    return r.addAll(e, t.from, t.to), r.finish();
  }
  parseSlice(e, t = {}) {
    let r = new _o(this, t, !0);
    return r.addAll(e, t.from, t.to), S.maxOpen(r.finish());
  }
  matchTag(e, t, r) {
    for (let i = r ? this.tags.indexOf(r) + 1 : 0; i < this.tags.length; i++) {
      let o = this.tags[i];
      if (Eu(e, o.tag) && (o.namespace === void 0 || e.namespaceURI == o.namespace) && (!o.context || t.matchesContext(o.context))) {
        if (o.getAttrs) {
          let s = o.getAttrs(e);
          if (s === !1)
            continue;
          o.attrs = s || void 0;
        }
        return o;
      }
    }
  }
  matchStyle(e, t, r, i) {
    for (let o = i ? this.styles.indexOf(i) + 1 : 0; o < this.styles.length; o++) {
      let s = this.styles[o], a = s.style;
      if (!(a.indexOf(e) != 0 || s.context && !r.matchesContext(s.context) || a.length > e.length && (a.charCodeAt(e.length) != 61 || a.slice(e.length + 1) != t))) {
        if (s.getAttrs) {
          let l = s.getAttrs(t);
          if (l === !1)
            continue;
          s.attrs = l || void 0;
        }
        return s;
      }
    }
  }
  static schemaRules(e) {
    let t = [];
    function r(i) {
      let o = i.priority == null ? 50 : i.priority, s = 0;
      for (; s < t.length; s++) {
        let a = t[s];
        if ((a.priority == null ? 50 : a.priority) < o)
          break;
      }
      t.splice(s, 0, i);
    }
    for (let i in e.marks) {
      let o = e.marks[i].spec.parseDOM;
      o && o.forEach((s) => {
        r(s = Uo(s)), s.mark = i;
      });
    }
    for (let i in e.nodes) {
      let o = e.nodes[i].spec.parseDOM;
      o && o.forEach((s) => {
        r(s = Uo(s)), s.node = i;
      });
    }
    return t;
  }
  static fromSchema(e) {
    return e.cached.domParser || (e.cached.domParser = new qt(e, qt.schemaRules(e)));
  }
}
const Va = {
  address: !0,
  article: !0,
  aside: !0,
  blockquote: !0,
  canvas: !0,
  dd: !0,
  div: !0,
  dl: !0,
  fieldset: !0,
  figcaption: !0,
  figure: !0,
  footer: !0,
  form: !0,
  h1: !0,
  h2: !0,
  h3: !0,
  h4: !0,
  h5: !0,
  h6: !0,
  header: !0,
  hgroup: !0,
  hr: !0,
  li: !0,
  noscript: !0,
  ol: !0,
  output: !0,
  p: !0,
  pre: !0,
  section: !0,
  table: !0,
  tfoot: !0,
  ul: !0
}, Cu = {
  head: !0,
  noscript: !0,
  object: !0,
  script: !0,
  style: !0,
  title: !0
}, ja = { ol: !0, ul: !0 }, Ir = 1, Pr = 2, zn = 4;
function Jo(n, e, t) {
  return e != null ? (e ? Ir : 0) | (e === "full" ? Pr : 0) : n && n.whitespace == "pre" ? Ir | Pr : t & ~zn;
}
class hr {
  constructor(e, t, r, i, o, s, a) {
    this.type = e, this.attrs = t, this.marks = r, this.pendingMarks = i, this.solid = o, this.options = a, this.content = [], this.activeMarks = z.none, this.stashMarks = [], this.match = s || (a & zn ? null : e.contentMatch);
  }
  findWrapping(e) {
    if (!this.match) {
      if (!this.type)
        return [];
      let t = this.type.contentMatch.fillBefore(x.from(e));
      if (t)
        this.match = this.type.contentMatch.matchFragment(t);
      else {
        let r = this.type.contentMatch, i;
        return (i = r.findWrapping(e.type)) ? (this.match = r, i) : null;
      }
    }
    return this.match.findWrapping(e.type);
  }
  finish(e) {
    if (!(this.options & Ir)) {
      let r = this.content[this.content.length - 1], i;
      if (r && r.isText && (i = /[ \t\r\n\u000c]+$/.exec(r.text))) {
        let o = r;
        r.text.length == i[0].length ? this.content.pop() : this.content[this.content.length - 1] = o.withText(o.text.slice(0, o.text.length - i[0].length));
      }
    }
    let t = x.from(this.content);
    return !e && this.match && (t = t.append(this.match.fillBefore(x.empty, !0))), this.type ? this.type.create(this.attrs, t, this.marks) : t;
  }
  popFromStashMark(e) {
    for (let t = this.stashMarks.length - 1; t >= 0; t--)
      if (e.eq(this.stashMarks[t]))
        return this.stashMarks.splice(t, 1)[0];
  }
  applyPending(e) {
    for (let t = 0, r = this.pendingMarks; t < r.length; t++) {
      let i = r[t];
      (this.type ? this.type.allowsMarkType(i.type) : Nu(i.type, e)) && !i.isInSet(this.activeMarks) && (this.activeMarks = i.addToSet(this.activeMarks), this.pendingMarks = i.removeFromSet(this.pendingMarks));
    }
  }
  inlineContext(e) {
    return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : e.parentNode && !Va.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
  }
}
class _o {
  constructor(e, t, r) {
    this.parser = e, this.options = t, this.isOpen = r, this.open = 0;
    let i = t.topNode, o, s = Jo(null, t.preserveWhitespace, 0) | (r ? zn : 0);
    i ? o = new hr(i.type, i.attrs, z.none, z.none, !0, t.topMatch || i.type.contentMatch, s) : r ? o = new hr(null, null, z.none, z.none, !0, null, s) : o = new hr(e.schema.topNodeType, null, z.none, z.none, !0, null, s), this.nodes = [o], this.find = t.findPositions, this.needsBlock = !1;
  }
  get top() {
    return this.nodes[this.open];
  }
  addDOM(e) {
    if (e.nodeType == 3)
      this.addTextNode(e);
    else if (e.nodeType == 1) {
      let t = e.getAttribute("style"), r = t ? this.readStyles(Au(t)) : null, i = this.top;
      if (r != null)
        for (let o = 0; o < r.length; o++)
          this.addPendingMark(r[o]);
      if (this.addElement(e), r != null)
        for (let o = 0; o < r.length; o++)
          this.removePendingMark(r[o], i);
    }
  }
  addTextNode(e) {
    let t = e.nodeValue, r = this.top;
    if (r.options & Pr || r.inlineContext(e) || /[^ \t\r\n\u000c]/.test(t)) {
      if (r.options & Ir)
        r.options & Pr ? t = t.replace(/\r\n?/g, `
`) : t = t.replace(/\r?\n|\r/g, " ");
      else if (t = t.replace(/[ \t\r\n\u000c]+/g, " "), /^[ \t\r\n\u000c]/.test(t) && this.open == this.nodes.length - 1) {
        let i = r.content[r.content.length - 1], o = e.previousSibling;
        (!i || o && o.nodeName == "BR" || i.isText && /[ \t\r\n\u000c]$/.test(i.text)) && (t = t.slice(1));
      }
      t && this.insertNode(this.parser.schema.text(t)), this.findInText(e);
    } else
      this.findInside(e);
  }
  addElement(e, t) {
    let r = e.nodeName.toLowerCase(), i;
    ja.hasOwnProperty(r) && this.parser.normalizeLists && Tu(e);
    let o = this.options.ruleFromNode && this.options.ruleFromNode(e) || (i = this.parser.matchTag(e, this, t));
    if (o ? o.ignore : Cu.hasOwnProperty(r))
      this.findInside(e), this.ignoreFallback(e);
    else if (!o || o.skip || o.closeParent) {
      o && o.closeParent ? this.open = Math.max(0, this.open - 1) : o && o.skip.nodeType && (e = o.skip);
      let s, a = this.top, l = this.needsBlock;
      if (Va.hasOwnProperty(r))
        a.content.length && a.content[0].isInline && this.open && (this.open--, a = this.top), s = !0, a.type || (this.needsBlock = !0);
      else if (!e.firstChild) {
        this.leafFallback(e);
        return;
      }
      this.addAll(e), s && this.sync(a), this.needsBlock = l;
    } else
      this.addElementByRule(e, o, o.consuming === !1 ? i : void 0);
  }
  leafFallback(e) {
    e.nodeName == "BR" && this.top.type && this.top.type.inlineContent && this.addTextNode(e.ownerDocument.createTextNode(`
`));
  }
  ignoreFallback(e) {
    e.nodeName == "BR" && (!this.top.type || !this.top.type.inlineContent) && this.findPlace(this.parser.schema.text("-"));
  }
  readStyles(e) {
    let t = z.none;
    e:
      for (let r = 0; r < e.length; r += 2)
        for (let i = void 0; ; ) {
          let o = this.parser.matchStyle(e[r], e[r + 1], this, i);
          if (!o)
            continue e;
          if (o.ignore)
            return null;
          if (t = this.parser.schema.marks[o.mark].create(o.attrs).addToSet(t), o.consuming === !1)
            i = o;
          else
            break;
        }
    return t;
  }
  addElementByRule(e, t, r) {
    let i, o, s;
    t.node ? (o = this.parser.schema.nodes[t.node], o.isLeaf ? this.insertNode(o.create(t.attrs)) || this.leafFallback(e) : i = this.enter(o, t.attrs || null, t.preserveWhitespace)) : (s = this.parser.schema.marks[t.mark].create(t.attrs), this.addPendingMark(s));
    let a = this.top;
    if (o && o.isLeaf)
      this.findInside(e);
    else if (r)
      this.addElement(e, r);
    else if (t.getContent)
      this.findInside(e), t.getContent(e, this.parser.schema).forEach((l) => this.insertNode(l));
    else {
      let l = e;
      typeof t.contentElement == "string" ? l = e.querySelector(t.contentElement) : typeof t.contentElement == "function" ? l = t.contentElement(e) : t.contentElement && (l = t.contentElement), this.findAround(e, l, !0), this.addAll(l);
    }
    i && this.sync(a) && this.open--, s && this.removePendingMark(s, a);
  }
  addAll(e, t, r) {
    let i = t || 0;
    for (let o = t ? e.childNodes[t] : e.firstChild, s = r == null ? null : e.childNodes[r]; o != s; o = o.nextSibling, ++i)
      this.findAtPoint(e, i), this.addDOM(o);
    this.findAtPoint(e, i);
  }
  findPlace(e) {
    let t, r;
    for (let i = this.open; i >= 0; i--) {
      let o = this.nodes[i], s = o.findWrapping(e);
      if (s && (!t || t.length > s.length) && (t = s, r = o, !s.length) || o.solid)
        break;
    }
    if (!t)
      return !1;
    this.sync(r);
    for (let i = 0; i < t.length; i++)
      this.enterInner(t[i], null, !1);
    return !0;
  }
  insertNode(e) {
    if (e.isInline && this.needsBlock && !this.top.type) {
      let t = this.textblockFromContext();
      t && this.enterInner(t);
    }
    if (this.findPlace(e)) {
      this.closeExtra();
      let t = this.top;
      t.applyPending(e.type), t.match && (t.match = t.match.matchType(e.type));
      let r = t.activeMarks;
      for (let i = 0; i < e.marks.length; i++)
        (!t.type || t.type.allowsMarkType(e.marks[i].type)) && (r = e.marks[i].addToSet(r));
      return t.content.push(e.mark(r)), !0;
    }
    return !1;
  }
  enter(e, t, r) {
    let i = this.findPlace(e.create(t));
    return i && this.enterInner(e, t, !0, r), i;
  }
  enterInner(e, t = null, r = !1, i) {
    this.closeExtra();
    let o = this.top;
    o.applyPending(e), o.match = o.match && o.match.matchType(e);
    let s = Jo(e, i, o.options);
    o.options & zn && o.content.length == 0 && (s |= zn), this.nodes.push(new hr(e, t, o.activeMarks, o.pendingMarks, r, null, s)), this.open++;
  }
  closeExtra(e = !1) {
    let t = this.nodes.length - 1;
    if (t > this.open) {
      for (; t > this.open; t--)
        this.nodes[t - 1].content.push(this.nodes[t].finish(e));
      this.nodes.length = this.open + 1;
    }
  }
  finish() {
    return this.open = 0, this.closeExtra(this.isOpen), this.nodes[0].finish(this.isOpen || this.options.topOpen);
  }
  sync(e) {
    for (let t = this.open; t >= 0; t--)
      if (this.nodes[t] == e)
        return this.open = t, !0;
    return !1;
  }
  get currentPos() {
    this.closeExtra();
    let e = 0;
    for (let t = this.open; t >= 0; t--) {
      let r = this.nodes[t].content;
      for (let i = r.length - 1; i >= 0; i--)
        e += r[i].nodeSize;
      t && e++;
    }
    return e;
  }
  findAtPoint(e, t) {
    if (this.find)
      for (let r = 0; r < this.find.length; r++)
        this.find[r].node == e && this.find[r].offset == t && (this.find[r].pos = this.currentPos);
  }
  findInside(e) {
    if (this.find)
      for (let t = 0; t < this.find.length; t++)
        this.find[t].pos == null && e.nodeType == 1 && e.contains(this.find[t].node) && (this.find[t].pos = this.currentPos);
  }
  findAround(e, t, r) {
    if (e != t && this.find)
      for (let i = 0; i < this.find.length; i++)
        this.find[i].pos == null && e.nodeType == 1 && e.contains(this.find[i].node) && t.compareDocumentPosition(this.find[i].node) & (r ? 2 : 4) && (this.find[i].pos = this.currentPos);
  }
  findInText(e) {
    if (this.find)
      for (let t = 0; t < this.find.length; t++)
        this.find[t].node == e && (this.find[t].pos = this.currentPos - (e.nodeValue.length - this.find[t].offset));
  }
  matchesContext(e) {
    if (e.indexOf("|") > -1)
      return e.split(/\s*\|\s*/).some(this.matchesContext, this);
    let t = e.split("/"), r = this.options.context, i = !this.isOpen && (!r || r.parent.type == this.nodes[0].type), o = -(r ? r.depth + 1 : 0) + (i ? 0 : 1), s = (a, l) => {
      for (; a >= 0; a--) {
        let c = t[a];
        if (c == "") {
          if (a == t.length - 1 || a == 0)
            continue;
          for (; l >= o; l--)
            if (s(a - 1, l))
              return !0;
          return !1;
        } else {
          let u = l > 0 || l == 0 && i ? this.nodes[l].type : r && l >= o ? r.node(l - o).type : null;
          if (!u || u.name != c && u.groups.indexOf(c) == -1)
            return !1;
          l--;
        }
      }
      return !0;
    };
    return s(t.length - 1, this.open);
  }
  textblockFromContext() {
    let e = this.options.context;
    if (e)
      for (let t = e.depth; t >= 0; t--) {
        let r = e.node(t).contentMatchAt(e.indexAfter(t)).defaultType;
        if (r && r.isTextblock && r.defaultAttrs)
          return r;
      }
    for (let t in this.parser.schema.nodes) {
      let r = this.parser.schema.nodes[t];
      if (r.isTextblock && r.defaultAttrs)
        return r;
    }
  }
  addPendingMark(e) {
    let t = Du(e, this.top.pendingMarks);
    t && this.top.stashMarks.push(t), this.top.pendingMarks = e.addToSet(this.top.pendingMarks);
  }
  removePendingMark(e, t) {
    for (let r = this.open; r >= 0; r--) {
      let i = this.nodes[r];
      if (i.pendingMarks.lastIndexOf(e) > -1)
        i.pendingMarks = e.removeFromSet(i.pendingMarks);
      else {
        i.activeMarks = e.removeFromSet(i.activeMarks);
        let s = i.popFromStashMark(e);
        s && i.type && i.type.allowsMarkType(s.type) && (i.activeMarks = s.addToSet(i.activeMarks));
      }
      if (i == t)
        break;
    }
  }
}
function Tu(n) {
  for (let e = n.firstChild, t = null; e; e = e.nextSibling) {
    let r = e.nodeType == 1 ? e.nodeName.toLowerCase() : null;
    r && ja.hasOwnProperty(r) && t ? (t.appendChild(e), e = t) : r == "li" ? t = e : r && (t = null);
  }
}
function Eu(n, e) {
  return (n.matches || n.msMatchesSelector || n.webkitMatchesSelector || n.mozMatchesSelector).call(n, e);
}
function Au(n) {
  let e = /\s*([\w-]+)\s*:\s*([^;]+)/g, t, r = [];
  for (; t = e.exec(n); )
    r.push(t[1], t[2].trim());
  return r;
}
function Uo(n) {
  let e = {};
  for (let t in n)
    e[t] = n[t];
  return e;
}
function Nu(n, e) {
  let t = e.schema.nodes;
  for (let r in t) {
    let i = t[r];
    if (!i.allowsMarkType(n))
      continue;
    let o = [], s = (a) => {
      o.push(a);
      for (let l = 0; l < a.edgeCount; l++) {
        let { type: c, next: u } = a.edge(l);
        if (c == e || o.indexOf(u) < 0 && s(u))
          return !0;
      }
    };
    if (s(i.contentMatch))
      return !0;
  }
}
function Du(n, e) {
  for (let t = 0; t < e.length; t++)
    if (n.eq(e[t]))
      return e[t];
}
class Ke {
  constructor(e, t) {
    this.nodes = e, this.marks = t;
  }
  serializeFragment(e, t = {}, r) {
    r || (r = fi(t).createDocumentFragment());
    let i = r, o = [];
    return e.forEach((s) => {
      if (o.length || s.marks.length) {
        let a = 0, l = 0;
        for (; a < o.length && l < s.marks.length; ) {
          let c = s.marks[l];
          if (!this.marks[c.type.name]) {
            l++;
            continue;
          }
          if (!c.eq(o[a][0]) || c.type.spec.spanning === !1)
            break;
          a++, l++;
        }
        for (; a < o.length; )
          i = o.pop()[1];
        for (; l < s.marks.length; ) {
          let c = s.marks[l++], u = this.serializeMark(c, s.isInline, t);
          u && (o.push([c, i]), i.appendChild(u.dom), i = u.contentDOM || u.dom);
        }
      }
      i.appendChild(this.serializeNodeInner(s, t));
    }), r;
  }
  serializeNodeInner(e, t) {
    let { dom: r, contentDOM: i } = Ke.renderSpec(fi(t), this.nodes[e.type.name](e));
    if (i) {
      if (e.isLeaf)
        throw new RangeError("Content hole not allowed in a leaf node spec");
      this.serializeFragment(e.content, t, i);
    }
    return r;
  }
  serializeNode(e, t = {}) {
    let r = this.serializeNodeInner(e, t);
    for (let i = e.marks.length - 1; i >= 0; i--) {
      let o = this.serializeMark(e.marks[i], e.isInline, t);
      o && ((o.contentDOM || o.dom).appendChild(r), r = o.dom);
    }
    return r;
  }
  serializeMark(e, t, r = {}) {
    let i = this.marks[e.type.name];
    return i && Ke.renderSpec(fi(r), i(e, t));
  }
  static renderSpec(e, t, r = null) {
    if (typeof t == "string")
      return { dom: e.createTextNode(t) };
    if (t.nodeType != null)
      return { dom: t };
    if (t.dom && t.dom.nodeType != null)
      return t;
    let i = t[0], o = i.indexOf(" ");
    o > 0 && (r = i.slice(0, o), i = i.slice(o + 1));
    let s, a = r ? e.createElementNS(r, i) : e.createElement(i), l = t[1], c = 1;
    if (l && typeof l == "object" && l.nodeType == null && !Array.isArray(l)) {
      c = 2;
      for (let u in l)
        if (l[u] != null) {
          let d = u.indexOf(" ");
          d > 0 ? a.setAttributeNS(u.slice(0, d), u.slice(d + 1), l[u]) : a.setAttribute(u, l[u]);
        }
    }
    for (let u = c; u < t.length; u++) {
      let d = t[u];
      if (d === 0) {
        if (u < t.length - 1 || u > c)
          throw new RangeError("Content hole must be the only child of its parent node");
        return { dom: a, contentDOM: a };
      } else {
        let { dom: f, contentDOM: p } = Ke.renderSpec(e, d, r);
        if (a.appendChild(f), p) {
          if (s)
            throw new RangeError("Multiple content holes");
          s = p;
        }
      }
    }
    return { dom: a, contentDOM: s };
  }
  static fromSchema(e) {
    return e.cached.domSerializer || (e.cached.domSerializer = new Ke(this.nodesFromSchema(e), this.marksFromSchema(e)));
  }
  static nodesFromSchema(e) {
    let t = Go(e.nodes);
    return t.text || (t.text = (r) => r.text), t;
  }
  static marksFromSchema(e) {
    return Go(e.marks);
  }
}
function Go(n) {
  let e = {};
  for (let t in n) {
    let r = n[t].spec.toDOM;
    r && (e[t] = r);
  }
  return e;
}
function fi(n) {
  return n.document || window.document;
}
const Ha = 65535, Wa = Math.pow(2, 16);
function Iu(n, e) {
  return n + e * Wa;
}
function Yo(n) {
  return n & Ha;
}
function Pu(n) {
  return (n - (n & Ha)) / Wa;
}
const qa = 1, Ka = 2, kr = 4, Ja = 8;
class zi {
  constructor(e, t, r) {
    this.pos = e, this.delInfo = t, this.recover = r;
  }
  get deleted() {
    return (this.delInfo & Ja) > 0;
  }
  get deletedBefore() {
    return (this.delInfo & (qa | kr)) > 0;
  }
  get deletedAfter() {
    return (this.delInfo & (Ka | kr)) > 0;
  }
  get deletedAcross() {
    return (this.delInfo & kr) > 0;
  }
}
class Ce {
  constructor(e, t = !1) {
    if (this.ranges = e, this.inverted = t, !e.length && Ce.empty)
      return Ce.empty;
  }
  recover(e) {
    let t = 0, r = Yo(e);
    if (!this.inverted)
      for (let i = 0; i < r; i++)
        t += this.ranges[i * 3 + 2] - this.ranges[i * 3 + 1];
    return this.ranges[r * 3] + t + Pu(e);
  }
  mapResult(e, t = 1) {
    return this._map(e, t, !1);
  }
  map(e, t = 1) {
    return this._map(e, t, !0);
  }
  _map(e, t, r) {
    let i = 0, o = this.inverted ? 2 : 1, s = this.inverted ? 1 : 2;
    for (let a = 0; a < this.ranges.length; a += 3) {
      let l = this.ranges[a] - (this.inverted ? i : 0);
      if (l > e)
        break;
      let c = this.ranges[a + o], u = this.ranges[a + s], d = l + c;
      if (e <= d) {
        let f = c ? e == l ? -1 : e == d ? 1 : t : t, p = l + i + (f < 0 ? 0 : u);
        if (r)
          return p;
        let h = e == (t < 0 ? l : d) ? null : Iu(a / 3, e - l), m = e == l ? Ka : e == d ? qa : kr;
        return (t < 0 ? e != l : e != d) && (m |= Ja), new zi(p, m, h);
      }
      i += u - c;
    }
    return r ? e + i : new zi(e + i, 0, null);
  }
  touches(e, t) {
    let r = 0, i = Yo(t), o = this.inverted ? 2 : 1, s = this.inverted ? 1 : 2;
    for (let a = 0; a < this.ranges.length; a += 3) {
      let l = this.ranges[a] - (this.inverted ? r : 0);
      if (l > e)
        break;
      let c = this.ranges[a + o], u = l + c;
      if (e <= u && a == i * 3)
        return !0;
      r += this.ranges[a + s] - c;
    }
    return !1;
  }
  forEach(e) {
    let t = this.inverted ? 2 : 1, r = this.inverted ? 1 : 2;
    for (let i = 0, o = 0; i < this.ranges.length; i += 3) {
      let s = this.ranges[i], a = s - (this.inverted ? o : 0), l = s + (this.inverted ? 0 : o), c = this.ranges[i + t], u = this.ranges[i + r];
      e(a, a + c, l, l + u), o += u - c;
    }
  }
  invert() {
    return new Ce(this.ranges, !this.inverted);
  }
  toString() {
    return (this.inverted ? "-" : "") + JSON.stringify(this.ranges);
  }
  static offset(e) {
    return e == 0 ? Ce.empty : new Ce(e < 0 ? [0, -e, 0] : [0, 0, e]);
  }
}
Ce.empty = new Ce([]);
class fn {
  constructor(e = [], t, r = 0, i = e.length) {
    this.maps = e, this.mirror = t, this.from = r, this.to = i;
  }
  slice(e = 0, t = this.maps.length) {
    return new fn(this.maps, this.mirror, e, t);
  }
  copy() {
    return new fn(this.maps.slice(), this.mirror && this.mirror.slice(), this.from, this.to);
  }
  appendMap(e, t) {
    this.to = this.maps.push(e), t != null && this.setMirror(this.maps.length - 1, t);
  }
  appendMapping(e) {
    for (let t = 0, r = this.maps.length; t < e.maps.length; t++) {
      let i = e.getMirror(t);
      this.appendMap(e.maps[t], i != null && i < t ? r + i : void 0);
    }
  }
  getMirror(e) {
    if (this.mirror) {
      for (let t = 0; t < this.mirror.length; t++)
        if (this.mirror[t] == e)
          return this.mirror[t + (t % 2 ? -1 : 1)];
    }
  }
  setMirror(e, t) {
    this.mirror || (this.mirror = []), this.mirror.push(e, t);
  }
  appendMappingInverted(e) {
    for (let t = e.maps.length - 1, r = this.maps.length + e.maps.length; t >= 0; t--) {
      let i = e.getMirror(t);
      this.appendMap(e.maps[t].invert(), i != null && i > t ? r - i - 1 : void 0);
    }
  }
  invert() {
    let e = new fn();
    return e.appendMappingInverted(this), e;
  }
  map(e, t = 1) {
    if (this.mirror)
      return this._map(e, t, !0);
    for (let r = this.from; r < this.to; r++)
      e = this.maps[r].map(e, t);
    return e;
  }
  mapResult(e, t = 1) {
    return this._map(e, t, !1);
  }
  _map(e, t, r) {
    let i = 0;
    for (let o = this.from; o < this.to; o++) {
      let s = this.maps[o], a = s.mapResult(e, t);
      if (a.recover != null) {
        let l = this.getMirror(o);
        if (l != null && l > o && l < this.to) {
          o = l, e = this.maps[l].recover(a.recover);
          continue;
        }
      }
      i |= a.delInfo, e = a.pos;
    }
    return r ? e : new zi(e, i, null);
  }
}
const pi = /* @__PURE__ */ Object.create(null);
class be {
  getMap() {
    return Ce.empty;
  }
  merge(e) {
    return null;
  }
  static fromJSON(e, t) {
    if (!t || !t.stepType)
      throw new RangeError("Invalid input for Step.fromJSON");
    let r = pi[t.stepType];
    if (!r)
      throw new RangeError(`No step type ${t.stepType} defined`);
    return r.fromJSON(e, t);
  }
  static jsonID(e, t) {
    if (e in pi)
      throw new RangeError("Duplicate use of step JSON ID " + e);
    return pi[e] = t, t.prototype.jsonID = e, t;
  }
}
class J {
  constructor(e, t) {
    this.doc = e, this.failed = t;
  }
  static ok(e) {
    return new J(e, null);
  }
  static fail(e) {
    return new J(null, e);
  }
  static fromReplace(e, t, r, i) {
    try {
      return J.ok(e.replace(t, r, i));
    } catch (o) {
      if (o instanceof Tr)
        return J.fail(o.message);
      throw o;
    }
  }
}
function fo(n, e, t) {
  let r = [];
  for (let i = 0; i < n.childCount; i++) {
    let o = n.child(i);
    o.content.size && (o = o.copy(fo(o.content, e, o))), o.isInline && (o = e(o, t, i)), r.push(o);
  }
  return x.fromArray(r);
}
class gt extends be {
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = e.resolve(this.from), i = r.node(r.sharedDepth(this.to)), o = new S(fo(t.content, (s, a) => !s.isAtom || !a.type.allowsMarkType(this.mark.type) ? s : s.mark(this.mark.addToSet(s.marks)), i), t.openStart, t.openEnd);
    return J.fromReplace(e, this.from, this.to, o);
  }
  invert() {
    return new Je(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deleted && r.deleted || t.pos >= r.pos ? null : new gt(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof gt && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new gt(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
  }
  toJSON() {
    return {
      stepType: "addMark",
      mark: this.mark.toJSON(),
      from: this.from,
      to: this.to
    };
  }
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for AddMarkStep.fromJSON");
    return new gt(t.from, t.to, e.markFromJSON(t.mark));
  }
}
be.jsonID("addMark", gt);
class Je extends be {
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = new S(fo(t.content, (i) => i.mark(this.mark.removeFromSet(i.marks)), e), t.openStart, t.openEnd);
    return J.fromReplace(e, this.from, this.to, r);
  }
  invert() {
    return new gt(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deleted && r.deleted || t.pos >= r.pos ? null : new Je(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof Je && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new Je(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
  }
  toJSON() {
    return {
      stepType: "removeMark",
      mark: this.mark.toJSON(),
      from: this.from,
      to: this.to
    };
  }
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for RemoveMarkStep.fromJSON");
    return new Je(t.from, t.to, e.markFromJSON(t.mark));
  }
}
be.jsonID("removeMark", Je);
class yt extends be {
  constructor(e, t) {
    super(), this.pos = e, this.mark = t;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return J.fail("No node at mark step's position");
    let r = t.type.create(t.attrs, null, this.mark.addToSet(t.marks));
    return J.fromReplace(e, this.pos, this.pos + 1, new S(x.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    if (t) {
      let r = this.mark.addToSet(t.marks);
      if (r.length == t.marks.length) {
        for (let i = 0; i < t.marks.length; i++)
          if (!t.marks[i].isInSet(r))
            return new yt(this.pos, t.marks[i]);
        return new yt(this.pos, this.mark);
      }
    }
    return new mn(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new yt(t.pos, this.mark);
  }
  toJSON() {
    return { stepType: "addNodeMark", pos: this.pos, mark: this.mark.toJSON() };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for AddNodeMarkStep.fromJSON");
    return new yt(t.pos, e.markFromJSON(t.mark));
  }
}
be.jsonID("addNodeMark", yt);
class mn extends be {
  constructor(e, t) {
    super(), this.pos = e, this.mark = t;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return J.fail("No node at mark step's position");
    let r = t.type.create(t.attrs, null, this.mark.removeFromSet(t.marks));
    return J.fromReplace(e, this.pos, this.pos + 1, new S(x.from(r), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    return !t || !this.mark.isInSet(t.marks) ? this : new yt(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new mn(t.pos, this.mark);
  }
  toJSON() {
    return { stepType: "removeNodeMark", pos: this.pos, mark: this.mark.toJSON() };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for RemoveNodeMarkStep.fromJSON");
    return new mn(t.pos, e.markFromJSON(t.mark));
  }
}
be.jsonID("removeNodeMark", mn);
class Q extends be {
  constructor(e, t, r, i = !1) {
    super(), this.from = e, this.to = t, this.slice = r, this.structure = i;
  }
  apply(e) {
    return this.structure && Vi(e, this.from, this.to) ? J.fail("Structure replace would overwrite content") : J.fromReplace(e, this.from, this.to, this.slice);
  }
  getMap() {
    return new Ce([this.from, this.to - this.from, this.slice.size]);
  }
  invert(e) {
    return new Q(this.from, this.from + this.slice.size, e.slice(this.from, this.to));
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deletedAcross && r.deletedAcross ? null : new Q(t.pos, Math.max(t.pos, r.pos), this.slice);
  }
  merge(e) {
    if (!(e instanceof Q) || e.structure || this.structure)
      return null;
    if (this.from + this.slice.size == e.from && !this.slice.openEnd && !e.slice.openStart) {
      let t = this.slice.size + e.slice.size == 0 ? S.empty : new S(this.slice.content.append(e.slice.content), this.slice.openStart, e.slice.openEnd);
      return new Q(this.from, this.to + (e.to - e.from), t, this.structure);
    } else if (e.to == this.from && !this.slice.openStart && !e.slice.openEnd) {
      let t = this.slice.size + e.slice.size == 0 ? S.empty : new S(e.slice.content.append(this.slice.content), e.slice.openStart, this.slice.openEnd);
      return new Q(e.from, this.to, t, this.structure);
    } else
      return null;
  }
  toJSON() {
    let e = { stepType: "replace", from: this.from, to: this.to };
    return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
  }
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for ReplaceStep.fromJSON");
    return new Q(t.from, t.to, S.fromJSON(e, t.slice), !!t.structure);
  }
}
be.jsonID("replace", Q);
class _ extends be {
  constructor(e, t, r, i, o, s, a = !1) {
    super(), this.from = e, this.to = t, this.gapFrom = r, this.gapTo = i, this.slice = o, this.insert = s, this.structure = a;
  }
  apply(e) {
    if (this.structure && (Vi(e, this.from, this.gapFrom) || Vi(e, this.gapTo, this.to)))
      return J.fail("Structure gap-replace would overwrite content");
    let t = e.slice(this.gapFrom, this.gapTo);
    if (t.openStart || t.openEnd)
      return J.fail("Gap is not a flat range");
    let r = this.slice.insertAt(this.insert, t.content);
    return r ? J.fromReplace(e, this.from, this.to, r) : J.fail("Content does not fit in gap");
  }
  getMap() {
    return new Ce([
      this.from,
      this.gapFrom - this.from,
      this.insert,
      this.gapTo,
      this.to - this.gapTo,
      this.slice.size - this.insert
    ]);
  }
  invert(e) {
    let t = this.gapTo - this.gapFrom;
    return new _(this.from, this.from + this.slice.size + t, this.from + this.insert, this.from + this.insert + t, e.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1), i = e.map(this.gapFrom, -1), o = e.map(this.gapTo, 1);
    return t.deletedAcross && r.deletedAcross || i < t.pos || o > r.pos ? null : new _(t.pos, r.pos, i, o, this.slice, this.insert, this.structure);
  }
  toJSON() {
    let e = {
      stepType: "replaceAround",
      from: this.from,
      to: this.to,
      gapFrom: this.gapFrom,
      gapTo: this.gapTo,
      insert: this.insert
    };
    return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
  }
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number" || typeof t.gapFrom != "number" || typeof t.gapTo != "number" || typeof t.insert != "number")
      throw new RangeError("Invalid input for ReplaceAroundStep.fromJSON");
    return new _(t.from, t.to, t.gapFrom, t.gapTo, S.fromJSON(e, t.slice), t.insert, !!t.structure);
  }
}
be.jsonID("replaceAround", _);
function Vi(n, e, t) {
  let r = n.resolve(e), i = t - e, o = r.depth;
  for (; i > 0 && o > 0 && r.indexAfter(o) == r.node(o).childCount; )
    o--, i--;
  if (i > 0) {
    let s = r.node(o).maybeChild(r.indexAfter(o));
    for (; i > 0; ) {
      if (!s || s.isLeaf)
        return !0;
      s = s.firstChild, i--;
    }
  }
  return !1;
}
function Ru(n, e, t, r) {
  let i = [], o = [], s, a;
  n.doc.nodesBetween(e, t, (l, c, u) => {
    if (!l.isInline)
      return;
    let d = l.marks;
    if (!r.isInSet(d) && u.type.allowsMarkType(r.type)) {
      let f = Math.max(c, e), p = Math.min(c + l.nodeSize, t), h = r.addToSet(d);
      for (let m = 0; m < d.length; m++)
        d[m].isInSet(h) || (s && s.to == f && s.mark.eq(d[m]) ? s.to = p : i.push(s = new Je(f, p, d[m])));
      a && a.to == f ? a.to = p : o.push(a = new gt(f, p, r));
    }
  }), i.forEach((l) => n.step(l)), o.forEach((l) => n.step(l));
}
function Bu(n, e, t, r) {
  let i = [], o = 0;
  n.doc.nodesBetween(e, t, (s, a) => {
    if (!s.isInline)
      return;
    o++;
    let l = null;
    if (r instanceof _r) {
      let c = s.marks, u;
      for (; u = r.isInSet(c); )
        (l || (l = [])).push(u), c = u.removeFromSet(c);
    } else
      r ? r.isInSet(s.marks) && (l = [r]) : l = s.marks;
    if (l && l.length) {
      let c = Math.min(a + s.nodeSize, t);
      for (let u = 0; u < l.length; u++) {
        let d = l[u], f;
        for (let p = 0; p < i.length; p++) {
          let h = i[p];
          h.step == o - 1 && d.eq(i[p].style) && (f = h);
        }
        f ? (f.to = c, f.step = o) : i.push({ style: d, from: Math.max(a, e), to: c, step: o });
      }
    }
  }), i.forEach((s) => n.step(new Je(s.from, s.to, s.style)));
}
function Lu(n, e, t, r = t.contentMatch) {
  let i = n.doc.nodeAt(e), o = [], s = e + 1;
  for (let a = 0; a < i.childCount; a++) {
    let l = i.child(a), c = s + l.nodeSize, u = r.matchType(l.type);
    if (!u)
      o.push(new Q(s, c, S.empty));
    else {
      r = u;
      for (let d = 0; d < l.marks.length; d++)
        t.allowsMarkType(l.marks[d].type) || n.step(new Je(s, c, l.marks[d]));
    }
    s = c;
  }
  if (!r.validEnd) {
    let a = r.fillBefore(x.empty, !0);
    n.replace(s, s, new S(a, 0, 0));
  }
  for (let a = o.length - 1; a >= 0; a--)
    n.step(o[a]);
}
function $u(n, e, t) {
  return (e == 0 || n.canReplace(e, n.childCount)) && (t == n.childCount || n.canReplace(0, t));
}
function Gt(n) {
  let t = n.parent.content.cutByIndex(n.startIndex, n.endIndex);
  for (let r = n.depth; ; --r) {
    let i = n.$from.node(r), o = n.$from.index(r), s = n.$to.indexAfter(r);
    if (r < n.depth && i.canReplace(o, s, t))
      return r;
    if (r == 0 || i.type.spec.isolating || !$u(i, o, s))
      break;
  }
  return null;
}
function Fu(n, e, t) {
  let { $from: r, $to: i, depth: o } = e, s = r.before(o + 1), a = i.after(o + 1), l = s, c = a, u = x.empty, d = 0;
  for (let h = o, m = !1; h > t; h--)
    m || r.index(h) > 0 ? (m = !0, u = x.from(r.node(h).copy(u)), d++) : l--;
  let f = x.empty, p = 0;
  for (let h = o, m = !1; h > t; h--)
    m || i.after(h + 1) < i.end(h) ? (m = !0, f = x.from(i.node(h).copy(f)), p++) : c++;
  n.step(new _(l, c, s, a, new S(u.append(f), d, p), u.size - d, !0));
}
function po(n, e, t = null, r = n) {
  let i = zu(n, e), o = i && Vu(r, e);
  return o ? i.map(Xo).concat({ type: e, attrs: t }).concat(o.map(Xo)) : null;
}
function Xo(n) {
  return { type: n, attrs: null };
}
function zu(n, e) {
  let { parent: t, startIndex: r, endIndex: i } = n, o = t.contentMatchAt(r).findWrapping(e);
  if (!o)
    return null;
  let s = o.length ? o[0] : e;
  return t.canReplaceWith(r, i, s) ? o : null;
}
function Vu(n, e) {
  let { parent: t, startIndex: r, endIndex: i } = n, o = t.child(r), s = e.contentMatch.findWrapping(o.type);
  if (!s)
    return null;
  let l = (s.length ? s[s.length - 1] : e).contentMatch;
  for (let c = r; l && c < i; c++)
    l = l.matchType(t.child(c).type);
  return !l || !l.validEnd ? null : s;
}
function ju(n, e, t) {
  let r = x.empty;
  for (let s = t.length - 1; s >= 0; s--) {
    if (r.size) {
      let a = t[s].type.contentMatch.matchFragment(r);
      if (!a || !a.validEnd)
        throw new RangeError("Wrapper type given to Transform.wrap does not form valid content of its parent wrapper");
    }
    r = x.from(t[s].type.create(t[s].attrs, r));
  }
  let i = e.start, o = e.end;
  n.step(new _(i, o, i, o, new S(r, 0, 0), t.length, !0));
}
function Hu(n, e, t, r, i) {
  if (!r.isTextblock)
    throw new RangeError("Type given to setBlockType should be a textblock");
  let o = n.steps.length;
  n.doc.nodesBetween(e, t, (s, a) => {
    if (s.isTextblock && !s.hasMarkup(r, i) && Wu(n.doc, n.mapping.slice(o).map(a), r)) {
      n.clearIncompatible(n.mapping.slice(o).map(a, 1), r);
      let l = n.mapping.slice(o), c = l.map(a, 1), u = l.map(a + s.nodeSize, 1);
      return n.step(new _(c, u, c + 1, u - 1, new S(x.from(r.create(i, null, s.marks)), 0, 0), 1, !0)), !1;
    }
  });
}
function Wu(n, e, t) {
  let r = n.resolve(e), i = r.index();
  return r.parent.canReplaceWith(i, i + 1, t);
}
function qu(n, e, t, r, i) {
  let o = n.doc.nodeAt(e);
  if (!o)
    throw new RangeError("No node at given position");
  t || (t = o.type);
  let s = t.create(r, null, i || o.marks);
  if (o.isLeaf)
    return n.replaceWith(e, e + o.nodeSize, s);
  if (!t.validContent(o.content))
    throw new RangeError("Invalid content for node type " + t.name);
  n.step(new _(e, e + o.nodeSize, e + 1, e + o.nodeSize - 1, new S(x.from(s), 0, 0), 1, !0));
}
function Ue(n, e, t = 1, r) {
  let i = n.resolve(e), o = i.depth - t, s = r && r[r.length - 1] || i.parent;
  if (o < 0 || i.parent.type.spec.isolating || !i.parent.canReplace(i.index(), i.parent.childCount) || !s.type.validContent(i.parent.content.cutByIndex(i.index(), i.parent.childCount)))
    return !1;
  for (let c = i.depth - 1, u = t - 2; c > o; c--, u--) {
    let d = i.node(c), f = i.index(c);
    if (d.type.spec.isolating)
      return !1;
    let p = d.content.cutByIndex(f, d.childCount), h = r && r[u] || d;
    if (h != d && (p = p.replaceChild(0, h.type.create(h.attrs))), !d.canReplace(f + 1, d.childCount) || !h.type.validContent(p))
      return !1;
  }
  let a = i.indexAfter(o), l = r && r[0];
  return i.node(o).canReplaceWith(a, a, l ? l.type : i.node(o + 1).type);
}
function Ku(n, e, t = 1, r) {
  let i = n.doc.resolve(e), o = x.empty, s = x.empty;
  for (let a = i.depth, l = i.depth - t, c = t - 1; a > l; a--, c--) {
    o = x.from(i.node(a).copy(o));
    let u = r && r[c];
    s = x.from(u ? u.type.create(u.attrs, s) : i.node(a).copy(s));
  }
  n.step(new Q(e, e, new S(o.append(s), t, t), !0));
}
function Ze(n, e) {
  let t = n.resolve(e), r = t.index();
  return _a(t.nodeBefore, t.nodeAfter) && t.parent.canReplace(r, r + 1);
}
function _a(n, e) {
  return !!(n && e && !n.isLeaf && n.canAppend(e));
}
function Ua(n, e, t = -1) {
  let r = n.resolve(e);
  for (let i = r.depth; ; i--) {
    let o, s, a = r.index(i);
    if (i == r.depth ? (o = r.nodeBefore, s = r.nodeAfter) : t > 0 ? (o = r.node(i + 1), a++, s = r.node(i).maybeChild(a)) : (o = r.node(i).maybeChild(a - 1), s = r.node(i + 1)), o && !o.isTextblock && _a(o, s) && r.node(i).canReplace(a, a + 1))
      return e;
    if (i == 0)
      break;
    e = t < 0 ? r.before(i) : r.after(i);
  }
}
function Ju(n, e, t) {
  let r = new Q(e - t, e + t, S.empty, !0);
  n.step(r);
}
function _u(n, e, t) {
  let r = n.resolve(e);
  if (r.parent.canReplaceWith(r.index(), r.index(), t))
    return e;
  if (r.parentOffset == 0)
    for (let i = r.depth - 1; i >= 0; i--) {
      let o = r.index(i);
      if (r.node(i).canReplaceWith(o, o, t))
        return r.before(i + 1);
      if (o > 0)
        return null;
    }
  if (r.parentOffset == r.parent.content.size)
    for (let i = r.depth - 1; i >= 0; i--) {
      let o = r.indexAfter(i);
      if (r.node(i).canReplaceWith(o, o, t))
        return r.after(i + 1);
      if (o < r.node(i).childCount)
        return null;
    }
  return null;
}
function Ga(n, e, t) {
  let r = n.resolve(e);
  if (!t.content.size)
    return e;
  let i = t.content;
  for (let o = 0; o < t.openStart; o++)
    i = i.firstChild.content;
  for (let o = 1; o <= (t.openStart == 0 && t.size ? 2 : 1); o++)
    for (let s = r.depth; s >= 0; s--) {
      let a = s == r.depth ? 0 : r.pos <= (r.start(s + 1) + r.end(s + 1)) / 2 ? -1 : 1, l = r.index(s) + (a > 0 ? 1 : 0), c = r.node(s), u = !1;
      if (o == 1)
        u = c.canReplace(l, l, i);
      else {
        let d = c.contentMatchAt(l).findWrapping(i.firstChild.type);
        u = d && c.canReplaceWith(l, l, d[0]);
      }
      if (u)
        return a == 0 ? r.pos : a < 0 ? r.before(s + 1) : r.after(s + 1);
    }
  return null;
}
function ho(n, e, t = e, r = S.empty) {
  if (e == t && !r.size)
    return null;
  let i = n.resolve(e), o = n.resolve(t);
  return Ya(i, o, r) ? new Q(e, t, r) : new Uu(i, o, r).fit();
}
function Ya(n, e, t) {
  return !t.openStart && !t.openEnd && n.start() == e.start() && n.parent.canReplace(n.index(), e.index(), t.content);
}
class Uu {
  constructor(e, t, r) {
    this.$from = e, this.$to = t, this.unplaced = r, this.frontier = [], this.placed = x.empty;
    for (let i = 0; i <= e.depth; i++) {
      let o = e.node(i);
      this.frontier.push({
        type: o.type,
        match: o.contentMatchAt(e.indexAfter(i))
      });
    }
    for (let i = e.depth; i > 0; i--)
      this.placed = x.from(e.node(i).copy(this.placed));
  }
  get depth() {
    return this.frontier.length - 1;
  }
  fit() {
    for (; this.unplaced.size; ) {
      let c = this.findFittable();
      c ? this.placeNodes(c) : this.openMore() || this.dropNode();
    }
    let e = this.mustMoveInline(), t = this.placed.size - this.depth - this.$from.depth, r = this.$from, i = this.close(e < 0 ? this.$to : r.doc.resolve(e));
    if (!i)
      return null;
    let o = this.placed, s = r.depth, a = i.depth;
    for (; s && a && o.childCount == 1; )
      o = o.firstChild.content, s--, a--;
    let l = new S(o, s, a);
    return e > -1 ? new _(r.pos, e, this.$to.pos, this.$to.end(), l, t) : l.size || r.pos != this.$to.pos ? new Q(r.pos, i.pos, l) : null;
  }
  findFittable() {
    for (let e = 1; e <= 2; e++)
      for (let t = this.unplaced.openStart; t >= 0; t--) {
        let r, i = null;
        t ? (i = hi(this.unplaced.content, t - 1).firstChild, r = i.content) : r = this.unplaced.content;
        let o = r.firstChild;
        for (let s = this.depth; s >= 0; s--) {
          let { type: a, match: l } = this.frontier[s], c, u = null;
          if (e == 1 && (o ? l.matchType(o.type) || (u = l.fillBefore(x.from(o), !1)) : i && a.compatibleContent(i.type)))
            return { sliceDepth: t, frontierDepth: s, parent: i, inject: u };
          if (e == 2 && o && (c = l.findWrapping(o.type)))
            return { sliceDepth: t, frontierDepth: s, parent: i, wrap: c };
          if (i && l.matchType(i.type))
            break;
        }
      }
  }
  openMore() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced, i = hi(e, t);
    return !i.childCount || i.firstChild.isLeaf ? !1 : (this.unplaced = new S(e, t + 1, Math.max(r, i.size + t >= e.size - r ? t + 1 : 0)), !0);
  }
  dropNode() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced, i = hi(e, t);
    if (i.childCount <= 1 && t > 0) {
      let o = e.size - t <= t + i.size;
      this.unplaced = new S(Bn(e, t - 1, 1), t - 1, o ? t - 1 : r);
    } else
      this.unplaced = new S(Bn(e, t, 1), t, r);
  }
  placeNodes({ sliceDepth: e, frontierDepth: t, parent: r, inject: i, wrap: o }) {
    for (; this.depth > t; )
      this.closeFrontierNode();
    if (o)
      for (let m = 0; m < o.length; m++)
        this.openFrontierNode(o[m]);
    let s = this.unplaced, a = r ? r.content : s.content, l = s.openStart - e, c = 0, u = [], { match: d, type: f } = this.frontier[t];
    if (i) {
      for (let m = 0; m < i.childCount; m++)
        u.push(i.child(m));
      d = d.matchFragment(i);
    }
    let p = a.size + e - (s.content.size - s.openEnd);
    for (; c < a.childCount; ) {
      let m = a.child(c), y = d.matchType(m.type);
      if (!y)
        break;
      c++, (c > 1 || l == 0 || m.content.size) && (d = y, u.push(Xa(m.mark(f.allowedMarks(m.marks)), c == 1 ? l : 0, c == a.childCount ? p : -1)));
    }
    let h = c == a.childCount;
    h || (p = -1), this.placed = Ln(this.placed, t, x.from(u)), this.frontier[t].match = d, h && p < 0 && r && r.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
    for (let m = 0, y = a; m < p; m++) {
      let b = y.lastChild;
      this.frontier.push({ type: b.type, match: b.contentMatchAt(b.childCount) }), y = b.content;
    }
    this.unplaced = h ? e == 0 ? S.empty : new S(Bn(s.content, e - 1, 1), e - 1, p < 0 ? s.openEnd : e - 1) : new S(Bn(s.content, e, c), s.openStart, s.openEnd);
  }
  mustMoveInline() {
    if (!this.$to.parent.isTextblock)
      return -1;
    let e = this.frontier[this.depth], t;
    if (!e.type.isTextblock || !mi(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth)
      return -1;
    let { depth: r } = this.$to, i = this.$to.after(r);
    for (; r > 1 && i == this.$to.end(--r); )
      ++i;
    return i;
  }
  findCloseLevel(e) {
    e:
      for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
        let { match: r, type: i } = this.frontier[t], o = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)), s = mi(e, t, i, r, o);
        if (!!s) {
          for (let a = t - 1; a >= 0; a--) {
            let { match: l, type: c } = this.frontier[a], u = mi(e, a, c, l, !0);
            if (!u || u.childCount)
              continue e;
          }
          return { depth: t, fit: s, move: o ? e.doc.resolve(e.after(t + 1)) : e };
        }
      }
  }
  close(e) {
    let t = this.findCloseLevel(e);
    if (!t)
      return null;
    for (; this.depth > t.depth; )
      this.closeFrontierNode();
    t.fit.childCount && (this.placed = Ln(this.placed, t.depth, t.fit)), e = t.move;
    for (let r = t.depth + 1; r <= e.depth; r++) {
      let i = e.node(r), o = i.type.contentMatch.fillBefore(i.content, !0, e.index(r));
      this.openFrontierNode(i.type, i.attrs, o);
    }
    return e;
  }
  openFrontierNode(e, t = null, r) {
    let i = this.frontier[this.depth];
    i.match = i.match.matchType(e), this.placed = Ln(this.placed, this.depth, x.from(e.create(t, r))), this.frontier.push({ type: e, match: e.contentMatch });
  }
  closeFrontierNode() {
    let t = this.frontier.pop().match.fillBefore(x.empty, !0);
    t.childCount && (this.placed = Ln(this.placed, this.frontier.length, t));
  }
}
function Bn(n, e, t) {
  return e == 0 ? n.cutByIndex(t, n.childCount) : n.replaceChild(0, n.firstChild.copy(Bn(n.firstChild.content, e - 1, t)));
}
function Ln(n, e, t) {
  return e == 0 ? n.append(t) : n.replaceChild(n.childCount - 1, n.lastChild.copy(Ln(n.lastChild.content, e - 1, t)));
}
function hi(n, e) {
  for (let t = 0; t < e; t++)
    n = n.firstChild.content;
  return n;
}
function Xa(n, e, t) {
  if (e <= 0)
    return n;
  let r = n.content;
  return e > 1 && (r = r.replaceChild(0, Xa(r.firstChild, e - 1, r.childCount == 1 ? t - 1 : 0))), e > 0 && (r = n.type.contentMatch.fillBefore(r).append(r), t <= 0 && (r = r.append(n.type.contentMatch.matchFragment(r).fillBefore(x.empty, !0)))), n.copy(r);
}
function mi(n, e, t, r, i) {
  let o = n.node(e), s = i ? n.indexAfter(e) : n.index(e);
  if (s == o.childCount && !t.compatibleContent(o.type))
    return null;
  let a = r.fillBefore(o.content, !0, s);
  return a && !Gu(t, o.content, s) ? a : null;
}
function Gu(n, e, t) {
  for (let r = t; r < e.childCount; r++)
    if (!n.allowsMarks(e.child(r).marks))
      return !0;
  return !1;
}
function Yu(n) {
  return n.spec.defining || n.spec.definingForContent;
}
function Xu(n, e, t, r) {
  if (!r.size)
    return n.deleteRange(e, t);
  let i = n.doc.resolve(e), o = n.doc.resolve(t);
  if (Ya(i, o, r))
    return n.step(new Q(e, t, r));
  let s = Qa(i, n.doc.resolve(t));
  s[s.length - 1] == 0 && s.pop();
  let a = -(i.depth + 1);
  s.unshift(a);
  for (let f = i.depth, p = i.pos - 1; f > 0; f--, p--) {
    let h = i.node(f).type.spec;
    if (h.defining || h.definingAsContext || h.isolating)
      break;
    s.indexOf(f) > -1 ? a = f : i.before(f) == p && s.splice(1, 0, -f);
  }
  let l = s.indexOf(a), c = [], u = r.openStart;
  for (let f = r.content, p = 0; ; p++) {
    let h = f.firstChild;
    if (c.push(h), p == r.openStart)
      break;
    f = h.content;
  }
  for (let f = u - 1; f >= 0; f--) {
    let p = c[f].type, h = Yu(p);
    if (h && i.node(l).type != p)
      u = f;
    else if (h || !p.isTextblock)
      break;
  }
  for (let f = r.openStart; f >= 0; f--) {
    let p = (f + u + 1) % (r.openStart + 1), h = c[p];
    if (!!h)
      for (let m = 0; m < s.length; m++) {
        let y = s[(m + l) % s.length], b = !0;
        y < 0 && (b = !1, y = -y);
        let w = i.node(y - 1), E = i.index(y - 1);
        if (w.canReplaceWith(E, E, h.type, h.marks))
          return n.replace(i.before(y), b ? o.after(y) : t, new S(Za(r.content, 0, r.openStart, p), p, r.openEnd));
      }
  }
  let d = n.steps.length;
  for (let f = s.length - 1; f >= 0 && (n.replace(e, t, r), !(n.steps.length > d)); f--) {
    let p = s[f];
    p < 0 || (e = i.before(p), t = o.after(p));
  }
}
function Za(n, e, t, r, i) {
  if (e < t) {
    let o = n.firstChild;
    n = n.replaceChild(0, o.copy(Za(o.content, e + 1, t, r, o)));
  }
  if (e > r) {
    let o = i.contentMatchAt(0), s = o.fillBefore(n).append(n);
    n = s.append(o.matchFragment(s).fillBefore(x.empty, !0));
  }
  return n;
}
function Zu(n, e, t, r) {
  if (!r.isInline && e == t && n.doc.resolve(e).parent.content.size) {
    let i = _u(n.doc, e, r.type);
    i != null && (e = t = i);
  }
  n.replaceRange(e, t, new S(x.from(r), 0, 0));
}
function Qu(n, e, t) {
  let r = n.doc.resolve(e), i = n.doc.resolve(t), o = Qa(r, i);
  for (let s = 0; s < o.length; s++) {
    let a = o[s], l = s == o.length - 1;
    if (l && a == 0 || r.node(a).type.contentMatch.validEnd)
      return n.delete(r.start(a), i.end(a));
    if (a > 0 && (l || r.node(a - 1).canReplace(r.index(a - 1), i.indexAfter(a - 1))))
      return n.delete(r.before(a), i.after(a));
  }
  for (let s = 1; s <= r.depth && s <= i.depth; s++)
    if (e - r.start(s) == r.depth - s && t > r.end(s) && i.end(s) - t != i.depth - s)
      return n.delete(r.before(s), t);
  n.delete(e, t);
}
function Qa(n, e) {
  let t = [], r = Math.min(n.depth, e.depth);
  for (let i = r; i >= 0; i--) {
    let o = n.start(i);
    if (o < n.pos - (n.depth - i) || e.end(i) > e.pos + (e.depth - i) || n.node(i).type.spec.isolating || e.node(i).type.spec.isolating)
      break;
    (o == e.start(i) || i == n.depth && i == e.depth && n.parent.inlineContent && e.parent.inlineContent && i && e.start(i - 1) == o - 1) && t.push(i);
  }
  return t;
}
class pn extends be {
  constructor(e, t, r) {
    super(), this.pos = e, this.attr = t, this.value = r;
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t)
      return J.fail("No node at attribute step's position");
    let r = /* @__PURE__ */ Object.create(null);
    for (let o in t.attrs)
      r[o] = t.attrs[o];
    r[this.attr] = this.value;
    let i = t.type.create(r, null, t.marks);
    return J.fromReplace(e, this.pos, this.pos + 1, new S(x.from(i), 0, t.isLeaf ? 0 : 1));
  }
  getMap() {
    return Ce.empty;
  }
  invert(e) {
    return new pn(this.pos, this.attr, e.nodeAt(this.pos).attrs[this.attr]);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new pn(t.pos, this.attr, this.value);
  }
  toJSON() {
    return { stepType: "attr", pos: this.pos, attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number" || typeof t.attr != "string")
      throw new RangeError("Invalid input for AttrStep.fromJSON");
    return new pn(t.pos, t.attr, t.value);
  }
}
be.jsonID("attr", pn);
let gn = class extends Error {
};
gn = function n(e) {
  let t = Error.call(this, e);
  return t.__proto__ = n.prototype, t;
};
gn.prototype = Object.create(Error.prototype);
gn.prototype.constructor = gn;
gn.prototype.name = "TransformError";
class ed {
  constructor(e) {
    this.doc = e, this.steps = [], this.docs = [], this.mapping = new fn();
  }
  get before() {
    return this.docs.length ? this.docs[0] : this.doc;
  }
  step(e) {
    let t = this.maybeStep(e);
    if (t.failed)
      throw new gn(t.failed);
    return this;
  }
  maybeStep(e) {
    let t = e.apply(this.doc);
    return t.failed || this.addStep(e, t.doc), t;
  }
  get docChanged() {
    return this.steps.length > 0;
  }
  addStep(e, t) {
    this.docs.push(this.doc), this.steps.push(e), this.mapping.appendMap(e.getMap()), this.doc = t;
  }
  replace(e, t = e, r = S.empty) {
    let i = ho(this.doc, e, t, r);
    return i && this.step(i), this;
  }
  replaceWith(e, t, r) {
    return this.replace(e, t, new S(x.from(r), 0, 0));
  }
  delete(e, t) {
    return this.replace(e, t, S.empty);
  }
  insert(e, t) {
    return this.replaceWith(e, e, t);
  }
  replaceRange(e, t, r) {
    return Xu(this, e, t, r), this;
  }
  replaceRangeWith(e, t, r) {
    return Zu(this, e, t, r), this;
  }
  deleteRange(e, t) {
    return Qu(this, e, t), this;
  }
  lift(e, t) {
    return Fu(this, e, t), this;
  }
  join(e, t = 1) {
    return Ju(this, e, t), this;
  }
  wrap(e, t) {
    return ju(this, e, t), this;
  }
  setBlockType(e, t = e, r, i = null) {
    return Hu(this, e, t, r, i), this;
  }
  setNodeMarkup(e, t, r = null, i = []) {
    return qu(this, e, t, r, i), this;
  }
  setNodeAttribute(e, t, r) {
    return this.step(new pn(e, t, r)), this;
  }
  addNodeMark(e, t) {
    return this.step(new yt(e, t)), this;
  }
  removeNodeMark(e, t) {
    if (!(t instanceof z)) {
      let r = this.doc.nodeAt(e);
      if (!r)
        throw new RangeError("No node at position " + e);
      if (t = t.isInSet(r.marks), !t)
        return this;
    }
    return this.step(new mn(e, t)), this;
  }
  split(e, t = 1, r) {
    return Ku(this, e, t, r), this;
  }
  addMark(e, t, r) {
    return Ru(this, e, t, r), this;
  }
  removeMark(e, t, r) {
    return Bu(this, e, t, r), this;
  }
  clearIncompatible(e, t, r) {
    return Lu(this, e, t, r), this;
  }
}
const gi = /* @__PURE__ */ Object.create(null);
class P {
  constructor(e, t, r) {
    this.$anchor = e, this.$head = t, this.ranges = r || [new td(e.min(t), e.max(t))];
  }
  get anchor() {
    return this.$anchor.pos;
  }
  get head() {
    return this.$head.pos;
  }
  get from() {
    return this.$from.pos;
  }
  get to() {
    return this.$to.pos;
  }
  get $from() {
    return this.ranges[0].$from;
  }
  get $to() {
    return this.ranges[0].$to;
  }
  get empty() {
    let e = this.ranges;
    for (let t = 0; t < e.length; t++)
      if (e[t].$from.pos != e[t].$to.pos)
        return !1;
    return !0;
  }
  content() {
    return this.$from.doc.slice(this.from, this.to, !0);
  }
  replace(e, t = S.empty) {
    let r = t.content.lastChild, i = null;
    for (let a = 0; a < t.openEnd; a++)
      i = r, r = r.lastChild;
    let o = e.steps.length, s = this.ranges;
    for (let a = 0; a < s.length; a++) {
      let { $from: l, $to: c } = s[a], u = e.mapping.slice(o);
      e.replaceRange(u.map(l.pos), u.map(c.pos), a ? S.empty : t), a == 0 && es(e, o, (r ? r.isInline : i && i.isTextblock) ? -1 : 1);
    }
  }
  replaceWith(e, t) {
    let r = e.steps.length, i = this.ranges;
    for (let o = 0; o < i.length; o++) {
      let { $from: s, $to: a } = i[o], l = e.mapping.slice(r), c = l.map(s.pos), u = l.map(a.pos);
      o ? e.deleteRange(c, u) : (e.replaceRangeWith(c, u, t), es(e, r, t.isInline ? -1 : 1));
    }
  }
  static findFrom(e, t, r = !1) {
    let i = e.parent.inlineContent ? new D(e) : rn(e.node(0), e.parent, e.pos, e.index(), t, r);
    if (i)
      return i;
    for (let o = e.depth - 1; o >= 0; o--) {
      let s = t < 0 ? rn(e.node(0), e.node(o), e.before(o + 1), e.index(o), t, r) : rn(e.node(0), e.node(o), e.after(o + 1), e.index(o) + 1, t, r);
      if (s)
        return s;
    }
    return null;
  }
  static near(e, t = 1) {
    return this.findFrom(e, t) || this.findFrom(e, -t) || new Pe(e.node(0));
  }
  static atStart(e) {
    return rn(e, e, 0, 0, 1) || new Pe(e);
  }
  static atEnd(e) {
    return rn(e, e, e.content.size, e.childCount, -1) || new Pe(e);
  }
  static fromJSON(e, t) {
    if (!t || !t.type)
      throw new RangeError("Invalid input for Selection.fromJSON");
    let r = gi[t.type];
    if (!r)
      throw new RangeError(`No selection type ${t.type} defined`);
    return r.fromJSON(e, t);
  }
  static jsonID(e, t) {
    if (e in gi)
      throw new RangeError("Duplicate use of selection JSON ID " + e);
    return gi[e] = t, t.prototype.jsonID = e, t;
  }
  getBookmark() {
    return D.between(this.$anchor, this.$head).getBookmark();
  }
}
P.prototype.visible = !0;
class td {
  constructor(e, t) {
    this.$from = e, this.$to = t;
  }
}
let Zo = !1;
function Qo(n) {
  !Zo && !n.parent.inlineContent && (Zo = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + n.parent.type.name + ")"));
}
class D extends P {
  constructor(e, t = e) {
    Qo(e), Qo(t), super(e, t);
  }
  get $cursor() {
    return this.$anchor.pos == this.$head.pos ? this.$head : null;
  }
  map(e, t) {
    let r = e.resolve(t.map(this.head));
    if (!r.parent.inlineContent)
      return P.near(r);
    let i = e.resolve(t.map(this.anchor));
    return new D(i.parent.inlineContent ? i : r, r);
  }
  replace(e, t = S.empty) {
    if (super.replace(e, t), t == S.empty) {
      let r = this.$from.marksAcross(this.$to);
      r && e.ensureMarks(r);
    }
  }
  eq(e) {
    return e instanceof D && e.anchor == this.anchor && e.head == this.head;
  }
  getBookmark() {
    return new Ur(this.anchor, this.head);
  }
  toJSON() {
    return { type: "text", anchor: this.anchor, head: this.head };
  }
  static fromJSON(e, t) {
    if (typeof t.anchor != "number" || typeof t.head != "number")
      throw new RangeError("Invalid input for TextSelection.fromJSON");
    return new D(e.resolve(t.anchor), e.resolve(t.head));
  }
  static create(e, t, r = t) {
    let i = e.resolve(t);
    return new this(i, r == t ? i : e.resolve(r));
  }
  static between(e, t, r) {
    let i = e.pos - t.pos;
    if ((!r || i) && (r = i >= 0 ? 1 : -1), !t.parent.inlineContent) {
      let o = P.findFrom(t, r, !0) || P.findFrom(t, -r, !0);
      if (o)
        t = o.$head;
      else
        return P.near(t, r);
    }
    return e.parent.inlineContent || (i == 0 ? e = t : (e = (P.findFrom(e, -r, !0) || P.findFrom(e, r, !0)).$anchor, e.pos < t.pos != i < 0 && (e = t))), new D(e, t);
  }
}
P.jsonID("text", D);
class Ur {
  constructor(e, t) {
    this.anchor = e, this.head = t;
  }
  map(e) {
    return new Ur(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    return D.between(e.resolve(this.anchor), e.resolve(this.head));
  }
}
class N extends P {
  constructor(e) {
    let t = e.nodeAfter, r = e.node(0).resolve(e.pos + t.nodeSize);
    super(e, r), this.node = t;
  }
  map(e, t) {
    let { deleted: r, pos: i } = t.mapResult(this.anchor), o = e.resolve(i);
    return r ? P.near(o) : new N(o);
  }
  content() {
    return new S(x.from(this.node), 0, 0);
  }
  eq(e) {
    return e instanceof N && e.anchor == this.anchor;
  }
  toJSON() {
    return { type: "node", anchor: this.anchor };
  }
  getBookmark() {
    return new mo(this.anchor);
  }
  static fromJSON(e, t) {
    if (typeof t.anchor != "number")
      throw new RangeError("Invalid input for NodeSelection.fromJSON");
    return new N(e.resolve(t.anchor));
  }
  static create(e, t) {
    return new N(e.resolve(t));
  }
  static isSelectable(e) {
    return !e.isText && e.type.spec.selectable !== !1;
  }
}
N.prototype.visible = !1;
P.jsonID("node", N);
class mo {
  constructor(e) {
    this.anchor = e;
  }
  map(e) {
    let { deleted: t, pos: r } = e.mapResult(this.anchor);
    return t ? new Ur(r, r) : new mo(r);
  }
  resolve(e) {
    let t = e.resolve(this.anchor), r = t.nodeAfter;
    return r && N.isSelectable(r) ? new N(t) : P.near(t);
  }
}
class Pe extends P {
  constructor(e) {
    super(e.resolve(0), e.resolve(e.content.size));
  }
  replace(e, t = S.empty) {
    if (t == S.empty) {
      e.delete(0, e.doc.content.size);
      let r = P.atStart(e.doc);
      r.eq(e.selection) || e.setSelection(r);
    } else
      super.replace(e, t);
  }
  toJSON() {
    return { type: "all" };
  }
  static fromJSON(e) {
    return new Pe(e);
  }
  map(e) {
    return new Pe(e);
  }
  eq(e) {
    return e instanceof Pe;
  }
  getBookmark() {
    return nd;
  }
}
P.jsonID("all", Pe);
const nd = {
  map() {
    return this;
  },
  resolve(n) {
    return new Pe(n);
  }
};
function rn(n, e, t, r, i, o = !1) {
  if (e.inlineContent)
    return D.create(n, t);
  for (let s = r - (i > 0 ? 0 : 1); i > 0 ? s < e.childCount : s >= 0; s += i) {
    let a = e.child(s);
    if (a.isAtom) {
      if (!o && N.isSelectable(a))
        return N.create(n, t - (i < 0 ? a.nodeSize : 0));
    } else {
      let l = rn(n, a, t + i, i < 0 ? a.childCount : 0, i, o);
      if (l)
        return l;
    }
    t += a.nodeSize * i;
  }
  return null;
}
function es(n, e, t) {
  let r = n.steps.length - 1;
  if (r < e)
    return;
  let i = n.steps[r];
  if (!(i instanceof Q || i instanceof _))
    return;
  let o = n.mapping.maps[r], s;
  o.forEach((a, l, c, u) => {
    s == null && (s = u);
  }), n.setSelection(P.near(n.doc.resolve(s), t));
}
const ts = 1, mr = 2, ns = 4;
class rd extends ed {
  constructor(e) {
    super(e.doc), this.curSelectionFor = 0, this.updated = 0, this.meta = /* @__PURE__ */ Object.create(null), this.time = Date.now(), this.curSelection = e.selection, this.storedMarks = e.storedMarks;
  }
  get selection() {
    return this.curSelectionFor < this.steps.length && (this.curSelection = this.curSelection.map(this.doc, this.mapping.slice(this.curSelectionFor)), this.curSelectionFor = this.steps.length), this.curSelection;
  }
  setSelection(e) {
    if (e.$from.doc != this.doc)
      throw new RangeError("Selection passed to setSelection must point at the current document");
    return this.curSelection = e, this.curSelectionFor = this.steps.length, this.updated = (this.updated | ts) & ~mr, this.storedMarks = null, this;
  }
  get selectionSet() {
    return (this.updated & ts) > 0;
  }
  setStoredMarks(e) {
    return this.storedMarks = e, this.updated |= mr, this;
  }
  ensureMarks(e) {
    return z.sameSet(this.storedMarks || this.selection.$from.marks(), e) || this.setStoredMarks(e), this;
  }
  addStoredMark(e) {
    return this.ensureMarks(e.addToSet(this.storedMarks || this.selection.$head.marks()));
  }
  removeStoredMark(e) {
    return this.ensureMarks(e.removeFromSet(this.storedMarks || this.selection.$head.marks()));
  }
  get storedMarksSet() {
    return (this.updated & mr) > 0;
  }
  addStep(e, t) {
    super.addStep(e, t), this.updated = this.updated & ~mr, this.storedMarks = null;
  }
  setTime(e) {
    return this.time = e, this;
  }
  replaceSelection(e) {
    return this.selection.replace(this, e), this;
  }
  replaceSelectionWith(e, t = !0) {
    let r = this.selection;
    return t && (e = e.mark(this.storedMarks || (r.empty ? r.$from.marks() : r.$from.marksAcross(r.$to) || z.none))), r.replaceWith(this, e), this;
  }
  deleteSelection() {
    return this.selection.replace(this), this;
  }
  insertText(e, t, r) {
    let i = this.doc.type.schema;
    if (t == null)
      return e ? this.replaceSelectionWith(i.text(e), !0) : this.deleteSelection();
    {
      if (r == null && (r = t), r = r == null ? t : r, !e)
        return this.deleteRange(t, r);
      let o = this.storedMarks;
      if (!o) {
        let s = this.doc.resolve(t);
        o = r == t ? s.marks() : s.marksAcross(this.doc.resolve(r));
      }
      return this.replaceRangeWith(t, r, i.text(e, o)), this.selection.empty || this.setSelection(P.near(this.selection.$to)), this;
    }
  }
  setMeta(e, t) {
    return this.meta[typeof e == "string" ? e : e.key] = t, this;
  }
  getMeta(e) {
    return this.meta[typeof e == "string" ? e : e.key];
  }
  get isGeneric() {
    for (let e in this.meta)
      return !1;
    return !0;
  }
  scrollIntoView() {
    return this.updated |= ns, this;
  }
  get scrolledIntoView() {
    return (this.updated & ns) > 0;
  }
}
function rs(n, e) {
  return !e || !n ? n : n.bind(e);
}
class $n {
  constructor(e, t, r) {
    this.name = e, this.init = rs(t.init, r), this.apply = rs(t.apply, r);
  }
}
const id = [
  new $n("doc", {
    init(n) {
      return n.doc || n.schema.topNodeType.createAndFill();
    },
    apply(n) {
      return n.doc;
    }
  }),
  new $n("selection", {
    init(n, e) {
      return n.selection || P.atStart(e.doc);
    },
    apply(n) {
      return n.selection;
    }
  }),
  new $n("storedMarks", {
    init(n) {
      return n.storedMarks || null;
    },
    apply(n, e, t, r) {
      return r.selection.$cursor ? n.storedMarks : null;
    }
  }),
  new $n("scrollToSelection", {
    init() {
      return 0;
    },
    apply(n, e) {
      return n.scrolledIntoView ? e + 1 : e;
    }
  })
];
class yi {
  constructor(e, t) {
    this.schema = e, this.plugins = [], this.pluginsByKey = /* @__PURE__ */ Object.create(null), this.fields = id.slice(), t && t.forEach((r) => {
      if (this.pluginsByKey[r.key])
        throw new RangeError("Adding different instances of a keyed plugin (" + r.key + ")");
      this.plugins.push(r), this.pluginsByKey[r.key] = r, r.spec.state && this.fields.push(new $n(r.key, r.spec.state, r));
    });
  }
}
class ln {
  constructor(e) {
    this.config = e;
  }
  get schema() {
    return this.config.schema;
  }
  get plugins() {
    return this.config.plugins;
  }
  apply(e) {
    return this.applyTransaction(e).state;
  }
  filterTransaction(e, t = -1) {
    for (let r = 0; r < this.config.plugins.length; r++)
      if (r != t) {
        let i = this.config.plugins[r];
        if (i.spec.filterTransaction && !i.spec.filterTransaction.call(i, e, this))
          return !1;
      }
    return !0;
  }
  applyTransaction(e) {
    if (!this.filterTransaction(e))
      return { state: this, transactions: [] };
    let t = [e], r = this.applyInner(e), i = null;
    for (; ; ) {
      let o = !1;
      for (let s = 0; s < this.config.plugins.length; s++) {
        let a = this.config.plugins[s];
        if (a.spec.appendTransaction) {
          let l = i ? i[s].n : 0, c = i ? i[s].state : this, u = l < t.length && a.spec.appendTransaction.call(a, l ? t.slice(l) : t, c, r);
          if (u && r.filterTransaction(u, s)) {
            if (u.setMeta("appendedTransaction", e), !i) {
              i = [];
              for (let d = 0; d < this.config.plugins.length; d++)
                i.push(d < s ? { state: r, n: t.length } : { state: this, n: 0 });
            }
            t.push(u), r = r.applyInner(u), o = !0;
          }
          i && (i[s] = { state: r, n: t.length });
        }
      }
      if (!o)
        return { state: r, transactions: t };
    }
  }
  applyInner(e) {
    if (!e.before.eq(this.doc))
      throw new RangeError("Applying a mismatched transaction");
    let t = new ln(this.config), r = this.config.fields;
    for (let i = 0; i < r.length; i++) {
      let o = r[i];
      t[o.name] = o.apply(e, this[o.name], this, t);
    }
    return t;
  }
  get tr() {
    return new rd(this);
  }
  static create(e) {
    let t = new yi(e.doc ? e.doc.type.schema : e.schema, e.plugins), r = new ln(t);
    for (let i = 0; i < t.fields.length; i++)
      r[t.fields[i].name] = t.fields[i].init(e, r);
    return r;
  }
  reconfigure(e) {
    let t = new yi(this.schema, e.plugins), r = t.fields, i = new ln(t);
    for (let o = 0; o < r.length; o++) {
      let s = r[o].name;
      i[s] = this.hasOwnProperty(s) ? this[s] : r[o].init(e, i);
    }
    return i;
  }
  toJSON(e) {
    let t = { doc: this.doc.toJSON(), selection: this.selection.toJSON() };
    if (this.storedMarks && (t.storedMarks = this.storedMarks.map((r) => r.toJSON())), e && typeof e == "object")
      for (let r in e) {
        if (r == "doc" || r == "selection")
          throw new RangeError("The JSON fields `doc` and `selection` are reserved");
        let i = e[r], o = i.spec.state;
        o && o.toJSON && (t[r] = o.toJSON.call(i, this[i.key]));
      }
    return t;
  }
  static fromJSON(e, t, r) {
    if (!t)
      throw new RangeError("Invalid input for EditorState.fromJSON");
    if (!e.schema)
      throw new RangeError("Required config field 'schema' missing");
    let i = new yi(e.schema, e.plugins), o = new ln(i);
    return i.fields.forEach((s) => {
      if (s.name == "doc")
        o.doc = _e.fromJSON(e.schema, t.doc);
      else if (s.name == "selection")
        o.selection = P.fromJSON(o.doc, t.selection);
      else if (s.name == "storedMarks")
        t.storedMarks && (o.storedMarks = t.storedMarks.map(e.schema.markFromJSON));
      else {
        if (r)
          for (let a in r) {
            let l = r[a], c = l.spec.state;
            if (l.key == s.name && c && c.fromJSON && Object.prototype.hasOwnProperty.call(t, a)) {
              o[s.name] = c.fromJSON.call(l, e, t[a], o);
              return;
            }
          }
        o[s.name] = s.init(e, o);
      }
    }), o;
  }
}
function el(n, e, t) {
  for (let r in n) {
    let i = n[r];
    i instanceof Function ? i = i.bind(e) : r == "handleDOMEvents" && (i = el(i, e, {})), t[r] = i;
  }
  return t;
}
class U {
  constructor(e) {
    this.spec = e, this.props = {}, e.props && el(e.props, this, this.props), this.key = e.key ? e.key.key : tl("plugin");
  }
  getState(e) {
    return e[this.key];
  }
}
const bi = /* @__PURE__ */ Object.create(null);
function tl(n) {
  return n in bi ? n + "$" + ++bi[n] : (bi[n] = 0, n + "$");
}
class de {
  constructor(e = "key") {
    this.key = tl(e);
  }
  get(e) {
    return e.config.pluginsByKey[this.key];
  }
  getState(e) {
    return e[this.key];
  }
}
const xe = function(n) {
  for (var e = 0; ; e++)
    if (n = n.previousSibling, !n)
      return e;
}, Jn = function(n) {
  let e = n.assignedSlot || n.parentNode;
  return e && e.nodeType == 11 ? e.host : e;
};
let is = null;
const rt = function(n, e, t) {
  let r = is || (is = document.createRange());
  return r.setEnd(n, t == null ? n.nodeValue.length : t), r.setStart(n, e || 0), r;
}, Kt = function(n, e, t, r) {
  return t && (ss(n, e, t, r, -1) || ss(n, e, t, r, 1));
}, od = /^(img|br|input|textarea|hr)$/i;
function ss(n, e, t, r, i) {
  for (; ; ) {
    if (n == t && e == r)
      return !0;
    if (e == (i < 0 ? 0 : We(n))) {
      let o = n.parentNode;
      if (!o || o.nodeType != 1 || ad(n) || od.test(n.nodeName) || n.contentEditable == "false")
        return !1;
      e = xe(n) + (i < 0 ? 0 : 1), n = o;
    } else if (n.nodeType == 1) {
      if (n = n.childNodes[e + (i < 0 ? -1 : 0)], n.contentEditable == "false")
        return !1;
      e = i < 0 ? We(n) : 0;
    } else
      return !1;
  }
}
function We(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function sd(n, e, t) {
  for (let r = e == 0, i = e == We(n); r || i; ) {
    if (n == t)
      return !0;
    let o = xe(n);
    if (n = n.parentNode, !n)
      return !1;
    r = r && o == 0, i = i && o == We(n);
  }
}
function ad(n) {
  let e;
  for (let t = n; t && !(e = t.pmViewDesc); t = t.parentNode)
    ;
  return e && e.node && e.node.isBlock && (e.dom == n || e.contentDOM == n);
}
const Gr = function(n) {
  return n.focusNode && Kt(n.focusNode, n.focusOffset, n.anchorNode, n.anchorOffset);
};
function cn(n, e) {
  let t = document.createEvent("Event");
  return t.initEvent("keydown", !0, !0), t.keyCode = n, t.key = t.code = e, t;
}
function ld(n) {
  let e = n.activeElement;
  for (; e && e.shadowRoot; )
    e = e.shadowRoot.activeElement;
  return e;
}
const wt = typeof navigator < "u" ? navigator : null, as = typeof document < "u" ? document : null, Ot = wt && wt.userAgent || "", ji = /Edge\/(\d+)/.exec(Ot), nl = /MSIE \d/.exec(Ot), Hi = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(Ot), pe = !!(nl || Hi || ji), vt = nl ? document.documentMode : Hi ? +Hi[1] : ji ? +ji[1] : 0, Le = !pe && /gecko\/(\d+)/i.test(Ot);
Le && +(/Firefox\/(\d+)/.exec(Ot) || [0, 0])[1];
const Wi = !pe && /Chrome\/(\d+)/.exec(Ot), fe = !!Wi, cd = Wi ? +Wi[1] : 0, ae = !pe && !!wt && /Apple Computer/.test(wt.vendor), yn = ae && (/Mobile\/\w+/.test(Ot) || !!wt && wt.maxTouchPoints > 2), Oe = yn || (wt ? /Mac/.test(wt.platform) : !1), qe = /Android \d/.test(Ot), Yr = !!as && "webkitFontSmoothing" in as.documentElement.style, ud = Yr ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0;
function dd(n) {
  return {
    left: 0,
    right: n.documentElement.clientWidth,
    top: 0,
    bottom: n.documentElement.clientHeight
  };
}
function ut(n, e) {
  return typeof n == "number" ? n : n[e];
}
function fd(n) {
  let e = n.getBoundingClientRect(), t = e.width / n.offsetWidth || 1, r = e.height / n.offsetHeight || 1;
  return {
    left: e.left,
    right: e.left + n.clientWidth * t,
    top: e.top,
    bottom: e.top + n.clientHeight * r
  };
}
function ls(n, e, t) {
  let r = n.someProp("scrollThreshold") || 0, i = n.someProp("scrollMargin") || 5, o = n.dom.ownerDocument;
  for (let s = t || n.dom; s; s = Jn(s)) {
    if (s.nodeType != 1)
      continue;
    let a = s, l = a == o.body, c = l ? dd(o) : fd(a), u = 0, d = 0;
    if (e.top < c.top + ut(r, "top") ? d = -(c.top - e.top + ut(i, "top")) : e.bottom > c.bottom - ut(r, "bottom") && (d = e.bottom - c.bottom + ut(i, "bottom")), e.left < c.left + ut(r, "left") ? u = -(c.left - e.left + ut(i, "left")) : e.right > c.right - ut(r, "right") && (u = e.right - c.right + ut(i, "right")), u || d)
      if (l)
        o.defaultView.scrollBy(u, d);
      else {
        let f = a.scrollLeft, p = a.scrollTop;
        d && (a.scrollTop += d), u && (a.scrollLeft += u);
        let h = a.scrollLeft - f, m = a.scrollTop - p;
        e = { left: e.left - h, top: e.top - m, right: e.right - h, bottom: e.bottom - m };
      }
    if (l)
      break;
  }
}
function pd(n) {
  let e = n.dom.getBoundingClientRect(), t = Math.max(0, e.top), r, i;
  for (let o = (e.left + e.right) / 2, s = t + 1; s < Math.min(innerHeight, e.bottom); s += 5) {
    let a = n.root.elementFromPoint(o, s);
    if (!a || a == n.dom || !n.dom.contains(a))
      continue;
    let l = a.getBoundingClientRect();
    if (l.top >= t - 20) {
      r = a, i = l.top;
      break;
    }
  }
  return { refDOM: r, refTop: i, stack: rl(n.dom) };
}
function rl(n) {
  let e = [], t = n.ownerDocument;
  for (let r = n; r && (e.push({ dom: r, top: r.scrollTop, left: r.scrollLeft }), n != t); r = Jn(r))
    ;
  return e;
}
function hd({ refDOM: n, refTop: e, stack: t }) {
  let r = n ? n.getBoundingClientRect().top : 0;
  il(t, r == 0 ? 0 : r - e);
}
function il(n, e) {
  for (let t = 0; t < n.length; t++) {
    let { dom: r, top: i, left: o } = n[t];
    r.scrollTop != i + e && (r.scrollTop = i + e), r.scrollLeft != o && (r.scrollLeft = o);
  }
}
let tn = null;
function md(n) {
  if (n.setActive)
    return n.setActive();
  if (tn)
    return n.focus(tn);
  let e = rl(n);
  n.focus(tn == null ? {
    get preventScroll() {
      return tn = { preventScroll: !0 }, !0;
    }
  } : void 0), tn || (tn = !1, il(e, 0));
}
function ol(n, e) {
  let t, r = 2e8, i, o = 0, s = e.top, a = e.top;
  for (let l = n.firstChild, c = 0; l; l = l.nextSibling, c++) {
    let u;
    if (l.nodeType == 1)
      u = l.getClientRects();
    else if (l.nodeType == 3)
      u = rt(l).getClientRects();
    else
      continue;
    for (let d = 0; d < u.length; d++) {
      let f = u[d];
      if (f.top <= s && f.bottom >= a) {
        s = Math.max(f.bottom, s), a = Math.min(f.top, a);
        let p = f.left > e.left ? f.left - e.left : f.right < e.left ? e.left - f.right : 0;
        if (p < r) {
          t = l, r = p, i = p && t.nodeType == 3 ? {
            left: f.right < e.left ? f.right : f.left,
            top: e.top
          } : e, l.nodeType == 1 && p && (o = c + (e.left >= (f.left + f.right) / 2 ? 1 : 0));
          continue;
        }
      }
      !t && (e.left >= f.right && e.top >= f.top || e.left >= f.left && e.top >= f.bottom) && (o = c + 1);
    }
  }
  return t && t.nodeType == 3 ? gd(t, i) : !t || r && t.nodeType == 1 ? { node: n, offset: o } : ol(t, i);
}
function gd(n, e) {
  let t = n.nodeValue.length, r = document.createRange();
  for (let i = 0; i < t; i++) {
    r.setEnd(n, i + 1), r.setStart(n, i);
    let o = ft(r, 1);
    if (o.top != o.bottom && go(e, o))
      return { node: n, offset: i + (e.left >= (o.left + o.right) / 2 ? 1 : 0) };
  }
  return { node: n, offset: 0 };
}
function go(n, e) {
  return n.left >= e.left - 1 && n.left <= e.right + 1 && n.top >= e.top - 1 && n.top <= e.bottom + 1;
}
function yd(n, e) {
  let t = n.parentNode;
  return t && /^li$/i.test(t.nodeName) && e.left < n.getBoundingClientRect().left ? t : n;
}
function bd(n, e, t) {
  let { node: r, offset: i } = ol(e, t), o = -1;
  if (r.nodeType == 1 && !r.firstChild) {
    let s = r.getBoundingClientRect();
    o = s.left != s.right && t.left > (s.left + s.right) / 2 ? 1 : -1;
  }
  return n.docView.posFromDOM(r, i, o);
}
function vd(n, e, t, r) {
  let i = -1;
  for (let o = e; o != n.dom; ) {
    let s = n.docView.nearestDesc(o, !0);
    if (!s)
      return null;
    if (s.node.isBlock && s.parent) {
      let a = s.dom.getBoundingClientRect();
      if (a.left > r.left || a.top > r.top)
        i = s.posBefore;
      else if (a.right < r.left || a.bottom < r.top)
        i = s.posAfter;
      else
        break;
    }
    o = s.dom.parentNode;
  }
  return i > -1 ? i : n.docView.posFromDOM(e, t, 1);
}
function sl(n, e, t) {
  let r = n.childNodes.length;
  if (r && t.top < t.bottom)
    for (let i = Math.max(0, Math.min(r - 1, Math.floor(r * (e.top - t.top) / (t.bottom - t.top)) - 2)), o = i; ; ) {
      let s = n.childNodes[o];
      if (s.nodeType == 1) {
        let a = s.getClientRects();
        for (let l = 0; l < a.length; l++) {
          let c = a[l];
          if (go(e, c))
            return sl(s, e, c);
        }
      }
      if ((o = (o + 1) % r) == i)
        break;
    }
  return n;
}
function kd(n, e) {
  let t = n.dom.ownerDocument, r, i = 0;
  if (t.caretPositionFromPoint)
    try {
      let l = t.caretPositionFromPoint(e.left, e.top);
      l && ({ offsetNode: r, offset: i } = l);
    } catch {
    }
  if (!r && t.caretRangeFromPoint) {
    let l = t.caretRangeFromPoint(e.left, e.top);
    l && ({ startContainer: r, startOffset: i } = l);
  }
  let o = (n.root.elementFromPoint ? n.root : t).elementFromPoint(e.left, e.top), s;
  if (!o || !n.dom.contains(o.nodeType != 1 ? o.parentNode : o)) {
    let l = n.dom.getBoundingClientRect();
    if (!go(e, l) || (o = sl(n.dom, e, l), !o))
      return null;
  }
  if (ae)
    for (let l = o; r && l; l = Jn(l))
      l.draggable && (r = void 0);
  if (o = yd(o, e), r) {
    if (Le && r.nodeType == 1 && (i = Math.min(i, r.childNodes.length), i < r.childNodes.length)) {
      let l = r.childNodes[i], c;
      l.nodeName == "IMG" && (c = l.getBoundingClientRect()).right <= e.left && c.bottom > e.top && i++;
    }
    r == n.dom && i == r.childNodes.length - 1 && r.lastChild.nodeType == 1 && e.top > r.lastChild.getBoundingClientRect().bottom ? s = n.state.doc.content.size : (i == 0 || r.nodeType != 1 || r.childNodes[i - 1].nodeName != "BR") && (s = vd(n, r, i, e));
  }
  s == null && (s = bd(n, o, e));
  let a = n.docView.nearestDesc(o, !0);
  return { pos: s, inside: a ? a.posAtStart - a.border : -1 };
}
function ft(n, e) {
  let t = n.getClientRects();
  return t.length ? t[e < 0 ? 0 : t.length - 1] : n.getBoundingClientRect();
}
const xd = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
function al(n, e, t) {
  let { node: r, offset: i, atom: o } = n.docView.domFromPos(e, t < 0 ? -1 : 1), s = Yr || Le;
  if (r.nodeType == 3)
    if (s && (xd.test(r.nodeValue) || (t < 0 ? !i : i == r.nodeValue.length))) {
      let l = ft(rt(r, i, i), t);
      if (Le && i && /\s/.test(r.nodeValue[i - 1]) && i < r.nodeValue.length) {
        let c = ft(rt(r, i - 1, i - 1), -1);
        if (c.top == l.top) {
          let u = ft(rt(r, i, i + 1), -1);
          if (u.top != l.top)
            return In(u, u.left < c.left);
        }
      }
      return l;
    } else {
      let l = i, c = i, u = t < 0 ? 1 : -1;
      return t < 0 && !i ? (c++, u = -1) : t >= 0 && i == r.nodeValue.length ? (l--, u = 1) : t < 0 ? l-- : c++, In(ft(rt(r, l, c), 1), u < 0);
    }
  if (!n.state.doc.resolve(e - (o || 0)).parent.inlineContent) {
    if (o == null && i && (t < 0 || i == We(r))) {
      let l = r.childNodes[i - 1];
      if (l.nodeType == 1)
        return vi(l.getBoundingClientRect(), !1);
    }
    if (o == null && i < We(r)) {
      let l = r.childNodes[i];
      if (l.nodeType == 1)
        return vi(l.getBoundingClientRect(), !0);
    }
    return vi(r.getBoundingClientRect(), t >= 0);
  }
  if (o == null && i && (t < 0 || i == We(r))) {
    let l = r.childNodes[i - 1], c = l.nodeType == 3 ? rt(l, We(l) - (s ? 0 : 1)) : l.nodeType == 1 && (l.nodeName != "BR" || !l.nextSibling) ? l : null;
    if (c)
      return In(ft(c, 1), !1);
  }
  if (o == null && i < We(r)) {
    let l = r.childNodes[i];
    for (; l.pmViewDesc && l.pmViewDesc.ignoreForCoords; )
      l = l.nextSibling;
    let c = l ? l.nodeType == 3 ? rt(l, 0, s ? 0 : 1) : l.nodeType == 1 ? l : null : null;
    if (c)
      return In(ft(c, -1), !0);
  }
  return In(ft(r.nodeType == 3 ? rt(r) : r, -t), t >= 0);
}
function In(n, e) {
  if (n.width == 0)
    return n;
  let t = e ? n.left : n.right;
  return { top: n.top, bottom: n.bottom, left: t, right: t };
}
function vi(n, e) {
  if (n.height == 0)
    return n;
  let t = e ? n.top : n.bottom;
  return { top: t, bottom: t, left: n.left, right: n.right };
}
function ll(n, e, t) {
  let r = n.state, i = n.root.activeElement;
  r != e && n.updateState(e), i != n.dom && n.focus();
  try {
    return t();
  } finally {
    r != e && n.updateState(r), i != n.dom && i && i.focus();
  }
}
function wd(n, e, t) {
  let r = e.selection, i = t == "up" ? r.$from : r.$to;
  return ll(n, e, () => {
    let { node: o } = n.docView.domFromPos(i.pos, t == "up" ? -1 : 1);
    for (; ; ) {
      let a = n.docView.nearestDesc(o, !0);
      if (!a)
        break;
      if (a.node.isBlock) {
        o = a.dom;
        break;
      }
      o = a.dom.parentNode;
    }
    let s = al(n, i.pos, 1);
    for (let a = o.firstChild; a; a = a.nextSibling) {
      let l;
      if (a.nodeType == 1)
        l = a.getClientRects();
      else if (a.nodeType == 3)
        l = rt(a, 0, a.nodeValue.length).getClientRects();
      else
        continue;
      for (let c = 0; c < l.length; c++) {
        let u = l[c];
        if (u.bottom > u.top + 1 && (t == "up" ? s.top - u.top > (u.bottom - s.top) * 2 : u.bottom - s.bottom > (s.bottom - u.top) * 2))
          return !1;
      }
    }
    return !0;
  });
}
const Sd = /[\u0590-\u08ac]/;
function Md(n, e, t) {
  let { $head: r } = e.selection;
  if (!r.parent.isTextblock)
    return !1;
  let i = r.parentOffset, o = !i, s = i == r.parent.content.size, a = n.domSelection();
  return !Sd.test(r.parent.textContent) || !a.modify ? t == "left" || t == "backward" ? o : s : ll(n, e, () => {
    let { focusNode: l, focusOffset: c, anchorNode: u, anchorOffset: d } = n.domSelectionRange(), f = a.caretBidiLevel;
    a.modify("move", t, "character");
    let p = r.depth ? n.docView.domAfterPos(r.before()) : n.dom, { focusNode: h, focusOffset: m } = n.domSelectionRange(), y = h && !p.contains(h.nodeType == 1 ? h : h.parentNode) || l == h && c == m;
    try {
      a.collapse(u, d), l && (l != u || c != d) && a.extend && a.extend(l, c);
    } catch {
    }
    return f != null && (a.caretBidiLevel = f), y;
  });
}
let cs = null, us = null, ds = !1;
function Od(n, e, t) {
  return cs == e && us == t ? ds : (cs = e, us = t, ds = t == "up" || t == "down" ? wd(n, e, t) : Md(n, e, t));
}
const Re = 0, fs = 1, un = 2, Ge = 3;
class Qn {
  constructor(e, t, r, i) {
    this.parent = e, this.children = t, this.dom = r, this.contentDOM = i, this.dirty = Re, r.pmViewDesc = this;
  }
  matchesWidget(e) {
    return !1;
  }
  matchesMark(e) {
    return !1;
  }
  matchesNode(e, t, r) {
    return !1;
  }
  matchesHack(e) {
    return !1;
  }
  parseRule() {
    return null;
  }
  stopEvent(e) {
    return !1;
  }
  get size() {
    let e = 0;
    for (let t = 0; t < this.children.length; t++)
      e += this.children[t].size;
    return e;
  }
  get border() {
    return 0;
  }
  destroy() {
    this.parent = void 0, this.dom.pmViewDesc == this && (this.dom.pmViewDesc = void 0);
    for (let e = 0; e < this.children.length; e++)
      this.children[e].destroy();
  }
  posBeforeChild(e) {
    for (let t = 0, r = this.posAtStart; ; t++) {
      let i = this.children[t];
      if (i == e)
        return r;
      r += i.size;
    }
  }
  get posBefore() {
    return this.parent.posBeforeChild(this);
  }
  get posAtStart() {
    return this.parent ? this.parent.posBeforeChild(this) + this.border : 0;
  }
  get posAfter() {
    return this.posBefore + this.size;
  }
  get posAtEnd() {
    return this.posAtStart + this.size - 2 * this.border;
  }
  localPosFromDOM(e, t, r) {
    if (this.contentDOM && this.contentDOM.contains(e.nodeType == 1 ? e : e.parentNode))
      if (r < 0) {
        let o, s;
        if (e == this.contentDOM)
          o = e.childNodes[t - 1];
        else {
          for (; e.parentNode != this.contentDOM; )
            e = e.parentNode;
          o = e.previousSibling;
        }
        for (; o && !((s = o.pmViewDesc) && s.parent == this); )
          o = o.previousSibling;
        return o ? this.posBeforeChild(s) + s.size : this.posAtStart;
      } else {
        let o, s;
        if (e == this.contentDOM)
          o = e.childNodes[t];
        else {
          for (; e.parentNode != this.contentDOM; )
            e = e.parentNode;
          o = e.nextSibling;
        }
        for (; o && !((s = o.pmViewDesc) && s.parent == this); )
          o = o.nextSibling;
        return o ? this.posBeforeChild(s) : this.posAtEnd;
      }
    let i;
    if (e == this.dom && this.contentDOM)
      i = t > xe(this.contentDOM);
    else if (this.contentDOM && this.contentDOM != this.dom && this.dom.contains(this.contentDOM))
      i = e.compareDocumentPosition(this.contentDOM) & 2;
    else if (this.dom.firstChild) {
      if (t == 0)
        for (let o = e; ; o = o.parentNode) {
          if (o == this.dom) {
            i = !1;
            break;
          }
          if (o.previousSibling)
            break;
        }
      if (i == null && t == e.childNodes.length)
        for (let o = e; ; o = o.parentNode) {
          if (o == this.dom) {
            i = !0;
            break;
          }
          if (o.nextSibling)
            break;
        }
    }
    return (i == null ? r > 0 : i) ? this.posAtEnd : this.posAtStart;
  }
  nearestDesc(e, t = !1) {
    for (let r = !0, i = e; i; i = i.parentNode) {
      let o = this.getDesc(i), s;
      if (o && (!t || o.node))
        if (r && (s = o.nodeDOM) && !(s.nodeType == 1 ? s.contains(e.nodeType == 1 ? e : e.parentNode) : s == e))
          r = !1;
        else
          return o;
    }
  }
  getDesc(e) {
    let t = e.pmViewDesc;
    for (let r = t; r; r = r.parent)
      if (r == this)
        return t;
  }
  posFromDOM(e, t, r) {
    for (let i = e; i; i = i.parentNode) {
      let o = this.getDesc(i);
      if (o)
        return o.localPosFromDOM(e, t, r);
    }
    return -1;
  }
  descAt(e) {
    for (let t = 0, r = 0; t < this.children.length; t++) {
      let i = this.children[t], o = r + i.size;
      if (r == e && o != r) {
        for (; !i.border && i.children.length; )
          i = i.children[0];
        return i;
      }
      if (e < o)
        return i.descAt(e - r - i.border);
      r = o;
    }
  }
  domFromPos(e, t) {
    if (!this.contentDOM)
      return { node: this.dom, offset: 0, atom: e + 1 };
    let r = 0, i = 0;
    for (let o = 0; r < this.children.length; r++) {
      let s = this.children[r], a = o + s.size;
      if (a > e || s instanceof ul) {
        i = e - o;
        break;
      }
      o = a;
    }
    if (i)
      return this.children[r].domFromPos(i - this.children[r].border, t);
    for (let o; r && !(o = this.children[r - 1]).size && o instanceof cl && o.side >= 0; r--)
      ;
    if (t <= 0) {
      let o, s = !0;
      for (; o = r ? this.children[r - 1] : null, !(!o || o.dom.parentNode == this.contentDOM); r--, s = !1)
        ;
      return o && t && s && !o.border && !o.domAtom ? o.domFromPos(o.size, t) : { node: this.contentDOM, offset: o ? xe(o.dom) + 1 : 0 };
    } else {
      let o, s = !0;
      for (; o = r < this.children.length ? this.children[r] : null, !(!o || o.dom.parentNode == this.contentDOM); r++, s = !1)
        ;
      return o && s && !o.border && !o.domAtom ? o.domFromPos(0, t) : { node: this.contentDOM, offset: o ? xe(o.dom) : this.contentDOM.childNodes.length };
    }
  }
  parseRange(e, t, r = 0) {
    if (this.children.length == 0)
      return { node: this.contentDOM, from: e, to: t, fromOffset: 0, toOffset: this.contentDOM.childNodes.length };
    let i = -1, o = -1;
    for (let s = r, a = 0; ; a++) {
      let l = this.children[a], c = s + l.size;
      if (i == -1 && e <= c) {
        let u = s + l.border;
        if (e >= u && t <= c - l.border && l.node && l.contentDOM && this.contentDOM.contains(l.contentDOM))
          return l.parseRange(e, t, u);
        e = s;
        for (let d = a; d > 0; d--) {
          let f = this.children[d - 1];
          if (f.size && f.dom.parentNode == this.contentDOM && !f.emptyChildAt(1)) {
            i = xe(f.dom) + 1;
            break;
          }
          e -= f.size;
        }
        i == -1 && (i = 0);
      }
      if (i > -1 && (c > t || a == this.children.length - 1)) {
        t = c;
        for (let u = a + 1; u < this.children.length; u++) {
          let d = this.children[u];
          if (d.size && d.dom.parentNode == this.contentDOM && !d.emptyChildAt(-1)) {
            o = xe(d.dom);
            break;
          }
          t += d.size;
        }
        o == -1 && (o = this.contentDOM.childNodes.length);
        break;
      }
      s = c;
    }
    return { node: this.contentDOM, from: e, to: t, fromOffset: i, toOffset: o };
  }
  emptyChildAt(e) {
    if (this.border || !this.contentDOM || !this.children.length)
      return !1;
    let t = this.children[e < 0 ? 0 : this.children.length - 1];
    return t.size == 0 || t.emptyChildAt(e);
  }
  domAfterPos(e) {
    let { node: t, offset: r } = this.domFromPos(e, 0);
    if (t.nodeType != 1 || r == t.childNodes.length)
      throw new RangeError("No node after pos " + e);
    return t.childNodes[r];
  }
  setSelection(e, t, r, i = !1) {
    let o = Math.min(e, t), s = Math.max(e, t);
    for (let f = 0, p = 0; f < this.children.length; f++) {
      let h = this.children[f], m = p + h.size;
      if (o > p && s < m)
        return h.setSelection(e - p - h.border, t - p - h.border, r, i);
      p = m;
    }
    let a = this.domFromPos(e, e ? -1 : 1), l = t == e ? a : this.domFromPos(t, t ? -1 : 1), c = r.getSelection(), u = !1;
    if ((Le || ae) && e == t) {
      let { node: f, offset: p } = a;
      if (f.nodeType == 3) {
        if (u = !!(p && f.nodeValue[p - 1] == `
`), u && p == f.nodeValue.length)
          for (let h = f, m; h; h = h.parentNode) {
            if (m = h.nextSibling) {
              m.nodeName == "BR" && (a = l = { node: m.parentNode, offset: xe(m) + 1 });
              break;
            }
            let y = h.pmViewDesc;
            if (y && y.node && y.node.isBlock)
              break;
          }
      } else {
        let h = f.childNodes[p - 1];
        u = h && (h.nodeName == "BR" || h.contentEditable == "false");
      }
    }
    if (Le && c.focusNode && c.focusNode != l.node && c.focusNode.nodeType == 1) {
      let f = c.focusNode.childNodes[c.focusOffset];
      f && f.contentEditable == "false" && (i = !0);
    }
    if (!(i || u && ae) && Kt(a.node, a.offset, c.anchorNode, c.anchorOffset) && Kt(l.node, l.offset, c.focusNode, c.focusOffset))
      return;
    let d = !1;
    if ((c.extend || e == t) && !u) {
      c.collapse(a.node, a.offset);
      try {
        e != t && c.extend(l.node, l.offset), d = !0;
      } catch {
      }
    }
    if (!d) {
      if (e > t) {
        let p = a;
        a = l, l = p;
      }
      let f = document.createRange();
      f.setEnd(l.node, l.offset), f.setStart(a.node, a.offset), c.removeAllRanges(), c.addRange(f);
    }
  }
  ignoreMutation(e) {
    return !this.contentDOM && e.type != "selection";
  }
  get contentLost() {
    return this.contentDOM && this.contentDOM != this.dom && !this.dom.contains(this.contentDOM);
  }
  markDirty(e, t) {
    for (let r = 0, i = 0; i < this.children.length; i++) {
      let o = this.children[i], s = r + o.size;
      if (r == s ? e <= s && t >= r : e < s && t > r) {
        let a = r + o.border, l = s - o.border;
        if (e >= a && t <= l) {
          this.dirty = e == r || t == s ? un : fs, e == a && t == l && (o.contentLost || o.dom.parentNode != this.contentDOM) ? o.dirty = Ge : o.markDirty(e - a, t - a);
          return;
        } else
          o.dirty = o.dom == o.contentDOM && o.dom.parentNode == this.contentDOM && !o.children.length ? un : Ge;
      }
      r = s;
    }
    this.dirty = un;
  }
  markParentsDirty() {
    let e = 1;
    for (let t = this.parent; t; t = t.parent, e++) {
      let r = e == 1 ? un : fs;
      t.dirty < r && (t.dirty = r);
    }
  }
  get domAtom() {
    return !1;
  }
  get ignoreForCoords() {
    return !1;
  }
}
class cl extends Qn {
  constructor(e, t, r, i) {
    let o, s = t.type.toDOM;
    if (typeof s == "function" && (s = s(r, () => {
      if (!o)
        return i;
      if (o.parent)
        return o.parent.posBeforeChild(o);
    })), !t.type.spec.raw) {
      if (s.nodeType != 1) {
        let a = document.createElement("span");
        a.appendChild(s), s = a;
      }
      s.contentEditable = "false", s.classList.add("ProseMirror-widget");
    }
    super(e, [], s, null), this.widget = t, this.widget = t, o = this;
  }
  matchesWidget(e) {
    return this.dirty == Re && e.type.eq(this.widget.type);
  }
  parseRule() {
    return { ignore: !0 };
  }
  stopEvent(e) {
    let t = this.widget.spec.stopEvent;
    return t ? t(e) : !1;
  }
  ignoreMutation(e) {
    return e.type != "selection" || this.widget.spec.ignoreSelection;
  }
  destroy() {
    this.widget.type.destroy(this.dom), super.destroy();
  }
  get domAtom() {
    return !0;
  }
  get side() {
    return this.widget.type.side;
  }
}
class Cd extends Qn {
  constructor(e, t, r, i) {
    super(e, [], t, null), this.textDOM = r, this.text = i;
  }
  get size() {
    return this.text.length;
  }
  localPosFromDOM(e, t) {
    return e != this.textDOM ? this.posAtStart + (t ? this.size : 0) : this.posAtStart + t;
  }
  domFromPos(e) {
    return { node: this.textDOM, offset: e };
  }
  ignoreMutation(e) {
    return e.type === "characterData" && e.target.nodeValue == e.oldValue;
  }
}
class Jt extends Qn {
  constructor(e, t, r, i) {
    super(e, [], r, i), this.mark = t;
  }
  static create(e, t, r, i) {
    let o = i.nodeViews[t.type.name], s = o && o(t, i, r);
    return (!s || !s.dom) && (s = Ke.renderSpec(document, t.type.spec.toDOM(t, r))), new Jt(e, t, s.dom, s.contentDOM || s.dom);
  }
  parseRule() {
    return this.dirty & Ge || this.mark.type.spec.reparseInView ? null : { mark: this.mark.type.name, attrs: this.mark.attrs, contentElement: this.contentDOM || void 0 };
  }
  matchesMark(e) {
    return this.dirty != Ge && this.mark.eq(e);
  }
  markDirty(e, t) {
    if (super.markDirty(e, t), this.dirty != Re) {
      let r = this.parent;
      for (; !r.node; )
        r = r.parent;
      r.dirty < this.dirty && (r.dirty = this.dirty), this.dirty = Re;
    }
  }
  slice(e, t, r) {
    let i = Jt.create(this.parent, this.mark, !0, r), o = this.children, s = this.size;
    t < s && (o = Ji(o, t, s, r)), e > 0 && (o = Ji(o, 0, e, r));
    for (let a = 0; a < o.length; a++)
      o[a].parent = i;
    return i.children = o, i;
  }
}
class _t extends Qn {
  constructor(e, t, r, i, o, s, a, l, c) {
    super(e, [], o, s), this.node = t, this.outerDeco = r, this.innerDeco = i, this.nodeDOM = a, s && this.updateChildren(l, c);
  }
  static create(e, t, r, i, o, s) {
    let a = o.nodeViews[t.type.name], l, c = a && a(t, o, () => {
      if (!l)
        return s;
      if (l.parent)
        return l.parent.posBeforeChild(l);
    }, r, i), u = c && c.dom, d = c && c.contentDOM;
    if (t.isText) {
      if (!u)
        u = document.createTextNode(t.text);
      else if (u.nodeType != 3)
        throw new RangeError("Text must be rendered as a DOM text node");
    } else
      u || ({ dom: u, contentDOM: d } = Ke.renderSpec(document, t.type.spec.toDOM(t)));
    !d && !t.isText && u.nodeName != "BR" && (u.hasAttribute("contenteditable") || (u.contentEditable = "false"), t.type.spec.draggable && (u.draggable = !0));
    let f = u;
    return u = pl(u, r, t), c ? l = new Td(e, t, r, i, u, d || null, f, c, o, s + 1) : t.isText ? new Xr(e, t, r, i, u, f, o) : new _t(e, t, r, i, u, d || null, f, o, s + 1);
  }
  parseRule() {
    if (this.node.type.spec.reparseInView)
      return null;
    let e = { node: this.node.type.name, attrs: this.node.attrs };
    if (this.node.type.whitespace == "pre" && (e.preserveWhitespace = "full"), !this.contentDOM)
      e.getContent = () => this.node.content;
    else if (!this.contentLost)
      e.contentElement = this.contentDOM;
    else {
      for (let t = this.children.length - 1; t >= 0; t--) {
        let r = this.children[t];
        if (this.dom.contains(r.dom.parentNode)) {
          e.contentElement = r.dom.parentNode;
          break;
        }
      }
      e.contentElement || (e.getContent = () => x.empty);
    }
    return e;
  }
  matchesNode(e, t, r) {
    return this.dirty == Re && e.eq(this.node) && Ki(t, this.outerDeco) && r.eq(this.innerDeco);
  }
  get size() {
    return this.node.nodeSize;
  }
  get border() {
    return this.node.isLeaf ? 0 : 1;
  }
  updateChildren(e, t) {
    let r = this.node.inlineContent, i = t, o = e.composing ? this.localCompositionInfo(e, t) : null, s = o && o.pos > -1 ? o : null, a = o && o.pos < 0, l = new Ad(this, s && s.node, e);
    Id(this.node, this.innerDeco, (c, u, d) => {
      c.spec.marks ? l.syncToMarks(c.spec.marks, r, e) : c.type.side >= 0 && !d && l.syncToMarks(u == this.node.childCount ? z.none : this.node.child(u).marks, r, e), l.placeWidget(c, e, i);
    }, (c, u, d, f) => {
      l.syncToMarks(c.marks, r, e);
      let p;
      l.findNodeMatch(c, u, d, f) || a && e.state.selection.from > i && e.state.selection.to < i + c.nodeSize && (p = l.findIndexWithChild(o.node)) > -1 && l.updateNodeAt(c, u, d, p, e) || l.updateNextNode(c, u, d, e, f) || l.addNode(c, u, d, e, i), i += c.nodeSize;
    }), l.syncToMarks([], r, e), this.node.isTextblock && l.addTextblockHacks(), l.destroyRest(), (l.changed || this.dirty == un) && (s && this.protectLocalComposition(e, s), dl(this.contentDOM, this.children, e), yn && Pd(this.dom));
  }
  localCompositionInfo(e, t) {
    let { from: r, to: i } = e.state.selection;
    if (!(e.state.selection instanceof D) || r < t || i > t + this.node.content.size)
      return null;
    let o = e.domSelectionRange(), s = Rd(o.focusNode, o.focusOffset);
    if (!s || !this.dom.contains(s.parentNode))
      return null;
    if (this.node.inlineContent) {
      let a = s.nodeValue, l = Bd(this.node.content, a, r - t, i - t);
      return l < 0 ? null : { node: s, pos: l, text: a };
    } else
      return { node: s, pos: -1, text: "" };
  }
  protectLocalComposition(e, { node: t, pos: r, text: i }) {
    if (this.getDesc(t))
      return;
    let o = t;
    for (; o.parentNode != this.contentDOM; o = o.parentNode) {
      for (; o.previousSibling; )
        o.parentNode.removeChild(o.previousSibling);
      for (; o.nextSibling; )
        o.parentNode.removeChild(o.nextSibling);
      o.pmViewDesc && (o.pmViewDesc = void 0);
    }
    let s = new Cd(this, o, t, i);
    e.input.compositionNodes.push(s), this.children = Ji(this.children, r, r + i.length, e, s);
  }
  update(e, t, r, i) {
    return this.dirty == Ge || !e.sameMarkup(this.node) ? !1 : (this.updateInner(e, t, r, i), !0);
  }
  updateInner(e, t, r, i) {
    this.updateOuterDeco(t), this.node = e, this.innerDeco = r, this.contentDOM && this.updateChildren(i, this.posAtStart), this.dirty = Re;
  }
  updateOuterDeco(e) {
    if (Ki(e, this.outerDeco))
      return;
    let t = this.nodeDOM.nodeType != 1, r = this.dom;
    this.dom = fl(this.dom, this.nodeDOM, qi(this.outerDeco, this.node, t), qi(e, this.node, t)), this.dom != r && (r.pmViewDesc = void 0, this.dom.pmViewDesc = this), this.outerDeco = e;
  }
  selectNode() {
    this.nodeDOM.nodeType == 1 && this.nodeDOM.classList.add("ProseMirror-selectednode"), (this.contentDOM || !this.node.type.spec.draggable) && (this.dom.draggable = !0);
  }
  deselectNode() {
    this.nodeDOM.nodeType == 1 && this.nodeDOM.classList.remove("ProseMirror-selectednode"), (this.contentDOM || !this.node.type.spec.draggable) && this.dom.removeAttribute("draggable");
  }
  get domAtom() {
    return this.node.isAtom;
  }
}
function ps(n, e, t, r, i) {
  return pl(r, e, n), new _t(void 0, n, e, t, r, r, r, i, 0);
}
class Xr extends _t {
  constructor(e, t, r, i, o, s, a) {
    super(e, t, r, i, o, null, s, a, 0);
  }
  parseRule() {
    let e = this.nodeDOM.parentNode;
    for (; e && e != this.dom && !e.pmIsDeco; )
      e = e.parentNode;
    return { skip: e || !0 };
  }
  update(e, t, r, i) {
    return this.dirty == Ge || this.dirty != Re && !this.inParent() || !e.sameMarkup(this.node) ? !1 : (this.updateOuterDeco(t), (this.dirty != Re || e.text != this.node.text) && e.text != this.nodeDOM.nodeValue && (this.nodeDOM.nodeValue = e.text, i.trackWrites == this.nodeDOM && (i.trackWrites = null)), this.node = e, this.dirty = Re, !0);
  }
  inParent() {
    let e = this.parent.contentDOM;
    for (let t = this.nodeDOM; t; t = t.parentNode)
      if (t == e)
        return !0;
    return !1;
  }
  domFromPos(e) {
    return { node: this.nodeDOM, offset: e };
  }
  localPosFromDOM(e, t, r) {
    return e == this.nodeDOM ? this.posAtStart + Math.min(t, this.node.text.length) : super.localPosFromDOM(e, t, r);
  }
  ignoreMutation(e) {
    return e.type != "characterData" && e.type != "selection";
  }
  slice(e, t, r) {
    let i = this.node.cut(e, t), o = document.createTextNode(i.text);
    return new Xr(this.parent, i, this.outerDeco, this.innerDeco, o, o, r);
  }
  markDirty(e, t) {
    super.markDirty(e, t), this.dom != this.nodeDOM && (e == 0 || t == this.nodeDOM.nodeValue.length) && (this.dirty = Ge);
  }
  get domAtom() {
    return !1;
  }
}
class ul extends Qn {
  parseRule() {
    return { ignore: !0 };
  }
  matchesHack(e) {
    return this.dirty == Re && this.dom.nodeName == e;
  }
  get domAtom() {
    return !0;
  }
  get ignoreForCoords() {
    return this.dom.nodeName == "IMG";
  }
}
class Td extends _t {
  constructor(e, t, r, i, o, s, a, l, c, u) {
    super(e, t, r, i, o, s, a, c, u), this.spec = l;
  }
  update(e, t, r, i) {
    if (this.dirty == Ge)
      return !1;
    if (this.spec.update) {
      let o = this.spec.update(e, t, r);
      return o && this.updateInner(e, t, r, i), o;
    } else
      return !this.contentDOM && !e.isLeaf ? !1 : super.update(e, t, r, i);
  }
  selectNode() {
    this.spec.selectNode ? this.spec.selectNode() : super.selectNode();
  }
  deselectNode() {
    this.spec.deselectNode ? this.spec.deselectNode() : super.deselectNode();
  }
  setSelection(e, t, r, i) {
    this.spec.setSelection ? this.spec.setSelection(e, t, r) : super.setSelection(e, t, r, i);
  }
  destroy() {
    this.spec.destroy && this.spec.destroy(), super.destroy();
  }
  stopEvent(e) {
    return this.spec.stopEvent ? this.spec.stopEvent(e) : !1;
  }
  ignoreMutation(e) {
    return this.spec.ignoreMutation ? this.spec.ignoreMutation(e) : super.ignoreMutation(e);
  }
}
function dl(n, e, t) {
  let r = n.firstChild, i = !1;
  for (let o = 0; o < e.length; o++) {
    let s = e[o], a = s.dom;
    if (a.parentNode == n) {
      for (; a != r; )
        r = hs(r), i = !0;
      r = r.nextSibling;
    } else
      i = !0, n.insertBefore(a, r);
    if (s instanceof Jt) {
      let l = r ? r.previousSibling : n.lastChild;
      dl(s.contentDOM, s.children, t), r = l ? l.nextSibling : n.firstChild;
    }
  }
  for (; r; )
    r = hs(r), i = !0;
  i && t.trackWrites == n && (t.trackWrites = null);
}
const Vn = function(n) {
  n && (this.nodeName = n);
};
Vn.prototype = /* @__PURE__ */ Object.create(null);
const Lt = [new Vn()];
function qi(n, e, t) {
  if (n.length == 0)
    return Lt;
  let r = t ? Lt[0] : new Vn(), i = [r];
  for (let o = 0; o < n.length; o++) {
    let s = n[o].type.attrs;
    if (!!s) {
      s.nodeName && i.push(r = new Vn(s.nodeName));
      for (let a in s) {
        let l = s[a];
        l != null && (t && i.length == 1 && i.push(r = new Vn(e.isInline ? "span" : "div")), a == "class" ? r.class = (r.class ? r.class + " " : "") + l : a == "style" ? r.style = (r.style ? r.style + ";" : "") + l : a != "nodeName" && (r[a] = l));
      }
    }
  }
  return i;
}
function fl(n, e, t, r) {
  if (t == Lt && r == Lt)
    return e;
  let i = e;
  for (let o = 0; o < r.length; o++) {
    let s = r[o], a = t[o];
    if (o) {
      let l;
      a && a.nodeName == s.nodeName && i != n && (l = i.parentNode) && l.nodeName.toLowerCase() == s.nodeName || (l = document.createElement(s.nodeName), l.pmIsDeco = !0, l.appendChild(i), a = Lt[0]), i = l;
    }
    Ed(i, a || Lt[0], s);
  }
  return i;
}
function Ed(n, e, t) {
  for (let r in e)
    r != "class" && r != "style" && r != "nodeName" && !(r in t) && n.removeAttribute(r);
  for (let r in t)
    r != "class" && r != "style" && r != "nodeName" && t[r] != e[r] && n.setAttribute(r, t[r]);
  if (e.class != t.class) {
    let r = e.class ? e.class.split(" ").filter(Boolean) : [], i = t.class ? t.class.split(" ").filter(Boolean) : [];
    for (let o = 0; o < r.length; o++)
      i.indexOf(r[o]) == -1 && n.classList.remove(r[o]);
    for (let o = 0; o < i.length; o++)
      r.indexOf(i[o]) == -1 && n.classList.add(i[o]);
    n.classList.length == 0 && n.removeAttribute("class");
  }
  if (e.style != t.style) {
    if (e.style) {
      let r = /\s*([\w\-\xa1-\uffff]+)\s*:(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\(.*?\)|[^;])*/g, i;
      for (; i = r.exec(e.style); )
        n.style.removeProperty(i[1]);
    }
    t.style && (n.style.cssText += t.style);
  }
}
function pl(n, e, t) {
  return fl(n, n, Lt, qi(e, t, n.nodeType != 1));
}
function Ki(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (!n[t].type.eq(e[t].type))
      return !1;
  return !0;
}
function hs(n) {
  let e = n.nextSibling;
  return n.parentNode.removeChild(n), e;
}
class Ad {
  constructor(e, t, r) {
    this.lock = t, this.view = r, this.index = 0, this.stack = [], this.changed = !1, this.top = e, this.preMatch = Nd(e.node.content, e);
  }
  destroyBetween(e, t) {
    if (e != t) {
      for (let r = e; r < t; r++)
        this.top.children[r].destroy();
      this.top.children.splice(e, t - e), this.changed = !0;
    }
  }
  destroyRest() {
    this.destroyBetween(this.index, this.top.children.length);
  }
  syncToMarks(e, t, r) {
    let i = 0, o = this.stack.length >> 1, s = Math.min(o, e.length);
    for (; i < s && (i == o - 1 ? this.top : this.stack[i + 1 << 1]).matchesMark(e[i]) && e[i].type.spec.spanning !== !1; )
      i++;
    for (; i < o; )
      this.destroyRest(), this.top.dirty = Re, this.index = this.stack.pop(), this.top = this.stack.pop(), o--;
    for (; o < e.length; ) {
      this.stack.push(this.top, this.index + 1);
      let a = -1;
      for (let l = this.index; l < Math.min(this.index + 3, this.top.children.length); l++)
        if (this.top.children[l].matchesMark(e[o])) {
          a = l;
          break;
        }
      if (a > -1)
        a > this.index && (this.changed = !0, this.destroyBetween(this.index, a)), this.top = this.top.children[this.index];
      else {
        let l = Jt.create(this.top, e[o], t, r);
        this.top.children.splice(this.index, 0, l), this.top = l, this.changed = !0;
      }
      this.index = 0, o++;
    }
  }
  findNodeMatch(e, t, r, i) {
    let o = -1, s;
    if (i >= this.preMatch.index && (s = this.preMatch.matches[i - this.preMatch.index]).parent == this.top && s.matchesNode(e, t, r))
      o = this.top.children.indexOf(s, this.index);
    else
      for (let a = this.index, l = Math.min(this.top.children.length, a + 5); a < l; a++) {
        let c = this.top.children[a];
        if (c.matchesNode(e, t, r) && !this.preMatch.matched.has(c)) {
          o = a;
          break;
        }
      }
    return o < 0 ? !1 : (this.destroyBetween(this.index, o), this.index++, !0);
  }
  updateNodeAt(e, t, r, i, o) {
    let s = this.top.children[i];
    return s.dirty == Ge && s.dom == s.contentDOM && (s.dirty = un), s.update(e, t, r, o) ? (this.destroyBetween(this.index, i), this.index++, !0) : !1;
  }
  findIndexWithChild(e) {
    for (; ; ) {
      let t = e.parentNode;
      if (!t)
        return -1;
      if (t == this.top.contentDOM) {
        let r = e.pmViewDesc;
        if (r) {
          for (let i = this.index; i < this.top.children.length; i++)
            if (this.top.children[i] == r)
              return i;
        }
        return -1;
      }
      e = t;
    }
  }
  updateNextNode(e, t, r, i, o) {
    for (let s = this.index; s < this.top.children.length; s++) {
      let a = this.top.children[s];
      if (a instanceof _t) {
        let l = this.preMatch.matched.get(a);
        if (l != null && l != o)
          return !1;
        let c = a.dom;
        if (!(this.lock && (c == this.lock || c.nodeType == 1 && c.contains(this.lock.parentNode)) && !(e.isText && a.node && a.node.isText && a.nodeDOM.nodeValue == e.text && a.dirty != Ge && Ki(t, a.outerDeco))) && a.update(e, t, r, i))
          return this.destroyBetween(this.index, s), a.dom != c && (this.changed = !0), this.index++, !0;
        break;
      }
    }
    return !1;
  }
  addNode(e, t, r, i, o) {
    this.top.children.splice(this.index++, 0, _t.create(this.top, e, t, r, i, o)), this.changed = !0;
  }
  placeWidget(e, t, r) {
    let i = this.index < this.top.children.length ? this.top.children[this.index] : null;
    if (i && i.matchesWidget(e) && (e == i.widget || !i.widget.type.toDOM.parentNode))
      this.index++;
    else {
      let o = new cl(this.top, e, t, r);
      this.top.children.splice(this.index++, 0, o), this.changed = !0;
    }
  }
  addTextblockHacks() {
    let e = this.top.children[this.index - 1], t = this.top;
    for (; e instanceof Jt; )
      t = e, e = t.children[t.children.length - 1];
    (!e || !(e instanceof Xr) || /\n$/.test(e.node.text) || this.view.requiresGeckoHackNode && /\s$/.test(e.node.text)) && ((ae || fe) && e && e.dom.contentEditable == "false" && this.addHackNode("IMG", t), this.addHackNode("BR", this.top));
  }
  addHackNode(e, t) {
    if (t == this.top && this.index < t.children.length && t.children[this.index].matchesHack(e))
      this.index++;
    else {
      let r = document.createElement(e);
      e == "IMG" && (r.className = "ProseMirror-separator", r.alt = ""), e == "BR" && (r.className = "ProseMirror-trailingBreak");
      let i = new ul(this.top, [], r, null);
      t != this.top ? t.children.push(i) : t.children.splice(this.index++, 0, i), this.changed = !0;
    }
  }
}
function Nd(n, e) {
  let t = e, r = t.children.length, i = n.childCount, o = /* @__PURE__ */ new Map(), s = [];
  e:
    for (; i > 0; ) {
      let a;
      for (; ; )
        if (r) {
          let c = t.children[r - 1];
          if (c instanceof Jt)
            t = c, r = c.children.length;
          else {
            a = c, r--;
            break;
          }
        } else {
          if (t == e)
            break e;
          r = t.parent.children.indexOf(t), t = t.parent;
        }
      let l = a.node;
      if (!!l) {
        if (l != n.child(i - 1))
          break;
        --i, o.set(a, i), s.push(a);
      }
    }
  return { index: i, matched: o, matches: s.reverse() };
}
function Dd(n, e) {
  return n.type.side - e.type.side;
}
function Id(n, e, t, r) {
  let i = e.locals(n), o = 0;
  if (i.length == 0) {
    for (let c = 0; c < n.childCount; c++) {
      let u = n.child(c);
      r(u, i, e.forChild(o, u), c), o += u.nodeSize;
    }
    return;
  }
  let s = 0, a = [], l = null;
  for (let c = 0; ; ) {
    if (s < i.length && i[s].to == o) {
      let h = i[s++], m;
      for (; s < i.length && i[s].to == o; )
        (m || (m = [h])).push(i[s++]);
      if (m) {
        m.sort(Dd);
        for (let y = 0; y < m.length; y++)
          t(m[y], c, !!l);
      } else
        t(h, c, !!l);
    }
    let u, d;
    if (l)
      d = -1, u = l, l = null;
    else if (c < n.childCount)
      d = c, u = n.child(c++);
    else
      break;
    for (let h = 0; h < a.length; h++)
      a[h].to <= o && a.splice(h--, 1);
    for (; s < i.length && i[s].from <= o && i[s].to > o; )
      a.push(i[s++]);
    let f = o + u.nodeSize;
    if (u.isText) {
      let h = f;
      s < i.length && i[s].from < h && (h = i[s].from);
      for (let m = 0; m < a.length; m++)
        a[m].to < h && (h = a[m].to);
      h < f && (l = u.cut(h - o), u = u.cut(0, h - o), f = h, d = -1);
    }
    let p = u.isInline && !u.isLeaf ? a.filter((h) => !h.inline) : a.slice();
    r(u, p, e.forChild(o, u), d), o = f;
  }
}
function Pd(n) {
  if (n.nodeName == "UL" || n.nodeName == "OL") {
    let e = n.style.cssText;
    n.style.cssText = e + "; list-style: square !important", window.getComputedStyle(n).listStyle, n.style.cssText = e;
  }
}
function Rd(n, e) {
  for (; ; ) {
    if (n.nodeType == 3)
      return n;
    if (n.nodeType == 1 && e > 0) {
      if (n.childNodes.length > e && n.childNodes[e].nodeType == 3)
        return n.childNodes[e];
      n = n.childNodes[e - 1], e = We(n);
    } else if (n.nodeType == 1 && e < n.childNodes.length)
      n = n.childNodes[e], e = 0;
    else
      return null;
  }
}
function Bd(n, e, t, r) {
  for (let i = 0, o = 0; i < n.childCount && o <= r; ) {
    let s = n.child(i++), a = o;
    if (o += s.nodeSize, !s.isText)
      continue;
    let l = s.text;
    for (; i < n.childCount; ) {
      let c = n.child(i++);
      if (o += c.nodeSize, !c.isText)
        break;
      l += c.text;
    }
    if (o >= t) {
      let c = a < r ? l.lastIndexOf(e, r - a - 1) : -1;
      if (c >= 0 && c + e.length + a >= t)
        return a + c;
      if (t == r && l.length >= r + e.length - a && l.slice(r - a, r - a + e.length) == e)
        return r;
    }
  }
  return -1;
}
function Ji(n, e, t, r, i) {
  let o = [];
  for (let s = 0, a = 0; s < n.length; s++) {
    let l = n[s], c = a, u = a += l.size;
    c >= t || u <= e ? o.push(l) : (c < e && o.push(l.slice(0, e - c, r)), i && (o.push(i), i = void 0), u > t && o.push(l.slice(t - c, l.size, r)));
  }
  return o;
}
function yo(n, e = null) {
  let t = n.domSelectionRange(), r = n.state.doc;
  if (!t.focusNode)
    return null;
  let i = n.docView.nearestDesc(t.focusNode), o = i && i.size == 0, s = n.docView.posFromDOM(t.focusNode, t.focusOffset, 1);
  if (s < 0)
    return null;
  let a = r.resolve(s), l, c;
  if (Gr(t)) {
    for (l = a; i && !i.node; )
      i = i.parent;
    let u = i.node;
    if (i && u.isAtom && N.isSelectable(u) && i.parent && !(u.isInline && sd(t.focusNode, t.focusOffset, i.dom))) {
      let d = i.posBefore;
      c = new N(s == d ? a : r.resolve(d));
    }
  } else {
    let u = n.docView.posFromDOM(t.anchorNode, t.anchorOffset, 1);
    if (u < 0)
      return null;
    l = r.resolve(u);
  }
  if (!c) {
    let u = e == "pointer" || n.state.selection.head < a.pos && !o ? 1 : -1;
    c = bo(n, l, a, u);
  }
  return c;
}
function hl(n) {
  return n.editable ? n.hasFocus() : gl(n) && document.activeElement && document.activeElement.contains(n.dom);
}
function at(n, e = !1) {
  let t = n.state.selection;
  if (ml(n, t), !!hl(n)) {
    if (!e && n.input.mouseDown && n.input.mouseDown.allowDefault && fe) {
      let r = n.domSelectionRange(), i = n.domObserver.currentSelection;
      if (r.anchorNode && i.anchorNode && Kt(r.anchorNode, r.anchorOffset, i.anchorNode, i.anchorOffset)) {
        n.input.mouseDown.delayedSelectionSync = !0, n.domObserver.setCurSelection();
        return;
      }
    }
    if (n.domObserver.disconnectSelection(), n.cursorWrapper)
      $d(n);
    else {
      let { anchor: r, head: i } = t, o, s;
      ms && !(t instanceof D) && (t.$from.parent.inlineContent || (o = gs(n, t.from)), !t.empty && !t.$from.parent.inlineContent && (s = gs(n, t.to))), n.docView.setSelection(r, i, n.root, e), ms && (o && ys(o), s && ys(s)), t.visible ? n.dom.classList.remove("ProseMirror-hideselection") : (n.dom.classList.add("ProseMirror-hideselection"), "onselectionchange" in document && Ld(n));
    }
    n.domObserver.setCurSelection(), n.domObserver.connectSelection();
  }
}
const ms = ae || fe && cd < 63;
function gs(n, e) {
  let { node: t, offset: r } = n.docView.domFromPos(e, 0), i = r < t.childNodes.length ? t.childNodes[r] : null, o = r ? t.childNodes[r - 1] : null;
  if (ae && i && i.contentEditable == "false")
    return ki(i);
  if ((!i || i.contentEditable == "false") && (!o || o.contentEditable == "false")) {
    if (i)
      return ki(i);
    if (o)
      return ki(o);
  }
}
function ki(n) {
  return n.contentEditable = "true", ae && n.draggable && (n.draggable = !1, n.wasDraggable = !0), n;
}
function ys(n) {
  n.contentEditable = "false", n.wasDraggable && (n.draggable = !0, n.wasDraggable = null);
}
function Ld(n) {
  let e = n.dom.ownerDocument;
  e.removeEventListener("selectionchange", n.input.hideSelectionGuard);
  let t = n.domSelectionRange(), r = t.anchorNode, i = t.anchorOffset;
  e.addEventListener("selectionchange", n.input.hideSelectionGuard = () => {
    (t.anchorNode != r || t.anchorOffset != i) && (e.removeEventListener("selectionchange", n.input.hideSelectionGuard), setTimeout(() => {
      (!hl(n) || n.state.selection.visible) && n.dom.classList.remove("ProseMirror-hideselection");
    }, 20));
  });
}
function $d(n) {
  let e = n.domSelection(), t = document.createRange(), r = n.cursorWrapper.dom, i = r.nodeName == "IMG";
  i ? t.setEnd(r.parentNode, xe(r) + 1) : t.setEnd(r, 0), t.collapse(!1), e.removeAllRanges(), e.addRange(t), !i && !n.state.selection.visible && pe && vt <= 11 && (r.disabled = !0, r.disabled = !1);
}
function ml(n, e) {
  if (e instanceof N) {
    let t = n.docView.descAt(e.from);
    t != n.lastSelectedViewDesc && (bs(n), t && t.selectNode(), n.lastSelectedViewDesc = t);
  } else
    bs(n);
}
function bs(n) {
  n.lastSelectedViewDesc && (n.lastSelectedViewDesc.parent && n.lastSelectedViewDesc.deselectNode(), n.lastSelectedViewDesc = void 0);
}
function bo(n, e, t, r) {
  return n.someProp("createSelectionBetween", (i) => i(n, e, t)) || D.between(e, t, r);
}
function vs(n) {
  return n.editable && !n.hasFocus() ? !1 : gl(n);
}
function gl(n) {
  let e = n.domSelectionRange();
  if (!e.anchorNode)
    return !1;
  try {
    return n.dom.contains(e.anchorNode.nodeType == 3 ? e.anchorNode.parentNode : e.anchorNode) && (n.editable || n.dom.contains(e.focusNode.nodeType == 3 ? e.focusNode.parentNode : e.focusNode));
  } catch {
    return !1;
  }
}
function Fd(n) {
  let e = n.docView.domFromPos(n.state.selection.anchor, 0), t = n.domSelectionRange();
  return Kt(e.node, e.offset, t.anchorNode, t.anchorOffset);
}
function _i(n, e) {
  let { $anchor: t, $head: r } = n.selection, i = e > 0 ? t.max(r) : t.min(r), o = i.parent.inlineContent ? i.depth ? n.doc.resolve(e > 0 ? i.after() : i.before()) : null : i;
  return o && P.findFrom(o, e);
}
function Bt(n, e) {
  return n.dispatch(n.state.tr.setSelection(e).scrollIntoView()), !0;
}
function ks(n, e, t) {
  let r = n.state.selection;
  if (r instanceof D) {
    if (!r.empty || t.indexOf("s") > -1)
      return !1;
    if (n.endOfTextblock(e > 0 ? "right" : "left")) {
      let i = _i(n.state, e);
      return i && i instanceof N ? Bt(n, i) : !1;
    } else if (!(Oe && t.indexOf("m") > -1)) {
      let i = r.$head, o = i.textOffset ? null : e < 0 ? i.nodeBefore : i.nodeAfter, s;
      if (!o || o.isText)
        return !1;
      let a = e < 0 ? i.pos - o.nodeSize : i.pos;
      return o.isAtom || (s = n.docView.descAt(a)) && !s.contentDOM ? N.isSelectable(o) ? Bt(n, new N(e < 0 ? n.state.doc.resolve(i.pos - o.nodeSize) : i)) : Yr ? Bt(n, new D(n.state.doc.resolve(e < 0 ? a : a + o.nodeSize))) : !1 : !1;
    }
  } else {
    if (r instanceof N && r.node.isInline)
      return Bt(n, new D(e > 0 ? r.$to : r.$from));
    {
      let i = _i(n.state, e);
      return i ? Bt(n, i) : !1;
    }
  }
}
function Rr(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function jn(n) {
  let e = n.pmViewDesc;
  return e && e.size == 0 && (n.nextSibling || n.nodeName != "BR");
}
function xi(n) {
  let e = n.domSelectionRange(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let i, o, s = !1;
  for (Le && t.nodeType == 1 && r < Rr(t) && jn(t.childNodes[r]) && (s = !0); ; )
    if (r > 0) {
      if (t.nodeType != 1)
        break;
      {
        let a = t.childNodes[r - 1];
        if (jn(a))
          i = t, o = --r;
        else if (a.nodeType == 3)
          t = a, r = t.nodeValue.length;
        else
          break;
      }
    } else {
      if (yl(t))
        break;
      {
        let a = t.previousSibling;
        for (; a && jn(a); )
          i = t.parentNode, o = xe(a), a = a.previousSibling;
        if (a)
          t = a, r = Rr(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = 0;
        }
      }
    }
  s ? Ui(n, t, r) : i && Ui(n, i, o);
}
function wi(n) {
  let e = n.domSelectionRange(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let i = Rr(t), o, s;
  for (; ; )
    if (r < i) {
      if (t.nodeType != 1)
        break;
      let a = t.childNodes[r];
      if (jn(a))
        o = t, s = ++r;
      else
        break;
    } else {
      if (yl(t))
        break;
      {
        let a = t.nextSibling;
        for (; a && jn(a); )
          o = a.parentNode, s = xe(a) + 1, a = a.nextSibling;
        if (a)
          t = a, r = 0, i = Rr(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = i = 0;
        }
      }
    }
  o && Ui(n, o, s);
}
function yl(n) {
  let e = n.pmViewDesc;
  return e && e.node && e.node.isBlock;
}
function Ui(n, e, t) {
  let r = n.domSelection();
  if (Gr(r)) {
    let o = document.createRange();
    o.setEnd(e, t), o.setStart(e, t), r.removeAllRanges(), r.addRange(o);
  } else
    r.extend && r.extend(e, t);
  n.domObserver.setCurSelection();
  let { state: i } = n;
  setTimeout(() => {
    n.state == i && at(n);
  }, 50);
}
function xs(n, e, t) {
  let r = n.state.selection;
  if (r instanceof D && !r.empty || t.indexOf("s") > -1 || Oe && t.indexOf("m") > -1)
    return !1;
  let { $from: i, $to: o } = r;
  if (!i.parent.inlineContent || n.endOfTextblock(e < 0 ? "up" : "down")) {
    let s = _i(n.state, e);
    if (s && s instanceof N)
      return Bt(n, s);
  }
  if (!i.parent.inlineContent) {
    let s = e < 0 ? i : o, a = r instanceof Pe ? P.near(s, e) : P.findFrom(s, e);
    return a ? Bt(n, a) : !1;
  }
  return !1;
}
function ws(n, e) {
  if (!(n.state.selection instanceof D))
    return !0;
  let { $head: t, $anchor: r, empty: i } = n.state.selection;
  if (!t.sameParent(r))
    return !0;
  if (!i)
    return !1;
  if (n.endOfTextblock(e > 0 ? "forward" : "backward"))
    return !0;
  let o = !t.textOffset && (e < 0 ? t.nodeBefore : t.nodeAfter);
  if (o && !o.isText) {
    let s = n.state.tr;
    return e < 0 ? s.delete(t.pos - o.nodeSize, t.pos) : s.delete(t.pos, t.pos + o.nodeSize), n.dispatch(s), !0;
  }
  return !1;
}
function Ss(n, e, t) {
  n.domObserver.stop(), e.contentEditable = t, n.domObserver.start();
}
function zd(n) {
  if (!ae || n.state.selection.$head.parentOffset > 0)
    return !1;
  let { focusNode: e, focusOffset: t } = n.domSelectionRange();
  if (e && e.nodeType == 1 && t == 0 && e.firstChild && e.firstChild.contentEditable == "false") {
    let r = e.firstChild;
    Ss(n, r, "true"), setTimeout(() => Ss(n, r, "false"), 20);
  }
  return !1;
}
function Vd(n) {
  let e = "";
  return n.ctrlKey && (e += "c"), n.metaKey && (e += "m"), n.altKey && (e += "a"), n.shiftKey && (e += "s"), e;
}
function jd(n, e) {
  let t = e.keyCode, r = Vd(e);
  return t == 8 || Oe && t == 72 && r == "c" ? ws(n, -1) || xi(n) : t == 46 || Oe && t == 68 && r == "c" ? ws(n, 1) || wi(n) : t == 13 || t == 27 ? !0 : t == 37 || Oe && t == 66 && r == "c" ? ks(n, -1, r) || xi(n) : t == 39 || Oe && t == 70 && r == "c" ? ks(n, 1, r) || wi(n) : t == 38 || Oe && t == 80 && r == "c" ? xs(n, -1, r) || xi(n) : t == 40 || Oe && t == 78 && r == "c" ? zd(n) || xs(n, 1, r) || wi(n) : r == (Oe ? "m" : "c") && (t == 66 || t == 73 || t == 89 || t == 90);
}
function bl(n, e) {
  n.someProp("transformCopied", (p) => {
    e = p(e, n);
  });
  let t = [], { content: r, openStart: i, openEnd: o } = e;
  for (; i > 1 && o > 1 && r.childCount == 1 && r.firstChild.childCount == 1; ) {
    i--, o--;
    let p = r.firstChild;
    t.push(p.type.name, p.attrs != p.type.defaultAttrs ? p.attrs : null), r = p.content;
  }
  let s = n.someProp("clipboardSerializer") || Ke.fromSchema(n.state.schema), a = Ml(), l = a.createElement("div");
  l.appendChild(s.serializeFragment(r, { document: a }));
  let c = l.firstChild, u, d = 0;
  for (; c && c.nodeType == 1 && (u = Sl[c.nodeName.toLowerCase()]); ) {
    for (let p = u.length - 1; p >= 0; p--) {
      let h = a.createElement(u[p]);
      for (; l.firstChild; )
        h.appendChild(l.firstChild);
      l.appendChild(h), d++;
    }
    c = l.firstChild;
  }
  c && c.nodeType == 1 && c.setAttribute("data-pm-slice", `${i} ${o}${d ? ` -${d}` : ""} ${JSON.stringify(t)}`);
  let f = n.someProp("clipboardTextSerializer", (p) => p(e, n)) || e.content.textBetween(0, e.content.size, `

`);
  return { dom: l, text: f };
}
function vl(n, e, t, r, i) {
  let o = i.parent.type.spec.code, s, a;
  if (!t && !e)
    return null;
  let l = e && (r || o || !t);
  if (l) {
    if (n.someProp("transformPastedText", (f) => {
      e = f(e, o || r, n);
    }), o)
      return e ? new S(x.from(n.state.schema.text(e.replace(/\r\n?/g, `
`))), 0, 0) : S.empty;
    let d = n.someProp("clipboardTextParser", (f) => f(e, i, r, n));
    if (d)
      a = d;
    else {
      let f = i.marks(), { schema: p } = n.state, h = Ke.fromSchema(p);
      s = document.createElement("div"), e.split(/(?:\r\n?|\n)+/).forEach((m) => {
        let y = s.appendChild(document.createElement("p"));
        m && y.appendChild(h.serializeNode(p.text(m, f)));
      });
    }
  } else
    n.someProp("transformPastedHTML", (d) => {
      t = d(t, n);
    }), s = qd(t), Yr && Kd(s);
  let c = s && s.querySelector("[data-pm-slice]"), u = c && /^(\d+) (\d+)(?: -(\d+))? (.*)/.exec(c.getAttribute("data-pm-slice") || "");
  if (u && u[3])
    for (let d = +u[3]; d > 0; d--) {
      let f = s.firstChild;
      for (; f && f.nodeType != 1; )
        f = f.nextSibling;
      if (!f)
        break;
      s = f;
    }
  if (a || (a = (n.someProp("clipboardParser") || n.someProp("domParser") || qt.fromSchema(n.state.schema)).parseSlice(s, {
    preserveWhitespace: !!(l || u),
    context: i,
    ruleFromNode(f) {
      return f.nodeName == "BR" && !f.nextSibling && f.parentNode && !Hd.test(f.parentNode.nodeName) ? { ignore: !0 } : null;
    }
  })), u)
    a = Jd(Ms(a, +u[1], +u[2]), u[4]);
  else if (a = S.maxOpen(Wd(a.content, i), !0), a.openStart || a.openEnd) {
    let d = 0, f = 0;
    for (let p = a.content.firstChild; d < a.openStart && !p.type.spec.isolating; d++, p = p.firstChild)
      ;
    for (let p = a.content.lastChild; f < a.openEnd && !p.type.spec.isolating; f++, p = p.lastChild)
      ;
    a = Ms(a, d, f);
  }
  return n.someProp("transformPasted", (d) => {
    a = d(a, n);
  }), a;
}
const Hd = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function Wd(n, e) {
  if (n.childCount < 2)
    return n;
  for (let t = e.depth; t >= 0; t--) {
    let i = e.node(t).contentMatchAt(e.index(t)), o, s = [];
    if (n.forEach((a) => {
      if (!s)
        return;
      let l = i.findWrapping(a.type), c;
      if (!l)
        return s = null;
      if (c = s.length && o.length && xl(l, o, a, s[s.length - 1], 0))
        s[s.length - 1] = c;
      else {
        s.length && (s[s.length - 1] = wl(s[s.length - 1], o.length));
        let u = kl(a, l);
        s.push(u), i = i.matchType(u.type), o = l;
      }
    }), s)
      return x.from(s);
  }
  return n;
}
function kl(n, e, t = 0) {
  for (let r = e.length - 1; r >= t; r--)
    n = e[r].create(null, x.from(n));
  return n;
}
function xl(n, e, t, r, i) {
  if (i < n.length && i < e.length && n[i] == e[i]) {
    let o = xl(n, e, t, r.lastChild, i + 1);
    if (o)
      return r.copy(r.content.replaceChild(r.childCount - 1, o));
    if (r.contentMatchAt(r.childCount).matchType(i == n.length - 1 ? t.type : n[i + 1]))
      return r.copy(r.content.append(x.from(kl(t, n, i + 1))));
  }
}
function wl(n, e) {
  if (e == 0)
    return n;
  let t = n.content.replaceChild(n.childCount - 1, wl(n.lastChild, e - 1)), r = n.contentMatchAt(n.childCount).fillBefore(x.empty, !0);
  return n.copy(t.append(r));
}
function Gi(n, e, t, r, i, o) {
  let s = e < 0 ? n.firstChild : n.lastChild, a = s.content;
  return i < r - 1 && (a = Gi(a, e, t, r, i + 1, o)), i >= t && (a = e < 0 ? s.contentMatchAt(0).fillBefore(a, n.childCount > 1 || o <= i).append(a) : a.append(s.contentMatchAt(s.childCount).fillBefore(x.empty, !0))), n.replaceChild(e < 0 ? 0 : n.childCount - 1, s.copy(a));
}
function Ms(n, e, t) {
  return e < n.openStart && (n = new S(Gi(n.content, -1, e, n.openStart, 0, n.openEnd), e, n.openEnd)), t < n.openEnd && (n = new S(Gi(n.content, 1, t, n.openEnd, 0, 0), n.openStart, t)), n;
}
const Sl = {
  thead: ["table"],
  tbody: ["table"],
  tfoot: ["table"],
  caption: ["table"],
  colgroup: ["table"],
  col: ["table", "colgroup"],
  tr: ["table", "tbody"],
  td: ["table", "tbody", "tr"],
  th: ["table", "tbody", "tr"]
};
let Os = null;
function Ml() {
  return Os || (Os = document.implementation.createHTMLDocument("title"));
}
function qd(n) {
  let e = /^(\s*<meta [^>]*>)*/.exec(n);
  e && (n = n.slice(e[0].length));
  let t = Ml().createElement("div"), r = /<([a-z][^>\s]+)/i.exec(n), i;
  if ((i = r && Sl[r[1].toLowerCase()]) && (n = i.map((o) => "<" + o + ">").join("") + n + i.map((o) => "</" + o + ">").reverse().join("")), t.innerHTML = n, i)
    for (let o = 0; o < i.length; o++)
      t = t.querySelector(i[o]) || t;
  return t;
}
function Kd(n) {
  let e = n.querySelectorAll(fe ? "span:not([class]):not([style])" : "span.Apple-converted-space");
  for (let t = 0; t < e.length; t++) {
    let r = e[t];
    r.childNodes.length == 1 && r.textContent == "\xA0" && r.parentNode && r.parentNode.replaceChild(n.ownerDocument.createTextNode(" "), r);
  }
}
function Jd(n, e) {
  if (!n.size)
    return n;
  let t = n.content.firstChild.type.schema, r;
  try {
    r = JSON.parse(e);
  } catch {
    return n;
  }
  let { content: i, openStart: o, openEnd: s } = n;
  for (let a = r.length - 2; a >= 0; a -= 2) {
    let l = t.nodes[r[a]];
    if (!l || l.hasRequiredAttrs())
      break;
    i = x.from(l.create(r[a + 1], i)), o++, s++;
  }
  return new S(i, o, s);
}
const le = {}, ce = {}, _d = { touchstart: !0, touchmove: !0 };
class Ud {
  constructor() {
    this.shiftKey = !1, this.mouseDown = null, this.lastKeyCode = null, this.lastKeyCodeTime = 0, this.lastClick = { time: 0, x: 0, y: 0, type: "" }, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastIOSEnter = 0, this.lastIOSEnterFallbackTimeout = -1, this.lastFocus = 0, this.lastTouch = 0, this.lastAndroidDelete = 0, this.composing = !1, this.composingTimeout = -1, this.compositionNodes = [], this.compositionEndedAt = -2e8, this.domChangeCount = 0, this.eventHandlers = /* @__PURE__ */ Object.create(null), this.hideSelectionGuard = null;
  }
}
function Gd(n) {
  for (let e in le) {
    let t = le[e];
    n.dom.addEventListener(e, n.input.eventHandlers[e] = (r) => {
      Xd(n, r) && !vo(n, r) && (n.editable || !(r.type in ce)) && t(n, r);
    }, _d[e] ? { passive: !0 } : void 0);
  }
  ae && n.dom.addEventListener("input", () => null), Yi(n);
}
function bt(n, e) {
  n.input.lastSelectionOrigin = e, n.input.lastSelectionTime = Date.now();
}
function Yd(n) {
  n.domObserver.stop();
  for (let e in n.input.eventHandlers)
    n.dom.removeEventListener(e, n.input.eventHandlers[e]);
  clearTimeout(n.input.composingTimeout), clearTimeout(n.input.lastIOSEnterFallbackTimeout);
}
function Yi(n) {
  n.someProp("handleDOMEvents", (e) => {
    for (let t in e)
      n.input.eventHandlers[t] || n.dom.addEventListener(t, n.input.eventHandlers[t] = (r) => vo(n, r));
  });
}
function vo(n, e) {
  return n.someProp("handleDOMEvents", (t) => {
    let r = t[e.type];
    return r ? r(n, e) || e.defaultPrevented : !1;
  });
}
function Xd(n, e) {
  if (!e.bubbles)
    return !0;
  if (e.defaultPrevented)
    return !1;
  for (let t = e.target; t != n.dom; t = t.parentNode)
    if (!t || t.nodeType == 11 || t.pmViewDesc && t.pmViewDesc.stopEvent(e))
      return !1;
  return !0;
}
function Zd(n, e) {
  !vo(n, e) && le[e.type] && (n.editable || !(e.type in ce)) && le[e.type](n, e);
}
ce.keydown = (n, e) => {
  let t = e;
  if (n.input.shiftKey = t.keyCode == 16 || t.shiftKey, !Cl(n, t) && (n.input.lastKeyCode = t.keyCode, n.input.lastKeyCodeTime = Date.now(), !(qe && fe && t.keyCode == 13)))
    if (t.keyCode != 229 && n.domObserver.forceFlush(), yn && t.keyCode == 13 && !t.ctrlKey && !t.altKey && !t.metaKey) {
      let r = Date.now();
      n.input.lastIOSEnter = r, n.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
        n.input.lastIOSEnter == r && (n.someProp("handleKeyDown", (i) => i(n, cn(13, "Enter"))), n.input.lastIOSEnter = 0);
      }, 200);
    } else
      n.someProp("handleKeyDown", (r) => r(n, t)) || jd(n, t) ? t.preventDefault() : bt(n, "key");
};
ce.keyup = (n, e) => {
  e.keyCode == 16 && (n.input.shiftKey = !1);
};
ce.keypress = (n, e) => {
  let t = e;
  if (Cl(n, t) || !t.charCode || t.ctrlKey && !t.altKey || Oe && t.metaKey)
    return;
  if (n.someProp("handleKeyPress", (i) => i(n, t))) {
    t.preventDefault();
    return;
  }
  let r = n.state.selection;
  if (!(r instanceof D) || !r.$from.sameParent(r.$to)) {
    let i = String.fromCharCode(t.charCode);
    n.someProp("handleTextInput", (o) => o(n, r.$from.pos, r.$to.pos, i)) || n.dispatch(n.state.tr.insertText(i).scrollIntoView()), t.preventDefault();
  }
};
function Zr(n) {
  return { left: n.clientX, top: n.clientY };
}
function Qd(n, e) {
  let t = e.x - n.clientX, r = e.y - n.clientY;
  return t * t + r * r < 100;
}
function ko(n, e, t, r, i) {
  if (r == -1)
    return !1;
  let o = n.state.doc.resolve(r);
  for (let s = o.depth + 1; s > 0; s--)
    if (n.someProp(e, (a) => s > o.depth ? a(n, t, o.nodeAfter, o.before(s), i, !0) : a(n, t, o.node(s), o.before(s), i, !1)))
      return !0;
  return !1;
}
function hn(n, e, t) {
  n.focused || n.focus();
  let r = n.state.tr.setSelection(e);
  t == "pointer" && r.setMeta("pointer", !0), n.dispatch(r);
}
function ef(n, e) {
  if (e == -1)
    return !1;
  let t = n.state.doc.resolve(e), r = t.nodeAfter;
  return r && r.isAtom && N.isSelectable(r) ? (hn(n, new N(t), "pointer"), !0) : !1;
}
function tf(n, e) {
  if (e == -1)
    return !1;
  let t = n.state.selection, r, i;
  t instanceof N && (r = t.node);
  let o = n.state.doc.resolve(e);
  for (let s = o.depth + 1; s > 0; s--) {
    let a = s > o.depth ? o.nodeAfter : o.node(s);
    if (N.isSelectable(a)) {
      r && t.$from.depth > 0 && s >= t.$from.depth && o.before(t.$from.depth + 1) == t.$from.pos ? i = o.before(t.$from.depth) : i = o.before(s);
      break;
    }
  }
  return i != null ? (hn(n, N.create(n.state.doc, i), "pointer"), !0) : !1;
}
function nf(n, e, t, r, i) {
  return ko(n, "handleClickOn", e, t, r) || n.someProp("handleClick", (o) => o(n, e, r)) || (i ? tf(n, t) : ef(n, t));
}
function rf(n, e, t, r) {
  return ko(n, "handleDoubleClickOn", e, t, r) || n.someProp("handleDoubleClick", (i) => i(n, e, r));
}
function of(n, e, t, r) {
  return ko(n, "handleTripleClickOn", e, t, r) || n.someProp("handleTripleClick", (i) => i(n, e, r)) || sf(n, t, r);
}
function sf(n, e, t) {
  if (t.button != 0)
    return !1;
  let r = n.state.doc;
  if (e == -1)
    return r.inlineContent ? (hn(n, D.create(r, 0, r.content.size), "pointer"), !0) : !1;
  let i = r.resolve(e);
  for (let o = i.depth + 1; o > 0; o--) {
    let s = o > i.depth ? i.nodeAfter : i.node(o), a = i.before(o);
    if (s.inlineContent)
      hn(n, D.create(r, a + 1, a + 1 + s.content.size), "pointer");
    else if (N.isSelectable(s))
      hn(n, N.create(r, a), "pointer");
    else
      continue;
    return !0;
  }
}
function xo(n) {
  return Br(n);
}
const Ol = Oe ? "metaKey" : "ctrlKey";
le.mousedown = (n, e) => {
  let t = e;
  n.input.shiftKey = t.shiftKey;
  let r = xo(n), i = Date.now(), o = "singleClick";
  i - n.input.lastClick.time < 500 && Qd(t, n.input.lastClick) && !t[Ol] && (n.input.lastClick.type == "singleClick" ? o = "doubleClick" : n.input.lastClick.type == "doubleClick" && (o = "tripleClick")), n.input.lastClick = { time: i, x: t.clientX, y: t.clientY, type: o };
  let s = n.posAtCoords(Zr(t));
  !s || (o == "singleClick" ? (n.input.mouseDown && n.input.mouseDown.done(), n.input.mouseDown = new af(n, s, t, !!r)) : (o == "doubleClick" ? rf : of)(n, s.pos, s.inside, t) ? t.preventDefault() : bt(n, "pointer"));
};
class af {
  constructor(e, t, r, i) {
    this.view = e, this.pos = t, this.event = r, this.flushed = i, this.delayedSelectionSync = !1, this.mightDrag = null, this.startDoc = e.state.doc, this.selectNode = !!r[Ol], this.allowDefault = r.shiftKey;
    let o, s;
    if (t.inside > -1)
      o = e.state.doc.nodeAt(t.inside), s = t.inside;
    else {
      let u = e.state.doc.resolve(t.pos);
      o = u.parent, s = u.depth ? u.before() : 0;
    }
    const a = i ? null : r.target, l = a ? e.docView.nearestDesc(a, !0) : null;
    this.target = l ? l.dom : null;
    let { selection: c } = e.state;
    (r.button == 0 && o.type.spec.draggable && o.type.spec.selectable !== !1 || c instanceof N && c.from <= s && c.to > s) && (this.mightDrag = {
      node: o,
      pos: s,
      addAttr: !!(this.target && !this.target.draggable),
      setUneditable: !!(this.target && Le && !this.target.hasAttribute("contentEditable"))
    }), this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable) && (this.view.domObserver.stop(), this.mightDrag.addAttr && (this.target.draggable = !0), this.mightDrag.setUneditable && setTimeout(() => {
      this.view.input.mouseDown == this && this.target.setAttribute("contentEditable", "false");
    }, 20), this.view.domObserver.start()), e.root.addEventListener("mouseup", this.up = this.up.bind(this)), e.root.addEventListener("mousemove", this.move = this.move.bind(this)), bt(e, "pointer");
  }
  done() {
    this.view.root.removeEventListener("mouseup", this.up), this.view.root.removeEventListener("mousemove", this.move), this.mightDrag && this.target && (this.view.domObserver.stop(), this.mightDrag.addAttr && this.target.removeAttribute("draggable"), this.mightDrag.setUneditable && this.target.removeAttribute("contentEditable"), this.view.domObserver.start()), this.delayedSelectionSync && setTimeout(() => at(this.view)), this.view.input.mouseDown = null;
  }
  up(e) {
    if (this.done(), !this.view.dom.contains(e.target))
      return;
    let t = this.pos;
    this.view.state.doc != this.startDoc && (t = this.view.posAtCoords(Zr(e))), this.updateAllowDefault(e), this.allowDefault || !t ? bt(this.view, "pointer") : nf(this.view, t.pos, t.inside, e, this.selectNode) ? e.preventDefault() : e.button == 0 && (this.flushed || ae && this.mightDrag && !this.mightDrag.node.isAtom || fe && !this.view.state.selection.visible && Math.min(Math.abs(t.pos - this.view.state.selection.from), Math.abs(t.pos - this.view.state.selection.to)) <= 2) ? (hn(this.view, P.near(this.view.state.doc.resolve(t.pos)), "pointer"), e.preventDefault()) : bt(this.view, "pointer");
  }
  move(e) {
    this.updateAllowDefault(e), bt(this.view, "pointer"), e.buttons == 0 && this.done();
  }
  updateAllowDefault(e) {
    !this.allowDefault && (Math.abs(this.event.x - e.clientX) > 4 || Math.abs(this.event.y - e.clientY) > 4) && (this.allowDefault = !0);
  }
}
le.touchstart = (n) => {
  n.input.lastTouch = Date.now(), xo(n), bt(n, "pointer");
};
le.touchmove = (n) => {
  n.input.lastTouch = Date.now(), bt(n, "pointer");
};
le.contextmenu = (n) => xo(n);
function Cl(n, e) {
  return n.composing ? !0 : ae && Math.abs(e.timeStamp - n.input.compositionEndedAt) < 500 ? (n.input.compositionEndedAt = -2e8, !0) : !1;
}
const lf = qe ? 5e3 : -1;
ce.compositionstart = ce.compositionupdate = (n) => {
  if (!n.composing) {
    n.domObserver.flush();
    let { state: e } = n, t = e.selection.$from;
    if (e.selection.empty && (e.storedMarks || !t.textOffset && t.parentOffset && t.nodeBefore.marks.some((r) => r.type.spec.inclusive === !1)))
      n.markCursor = n.state.storedMarks || t.marks(), Br(n, !0), n.markCursor = null;
    else if (Br(n), Le && e.selection.empty && t.parentOffset && !t.textOffset && t.nodeBefore.marks.length) {
      let r = n.domSelectionRange();
      for (let i = r.focusNode, o = r.focusOffset; i && i.nodeType == 1 && o != 0; ) {
        let s = o < 0 ? i.lastChild : i.childNodes[o - 1];
        if (!s)
          break;
        if (s.nodeType == 3) {
          n.domSelection().collapse(s, s.nodeValue.length);
          break;
        } else
          i = s, o = -1;
      }
    }
    n.input.composing = !0;
  }
  Tl(n, lf);
};
ce.compositionend = (n, e) => {
  n.composing && (n.input.composing = !1, n.input.compositionEndedAt = e.timeStamp, Tl(n, 20));
};
function Tl(n, e) {
  clearTimeout(n.input.composingTimeout), e > -1 && (n.input.composingTimeout = setTimeout(() => Br(n), e));
}
function El(n) {
  for (n.composing && (n.input.composing = !1, n.input.compositionEndedAt = cf()); n.input.compositionNodes.length > 0; )
    n.input.compositionNodes.pop().markParentsDirty();
}
function cf() {
  let n = document.createEvent("Event");
  return n.initEvent("event", !0, !0), n.timeStamp;
}
function Br(n, e = !1) {
  if (!(qe && n.domObserver.flushingSoon >= 0)) {
    if (n.domObserver.forceFlush(), El(n), e || n.docView && n.docView.dirty) {
      let t = yo(n);
      return t && !t.eq(n.state.selection) ? n.dispatch(n.state.tr.setSelection(t)) : n.updateState(n.state), !0;
    }
    return !1;
  }
}
function uf(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.dom.parentNode.appendChild(document.createElement("div"));
  t.appendChild(e), t.style.cssText = "position: fixed; left: -10000px; top: 10px";
  let r = getSelection(), i = document.createRange();
  i.selectNodeContents(e), n.dom.blur(), r.removeAllRanges(), r.addRange(i), setTimeout(() => {
    t.parentNode && t.parentNode.removeChild(t), n.focus();
  }, 50);
}
const bn = pe && vt < 15 || yn && ud < 604;
le.copy = ce.cut = (n, e) => {
  let t = e, r = n.state.selection, i = t.type == "cut";
  if (r.empty)
    return;
  let o = bn ? null : t.clipboardData, s = r.content(), { dom: a, text: l } = bl(n, s);
  o ? (t.preventDefault(), o.clearData(), o.setData("text/html", a.innerHTML), o.setData("text/plain", l)) : uf(n, a), i && n.dispatch(n.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
};
function df(n) {
  return n.openStart == 0 && n.openEnd == 0 && n.content.childCount == 1 ? n.content.firstChild : null;
}
function ff(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.input.shiftKey || n.state.selection.$from.parent.type.spec.code, r = n.dom.parentNode.appendChild(document.createElement(t ? "textarea" : "div"));
  t || (r.contentEditable = "true"), r.style.cssText = "position: fixed; left: -10000px; top: 10px", r.focus(), setTimeout(() => {
    n.focus(), r.parentNode && r.parentNode.removeChild(r), t ? Xi(n, r.value, null, e) : Xi(n, r.textContent, r.innerHTML, e);
  }, 50);
}
function Xi(n, e, t, r) {
  let i = vl(n, e, t, n.input.shiftKey, n.state.selection.$from);
  if (n.someProp("handlePaste", (a) => a(n, r, i || S.empty)))
    return !0;
  if (!i)
    return !1;
  let o = df(i), s = o ? n.state.tr.replaceSelectionWith(o, n.input.shiftKey) : n.state.tr.replaceSelection(i);
  return n.dispatch(s.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0;
}
ce.paste = (n, e) => {
  let t = e;
  if (n.composing && !qe)
    return;
  let r = bn ? null : t.clipboardData;
  r && Xi(n, r.getData("text/plain"), r.getData("text/html"), t) ? t.preventDefault() : ff(n, t);
};
class pf {
  constructor(e, t) {
    this.slice = e, this.move = t;
  }
}
const Al = Oe ? "altKey" : "ctrlKey";
le.dragstart = (n, e) => {
  let t = e, r = n.input.mouseDown;
  if (r && r.done(), !t.dataTransfer)
    return;
  let i = n.state.selection, o = i.empty ? null : n.posAtCoords(Zr(t));
  if (!(o && o.pos >= i.from && o.pos <= (i instanceof N ? i.to - 1 : i.to))) {
    if (r && r.mightDrag)
      n.dispatch(n.state.tr.setSelection(N.create(n.state.doc, r.mightDrag.pos)));
    else if (t.target && t.target.nodeType == 1) {
      let c = n.docView.nearestDesc(t.target, !0);
      c && c.node.type.spec.draggable && c != n.docView && n.dispatch(n.state.tr.setSelection(N.create(n.state.doc, c.posBefore)));
    }
  }
  let s = n.state.selection.content(), { dom: a, text: l } = bl(n, s);
  t.dataTransfer.clearData(), t.dataTransfer.setData(bn ? "Text" : "text/html", a.innerHTML), t.dataTransfer.effectAllowed = "copyMove", bn || t.dataTransfer.setData("text/plain", l), n.dragging = new pf(s, !t[Al]);
};
le.dragend = (n) => {
  let e = n.dragging;
  window.setTimeout(() => {
    n.dragging == e && (n.dragging = null);
  }, 50);
};
ce.dragover = ce.dragenter = (n, e) => e.preventDefault();
ce.drop = (n, e) => {
  let t = e, r = n.dragging;
  if (n.dragging = null, !t.dataTransfer)
    return;
  let i = n.posAtCoords(Zr(t));
  if (!i)
    return;
  let o = n.state.doc.resolve(i.pos), s = r && r.slice;
  s ? n.someProp("transformPasted", (h) => {
    s = h(s, n);
  }) : s = vl(n, t.dataTransfer.getData(bn ? "Text" : "text/plain"), bn ? null : t.dataTransfer.getData("text/html"), !1, o);
  let a = !!(r && !t[Al]);
  if (n.someProp("handleDrop", (h) => h(n, t, s || S.empty, a))) {
    t.preventDefault();
    return;
  }
  if (!s)
    return;
  t.preventDefault();
  let l = s ? Ga(n.state.doc, o.pos, s) : o.pos;
  l == null && (l = o.pos);
  let c = n.state.tr;
  a && c.deleteSelection();
  let u = c.mapping.map(l), d = s.openStart == 0 && s.openEnd == 0 && s.content.childCount == 1, f = c.doc;
  if (d ? c.replaceRangeWith(u, u, s.content.firstChild) : c.replaceRange(u, u, s), c.doc.eq(f))
    return;
  let p = c.doc.resolve(u);
  if (d && N.isSelectable(s.content.firstChild) && p.nodeAfter && p.nodeAfter.sameMarkup(s.content.firstChild))
    c.setSelection(new N(p));
  else {
    let h = c.mapping.map(l);
    c.mapping.maps[c.mapping.maps.length - 1].forEach((m, y, b, w) => h = w), c.setSelection(bo(n, p, c.doc.resolve(h)));
  }
  n.focus(), n.dispatch(c.setMeta("uiEvent", "drop"));
};
le.focus = (n) => {
  n.input.lastFocus = Date.now(), n.focused || (n.domObserver.stop(), n.dom.classList.add("ProseMirror-focused"), n.domObserver.start(), n.focused = !0, setTimeout(() => {
    n.docView && n.hasFocus() && !n.domObserver.currentSelection.eq(n.domSelectionRange()) && at(n);
  }, 20));
};
le.blur = (n, e) => {
  let t = e;
  n.focused && (n.domObserver.stop(), n.dom.classList.remove("ProseMirror-focused"), n.domObserver.start(), t.relatedTarget && n.dom.contains(t.relatedTarget) && n.domObserver.currentSelection.clear(), n.focused = !1);
};
le.beforeinput = (n, e) => {
  if (fe && qe && e.inputType == "deleteContentBackward") {
    n.domObserver.flushSoon();
    let { domChangeCount: r } = n.input;
    setTimeout(() => {
      if (n.input.domChangeCount != r || (n.dom.blur(), n.focus(), n.someProp("handleKeyDown", (o) => o(n, cn(8, "Backspace")))))
        return;
      let { $cursor: i } = n.state.selection;
      i && i.pos > 0 && n.dispatch(n.state.tr.delete(i.pos - 1, i.pos).scrollIntoView());
    }, 50);
  }
};
for (let n in ce)
  le[n] = ce[n];
function _n(n, e) {
  if (n == e)
    return !0;
  for (let t in n)
    if (n[t] !== e[t])
      return !1;
  for (let t in e)
    if (!(t in n))
      return !1;
  return !0;
}
class wo {
  constructor(e, t) {
    this.toDOM = e, this.spec = t || Vt, this.side = this.spec.side || 0;
  }
  map(e, t, r, i) {
    let { pos: o, deleted: s } = e.mapResult(t.from + i, this.side < 0 ? -1 : 1);
    return s ? null : new Te(o - r, o - r, this);
  }
  valid() {
    return !0;
  }
  eq(e) {
    return this == e || e instanceof wo && (this.spec.key && this.spec.key == e.spec.key || this.toDOM == e.toDOM && _n(this.spec, e.spec));
  }
  destroy(e) {
    this.spec.destroy && this.spec.destroy(e);
  }
}
class kt {
  constructor(e, t) {
    this.attrs = e, this.spec = t || Vt;
  }
  map(e, t, r, i) {
    let o = e.map(t.from + i, this.spec.inclusiveStart ? -1 : 1) - r, s = e.map(t.to + i, this.spec.inclusiveEnd ? 1 : -1) - r;
    return o >= s ? null : new Te(o, s, this);
  }
  valid(e, t) {
    return t.from < t.to;
  }
  eq(e) {
    return this == e || e instanceof kt && _n(this.attrs, e.attrs) && _n(this.spec, e.spec);
  }
  static is(e) {
    return e.type instanceof kt;
  }
  destroy() {
  }
}
class So {
  constructor(e, t) {
    this.attrs = e, this.spec = t || Vt;
  }
  map(e, t, r, i) {
    let o = e.mapResult(t.from + i, 1);
    if (o.deleted)
      return null;
    let s = e.mapResult(t.to + i, -1);
    return s.deleted || s.pos <= o.pos ? null : new Te(o.pos - r, s.pos - r, this);
  }
  valid(e, t) {
    let { index: r, offset: i } = e.content.findIndex(t.from), o;
    return i == t.from && !(o = e.child(r)).isText && i + o.nodeSize == t.to;
  }
  eq(e) {
    return this == e || e instanceof So && _n(this.attrs, e.attrs) && _n(this.spec, e.spec);
  }
  destroy() {
  }
}
class Te {
  constructor(e, t, r) {
    this.from = e, this.to = t, this.type = r;
  }
  copy(e, t) {
    return new Te(e, t, this.type);
  }
  eq(e, t = 0) {
    return this.type.eq(e.type) && this.from + t == e.from && this.to + t == e.to;
  }
  map(e, t, r) {
    return this.type.map(e, this, t, r);
  }
  static widget(e, t, r) {
    return new Te(e, e, new wo(t, r));
  }
  static inline(e, t, r, i) {
    return new Te(e, t, new kt(r, i));
  }
  static node(e, t, r, i) {
    return new Te(e, t, new So(r, i));
  }
  get spec() {
    return this.type.spec;
  }
  get inline() {
    return this.type instanceof kt;
  }
}
const on = [], Vt = {};
class K {
  constructor(e, t) {
    this.local = e.length ? e : on, this.children = t.length ? t : on;
  }
  static create(e, t) {
    return t.length ? Lr(t, e, 0, Vt) : ie;
  }
  find(e, t, r) {
    let i = [];
    return this.findInner(e == null ? 0 : e, t == null ? 1e9 : t, i, 0, r), i;
  }
  findInner(e, t, r, i, o) {
    for (let s = 0; s < this.local.length; s++) {
      let a = this.local[s];
      a.from <= t && a.to >= e && (!o || o(a.spec)) && r.push(a.copy(a.from + i, a.to + i));
    }
    for (let s = 0; s < this.children.length; s += 3)
      if (this.children[s] < t && this.children[s + 1] > e) {
        let a = this.children[s] + 1;
        this.children[s + 2].findInner(e - a, t - a, r, i + a, o);
      }
  }
  map(e, t, r) {
    return this == ie || e.maps.length == 0 ? this : this.mapInner(e, t, 0, 0, r || Vt);
  }
  mapInner(e, t, r, i, o) {
    let s;
    for (let a = 0; a < this.local.length; a++) {
      let l = this.local[a].map(e, r, i);
      l && l.type.valid(t, l) ? (s || (s = [])).push(l) : o.onRemove && o.onRemove(this.local[a].spec);
    }
    return this.children.length ? hf(this.children, s || [], e, t, r, i, o) : s ? new K(s.sort(jt), on) : ie;
  }
  add(e, t) {
    return t.length ? this == ie ? K.create(e, t) : this.addInner(e, t, 0) : this;
  }
  addInner(e, t, r) {
    let i, o = 0;
    e.forEach((a, l) => {
      let c = l + r, u;
      if (!!(u = Dl(t, a, c))) {
        for (i || (i = this.children.slice()); o < i.length && i[o] < l; )
          o += 3;
        i[o] == l ? i[o + 2] = i[o + 2].addInner(a, u, c + 1) : i.splice(o, 0, l, l + a.nodeSize, Lr(u, a, c + 1, Vt)), o += 3;
      }
    });
    let s = Nl(o ? Il(t) : t, -r);
    for (let a = 0; a < s.length; a++)
      s[a].type.valid(e, s[a]) || s.splice(a--, 1);
    return new K(s.length ? this.local.concat(s).sort(jt) : this.local, i || this.children);
  }
  remove(e) {
    return e.length == 0 || this == ie ? this : this.removeInner(e, 0);
  }
  removeInner(e, t) {
    let r = this.children, i = this.local;
    for (let o = 0; o < r.length; o += 3) {
      let s, a = r[o] + t, l = r[o + 1] + t;
      for (let u = 0, d; u < e.length; u++)
        (d = e[u]) && d.from > a && d.to < l && (e[u] = null, (s || (s = [])).push(d));
      if (!s)
        continue;
      r == this.children && (r = this.children.slice());
      let c = r[o + 2].removeInner(s, a + 1);
      c != ie ? r[o + 2] = c : (r.splice(o, 3), o -= 3);
    }
    if (i.length) {
      for (let o = 0, s; o < e.length; o++)
        if (s = e[o])
          for (let a = 0; a < i.length; a++)
            i[a].eq(s, t) && (i == this.local && (i = this.local.slice()), i.splice(a--, 1));
    }
    return r == this.children && i == this.local ? this : i.length || r.length ? new K(i, r) : ie;
  }
  forChild(e, t) {
    if (this == ie)
      return this;
    if (t.isLeaf)
      return K.empty;
    let r, i;
    for (let a = 0; a < this.children.length; a += 3)
      if (this.children[a] >= e) {
        this.children[a] == e && (r = this.children[a + 2]);
        break;
      }
    let o = e + 1, s = o + t.content.size;
    for (let a = 0; a < this.local.length; a++) {
      let l = this.local[a];
      if (l.from < s && l.to > o && l.type instanceof kt) {
        let c = Math.max(o, l.from) - o, u = Math.min(s, l.to) - o;
        c < u && (i || (i = [])).push(l.copy(c, u));
      }
    }
    if (i) {
      let a = new K(i.sort(jt), on);
      return r ? new ht([a, r]) : a;
    }
    return r || ie;
  }
  eq(e) {
    if (this == e)
      return !0;
    if (!(e instanceof K) || this.local.length != e.local.length || this.children.length != e.children.length)
      return !1;
    for (let t = 0; t < this.local.length; t++)
      if (!this.local[t].eq(e.local[t]))
        return !1;
    for (let t = 0; t < this.children.length; t += 3)
      if (this.children[t] != e.children[t] || this.children[t + 1] != e.children[t + 1] || !this.children[t + 2].eq(e.children[t + 2]))
        return !1;
    return !0;
  }
  locals(e) {
    return Mo(this.localsInner(e));
  }
  localsInner(e) {
    if (this == ie)
      return on;
    if (e.inlineContent || !this.local.some(kt.is))
      return this.local;
    let t = [];
    for (let r = 0; r < this.local.length; r++)
      this.local[r].type instanceof kt || t.push(this.local[r]);
    return t;
  }
}
K.empty = new K([], []);
K.removeOverlap = Mo;
const ie = K.empty;
class ht {
  constructor(e) {
    this.members = e;
  }
  map(e, t) {
    const r = this.members.map((i) => i.map(e, t, Vt));
    return ht.from(r);
  }
  forChild(e, t) {
    if (t.isLeaf)
      return K.empty;
    let r = [];
    for (let i = 0; i < this.members.length; i++) {
      let o = this.members[i].forChild(e, t);
      o != ie && (o instanceof ht ? r = r.concat(o.members) : r.push(o));
    }
    return ht.from(r);
  }
  eq(e) {
    if (!(e instanceof ht) || e.members.length != this.members.length)
      return !1;
    for (let t = 0; t < this.members.length; t++)
      if (!this.members[t].eq(e.members[t]))
        return !1;
    return !0;
  }
  locals(e) {
    let t, r = !0;
    for (let i = 0; i < this.members.length; i++) {
      let o = this.members[i].localsInner(e);
      if (!!o.length)
        if (!t)
          t = o;
        else {
          r && (t = t.slice(), r = !1);
          for (let s = 0; s < o.length; s++)
            t.push(o[s]);
        }
    }
    return t ? Mo(r ? t : t.sort(jt)) : on;
  }
  static from(e) {
    switch (e.length) {
      case 0:
        return ie;
      case 1:
        return e[0];
      default:
        return new ht(e.every((t) => t instanceof K) ? e : e.reduce((t, r) => t.concat(r instanceof K ? r : r.members), []));
    }
  }
}
function hf(n, e, t, r, i, o, s) {
  let a = n.slice();
  for (let c = 0, u = o; c < t.maps.length; c++) {
    let d = 0;
    t.maps[c].forEach((f, p, h, m) => {
      let y = m - h - (p - f);
      for (let b = 0; b < a.length; b += 3) {
        let w = a[b + 1];
        if (w < 0 || f > w + u - d)
          continue;
        let E = a[b] + u - d;
        p >= E ? a[b + 1] = f <= E ? -2 : -1 : h >= i && y && (a[b] += y, a[b + 1] += y);
      }
      d += y;
    }), u = t.maps[c].map(u, -1);
  }
  let l = !1;
  for (let c = 0; c < a.length; c += 3)
    if (a[c + 1] < 0) {
      if (a[c + 1] == -2) {
        l = !0, a[c + 1] = -1;
        continue;
      }
      let u = t.map(n[c] + o), d = u - i;
      if (d < 0 || d >= r.content.size) {
        l = !0;
        continue;
      }
      let f = t.map(n[c + 1] + o, -1), p = f - i, { index: h, offset: m } = r.content.findIndex(d), y = r.maybeChild(h);
      if (y && m == d && m + y.nodeSize == p) {
        let b = a[c + 2].mapInner(t, y, u + 1, n[c] + o + 1, s);
        b != ie ? (a[c] = d, a[c + 1] = p, a[c + 2] = b) : (a[c + 1] = -2, l = !0);
      } else
        l = !0;
    }
  if (l) {
    let c = mf(a, n, e, t, i, o, s), u = Lr(c, r, 0, s);
    e = u.local;
    for (let d = 0; d < a.length; d += 3)
      a[d + 1] < 0 && (a.splice(d, 3), d -= 3);
    for (let d = 0, f = 0; d < u.children.length; d += 3) {
      let p = u.children[d];
      for (; f < a.length && a[f] < p; )
        f += 3;
      a.splice(f, 0, u.children[d], u.children[d + 1], u.children[d + 2]);
    }
  }
  return new K(e.sort(jt), a);
}
function Nl(n, e) {
  if (!e || !n.length)
    return n;
  let t = [];
  for (let r = 0; r < n.length; r++) {
    let i = n[r];
    t.push(new Te(i.from + e, i.to + e, i.type));
  }
  return t;
}
function mf(n, e, t, r, i, o, s) {
  function a(l, c) {
    for (let u = 0; u < l.local.length; u++) {
      let d = l.local[u].map(r, i, c);
      d ? t.push(d) : s.onRemove && s.onRemove(l.local[u].spec);
    }
    for (let u = 0; u < l.children.length; u += 3)
      a(l.children[u + 2], l.children[u] + c + 1);
  }
  for (let l = 0; l < n.length; l += 3)
    n[l + 1] == -1 && a(n[l + 2], e[l] + o + 1);
  return t;
}
function Dl(n, e, t) {
  if (e.isLeaf)
    return null;
  let r = t + e.nodeSize, i = null;
  for (let o = 0, s; o < n.length; o++)
    (s = n[o]) && s.from > t && s.to < r && ((i || (i = [])).push(s), n[o] = null);
  return i;
}
function Il(n) {
  let e = [];
  for (let t = 0; t < n.length; t++)
    n[t] != null && e.push(n[t]);
  return e;
}
function Lr(n, e, t, r) {
  let i = [], o = !1;
  e.forEach((a, l) => {
    let c = Dl(n, a, l + t);
    if (c) {
      o = !0;
      let u = Lr(c, a, t + l + 1, r);
      u != ie && i.push(l, l + a.nodeSize, u);
    }
  });
  let s = Nl(o ? Il(n) : n, -t).sort(jt);
  for (let a = 0; a < s.length; a++)
    s[a].type.valid(e, s[a]) || (r.onRemove && r.onRemove(s[a].spec), s.splice(a--, 1));
  return s.length || i.length ? new K(s, i) : ie;
}
function jt(n, e) {
  return n.from - e.from || n.to - e.to;
}
function Mo(n) {
  let e = n;
  for (let t = 0; t < e.length - 1; t++) {
    let r = e[t];
    if (r.from != r.to)
      for (let i = t + 1; i < e.length; i++) {
        let o = e[i];
        if (o.from == r.from) {
          o.to != r.to && (e == n && (e = n.slice()), e[i] = o.copy(o.from, r.to), Cs(e, i + 1, o.copy(r.to, o.to)));
          continue;
        } else {
          o.from < r.to && (e == n && (e = n.slice()), e[t] = r.copy(r.from, o.from), Cs(e, i, r.copy(o.from, r.to)));
          break;
        }
      }
  }
  return e;
}
function Cs(n, e, t) {
  for (; e < n.length && jt(t, n[e]) > 0; )
    e++;
  n.splice(e, 0, t);
}
function Si(n) {
  let e = [];
  return n.someProp("decorations", (t) => {
    let r = t(n.state);
    r && r != ie && e.push(r);
  }), n.cursorWrapper && e.push(K.create(n.state.doc, [n.cursorWrapper.deco])), ht.from(e);
}
const gf = {
  childList: !0,
  characterData: !0,
  characterDataOldValue: !0,
  attributes: !0,
  attributeOldValue: !0,
  subtree: !0
}, yf = pe && vt <= 11;
class bf {
  constructor() {
    this.anchorNode = null, this.anchorOffset = 0, this.focusNode = null, this.focusOffset = 0;
  }
  set(e) {
    this.anchorNode = e.anchorNode, this.anchorOffset = e.anchorOffset, this.focusNode = e.focusNode, this.focusOffset = e.focusOffset;
  }
  clear() {
    this.anchorNode = this.focusNode = null;
  }
  eq(e) {
    return e.anchorNode == this.anchorNode && e.anchorOffset == this.anchorOffset && e.focusNode == this.focusNode && e.focusOffset == this.focusOffset;
  }
}
class vf {
  constructor(e, t) {
    this.view = e, this.handleDOMChange = t, this.queue = [], this.flushingSoon = -1, this.observer = null, this.currentSelection = new bf(), this.onCharData = null, this.suppressingSelectionUpdates = !1, this.observer = window.MutationObserver && new window.MutationObserver((r) => {
      for (let i = 0; i < r.length; i++)
        this.queue.push(r[i]);
      pe && vt <= 11 && r.some((i) => i.type == "childList" && i.removedNodes.length || i.type == "characterData" && i.oldValue.length > i.target.nodeValue.length) ? this.flushSoon() : this.flush();
    }), yf && (this.onCharData = (r) => {
      this.queue.push({ target: r.target, type: "characterData", oldValue: r.prevValue }), this.flushSoon();
    }), this.onSelectionChange = this.onSelectionChange.bind(this);
  }
  flushSoon() {
    this.flushingSoon < 0 && (this.flushingSoon = window.setTimeout(() => {
      this.flushingSoon = -1, this.flush();
    }, 20));
  }
  forceFlush() {
    this.flushingSoon > -1 && (window.clearTimeout(this.flushingSoon), this.flushingSoon = -1, this.flush());
  }
  start() {
    this.observer && (this.observer.takeRecords(), this.observer.observe(this.view.dom, gf)), this.onCharData && this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.connectSelection();
  }
  stop() {
    if (this.observer) {
      let e = this.observer.takeRecords();
      if (e.length) {
        for (let t = 0; t < e.length; t++)
          this.queue.push(e[t]);
        window.setTimeout(() => this.flush(), 20);
      }
      this.observer.disconnect();
    }
    this.onCharData && this.view.dom.removeEventListener("DOMCharacterDataModified", this.onCharData), this.disconnectSelection();
  }
  connectSelection() {
    this.view.dom.ownerDocument.addEventListener("selectionchange", this.onSelectionChange);
  }
  disconnectSelection() {
    this.view.dom.ownerDocument.removeEventListener("selectionchange", this.onSelectionChange);
  }
  suppressSelectionUpdates() {
    this.suppressingSelectionUpdates = !0, setTimeout(() => this.suppressingSelectionUpdates = !1, 50);
  }
  onSelectionChange() {
    if (!!vs(this.view)) {
      if (this.suppressingSelectionUpdates)
        return at(this.view);
      if (pe && vt <= 11 && !this.view.state.selection.empty) {
        let e = this.view.domSelectionRange();
        if (e.focusNode && Kt(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset))
          return this.flushSoon();
      }
      this.flush();
    }
  }
  setCurSelection() {
    this.currentSelection.set(this.view.domSelectionRange());
  }
  ignoreSelectionChange(e) {
    if (!e.focusNode)
      return !0;
    let t = /* @__PURE__ */ new Set(), r;
    for (let o = e.focusNode; o; o = Jn(o))
      t.add(o);
    for (let o = e.anchorNode; o; o = Jn(o))
      if (t.has(o)) {
        r = o;
        break;
      }
    let i = r && this.view.docView.nearestDesc(r);
    if (i && i.ignoreMutation({
      type: "selection",
      target: r.nodeType == 3 ? r.parentNode : r
    }))
      return this.setCurSelection(), !0;
  }
  flush() {
    let { view: e } = this;
    if (!e.docView || this.flushingSoon > -1)
      return;
    let t = this.observer ? this.observer.takeRecords() : [];
    this.queue.length && (t = this.queue.concat(t), this.queue.length = 0);
    let r = e.domSelectionRange(), i = !this.suppressingSelectionUpdates && !this.currentSelection.eq(r) && vs(e) && !this.ignoreSelectionChange(r), o = -1, s = -1, a = !1, l = [];
    if (e.editable)
      for (let u = 0; u < t.length; u++) {
        let d = this.registerMutation(t[u], l);
        d && (o = o < 0 ? d.from : Math.min(d.from, o), s = s < 0 ? d.to : Math.max(d.to, s), d.typeOver && (a = !0));
      }
    if (Le && l.length > 1) {
      let u = l.filter((d) => d.nodeName == "BR");
      if (u.length == 2) {
        let d = u[0], f = u[1];
        d.parentNode && d.parentNode.parentNode == f.parentNode ? f.remove() : d.remove();
      }
    }
    let c = null;
    o < 0 && i && e.input.lastFocus > Date.now() - 200 && e.input.lastTouch < Date.now() - 300 && Gr(r) && (c = yo(e)) && c.eq(P.near(e.state.doc.resolve(0), 1)) ? (e.input.lastFocus = 0, at(e), this.currentSelection.set(r), e.scrollToSelection()) : (o > -1 || i) && (o > -1 && (e.docView.markDirty(o, s), kf(e)), this.handleDOMChange(o, s, a, l), e.docView && e.docView.dirty ? e.updateState(e.state) : this.currentSelection.eq(r) || at(e), this.currentSelection.set(r));
  }
  registerMutation(e, t) {
    if (t.indexOf(e.target) > -1)
      return null;
    let r = this.view.docView.nearestDesc(e.target);
    if (e.type == "attributes" && (r == this.view.docView || e.attributeName == "contenteditable" || e.attributeName == "style" && !e.oldValue && !e.target.getAttribute("style")) || !r || r.ignoreMutation(e))
      return null;
    if (e.type == "childList") {
      for (let u = 0; u < e.addedNodes.length; u++)
        t.push(e.addedNodes[u]);
      if (r.contentDOM && r.contentDOM != r.dom && !r.contentDOM.contains(e.target))
        return { from: r.posBefore, to: r.posAfter };
      let i = e.previousSibling, o = e.nextSibling;
      if (pe && vt <= 11 && e.addedNodes.length)
        for (let u = 0; u < e.addedNodes.length; u++) {
          let { previousSibling: d, nextSibling: f } = e.addedNodes[u];
          (!d || Array.prototype.indexOf.call(e.addedNodes, d) < 0) && (i = d), (!f || Array.prototype.indexOf.call(e.addedNodes, f) < 0) && (o = f);
        }
      let s = i && i.parentNode == e.target ? xe(i) + 1 : 0, a = r.localPosFromDOM(e.target, s, -1), l = o && o.parentNode == e.target ? xe(o) : e.target.childNodes.length, c = r.localPosFromDOM(e.target, l, 1);
      return { from: a, to: c };
    } else
      return e.type == "attributes" ? { from: r.posAtStart - r.border, to: r.posAtEnd + r.border } : {
        from: r.posAtStart,
        to: r.posAtEnd,
        typeOver: e.target.nodeValue == e.oldValue
      };
  }
}
let Ts = /* @__PURE__ */ new WeakMap(), Es = !1;
function kf(n) {
  if (!Ts.has(n) && (Ts.set(n, null), ["normal", "nowrap", "pre-line"].indexOf(getComputedStyle(n.dom).whiteSpace) !== -1)) {
    if (n.requiresGeckoHackNode = Le, Es)
      return;
    console.warn("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package."), Es = !0;
  }
}
function xf(n) {
  let e;
  function t(l) {
    l.preventDefault(), l.stopImmediatePropagation(), e = l.getTargetRanges()[0];
  }
  n.dom.addEventListener("beforeinput", t, !0), document.execCommand("indent"), n.dom.removeEventListener("beforeinput", t, !0);
  let r = e.startContainer, i = e.startOffset, o = e.endContainer, s = e.endOffset, a = n.domAtPos(n.state.selection.anchor);
  return Kt(a.node, a.offset, o, s) && ([r, i, o, s] = [o, s, r, i]), { anchorNode: r, anchorOffset: i, focusNode: o, focusOffset: s };
}
function wf(n, e, t) {
  let { node: r, fromOffset: i, toOffset: o, from: s, to: a } = n.docView.parseRange(e, t), l = n.domSelectionRange(), c, u = l.anchorNode;
  if (u && n.dom.contains(u.nodeType == 1 ? u : u.parentNode) && (c = [{ node: u, offset: l.anchorOffset }], Gr(l) || c.push({ node: l.focusNode, offset: l.focusOffset })), fe && n.input.lastKeyCode === 8)
    for (let y = o; y > i; y--) {
      let b = r.childNodes[y - 1], w = b.pmViewDesc;
      if (b.nodeName == "BR" && !w) {
        o = y;
        break;
      }
      if (!w || w.size)
        break;
    }
  let d = n.state.doc, f = n.someProp("domParser") || qt.fromSchema(n.state.schema), p = d.resolve(s), h = null, m = f.parse(r, {
    topNode: p.parent,
    topMatch: p.parent.contentMatchAt(p.index()),
    topOpen: !0,
    from: i,
    to: o,
    preserveWhitespace: p.parent.type.whitespace == "pre" ? "full" : !0,
    findPositions: c,
    ruleFromNode: Sf,
    context: p
  });
  if (c && c[0].pos != null) {
    let y = c[0].pos, b = c[1] && c[1].pos;
    b == null && (b = y), h = { anchor: y + s, head: b + s };
  }
  return { doc: m, sel: h, from: s, to: a };
}
function Sf(n) {
  let e = n.pmViewDesc;
  if (e)
    return e.parseRule();
  if (n.nodeName == "BR" && n.parentNode) {
    if (ae && /^(ul|ol)$/i.test(n.parentNode.nodeName)) {
      let t = document.createElement("div");
      return t.appendChild(document.createElement("li")), { skip: t };
    } else if (n.parentNode.lastChild == n || ae && /^(tr|table)$/i.test(n.parentNode.nodeName))
      return { ignore: !0 };
  } else if (n.nodeName == "IMG" && n.getAttribute("mark-placeholder"))
    return { ignore: !0 };
  return null;
}
function Mf(n, e, t, r, i) {
  if (e < 0) {
    let M = n.input.lastSelectionTime > Date.now() - 50 ? n.input.lastSelectionOrigin : null, $ = yo(n, M);
    if ($ && !n.state.selection.eq($)) {
      let j = n.state.tr.setSelection($);
      M == "pointer" ? j.setMeta("pointer", !0) : M == "key" && j.scrollIntoView(), n.dispatch(j);
    }
    return;
  }
  let o = n.state.doc.resolve(e), s = o.sharedDepth(t);
  e = o.before(s + 1), t = n.state.doc.resolve(t).after(s + 1);
  let a = n.state.selection, l = wf(n, e, t), c = n.state.doc, u = c.slice(l.from, l.to), d, f;
  n.input.lastKeyCode === 8 && Date.now() - 100 < n.input.lastKeyCodeTime ? (d = n.state.selection.to, f = "end") : (d = n.state.selection.from, f = "start"), n.input.lastKeyCode = null;
  let p = Tf(u.content, l.doc.content, l.from, d, f);
  if ((yn && n.input.lastIOSEnter > Date.now() - 225 || qe) && i.some((M) => M.nodeName == "DIV" || M.nodeName == "P" || M.nodeName == "LI") && (!p || p.endA >= p.endB) && n.someProp("handleKeyDown", (M) => M(n, cn(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (!p)
    if (r && a instanceof D && !a.empty && a.$head.sameParent(a.$anchor) && !n.composing && !(l.sel && l.sel.anchor != l.sel.head))
      p = { start: a.from, endA: a.to, endB: a.to };
    else {
      if (l.sel) {
        let M = As(n, n.state.doc, l.sel);
        M && !M.eq(n.state.selection) && n.dispatch(n.state.tr.setSelection(M));
      }
      return;
    }
  if (fe && n.cursorWrapper && l.sel && l.sel.anchor == n.cursorWrapper.deco.from && l.sel.head == l.sel.anchor) {
    let M = p.endB - p.start;
    l.sel = { anchor: l.sel.anchor + M, head: l.sel.anchor + M };
  }
  n.input.domChangeCount++, n.state.selection.from < n.state.selection.to && p.start == p.endB && n.state.selection instanceof D && (p.start > n.state.selection.from && p.start <= n.state.selection.from + 2 && n.state.selection.from >= l.from ? p.start = n.state.selection.from : p.endA < n.state.selection.to && p.endA >= n.state.selection.to - 2 && n.state.selection.to <= l.to && (p.endB += n.state.selection.to - p.endA, p.endA = n.state.selection.to)), pe && vt <= 11 && p.endB == p.start + 1 && p.endA == p.start && p.start > l.from && l.doc.textBetween(p.start - l.from - 1, p.start - l.from + 1) == " \xA0" && (p.start--, p.endA--, p.endB--);
  let h = l.doc.resolveNoCache(p.start - l.from), m = l.doc.resolveNoCache(p.endB - l.from), y = c.resolve(p.start), b = h.sameParent(m) && h.parent.inlineContent && y.end() >= p.endA, w;
  if ((yn && n.input.lastIOSEnter > Date.now() - 225 && (!b || i.some((M) => M.nodeName == "DIV" || M.nodeName == "P")) || !b && h.pos < l.doc.content.size && (w = P.findFrom(l.doc.resolve(h.pos + 1), 1, !0)) && w.head == m.pos) && n.someProp("handleKeyDown", (M) => M(n, cn(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (n.state.selection.anchor > p.start && Cf(c, p.start, p.endA, h, m) && n.someProp("handleKeyDown", (M) => M(n, cn(8, "Backspace")))) {
    qe && fe && n.domObserver.suppressSelectionUpdates();
    return;
  }
  fe && qe && p.endB == p.start && (n.input.lastAndroidDelete = Date.now()), qe && !b && h.start() != m.start() && m.parentOffset == 0 && h.depth == m.depth && l.sel && l.sel.anchor == l.sel.head && l.sel.head == p.endA && (p.endB -= 2, m = l.doc.resolveNoCache(p.endB - l.from), setTimeout(() => {
    n.someProp("handleKeyDown", function(M) {
      return M(n, cn(13, "Enter"));
    });
  }, 20));
  let E = p.start, g = p.endA, O, k, A;
  if (b) {
    if (h.pos == m.pos)
      pe && vt <= 11 && h.parentOffset == 0 && (n.domObserver.suppressSelectionUpdates(), setTimeout(() => at(n), 20)), O = n.state.tr.delete(E, g), k = c.resolve(p.start).marksAcross(c.resolve(p.endA));
    else if (p.endA == p.endB && (A = Of(h.parent.content.cut(h.parentOffset, m.parentOffset), y.parent.content.cut(y.parentOffset, p.endA - y.start()))))
      O = n.state.tr, A.type == "add" ? O.addMark(E, g, A.mark) : O.removeMark(E, g, A.mark);
    else if (h.parent.child(h.index()).isText && h.index() == m.index() - (m.textOffset ? 0 : 1)) {
      let M = h.parent.textBetween(h.parentOffset, m.parentOffset);
      if (n.someProp("handleTextInput", ($) => $(n, E, g, M)))
        return;
      O = n.state.tr.insertText(M, E, g);
    }
  }
  if (O || (O = n.state.tr.replace(E, g, l.doc.slice(p.start - l.from, p.endB - l.from))), l.sel) {
    let M = As(n, O.doc, l.sel);
    M && !(fe && qe && n.composing && M.empty && (p.start != p.endB || n.input.lastAndroidDelete < Date.now() - 100) && (M.head == E || M.head == O.mapping.map(g) - 1) || pe && M.empty && M.head == E) && O.setSelection(M);
  }
  k && O.ensureMarks(k), n.dispatch(O.scrollIntoView());
}
function As(n, e, t) {
  return Math.max(t.anchor, t.head) > e.content.size ? null : bo(n, e.resolve(t.anchor), e.resolve(t.head));
}
function Of(n, e) {
  let t = n.firstChild.marks, r = e.firstChild.marks, i = t, o = r, s, a, l;
  for (let u = 0; u < r.length; u++)
    i = r[u].removeFromSet(i);
  for (let u = 0; u < t.length; u++)
    o = t[u].removeFromSet(o);
  if (i.length == 1 && o.length == 0)
    a = i[0], s = "add", l = (u) => u.mark(a.addToSet(u.marks));
  else if (i.length == 0 && o.length == 1)
    a = o[0], s = "remove", l = (u) => u.mark(a.removeFromSet(u.marks));
  else
    return null;
  let c = [];
  for (let u = 0; u < e.childCount; u++)
    c.push(l(e.child(u)));
  if (x.from(c).eq(n))
    return { mark: a, type: s };
}
function Cf(n, e, t, r, i) {
  if (!r.parent.isTextblock || t - e <= i.pos - r.pos || Mi(r, !0, !1) < i.pos)
    return !1;
  let o = n.resolve(e);
  if (o.parentOffset < o.parent.content.size || !o.parent.isTextblock)
    return !1;
  let s = n.resolve(Mi(o, !0, !0));
  return !s.parent.isTextblock || s.pos > t || Mi(s, !0, !1) < t ? !1 : r.parent.content.cut(r.parentOffset).eq(s.parent.content);
}
function Mi(n, e, t) {
  let r = n.depth, i = e ? n.end() : n.pos;
  for (; r > 0 && (e || n.indexAfter(r) == n.node(r).childCount); )
    r--, i++, e = !1;
  if (t) {
    let o = n.node(r).maybeChild(n.indexAfter(r));
    for (; o && !o.isLeaf; )
      o = o.firstChild, i++;
  }
  return i;
}
function Tf(n, e, t, r, i) {
  let o = n.findDiffStart(e, t);
  if (o == null)
    return null;
  let { a: s, b: a } = n.findDiffEnd(e, t + n.size, t + e.size);
  if (i == "end") {
    let l = Math.max(0, o - Math.min(s, a));
    r -= s + l - o;
  }
  if (s < o && n.size < e.size) {
    let l = r <= o && r >= s ? o - r : 0;
    o -= l, a = o + (a - s), s = o;
  } else if (a < o) {
    let l = r <= o && r >= a ? o - r : 0;
    o -= l, s = o + (s - a), a = o;
  }
  return { start: o, endA: s, endB: a };
}
class Ef {
  constructor(e, t) {
    this._root = null, this.focused = !1, this.trackWrites = null, this.mounted = !1, this.markCursor = null, this.cursorWrapper = null, this.lastSelectedViewDesc = void 0, this.input = new Ud(), this.prevDirectPlugins = [], this.pluginViews = [], this.requiresGeckoHackNode = !1, this.dragging = null, this._props = t, this.state = t.state, this.directPlugins = t.plugins || [], this.directPlugins.forEach(Rs), this.dispatch = this.dispatch.bind(this), this.dom = e && e.mount || document.createElement("div"), e && (e.appendChild ? e.appendChild(this.dom) : typeof e == "function" ? e(this.dom) : e.mount && (this.mounted = !0)), this.editable = Is(this), Ds(this), this.nodeViews = Ps(this), this.docView = ps(this.state.doc, Ns(this), Si(this), this.dom, this), this.domObserver = new vf(this, (r, i, o, s) => Mf(this, r, i, o, s)), this.domObserver.start(), Gd(this), this.updatePluginViews();
  }
  get composing() {
    return this.input.composing;
  }
  get props() {
    if (this._props.state != this.state) {
      let e = this._props;
      this._props = {};
      for (let t in e)
        this._props[t] = e[t];
      this._props.state = this.state;
    }
    return this._props;
  }
  update(e) {
    e.handleDOMEvents != this._props.handleDOMEvents && Yi(this);
    let t = this._props;
    this._props = e, e.plugins && (e.plugins.forEach(Rs), this.directPlugins = e.plugins), this.updateStateInner(e.state, t);
  }
  setProps(e) {
    let t = {};
    for (let r in this._props)
      t[r] = this._props[r];
    t.state = this.state;
    for (let r in e)
      t[r] = e[r];
    this.update(t);
  }
  updateState(e) {
    this.updateStateInner(e, this._props);
  }
  updateStateInner(e, t) {
    let r = this.state, i = !1, o = !1;
    e.storedMarks && this.composing && (El(this), o = !0), this.state = e;
    let s = r.plugins != e.plugins || this._props.plugins != t.plugins;
    if (s || this._props.plugins != t.plugins || this._props.nodeViews != t.nodeViews) {
      let f = Ps(this);
      Nf(f, this.nodeViews) && (this.nodeViews = f, i = !0);
    }
    (s || t.handleDOMEvents != this._props.handleDOMEvents) && Yi(this), this.editable = Is(this), Ds(this);
    let a = Si(this), l = Ns(this), c = r.plugins != e.plugins && !r.doc.eq(e.doc) ? "reset" : e.scrollToSelection > r.scrollToSelection ? "to selection" : "preserve", u = i || !this.docView.matchesNode(e.doc, l, a);
    (u || !e.selection.eq(r.selection)) && (o = !0);
    let d = c == "preserve" && o && this.dom.style.overflowAnchor == null && pd(this);
    if (o) {
      this.domObserver.stop();
      let f = u && (pe || fe) && !this.composing && !r.selection.empty && !e.selection.empty && Af(r.selection, e.selection);
      if (u) {
        let p = fe ? this.trackWrites = this.domSelectionRange().focusNode : null;
        (i || !this.docView.update(e.doc, l, a, this)) && (this.docView.updateOuterDeco([]), this.docView.destroy(), this.docView = ps(e.doc, l, a, this.dom, this)), p && !this.trackWrites && (f = !0);
      }
      f || !(this.input.mouseDown && this.domObserver.currentSelection.eq(this.domSelectionRange()) && Fd(this)) ? at(this, f) : (ml(this, e.selection), this.domObserver.setCurSelection()), this.domObserver.start();
    }
    this.updatePluginViews(r), c == "reset" ? this.dom.scrollTop = 0 : c == "to selection" ? this.scrollToSelection() : d && hd(d);
  }
  scrollToSelection() {
    let e = this.domSelectionRange().focusNode;
    if (!this.someProp("handleScrollToSelection", (t) => t(this)))
      if (this.state.selection instanceof N) {
        let t = this.docView.domAfterPos(this.state.selection.from);
        t.nodeType == 1 && ls(this, t.getBoundingClientRect(), e);
      } else
        ls(this, this.coordsAtPos(this.state.selection.head, 1), e);
  }
  destroyPluginViews() {
    let e;
    for (; e = this.pluginViews.pop(); )
      e.destroy && e.destroy();
  }
  updatePluginViews(e) {
    if (!e || e.plugins != this.state.plugins || this.directPlugins != this.prevDirectPlugins) {
      this.prevDirectPlugins = this.directPlugins, this.destroyPluginViews();
      for (let t = 0; t < this.directPlugins.length; t++) {
        let r = this.directPlugins[t];
        r.spec.view && this.pluginViews.push(r.spec.view(this));
      }
      for (let t = 0; t < this.state.plugins.length; t++) {
        let r = this.state.plugins[t];
        r.spec.view && this.pluginViews.push(r.spec.view(this));
      }
    } else
      for (let t = 0; t < this.pluginViews.length; t++) {
        let r = this.pluginViews[t];
        r.update && r.update(this, e);
      }
  }
  someProp(e, t) {
    let r = this._props && this._props[e], i;
    if (r != null && (i = t ? t(r) : r))
      return i;
    for (let s = 0; s < this.directPlugins.length; s++) {
      let a = this.directPlugins[s].props[e];
      if (a != null && (i = t ? t(a) : a))
        return i;
    }
    let o = this.state.plugins;
    if (o)
      for (let s = 0; s < o.length; s++) {
        let a = o[s].props[e];
        if (a != null && (i = t ? t(a) : a))
          return i;
      }
  }
  hasFocus() {
    if (pe) {
      let e = this.root.activeElement;
      if (e == this.dom)
        return !0;
      if (!e || !this.dom.contains(e))
        return !1;
      for (; e && this.dom != e && this.dom.contains(e); ) {
        if (e.contentEditable == "false")
          return !1;
        e = e.parentElement;
      }
      return !0;
    }
    return this.root.activeElement == this.dom;
  }
  focus() {
    this.domObserver.stop(), this.editable && md(this.dom), at(this), this.domObserver.start();
  }
  get root() {
    let e = this._root;
    if (e == null) {
      for (let t = this.dom.parentNode; t; t = t.parentNode)
        if (t.nodeType == 9 || t.nodeType == 11 && t.host)
          return t.getSelection || (Object.getPrototypeOf(t).getSelection = () => t.ownerDocument.getSelection()), this._root = t;
    }
    return e || document;
  }
  posAtCoords(e) {
    return kd(this, e);
  }
  coordsAtPos(e, t = 1) {
    return al(this, e, t);
  }
  domAtPos(e, t = 0) {
    return this.docView.domFromPos(e, t);
  }
  nodeDOM(e) {
    let t = this.docView.descAt(e);
    return t ? t.nodeDOM : null;
  }
  posAtDOM(e, t, r = -1) {
    let i = this.docView.posFromDOM(e, t, r);
    if (i == null)
      throw new RangeError("DOM position not inside the editor");
    return i;
  }
  endOfTextblock(e, t) {
    return Od(this, t || this.state, e);
  }
  destroy() {
    !this.docView || (Yd(this), this.destroyPluginViews(), this.mounted ? (this.docView.update(this.state.doc, [], Si(this), this), this.dom.textContent = "") : this.dom.parentNode && this.dom.parentNode.removeChild(this.dom), this.docView.destroy(), this.docView = null);
  }
  get isDestroyed() {
    return this.docView == null;
  }
  dispatchEvent(e) {
    return Zd(this, e);
  }
  dispatch(e) {
    let t = this._props.dispatchTransaction;
    t ? t.call(this, e) : this.updateState(this.state.apply(e));
  }
  domSelectionRange() {
    return ae && this.root.nodeType === 11 && ld(this.dom.ownerDocument) == this.dom ? xf(this) : this.domSelection();
  }
  domSelection() {
    return this.root.getSelection();
  }
}
function Ns(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return e.class = "ProseMirror", e.contenteditable = String(n.editable), e.translate = "no", n.someProp("attributes", (t) => {
    if (typeof t == "function" && (t = t(n.state)), t)
      for (let r in t)
        r == "class" && (e.class += " " + t[r]), r == "style" ? e.style = (e.style ? e.style + ";" : "") + t[r] : !e[r] && r != "contenteditable" && r != "nodeName" && (e[r] = String(t[r]));
  }), [Te.node(0, n.state.doc.content.size, e)];
}
function Ds(n) {
  if (n.markCursor) {
    let e = document.createElement("img");
    e.className = "ProseMirror-separator", e.setAttribute("mark-placeholder", "true"), e.setAttribute("alt", ""), n.cursorWrapper = { dom: e, deco: Te.widget(n.state.selection.head, e, { raw: !0, marks: n.markCursor }) };
  } else
    n.cursorWrapper = null;
}
function Is(n) {
  return !n.someProp("editable", (e) => e(n.state) === !1);
}
function Af(n, e) {
  let t = Math.min(n.$anchor.sharedDepth(n.head), e.$anchor.sharedDepth(e.head));
  return n.$anchor.start(t) != e.$anchor.start(t);
}
function Ps(n) {
  let e = /* @__PURE__ */ Object.create(null);
  function t(r) {
    for (let i in r)
      Object.prototype.hasOwnProperty.call(e, i) || (e[i] = r[i]);
  }
  return n.someProp("nodeViews", t), n.someProp("markViews", t), e;
}
function Nf(n, e) {
  let t = 0, r = 0;
  for (let i in n) {
    if (n[i] != e[i])
      return !0;
    t++;
  }
  for (let i in e)
    r++;
  return t != r;
}
function Rs(n) {
  if (n.spec.state || n.spec.filterTransaction || n.spec.appendTransaction)
    throw new RangeError("Plugins passed directly to the view must not have a state component");
}
var St = {
  8: "Backspace",
  9: "Tab",
  10: "Enter",
  12: "NumLock",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  44: "PrintScreen",
  45: "Insert",
  46: "Delete",
  59: ";",
  61: "=",
  91: "Meta",
  92: "Meta",
  106: "*",
  107: "+",
  108: ",",
  109: "-",
  110: ".",
  111: "/",
  144: "NumLock",
  145: "ScrollLock",
  160: "Shift",
  161: "Shift",
  162: "Control",
  163: "Control",
  164: "Alt",
  165: "Alt",
  173: "-",
  186: ";",
  187: "=",
  188: ",",
  189: "-",
  190: ".",
  191: "/",
  192: "`",
  219: "[",
  220: "\\",
  221: "]",
  222: "'"
}, $r = {
  48: ")",
  49: "!",
  50: "@",
  51: "#",
  52: "$",
  53: "%",
  54: "^",
  55: "&",
  56: "*",
  57: "(",
  59: ":",
  61: "+",
  173: "_",
  186: ":",
  187: "+",
  188: "<",
  189: "_",
  190: ">",
  191: "?",
  192: "~",
  219: "{",
  220: "|",
  221: "}",
  222: '"'
}, Bs = typeof navigator < "u" && /Chrome\/(\d+)/.exec(navigator.userAgent);
typeof navigator < "u" && /Gecko\/\d+/.test(navigator.userAgent);
var Df = typeof navigator < "u" && /Mac/.test(navigator.platform), If = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent), Pf = Df || Bs && +Bs[1] < 57;
for (var ee = 0; ee < 10; ee++)
  St[48 + ee] = St[96 + ee] = String(ee);
for (var ee = 1; ee <= 24; ee++)
  St[ee + 111] = "F" + ee;
for (var ee = 65; ee <= 90; ee++)
  St[ee] = String.fromCharCode(ee + 32), $r[ee] = String.fromCharCode(ee);
for (var Oi in St)
  $r.hasOwnProperty(Oi) || ($r[Oi] = St[Oi]);
function Rf(n) {
  var e = Pf && (n.ctrlKey || n.altKey || n.metaKey) || If && n.shiftKey && n.key && n.key.length == 1 || n.key == "Unidentified", t = !e && n.key || (n.shiftKey ? $r : St)[n.keyCode] || n.key || "Unidentified";
  return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
const Bf = typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : !1;
function Lf(n) {
  let e = n.split(/-(?!$)/), t = e[e.length - 1];
  t == "Space" && (t = " ");
  let r, i, o, s;
  for (let a = 0; a < e.length - 1; a++) {
    let l = e[a];
    if (/^(cmd|meta|m)$/i.test(l))
      s = !0;
    else if (/^a(lt)?$/i.test(l))
      r = !0;
    else if (/^(c|ctrl|control)$/i.test(l))
      i = !0;
    else if (/^s(hift)?$/i.test(l))
      o = !0;
    else if (/^mod$/i.test(l))
      Bf ? s = !0 : i = !0;
    else
      throw new Error("Unrecognized modifier name: " + l);
  }
  return r && (t = "Alt-" + t), i && (t = "Ctrl-" + t), s && (t = "Meta-" + t), o && (t = "Shift-" + t), t;
}
function $f(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n)
    e[Lf(t)] = n[t];
  return e;
}
function Ci(n, e, t) {
  return e.altKey && (n = "Alt-" + n), e.ctrlKey && (n = "Ctrl-" + n), e.metaKey && (n = "Meta-" + n), t !== !1 && e.shiftKey && (n = "Shift-" + n), n;
}
function Ff(n) {
  return new U({ props: { handleKeyDown: Pl(n) } });
}
function Pl(n) {
  let e = $f(n);
  return function(t, r) {
    let i = Rf(r), o = i.length == 1 && i != " ", s, a = e[Ci(i, r, !o)];
    if (a && a(t.state, t.dispatch, t))
      return !0;
    if (o && (r.shiftKey || r.altKey || r.metaKey || i.charCodeAt(0) > 127) && (s = St[r.keyCode]) && s != i) {
      let l = e[Ci(s, r, !0)];
      if (l && l(t.state, t.dispatch, t))
        return !0;
    } else if (o && r.shiftKey) {
      let l = e[Ci(i, r, !0)];
      if (l && l(t.state, t.dispatch, t))
        return !0;
    }
    return !1;
  };
}
const Rl = (n, e) => n.selection.empty ? !1 : (e && e(n.tr.deleteSelection().scrollIntoView()), !0);
function zf(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("backward", n) : t.parentOffset > 0) ? null : t;
}
const Bl = (n, e, t) => {
  let r = zf(n, t);
  if (!r)
    return !1;
  let i = $l(r);
  if (!i) {
    let s = r.blockRange(), a = s && Gt(s);
    return a == null ? !1 : (e && e(n.tr.lift(s, a).scrollIntoView()), !0);
  }
  let o = i.nodeBefore;
  if (!o.type.spec.isolating && Yl(n, i, e))
    return !0;
  if (r.parent.content.size == 0 && (vn(o, "end") || N.isSelectable(o))) {
    let s = ho(n.doc, r.before(), r.after(), S.empty);
    if (s && s.slice.size < s.to - s.from) {
      if (e) {
        let a = n.tr.step(s);
        a.setSelection(vn(o, "end") ? P.findFrom(a.doc.resolve(a.mapping.map(i.pos, -1)), -1) : N.create(a.doc, i.pos - o.nodeSize)), e(a.scrollIntoView());
      }
      return !0;
    }
  }
  return o.isAtom && i.depth == r.depth - 1 ? (e && e(n.tr.delete(i.pos - o.nodeSize, i.pos).scrollIntoView()), !0) : !1;
};
function vn(n, e, t = !1) {
  for (let r = n; r; r = e == "start" ? r.firstChild : r.lastChild) {
    if (r.isTextblock)
      return !0;
    if (t && r.childCount != 1)
      return !1;
  }
  return !1;
}
const Ll = (n, e, t) => {
  let { $head: r, empty: i } = n.selection, o = r;
  if (!i)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("backward", n) : r.parentOffset > 0)
      return !1;
    o = $l(r);
  }
  let s = o && o.nodeBefore;
  return !s || !N.isSelectable(s) ? !1 : (e && e(n.tr.setSelection(N.create(n.doc, o.pos - s.nodeSize)).scrollIntoView()), !0);
};
function $l(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      if (n.index(e) > 0)
        return n.doc.resolve(n.before(e + 1));
      if (n.node(e).type.spec.isolating)
        break;
    }
  return null;
}
function Vf(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("forward", n) : t.parentOffset < t.parent.content.size) ? null : t;
}
const Fl = (n, e, t) => {
  let r = Vf(n, t);
  if (!r)
    return !1;
  let i = Vl(r);
  if (!i)
    return !1;
  let o = i.nodeAfter;
  if (Yl(n, i, e))
    return !0;
  if (r.parent.content.size == 0 && (vn(o, "start") || N.isSelectable(o))) {
    let s = ho(n.doc, r.before(), r.after(), S.empty);
    if (s && s.slice.size < s.to - s.from) {
      if (e) {
        let a = n.tr.step(s);
        a.setSelection(vn(o, "start") ? P.findFrom(a.doc.resolve(a.mapping.map(i.pos)), 1) : N.create(a.doc, a.mapping.map(i.pos))), e(a.scrollIntoView());
      }
      return !0;
    }
  }
  return o.isAtom && i.depth == r.depth - 1 ? (e && e(n.tr.delete(i.pos, i.pos + o.nodeSize).scrollIntoView()), !0) : !1;
}, zl = (n, e, t) => {
  let { $head: r, empty: i } = n.selection, o = r;
  if (!i)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("forward", n) : r.parentOffset < r.parent.content.size)
      return !1;
    o = Vl(r);
  }
  let s = o && o.nodeAfter;
  return !s || !N.isSelectable(s) ? !1 : (e && e(n.tr.setSelection(N.create(n.doc, o.pos)).scrollIntoView()), !0);
};
function Vl(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      let t = n.node(e);
      if (n.index(e) + 1 < t.childCount)
        return n.doc.resolve(n.after(e + 1));
      if (t.type.spec.isolating)
        break;
    }
  return null;
}
const jl = (n, e) => {
  let t = n.selection, r = t instanceof N, i;
  if (r) {
    if (t.node.isTextblock || !Ze(n.doc, t.from))
      return !1;
    i = t.from;
  } else if (i = Ua(n.doc, t.from, -1), i == null)
    return !1;
  if (e) {
    let o = n.tr.join(i);
    r && o.setSelection(N.create(o.doc, i - n.doc.resolve(i).nodeBefore.nodeSize)), e(o.scrollIntoView());
  }
  return !0;
}, Hl = (n, e) => {
  let t = n.selection, r;
  if (t instanceof N) {
    if (t.node.isTextblock || !Ze(n.doc, t.to))
      return !1;
    r = t.to;
  } else if (r = Ua(n.doc, t.to, 1), r == null)
    return !1;
  return e && e(n.tr.join(r).scrollIntoView()), !0;
}, Wl = (n, e) => {
  let { $from: t, $to: r } = n.selection, i = t.blockRange(r), o = i && Gt(i);
  return o == null ? !1 : (e && e(n.tr.lift(i, o).scrollIntoView()), !0);
}, ql = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  return !t.parent.type.spec.code || !t.sameParent(r) ? !1 : (e && e(n.tr.insertText(`
`).scrollIntoView()), !0);
};
function Kl(n) {
  for (let e = 0; e < n.edgeCount; e++) {
    let { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
const Jl = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  if (!t.parent.type.spec.code || !t.sameParent(r))
    return !1;
  let i = t.node(-1), o = t.indexAfter(-1), s = Kl(i.contentMatchAt(o));
  if (!s || !i.canReplaceWith(o, o, s))
    return !1;
  if (e) {
    let a = t.after(), l = n.tr.replaceWith(a, a, s.createAndFill());
    l.setSelection(P.near(l.doc.resolve(a), 1)), e(l.scrollIntoView());
  }
  return !0;
}, _l = (n, e) => {
  let t = n.selection, { $from: r, $to: i } = t;
  if (t instanceof Pe || r.parent.inlineContent || i.parent.inlineContent)
    return !1;
  let o = Kl(i.parent.contentMatchAt(i.indexAfter()));
  if (!o || !o.isTextblock)
    return !1;
  if (e) {
    let s = (!r.parentOffset && i.index() < i.parent.childCount ? r : i).pos, a = n.tr.insert(s, o.createAndFill());
    a.setSelection(D.create(a.doc, s + 1)), e(a.scrollIntoView());
  }
  return !0;
}, Ul = (n, e) => {
  let { $cursor: t } = n.selection;
  if (!t || t.parent.content.size)
    return !1;
  if (t.depth > 1 && t.after() != t.end(-1)) {
    let o = t.before();
    if (Ue(n.doc, o))
      return e && e(n.tr.split(o).scrollIntoView()), !0;
  }
  let r = t.blockRange(), i = r && Gt(r);
  return i == null ? !1 : (e && e(n.tr.lift(r, i).scrollIntoView()), !0);
}, Gl = (n, e) => {
  let { $from: t, to: r } = n.selection, i, o = t.sharedDepth(r);
  return o == 0 ? !1 : (i = t.before(o), e && e(n.tr.setSelection(N.create(n.doc, i))), !0);
};
function jf(n, e, t) {
  let r = e.nodeBefore, i = e.nodeAfter, o = e.index();
  return !r || !i || !r.type.compatibleContent(i.type) ? !1 : !r.content.size && e.parent.canReplace(o - 1, o) ? (t && t(n.tr.delete(e.pos - r.nodeSize, e.pos).scrollIntoView()), !0) : !e.parent.canReplace(o, o + 1) || !(i.isTextblock || Ze(n.doc, e.pos)) ? !1 : (t && t(n.tr.clearIncompatible(e.pos, r.type, r.contentMatchAt(r.childCount)).join(e.pos).scrollIntoView()), !0);
}
function Yl(n, e, t) {
  let r = e.nodeBefore, i = e.nodeAfter, o, s;
  if (r.type.spec.isolating || i.type.spec.isolating)
    return !1;
  if (jf(n, e, t))
    return !0;
  let a = e.parent.canReplace(e.index(), e.index() + 1);
  if (a && (o = (s = r.contentMatchAt(r.childCount)).findWrapping(i.type)) && s.matchType(o[0] || i.type).validEnd) {
    if (t) {
      let d = e.pos + i.nodeSize, f = x.empty;
      for (let m = o.length - 1; m >= 0; m--)
        f = x.from(o[m].create(null, f));
      f = x.from(r.copy(f));
      let p = n.tr.step(new _(e.pos - 1, d, e.pos, d, new S(f, 1, 0), o.length, !0)), h = d + 2 * o.length;
      Ze(p.doc, h) && p.join(h), t(p.scrollIntoView());
    }
    return !0;
  }
  let l = P.findFrom(e, 1), c = l && l.$from.blockRange(l.$to), u = c && Gt(c);
  if (u != null && u >= e.depth)
    return t && t(n.tr.lift(c, u).scrollIntoView()), !0;
  if (a && vn(i, "start", !0) && vn(r, "end")) {
    let d = r, f = [];
    for (; f.push(d), !d.isTextblock; )
      d = d.lastChild;
    let p = i, h = 1;
    for (; !p.isTextblock; p = p.firstChild)
      h++;
    if (d.canReplace(d.childCount, d.childCount, p.content)) {
      if (t) {
        let m = x.empty;
        for (let b = f.length - 1; b >= 0; b--)
          m = x.from(f[b].copy(m));
        let y = n.tr.step(new _(e.pos - f.length, e.pos + i.nodeSize, e.pos + h, e.pos + i.nodeSize - h, new S(m, f.length, 0), 0, !0));
        t(y.scrollIntoView());
      }
      return !0;
    }
  }
  return !1;
}
function Xl(n) {
  return function(e, t) {
    let r = e.selection, i = n < 0 ? r.$from : r.$to, o = i.depth;
    for (; i.node(o).isInline; ) {
      if (!o)
        return !1;
      o--;
    }
    return i.node(o).isTextblock ? (t && t(e.tr.setSelection(D.create(e.doc, n < 0 ? i.start(o) : i.end(o)))), !0) : !1;
  };
}
const Zl = Xl(-1), Ql = Xl(1);
function ec(n, e = null) {
  return function(t, r) {
    let { $from: i, $to: o } = t.selection, s = i.blockRange(o), a = s && po(s, n, e);
    return a ? (r && r(t.tr.wrap(s, a).scrollIntoView()), !0) : !1;
  };
}
function Fr(n, e = null) {
  return function(t, r) {
    let i = !1;
    for (let o = 0; o < t.selection.ranges.length && !i; o++) {
      let { $from: { pos: s }, $to: { pos: a } } = t.selection.ranges[o];
      t.doc.nodesBetween(s, a, (l, c) => {
        if (i)
          return !1;
        if (!(!l.isTextblock || l.hasMarkup(n, e)))
          if (l.type == n)
            i = !0;
          else {
            let u = t.doc.resolve(c), d = u.index();
            i = u.parent.canReplaceWith(d, d + 1, n);
          }
      });
    }
    if (!i)
      return !1;
    if (r) {
      let o = t.tr;
      for (let s = 0; s < t.selection.ranges.length; s++) {
        let { $from: { pos: a }, $to: { pos: l } } = t.selection.ranges[s];
        o.setBlockType(a, l, n, e);
      }
      r(o.scrollIntoView());
    }
    return !0;
  };
}
typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os < "u" && os.platform && os.platform() == "darwin";
function tc(n, e = null) {
  return function(t, r) {
    let { $from: i, $to: o } = t.selection, s = i.blockRange(o), a = !1, l = s;
    if (!s)
      return !1;
    if (s.depth >= 2 && i.node(s.depth - 1).type.compatibleContent(n) && s.startIndex == 0) {
      if (i.index(s.depth - 1) == 0)
        return !1;
      let u = t.doc.resolve(s.start - 2);
      l = new Ar(u, u, s.depth), s.endIndex < s.parent.childCount && (s = new Ar(i, t.doc.resolve(o.end(s.depth)), s.depth)), a = !0;
    }
    let c = po(l, n, e, s);
    return c ? (r && r(Hf(t.tr, s, c, a, n).scrollIntoView()), !0) : !1;
  };
}
function Hf(n, e, t, r, i) {
  let o = x.empty;
  for (let u = t.length - 1; u >= 0; u--)
    o = x.from(t[u].type.create(t[u].attrs, o));
  n.step(new _(e.start - (r ? 2 : 0), e.end, e.start, e.end, new S(o, 0, 0), t.length, !0));
  let s = 0;
  for (let u = 0; u < t.length; u++)
    t[u].type == i && (s = u + 1);
  let a = t.length - s, l = e.start + t.length - (r ? 2 : 0), c = e.parent;
  for (let u = e.startIndex, d = e.endIndex, f = !0; u < d; u++, f = !1)
    !f && Ue(n.doc, l, a) && (n.split(l, a), l += 2 * a), l += c.child(u).nodeSize;
  return n;
}
function nc(n) {
  return function(e, t) {
    let { $from: r, $to: i } = e.selection, o = r.blockRange(i, (s) => s.childCount > 0 && s.firstChild.type == n);
    return o ? t ? r.node(o.depth - 1).type == n ? Wf(e, t, n, o) : qf(e, t, o) : !0 : !1;
  };
}
function Wf(n, e, t, r) {
  let i = n.tr, o = r.end, s = r.$to.end(r.depth);
  o < s && (i.step(new _(o - 1, s, o, s, new S(x.from(t.create(null, r.parent.copy())), 1, 0), 1, !0)), r = new Ar(i.doc.resolve(r.$from.pos), i.doc.resolve(s), r.depth));
  const a = Gt(r);
  if (a == null)
    return !1;
  i.lift(r, a);
  let l = i.mapping.map(o, -1) - 1;
  return Ze(i.doc, l) && i.join(l), e(i.scrollIntoView()), !0;
}
function qf(n, e, t) {
  let r = n.tr, i = t.parent;
  for (let p = t.end, h = t.endIndex - 1, m = t.startIndex; h > m; h--)
    p -= i.child(h).nodeSize, r.delete(p - 1, p + 1);
  let o = r.doc.resolve(t.start), s = o.nodeAfter;
  if (r.mapping.map(t.end) != t.start + o.nodeAfter.nodeSize)
    return !1;
  let a = t.startIndex == 0, l = t.endIndex == i.childCount, c = o.node(-1), u = o.index(-1);
  if (!c.canReplace(u + (a ? 0 : 1), u + 1, s.content.append(l ? x.empty : x.from(i))))
    return !1;
  let d = o.pos, f = d + s.nodeSize;
  return r.step(new _(d - (a ? 1 : 0), f + (l ? 1 : 0), d + 1, f - 1, new S((a ? x.empty : x.from(i.copy(x.empty))).append(l ? x.empty : x.from(i.copy(x.empty))), a ? 0 : 1, l ? 0 : 1), a ? 0 : 1)), e(r.scrollIntoView()), !0;
}
function rc(n) {
  return function(e, t) {
    let { $from: r, $to: i } = e.selection, o = r.blockRange(i, (c) => c.childCount > 0 && c.firstChild.type == n);
    if (!o)
      return !1;
    let s = o.startIndex;
    if (s == 0)
      return !1;
    let a = o.parent, l = a.child(s - 1);
    if (l.type != n)
      return !1;
    if (t) {
      let c = l.lastChild && l.lastChild.type == a.type, u = x.from(c ? n.create() : null), d = new S(x.from(n.create(null, x.from(a.type.create(null, u)))), c ? 3 : 1, 0), f = o.start, p = o.end;
      t(e.tr.step(new _(f - (c ? 3 : 1), p, f, p, d, 1, !0)).scrollIntoView());
    }
    return !0;
  };
}
function ic(n) {
  const { state: e, transaction: t } = n;
  let { selection: r } = t, { doc: i } = t, { storedMarks: o } = t;
  return {
    ...e,
    apply: e.apply.bind(e),
    applyTransaction: e.applyTransaction.bind(e),
    filterTransaction: e.filterTransaction,
    plugins: e.plugins,
    schema: e.schema,
    reconfigure: e.reconfigure.bind(e),
    toJSON: e.toJSON.bind(e),
    get storedMarks() {
      return o;
    },
    get selection() {
      return r;
    },
    get doc() {
      return i;
    },
    get tr() {
      return r = t.selection, i = t.doc, o = t.storedMarks, t;
    }
  };
}
class Kf {
  constructor(e) {
    this.editor = e.editor, this.rawCommands = this.editor.extensionManager.commands, this.customState = e.state;
  }
  get hasCustomState() {
    return !!this.customState;
  }
  get state() {
    return this.customState || this.editor.state;
  }
  get commands() {
    const { rawCommands: e, editor: t, state: r } = this, { view: i } = t, { tr: o } = r, s = this.buildProps(o);
    return Object.fromEntries(Object.entries(e).map(([a, l]) => [a, (...u) => {
      const d = l(...u)(s);
      return !o.getMeta("preventDispatch") && !this.hasCustomState && i.dispatch(o), d;
    }]));
  }
  get chain() {
    return () => this.createChain();
  }
  get can() {
    return () => this.createCan();
  }
  createChain(e, t = !0) {
    const { rawCommands: r, editor: i, state: o } = this, { view: s } = i, a = [], l = !!e, c = e || o.tr, u = () => (!l && t && !c.getMeta("preventDispatch") && !this.hasCustomState && s.dispatch(c), a.every((f) => f === !0)), d = {
      ...Object.fromEntries(Object.entries(r).map(([f, p]) => [f, (...m) => {
        const y = this.buildProps(c, t), b = p(...m)(y);
        return a.push(b), d;
      }])),
      run: u
    };
    return d;
  }
  createCan(e) {
    const { rawCommands: t, state: r } = this, i = !1, o = e || r.tr, s = this.buildProps(o, i);
    return {
      ...Object.fromEntries(Object.entries(t).map(([l, c]) => [l, (...u) => c(...u)({ ...s, dispatch: void 0 })])),
      chain: () => this.createChain(o, i)
    };
  }
  buildProps(e, t = !0) {
    const { rawCommands: r, editor: i, state: o } = this, { view: s } = i;
    o.storedMarks && e.setStoredMarks(o.storedMarks);
    const a = {
      tr: e,
      editor: i,
      view: s,
      state: ic({
        state: o,
        transaction: e
      }),
      dispatch: t ? () => {
      } : void 0,
      chain: () => this.createChain(e),
      can: () => this.createCan(e),
      get commands() {
        return Object.fromEntries(Object.entries(r).map(([l, c]) => [l, (...u) => c(...u)(a)]));
      }
    };
    return a;
  }
}
function mt(n, e, t) {
  return n.config[e] === void 0 && n.parent ? mt(n.parent, e, t) : typeof n.config[e] == "function" ? n.config[e].bind({
    ...t,
    parent: n.parent ? mt(n.parent, e, t) : null
  }) : n.config[e];
}
function Jf(n) {
  const e = n.filter((i) => i.type === "extension"), t = n.filter((i) => i.type === "node"), r = n.filter((i) => i.type === "mark");
  return {
    baseExtensions: e,
    nodeExtensions: t,
    markExtensions: r
  };
}
function oe(n, e) {
  if (typeof n == "string") {
    if (!e.nodes[n])
      throw Error(`There is no node type named '${n}'. Maybe you forgot to add the extension?`);
    return e.nodes[n];
  }
  return n;
}
function _f(n) {
  return typeof n == "function";
}
function sn(n, e = void 0, ...t) {
  return _f(n) ? e ? n.bind(e)(...t) : n(...t) : n;
}
function Uf(n) {
  return Object.prototype.toString.call(n) === "[object RegExp]";
}
function Gf(n) {
  return Object.prototype.toString.call(n).slice(8, -1);
}
function Ti(n) {
  return Gf(n) !== "Object" ? !1 : n.constructor === Object && Object.getPrototypeOf(n) === Object.prototype;
}
function oc(n, e) {
  const t = { ...n };
  return Ti(n) && Ti(e) && Object.keys(e).forEach((r) => {
    Ti(e[r]) ? r in n ? t[r] = oc(n[r], e[r]) : Object.assign(t, { [r]: e[r] }) : Object.assign(t, { [r]: e[r] });
  }), t;
}
class Ye {
  constructor(e = {}) {
    this.type = "extension", this.name = "extension", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...e
    }, this.name = this.config.name, e.defaultOptions && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = sn(mt(this, "addOptions", {
      name: this.name
    }))), this.storage = sn(mt(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(e = {}) {
    return new Ye(e);
  }
  configure(e = {}) {
    const t = this.extend();
    return t.options = oc(this.options, e), t.storage = sn(mt(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
  extend(e = {}) {
    const t = new Ye(e);
    return t.parent = this, this.child = t, t.name = e.name ? e.name : t.parent.name, e.defaultOptions && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${t.name}".`), t.options = sn(mt(t, "addOptions", {
      name: t.name
    })), t.storage = sn(mt(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
}
function Yf(n, e, t) {
  const { from: r, to: i } = e, { blockSeparator: o = `

`, textSerializers: s = {} } = t || {};
  let a = "", l = !0;
  return n.nodesBetween(r, i, (c, u, d, f) => {
    var p;
    const h = s == null ? void 0 : s[c.type.name];
    h ? (c.isBlock && !l && (a += o, l = !0), d && (a += h({
      node: c,
      pos: u,
      parent: d,
      index: f,
      range: e
    }))) : c.isText ? (a += (p = c == null ? void 0 : c.text) === null || p === void 0 ? void 0 : p.slice(Math.max(r, u) - u, i - u), l = !1) : c.isBlock && !l && (a += o, l = !0);
  }), a;
}
function Xf(n) {
  return Object.fromEntries(Object.entries(n.nodes).filter(([, e]) => e.spec.toText).map(([e, t]) => [e, t.spec.toText]));
}
Ye.create({
  name: "clipboardTextSerializer",
  addProseMirrorPlugins() {
    return [
      new U({
        key: new de("clipboardTextSerializer"),
        props: {
          clipboardTextSerializer: () => {
            const { editor: n } = this, { state: e, schema: t } = n, { doc: r, selection: i } = e, { ranges: o } = i, s = Math.min(...o.map((u) => u.$from.pos)), a = Math.max(...o.map((u) => u.$to.pos)), l = Xf(t);
            return Yf(r, { from: s, to: a }, {
              textSerializers: l
            });
          }
        }
      })
    ];
  }
});
const Zf = () => ({ editor: n, view: e }) => (requestAnimationFrame(() => {
  var t;
  n.isDestroyed || (e.dom.blur(), (t = window == null ? void 0 : window.getSelection()) === null || t === void 0 || t.removeAllRanges());
}), !0), Qf = (n = !1) => ({ commands: e }) => e.setContent("", n), ep = () => ({ state: n, tr: e, dispatch: t }) => {
  const { selection: r } = e, { ranges: i } = r;
  return t && i.forEach(({ $from: o, $to: s }) => {
    n.doc.nodesBetween(o.pos, s.pos, (a, l) => {
      if (a.type.isText)
        return;
      const { doc: c, mapping: u } = e, d = c.resolve(u.map(l)), f = c.resolve(u.map(l + a.nodeSize)), p = d.blockRange(f);
      if (!p)
        return;
      const h = Gt(p);
      if (a.type.isTextblock) {
        const { defaultType: m } = d.parent.contentMatchAt(d.index());
        e.setNodeMarkup(p.start, m);
      }
      (h || h === 0) && e.lift(p, h);
    });
  }), !0;
}, tp = (n) => (e) => n(e), np = () => ({ state: n, dispatch: e }) => _l(n, e), rp = () => ({ tr: n, dispatch: e }) => {
  const { selection: t } = n, r = t.$anchor.node();
  if (r.content.size > 0)
    return !1;
  const i = n.selection.$anchor;
  for (let o = i.depth; o > 0; o -= 1)
    if (i.node(o).type === r.type) {
      if (e) {
        const a = i.before(o), l = i.after(o);
        n.delete(a, l).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, ip = (n) => ({ tr: e, state: t, dispatch: r }) => {
  const i = oe(n, t.schema), o = e.selection.$anchor;
  for (let s = o.depth; s > 0; s -= 1)
    if (o.node(s).type === i) {
      if (r) {
        const l = o.before(s), c = o.after(s);
        e.delete(l, c).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, op = (n) => ({ tr: e, dispatch: t }) => {
  const { from: r, to: i } = n;
  return t && e.delete(r, i), !0;
}, sp = () => ({ state: n, dispatch: e }) => Rl(n, e), ap = () => ({ commands: n }) => n.keyboardShortcut("Enter"), lp = () => ({ state: n, dispatch: e }) => Jl(n, e);
function zr(n, e, t = { strict: !0 }) {
  const r = Object.keys(e);
  return r.length ? r.every((i) => t.strict ? e[i] === n[i] : Uf(e[i]) ? e[i].test(n[i]) : e[i] === n[i]) : !0;
}
function Zi(n, e, t = {}) {
  return n.find((r) => r.type === e && zr(r.attrs, t));
}
function cp(n, e, t = {}) {
  return !!Zi(n, e, t);
}
function sc(n, e, t = {}) {
  if (!n || !e)
    return;
  let r = n.parent.childAfter(n.parentOffset);
  if (n.parentOffset === r.offset && r.offset !== 0 && (r = n.parent.childBefore(n.parentOffset)), !r.node)
    return;
  const i = Zi([...r.node.marks], e, t);
  if (!i)
    return;
  let o = r.index, s = n.start() + r.offset, a = o + 1, l = s + r.node.nodeSize;
  for (Zi([...r.node.marks], e, t); o > 0 && i.isInSet(n.parent.child(o - 1).marks); )
    o -= 1, s -= n.parent.child(o).nodeSize;
  for (; a < n.parent.childCount && cp([...n.parent.child(a).marks], e, t); )
    l += n.parent.child(a).nodeSize, a += 1;
  return {
    from: s,
    to: l
  };
}
function Ct(n, e) {
  if (typeof n == "string") {
    if (!e.marks[n])
      throw Error(`There is no mark type named '${n}'. Maybe you forgot to add the extension?`);
    return e.marks[n];
  }
  return n;
}
const up = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  const o = Ct(n, r.schema), { doc: s, selection: a } = t, { $from: l, from: c, to: u } = a;
  if (i) {
    const d = sc(l, o, e);
    if (d && d.from <= c && d.to >= u) {
      const f = D.create(s, d.from, d.to);
      t.setSelection(f);
    }
  }
  return !0;
}, dp = (n) => (e) => {
  const t = typeof n == "function" ? n(e) : n;
  for (let r = 0; r < t.length; r += 1)
    if (t[r](e))
      return !0;
  return !1;
};
function Oo(n) {
  return n instanceof D;
}
function ot(n = 0, e = 0, t = 0) {
  return Math.min(Math.max(n, e), t);
}
function fp(n, e = null) {
  if (!e)
    return null;
  const t = P.atStart(n), r = P.atEnd(n);
  if (e === "start" || e === !0)
    return t;
  if (e === "end")
    return r;
  const i = t.from, o = r.to;
  return e === "all" ? D.create(n, ot(0, i, o), ot(n.content.size, i, o)) : D.create(n, ot(e, i, o), ot(e, i, o));
}
function Co() {
  return [
    "iPad Simulator",
    "iPhone Simulator",
    "iPod Simulator",
    "iPad",
    "iPhone",
    "iPod"
  ].includes(navigator.platform) || navigator.userAgent.includes("Mac") && "ontouchend" in document;
}
const pp = (n = null, e = {}) => ({ editor: t, view: r, tr: i, dispatch: o }) => {
  e = {
    scrollIntoView: !0,
    ...e
  };
  const s = () => {
    Co() && r.dom.focus(), requestAnimationFrame(() => {
      t.isDestroyed || (r.focus(), e != null && e.scrollIntoView && t.commands.scrollIntoView());
    });
  };
  if (r.hasFocus() && n === null || n === !1)
    return !0;
  if (o && n === null && !Oo(t.state.selection))
    return s(), !0;
  const a = fp(i.doc, n) || t.state.selection, l = t.state.selection.eq(a);
  return o && (l || i.setSelection(a), l && i.storedMarks && i.setStoredMarks(i.storedMarks), s()), !0;
}, hp = (n, e) => (t) => n.every((r, i) => e(r, { ...t, index: i })), mp = (n, e) => ({ tr: t, commands: r }) => r.insertContentAt({ from: t.selection.from, to: t.selection.to }, n, e);
function Ls(n) {
  const e = `<body>${n}</body>`;
  return new window.DOMParser().parseFromString(e, "text/html").body;
}
function Vr(n, e, t) {
  if (t = {
    slice: !0,
    parseOptions: {},
    ...t
  }, typeof n == "object" && n !== null)
    try {
      return Array.isArray(n) ? x.fromArray(n.map((r) => e.nodeFromJSON(r))) : e.nodeFromJSON(n);
    } catch (r) {
      return console.warn("[tiptap warn]: Invalid content.", "Passed value:", n, "Error:", r), Vr("", e, t);
    }
  if (typeof n == "string") {
    const r = qt.fromSchema(e);
    return t.slice ? r.parseSlice(Ls(n), t.parseOptions).content : r.parse(Ls(n), t.parseOptions);
  }
  return Vr("", e, t);
}
function gp(n, e, t) {
  const r = n.steps.length - 1;
  if (r < e)
    return;
  const i = n.steps[r];
  if (!(i instanceof Q || i instanceof _))
    return;
  const o = n.mapping.maps[r];
  let s = 0;
  o.forEach((a, l, c, u) => {
    s === 0 && (s = u);
  }), n.setSelection(P.near(n.doc.resolve(s), t));
}
const yp = (n) => n.toString().startsWith("<"), bp = (n, e, t) => ({ tr: r, dispatch: i, editor: o }) => {
  if (i) {
    t = {
      parseOptions: {},
      updateSelection: !0,
      ...t
    };
    const s = Vr(e, o.schema, {
      parseOptions: {
        preserveWhitespace: "full",
        ...t.parseOptions
      }
    });
    if (s.toString() === "<>")
      return !0;
    let { from: a, to: l } = typeof n == "number" ? { from: n, to: n } : n, c = !0, u = !0;
    if ((yp(s) ? s : [s]).forEach((f) => {
      f.check(), c = c ? f.isText && f.marks.length === 0 : !1, u = u ? f.isBlock : !1;
    }), a === l && u) {
      const { parent: f } = r.doc.resolve(a);
      f.isTextblock && !f.type.spec.code && !f.childCount && (a -= 1, l += 1);
    }
    c ? r.insertText(e, a, l) : r.replaceWith(a, l, s), t.updateSelection && gp(r, r.steps.length - 1, -1);
  }
  return !0;
}, vp = () => ({ state: n, dispatch: e }) => jl(n, e), kp = () => ({ state: n, dispatch: e }) => Hl(n, e), xp = () => ({ state: n, dispatch: e }) => Bl(n, e), wp = () => ({ state: n, dispatch: e }) => Fl(n, e);
function ac() {
  return typeof navigator < "u" ? /Mac/.test(navigator.platform) : !1;
}
function Sp(n) {
  const e = n.split(/-(?!$)/);
  let t = e[e.length - 1];
  t === "Space" && (t = " ");
  let r, i, o, s;
  for (let a = 0; a < e.length - 1; a += 1) {
    const l = e[a];
    if (/^(cmd|meta|m)$/i.test(l))
      s = !0;
    else if (/^a(lt)?$/i.test(l))
      r = !0;
    else if (/^(c|ctrl|control)$/i.test(l))
      i = !0;
    else if (/^s(hift)?$/i.test(l))
      o = !0;
    else if (/^mod$/i.test(l))
      Co() || ac() ? s = !0 : i = !0;
    else
      throw new Error(`Unrecognized modifier name: ${l}`);
  }
  return r && (t = `Alt-${t}`), i && (t = `Ctrl-${t}`), s && (t = `Meta-${t}`), o && (t = `Shift-${t}`), t;
}
const Mp = (n) => ({ editor: e, view: t, tr: r, dispatch: i }) => {
  const o = Sp(n).split(/-(?!$)/), s = o.find((c) => !["Alt", "Ctrl", "Meta", "Shift"].includes(c)), a = new KeyboardEvent("keydown", {
    key: s === "Space" ? " " : s,
    altKey: o.includes("Alt"),
    ctrlKey: o.includes("Ctrl"),
    metaKey: o.includes("Meta"),
    shiftKey: o.includes("Shift"),
    bubbles: !0,
    cancelable: !0
  }), l = e.captureTransaction(() => {
    t.someProp("handleKeyDown", (c) => c(t, a));
  });
  return l == null || l.steps.forEach((c) => {
    const u = c.map(r.mapping);
    u && i && r.maybeStep(u);
  }), !0;
};
function To(n, e, t = {}) {
  const { from: r, to: i, empty: o } = n.selection, s = e ? oe(e, n.schema) : null, a = [];
  n.doc.nodesBetween(r, i, (d, f) => {
    if (d.isText)
      return;
    const p = Math.max(r, f), h = Math.min(i, f + d.nodeSize);
    a.push({
      node: d,
      from: p,
      to: h
    });
  });
  const l = i - r, c = a.filter((d) => s ? s.name === d.node.type.name : !0).filter((d) => zr(d.node.attrs, t, { strict: !1 }));
  return o ? !!c.length : c.reduce((d, f) => d + f.to - f.from, 0) >= l;
}
const Op = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = oe(n, t.schema);
  return To(t, i, e) ? Wl(t, r) : !1;
}, Cp = () => ({ state: n, dispatch: e }) => Ul(n, e), Tp = (n) => ({ state: e, dispatch: t }) => {
  const r = oe(n, e.schema);
  return nc(r)(e, t);
}, Ep = () => ({ state: n, dispatch: e }) => ql(n, e);
function lc(n, e) {
  return e.nodes[n] ? "node" : e.marks[n] ? "mark" : null;
}
function $s(n, e) {
  const t = typeof e == "string" ? [e] : e;
  return Object.keys(n).reduce((r, i) => (t.includes(i) || (r[i] = n[i]), r), {});
}
const Ap = (n, e) => ({ tr: t, state: r, dispatch: i }) => {
  let o = null, s = null;
  const a = lc(typeof n == "string" ? n : n.name, r.schema);
  return a ? (a === "node" && (o = oe(n, r.schema)), a === "mark" && (s = Ct(n, r.schema)), i && t.selection.ranges.forEach((l) => {
    r.doc.nodesBetween(l.$from.pos, l.$to.pos, (c, u) => {
      o && o === c.type && t.setNodeMarkup(u, void 0, $s(c.attrs, e)), s && c.marks.length && c.marks.forEach((d) => {
        s === d.type && t.addMark(u, u + c.nodeSize, s.create($s(d.attrs, e)));
      });
    });
  }), !0) : !1;
}, Np = () => ({ tr: n, dispatch: e }) => (e && n.scrollIntoView(), !0), Dp = () => ({ tr: n, commands: e }) => e.setTextSelection({
  from: 0,
  to: n.doc.content.size
}), Ip = () => ({ state: n, dispatch: e }) => Ll(n, e), Pp = () => ({ state: n, dispatch: e }) => zl(n, e), Rp = () => ({ state: n, dispatch: e }) => Gl(n, e), Bp = () => ({ state: n, dispatch: e }) => Ql(n, e), Lp = () => ({ state: n, dispatch: e }) => Zl(n, e);
function $p(n, e, t = {}) {
  return Vr(n, e, { slice: !1, parseOptions: t });
}
const Fp = (n, e = !1, t = {}) => ({ tr: r, editor: i, dispatch: o }) => {
  const { doc: s } = r, a = $p(n, i.schema, t);
  return o && r.replaceWith(0, s.content.size, a).setMeta("preventUpdate", !e), !0;
};
function zp(n) {
  for (let e = 0; e < n.edgeCount; e += 1) {
    const { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
function Vp(n, e) {
  for (let t = n.depth; t > 0; t -= 1) {
    const r = n.node(t);
    if (e(r))
      return {
        pos: t > 0 ? n.before(t) : 0,
        start: n.start(t),
        depth: t,
        node: r
      };
  }
}
function Eo(n) {
  return (e) => Vp(e.$from, n);
}
function jp(n, e) {
  const t = Ct(e, n.schema), { from: r, to: i, empty: o } = n.selection, s = [];
  o ? (n.storedMarks && s.push(...n.storedMarks), s.push(...n.selection.$head.marks())) : n.doc.nodesBetween(r, i, (l) => {
    s.push(...l.marks);
  });
  const a = s.find((l) => l.type.name === t.name);
  return a ? { ...a.attrs } : {};
}
function Hp(n, e, t = {}) {
  const { empty: r, ranges: i } = n.selection, o = e ? Ct(e, n.schema) : null;
  if (r)
    return !!(n.storedMarks || n.selection.$from.marks()).filter((d) => o ? o.name === d.type.name : !0).find((d) => zr(d.attrs, t, { strict: !1 }));
  let s = 0;
  const a = [];
  if (i.forEach(({ $from: d, $to: f }) => {
    const p = d.pos, h = f.pos;
    n.doc.nodesBetween(p, h, (m, y) => {
      if (!m.isText && !m.marks.length)
        return;
      const b = Math.max(p, y), w = Math.min(h, y + m.nodeSize), E = w - b;
      s += E, a.push(...m.marks.map((g) => ({
        mark: g,
        from: b,
        to: w
      })));
    });
  }), s === 0)
    return !1;
  const l = a.filter((d) => o ? o.name === d.mark.type.name : !0).filter((d) => zr(d.mark.attrs, t, { strict: !1 })).reduce((d, f) => d + f.to - f.from, 0), c = a.filter((d) => o ? d.mark.type !== o && d.mark.type.excludes(o) : !0).reduce((d, f) => d + f.to - f.from, 0);
  return (l > 0 ? l + c : l) >= s;
}
function Fs(n, e) {
  const { nodeExtensions: t } = Jf(e), r = t.find((s) => s.name === n);
  if (!r)
    return !1;
  const i = {
    name: r.name,
    options: r.options,
    storage: r.storage
  }, o = sn(mt(r, "group", i));
  return typeof o != "string" ? !1 : o.split(" ").includes("list");
}
function Wp(n) {
  return n instanceof N;
}
function qp(n, e, t) {
  const i = n.state.doc.content.size, o = ot(e, 0, i), s = ot(t, 0, i), a = n.coordsAtPos(o), l = n.coordsAtPos(s, -1), c = Math.min(a.top, l.top), u = Math.max(a.bottom, l.bottom), d = Math.min(a.left, l.left), f = Math.max(a.right, l.right), p = f - d, h = u - c, b = {
    top: c,
    bottom: u,
    left: d,
    right: f,
    width: p,
    height: h,
    x: d,
    y: c
  };
  return {
    ...b,
    toJSON: () => b
  };
}
function Kp(n, e, t) {
  var r;
  const { selection: i } = e;
  let o = null;
  if (Oo(i) && (o = i.$cursor), o) {
    const a = (r = n.storedMarks) !== null && r !== void 0 ? r : o.marks();
    return !!t.isInSet(a) || !a.some((l) => l.type.excludes(t));
  }
  const { ranges: s } = i;
  return s.some(({ $from: a, $to: l }) => {
    let c = a.depth === 0 ? n.doc.inlineContent && n.doc.type.allowsMarkType(t) : !1;
    return n.doc.nodesBetween(a.pos, l.pos, (u, d, f) => {
      if (c)
        return !1;
      if (u.isInline) {
        const p = !f || f.type.allowsMarkType(t), h = !!t.isInSet(u.marks) || !u.marks.some((m) => m.type.excludes(t));
        c = p && h;
      }
      return !c;
    }), c;
  });
}
const Jp = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  const { selection: o } = t, { empty: s, ranges: a } = o, l = Ct(n, r.schema);
  if (i)
    if (s) {
      const c = jp(r, l);
      t.addStoredMark(l.create({
        ...c,
        ...e
      }));
    } else
      a.forEach((c) => {
        const u = c.$from.pos, d = c.$to.pos;
        r.doc.nodesBetween(u, d, (f, p) => {
          const h = Math.max(p, u), m = Math.min(p + f.nodeSize, d);
          f.marks.find((b) => b.type === l) ? f.marks.forEach((b) => {
            l === b.type && t.addMark(h, m, l.create({
              ...b.attrs,
              ...e
            }));
          }) : t.addMark(h, m, l.create(e));
        });
      });
  return Kp(r, t, l);
}, _p = (n, e) => ({ tr: t }) => (t.setMeta(n, e), !0), Up = (n, e = {}) => ({ state: t, dispatch: r, chain: i }) => {
  const o = oe(n, t.schema);
  return o.isTextblock ? i().command(({ commands: s }) => Fr(o, e)(t) ? !0 : s.clearNodes()).command(({ state: s }) => Fr(o, e)(s, r)).run() : (console.warn('[tiptap warn]: Currently "setNode()" only supports text block nodes.'), !1);
}, Gp = (n) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: r } = e, i = ot(n, 0, r.content.size), o = N.create(r, i);
    e.setSelection(o);
  }
  return !0;
}, Yp = (n) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: r } = e, { from: i, to: o } = typeof n == "number" ? { from: n, to: n } : n, s = D.atStart(r).from, a = D.atEnd(r).to, l = ot(i, s, a), c = ot(o, s, a), u = D.create(r, l, c);
    e.setSelection(u);
  }
  return !0;
}, Xp = (n) => ({ state: e, dispatch: t }) => {
  const r = oe(n, e.schema);
  return rc(r)(e, t);
};
function xr(n, e, t) {
  return Object.fromEntries(Object.entries(t).filter(([r]) => {
    const i = n.find((o) => o.type === e && o.name === r);
    return i ? i.attribute.keepOnSplit : !1;
  }));
}
function zs(n, e) {
  const t = n.storedMarks || n.selection.$to.parentOffset && n.selection.$from.marks();
  if (t) {
    const r = t.filter((i) => e == null ? void 0 : e.includes(i.type.name));
    n.tr.ensureMarks(r);
  }
}
const Zp = ({ keepMarks: n = !0 } = {}) => ({ tr: e, state: t, dispatch: r, editor: i }) => {
  const { selection: o, doc: s } = e, { $from: a, $to: l } = o, c = i.extensionManager.attributes, u = xr(c, a.node().type.name, a.node().attrs);
  if (o instanceof N && o.node.isBlock)
    return !a.parentOffset || !Ue(s, a.pos) ? !1 : (r && (n && zs(t, i.extensionManager.splittableMarks), e.split(a.pos).scrollIntoView()), !0);
  if (!a.parent.isBlock)
    return !1;
  if (r) {
    const d = l.parentOffset === l.parent.content.size;
    o instanceof D && e.deleteSelection();
    const f = a.depth === 0 ? void 0 : zp(a.node(-1).contentMatchAt(a.indexAfter(-1)));
    let p = d && f ? [{
      type: f,
      attrs: u
    }] : void 0, h = Ue(e.doc, e.mapping.map(a.pos), 1, p);
    if (!p && !h && Ue(e.doc, e.mapping.map(a.pos), 1, f ? [{ type: f }] : void 0) && (h = !0, p = f ? [{
      type: f,
      attrs: u
    }] : void 0), h && (e.split(e.mapping.map(a.pos), 1, p), f && !d && !a.parentOffset && a.parent.type !== f)) {
      const m = e.mapping.map(a.before()), y = e.doc.resolve(m);
      a.node(-1).canReplaceWith(y.index(), y.index() + 1, f) && e.setNodeMarkup(e.mapping.map(a.before()), f);
    }
    n && zs(t, i.extensionManager.splittableMarks), e.scrollIntoView();
  }
  return !0;
}, Qp = (n) => ({ tr: e, state: t, dispatch: r, editor: i }) => {
  var o;
  const s = oe(n, t.schema), { $from: a, $to: l } = t.selection, c = t.selection.node;
  if (c && c.isBlock || a.depth < 2 || !a.sameParent(l))
    return !1;
  const u = a.node(-1);
  if (u.type !== s)
    return !1;
  const d = i.extensionManager.attributes;
  if (a.parent.content.size === 0 && a.node(-1).childCount === a.indexAfter(-1)) {
    if (a.depth === 2 || a.node(-3).type !== s || a.index(-2) !== a.node(-2).childCount - 1)
      return !1;
    if (r) {
      let y = x.empty;
      const b = a.index(-1) ? 1 : a.index(-2) ? 2 : 3;
      for (let A = a.depth - b; A >= a.depth - 3; A -= 1)
        y = x.from(a.node(A).copy(y));
      const w = a.indexAfter(-1) < a.node(-2).childCount ? 1 : a.indexAfter(-2) < a.node(-3).childCount ? 2 : 3, E = xr(d, a.node().type.name, a.node().attrs), g = ((o = s.contentMatch.defaultType) === null || o === void 0 ? void 0 : o.createAndFill(E)) || void 0;
      y = y.append(x.from(s.createAndFill(null, g) || void 0));
      const O = a.before(a.depth - (b - 1));
      e.replace(O, a.after(-w), new S(y, 4 - b, 0));
      let k = -1;
      e.doc.nodesBetween(O, e.doc.content.size, (A, M) => {
        if (k > -1)
          return !1;
        A.isTextblock && A.content.size === 0 && (k = M + 1);
      }), k > -1 && e.setSelection(D.near(e.doc.resolve(k))), e.scrollIntoView();
    }
    return !0;
  }
  const f = l.pos === a.end() ? u.contentMatchAt(0).defaultType : null, p = xr(d, u.type.name, u.attrs), h = xr(d, a.node().type.name, a.node().attrs);
  e.delete(a.pos, l.pos);
  const m = f ? [{ type: s, attrs: p }, { type: f, attrs: h }] : [{ type: s, attrs: p }];
  return Ue(e.doc, a.pos, 2) ? (r && e.split(a.pos, 2, m).scrollIntoView(), !0) : !1;
}, Vs = (n, e) => {
  const t = Eo((s) => s.type === e)(n.selection);
  if (!t)
    return !0;
  const r = n.doc.resolve(Math.max(0, t.pos - 1)).before(t.depth);
  if (r === void 0)
    return !0;
  const i = n.doc.nodeAt(r);
  return t.node.type === (i == null ? void 0 : i.type) && Ze(n.doc, t.pos) && n.join(t.pos), !0;
}, js = (n, e) => {
  const t = Eo((s) => s.type === e)(n.selection);
  if (!t)
    return !0;
  const r = n.doc.resolve(t.start).after(t.depth);
  if (r === void 0)
    return !0;
  const i = n.doc.nodeAt(r);
  return t.node.type === (i == null ? void 0 : i.type) && Ze(n.doc, r) && n.join(r), !0;
}, eh = (n, e) => ({ editor: t, tr: r, state: i, dispatch: o, chain: s, commands: a, can: l }) => {
  const { extensions: c } = t.extensionManager, u = oe(n, i.schema), d = oe(e, i.schema), { selection: f } = i, { $from: p, $to: h } = f, m = p.blockRange(h);
  if (!m)
    return !1;
  const y = Eo((b) => Fs(b.type.name, c))(f);
  if (m.depth >= 1 && y && m.depth - y.depth <= 1) {
    if (y.node.type === u)
      return a.liftListItem(d);
    if (Fs(y.node.type.name, c) && u.validContent(y.node.content) && o)
      return s().command(() => (r.setNodeMarkup(y.pos, u), !0)).command(() => Vs(r, u)).command(() => js(r, u)).run();
  }
  return s().command(() => l().wrapInList(u) ? !0 : a.clearNodes()).wrapInList(u).command(() => Vs(r, u)).command(() => js(r, u)).run();
}, th = (n, e = {}, t = {}) => ({ state: r, commands: i }) => {
  const { extendEmptyMarkRange: o = !1 } = t, s = Ct(n, r.schema);
  return Hp(r, s, e) ? i.unsetMark(s, { extendEmptyMarkRange: o }) : i.setMark(s, e);
}, nh = (n, e, t = {}) => ({ state: r, commands: i }) => {
  const o = oe(n, r.schema), s = oe(e, r.schema);
  return To(r, o, t) ? i.setNode(s) : i.setNode(o, t);
}, rh = (n, e = {}) => ({ state: t, commands: r }) => {
  const i = oe(n, t.schema);
  return To(t, i, e) ? r.lift(i) : r.wrapIn(i, e);
}, ih = () => ({ state: n, dispatch: e }) => {
  const t = n.plugins;
  for (let r = 0; r < t.length; r += 1) {
    const i = t[r];
    let o;
    if (i.spec.isInputRules && (o = i.getState(n))) {
      if (e) {
        const s = n.tr, a = o.transform;
        for (let l = a.steps.length - 1; l >= 0; l -= 1)
          s.step(a.steps[l].invert(a.docs[l]));
        if (o.text) {
          const l = s.doc.resolve(o.from).marks();
          s.replaceWith(o.from, o.to, n.schema.text(o.text, l));
        } else
          s.delete(o.from, o.to);
      }
      return !0;
    }
  }
  return !1;
}, oh = () => ({ tr: n, dispatch: e }) => {
  const { selection: t } = n, { empty: r, ranges: i } = t;
  return r || e && i.forEach((o) => {
    n.removeMark(o.$from.pos, o.$to.pos);
  }), !0;
}, sh = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  var o;
  const { extendEmptyMarkRange: s = !1 } = e, { selection: a } = t, l = Ct(n, r.schema), { $from: c, empty: u, ranges: d } = a;
  if (!i)
    return !0;
  if (u && s) {
    let { from: f, to: p } = a;
    const h = (o = c.marks().find((y) => y.type === l)) === null || o === void 0 ? void 0 : o.attrs, m = sc(c, l, h);
    m && (f = m.from, p = m.to), t.removeMark(f, p, l);
  } else
    d.forEach((f) => {
      t.removeMark(f.$from.pos, f.$to.pos, l);
    });
  return t.removeStoredMark(l), !0;
}, ah = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  let o = null, s = null;
  const a = lc(typeof n == "string" ? n : n.name, r.schema);
  return a ? (a === "node" && (o = oe(n, r.schema)), a === "mark" && (s = Ct(n, r.schema)), i && t.selection.ranges.forEach((l) => {
    const c = l.$from.pos, u = l.$to.pos;
    r.doc.nodesBetween(c, u, (d, f) => {
      o && o === d.type && t.setNodeMarkup(f, void 0, {
        ...d.attrs,
        ...e
      }), s && d.marks.length && d.marks.forEach((p) => {
        if (s === p.type) {
          const h = Math.max(f, c), m = Math.min(f + d.nodeSize, u);
          t.addMark(h, m, s.create({
            ...p.attrs,
            ...e
          }));
        }
      });
    });
  }), !0) : !1;
}, lh = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = oe(n, t.schema);
  return ec(i, e)(t, r);
}, ch = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = oe(n, t.schema);
  return tc(i, e)(t, r);
};
var uh = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  blur: Zf,
  clearContent: Qf,
  clearNodes: ep,
  command: tp,
  createParagraphNear: np,
  deleteCurrentNode: rp,
  deleteNode: ip,
  deleteRange: op,
  deleteSelection: sp,
  enter: ap,
  exitCode: lp,
  extendMarkRange: up,
  first: dp,
  focus: pp,
  forEach: hp,
  insertContent: mp,
  insertContentAt: bp,
  joinUp: vp,
  joinDown: kp,
  joinBackward: xp,
  joinForward: wp,
  keyboardShortcut: Mp,
  lift: Op,
  liftEmptyBlock: Cp,
  liftListItem: Tp,
  newlineInCode: Ep,
  resetAttributes: Ap,
  scrollIntoView: Np,
  selectAll: Dp,
  selectNodeBackward: Ip,
  selectNodeForward: Pp,
  selectParentNode: Rp,
  selectTextblockEnd: Bp,
  selectTextblockStart: Lp,
  setContent: Fp,
  setMark: Jp,
  setMeta: _p,
  setNode: Up,
  setNodeSelection: Gp,
  setTextSelection: Yp,
  sinkListItem: Xp,
  splitBlock: Zp,
  splitListItem: Qp,
  toggleList: eh,
  toggleMark: th,
  toggleNode: nh,
  toggleWrap: rh,
  undoInputRule: ih,
  unsetAllMarks: oh,
  unsetMark: sh,
  updateAttributes: ah,
  wrapIn: lh,
  wrapInList: ch
});
Ye.create({
  name: "commands",
  addCommands() {
    return {
      ...uh
    };
  }
});
Ye.create({
  name: "editable",
  addProseMirrorPlugins() {
    return [
      new U({
        key: new de("editable"),
        props: {
          editable: () => this.editor.options.editable
        }
      })
    ];
  }
});
Ye.create({
  name: "focusEvents",
  addProseMirrorPlugins() {
    const { editor: n } = this;
    return [
      new U({
        key: new de("focusEvents"),
        props: {
          handleDOMEvents: {
            focus: (e, t) => {
              n.isFocused = !0;
              const r = n.state.tr.setMeta("focus", { event: t }).setMeta("addToHistory", !1);
              return e.dispatch(r), !1;
            },
            blur: (e, t) => {
              n.isFocused = !1;
              const r = n.state.tr.setMeta("blur", { event: t }).setMeta("addToHistory", !1);
              return e.dispatch(r), !1;
            }
          }
        }
      })
    ];
  }
});
Ye.create({
  name: "keymap",
  addKeyboardShortcuts() {
    const n = () => this.editor.commands.first(({ commands: s }) => [
      () => s.undoInputRule(),
      () => s.command(({ tr: a }) => {
        const { selection: l, doc: c } = a, { empty: u, $anchor: d } = l, { pos: f, parent: p } = d, h = P.atStart(c).from === f;
        return !u || !h || !p.type.isTextblock || p.textContent.length ? !1 : s.clearNodes();
      }),
      () => s.deleteSelection(),
      () => s.joinBackward(),
      () => s.selectNodeBackward()
    ]), e = () => this.editor.commands.first(({ commands: s }) => [
      () => s.deleteSelection(),
      () => s.deleteCurrentNode(),
      () => s.joinForward(),
      () => s.selectNodeForward()
    ]), r = {
      Enter: () => this.editor.commands.first(({ commands: s }) => [
        () => s.newlineInCode(),
        () => s.createParagraphNear(),
        () => s.liftEmptyBlock(),
        () => s.splitBlock()
      ]),
      "Mod-Enter": () => this.editor.commands.exitCode(),
      Backspace: n,
      "Mod-Backspace": n,
      "Shift-Backspace": n,
      Delete: e,
      "Mod-Delete": e,
      "Mod-a": () => this.editor.commands.selectAll()
    }, i = {
      ...r
    }, o = {
      ...r,
      "Ctrl-h": n,
      "Alt-Backspace": n,
      "Ctrl-d": e,
      "Ctrl-Alt-Backspace": e,
      "Alt-Delete": e,
      "Alt-d": e,
      "Ctrl-a": () => this.editor.commands.selectTextblockStart(),
      "Ctrl-e": () => this.editor.commands.selectTextblockEnd()
    };
    return Co() || ac() ? o : i;
  },
  addProseMirrorPlugins() {
    return [
      new U({
        key: new de("clearDocument"),
        appendTransaction: (n, e, t) => {
          if (!(n.some((h) => h.docChanged) && !e.doc.eq(t.doc)))
            return;
          const { empty: i, from: o, to: s } = e.selection, a = P.atStart(e.doc).from, l = P.atEnd(e.doc).to, c = o === a && s === l, u = t.doc.textBetween(0, t.doc.content.size, " ", " ").length === 0;
          if (i || !c || !u)
            return;
          const d = t.tr, f = ic({
            state: t,
            transaction: d
          }), { commands: p } = new Kf({
            editor: this.editor,
            state: f
          });
          if (p.clearNodes(), !!d.steps.length)
            return d;
        }
      })
    ];
  }
});
Ye.create({
  name: "tabindex",
  addProseMirrorPlugins() {
    return [
      new U({
        key: new de("tabindex"),
        props: {
          attributes: this.editor.isEditable ? { tabindex: "0" } : {}
        }
      })
    ];
  }
});
var he = "top", Ee = "bottom", Ae = "right", me = "left", Qr = "auto", er = [he, Ee, Ae, me], kn = "start", Un = "end", dh = "clippingParents", cc = "viewport", Pn = "popper", fh = "reference", Hs = /* @__PURE__ */ er.reduce(function(n, e) {
  return n.concat([e + "-" + kn, e + "-" + Un]);
}, []), uc = /* @__PURE__ */ [].concat(er, [Qr]).reduce(function(n, e) {
  return n.concat([e, e + "-" + kn, e + "-" + Un]);
}, []), ph = "beforeRead", hh = "read", mh = "afterRead", gh = "beforeMain", yh = "main", bh = "afterMain", vh = "beforeWrite", kh = "write", xh = "afterWrite", Qi = [ph, hh, mh, gh, yh, bh, vh, kh, xh];
function Xe(n) {
  return n ? (n.nodeName || "").toLowerCase() : null;
}
function Ne(n) {
  if (n == null)
    return window;
  if (n.toString() !== "[object Window]") {
    var e = n.ownerDocument;
    return e && e.defaultView || window;
  }
  return n;
}
function Ut(n) {
  var e = Ne(n).Element;
  return n instanceof e || n instanceof Element;
}
function Se(n) {
  var e = Ne(n).HTMLElement;
  return n instanceof e || n instanceof HTMLElement;
}
function Ao(n) {
  if (typeof ShadowRoot > "u")
    return !1;
  var e = Ne(n).ShadowRoot;
  return n instanceof e || n instanceof ShadowRoot;
}
function wh(n) {
  var e = n.state;
  Object.keys(e.elements).forEach(function(t) {
    var r = e.styles[t] || {}, i = e.attributes[t] || {}, o = e.elements[t];
    !Se(o) || !Xe(o) || (Object.assign(o.style, r), Object.keys(i).forEach(function(s) {
      var a = i[s];
      a === !1 ? o.removeAttribute(s) : o.setAttribute(s, a === !0 ? "" : a);
    }));
  });
}
function Sh(n) {
  var e = n.state, t = {
    popper: {
      position: e.options.strategy,
      left: "0",
      top: "0",
      margin: "0"
    },
    arrow: {
      position: "absolute"
    },
    reference: {}
  };
  return Object.assign(e.elements.popper.style, t.popper), e.styles = t, e.elements.arrow && Object.assign(e.elements.arrow.style, t.arrow), function() {
    Object.keys(e.elements).forEach(function(r) {
      var i = e.elements[r], o = e.attributes[r] || {}, s = Object.keys(e.styles.hasOwnProperty(r) ? e.styles[r] : t[r]), a = s.reduce(function(l, c) {
        return l[c] = "", l;
      }, {});
      !Se(i) || !Xe(i) || (Object.assign(i.style, a), Object.keys(o).forEach(function(l) {
        i.removeAttribute(l);
      }));
    });
  };
}
const dc = {
  name: "applyStyles",
  enabled: !0,
  phase: "write",
  fn: wh,
  effect: Sh,
  requires: ["computeStyles"]
};
function Be(n) {
  return n.split("-")[0];
}
var Ht = Math.max, jr = Math.min, xn = Math.round;
function eo() {
  var n = navigator.userAgentData;
  return n != null && n.brands ? n.brands.map(function(e) {
    return e.brand + "/" + e.version;
  }).join(" ") : navigator.userAgent;
}
function fc() {
  return !/^((?!chrome|android).)*safari/i.test(eo());
}
function wn(n, e, t) {
  e === void 0 && (e = !1), t === void 0 && (t = !1);
  var r = n.getBoundingClientRect(), i = 1, o = 1;
  e && Se(n) && (i = n.offsetWidth > 0 && xn(r.width) / n.offsetWidth || 1, o = n.offsetHeight > 0 && xn(r.height) / n.offsetHeight || 1);
  var s = Ut(n) ? Ne(n) : window, a = s.visualViewport, l = !fc() && t, c = (r.left + (l && a ? a.offsetLeft : 0)) / i, u = (r.top + (l && a ? a.offsetTop : 0)) / o, d = r.width / i, f = r.height / o;
  return {
    width: d,
    height: f,
    top: u,
    right: c + d,
    bottom: u + f,
    left: c,
    x: c,
    y: u
  };
}
function No(n) {
  var e = wn(n), t = n.offsetWidth, r = n.offsetHeight;
  return Math.abs(e.width - t) <= 1 && (t = e.width), Math.abs(e.height - r) <= 1 && (r = e.height), {
    x: n.offsetLeft,
    y: n.offsetTop,
    width: t,
    height: r
  };
}
function pc(n, e) {
  var t = e.getRootNode && e.getRootNode();
  if (n.contains(e))
    return !0;
  if (t && Ao(t)) {
    var r = e;
    do {
      if (r && n.isSameNode(r))
        return !0;
      r = r.parentNode || r.host;
    } while (r);
  }
  return !1;
}
function $e(n) {
  return Ne(n).getComputedStyle(n);
}
function Mh(n) {
  return ["table", "td", "th"].indexOf(Xe(n)) >= 0;
}
function Tt(n) {
  return ((Ut(n) ? n.ownerDocument : n.document) || window.document).documentElement;
}
function ei(n) {
  return Xe(n) === "html" ? n : n.assignedSlot || n.parentNode || (Ao(n) ? n.host : null) || Tt(n);
}
function Ws(n) {
  return !Se(n) || $e(n).position === "fixed" ? null : n.offsetParent;
}
function Oh(n) {
  var e = /firefox/i.test(eo()), t = /Trident/i.test(eo());
  if (t && Se(n)) {
    var r = $e(n);
    if (r.position === "fixed")
      return null;
  }
  var i = ei(n);
  for (Ao(i) && (i = i.host); Se(i) && ["html", "body"].indexOf(Xe(i)) < 0; ) {
    var o = $e(i);
    if (o.transform !== "none" || o.perspective !== "none" || o.contain === "paint" || ["transform", "perspective"].indexOf(o.willChange) !== -1 || e && o.willChange === "filter" || e && o.filter && o.filter !== "none")
      return i;
    i = i.parentNode;
  }
  return null;
}
function tr(n) {
  for (var e = Ne(n), t = Ws(n); t && Mh(t) && $e(t).position === "static"; )
    t = Ws(t);
  return t && (Xe(t) === "html" || Xe(t) === "body" && $e(t).position === "static") ? e : t || Oh(n) || e;
}
function Do(n) {
  return ["top", "bottom"].indexOf(n) >= 0 ? "x" : "y";
}
function Hn(n, e, t) {
  return Ht(n, jr(e, t));
}
function Ch(n, e, t) {
  var r = Hn(n, e, t);
  return r > t ? t : r;
}
function hc() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}
function mc(n) {
  return Object.assign({}, hc(), n);
}
function gc(n, e) {
  return e.reduce(function(t, r) {
    return t[r] = n, t;
  }, {});
}
var Th = function(e, t) {
  return e = typeof e == "function" ? e(Object.assign({}, t.rects, {
    placement: t.placement
  })) : e, mc(typeof e != "number" ? e : gc(e, er));
};
function Eh(n) {
  var e, t = n.state, r = n.name, i = n.options, o = t.elements.arrow, s = t.modifiersData.popperOffsets, a = Be(t.placement), l = Do(a), c = [me, Ae].indexOf(a) >= 0, u = c ? "height" : "width";
  if (!(!o || !s)) {
    var d = Th(i.padding, t), f = No(o), p = l === "y" ? he : me, h = l === "y" ? Ee : Ae, m = t.rects.reference[u] + t.rects.reference[l] - s[l] - t.rects.popper[u], y = s[l] - t.rects.reference[l], b = tr(o), w = b ? l === "y" ? b.clientHeight || 0 : b.clientWidth || 0 : 0, E = m / 2 - y / 2, g = d[p], O = w - f[u] - d[h], k = w / 2 - f[u] / 2 + E, A = Hn(g, k, O), M = l;
    t.modifiersData[r] = (e = {}, e[M] = A, e.centerOffset = A - k, e);
  }
}
function Ah(n) {
  var e = n.state, t = n.options, r = t.element, i = r === void 0 ? "[data-popper-arrow]" : r;
  if (i != null && !(typeof i == "string" && (i = e.elements.popper.querySelector(i), !i))) {
    if (process.env.NODE_ENV !== "production" && (Se(i) || console.error(['Popper: "arrow" element must be an HTMLElement (not an SVGElement).', "To use an SVG arrow, wrap it in an HTMLElement that will be used as", "the arrow."].join(" "))), !pc(e.elements.popper, i)) {
      process.env.NODE_ENV !== "production" && console.error(['Popper: "arrow" modifier\'s `element` must be a child of the popper', "element."].join(" "));
      return;
    }
    e.elements.arrow = i;
  }
}
const Nh = {
  name: "arrow",
  enabled: !0,
  phase: "main",
  fn: Eh,
  effect: Ah,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};
function Sn(n) {
  return n.split("-")[1];
}
var Dh = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function Ih(n) {
  var e = n.x, t = n.y, r = window, i = r.devicePixelRatio || 1;
  return {
    x: xn(e * i) / i || 0,
    y: xn(t * i) / i || 0
  };
}
function qs(n) {
  var e, t = n.popper, r = n.popperRect, i = n.placement, o = n.variation, s = n.offsets, a = n.position, l = n.gpuAcceleration, c = n.adaptive, u = n.roundOffsets, d = n.isFixed, f = s.x, p = f === void 0 ? 0 : f, h = s.y, m = h === void 0 ? 0 : h, y = typeof u == "function" ? u({
    x: p,
    y: m
  }) : {
    x: p,
    y: m
  };
  p = y.x, m = y.y;
  var b = s.hasOwnProperty("x"), w = s.hasOwnProperty("y"), E = me, g = he, O = window;
  if (c) {
    var k = tr(t), A = "clientHeight", M = "clientWidth";
    if (k === Ne(t) && (k = Tt(t), $e(k).position !== "static" && a === "absolute" && (A = "scrollHeight", M = "scrollWidth")), k = k, i === he || (i === me || i === Ae) && o === Un) {
      g = Ee;
      var $ = d && k === O && O.visualViewport ? O.visualViewport.height : k[A];
      m -= $ - r.height, m *= l ? 1 : -1;
    }
    if (i === me || (i === he || i === Ee) && o === Un) {
      E = Ae;
      var j = d && k === O && O.visualViewport ? O.visualViewport.width : k[M];
      p -= j - r.width, p *= l ? 1 : -1;
    }
  }
  var F = Object.assign({
    position: a
  }, c && Dh), H = u === !0 ? Ih({
    x: p,
    y: m
  }) : {
    x: p,
    y: m
  };
  if (p = H.x, m = H.y, l) {
    var W;
    return Object.assign({}, F, (W = {}, W[g] = w ? "0" : "", W[E] = b ? "0" : "", W.transform = (O.devicePixelRatio || 1) <= 1 ? "translate(" + p + "px, " + m + "px)" : "translate3d(" + p + "px, " + m + "px, 0)", W));
  }
  return Object.assign({}, F, (e = {}, e[g] = w ? m + "px" : "", e[E] = b ? p + "px" : "", e.transform = "", e));
}
function Ph(n) {
  var e = n.state, t = n.options, r = t.gpuAcceleration, i = r === void 0 ? !0 : r, o = t.adaptive, s = o === void 0 ? !0 : o, a = t.roundOffsets, l = a === void 0 ? !0 : a;
  if (process.env.NODE_ENV !== "production") {
    var c = $e(e.elements.popper).transitionProperty || "";
    s && ["transform", "top", "right", "bottom", "left"].some(function(d) {
      return c.indexOf(d) >= 0;
    }) && console.warn(["Popper: Detected CSS transitions on at least one of the following", 'CSS properties: "transform", "top", "right", "bottom", "left".', `

`, 'Disable the "computeStyles" modifier\'s `adaptive` option to allow', "for smooth transitions, or remove these properties from the CSS", "transition declaration on the popper element if only transitioning", "opacity or background-color for example.", `

`, "We recommend using the popper element as a wrapper around an inner", "element that can have any CSS property transitioned for animations."].join(" "));
  }
  var u = {
    placement: Be(e.placement),
    variation: Sn(e.placement),
    popper: e.elements.popper,
    popperRect: e.rects.popper,
    gpuAcceleration: i,
    isFixed: e.options.strategy === "fixed"
  };
  e.modifiersData.popperOffsets != null && (e.styles.popper = Object.assign({}, e.styles.popper, qs(Object.assign({}, u, {
    offsets: e.modifiersData.popperOffsets,
    position: e.options.strategy,
    adaptive: s,
    roundOffsets: l
  })))), e.modifiersData.arrow != null && (e.styles.arrow = Object.assign({}, e.styles.arrow, qs(Object.assign({}, u, {
    offsets: e.modifiersData.arrow,
    position: "absolute",
    adaptive: !1,
    roundOffsets: l
  })))), e.attributes.popper = Object.assign({}, e.attributes.popper, {
    "data-popper-placement": e.placement
  });
}
const Rh = {
  name: "computeStyles",
  enabled: !0,
  phase: "beforeWrite",
  fn: Ph,
  data: {}
};
var gr = {
  passive: !0
};
function Bh(n) {
  var e = n.state, t = n.instance, r = n.options, i = r.scroll, o = i === void 0 ? !0 : i, s = r.resize, a = s === void 0 ? !0 : s, l = Ne(e.elements.popper), c = [].concat(e.scrollParents.reference, e.scrollParents.popper);
  return o && c.forEach(function(u) {
    u.addEventListener("scroll", t.update, gr);
  }), a && l.addEventListener("resize", t.update, gr), function() {
    o && c.forEach(function(u) {
      u.removeEventListener("scroll", t.update, gr);
    }), a && l.removeEventListener("resize", t.update, gr);
  };
}
const Lh = {
  name: "eventListeners",
  enabled: !0,
  phase: "write",
  fn: function() {
  },
  effect: Bh,
  data: {}
};
var $h = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function wr(n) {
  return n.replace(/left|right|bottom|top/g, function(e) {
    return $h[e];
  });
}
var Fh = {
  start: "end",
  end: "start"
};
function Ks(n) {
  return n.replace(/start|end/g, function(e) {
    return Fh[e];
  });
}
function Io(n) {
  var e = Ne(n), t = e.pageXOffset, r = e.pageYOffset;
  return {
    scrollLeft: t,
    scrollTop: r
  };
}
function Po(n) {
  return wn(Tt(n)).left + Io(n).scrollLeft;
}
function zh(n, e) {
  var t = Ne(n), r = Tt(n), i = t.visualViewport, o = r.clientWidth, s = r.clientHeight, a = 0, l = 0;
  if (i) {
    o = i.width, s = i.height;
    var c = fc();
    (c || !c && e === "fixed") && (a = i.offsetLeft, l = i.offsetTop);
  }
  return {
    width: o,
    height: s,
    x: a + Po(n),
    y: l
  };
}
function Vh(n) {
  var e, t = Tt(n), r = Io(n), i = (e = n.ownerDocument) == null ? void 0 : e.body, o = Ht(t.scrollWidth, t.clientWidth, i ? i.scrollWidth : 0, i ? i.clientWidth : 0), s = Ht(t.scrollHeight, t.clientHeight, i ? i.scrollHeight : 0, i ? i.clientHeight : 0), a = -r.scrollLeft + Po(n), l = -r.scrollTop;
  return $e(i || t).direction === "rtl" && (a += Ht(t.clientWidth, i ? i.clientWidth : 0) - o), {
    width: o,
    height: s,
    x: a,
    y: l
  };
}
function Ro(n) {
  var e = $e(n), t = e.overflow, r = e.overflowX, i = e.overflowY;
  return /auto|scroll|overlay|hidden/.test(t + i + r);
}
function yc(n) {
  return ["html", "body", "#document"].indexOf(Xe(n)) >= 0 ? n.ownerDocument.body : Se(n) && Ro(n) ? n : yc(ei(n));
}
function Wn(n, e) {
  var t;
  e === void 0 && (e = []);
  var r = yc(n), i = r === ((t = n.ownerDocument) == null ? void 0 : t.body), o = Ne(r), s = i ? [o].concat(o.visualViewport || [], Ro(r) ? r : []) : r, a = e.concat(s);
  return i ? a : a.concat(Wn(ei(s)));
}
function to(n) {
  return Object.assign({}, n, {
    left: n.x,
    top: n.y,
    right: n.x + n.width,
    bottom: n.y + n.height
  });
}
function jh(n, e) {
  var t = wn(n, !1, e === "fixed");
  return t.top = t.top + n.clientTop, t.left = t.left + n.clientLeft, t.bottom = t.top + n.clientHeight, t.right = t.left + n.clientWidth, t.width = n.clientWidth, t.height = n.clientHeight, t.x = t.left, t.y = t.top, t;
}
function Js(n, e, t) {
  return e === cc ? to(zh(n, t)) : Ut(e) ? jh(e, t) : to(Vh(Tt(n)));
}
function Hh(n) {
  var e = Wn(ei(n)), t = ["absolute", "fixed"].indexOf($e(n).position) >= 0, r = t && Se(n) ? tr(n) : n;
  return Ut(r) ? e.filter(function(i) {
    return Ut(i) && pc(i, r) && Xe(i) !== "body";
  }) : [];
}
function Wh(n, e, t, r) {
  var i = e === "clippingParents" ? Hh(n) : [].concat(e), o = [].concat(i, [t]), s = o[0], a = o.reduce(function(l, c) {
    var u = Js(n, c, r);
    return l.top = Ht(u.top, l.top), l.right = jr(u.right, l.right), l.bottom = jr(u.bottom, l.bottom), l.left = Ht(u.left, l.left), l;
  }, Js(n, s, r));
  return a.width = a.right - a.left, a.height = a.bottom - a.top, a.x = a.left, a.y = a.top, a;
}
function bc(n) {
  var e = n.reference, t = n.element, r = n.placement, i = r ? Be(r) : null, o = r ? Sn(r) : null, s = e.x + e.width / 2 - t.width / 2, a = e.y + e.height / 2 - t.height / 2, l;
  switch (i) {
    case he:
      l = {
        x: s,
        y: e.y - t.height
      };
      break;
    case Ee:
      l = {
        x: s,
        y: e.y + e.height
      };
      break;
    case Ae:
      l = {
        x: e.x + e.width,
        y: a
      };
      break;
    case me:
      l = {
        x: e.x - t.width,
        y: a
      };
      break;
    default:
      l = {
        x: e.x,
        y: e.y
      };
  }
  var c = i ? Do(i) : null;
  if (c != null) {
    var u = c === "y" ? "height" : "width";
    switch (o) {
      case kn:
        l[c] = l[c] - (e[u] / 2 - t[u] / 2);
        break;
      case Un:
        l[c] = l[c] + (e[u] / 2 - t[u] / 2);
        break;
    }
  }
  return l;
}
function Gn(n, e) {
  e === void 0 && (e = {});
  var t = e, r = t.placement, i = r === void 0 ? n.placement : r, o = t.strategy, s = o === void 0 ? n.strategy : o, a = t.boundary, l = a === void 0 ? dh : a, c = t.rootBoundary, u = c === void 0 ? cc : c, d = t.elementContext, f = d === void 0 ? Pn : d, p = t.altBoundary, h = p === void 0 ? !1 : p, m = t.padding, y = m === void 0 ? 0 : m, b = mc(typeof y != "number" ? y : gc(y, er)), w = f === Pn ? fh : Pn, E = n.rects.popper, g = n.elements[h ? w : f], O = Wh(Ut(g) ? g : g.contextElement || Tt(n.elements.popper), l, u, s), k = wn(n.elements.reference), A = bc({
    reference: k,
    element: E,
    strategy: "absolute",
    placement: i
  }), M = to(Object.assign({}, E, A)), $ = f === Pn ? M : k, j = {
    top: O.top - $.top + b.top,
    bottom: $.bottom - O.bottom + b.bottom,
    left: O.left - $.left + b.left,
    right: $.right - O.right + b.right
  }, F = n.modifiersData.offset;
  if (f === Pn && F) {
    var H = F[i];
    Object.keys(j).forEach(function(W) {
      var ve = [Ae, Ee].indexOf(W) >= 0 ? 1 : -1, ke = [he, Ee].indexOf(W) >= 0 ? "y" : "x";
      j[W] += H[ke] * ve;
    });
  }
  return j;
}
function qh(n, e) {
  e === void 0 && (e = {});
  var t = e, r = t.placement, i = t.boundary, o = t.rootBoundary, s = t.padding, a = t.flipVariations, l = t.allowedAutoPlacements, c = l === void 0 ? uc : l, u = Sn(r), d = u ? a ? Hs : Hs.filter(function(h) {
    return Sn(h) === u;
  }) : er, f = d.filter(function(h) {
    return c.indexOf(h) >= 0;
  });
  f.length === 0 && (f = d, process.env.NODE_ENV !== "production" && console.error(["Popper: The `allowedAutoPlacements` option did not allow any", "placements. Ensure the `placement` option matches the variation", "of the allowed placements.", 'For example, "auto" cannot be used to allow "bottom-start".', 'Use "auto-start" instead.'].join(" ")));
  var p = f.reduce(function(h, m) {
    return h[m] = Gn(n, {
      placement: m,
      boundary: i,
      rootBoundary: o,
      padding: s
    })[Be(m)], h;
  }, {});
  return Object.keys(p).sort(function(h, m) {
    return p[h] - p[m];
  });
}
function Kh(n) {
  if (Be(n) === Qr)
    return [];
  var e = wr(n);
  return [Ks(n), e, Ks(e)];
}
function Jh(n) {
  var e = n.state, t = n.options, r = n.name;
  if (!e.modifiersData[r]._skip) {
    for (var i = t.mainAxis, o = i === void 0 ? !0 : i, s = t.altAxis, a = s === void 0 ? !0 : s, l = t.fallbackPlacements, c = t.padding, u = t.boundary, d = t.rootBoundary, f = t.altBoundary, p = t.flipVariations, h = p === void 0 ? !0 : p, m = t.allowedAutoPlacements, y = e.options.placement, b = Be(y), w = b === y, E = l || (w || !h ? [wr(y)] : Kh(y)), g = [y].concat(E).reduce(function(Qe, De) {
      return Qe.concat(Be(De) === Qr ? qh(e, {
        placement: De,
        boundary: u,
        rootBoundary: d,
        padding: c,
        flipVariations: h,
        allowedAutoPlacements: m
      }) : De);
    }, []), O = e.rects.reference, k = e.rects.popper, A = /* @__PURE__ */ new Map(), M = !0, $ = g[0], j = 0; j < g.length; j++) {
      var F = g[j], H = Be(F), W = Sn(F) === kn, ve = [he, Ee].indexOf(H) >= 0, ke = ve ? "width" : "height", ne = Gn(e, {
        placement: F,
        boundary: u,
        rootBoundary: d,
        altBoundary: f,
        padding: c
      }), re = ve ? W ? Ae : me : W ? Ee : he;
      O[ke] > k[ke] && (re = wr(re));
      var X = wr(re), Fe = [];
      if (o && Fe.push(ne[H] <= 0), a && Fe.push(ne[re] <= 0, ne[X] <= 0), Fe.every(function(Qe) {
        return Qe;
      })) {
        $ = F, M = !1;
        break;
      }
      A.set(F, Fe);
    }
    if (M)
      for (var ze = h ? 3 : 1, At = function(De) {
        var et = g.find(function(Yt) {
          var tt = A.get(Yt);
          if (tt)
            return tt.slice(0, De).every(function(Xt) {
              return Xt;
            });
        });
        if (et)
          return $ = et, "break";
      }, Ve = ze; Ve > 0; Ve--) {
        var Nt = At(Ve);
        if (Nt === "break")
          break;
      }
    e.placement !== $ && (e.modifiersData[r]._skip = !0, e.placement = $, e.reset = !0);
  }
}
const _h = {
  name: "flip",
  enabled: !0,
  phase: "main",
  fn: Jh,
  requiresIfExists: ["offset"],
  data: {
    _skip: !1
  }
};
function _s(n, e, t) {
  return t === void 0 && (t = {
    x: 0,
    y: 0
  }), {
    top: n.top - e.height - t.y,
    right: n.right - e.width + t.x,
    bottom: n.bottom - e.height + t.y,
    left: n.left - e.width - t.x
  };
}
function Us(n) {
  return [he, Ae, Ee, me].some(function(e) {
    return n[e] >= 0;
  });
}
function Uh(n) {
  var e = n.state, t = n.name, r = e.rects.reference, i = e.rects.popper, o = e.modifiersData.preventOverflow, s = Gn(e, {
    elementContext: "reference"
  }), a = Gn(e, {
    altBoundary: !0
  }), l = _s(s, r), c = _s(a, i, o), u = Us(l), d = Us(c);
  e.modifiersData[t] = {
    referenceClippingOffsets: l,
    popperEscapeOffsets: c,
    isReferenceHidden: u,
    hasPopperEscaped: d
  }, e.attributes.popper = Object.assign({}, e.attributes.popper, {
    "data-popper-reference-hidden": u,
    "data-popper-escaped": d
  });
}
const Gh = {
  name: "hide",
  enabled: !0,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: Uh
};
function Yh(n, e, t) {
  var r = Be(n), i = [me, he].indexOf(r) >= 0 ? -1 : 1, o = typeof t == "function" ? t(Object.assign({}, e, {
    placement: n
  })) : t, s = o[0], a = o[1];
  return s = s || 0, a = (a || 0) * i, [me, Ae].indexOf(r) >= 0 ? {
    x: a,
    y: s
  } : {
    x: s,
    y: a
  };
}
function Xh(n) {
  var e = n.state, t = n.options, r = n.name, i = t.offset, o = i === void 0 ? [0, 0] : i, s = uc.reduce(function(u, d) {
    return u[d] = Yh(d, e.rects, o), u;
  }, {}), a = s[e.placement], l = a.x, c = a.y;
  e.modifiersData.popperOffsets != null && (e.modifiersData.popperOffsets.x += l, e.modifiersData.popperOffsets.y += c), e.modifiersData[r] = s;
}
const Zh = {
  name: "offset",
  enabled: !0,
  phase: "main",
  requires: ["popperOffsets"],
  fn: Xh
};
function Qh(n) {
  var e = n.state, t = n.name;
  e.modifiersData[t] = bc({
    reference: e.rects.reference,
    element: e.rects.popper,
    strategy: "absolute",
    placement: e.placement
  });
}
const em = {
  name: "popperOffsets",
  enabled: !0,
  phase: "read",
  fn: Qh,
  data: {}
};
function tm(n) {
  return n === "x" ? "y" : "x";
}
function nm(n) {
  var e = n.state, t = n.options, r = n.name, i = t.mainAxis, o = i === void 0 ? !0 : i, s = t.altAxis, a = s === void 0 ? !1 : s, l = t.boundary, c = t.rootBoundary, u = t.altBoundary, d = t.padding, f = t.tether, p = f === void 0 ? !0 : f, h = t.tetherOffset, m = h === void 0 ? 0 : h, y = Gn(e, {
    boundary: l,
    rootBoundary: c,
    padding: d,
    altBoundary: u
  }), b = Be(e.placement), w = Sn(e.placement), E = !w, g = Do(b), O = tm(g), k = e.modifiersData.popperOffsets, A = e.rects.reference, M = e.rects.popper, $ = typeof m == "function" ? m(Object.assign({}, e.rects, {
    placement: e.placement
  })) : m, j = typeof $ == "number" ? {
    mainAxis: $,
    altAxis: $
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, $), F = e.modifiersData.offset ? e.modifiersData.offset[e.placement] : null, H = {
    x: 0,
    y: 0
  };
  if (!!k) {
    if (o) {
      var W, ve = g === "y" ? he : me, ke = g === "y" ? Ee : Ae, ne = g === "y" ? "height" : "width", re = k[g], X = re + y[ve], Fe = re - y[ke], ze = p ? -M[ne] / 2 : 0, At = w === kn ? A[ne] : M[ne], Ve = w === kn ? -M[ne] : -A[ne], Nt = e.elements.arrow, Qe = p && Nt ? No(Nt) : {
        width: 0,
        height: 0
      }, De = e.modifiersData["arrow#persistent"] ? e.modifiersData["arrow#persistent"].padding : hc(), et = De[ve], Yt = De[ke], tt = Hn(0, A[ne], Qe[ne]), Xt = E ? A[ne] / 2 - ze - tt - et - j.mainAxis : At - tt - et - j.mainAxis, lt = E ? -A[ne] / 2 + ze + tt + Yt + j.mainAxis : Ve + tt + Yt + j.mainAxis, Zt = e.elements.arrow && tr(e.elements.arrow), nr = Zt ? g === "y" ? Zt.clientTop || 0 : Zt.clientLeft || 0 : 0, Tn = (W = F == null ? void 0 : F[g]) != null ? W : 0, rr = re + Xt - Tn - nr, ir = re + lt - Tn, En = Hn(p ? jr(X, rr) : X, re, p ? Ht(Fe, ir) : Fe);
      k[g] = En, H[g] = En - re;
    }
    if (a) {
      var An, or = g === "x" ? he : me, sr = g === "x" ? Ee : Ae, nt = k[O], ct = O === "y" ? "height" : "width", Nn = nt + y[or], Dt = nt - y[sr], Dn = [he, me].indexOf(b) !== -1, ar = (An = F == null ? void 0 : F[O]) != null ? An : 0, lr = Dn ? Nn : nt - A[ct] - M[ct] - ar + j.altAxis, cr = Dn ? nt + A[ct] + M[ct] - ar - j.altAxis : Dt, ur = p && Dn ? Ch(lr, nt, cr) : Hn(p ? lr : Nn, nt, p ? cr : Dt);
      k[O] = ur, H[O] = ur - nt;
    }
    e.modifiersData[r] = H;
  }
}
const rm = {
  name: "preventOverflow",
  enabled: !0,
  phase: "main",
  fn: nm,
  requiresIfExists: ["offset"]
};
function im(n) {
  return {
    scrollLeft: n.scrollLeft,
    scrollTop: n.scrollTop
  };
}
function om(n) {
  return n === Ne(n) || !Se(n) ? Io(n) : im(n);
}
function sm(n) {
  var e = n.getBoundingClientRect(), t = xn(e.width) / n.offsetWidth || 1, r = xn(e.height) / n.offsetHeight || 1;
  return t !== 1 || r !== 1;
}
function am(n, e, t) {
  t === void 0 && (t = !1);
  var r = Se(e), i = Se(e) && sm(e), o = Tt(e), s = wn(n, i, t), a = {
    scrollLeft: 0,
    scrollTop: 0
  }, l = {
    x: 0,
    y: 0
  };
  return (r || !r && !t) && ((Xe(e) !== "body" || Ro(o)) && (a = om(e)), Se(e) ? (l = wn(e, !0), l.x += e.clientLeft, l.y += e.clientTop) : o && (l.x = Po(o))), {
    x: s.left + a.scrollLeft - l.x,
    y: s.top + a.scrollTop - l.y,
    width: s.width,
    height: s.height
  };
}
function lm(n) {
  var e = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Set(), r = [];
  n.forEach(function(o) {
    e.set(o.name, o);
  });
  function i(o) {
    t.add(o.name);
    var s = [].concat(o.requires || [], o.requiresIfExists || []);
    s.forEach(function(a) {
      if (!t.has(a)) {
        var l = e.get(a);
        l && i(l);
      }
    }), r.push(o);
  }
  return n.forEach(function(o) {
    t.has(o.name) || i(o);
  }), r;
}
function cm(n) {
  var e = lm(n);
  return Qi.reduce(function(t, r) {
    return t.concat(e.filter(function(i) {
      return i.phase === r;
    }));
  }, []);
}
function um(n) {
  var e;
  return function() {
    return e || (e = new Promise(function(t) {
      Promise.resolve().then(function() {
        e = void 0, t(n());
      });
    })), e;
  };
}
function dt(n) {
  for (var e = arguments.length, t = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++)
    t[r - 1] = arguments[r];
  return [].concat(t).reduce(function(i, o) {
    return i.replace(/%s/, o);
  }, n);
}
var Pt = 'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s', dm = 'Popper: modifier "%s" requires "%s", but "%s" modifier is not available', Gs = ["name", "enabled", "phase", "fn", "effect", "requires", "options"];
function fm(n) {
  n.forEach(function(e) {
    [].concat(Object.keys(e), Gs).filter(function(t, r, i) {
      return i.indexOf(t) === r;
    }).forEach(function(t) {
      switch (t) {
        case "name":
          typeof e.name != "string" && console.error(dt(Pt, String(e.name), '"name"', '"string"', '"' + String(e.name) + '"'));
          break;
        case "enabled":
          typeof e.enabled != "boolean" && console.error(dt(Pt, e.name, '"enabled"', '"boolean"', '"' + String(e.enabled) + '"'));
          break;
        case "phase":
          Qi.indexOf(e.phase) < 0 && console.error(dt(Pt, e.name, '"phase"', "either " + Qi.join(", "), '"' + String(e.phase) + '"'));
          break;
        case "fn":
          typeof e.fn != "function" && console.error(dt(Pt, e.name, '"fn"', '"function"', '"' + String(e.fn) + '"'));
          break;
        case "effect":
          e.effect != null && typeof e.effect != "function" && console.error(dt(Pt, e.name, '"effect"', '"function"', '"' + String(e.fn) + '"'));
          break;
        case "requires":
          e.requires != null && !Array.isArray(e.requires) && console.error(dt(Pt, e.name, '"requires"', '"array"', '"' + String(e.requires) + '"'));
          break;
        case "requiresIfExists":
          Array.isArray(e.requiresIfExists) || console.error(dt(Pt, e.name, '"requiresIfExists"', '"array"', '"' + String(e.requiresIfExists) + '"'));
          break;
        case "options":
        case "data":
          break;
        default:
          console.error('PopperJS: an invalid property has been provided to the "' + e.name + '" modifier, valid properties are ' + Gs.map(function(r) {
            return '"' + r + '"';
          }).join(", ") + '; but "' + t + '" was provided.');
      }
      e.requires && e.requires.forEach(function(r) {
        n.find(function(i) {
          return i.name === r;
        }) == null && console.error(dt(dm, String(e.name), r, r));
      });
    });
  });
}
function pm(n, e) {
  var t = /* @__PURE__ */ new Set();
  return n.filter(function(r) {
    var i = e(r);
    if (!t.has(i))
      return t.add(i), !0;
  });
}
function hm(n) {
  var e = n.reduce(function(t, r) {
    var i = t[r.name];
    return t[r.name] = i ? Object.assign({}, i, r, {
      options: Object.assign({}, i.options, r.options),
      data: Object.assign({}, i.data, r.data)
    }) : r, t;
  }, {});
  return Object.keys(e).map(function(t) {
    return e[t];
  });
}
var Ys = "Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.", mm = "Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.", Xs = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function Zs() {
  for (var n = arguments.length, e = new Array(n), t = 0; t < n; t++)
    e[t] = arguments[t];
  return !e.some(function(r) {
    return !(r && typeof r.getBoundingClientRect == "function");
  });
}
function gm(n) {
  n === void 0 && (n = {});
  var e = n, t = e.defaultModifiers, r = t === void 0 ? [] : t, i = e.defaultOptions, o = i === void 0 ? Xs : i;
  return function(a, l, c) {
    c === void 0 && (c = o);
    var u = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, Xs, o),
      modifiersData: {},
      elements: {
        reference: a,
        popper: l
      },
      attributes: {},
      styles: {}
    }, d = [], f = !1, p = {
      state: u,
      setOptions: function(b) {
        var w = typeof b == "function" ? b(u.options) : b;
        m(), u.options = Object.assign({}, o, u.options, w), u.scrollParents = {
          reference: Ut(a) ? Wn(a) : a.contextElement ? Wn(a.contextElement) : [],
          popper: Wn(l)
        };
        var E = cm(hm([].concat(r, u.options.modifiers)));
        if (u.orderedModifiers = E.filter(function(F) {
          return F.enabled;
        }), process.env.NODE_ENV !== "production") {
          var g = pm([].concat(E, u.options.modifiers), function(F) {
            var H = F.name;
            return H;
          });
          if (fm(g), Be(u.options.placement) === Qr) {
            var O = u.orderedModifiers.find(function(F) {
              var H = F.name;
              return H === "flip";
            });
            O || console.error(['Popper: "auto" placements require the "flip" modifier be', "present and enabled to work."].join(" "));
          }
          var k = $e(l), A = k.marginTop, M = k.marginRight, $ = k.marginBottom, j = k.marginLeft;
          [A, M, $, j].some(function(F) {
            return parseFloat(F);
          }) && console.warn(['Popper: CSS "margin" styles cannot be used to apply padding', "between the popper and its reference element or boundary.", "To replicate margin, use the `offset` modifier, as well as", "the `padding` option in the `preventOverflow` and `flip`", "modifiers."].join(" "));
        }
        return h(), p.update();
      },
      forceUpdate: function() {
        if (!f) {
          var b = u.elements, w = b.reference, E = b.popper;
          if (!Zs(w, E)) {
            process.env.NODE_ENV !== "production" && console.error(Ys);
            return;
          }
          u.rects = {
            reference: am(w, tr(E), u.options.strategy === "fixed"),
            popper: No(E)
          }, u.reset = !1, u.placement = u.options.placement, u.orderedModifiers.forEach(function(F) {
            return u.modifiersData[F.name] = Object.assign({}, F.data);
          });
          for (var g = 0, O = 0; O < u.orderedModifiers.length; O++) {
            if (process.env.NODE_ENV !== "production" && (g += 1, g > 100)) {
              console.error(mm);
              break;
            }
            if (u.reset === !0) {
              u.reset = !1, O = -1;
              continue;
            }
            var k = u.orderedModifiers[O], A = k.fn, M = k.options, $ = M === void 0 ? {} : M, j = k.name;
            typeof A == "function" && (u = A({
              state: u,
              options: $,
              name: j,
              instance: p
            }) || u);
          }
        }
      },
      update: um(function() {
        return new Promise(function(y) {
          p.forceUpdate(), y(u);
        });
      }),
      destroy: function() {
        m(), f = !0;
      }
    };
    if (!Zs(a, l))
      return process.env.NODE_ENV !== "production" && console.error(Ys), p;
    p.setOptions(c).then(function(y) {
      !f && c.onFirstUpdate && c.onFirstUpdate(y);
    });
    function h() {
      u.orderedModifiers.forEach(function(y) {
        var b = y.name, w = y.options, E = w === void 0 ? {} : w, g = y.effect;
        if (typeof g == "function") {
          var O = g({
            state: u,
            name: b,
            instance: p,
            options: E
          }), k = function() {
          };
          d.push(O || k);
        }
      });
    }
    function m() {
      d.forEach(function(y) {
        return y();
      }), d = [];
    }
    return p;
  };
}
var ym = [Lh, em, Rh, dc, Zh, _h, rm, Nh, Gh], bm = /* @__PURE__ */ gm({
  defaultModifiers: ym
}), vm = "tippy-box", vc = "tippy-content", km = "tippy-backdrop", kc = "tippy-arrow", xc = "tippy-svg-arrow", Rt = {
  passive: !0,
  capture: !0
}, wc = function() {
  return document.body;
};
function xm(n, e) {
  return {}.hasOwnProperty.call(n, e);
}
function Ei(n, e, t) {
  if (Array.isArray(n)) {
    var r = n[e];
    return r == null ? Array.isArray(t) ? t[e] : t : r;
  }
  return n;
}
function Bo(n, e) {
  var t = {}.toString.call(n);
  return t.indexOf("[object") === 0 && t.indexOf(e + "]") > -1;
}
function Sc(n, e) {
  return typeof n == "function" ? n.apply(void 0, e) : n;
}
function Qs(n, e) {
  if (e === 0)
    return n;
  var t;
  return function(r) {
    clearTimeout(t), t = setTimeout(function() {
      n(r);
    }, e);
  };
}
function wm(n, e) {
  var t = Object.assign({}, n);
  return e.forEach(function(r) {
    delete t[r];
  }), t;
}
function Sm(n) {
  return n.split(/\s+/).filter(Boolean);
}
function an(n) {
  return [].concat(n);
}
function ea(n, e) {
  n.indexOf(e) === -1 && n.push(e);
}
function Mm(n) {
  return n.filter(function(e, t) {
    return n.indexOf(e) === t;
  });
}
function Om(n) {
  return n.split("-")[0];
}
function Hr(n) {
  return [].slice.call(n);
}
function ta(n) {
  return Object.keys(n).reduce(function(e, t) {
    return n[t] !== void 0 && (e[t] = n[t]), e;
  }, {});
}
function qn() {
  return document.createElement("div");
}
function Yn(n) {
  return ["Element", "Fragment"].some(function(e) {
    return Bo(n, e);
  });
}
function Cm(n) {
  return Bo(n, "NodeList");
}
function Tm(n) {
  return Bo(n, "MouseEvent");
}
function Em(n) {
  return !!(n && n._tippy && n._tippy.reference === n);
}
function Am(n) {
  return Yn(n) ? [n] : Cm(n) ? Hr(n) : Array.isArray(n) ? n : Hr(document.querySelectorAll(n));
}
function Ai(n, e) {
  n.forEach(function(t) {
    t && (t.style.transitionDuration = e + "ms");
  });
}
function na(n, e) {
  n.forEach(function(t) {
    t && t.setAttribute("data-state", e);
  });
}
function Nm(n) {
  var e, t = an(n), r = t[0];
  return r != null && (e = r.ownerDocument) != null && e.body ? r.ownerDocument : document;
}
function Dm(n, e) {
  var t = e.clientX, r = e.clientY;
  return n.every(function(i) {
    var o = i.popperRect, s = i.popperState, a = i.props, l = a.interactiveBorder, c = Om(s.placement), u = s.modifiersData.offset;
    if (!u)
      return !0;
    var d = c === "bottom" ? u.top.y : 0, f = c === "top" ? u.bottom.y : 0, p = c === "right" ? u.left.x : 0, h = c === "left" ? u.right.x : 0, m = o.top - r + d > l, y = r - o.bottom - f > l, b = o.left - t + p > l, w = t - o.right - h > l;
    return m || y || b || w;
  });
}
function Ni(n, e, t) {
  var r = e + "EventListener";
  ["transitionend", "webkitTransitionEnd"].forEach(function(i) {
    n[r](i, t);
  });
}
function ra(n, e) {
  for (var t = e; t; ) {
    var r;
    if (n.contains(t))
      return !0;
    t = t.getRootNode == null || (r = t.getRootNode()) == null ? void 0 : r.host;
  }
  return !1;
}
var He = {
  isTouch: !1
}, ia = 0;
function Im() {
  He.isTouch || (He.isTouch = !0, window.performance && document.addEventListener("mousemove", Mc));
}
function Mc() {
  var n = performance.now();
  n - ia < 20 && (He.isTouch = !1, document.removeEventListener("mousemove", Mc)), ia = n;
}
function Pm() {
  var n = document.activeElement;
  if (Em(n)) {
    var e = n._tippy;
    n.blur && !e.state.isVisible && n.blur();
  }
}
function Rm() {
  document.addEventListener("touchstart", Im, Rt), window.addEventListener("blur", Pm);
}
var Bm = typeof window < "u" && typeof document < "u", Lm = Bm ? !!window.msCrypto : !1;
function nn(n) {
  var e = n === "destroy" ? "n already-" : " ";
  return [n + "() was called on a" + e + "destroyed instance. This is a no-op but", "indicates a potential memory leak."].join(" ");
}
function oa(n) {
  var e = /[ \t]{2,}/g, t = /^[ \t]*/gm;
  return n.replace(e, " ").replace(t, "").trim();
}
function $m(n) {
  return oa(`
  %ctippy.js

  %c` + oa(n) + `

  %c\u{1F477}\u200D This is a development-only message. It will be removed in production.
  `);
}
function Oc(n) {
  return [
    $m(n),
    "color: #00C584; font-size: 1.3em; font-weight: bold;",
    "line-height: 1.5",
    "color: #a6a095;"
  ];
}
var Xn;
process.env.NODE_ENV !== "production" && Fm();
function Fm() {
  Xn = /* @__PURE__ */ new Set();
}
function it(n, e) {
  if (n && !Xn.has(e)) {
    var t;
    Xn.add(e), (t = console).warn.apply(t, Oc(e));
  }
}
function no(n, e) {
  if (n && !Xn.has(e)) {
    var t;
    Xn.add(e), (t = console).error.apply(t, Oc(e));
  }
}
function zm(n) {
  var e = !n, t = Object.prototype.toString.call(n) === "[object Object]" && !n.addEventListener;
  no(e, ["tippy() was passed", "`" + String(n) + "`", "as its targets (first) argument. Valid types are: String, Element,", "Element[], or NodeList."].join(" ")), no(t, ["tippy() was passed a plain object which is not supported as an argument", "for virtual positioning. Use props.getReferenceClientRect instead."].join(" "));
}
var Cc = {
  animateFill: !1,
  followCursor: !1,
  inlinePositioning: !1,
  sticky: !1
}, Vm = {
  allowHTML: !1,
  animation: "fade",
  arrow: !0,
  content: "",
  inertia: !1,
  maxWidth: 350,
  role: "tooltip",
  theme: "",
  zIndex: 9999
}, we = Object.assign({
  appendTo: wc,
  aria: {
    content: "auto",
    expanded: "auto"
  },
  delay: 0,
  duration: [300, 250],
  getReferenceClientRect: null,
  hideOnClick: !0,
  ignoreAttributes: !1,
  interactive: !1,
  interactiveBorder: 2,
  interactiveDebounce: 0,
  moveTransition: "",
  offset: [0, 10],
  onAfterUpdate: function() {
  },
  onBeforeUpdate: function() {
  },
  onCreate: function() {
  },
  onDestroy: function() {
  },
  onHidden: function() {
  },
  onHide: function() {
  },
  onMount: function() {
  },
  onShow: function() {
  },
  onShown: function() {
  },
  onTrigger: function() {
  },
  onUntrigger: function() {
  },
  onClickOutside: function() {
  },
  placement: "top",
  plugins: [],
  popperOptions: {},
  render: null,
  showOnCreate: !1,
  touch: !0,
  trigger: "mouseenter focus",
  triggerTarget: null
}, Cc, Vm), jm = Object.keys(we), Hm = function(e) {
  process.env.NODE_ENV !== "production" && Ec(e, []);
  var t = Object.keys(e);
  t.forEach(function(r) {
    we[r] = e[r];
  });
};
function Tc(n) {
  var e = n.plugins || [], t = e.reduce(function(r, i) {
    var o = i.name, s = i.defaultValue;
    if (o) {
      var a;
      r[o] = n[o] !== void 0 ? n[o] : (a = we[o]) != null ? a : s;
    }
    return r;
  }, {});
  return Object.assign({}, n, t);
}
function Wm(n, e) {
  var t = e ? Object.keys(Tc(Object.assign({}, we, {
    plugins: e
  }))) : jm, r = t.reduce(function(i, o) {
    var s = (n.getAttribute("data-tippy-" + o) || "").trim();
    if (!s)
      return i;
    if (o === "content")
      i[o] = s;
    else
      try {
        i[o] = JSON.parse(s);
      } catch {
        i[o] = s;
      }
    return i;
  }, {});
  return r;
}
function sa(n, e) {
  var t = Object.assign({}, e, {
    content: Sc(e.content, [n])
  }, e.ignoreAttributes ? {} : Wm(n, e.plugins));
  return t.aria = Object.assign({}, we.aria, t.aria), t.aria = {
    expanded: t.aria.expanded === "auto" ? e.interactive : t.aria.expanded,
    content: t.aria.content === "auto" ? e.interactive ? null : "describedby" : t.aria.content
  }, t;
}
function Ec(n, e) {
  n === void 0 && (n = {}), e === void 0 && (e = []);
  var t = Object.keys(n);
  t.forEach(function(r) {
    var i = wm(we, Object.keys(Cc)), o = !xm(i, r);
    o && (o = e.filter(function(s) {
      return s.name === r;
    }).length === 0), it(o, ["`" + r + "`", "is not a valid prop. You may have spelled it incorrectly, or if it's", "a plugin, forgot to pass it in an array as props.plugins.", `

`, `All props: https://atomiks.github.io/tippyjs/v6/all-props/
`, "Plugins: https://atomiks.github.io/tippyjs/v6/plugins/"].join(" "));
  });
}
var qm = function() {
  return "innerHTML";
};
function ro(n, e) {
  n[qm()] = e;
}
function aa(n) {
  var e = qn();
  return n === !0 ? e.className = kc : (e.className = xc, Yn(n) ? e.appendChild(n) : ro(e, n)), e;
}
function la(n, e) {
  Yn(e.content) ? (ro(n, ""), n.appendChild(e.content)) : typeof e.content != "function" && (e.allowHTML ? ro(n, e.content) : n.textContent = e.content);
}
function io(n) {
  var e = n.firstElementChild, t = Hr(e.children);
  return {
    box: e,
    content: t.find(function(r) {
      return r.classList.contains(vc);
    }),
    arrow: t.find(function(r) {
      return r.classList.contains(kc) || r.classList.contains(xc);
    }),
    backdrop: t.find(function(r) {
      return r.classList.contains(km);
    })
  };
}
function Ac(n) {
  var e = qn(), t = qn();
  t.className = vm, t.setAttribute("data-state", "hidden"), t.setAttribute("tabindex", "-1");
  var r = qn();
  r.className = vc, r.setAttribute("data-state", "hidden"), la(r, n.props), e.appendChild(t), t.appendChild(r), i(n.props, n.props);
  function i(o, s) {
    var a = io(e), l = a.box, c = a.content, u = a.arrow;
    s.theme ? l.setAttribute("data-theme", s.theme) : l.removeAttribute("data-theme"), typeof s.animation == "string" ? l.setAttribute("data-animation", s.animation) : l.removeAttribute("data-animation"), s.inertia ? l.setAttribute("data-inertia", "") : l.removeAttribute("data-inertia"), l.style.maxWidth = typeof s.maxWidth == "number" ? s.maxWidth + "px" : s.maxWidth, s.role ? l.setAttribute("role", s.role) : l.removeAttribute("role"), (o.content !== s.content || o.allowHTML !== s.allowHTML) && la(c, n.props), s.arrow ? u ? o.arrow !== s.arrow && (l.removeChild(u), l.appendChild(aa(s.arrow))) : l.appendChild(aa(s.arrow)) : u && l.removeChild(u);
  }
  return {
    popper: e,
    onUpdate: i
  };
}
Ac.$$tippy = !0;
var Km = 1, yr = [], Di = [];
function Jm(n, e) {
  var t = sa(n, Object.assign({}, we, Tc(ta(e)))), r, i, o, s = !1, a = !1, l = !1, c = !1, u, d, f, p = [], h = Qs(rr, t.interactiveDebounce), m, y = Km++, b = null, w = Mm(t.plugins), E = {
    isEnabled: !0,
    isVisible: !1,
    isDestroyed: !1,
    isMounted: !1,
    isShown: !1
  }, g = {
    id: y,
    reference: n,
    popper: qn(),
    popperInstance: b,
    props: t,
    state: E,
    plugins: w,
    clearDelayTimeouts: lr,
    setProps: cr,
    setContent: ur,
    show: Xc,
    hide: Zc,
    hideWithInteractivity: Qc,
    enable: Dn,
    disable: ar,
    unmount: eu,
    destroy: tu
  };
  if (!t.render)
    return process.env.NODE_ENV !== "production" && no(!0, "render() function has not been supplied."), g;
  var O = t.render(g), k = O.popper, A = O.onUpdate;
  k.setAttribute("data-tippy-root", ""), k.id = "tippy-" + g.id, g.popper = k, n._tippy = g, k._tippy = g;
  var M = w.map(function(v) {
    return v.fn(g);
  }), $ = n.hasAttribute("aria-expanded");
  return Zt(), ze(), re(), X("onCreate", [g]), t.showOnCreate && Nn(), k.addEventListener("mouseenter", function() {
    g.props.interactive && g.state.isVisible && g.clearDelayTimeouts();
  }), k.addEventListener("mouseleave", function() {
    g.props.interactive && g.props.trigger.indexOf("mouseenter") >= 0 && ve().addEventListener("mousemove", h);
  }), g;
  function j() {
    var v = g.props.touch;
    return Array.isArray(v) ? v : [v, 0];
  }
  function F() {
    return j()[0] === "hold";
  }
  function H() {
    var v;
    return !!((v = g.props.render) != null && v.$$tippy);
  }
  function W() {
    return m || n;
  }
  function ve() {
    var v = W().parentNode;
    return v ? Nm(v) : document;
  }
  function ke() {
    return io(k);
  }
  function ne(v) {
    return g.state.isMounted && !g.state.isVisible || He.isTouch || u && u.type === "focus" ? 0 : Ei(g.props.delay, v ? 0 : 1, we.delay);
  }
  function re(v) {
    v === void 0 && (v = !1), k.style.pointerEvents = g.props.interactive && !v ? "" : "none", k.style.zIndex = "" + g.props.zIndex;
  }
  function X(v, T, I) {
    if (I === void 0 && (I = !0), M.forEach(function(L) {
      L[v] && L[v].apply(L, T);
    }), I) {
      var V;
      (V = g.props)[v].apply(V, T);
    }
  }
  function Fe() {
    var v = g.props.aria;
    if (!!v.content) {
      var T = "aria-" + v.content, I = k.id, V = an(g.props.triggerTarget || n);
      V.forEach(function(L) {
        var se = L.getAttribute(T);
        if (g.state.isVisible)
          L.setAttribute(T, se ? se + " " + I : I);
        else {
          var Me = se && se.replace(I, "").trim();
          Me ? L.setAttribute(T, Me) : L.removeAttribute(T);
        }
      });
    }
  }
  function ze() {
    if (!($ || !g.props.aria.expanded)) {
      var v = an(g.props.triggerTarget || n);
      v.forEach(function(T) {
        g.props.interactive ? T.setAttribute("aria-expanded", g.state.isVisible && T === W() ? "true" : "false") : T.removeAttribute("aria-expanded");
      });
    }
  }
  function At() {
    ve().removeEventListener("mousemove", h), yr = yr.filter(function(v) {
      return v !== h;
    });
  }
  function Ve(v) {
    if (!(He.isTouch && (l || v.type === "mousedown"))) {
      var T = v.composedPath && v.composedPath()[0] || v.target;
      if (!(g.props.interactive && ra(k, T))) {
        if (an(g.props.triggerTarget || n).some(function(I) {
          return ra(I, T);
        })) {
          if (He.isTouch || g.state.isVisible && g.props.trigger.indexOf("click") >= 0)
            return;
        } else
          X("onClickOutside", [g, v]);
        g.props.hideOnClick === !0 && (g.clearDelayTimeouts(), g.hide(), a = !0, setTimeout(function() {
          a = !1;
        }), g.state.isMounted || et());
      }
    }
  }
  function Nt() {
    l = !0;
  }
  function Qe() {
    l = !1;
  }
  function De() {
    var v = ve();
    v.addEventListener("mousedown", Ve, !0), v.addEventListener("touchend", Ve, Rt), v.addEventListener("touchstart", Qe, Rt), v.addEventListener("touchmove", Nt, Rt);
  }
  function et() {
    var v = ve();
    v.removeEventListener("mousedown", Ve, !0), v.removeEventListener("touchend", Ve, Rt), v.removeEventListener("touchstart", Qe, Rt), v.removeEventListener("touchmove", Nt, Rt);
  }
  function Yt(v, T) {
    Xt(v, function() {
      !g.state.isVisible && k.parentNode && k.parentNode.contains(k) && T();
    });
  }
  function tt(v, T) {
    Xt(v, T);
  }
  function Xt(v, T) {
    var I = ke().box;
    function V(L) {
      L.target === I && (Ni(I, "remove", V), T());
    }
    if (v === 0)
      return T();
    Ni(I, "remove", d), Ni(I, "add", V), d = V;
  }
  function lt(v, T, I) {
    I === void 0 && (I = !1);
    var V = an(g.props.triggerTarget || n);
    V.forEach(function(L) {
      L.addEventListener(v, T, I), p.push({
        node: L,
        eventType: v,
        handler: T,
        options: I
      });
    });
  }
  function Zt() {
    F() && (lt("touchstart", Tn, {
      passive: !0
    }), lt("touchend", ir, {
      passive: !0
    })), Sm(g.props.trigger).forEach(function(v) {
      if (v !== "manual")
        switch (lt(v, Tn), v) {
          case "mouseenter":
            lt("mouseleave", ir);
            break;
          case "focus":
            lt(Lm ? "focusout" : "blur", En);
            break;
          case "focusin":
            lt("focusout", En);
            break;
        }
    });
  }
  function nr() {
    p.forEach(function(v) {
      var T = v.node, I = v.eventType, V = v.handler, L = v.options;
      T.removeEventListener(I, V, L);
    }), p = [];
  }
  function Tn(v) {
    var T, I = !1;
    if (!(!g.state.isEnabled || An(v) || a)) {
      var V = ((T = u) == null ? void 0 : T.type) === "focus";
      u = v, m = v.currentTarget, ze(), !g.state.isVisible && Tm(v) && yr.forEach(function(L) {
        return L(v);
      }), v.type === "click" && (g.props.trigger.indexOf("mouseenter") < 0 || s) && g.props.hideOnClick !== !1 && g.state.isVisible ? I = !0 : Nn(v), v.type === "click" && (s = !I), I && !V && Dt(v);
    }
  }
  function rr(v) {
    var T = v.target, I = W().contains(T) || k.contains(T);
    if (!(v.type === "mousemove" && I)) {
      var V = ct().concat(k).map(function(L) {
        var se, Me = L._tippy, Qt = (se = Me.popperInstance) == null ? void 0 : se.state;
        return Qt ? {
          popperRect: L.getBoundingClientRect(),
          popperState: Qt,
          props: t
        } : null;
      }).filter(Boolean);
      Dm(V, v) && (At(), Dt(v));
    }
  }
  function ir(v) {
    var T = An(v) || g.props.trigger.indexOf("click") >= 0 && s;
    if (!T) {
      if (g.props.interactive) {
        g.hideWithInteractivity(v);
        return;
      }
      Dt(v);
    }
  }
  function En(v) {
    g.props.trigger.indexOf("focusin") < 0 && v.target !== W() || g.props.interactive && v.relatedTarget && k.contains(v.relatedTarget) || Dt(v);
  }
  function An(v) {
    return He.isTouch ? F() !== v.type.indexOf("touch") >= 0 : !1;
  }
  function or() {
    sr();
    var v = g.props, T = v.popperOptions, I = v.placement, V = v.offset, L = v.getReferenceClientRect, se = v.moveTransition, Me = H() ? io(k).arrow : null, Qt = L ? {
      getBoundingClientRect: L,
      contextElement: L.contextElement || W()
    } : n, Ho = {
      name: "$$tippy",
      enabled: !0,
      phase: "beforeWrite",
      requires: ["computeStyles"],
      fn: function(dr) {
        var en = dr.state;
        if (H()) {
          var nu = ke(), li = nu.box;
          ["placement", "reference-hidden", "escaped"].forEach(function(fr) {
            fr === "placement" ? li.setAttribute("data-placement", en.placement) : en.attributes.popper["data-popper-" + fr] ? li.setAttribute("data-" + fr, "") : li.removeAttribute("data-" + fr);
          }), en.attributes.popper = {};
        }
      }
    }, It = [{
      name: "offset",
      options: {
        offset: V
      }
    }, {
      name: "preventOverflow",
      options: {
        padding: {
          top: 2,
          bottom: 2,
          left: 5,
          right: 5
        }
      }
    }, {
      name: "flip",
      options: {
        padding: 5
      }
    }, {
      name: "computeStyles",
      options: {
        adaptive: !se
      }
    }, Ho];
    H() && Me && It.push({
      name: "arrow",
      options: {
        element: Me,
        padding: 3
      }
    }), It.push.apply(It, (T == null ? void 0 : T.modifiers) || []), g.popperInstance = bm(Qt, k, Object.assign({}, T, {
      placement: I,
      onFirstUpdate: f,
      modifiers: It
    }));
  }
  function sr() {
    g.popperInstance && (g.popperInstance.destroy(), g.popperInstance = null);
  }
  function nt() {
    var v = g.props.appendTo, T, I = W();
    g.props.interactive && v === wc || v === "parent" ? T = I.parentNode : T = Sc(v, [I]), T.contains(k) || T.appendChild(k), g.state.isMounted = !0, or(), process.env.NODE_ENV !== "production" && it(g.props.interactive && v === we.appendTo && I.nextElementSibling !== k, ["Interactive tippy element may not be accessible via keyboard", "navigation because it is not directly after the reference element", "in the DOM source order.", `

`, "Using a wrapper <div> or <span> tag around the reference element", "solves this by creating a new parentNode context.", `

`, "Specifying `appendTo: document.body` silences this warning, but it", "assumes you are using a focus management solution to handle", "keyboard navigation.", `

`, "See: https://atomiks.github.io/tippyjs/v6/accessibility/#interactivity"].join(" "));
  }
  function ct() {
    return Hr(k.querySelectorAll("[data-tippy-root]"));
  }
  function Nn(v) {
    g.clearDelayTimeouts(), v && X("onTrigger", [g, v]), De();
    var T = ne(!0), I = j(), V = I[0], L = I[1];
    He.isTouch && V === "hold" && L && (T = L), T ? r = setTimeout(function() {
      g.show();
    }, T) : g.show();
  }
  function Dt(v) {
    if (g.clearDelayTimeouts(), X("onUntrigger", [g, v]), !g.state.isVisible) {
      et();
      return;
    }
    if (!(g.props.trigger.indexOf("mouseenter") >= 0 && g.props.trigger.indexOf("click") >= 0 && ["mouseleave", "mousemove"].indexOf(v.type) >= 0 && s)) {
      var T = ne(!1);
      T ? i = setTimeout(function() {
        g.state.isVisible && g.hide();
      }, T) : o = requestAnimationFrame(function() {
        g.hide();
      });
    }
  }
  function Dn() {
    g.state.isEnabled = !0;
  }
  function ar() {
    g.hide(), g.state.isEnabled = !1;
  }
  function lr() {
    clearTimeout(r), clearTimeout(i), cancelAnimationFrame(o);
  }
  function cr(v) {
    if (process.env.NODE_ENV !== "production" && it(g.state.isDestroyed, nn("setProps")), !g.state.isDestroyed) {
      X("onBeforeUpdate", [g, v]), nr();
      var T = g.props, I = sa(n, Object.assign({}, T, ta(v), {
        ignoreAttributes: !0
      }));
      g.props = I, Zt(), T.interactiveDebounce !== I.interactiveDebounce && (At(), h = Qs(rr, I.interactiveDebounce)), T.triggerTarget && !I.triggerTarget ? an(T.triggerTarget).forEach(function(V) {
        V.removeAttribute("aria-expanded");
      }) : I.triggerTarget && n.removeAttribute("aria-expanded"), ze(), re(), A && A(T, I), g.popperInstance && (or(), ct().forEach(function(V) {
        requestAnimationFrame(V._tippy.popperInstance.forceUpdate);
      })), X("onAfterUpdate", [g, v]);
    }
  }
  function ur(v) {
    g.setProps({
      content: v
    });
  }
  function Xc() {
    process.env.NODE_ENV !== "production" && it(g.state.isDestroyed, nn("show"));
    var v = g.state.isVisible, T = g.state.isDestroyed, I = !g.state.isEnabled, V = He.isTouch && !g.props.touch, L = Ei(g.props.duration, 0, we.duration);
    if (!(v || T || I || V) && !W().hasAttribute("disabled") && (X("onShow", [g], !1), g.props.onShow(g) !== !1)) {
      if (g.state.isVisible = !0, H() && (k.style.visibility = "visible"), re(), De(), g.state.isMounted || (k.style.transition = "none"), H()) {
        var se = ke(), Me = se.box, Qt = se.content;
        Ai([Me, Qt], 0);
      }
      f = function() {
        var It;
        if (!(!g.state.isVisible || c)) {
          if (c = !0, k.offsetHeight, k.style.transition = g.props.moveTransition, H() && g.props.animation) {
            var ai = ke(), dr = ai.box, en = ai.content;
            Ai([dr, en], L), na([dr, en], "visible");
          }
          Fe(), ze(), ea(Di, g), (It = g.popperInstance) == null || It.forceUpdate(), X("onMount", [g]), g.props.animation && H() && tt(L, function() {
            g.state.isShown = !0, X("onShown", [g]);
          });
        }
      }, nt();
    }
  }
  function Zc() {
    process.env.NODE_ENV !== "production" && it(g.state.isDestroyed, nn("hide"));
    var v = !g.state.isVisible, T = g.state.isDestroyed, I = !g.state.isEnabled, V = Ei(g.props.duration, 1, we.duration);
    if (!(v || T || I) && (X("onHide", [g], !1), g.props.onHide(g) !== !1)) {
      if (g.state.isVisible = !1, g.state.isShown = !1, c = !1, s = !1, H() && (k.style.visibility = "hidden"), At(), et(), re(!0), H()) {
        var L = ke(), se = L.box, Me = L.content;
        g.props.animation && (Ai([se, Me], V), na([se, Me], "hidden"));
      }
      Fe(), ze(), g.props.animation ? H() && Yt(V, g.unmount) : g.unmount();
    }
  }
  function Qc(v) {
    process.env.NODE_ENV !== "production" && it(g.state.isDestroyed, nn("hideWithInteractivity")), ve().addEventListener("mousemove", h), ea(yr, h), h(v);
  }
  function eu() {
    process.env.NODE_ENV !== "production" && it(g.state.isDestroyed, nn("unmount")), g.state.isVisible && g.hide(), g.state.isMounted && (sr(), ct().forEach(function(v) {
      v._tippy.unmount();
    }), k.parentNode && k.parentNode.removeChild(k), Di = Di.filter(function(v) {
      return v !== g;
    }), g.state.isMounted = !1, X("onHidden", [g]));
  }
  function tu() {
    process.env.NODE_ENV !== "production" && it(g.state.isDestroyed, nn("destroy")), !g.state.isDestroyed && (g.clearDelayTimeouts(), g.unmount(), nr(), delete n._tippy, g.state.isDestroyed = !0, X("onDestroy", [g]));
  }
}
function Cn(n, e) {
  e === void 0 && (e = {});
  var t = we.plugins.concat(e.plugins || []);
  process.env.NODE_ENV !== "production" && (zm(n), Ec(e, t)), Rm();
  var r = Object.assign({}, e, {
    plugins: t
  }), i = Am(n);
  if (process.env.NODE_ENV !== "production") {
    var o = Yn(r.content), s = i.length > 1;
    it(o && s, ["tippy() was passed an Element as the `content` prop, but more than", "one tippy instance was created by this invocation. This means the", "content element will only be appended to the last tippy instance.", `

`, "Instead, pass the .innerHTML of the element, or use a function that", "returns a cloned version of the element instead.", `

`, `1) content: element.innerHTML
`, "2) content: () => element.cloneNode(true)"].join(" "));
  }
  var a = i.reduce(function(l, c) {
    var u = c && Jm(c, r);
    return u && l.push(u), l;
  }, []);
  return Yn(n) ? a[0] : a;
}
Cn.defaultProps = we;
Cn.setDefaultProps = Hm;
Cn.currentInput = He;
Object.assign({}, dc, {
  effect: function(e) {
    var t = e.state, r = {
      popper: {
        position: t.options.strategy,
        left: "0",
        top: "0",
        margin: "0"
      },
      arrow: {
        position: "absolute"
      },
      reference: {}
    };
    Object.assign(t.elements.popper.style, r.popper), t.styles = r, t.elements.arrow && Object.assign(t.elements.arrow.style, r.arrow);
  }
});
Cn.setDefaultProps({
  render: Ac
});
var br = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function _m(n) {
  var e = typeof n;
  return n != null && (e == "object" || e == "function");
}
var Nc = _m, Um = typeof br == "object" && br && br.Object === Object && br, Gm = Um, Ym = Gm, Xm = typeof self == "object" && self && self.Object === Object && self, Zm = Ym || Xm || Function("return this")(), Dc = Zm, Qm = Dc, eg = function() {
  return Qm.Date.now();
}, tg = eg, ng = /\s/;
function rg(n) {
  for (var e = n.length; e-- && ng.test(n.charAt(e)); )
    ;
  return e;
}
var ig = rg, og = ig, sg = /^\s+/;
function ag(n) {
  return n && n.slice(0, og(n) + 1).replace(sg, "");
}
var lg = ag, cg = Dc, ug = cg.Symbol, Ic = ug, ca = Ic, Pc = Object.prototype, dg = Pc.hasOwnProperty, fg = Pc.toString, Rn = ca ? ca.toStringTag : void 0;
function pg(n) {
  var e = dg.call(n, Rn), t = n[Rn];
  try {
    n[Rn] = void 0;
    var r = !0;
  } catch {
  }
  var i = fg.call(n);
  return r && (e ? n[Rn] = t : delete n[Rn]), i;
}
var hg = pg, mg = Object.prototype, gg = mg.toString;
function yg(n) {
  return gg.call(n);
}
var bg = yg, ua = Ic, vg = hg, kg = bg, xg = "[object Null]", wg = "[object Undefined]", da = ua ? ua.toStringTag : void 0;
function Sg(n) {
  return n == null ? n === void 0 ? wg : xg : da && da in Object(n) ? vg(n) : kg(n);
}
var Mg = Sg;
function Og(n) {
  return n != null && typeof n == "object";
}
var Cg = Og, Tg = Mg, Eg = Cg, Ag = "[object Symbol]";
function Ng(n) {
  return typeof n == "symbol" || Eg(n) && Tg(n) == Ag;
}
var Dg = Ng, Ig = lg, fa = Nc, Pg = Dg, pa = 0 / 0, Rg = /^[-+]0x[0-9a-f]+$/i, Bg = /^0b[01]+$/i, Lg = /^0o[0-7]+$/i, $g = parseInt;
function Fg(n) {
  if (typeof n == "number")
    return n;
  if (Pg(n))
    return pa;
  if (fa(n)) {
    var e = typeof n.valueOf == "function" ? n.valueOf() : n;
    n = fa(e) ? e + "" : e;
  }
  if (typeof n != "string")
    return n === 0 ? n : +n;
  n = Ig(n);
  var t = Bg.test(n);
  return t || Lg.test(n) ? $g(n.slice(2), t ? 2 : 8) : Rg.test(n) ? pa : +n;
}
var zg = Fg, Vg = Nc, Ii = tg, ha = zg, jg = "Expected a function", Hg = Math.max, Wg = Math.min;
function qg(n, e, t) {
  var r, i, o, s, a, l, c = 0, u = !1, d = !1, f = !0;
  if (typeof n != "function")
    throw new TypeError(jg);
  e = ha(e) || 0, Vg(t) && (u = !!t.leading, d = "maxWait" in t, o = d ? Hg(ha(t.maxWait) || 0, e) : o, f = "trailing" in t ? !!t.trailing : f);
  function p(k) {
    var A = r, M = i;
    return r = i = void 0, c = k, s = n.apply(M, A), s;
  }
  function h(k) {
    return c = k, a = setTimeout(b, e), u ? p(k) : s;
  }
  function m(k) {
    var A = k - l, M = k - c, $ = e - A;
    return d ? Wg($, o - M) : $;
  }
  function y(k) {
    var A = k - l, M = k - c;
    return l === void 0 || A >= e || A < 0 || d && M >= o;
  }
  function b() {
    var k = Ii();
    if (y(k))
      return w(k);
    a = setTimeout(b, m(k));
  }
  function w(k) {
    return a = void 0, f && r ? p(k) : (r = i = void 0, s);
  }
  function E() {
    a !== void 0 && clearTimeout(a), c = 0, r = l = i = a = void 0;
  }
  function g() {
    return a === void 0 ? s : w(Ii());
  }
  function O() {
    var k = Ii(), A = y(k);
    if (r = arguments, i = this, l = k, A) {
      if (a === void 0)
        return h(l);
      if (d)
        return clearTimeout(a), a = setTimeout(b, e), p(l);
    }
    return a === void 0 && (a = setTimeout(b, e)), s;
  }
  return O.cancel = E, O.flush = g, O;
}
var Kg = qg;
class Jg {
  constructor({ editor: e, element: t, view: r, tippyOptions: i = {}, updateDelay: o = 250, shouldShow: s }) {
    this.preventHide = !1, this.shouldShow = ({ view: a, state: l, from: c, to: u }) => {
      const { doc: d, selection: f } = l, { empty: p } = f, h = !d.textBetween(c, u).length && Oo(l.selection), m = this.element.contains(document.activeElement);
      return !(!(a.hasFocus() || m) || p || h || !this.editor.isEditable);
    }, this.mousedownHandler = () => {
      this.preventHide = !0;
    }, this.dragstartHandler = () => {
      this.hide();
    }, this.focusHandler = () => {
      setTimeout(() => this.update(this.editor.view));
    }, this.blurHandler = ({ event: a }) => {
      var l;
      if (this.preventHide) {
        this.preventHide = !1;
        return;
      }
      (a == null ? void 0 : a.relatedTarget) && ((l = this.element.parentNode) === null || l === void 0 ? void 0 : l.contains(a.relatedTarget)) || this.hide();
    }, this.tippyBlurHandler = (a) => {
      this.blurHandler({ event: a });
    }, this.updateHandler = (a, l) => {
      var c, u, d;
      const { state: f, composing: p } = a, { doc: h, selection: m } = f, y = l && l.doc.eq(h) && l.selection.eq(m);
      if (p || y)
        return;
      this.createTooltip();
      const { ranges: b } = m, w = Math.min(...b.map((O) => O.$from.pos)), E = Math.max(...b.map((O) => O.$to.pos));
      if (!((c = this.shouldShow) === null || c === void 0 ? void 0 : c.call(this, {
        editor: this.editor,
        view: a,
        state: f,
        oldState: l,
        from: w,
        to: E
      }))) {
        this.hide();
        return;
      }
      (u = this.tippy) === null || u === void 0 || u.setProps({
        getReferenceClientRect: ((d = this.tippyOptions) === null || d === void 0 ? void 0 : d.getReferenceClientRect) || (() => {
          if (Wp(f.selection)) {
            const O = a.nodeDOM(w);
            if (O)
              return O.getBoundingClientRect();
          }
          return qp(a, w, E);
        })
      }), this.show();
    }, this.editor = e, this.element = t, this.view = r, this.updateDelay = o, s && (this.shouldShow = s), this.element.addEventListener("mousedown", this.mousedownHandler, { capture: !0 }), this.view.dom.addEventListener("dragstart", this.dragstartHandler), this.editor.on("focus", this.focusHandler), this.editor.on("blur", this.blurHandler), this.tippyOptions = i, this.element.remove(), this.element.style.visibility = "visible";
  }
  createTooltip() {
    const { element: e } = this.editor.options, t = !!e.parentElement;
    this.tippy || !t || (this.tippy = Cn(e, {
      duration: 0,
      getReferenceClientRect: null,
      content: this.element,
      interactive: !0,
      trigger: "manual",
      placement: "top",
      hideOnClick: "toggle",
      ...this.tippyOptions
    }), this.tippy.popper.firstChild && this.tippy.popper.firstChild.addEventListener("blur", this.tippyBlurHandler));
  }
  update(e, t) {
    const { state: r } = e, i = r.selection.$from.pos !== r.selection.$to.pos;
    this.updateDelay > 0 && i ? Kg(this.updateHandler, this.updateDelay)(e, t) : this.updateHandler(e, t);
  }
  show() {
    var e;
    (e = this.tippy) === null || e === void 0 || e.show();
  }
  hide() {
    var e;
    (e = this.tippy) === null || e === void 0 || e.hide();
  }
  destroy() {
    var e, t;
    !((e = this.tippy) === null || e === void 0) && e.popper.firstChild && this.tippy.popper.firstChild.removeEventListener("blur", this.tippyBlurHandler), (t = this.tippy) === null || t === void 0 || t.destroy(), this.element.removeEventListener("mousedown", this.mousedownHandler, { capture: !0 }), this.view.dom.removeEventListener("dragstart", this.dragstartHandler), this.editor.off("focus", this.focusHandler), this.editor.off("blur", this.blurHandler);
  }
}
const Rc = (n) => new U({
  key: typeof n.pluginKey == "string" ? new de(n.pluginKey) : n.pluginKey,
  view: (e) => new Jg({ view: e, ...n })
});
Ye.create({
  name: "bubbleMenu",
  addOptions() {
    return {
      element: null,
      tippyOptions: {},
      pluginKey: "bubbleMenu",
      updateDelay: void 0,
      shouldShow: null
    };
  },
  addProseMirrorPlugins() {
    return this.options.element ? [
      Rc({
        pluginKey: this.options.pluginKey,
        editor: this.editor,
        element: this.options.element,
        tippyOptions: this.options.tippyOptions,
        updateDelay: this.options.updateDelay,
        shouldShow: this.options.shouldShow
      })
    ] : [];
  }
});
function ti(n) {
  const { state: e, transaction: t } = n;
  let { selection: r } = t, { doc: i } = t, { storedMarks: o } = t;
  return {
    ...e,
    apply: e.apply.bind(e),
    applyTransaction: e.applyTransaction.bind(e),
    filterTransaction: e.filterTransaction,
    plugins: e.plugins,
    schema: e.schema,
    reconfigure: e.reconfigure.bind(e),
    toJSON: e.toJSON.bind(e),
    get storedMarks() {
      return o;
    },
    get selection() {
      return r;
    },
    get doc() {
      return i;
    },
    get tr() {
      return r = t.selection, i = t.doc, o = t.storedMarks, t;
    }
  };
}
class ni {
  constructor(e) {
    this.editor = e.editor, this.rawCommands = this.editor.extensionManager.commands, this.customState = e.state;
  }
  get hasCustomState() {
    return !!this.customState;
  }
  get state() {
    return this.customState || this.editor.state;
  }
  get commands() {
    const { rawCommands: e, editor: t, state: r } = this, { view: i } = t, { tr: o } = r, s = this.buildProps(o);
    return Object.fromEntries(Object.entries(e).map(([a, l]) => [a, (...u) => {
      const d = l(...u)(s);
      return !o.getMeta("preventDispatch") && !this.hasCustomState && i.dispatch(o), d;
    }]));
  }
  get chain() {
    return () => this.createChain();
  }
  get can() {
    return () => this.createCan();
  }
  createChain(e, t = !0) {
    const { rawCommands: r, editor: i, state: o } = this, { view: s } = i, a = [], l = !!e, c = e || o.tr, u = () => (!l && t && !c.getMeta("preventDispatch") && !this.hasCustomState && s.dispatch(c), a.every((f) => f === !0)), d = {
      ...Object.fromEntries(Object.entries(r).map(([f, p]) => [f, (...m) => {
        const y = this.buildProps(c, t), b = p(...m)(y);
        return a.push(b), d;
      }])),
      run: u
    };
    return d;
  }
  createCan(e) {
    const { rawCommands: t, state: r } = this, i = !1, o = e || r.tr, s = this.buildProps(o, i);
    return {
      ...Object.fromEntries(Object.entries(t).map(([l, c]) => [l, (...u) => c(...u)({ ...s, dispatch: void 0 })])),
      chain: () => this.createChain(o, i)
    };
  }
  buildProps(e, t = !0) {
    const { rawCommands: r, editor: i, state: o } = this, { view: s } = i;
    o.storedMarks && e.setStoredMarks(o.storedMarks);
    const a = {
      tr: e,
      editor: i,
      view: s,
      state: ti({
        state: o,
        transaction: e
      }),
      dispatch: t ? () => {
      } : void 0,
      chain: () => this.createChain(e),
      can: () => this.createCan(e),
      get commands() {
        return Object.fromEntries(Object.entries(r).map(([l, c]) => [l, (...u) => c(...u)(a)]));
      }
    };
    return a;
  }
}
class _g {
  constructor() {
    this.callbacks = {};
  }
  on(e, t) {
    return this.callbacks[e] || (this.callbacks[e] = []), this.callbacks[e].push(t), this;
  }
  emit(e, ...t) {
    const r = this.callbacks[e];
    return r && r.forEach((i) => i.apply(this, t)), this;
  }
  off(e, t) {
    const r = this.callbacks[e];
    return r && (t ? this.callbacks[e] = r.filter((i) => i !== t) : delete this.callbacks[e]), this;
  }
  removeAllListeners() {
    this.callbacks = {};
  }
}
function C(n, e, t) {
  return n.config[e] === void 0 && n.parent ? C(n.parent, e, t) : typeof n.config[e] == "function" ? n.config[e].bind({
    ...t,
    parent: n.parent ? C(n.parent, e, t) : null
  }) : n.config[e];
}
function ri(n) {
  const e = n.filter((i) => i.type === "extension"), t = n.filter((i) => i.type === "node"), r = n.filter((i) => i.type === "mark");
  return {
    baseExtensions: e,
    nodeExtensions: t,
    markExtensions: r
  };
}
function Bc(n) {
  const e = [], { nodeExtensions: t, markExtensions: r } = ri(n), i = [...t, ...r], o = {
    default: null,
    rendered: !0,
    renderHTML: null,
    parseHTML: null,
    keepOnSplit: !0,
    isRequired: !1
  };
  return n.forEach((s) => {
    const a = {
      name: s.name,
      options: s.options,
      storage: s.storage
    }, l = C(s, "addGlobalAttributes", a);
    if (!l)
      return;
    l().forEach((u) => {
      u.types.forEach((d) => {
        Object.entries(u.attributes).forEach(([f, p]) => {
          e.push({
            type: d,
            name: f,
            attribute: {
              ...o,
              ...p
            }
          });
        });
      });
    });
  }), i.forEach((s) => {
    const a = {
      name: s.name,
      options: s.options,
      storage: s.storage
    }, l = C(s, "addAttributes", a);
    if (!l)
      return;
    const c = l();
    Object.entries(c).forEach(([u, d]) => {
      const f = {
        ...o,
        ...d
      };
      (d == null ? void 0 : d.isRequired) && (d == null ? void 0 : d.default) === void 0 && delete f.default, e.push({
        type: s.name,
        name: u,
        attribute: f
      });
    });
  }), e;
}
function G(n, e) {
  if (typeof n == "string") {
    if (!e.nodes[n])
      throw Error(`There is no node type named '${n}'. Maybe you forgot to add the extension?`);
    return e.nodes[n];
  }
  return n;
}
function ue(...n) {
  return n.filter((e) => !!e).reduce((e, t) => {
    const r = { ...e };
    return Object.entries(t).forEach(([i, o]) => {
      if (!r[i]) {
        r[i] = o;
        return;
      }
      i === "class" ? r[i] = [r[i], o].join(" ") : i === "style" ? r[i] = [r[i], o].join("; ") : r[i] = o;
    }), r;
  }, {});
}
function oo(n, e) {
  return e.filter((t) => t.attribute.rendered).map((t) => t.attribute.renderHTML ? t.attribute.renderHTML(n.attrs) || {} : {
    [t.name]: n.attrs[t.name]
  }).reduce((t, r) => ue(t, r), {});
}
function Lc(n) {
  return typeof n == "function";
}
function R(n, e = void 0, ...t) {
  return Lc(n) ? e ? n.bind(e)(...t) : n(...t) : n;
}
function Ug(n = {}) {
  return Object.keys(n).length === 0 && n.constructor === Object;
}
function Gg(n) {
  return typeof n != "string" ? n : n.match(/^[+-]?(?:\d*\.)?\d+$/) ? Number(n) : n === "true" ? !0 : n === "false" ? !1 : n;
}
function ma(n, e) {
  return n.style ? n : {
    ...n,
    getAttrs: (t) => {
      const r = n.getAttrs ? n.getAttrs(t) : n.attrs;
      if (r === !1)
        return !1;
      const i = e.reduce((o, s) => {
        const a = s.attribute.parseHTML ? s.attribute.parseHTML(t) : Gg(t.getAttribute(s.name));
        return a == null ? o : {
          ...o,
          [s.name]: a
        };
      }, {});
      return { ...r, ...i };
    }
  };
}
function ga(n) {
  return Object.fromEntries(Object.entries(n).filter(([e, t]) => e === "attrs" && Ug(t) ? !1 : t != null));
}
function Yg(n) {
  var e;
  const t = Bc(n), { nodeExtensions: r, markExtensions: i } = ri(n), o = (e = r.find((l) => C(l, "topNode"))) === null || e === void 0 ? void 0 : e.name, s = Object.fromEntries(r.map((l) => {
    const c = t.filter((y) => y.type === l.name), u = {
      name: l.name,
      options: l.options,
      storage: l.storage
    }, d = n.reduce((y, b) => {
      const w = C(b, "extendNodeSchema", u);
      return {
        ...y,
        ...w ? w(l) : {}
      };
    }, {}), f = ga({
      ...d,
      content: R(C(l, "content", u)),
      marks: R(C(l, "marks", u)),
      group: R(C(l, "group", u)),
      inline: R(C(l, "inline", u)),
      atom: R(C(l, "atom", u)),
      selectable: R(C(l, "selectable", u)),
      draggable: R(C(l, "draggable", u)),
      code: R(C(l, "code", u)),
      defining: R(C(l, "defining", u)),
      isolating: R(C(l, "isolating", u)),
      attrs: Object.fromEntries(c.map((y) => {
        var b;
        return [y.name, { default: (b = y == null ? void 0 : y.attribute) === null || b === void 0 ? void 0 : b.default }];
      }))
    }), p = R(C(l, "parseHTML", u));
    p && (f.parseDOM = p.map((y) => ma(y, c)));
    const h = C(l, "renderHTML", u);
    h && (f.toDOM = (y) => h({
      node: y,
      HTMLAttributes: oo(y, c)
    }));
    const m = C(l, "renderText", u);
    return m && (f.toText = m), [l.name, f];
  })), a = Object.fromEntries(i.map((l) => {
    const c = t.filter((m) => m.type === l.name), u = {
      name: l.name,
      options: l.options,
      storage: l.storage
    }, d = n.reduce((m, y) => {
      const b = C(y, "extendMarkSchema", u);
      return {
        ...m,
        ...b ? b(l) : {}
      };
    }, {}), f = ga({
      ...d,
      inclusive: R(C(l, "inclusive", u)),
      excludes: R(C(l, "excludes", u)),
      group: R(C(l, "group", u)),
      spanning: R(C(l, "spanning", u)),
      code: R(C(l, "code", u)),
      attrs: Object.fromEntries(c.map((m) => {
        var y;
        return [m.name, { default: (y = m == null ? void 0 : m.attribute) === null || y === void 0 ? void 0 : y.default }];
      }))
    }), p = R(C(l, "parseHTML", u));
    p && (f.parseDOM = p.map((m) => ma(m, c)));
    const h = C(l, "renderHTML", u);
    return h && (f.toDOM = (m) => h({
      mark: m,
      HTMLAttributes: oo(m, c)
    })), [l.name, f];
  }));
  return new Ou({
    topNode: o,
    nodes: s,
    marks: a
  });
}
function Pi(n, e) {
  return e.nodes[n] || e.marks[n] || null;
}
function ya(n, e) {
  return Array.isArray(e) ? e.some((t) => (typeof t == "string" ? t : t.name) === n.name) : e;
}
const Xg = (n, e = 500) => {
  let t = "";
  const r = n.parentOffset;
  return n.parent.nodesBetween(Math.max(0, r - e), r, (i, o, s, a) => {
    var l, c;
    const u = ((c = (l = i.type.spec).toText) === null || c === void 0 ? void 0 : c.call(l, {
      node: i,
      pos: o,
      parent: s,
      index: a
    })) || i.textContent || "%leaf%";
    t += u.slice(0, Math.max(0, r - o));
  }), t;
};
function Lo(n) {
  return Object.prototype.toString.call(n) === "[object RegExp]";
}
class ii {
  constructor(e) {
    this.find = e.find, this.handler = e.handler;
  }
}
const Zg = (n, e) => {
  if (Lo(e))
    return e.exec(n);
  const t = e(n);
  if (!t)
    return null;
  const r = [];
  return r.push(t.text), r.index = t.index, r.input = n, r.data = t.data, t.replaceWith && (t.text.includes(t.replaceWith) || console.warn('[tiptap warn]: "inputRuleMatch.replaceWith" must be part of "inputRuleMatch.text".'), r.push(t.replaceWith)), r;
};
function Ri(n) {
  var e;
  const { editor: t, from: r, to: i, text: o, rules: s, plugin: a } = n, { view: l } = t;
  if (l.composing)
    return !1;
  const c = l.state.doc.resolve(r);
  if (c.parent.type.spec.code || !!(!((e = c.nodeBefore || c.nodeAfter) === null || e === void 0) && e.marks.find((f) => f.type.spec.code)))
    return !1;
  let u = !1;
  const d = Xg(c) + o;
  return s.forEach((f) => {
    if (u)
      return;
    const p = Zg(d, f.find);
    if (!p)
      return;
    const h = l.state.tr, m = ti({
      state: l.state,
      transaction: h
    }), y = {
      from: r - (p[0].length - o.length),
      to: i
    }, { commands: b, chain: w, can: E } = new ni({
      editor: t,
      state: m
    });
    f.handler({
      state: m,
      range: y,
      match: p,
      commands: b,
      chain: w,
      can: E
    }) === null || !h.steps.length || (h.setMeta(a, {
      transform: h,
      from: r,
      to: i,
      text: o
    }), l.dispatch(h), u = !0);
  }), u;
}
function Qg(n) {
  const { editor: e, rules: t } = n, r = new U({
    state: {
      init() {
        return null;
      },
      apply(i, o) {
        const s = i.getMeta(r);
        return s || (i.selectionSet || i.docChanged ? null : o);
      }
    },
    props: {
      handleTextInput(i, o, s, a) {
        return Ri({
          editor: e,
          from: o,
          to: s,
          text: a,
          rules: t,
          plugin: r
        });
      },
      handleDOMEvents: {
        compositionend: (i) => (setTimeout(() => {
          const { $cursor: o } = i.state.selection;
          o && Ri({
            editor: e,
            from: o.pos,
            to: o.pos,
            text: "",
            rules: t,
            plugin: r
          });
        }), !1)
      },
      handleKeyDown(i, o) {
        if (o.key !== "Enter")
          return !1;
        const { $cursor: s } = i.state.selection;
        return s ? Ri({
          editor: e,
          from: s.pos,
          to: s.pos,
          text: `
`,
          rules: t,
          plugin: r
        }) : !1;
      }
    },
    isInputRules: !0
  });
  return r;
}
function ey(n) {
  return typeof n == "number";
}
class ty {
  constructor(e) {
    this.find = e.find, this.handler = e.handler;
  }
}
const ny = (n, e) => {
  if (Lo(e))
    return [...n.matchAll(e)];
  const t = e(n);
  return t ? t.map((r) => {
    const i = [];
    return i.push(r.text), i.index = r.index, i.input = n, i.data = r.data, r.replaceWith && (r.text.includes(r.replaceWith) || console.warn('[tiptap warn]: "pasteRuleMatch.replaceWith" must be part of "pasteRuleMatch.text".'), i.push(r.replaceWith)), i;
  }) : [];
};
function ry(n) {
  const { editor: e, state: t, from: r, to: i, rule: o } = n, { commands: s, chain: a, can: l } = new ni({
    editor: e,
    state: t
  }), c = [];
  return t.doc.nodesBetween(r, i, (d, f) => {
    if (!d.isTextblock || d.type.spec.code)
      return;
    const p = Math.max(r, f), h = Math.min(i, f + d.content.size), m = d.textBetween(p - f, h - f, void 0, "\uFFFC");
    ny(m, o.find).forEach((b) => {
      if (b.index === void 0)
        return;
      const w = p + b.index + 1, E = w + b[0].length, g = {
        from: t.tr.mapping.map(w),
        to: t.tr.mapping.map(E)
      }, O = o.handler({
        state: t,
        range: g,
        match: b,
        commands: s,
        chain: a,
        can: l
      });
      c.push(O);
    });
  }), c.every((d) => d !== null);
}
function iy(n) {
  const { editor: e, rules: t } = n;
  let r = null, i = !1, o = !1;
  return t.map((a) => new U({
    view(l) {
      const c = (u) => {
        var d;
        r = !((d = l.dom.parentElement) === null || d === void 0) && d.contains(u.target) ? l.dom.parentElement : null;
      };
      return window.addEventListener("dragstart", c), {
        destroy() {
          window.removeEventListener("dragstart", c);
        }
      };
    },
    props: {
      handleDOMEvents: {
        drop: (l) => (o = r === l.dom.parentElement, !1),
        paste: (l, c) => {
          var u;
          const d = (u = c.clipboardData) === null || u === void 0 ? void 0 : u.getData("text/html");
          return i = !!(d != null && d.includes("data-pm-slice")), !1;
        }
      }
    },
    appendTransaction: (l, c, u) => {
      const d = l[0], f = d.getMeta("uiEvent") === "paste" && !i, p = d.getMeta("uiEvent") === "drop" && !o;
      if (!f && !p)
        return;
      const h = c.doc.content.findDiffStart(u.doc.content), m = c.doc.content.findDiffEnd(u.doc.content);
      if (!ey(h) || !m || h === m.b)
        return;
      const y = u.tr, b = ti({
        state: u,
        transaction: y
      });
      if (!(!ry({
        editor: e,
        state: b,
        from: Math.max(h - 1, 0),
        to: m.b - 1,
        rule: a
      }) || !y.steps.length))
        return y;
    }
  }));
}
function oy(n) {
  const e = n.filter((t, r) => n.indexOf(t) !== r);
  return [...new Set(e)];
}
class dn {
  constructor(e, t) {
    this.splittableMarks = [], this.editor = t, this.extensions = dn.resolve(e), this.schema = Yg(this.extensions), this.extensions.forEach((r) => {
      var i;
      this.editor.extensionStorage[r.name] = r.storage;
      const o = {
        name: r.name,
        options: r.options,
        storage: r.storage,
        editor: this.editor,
        type: Pi(r.name, this.schema)
      };
      r.type === "mark" && ((i = R(C(r, "keepOnSplit", o))) !== null && i !== void 0 ? i : !0) && this.splittableMarks.push(r.name);
      const s = C(r, "onBeforeCreate", o);
      s && this.editor.on("beforeCreate", s);
      const a = C(r, "onCreate", o);
      a && this.editor.on("create", a);
      const l = C(r, "onUpdate", o);
      l && this.editor.on("update", l);
      const c = C(r, "onSelectionUpdate", o);
      c && this.editor.on("selectionUpdate", c);
      const u = C(r, "onTransaction", o);
      u && this.editor.on("transaction", u);
      const d = C(r, "onFocus", o);
      d && this.editor.on("focus", d);
      const f = C(r, "onBlur", o);
      f && this.editor.on("blur", f);
      const p = C(r, "onDestroy", o);
      p && this.editor.on("destroy", p);
    });
  }
  static resolve(e) {
    const t = dn.sort(dn.flatten(e)), r = oy(t.map((i) => i.name));
    return r.length && console.warn(`[tiptap warn]: Duplicate extension names found: [${r.map((i) => `'${i}'`).join(", ")}]. This can lead to issues.`), t;
  }
  static flatten(e) {
    return e.map((t) => {
      const r = {
        name: t.name,
        options: t.options,
        storage: t.storage
      }, i = C(t, "addExtensions", r);
      return i ? [
        t,
        ...this.flatten(i())
      ] : t;
    }).flat(10);
  }
  static sort(e) {
    return e.sort((r, i) => {
      const o = C(r, "priority") || 100, s = C(i, "priority") || 100;
      return o > s ? -1 : o < s ? 1 : 0;
    });
  }
  get commands() {
    return this.extensions.reduce((e, t) => {
      const r = {
        name: t.name,
        options: t.options,
        storage: t.storage,
        editor: this.editor,
        type: Pi(t.name, this.schema)
      }, i = C(t, "addCommands", r);
      return i ? {
        ...e,
        ...i()
      } : e;
    }, {});
  }
  get plugins() {
    const { editor: e } = this, t = dn.sort([...this.extensions].reverse()), r = [], i = [], o = t.map((s) => {
      const a = {
        name: s.name,
        options: s.options,
        storage: s.storage,
        editor: e,
        type: Pi(s.name, this.schema)
      }, l = [], c = C(s, "addKeyboardShortcuts", a);
      let u = {};
      if (s.type === "mark" && s.config.exitable && (u.ArrowRight = () => Mt.handleExit({ editor: e, mark: s })), c) {
        const m = Object.fromEntries(Object.entries(c()).map(([y, b]) => [y, () => b({ editor: e })]));
        u = { ...u, ...m };
      }
      const d = Ff(u);
      l.push(d);
      const f = C(s, "addInputRules", a);
      ya(s, e.options.enableInputRules) && f && r.push(...f());
      const p = C(s, "addPasteRules", a);
      ya(s, e.options.enablePasteRules) && p && i.push(...p());
      const h = C(s, "addProseMirrorPlugins", a);
      if (h) {
        const m = h();
        l.push(...m);
      }
      return l;
    }).flat();
    return [
      Qg({
        editor: e,
        rules: r
      }),
      ...iy({
        editor: e,
        rules: i
      }),
      ...o
    ];
  }
  get attributes() {
    return Bc(this.extensions);
  }
  get nodeViews() {
    const { editor: e } = this, { nodeExtensions: t } = ri(this.extensions);
    return Object.fromEntries(t.filter((r) => !!C(r, "addNodeView")).map((r) => {
      const i = this.attributes.filter((l) => l.type === r.name), o = {
        name: r.name,
        options: r.options,
        storage: r.storage,
        editor: e,
        type: G(r.name, this.schema)
      }, s = C(r, "addNodeView", o);
      if (!s)
        return [];
      const a = (l, c, u, d) => {
        const f = oo(l, i);
        return s()({
          editor: e,
          node: l,
          getPos: u,
          decorations: d,
          HTMLAttributes: f,
          extension: r
        });
      };
      return [r.name, a];
    }));
  }
}
function sy(n) {
  return Object.prototype.toString.call(n).slice(8, -1);
}
function Bi(n) {
  return sy(n) !== "Object" ? !1 : n.constructor === Object && Object.getPrototypeOf(n) === Object.prototype;
}
function oi(n, e) {
  const t = { ...n };
  return Bi(n) && Bi(e) && Object.keys(e).forEach((r) => {
    Bi(e[r]) ? r in n ? t[r] = oi(n[r], e[r]) : Object.assign(t, { [r]: e[r] }) : Object.assign(t, { [r]: e[r] });
  }), t;
}
class ge {
  constructor(e = {}) {
    this.type = "extension", this.name = "extension", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...e
    }, this.name = this.config.name, e.defaultOptions && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = R(C(this, "addOptions", {
      name: this.name
    }))), this.storage = R(C(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(e = {}) {
    return new ge(e);
  }
  configure(e = {}) {
    const t = this.extend();
    return t.options = oi(this.options, e), t.storage = R(C(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
  extend(e = {}) {
    const t = new ge(e);
    return t.parent = this, this.child = t, t.name = e.name ? e.name : t.parent.name, e.defaultOptions && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${t.name}".`), t.options = R(C(t, "addOptions", {
      name: t.name
    })), t.storage = R(C(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
}
function $c(n, e, t) {
  const { from: r, to: i } = e, { blockSeparator: o = `

`, textSerializers: s = {} } = t || {};
  let a = "", l = !0;
  return n.nodesBetween(r, i, (c, u, d, f) => {
    var p;
    const h = s == null ? void 0 : s[c.type.name];
    h ? (c.isBlock && !l && (a += o, l = !0), d && (a += h({
      node: c,
      pos: u,
      parent: d,
      index: f,
      range: e
    }))) : c.isText ? (a += (p = c == null ? void 0 : c.text) === null || p === void 0 ? void 0 : p.slice(Math.max(r, u) - u, i - u), l = !1) : c.isBlock && !l && (a += o, l = !0);
  }), a;
}
function Fc(n) {
  return Object.fromEntries(Object.entries(n.nodes).filter(([, e]) => e.spec.toText).map(([e, t]) => [e, t.spec.toText]));
}
const ay = ge.create({
  name: "clipboardTextSerializer",
  addProseMirrorPlugins() {
    return [
      new U({
        key: new de("clipboardTextSerializer"),
        props: {
          clipboardTextSerializer: () => {
            const { editor: n } = this, { state: e, schema: t } = n, { doc: r, selection: i } = e, { ranges: o } = i, s = Math.min(...o.map((u) => u.$from.pos)), a = Math.max(...o.map((u) => u.$to.pos)), l = Fc(t);
            return $c(r, { from: s, to: a }, {
              textSerializers: l
            });
          }
        }
      })
    ];
  }
}), ly = () => ({ editor: n, view: e }) => (requestAnimationFrame(() => {
  var t;
  n.isDestroyed || (e.dom.blur(), (t = window == null ? void 0 : window.getSelection()) === null || t === void 0 || t.removeAllRanges());
}), !0), cy = (n = !1) => ({ commands: e }) => e.setContent("", n), uy = () => ({ state: n, tr: e, dispatch: t }) => {
  const { selection: r } = e, { ranges: i } = r;
  return t && i.forEach(({ $from: o, $to: s }) => {
    n.doc.nodesBetween(o.pos, s.pos, (a, l) => {
      if (a.type.isText)
        return;
      const { doc: c, mapping: u } = e, d = c.resolve(u.map(l)), f = c.resolve(u.map(l + a.nodeSize)), p = d.blockRange(f);
      if (!p)
        return;
      const h = Gt(p);
      if (a.type.isTextblock) {
        const { defaultType: m } = d.parent.contentMatchAt(d.index());
        e.setNodeMarkup(p.start, m);
      }
      (h || h === 0) && e.lift(p, h);
    });
  }), !0;
}, dy = (n) => (e) => n(e), fy = () => ({ state: n, dispatch: e }) => _l(n, e), py = () => ({ tr: n, dispatch: e }) => {
  const { selection: t } = n, r = t.$anchor.node();
  if (r.content.size > 0)
    return !1;
  const i = n.selection.$anchor;
  for (let o = i.depth; o > 0; o -= 1)
    if (i.node(o).type === r.type) {
      if (e) {
        const a = i.before(o), l = i.after(o);
        n.delete(a, l).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, hy = (n) => ({ tr: e, state: t, dispatch: r }) => {
  const i = G(n, t.schema), o = e.selection.$anchor;
  for (let s = o.depth; s > 0; s -= 1)
    if (o.node(s).type === i) {
      if (r) {
        const l = o.before(s), c = o.after(s);
        e.delete(l, c).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, my = (n) => ({ tr: e, dispatch: t }) => {
  const { from: r, to: i } = n;
  return t && e.delete(r, i), !0;
}, gy = () => ({ state: n, dispatch: e }) => Rl(n, e), yy = () => ({ commands: n }) => n.keyboardShortcut("Enter"), by = () => ({ state: n, dispatch: e }) => Jl(n, e);
function Wr(n, e, t = { strict: !0 }) {
  const r = Object.keys(e);
  return r.length ? r.every((i) => t.strict ? e[i] === n[i] : Lo(e[i]) ? e[i].test(n[i]) : e[i] === n[i]) : !0;
}
function so(n, e, t = {}) {
  return n.find((r) => r.type === e && Wr(r.attrs, t));
}
function vy(n, e, t = {}) {
  return !!so(n, e, t);
}
function $o(n, e, t = {}) {
  if (!n || !e)
    return;
  let r = n.parent.childAfter(n.parentOffset);
  if (n.parentOffset === r.offset && r.offset !== 0 && (r = n.parent.childBefore(n.parentOffset)), !r.node)
    return;
  const i = so([...r.node.marks], e, t);
  if (!i)
    return;
  let o = r.index, s = n.start() + r.offset, a = o + 1, l = s + r.node.nodeSize;
  for (so([...r.node.marks], e, t); o > 0 && i.isInSet(n.parent.child(o - 1).marks); )
    o -= 1, s -= n.parent.child(o).nodeSize;
  for (; a < n.parent.childCount && vy([...n.parent.child(a).marks], e, t); )
    l += n.parent.child(a).nodeSize, a += 1;
  return {
    from: s,
    to: l
  };
}
function Et(n, e) {
  if (typeof n == "string") {
    if (!e.marks[n])
      throw Error(`There is no mark type named '${n}'. Maybe you forgot to add the extension?`);
    return e.marks[n];
  }
  return n;
}
const ky = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  const o = Et(n, r.schema), { doc: s, selection: a } = t, { $from: l, from: c, to: u } = a;
  if (i) {
    const d = $o(l, o, e);
    if (d && d.from <= c && d.to >= u) {
      const f = D.create(s, d.from, d.to);
      t.setSelection(f);
    }
  }
  return !0;
}, xy = (n) => (e) => {
  const t = typeof n == "function" ? n(e) : n;
  for (let r = 0; r < t.length; r += 1)
    if (t[r](e))
      return !0;
  return !1;
};
function zc(n) {
  return n instanceof D;
}
function st(n = 0, e = 0, t = 0) {
  return Math.min(Math.max(n, e), t);
}
function Vc(n, e = null) {
  if (!e)
    return null;
  const t = P.atStart(n), r = P.atEnd(n);
  if (e === "start" || e === !0)
    return t;
  if (e === "end")
    return r;
  const i = t.from, o = r.to;
  return e === "all" ? D.create(n, st(0, i, o), st(n.content.size, i, o)) : D.create(n, st(e, i, o), st(e, i, o));
}
function Fo() {
  return [
    "iPad Simulator",
    "iPhone Simulator",
    "iPod Simulator",
    "iPad",
    "iPhone",
    "iPod"
  ].includes(navigator.platform) || navigator.userAgent.includes("Mac") && "ontouchend" in document;
}
const wy = (n = null, e = {}) => ({ editor: t, view: r, tr: i, dispatch: o }) => {
  e = {
    scrollIntoView: !0,
    ...e
  };
  const s = () => {
    Fo() && r.dom.focus(), requestAnimationFrame(() => {
      t.isDestroyed || (r.focus(), e != null && e.scrollIntoView && t.commands.scrollIntoView());
    });
  };
  if (r.hasFocus() && n === null || n === !1)
    return !0;
  if (o && n === null && !zc(t.state.selection))
    return s(), !0;
  const a = Vc(i.doc, n) || t.state.selection, l = t.state.selection.eq(a);
  return o && (l || i.setSelection(a), l && i.storedMarks && i.setStoredMarks(i.storedMarks), s()), !0;
}, Sy = (n, e) => (t) => n.every((r, i) => e(r, { ...t, index: i })), My = (n, e) => ({ tr: t, commands: r }) => r.insertContentAt({ from: t.selection.from, to: t.selection.to }, n, e);
function ba(n) {
  const e = `<body>${n}</body>`;
  return new window.DOMParser().parseFromString(e, "text/html").body;
}
function qr(n, e, t) {
  if (t = {
    slice: !0,
    parseOptions: {},
    ...t
  }, typeof n == "object" && n !== null)
    try {
      return Array.isArray(n) ? x.fromArray(n.map((r) => e.nodeFromJSON(r))) : e.nodeFromJSON(n);
    } catch (r) {
      return console.warn("[tiptap warn]: Invalid content.", "Passed value:", n, "Error:", r), qr("", e, t);
    }
  if (typeof n == "string") {
    const r = qt.fromSchema(e);
    return t.slice ? r.parseSlice(ba(n), t.parseOptions).content : r.parse(ba(n), t.parseOptions);
  }
  return qr("", e, t);
}
function Oy(n, e, t) {
  const r = n.steps.length - 1;
  if (r < e)
    return;
  const i = n.steps[r];
  if (!(i instanceof Q || i instanceof _))
    return;
  const o = n.mapping.maps[r];
  let s = 0;
  o.forEach((a, l, c, u) => {
    s === 0 && (s = u);
  }), n.setSelection(P.near(n.doc.resolve(s), t));
}
const Cy = (n) => n.toString().startsWith("<"), Ty = (n, e, t) => ({ tr: r, dispatch: i, editor: o }) => {
  if (i) {
    t = {
      parseOptions: {},
      updateSelection: !0,
      ...t
    };
    const s = qr(e, o.schema, {
      parseOptions: {
        preserveWhitespace: "full",
        ...t.parseOptions
      }
    });
    if (s.toString() === "<>")
      return !0;
    let { from: a, to: l } = typeof n == "number" ? { from: n, to: n } : n, c = !0, u = !0;
    if ((Cy(s) ? s : [s]).forEach((f) => {
      f.check(), c = c ? f.isText && f.marks.length === 0 : !1, u = u ? f.isBlock : !1;
    }), a === l && u) {
      const { parent: f } = r.doc.resolve(a);
      f.isTextblock && !f.type.spec.code && !f.childCount && (a -= 1, l += 1);
    }
    c ? r.insertText(e, a, l) : r.replaceWith(a, l, s), t.updateSelection && Oy(r, r.steps.length - 1, -1);
  }
  return !0;
}, Ey = () => ({ state: n, dispatch: e }) => jl(n, e), Ay = () => ({ state: n, dispatch: e }) => Hl(n, e), Ny = () => ({ state: n, dispatch: e }) => Bl(n, e), Dy = () => ({ state: n, dispatch: e }) => Fl(n, e);
function jc() {
  return typeof navigator < "u" ? /Mac/.test(navigator.platform) : !1;
}
function Iy(n) {
  const e = n.split(/-(?!$)/);
  let t = e[e.length - 1];
  t === "Space" && (t = " ");
  let r, i, o, s;
  for (let a = 0; a < e.length - 1; a += 1) {
    const l = e[a];
    if (/^(cmd|meta|m)$/i.test(l))
      s = !0;
    else if (/^a(lt)?$/i.test(l))
      r = !0;
    else if (/^(c|ctrl|control)$/i.test(l))
      i = !0;
    else if (/^s(hift)?$/i.test(l))
      o = !0;
    else if (/^mod$/i.test(l))
      Fo() || jc() ? s = !0 : i = !0;
    else
      throw new Error(`Unrecognized modifier name: ${l}`);
  }
  return r && (t = `Alt-${t}`), i && (t = `Ctrl-${t}`), s && (t = `Meta-${t}`), o && (t = `Shift-${t}`), t;
}
const Py = (n) => ({ editor: e, view: t, tr: r, dispatch: i }) => {
  const o = Iy(n).split(/-(?!$)/), s = o.find((c) => !["Alt", "Ctrl", "Meta", "Shift"].includes(c)), a = new KeyboardEvent("keydown", {
    key: s === "Space" ? " " : s,
    altKey: o.includes("Alt"),
    ctrlKey: o.includes("Ctrl"),
    metaKey: o.includes("Meta"),
    shiftKey: o.includes("Shift"),
    bubbles: !0,
    cancelable: !0
  }), l = e.captureTransaction(() => {
    t.someProp("handleKeyDown", (c) => c(t, a));
  });
  return l == null || l.steps.forEach((c) => {
    const u = c.map(r.mapping);
    u && i && r.maybeStep(u);
  }), !0;
};
function Zn(n, e, t = {}) {
  const { from: r, to: i, empty: o } = n.selection, s = e ? G(e, n.schema) : null, a = [];
  n.doc.nodesBetween(r, i, (d, f) => {
    if (d.isText)
      return;
    const p = Math.max(r, f), h = Math.min(i, f + d.nodeSize);
    a.push({
      node: d,
      from: p,
      to: h
    });
  });
  const l = i - r, c = a.filter((d) => s ? s.name === d.node.type.name : !0).filter((d) => Wr(d.node.attrs, t, { strict: !1 }));
  return o ? !!c.length : c.reduce((d, f) => d + f.to - f.from, 0) >= l;
}
const Ry = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = G(n, t.schema);
  return Zn(t, i, e) ? Wl(t, r) : !1;
}, By = () => ({ state: n, dispatch: e }) => Ul(n, e), Ly = (n) => ({ state: e, dispatch: t }) => {
  const r = G(n, e.schema);
  return nc(r)(e, t);
}, $y = () => ({ state: n, dispatch: e }) => ql(n, e);
function si(n, e) {
  return e.nodes[n] ? "node" : e.marks[n] ? "mark" : null;
}
function va(n, e) {
  const t = typeof e == "string" ? [e] : e;
  return Object.keys(n).reduce((r, i) => (t.includes(i) || (r[i] = n[i]), r), {});
}
const Fy = (n, e) => ({ tr: t, state: r, dispatch: i }) => {
  let o = null, s = null;
  const a = si(typeof n == "string" ? n : n.name, r.schema);
  return a ? (a === "node" && (o = G(n, r.schema)), a === "mark" && (s = Et(n, r.schema)), i && t.selection.ranges.forEach((l) => {
    r.doc.nodesBetween(l.$from.pos, l.$to.pos, (c, u) => {
      o && o === c.type && t.setNodeMarkup(u, void 0, va(c.attrs, e)), s && c.marks.length && c.marks.forEach((d) => {
        s === d.type && t.addMark(u, u + c.nodeSize, s.create(va(d.attrs, e)));
      });
    });
  }), !0) : !1;
}, zy = () => ({ tr: n, dispatch: e }) => (e && n.scrollIntoView(), !0), Vy = () => ({ tr: n, commands: e }) => e.setTextSelection({
  from: 0,
  to: n.doc.content.size
}), jy = () => ({ state: n, dispatch: e }) => Ll(n, e), Hy = () => ({ state: n, dispatch: e }) => zl(n, e), Wy = () => ({ state: n, dispatch: e }) => Gl(n, e), qy = () => ({ state: n, dispatch: e }) => Ql(n, e), Ky = () => ({ state: n, dispatch: e }) => Zl(n, e);
function Hc(n, e, t = {}) {
  return qr(n, e, { slice: !1, parseOptions: t });
}
const Jy = (n, e = !1, t = {}) => ({ tr: r, editor: i, dispatch: o }) => {
  const { doc: s } = r, a = Hc(n, i.schema, t);
  return o && r.replaceWith(0, s.content.size, a).setMeta("preventUpdate", !e), !0;
};
function _y(n) {
  for (let e = 0; e < n.edgeCount; e += 1) {
    const { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
function Uy(n, e) {
  for (let t = n.depth; t > 0; t -= 1) {
    const r = n.node(t);
    if (e(r))
      return {
        pos: t > 0 ? n.before(t) : 0,
        start: n.start(t),
        depth: t,
        node: r
      };
  }
}
function zo(n) {
  return (e) => Uy(e.$from, n);
}
function Gy(n, e) {
  const t = Ke.fromSchema(e).serializeFragment(n), i = document.implementation.createHTMLDocument().createElement("div");
  return i.appendChild(t), i.innerHTML;
}
function Yy(n, e) {
  const t = {
    from: 0,
    to: n.content.size
  };
  return $c(n, t, e);
}
function Wc(n, e) {
  const t = Et(e, n.schema), { from: r, to: i, empty: o } = n.selection, s = [];
  o ? (n.storedMarks && s.push(...n.storedMarks), s.push(...n.selection.$head.marks())) : n.doc.nodesBetween(r, i, (l) => {
    s.push(...l.marks);
  });
  const a = s.find((l) => l.type.name === t.name);
  return a ? { ...a.attrs } : {};
}
function Xy(n, e) {
  const t = G(e, n.schema), { from: r, to: i } = n.selection, o = [];
  n.doc.nodesBetween(r, i, (a) => {
    o.push(a);
  });
  const s = o.reverse().find((a) => a.type.name === t.name);
  return s ? { ...s.attrs } : {};
}
function Zy(n, e) {
  const t = si(typeof e == "string" ? e : e.name, n.schema);
  return t === "node" ? Xy(n, e) : t === "mark" ? Wc(n, e) : {};
}
function qc(n, e, t) {
  const r = [];
  return n === e ? t.resolve(n).marks().forEach((i) => {
    const o = t.resolve(n - 1), s = $o(o, i.type);
    !s || r.push({
      mark: i,
      ...s
    });
  }) : t.nodesBetween(n, e, (i, o) => {
    r.push(...i.marks.map((s) => ({
      from: o,
      to: o + i.nodeSize,
      mark: s
    })));
  }), r;
}
function ao(n, e, t = {}) {
  const { empty: r, ranges: i } = n.selection, o = e ? Et(e, n.schema) : null;
  if (r)
    return !!(n.storedMarks || n.selection.$from.marks()).filter((d) => o ? o.name === d.type.name : !0).find((d) => Wr(d.attrs, t, { strict: !1 }));
  let s = 0;
  const a = [];
  if (i.forEach(({ $from: d, $to: f }) => {
    const p = d.pos, h = f.pos;
    n.doc.nodesBetween(p, h, (m, y) => {
      if (!m.isText && !m.marks.length)
        return;
      const b = Math.max(p, y), w = Math.min(h, y + m.nodeSize), E = w - b;
      s += E, a.push(...m.marks.map((g) => ({
        mark: g,
        from: b,
        to: w
      })));
    });
  }), s === 0)
    return !1;
  const l = a.filter((d) => o ? o.name === d.mark.type.name : !0).filter((d) => Wr(d.mark.attrs, t, { strict: !1 })).reduce((d, f) => d + f.to - f.from, 0), c = a.filter((d) => o ? d.mark.type !== o && d.mark.type.excludes(o) : !0).reduce((d, f) => d + f.to - f.from, 0);
  return (l > 0 ? l + c : l) >= s;
}
function Qy(n, e, t = {}) {
  if (!e)
    return Zn(n, null, t) || ao(n, null, t);
  const r = si(e, n.schema);
  return r === "node" ? Zn(n, e, t) : r === "mark" ? ao(n, e, t) : !1;
}
function ka(n, e) {
  const { nodeExtensions: t } = ri(e), r = t.find((s) => s.name === n);
  if (!r)
    return !1;
  const i = {
    name: r.name,
    options: r.options,
    storage: r.storage
  }, o = R(C(r, "group", i));
  return typeof o != "string" ? !1 : o.split(" ").includes("list");
}
function eb(n) {
  var e;
  const t = (e = n.type.createAndFill()) === null || e === void 0 ? void 0 : e.toJSON(), r = n.toJSON();
  return JSON.stringify(t) === JSON.stringify(r);
}
function tb(n, e, t) {
  const i = n.state.doc.content.size, o = st(e, 0, i), s = st(t, 0, i), a = n.coordsAtPos(o), l = n.coordsAtPos(s, -1), c = Math.min(a.top, l.top), u = Math.max(a.bottom, l.bottom), d = Math.min(a.left, l.left), f = Math.max(a.right, l.right), p = f - d, h = u - c, b = {
    top: c,
    bottom: u,
    left: d,
    right: f,
    width: p,
    height: h,
    x: d,
    y: c
  };
  return {
    ...b,
    toJSON: () => b
  };
}
function nb(n, e, t) {
  var r;
  const { selection: i } = e;
  let o = null;
  if (zc(i) && (o = i.$cursor), o) {
    const a = (r = n.storedMarks) !== null && r !== void 0 ? r : o.marks();
    return !!t.isInSet(a) || !a.some((l) => l.type.excludes(t));
  }
  const { ranges: s } = i;
  return s.some(({ $from: a, $to: l }) => {
    let c = a.depth === 0 ? n.doc.inlineContent && n.doc.type.allowsMarkType(t) : !1;
    return n.doc.nodesBetween(a.pos, l.pos, (u, d, f) => {
      if (c)
        return !1;
      if (u.isInline) {
        const p = !f || f.type.allowsMarkType(t), h = !!t.isInSet(u.marks) || !u.marks.some((m) => m.type.excludes(t));
        c = p && h;
      }
      return !c;
    }), c;
  });
}
const rb = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  const { selection: o } = t, { empty: s, ranges: a } = o, l = Et(n, r.schema);
  if (i)
    if (s) {
      const c = Wc(r, l);
      t.addStoredMark(l.create({
        ...c,
        ...e
      }));
    } else
      a.forEach((c) => {
        const u = c.$from.pos, d = c.$to.pos;
        r.doc.nodesBetween(u, d, (f, p) => {
          const h = Math.max(p, u), m = Math.min(p + f.nodeSize, d);
          f.marks.find((b) => b.type === l) ? f.marks.forEach((b) => {
            l === b.type && t.addMark(h, m, l.create({
              ...b.attrs,
              ...e
            }));
          }) : t.addMark(h, m, l.create(e));
        });
      });
  return nb(r, t, l);
}, ib = (n, e) => ({ tr: t }) => (t.setMeta(n, e), !0), ob = (n, e = {}) => ({ state: t, dispatch: r, chain: i }) => {
  const o = G(n, t.schema);
  return o.isTextblock ? i().command(({ commands: s }) => Fr(o, e)(t) ? !0 : s.clearNodes()).command(({ state: s }) => Fr(o, e)(s, r)).run() : (console.warn('[tiptap warn]: Currently "setNode()" only supports text block nodes.'), !1);
}, sb = (n) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: r } = e, i = st(n, 0, r.content.size), o = N.create(r, i);
    e.setSelection(o);
  }
  return !0;
}, ab = (n) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: r } = e, { from: i, to: o } = typeof n == "number" ? { from: n, to: n } : n, s = D.atStart(r).from, a = D.atEnd(r).to, l = st(i, s, a), c = st(o, s, a), u = D.create(r, l, c);
    e.setSelection(u);
  }
  return !0;
}, lb = (n) => ({ state: e, dispatch: t }) => {
  const r = G(n, e.schema);
  return rc(r)(e, t);
};
function Sr(n, e, t) {
  return Object.fromEntries(Object.entries(t).filter(([r]) => {
    const i = n.find((o) => o.type === e && o.name === r);
    return i ? i.attribute.keepOnSplit : !1;
  }));
}
function xa(n, e) {
  const t = n.storedMarks || n.selection.$to.parentOffset && n.selection.$from.marks();
  if (t) {
    const r = t.filter((i) => e == null ? void 0 : e.includes(i.type.name));
    n.tr.ensureMarks(r);
  }
}
const cb = ({ keepMarks: n = !0 } = {}) => ({ tr: e, state: t, dispatch: r, editor: i }) => {
  const { selection: o, doc: s } = e, { $from: a, $to: l } = o, c = i.extensionManager.attributes, u = Sr(c, a.node().type.name, a.node().attrs);
  if (o instanceof N && o.node.isBlock)
    return !a.parentOffset || !Ue(s, a.pos) ? !1 : (r && (n && xa(t, i.extensionManager.splittableMarks), e.split(a.pos).scrollIntoView()), !0);
  if (!a.parent.isBlock)
    return !1;
  if (r) {
    const d = l.parentOffset === l.parent.content.size;
    o instanceof D && e.deleteSelection();
    const f = a.depth === 0 ? void 0 : _y(a.node(-1).contentMatchAt(a.indexAfter(-1)));
    let p = d && f ? [{
      type: f,
      attrs: u
    }] : void 0, h = Ue(e.doc, e.mapping.map(a.pos), 1, p);
    if (!p && !h && Ue(e.doc, e.mapping.map(a.pos), 1, f ? [{ type: f }] : void 0) && (h = !0, p = f ? [{
      type: f,
      attrs: u
    }] : void 0), h && (e.split(e.mapping.map(a.pos), 1, p), f && !d && !a.parentOffset && a.parent.type !== f)) {
      const m = e.mapping.map(a.before()), y = e.doc.resolve(m);
      a.node(-1).canReplaceWith(y.index(), y.index() + 1, f) && e.setNodeMarkup(e.mapping.map(a.before()), f);
    }
    n && xa(t, i.extensionManager.splittableMarks), e.scrollIntoView();
  }
  return !0;
}, ub = (n) => ({ tr: e, state: t, dispatch: r, editor: i }) => {
  var o;
  const s = G(n, t.schema), { $from: a, $to: l } = t.selection, c = t.selection.node;
  if (c && c.isBlock || a.depth < 2 || !a.sameParent(l))
    return !1;
  const u = a.node(-1);
  if (u.type !== s)
    return !1;
  const d = i.extensionManager.attributes;
  if (a.parent.content.size === 0 && a.node(-1).childCount === a.indexAfter(-1)) {
    if (a.depth === 2 || a.node(-3).type !== s || a.index(-2) !== a.node(-2).childCount - 1)
      return !1;
    if (r) {
      let y = x.empty;
      const b = a.index(-1) ? 1 : a.index(-2) ? 2 : 3;
      for (let A = a.depth - b; A >= a.depth - 3; A -= 1)
        y = x.from(a.node(A).copy(y));
      const w = a.indexAfter(-1) < a.node(-2).childCount ? 1 : a.indexAfter(-2) < a.node(-3).childCount ? 2 : 3, E = Sr(d, a.node().type.name, a.node().attrs), g = ((o = s.contentMatch.defaultType) === null || o === void 0 ? void 0 : o.createAndFill(E)) || void 0;
      y = y.append(x.from(s.createAndFill(null, g) || void 0));
      const O = a.before(a.depth - (b - 1));
      e.replace(O, a.after(-w), new S(y, 4 - b, 0));
      let k = -1;
      e.doc.nodesBetween(O, e.doc.content.size, (A, M) => {
        if (k > -1)
          return !1;
        A.isTextblock && A.content.size === 0 && (k = M + 1);
      }), k > -1 && e.setSelection(D.near(e.doc.resolve(k))), e.scrollIntoView();
    }
    return !0;
  }
  const f = l.pos === a.end() ? u.contentMatchAt(0).defaultType : null, p = Sr(d, u.type.name, u.attrs), h = Sr(d, a.node().type.name, a.node().attrs);
  e.delete(a.pos, l.pos);
  const m = f ? [{ type: s, attrs: p }, { type: f, attrs: h }] : [{ type: s, attrs: p }];
  return Ue(e.doc, a.pos, 2) ? (r && e.split(a.pos, 2, m).scrollIntoView(), !0) : !1;
}, wa = (n, e) => {
  const t = zo((s) => s.type === e)(n.selection);
  if (!t)
    return !0;
  const r = n.doc.resolve(Math.max(0, t.pos - 1)).before(t.depth);
  if (r === void 0)
    return !0;
  const i = n.doc.nodeAt(r);
  return t.node.type === (i == null ? void 0 : i.type) && Ze(n.doc, t.pos) && n.join(t.pos), !0;
}, Sa = (n, e) => {
  const t = zo((s) => s.type === e)(n.selection);
  if (!t)
    return !0;
  const r = n.doc.resolve(t.start).after(t.depth);
  if (r === void 0)
    return !0;
  const i = n.doc.nodeAt(r);
  return t.node.type === (i == null ? void 0 : i.type) && Ze(n.doc, r) && n.join(r), !0;
}, db = (n, e) => ({ editor: t, tr: r, state: i, dispatch: o, chain: s, commands: a, can: l }) => {
  const { extensions: c } = t.extensionManager, u = G(n, i.schema), d = G(e, i.schema), { selection: f } = i, { $from: p, $to: h } = f, m = p.blockRange(h);
  if (!m)
    return !1;
  const y = zo((b) => ka(b.type.name, c))(f);
  if (m.depth >= 1 && y && m.depth - y.depth <= 1) {
    if (y.node.type === u)
      return a.liftListItem(d);
    if (ka(y.node.type.name, c) && u.validContent(y.node.content) && o)
      return s().command(() => (r.setNodeMarkup(y.pos, u), !0)).command(() => wa(r, u)).command(() => Sa(r, u)).run();
  }
  return s().command(() => l().wrapInList(u) ? !0 : a.clearNodes()).wrapInList(u).command(() => wa(r, u)).command(() => Sa(r, u)).run();
}, fb = (n, e = {}, t = {}) => ({ state: r, commands: i }) => {
  const { extendEmptyMarkRange: o = !1 } = t, s = Et(n, r.schema);
  return ao(r, s, e) ? i.unsetMark(s, { extendEmptyMarkRange: o }) : i.setMark(s, e);
}, pb = (n, e, t = {}) => ({ state: r, commands: i }) => {
  const o = G(n, r.schema), s = G(e, r.schema);
  return Zn(r, o, t) ? i.setNode(s) : i.setNode(o, t);
}, hb = (n, e = {}) => ({ state: t, commands: r }) => {
  const i = G(n, t.schema);
  return Zn(t, i, e) ? r.lift(i) : r.wrapIn(i, e);
}, mb = () => ({ state: n, dispatch: e }) => {
  const t = n.plugins;
  for (let r = 0; r < t.length; r += 1) {
    const i = t[r];
    let o;
    if (i.spec.isInputRules && (o = i.getState(n))) {
      if (e) {
        const s = n.tr, a = o.transform;
        for (let l = a.steps.length - 1; l >= 0; l -= 1)
          s.step(a.steps[l].invert(a.docs[l]));
        if (o.text) {
          const l = s.doc.resolve(o.from).marks();
          s.replaceWith(o.from, o.to, n.schema.text(o.text, l));
        } else
          s.delete(o.from, o.to);
      }
      return !0;
    }
  }
  return !1;
}, gb = () => ({ tr: n, dispatch: e }) => {
  const { selection: t } = n, { empty: r, ranges: i } = t;
  return r || e && i.forEach((o) => {
    n.removeMark(o.$from.pos, o.$to.pos);
  }), !0;
}, yb = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  var o;
  const { extendEmptyMarkRange: s = !1 } = e, { selection: a } = t, l = Et(n, r.schema), { $from: c, empty: u, ranges: d } = a;
  if (!i)
    return !0;
  if (u && s) {
    let { from: f, to: p } = a;
    const h = (o = c.marks().find((y) => y.type === l)) === null || o === void 0 ? void 0 : o.attrs, m = $o(c, l, h);
    m && (f = m.from, p = m.to), t.removeMark(f, p, l);
  } else
    d.forEach((f) => {
      t.removeMark(f.$from.pos, f.$to.pos, l);
    });
  return t.removeStoredMark(l), !0;
}, bb = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  let o = null, s = null;
  const a = si(typeof n == "string" ? n : n.name, r.schema);
  return a ? (a === "node" && (o = G(n, r.schema)), a === "mark" && (s = Et(n, r.schema)), i && t.selection.ranges.forEach((l) => {
    const c = l.$from.pos, u = l.$to.pos;
    r.doc.nodesBetween(c, u, (d, f) => {
      o && o === d.type && t.setNodeMarkup(f, void 0, {
        ...d.attrs,
        ...e
      }), s && d.marks.length && d.marks.forEach((p) => {
        if (s === p.type) {
          const h = Math.max(f, c), m = Math.min(f + d.nodeSize, u);
          t.addMark(h, m, s.create({
            ...p.attrs,
            ...e
          }));
        }
      });
    });
  }), !0) : !1;
}, vb = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = G(n, t.schema);
  return ec(i, e)(t, r);
}, kb = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = G(n, t.schema);
  return tc(i, e)(t, r);
};
var xb = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  blur: ly,
  clearContent: cy,
  clearNodes: uy,
  command: dy,
  createParagraphNear: fy,
  deleteCurrentNode: py,
  deleteNode: hy,
  deleteRange: my,
  deleteSelection: gy,
  enter: yy,
  exitCode: by,
  extendMarkRange: ky,
  first: xy,
  focus: wy,
  forEach: Sy,
  insertContent: My,
  insertContentAt: Ty,
  joinUp: Ey,
  joinDown: Ay,
  joinBackward: Ny,
  joinForward: Dy,
  keyboardShortcut: Py,
  lift: Ry,
  liftEmptyBlock: By,
  liftListItem: Ly,
  newlineInCode: $y,
  resetAttributes: Fy,
  scrollIntoView: zy,
  selectAll: Vy,
  selectNodeBackward: jy,
  selectNodeForward: Hy,
  selectParentNode: Wy,
  selectTextblockEnd: qy,
  selectTextblockStart: Ky,
  setContent: Jy,
  setMark: rb,
  setMeta: ib,
  setNode: ob,
  setNodeSelection: sb,
  setTextSelection: ab,
  sinkListItem: lb,
  splitBlock: cb,
  splitListItem: ub,
  toggleList: db,
  toggleMark: fb,
  toggleNode: pb,
  toggleWrap: hb,
  undoInputRule: mb,
  unsetAllMarks: gb,
  unsetMark: yb,
  updateAttributes: bb,
  wrapIn: vb,
  wrapInList: kb
});
const wb = ge.create({
  name: "commands",
  addCommands() {
    return {
      ...xb
    };
  }
}), Sb = ge.create({
  name: "editable",
  addProseMirrorPlugins() {
    return [
      new U({
        key: new de("editable"),
        props: {
          editable: () => this.editor.options.editable
        }
      })
    ];
  }
}), Mb = ge.create({
  name: "focusEvents",
  addProseMirrorPlugins() {
    const { editor: n } = this;
    return [
      new U({
        key: new de("focusEvents"),
        props: {
          handleDOMEvents: {
            focus: (e, t) => {
              n.isFocused = !0;
              const r = n.state.tr.setMeta("focus", { event: t }).setMeta("addToHistory", !1);
              return e.dispatch(r), !1;
            },
            blur: (e, t) => {
              n.isFocused = !1;
              const r = n.state.tr.setMeta("blur", { event: t }).setMeta("addToHistory", !1);
              return e.dispatch(r), !1;
            }
          }
        }
      })
    ];
  }
}), Ob = ge.create({
  name: "keymap",
  addKeyboardShortcuts() {
    const n = () => this.editor.commands.first(({ commands: s }) => [
      () => s.undoInputRule(),
      () => s.command(({ tr: a }) => {
        const { selection: l, doc: c } = a, { empty: u, $anchor: d } = l, { pos: f, parent: p } = d, h = P.atStart(c).from === f;
        return !u || !h || !p.type.isTextblock || p.textContent.length ? !1 : s.clearNodes();
      }),
      () => s.deleteSelection(),
      () => s.joinBackward(),
      () => s.selectNodeBackward()
    ]), e = () => this.editor.commands.first(({ commands: s }) => [
      () => s.deleteSelection(),
      () => s.deleteCurrentNode(),
      () => s.joinForward(),
      () => s.selectNodeForward()
    ]), r = {
      Enter: () => this.editor.commands.first(({ commands: s }) => [
        () => s.newlineInCode(),
        () => s.createParagraphNear(),
        () => s.liftEmptyBlock(),
        () => s.splitBlock()
      ]),
      "Mod-Enter": () => this.editor.commands.exitCode(),
      Backspace: n,
      "Mod-Backspace": n,
      "Shift-Backspace": n,
      Delete: e,
      "Mod-Delete": e,
      "Mod-a": () => this.editor.commands.selectAll()
    }, i = {
      ...r
    }, o = {
      ...r,
      "Ctrl-h": n,
      "Alt-Backspace": n,
      "Ctrl-d": e,
      "Ctrl-Alt-Backspace": e,
      "Alt-Delete": e,
      "Alt-d": e,
      "Ctrl-a": () => this.editor.commands.selectTextblockStart(),
      "Ctrl-e": () => this.editor.commands.selectTextblockEnd()
    };
    return Fo() || jc() ? o : i;
  },
  addProseMirrorPlugins() {
    return [
      new U({
        key: new de("clearDocument"),
        appendTransaction: (n, e, t) => {
          if (!(n.some((h) => h.docChanged) && !e.doc.eq(t.doc)))
            return;
          const { empty: i, from: o, to: s } = e.selection, a = P.atStart(e.doc).from, l = P.atEnd(e.doc).to, c = o === a && s === l, u = t.doc.textBetween(0, t.doc.content.size, " ", " ").length === 0;
          if (i || !c || !u)
            return;
          const d = t.tr, f = ti({
            state: t,
            transaction: d
          }), { commands: p } = new ni({
            editor: this.editor,
            state: f
          });
          if (p.clearNodes(), !!d.steps.length)
            return d;
        }
      })
    ];
  }
}), Cb = ge.create({
  name: "tabindex",
  addProseMirrorPlugins() {
    return [
      new U({
        key: new de("tabindex"),
        props: {
          attributes: this.editor.isEditable ? { tabindex: "0" } : {}
        }
      })
    ];
  }
});
var Tb = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ClipboardTextSerializer: ay,
  Commands: wb,
  Editable: Sb,
  FocusEvents: Mb,
  Keymap: Ob,
  Tabindex: Cb
});
const Eb = `.ProseMirror {
  position: relative;
}

.ProseMirror {
  word-wrap: break-word;
  white-space: pre-wrap;
  white-space: break-spaces;
  -webkit-font-variant-ligatures: none;
  font-variant-ligatures: none;
  font-feature-settings: "liga" 0; /* the above doesn't seem to work in Edge */
}

.ProseMirror [contenteditable="false"] {
  white-space: normal;
}

.ProseMirror [contenteditable="false"] [contenteditable="true"] {
  white-space: pre-wrap;
}

.ProseMirror pre {
  white-space: pre-wrap;
}

img.ProseMirror-separator {
  display: inline !important;
  border: none !important;
  margin: 0 !important;
  width: 1px !important;
  height: 1px !important;
}

.ProseMirror-gapcursor {
  display: none;
  pointer-events: none;
  position: absolute;
  margin: 0;
}

.ProseMirror-gapcursor:after {
  content: "";
  display: block;
  position: absolute;
  top: -2px;
  width: 20px;
  border-top: 1px solid black;
  animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;
}

@keyframes ProseMirror-cursor-blink {
  to {
    visibility: hidden;
  }
}

.ProseMirror-hideselection *::selection {
  background: transparent;
}

.ProseMirror-hideselection *::-moz-selection {
  background: transparent;
}

.ProseMirror-hideselection * {
  caret-color: transparent;
}

.ProseMirror-focused .ProseMirror-gapcursor {
  display: block;
}

.tippy-box[data-animation=fade][data-state=hidden] {
  opacity: 0
}`;
function Ab(n, e) {
  const t = document.querySelector("style[data-tiptap-style]");
  if (t !== null)
    return t;
  const r = document.createElement("style");
  return e && r.setAttribute("nonce", e), r.setAttribute("data-tiptap-style", ""), r.innerHTML = n, document.getElementsByTagName("head")[0].appendChild(r), r;
}
class Nb extends _g {
  constructor(e = {}) {
    super(), this.isFocused = !1, this.extensionStorage = {}, this.options = {
      element: document.createElement("div"),
      content: "",
      injectCSS: !0,
      injectNonce: void 0,
      extensions: [],
      autofocus: !1,
      editable: !0,
      editorProps: {},
      parseOptions: {},
      enableInputRules: !0,
      enablePasteRules: !0,
      enableCoreExtensions: !0,
      onBeforeCreate: () => null,
      onCreate: () => null,
      onUpdate: () => null,
      onSelectionUpdate: () => null,
      onTransaction: () => null,
      onFocus: () => null,
      onBlur: () => null,
      onDestroy: () => null
    }, this.isCapturingTransaction = !1, this.capturedTransaction = null, this.setOptions(e), this.createExtensionManager(), this.createCommandManager(), this.createSchema(), this.on("beforeCreate", this.options.onBeforeCreate), this.emit("beforeCreate", { editor: this }), this.createView(), this.injectCSS(), this.on("create", this.options.onCreate), this.on("update", this.options.onUpdate), this.on("selectionUpdate", this.options.onSelectionUpdate), this.on("transaction", this.options.onTransaction), this.on("focus", this.options.onFocus), this.on("blur", this.options.onBlur), this.on("destroy", this.options.onDestroy), window.setTimeout(() => {
      this.isDestroyed || (this.commands.focus(this.options.autofocus), this.emit("create", { editor: this }));
    }, 0);
  }
  get storage() {
    return this.extensionStorage;
  }
  get commands() {
    return this.commandManager.commands;
  }
  chain() {
    return this.commandManager.chain();
  }
  can() {
    return this.commandManager.can();
  }
  injectCSS() {
    this.options.injectCSS && document && (this.css = Ab(Eb, this.options.injectNonce));
  }
  setOptions(e = {}) {
    this.options = {
      ...this.options,
      ...e
    }, !(!this.view || !this.state || this.isDestroyed) && (this.options.editorProps && this.view.setProps(this.options.editorProps), this.view.updateState(this.state));
  }
  setEditable(e) {
    this.setOptions({ editable: e }), this.emit("update", { editor: this, transaction: this.state.tr });
  }
  get isEditable() {
    return this.options.editable && this.view && this.view.editable;
  }
  get state() {
    return this.view.state;
  }
  registerPlugin(e, t) {
    const r = Lc(t) ? t(e, [...this.state.plugins]) : [...this.state.plugins, e], i = this.state.reconfigure({ plugins: r });
    this.view.updateState(i);
  }
  unregisterPlugin(e) {
    if (this.isDestroyed)
      return;
    const t = typeof e == "string" ? `${e}$` : e.key, r = this.state.reconfigure({
      plugins: this.state.plugins.filter((i) => !i.key.startsWith(t))
    });
    this.view.updateState(r);
  }
  createExtensionManager() {
    const t = [...this.options.enableCoreExtensions ? Object.values(Tb) : [], ...this.options.extensions].filter((r) => ["extension", "node", "mark"].includes(r == null ? void 0 : r.type));
    this.extensionManager = new dn(t, this);
  }
  createCommandManager() {
    this.commandManager = new ni({
      editor: this
    });
  }
  createSchema() {
    this.schema = this.extensionManager.schema;
  }
  createView() {
    const e = Hc(this.options.content, this.schema, this.options.parseOptions), t = Vc(e, this.options.autofocus);
    this.view = new Ef(this.options.element, {
      ...this.options.editorProps,
      dispatchTransaction: this.dispatchTransaction.bind(this),
      state: ln.create({
        doc: e,
        selection: t || void 0
      })
    });
    const r = this.state.reconfigure({
      plugins: this.extensionManager.plugins
    });
    this.view.updateState(r), this.createNodeViews();
    const i = this.view.dom;
    i.editor = this;
  }
  createNodeViews() {
    this.view.setProps({
      nodeViews: this.extensionManager.nodeViews
    });
  }
  captureTransaction(e) {
    this.isCapturingTransaction = !0, e(), this.isCapturingTransaction = !1;
    const t = this.capturedTransaction;
    return this.capturedTransaction = null, t;
  }
  dispatchTransaction(e) {
    if (this.isCapturingTransaction) {
      if (!this.capturedTransaction) {
        this.capturedTransaction = e;
        return;
      }
      e.steps.forEach((s) => {
        var a;
        return (a = this.capturedTransaction) === null || a === void 0 ? void 0 : a.step(s);
      });
      return;
    }
    const t = this.state.apply(e), r = !this.state.selection.eq(t.selection);
    this.view.updateState(t), this.emit("transaction", {
      editor: this,
      transaction: e
    }), r && this.emit("selectionUpdate", {
      editor: this,
      transaction: e
    });
    const i = e.getMeta("focus"), o = e.getMeta("blur");
    i && this.emit("focus", {
      editor: this,
      event: i.event,
      transaction: e
    }), o && this.emit("blur", {
      editor: this,
      event: o.event,
      transaction: e
    }), !(!e.docChanged || e.getMeta("preventUpdate")) && this.emit("update", {
      editor: this,
      transaction: e
    });
  }
  getAttributes(e) {
    return Zy(this.state, e);
  }
  isActive(e, t) {
    const r = typeof e == "string" ? e : null, i = typeof e == "string" ? t : e;
    return Qy(this.state, r, i);
  }
  getJSON() {
    return this.state.doc.toJSON();
  }
  getHTML() {
    return Gy(this.state.doc.content, this.schema);
  }
  getText(e) {
    const { blockSeparator: t = `

`, textSerializers: r = {} } = e || {};
    return Yy(this.state.doc, {
      blockSeparator: t,
      textSerializers: {
        ...r,
        ...Fc(this.schema)
      }
    });
  }
  get isEmpty() {
    return eb(this.state.doc);
  }
  getCharacterCount() {
    return console.warn('[tiptap warn]: "editor.getCharacterCount()" is deprecated. Please use "editor.storage.characterCount.characters()" instead.'), this.state.doc.content.size - 2;
  }
  destroy() {
    this.emit("destroy"), this.view && this.view.destroy(), this.removeAllListeners();
  }
  get isDestroyed() {
    var e;
    return !(!((e = this.view) === null || e === void 0) && e.docView);
  }
}
function Mn(n) {
  return new ii({
    find: n.find,
    handler: ({ state: e, range: t, match: r }) => {
      const i = R(n.getAttributes, void 0, r);
      if (i === !1 || i === null)
        return null;
      const { tr: o } = e, s = r[r.length - 1], a = r[0];
      let l = t.to;
      if (s) {
        const c = a.search(/\S/), u = t.from + a.indexOf(s), d = u + s.length;
        if (qc(t.from, t.to, e.doc).filter((p) => p.mark.type.excluded.find((m) => m === n.type && m !== p.mark.type)).filter((p) => p.to > u).length)
          return null;
        d < t.to && o.delete(d, t.to), u > t.from && o.delete(t.from + c, u), l = t.from + c + s.length, o.addMark(t.from + c, l, n.type.create(i || {})), o.removeStoredMark(n.type);
      }
    }
  });
}
function Db(n) {
  return new ii({
    find: n.find,
    handler: ({ state: e, range: t, match: r }) => {
      const i = R(n.getAttributes, void 0, r) || {}, { tr: o } = e, s = t.from;
      let a = t.to;
      if (r[1]) {
        const l = r[0].lastIndexOf(r[1]);
        let c = s + l;
        c > a ? c = a : a = c + r[1].length;
        const u = r[0][r[0].length - 1];
        o.insertText(u, s + r[0].length - 1), o.replaceWith(c, a, n.type.create(i));
      } else
        r[0] && o.replaceWith(s, a, n.type.create(i));
    }
  });
}
function lo(n) {
  return new ii({
    find: n.find,
    handler: ({ state: e, range: t, match: r }) => {
      const i = e.doc.resolve(t.from), o = R(n.getAttributes, void 0, r) || {};
      if (!i.node(-1).canReplaceWith(i.index(-1), i.indexAfter(-1), n.type))
        return null;
      e.tr.delete(t.from, t.to).setBlockType(t.from, t.from, n.type, o);
    }
  });
}
function Vo(n) {
  return new ii({
    find: n.find,
    handler: ({ state: e, range: t, match: r }) => {
      const i = R(n.getAttributes, void 0, r) || {}, o = e.tr.delete(t.from, t.to), a = o.doc.resolve(t.from).blockRange(), l = a && po(a, n.type, i);
      if (!l)
        return null;
      o.wrap(a, l);
      const c = o.doc.resolve(t.from - 1).nodeBefore;
      c && c.type === n.type && Ze(o.doc, t.from - 1) && (!n.joinPredicate || n.joinPredicate(r, c)) && o.join(t.from - 1);
    }
  });
}
class Mt {
  constructor(e = {}) {
    this.type = "mark", this.name = "mark", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...e
    }, this.name = this.config.name, e.defaultOptions && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = R(C(this, "addOptions", {
      name: this.name
    }))), this.storage = R(C(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(e = {}) {
    return new Mt(e);
  }
  configure(e = {}) {
    const t = this.extend();
    return t.options = oi(this.options, e), t.storage = R(C(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
  extend(e = {}) {
    const t = new Mt(e);
    return t.parent = this, this.child = t, t.name = e.name ? e.name : t.parent.name, e.defaultOptions && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${t.name}".`), t.options = R(C(t, "addOptions", {
      name: t.name
    })), t.storage = R(C(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
  static handleExit({ editor: e, mark: t }) {
    const { tr: r } = e.state, i = e.state.selection.$from;
    if (i.pos === i.end()) {
      const s = i.marks();
      if (!!!s.find((c) => (c == null ? void 0 : c.type.name) === t.name))
        return !1;
      const l = s.find((c) => (c == null ? void 0 : c.type.name) === t.name);
      return l && r.removeStoredMark(l), r.insertText(" ", i.pos), e.view.dispatch(r), !0;
    }
    return !1;
  }
}
class ye {
  constructor(e = {}) {
    this.type = "node", this.name = "node", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...e
    }, this.name = this.config.name, e.defaultOptions && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = R(C(this, "addOptions", {
      name: this.name
    }))), this.storage = R(C(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(e = {}) {
    return new ye(e);
  }
  configure(e = {}) {
    const t = this.extend();
    return t.options = oi(this.options, e), t.storage = R(C(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
  extend(e = {}) {
    const t = new ye(e);
    return t.parent = this, this.child = t, t.name = e.name ? e.name : t.parent.name, e.defaultOptions && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${t.name}".`), t.options = R(C(t, "addOptions", {
      name: t.name
    })), t.storage = R(C(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
}
function On(n) {
  return new ty({
    find: n.find,
    handler: ({ state: e, range: t, match: r }) => {
      const i = R(n.getAttributes, void 0, r);
      if (i === !1 || i === null)
        return null;
      const { tr: o } = e, s = r[r.length - 1], a = r[0];
      let l = t.to;
      if (s) {
        const c = a.search(/\S/), u = t.from + a.indexOf(s), d = u + s.length;
        if (qc(t.from, t.to, e.doc).filter((p) => p.mark.type.excluded.find((m) => m === n.type && m !== p.mark.type)).filter((p) => p.to > u).length)
          return null;
        d < t.to && o.delete(d, t.to), u > t.from && o.delete(t.from + c, u), l = t.from + c + s.length, o.addMark(t.from + c, l, n.type.create(i || {})), o.removeStoredMark(n.type);
      }
    }
  });
}
class Ib {
  constructor({ editor: e, element: t, view: r, tippyOptions: i = {}, shouldShow: o }) {
    this.preventHide = !1, this.shouldShow = ({ view: s, state: a }) => {
      const { selection: l } = a, { $anchor: c, empty: u } = l, d = c.depth === 1, f = c.parent.isTextblock && !c.parent.type.spec.code && !c.parent.textContent;
      return !(!s.hasFocus() || !u || !d || !f || !this.editor.isEditable);
    }, this.mousedownHandler = () => {
      this.preventHide = !0;
    }, this.focusHandler = () => {
      setTimeout(() => this.update(this.editor.view));
    }, this.blurHandler = ({ event: s }) => {
      var a;
      if (this.preventHide) {
        this.preventHide = !1;
        return;
      }
      (s == null ? void 0 : s.relatedTarget) && ((a = this.element.parentNode) === null || a === void 0 ? void 0 : a.contains(s.relatedTarget)) || this.hide();
    }, this.tippyBlurHandler = (s) => {
      this.blurHandler({ event: s });
    }, this.editor = e, this.element = t, this.view = r, o && (this.shouldShow = o), this.element.addEventListener("mousedown", this.mousedownHandler, { capture: !0 }), this.editor.on("focus", this.focusHandler), this.editor.on("blur", this.blurHandler), this.tippyOptions = i, this.element.remove(), this.element.style.visibility = "visible";
  }
  createTooltip() {
    const { element: e } = this.editor.options, t = !!e.parentElement;
    this.tippy || !t || (this.tippy = Cn(e, {
      duration: 0,
      getReferenceClientRect: null,
      content: this.element,
      interactive: !0,
      trigger: "manual",
      placement: "right",
      hideOnClick: "toggle",
      ...this.tippyOptions
    }), this.tippy.popper.firstChild && this.tippy.popper.firstChild.addEventListener("blur", this.tippyBlurHandler));
  }
  update(e, t) {
    var r, i, o;
    const { state: s } = e, { doc: a, selection: l } = s, { from: c, to: u } = l;
    if (t && t.doc.eq(a) && t.selection.eq(l))
      return;
    if (this.createTooltip(), !((r = this.shouldShow) === null || r === void 0 ? void 0 : r.call(this, {
      editor: this.editor,
      view: e,
      state: s,
      oldState: t
    }))) {
      this.hide();
      return;
    }
    (i = this.tippy) === null || i === void 0 || i.setProps({
      getReferenceClientRect: ((o = this.tippyOptions) === null || o === void 0 ? void 0 : o.getReferenceClientRect) || (() => tb(e, c, u))
    }), this.show();
  }
  show() {
    var e;
    (e = this.tippy) === null || e === void 0 || e.show();
  }
  hide() {
    var e;
    (e = this.tippy) === null || e === void 0 || e.hide();
  }
  destroy() {
    var e, t;
    !((e = this.tippy) === null || e === void 0) && e.popper.firstChild && this.tippy.popper.firstChild.removeEventListener("blur", this.tippyBlurHandler), (t = this.tippy) === null || t === void 0 || t.destroy(), this.element.removeEventListener("mousedown", this.mousedownHandler, { capture: !0 }), this.editor.off("focus", this.focusHandler), this.editor.off("blur", this.blurHandler);
  }
}
const Kc = (n) => new U({
  key: typeof n.pluginKey == "string" ? new de(n.pluginKey) : n.pluginKey,
  view: (e) => new Ib({ view: e, ...n })
});
ge.create({
  name: "floatingMenu",
  addOptions() {
    return {
      element: null,
      tippyOptions: {},
      pluginKey: "floatingMenu",
      shouldShow: null
    };
  },
  addProseMirrorPlugins() {
    return this.options.element ? [
      Kc({
        pluginKey: this.options.pluginKey,
        editor: this.editor,
        element: this.options.element,
        tippyOptions: this.options.tippyOptions,
        shouldShow: this.options.shouldShow
      })
    ] : [];
  }
});
Y({
  name: "BubbleMenu",
  props: {
    pluginKey: {
      type: null,
      default: "bubbleMenu"
    },
    editor: {
      type: Object,
      required: !0
    },
    updateDelay: {
      type: Number,
      default: void 0
    },
    tippyOptions: {
      type: Object,
      default: () => ({})
    },
    shouldShow: {
      type: Function,
      default: null
    }
  },
  setup(n, { slots: e }) {
    const t = Jr(null);
    return co(() => {
      const { updateDelay: r, editor: i, pluginKey: o, shouldShow: s, tippyOptions: a } = n;
      i.registerPlugin(Rc({
        updateDelay: r,
        editor: i,
        element: t.value,
        pluginKey: o,
        shouldShow: s,
        tippyOptions: a
      }));
    }), uo(() => {
      const { pluginKey: r, editor: i } = n;
      i.unregisterPlugin(r);
    }), () => {
      var r;
      return $t("div", { ref: t }, (r = e.default) === null || r === void 0 ? void 0 : r.call(e));
    };
  }
});
function Ma(n) {
  return uu((e, t) => ({
    get() {
      return e(), n;
    },
    set(r) {
      n = r, requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          t();
        });
      });
    }
  }));
}
class Pb extends Nb {
  constructor(e = {}) {
    return super(e), this.vueRenderers = ru(/* @__PURE__ */ new Map()), this.contentComponent = null, this.reactiveState = Ma(this.view.state), this.reactiveExtensionStorage = Ma(this.extensionStorage), this.on("transaction", () => {
      this.reactiveState.value = this.view.state, this.reactiveExtensionStorage.value = this.extensionStorage;
    }), iu(this);
  }
  get state() {
    return this.reactiveState ? this.reactiveState.value : this.view.state;
  }
  get storage() {
    return this.reactiveExtensionStorage ? this.reactiveExtensionStorage.value : super.storage;
  }
  registerPlugin(e, t) {
    super.registerPlugin(e, t), this.reactiveState.value = this.view.state;
  }
  unregisterPlugin(e) {
    super.unregisterPlugin(e), this.reactiveState.value = this.view.state;
  }
}
const Rb = Y({
  name: "EditorContent",
  props: {
    editor: {
      default: null,
      type: Object
    }
  },
  setup(n) {
    const e = Jr(), t = ou();
    return su(() => {
      const r = n.editor;
      r && r.options.element && e.value && au(() => {
        if (!e.value || !r.options.element.firstChild)
          return;
        const i = lu(e.value);
        e.value.append(...r.options.element.childNodes), r.contentComponent = t.ctx._, r.setOptions({
          element: i
        }), r.createNodeViews();
      });
    }), uo(() => {
      const r = n.editor;
      if (!r || (r.isDestroyed || r.view.setProps({
        nodeViews: {}
      }), r.contentComponent = null, !r.options.element.firstChild))
        return;
      const i = document.createElement("div");
      i.append(...r.options.element.childNodes), r.setOptions({
        element: i
      });
    }), { rootEl: e };
  },
  render() {
    const n = [];
    return this.editor && this.editor.vueRenderers.forEach((e) => {
      const t = $t(cu, {
        to: e.teleportElement,
        key: e.id
      }, $t(e.component, {
        ref: e.id,
        ...e.props
      }));
      n.push(t);
    }), $t("div", {
      ref: (e) => {
        this.rootEl = e;
      }
    }, ...n);
  }
});
Y({
  name: "FloatingMenu",
  props: {
    pluginKey: {
      type: null,
      default: "floatingMenu"
    },
    editor: {
      type: Object,
      required: !0
    },
    tippyOptions: {
      type: Object,
      default: () => ({})
    },
    shouldShow: {
      type: Function,
      default: null
    }
  },
  setup(n, { slots: e }) {
    const t = Jr(null);
    return co(() => {
      const { pluginKey: r, editor: i, tippyOptions: o, shouldShow: s } = n;
      i.registerPlugin(Kc({
        pluginKey: r,
        editor: i,
        element: t.value,
        tippyOptions: o,
        shouldShow: s
      }));
    }), uo(() => {
      const { pluginKey: r, editor: i } = n;
      i.unregisterPlugin(r);
    }), () => {
      var r;
      return $t("div", { ref: t }, (r = e.default) === null || r === void 0 ? void 0 : r.call(e));
    };
  }
});
Y({
  props: {
    as: {
      type: String,
      default: "div"
    }
  },
  render() {
    return $t(this.as, {
      style: {
        whiteSpace: "pre-wrap"
      },
      "data-node-view-content": ""
    });
  }
});
Y({
  props: {
    as: {
      type: String,
      default: "div"
    }
  },
  inject: ["onDragStart", "decorationClasses"],
  render() {
    var n, e;
    return $t(this.as, {
      class: this.decorationClasses,
      style: {
        whiteSpace: "normal"
      },
      "data-node-view-wrapper": "",
      onDragstart: this.onDragStart
    }, (e = (n = this.$slots).default) === null || e === void 0 ? void 0 : e.call(n));
  }
});
const Bb = /^\s*>\s$/, Lb = ye.create({
  name: "blockquote",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  content: "block+",
  group: "block",
  defining: !0,
  parseHTML() {
    return [
      { tag: "blockquote" }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["blockquote", ue(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      setBlockquote: () => ({ commands: n }) => n.wrapIn(this.name),
      toggleBlockquote: () => ({ commands: n }) => n.toggleWrap(this.name),
      unsetBlockquote: () => ({ commands: n }) => n.lift(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-b": () => this.editor.commands.toggleBlockquote()
    };
  },
  addInputRules() {
    return [
      Vo({
        find: Bb,
        type: this.type
      })
    ];
  }
}), $b = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))$/, Fb = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))/g, zb = /(?:^|\s)((?:__)((?:[^__]+))(?:__))$/, Vb = /(?:^|\s)((?:__)((?:[^__]+))(?:__))/g, jb = Mt.create({
  name: "bold",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "strong"
      },
      {
        tag: "b",
        getAttrs: (n) => n.style.fontWeight !== "normal" && null
      },
      {
        style: "font-weight",
        getAttrs: (n) => /^(bold(er)?|[5-9]\d{2,})$/.test(n) && null
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["strong", ue(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      setBold: () => ({ commands: n }) => n.setMark(this.name),
      toggleBold: () => ({ commands: n }) => n.toggleMark(this.name),
      unsetBold: () => ({ commands: n }) => n.unsetMark(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-b": () => this.editor.commands.toggleBold(),
      "Mod-B": () => this.editor.commands.toggleBold()
    };
  },
  addInputRules() {
    return [
      Mn({
        find: $b,
        type: this.type
      }),
      Mn({
        find: zb,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      On({
        find: Fb,
        type: this.type
      }),
      On({
        find: Vb,
        type: this.type
      })
    ];
  }
}), Hb = /^\s*([-+*])\s$/, Wb = ye.create({
  name: "bulletList",
  addOptions() {
    return {
      itemTypeName: "listItem",
      HTMLAttributes: {}
    };
  },
  group: "block list",
  content() {
    return `${this.options.itemTypeName}+`;
  },
  parseHTML() {
    return [
      { tag: "ul" }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["ul", ue(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      toggleBulletList: () => ({ commands: n }) => n.toggleList(this.name, this.options.itemTypeName)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-8": () => this.editor.commands.toggleBulletList()
    };
  },
  addInputRules() {
    return [
      Vo({
        find: Hb,
        type: this.type
      })
    ];
  }
}), qb = /(?:^|\s)((?:`)((?:[^`]+))(?:`))$/, Kb = /(?:^|\s)((?:`)((?:[^`]+))(?:`))/g, Jb = Mt.create({
  name: "code",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  excludes: "_",
  code: !0,
  exitable: !0,
  parseHTML() {
    return [
      { tag: "code" }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["code", ue(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      setCode: () => ({ commands: n }) => n.setMark(this.name),
      toggleCode: () => ({ commands: n }) => n.toggleMark(this.name),
      unsetCode: () => ({ commands: n }) => n.unsetMark(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-e": () => this.editor.commands.toggleCode()
    };
  },
  addInputRules() {
    return [
      Mn({
        find: qb,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      On({
        find: Kb,
        type: this.type
      })
    ];
  }
}), _b = /^```([a-z]+)?[\s\n]$/, Ub = /^~~~([a-z]+)?[\s\n]$/, Gb = ye.create({
  name: "codeBlock",
  addOptions() {
    return {
      languageClassPrefix: "language-",
      exitOnTripleEnter: !0,
      exitOnArrowDown: !0,
      HTMLAttributes: {}
    };
  },
  content: "text*",
  marks: "",
  group: "block",
  code: !0,
  defining: !0,
  addAttributes() {
    return {
      language: {
        default: null,
        parseHTML: (n) => {
          var e;
          const { languageClassPrefix: t } = this.options, o = [...((e = n.firstElementChild) === null || e === void 0 ? void 0 : e.classList) || []].filter((s) => s.startsWith(t)).map((s) => s.replace(t, ""))[0];
          return o || null;
        },
        rendered: !1
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: "pre",
        preserveWhitespace: "full"
      }
    ];
  },
  renderHTML({ node: n, HTMLAttributes: e }) {
    return [
      "pre",
      ue(this.options.HTMLAttributes, e),
      [
        "code",
        {
          class: n.attrs.language ? this.options.languageClassPrefix + n.attrs.language : null
        },
        0
      ]
    ];
  },
  addCommands() {
    return {
      setCodeBlock: (n) => ({ commands: e }) => e.setNode(this.name, n),
      toggleCodeBlock: (n) => ({ commands: e }) => e.toggleNode(this.name, "paragraph", n)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Alt-c": () => this.editor.commands.toggleCodeBlock(),
      Backspace: () => {
        const { empty: n, $anchor: e } = this.editor.state.selection, t = e.pos === 1;
        return !n || e.parent.type.name !== this.name ? !1 : t || !e.parent.textContent.length ? this.editor.commands.clearNodes() : !1;
      },
      Enter: ({ editor: n }) => {
        if (!this.options.exitOnTripleEnter)
          return !1;
        const { state: e } = n, { selection: t } = e, { $from: r, empty: i } = t;
        if (!i || r.parent.type !== this.type)
          return !1;
        const o = r.parentOffset === r.parent.nodeSize - 2, s = r.parent.textContent.endsWith(`

`);
        return !o || !s ? !1 : n.chain().command(({ tr: a }) => (a.delete(r.pos - 2, r.pos), !0)).exitCode().run();
      },
      ArrowDown: ({ editor: n }) => {
        if (!this.options.exitOnArrowDown)
          return !1;
        const { state: e } = n, { selection: t, doc: r } = e, { $from: i, empty: o } = t;
        if (!o || i.parent.type !== this.type || !(i.parentOffset === i.parent.nodeSize - 2))
          return !1;
        const a = i.after();
        return a === void 0 || r.nodeAt(a) ? !1 : n.commands.exitCode();
      }
    };
  },
  addInputRules() {
    return [
      lo({
        find: _b,
        type: this.type,
        getAttributes: (n) => ({
          language: n[1]
        })
      }),
      lo({
        find: Ub,
        type: this.type,
        getAttributes: (n) => ({
          language: n[1]
        })
      })
    ];
  },
  addProseMirrorPlugins() {
    return [
      new U({
        key: new de("codeBlockVSCodeHandler"),
        props: {
          handlePaste: (n, e) => {
            if (!e.clipboardData || this.editor.isActive(this.type.name))
              return !1;
            const t = e.clipboardData.getData("text/plain"), r = e.clipboardData.getData("vscode-editor-data"), i = r ? JSON.parse(r) : void 0, o = i == null ? void 0 : i.mode;
            if (!t || !o)
              return !1;
            const { tr: s } = n.state;
            return s.replaceSelectionWith(this.type.create({ language: o })), s.setSelection(D.near(s.doc.resolve(Math.max(0, s.selection.from - 2)))), s.insertText(t.replace(/\r\n?/g, `
`)), s.setMeta("paste", !0), n.dispatch(s), !0;
          }
        }
      })
    ];
  }
}), Yb = ye.create({
  name: "doc",
  topNode: !0,
  content: "block+"
});
function Xb(n = {}) {
  return new U({
    view(e) {
      return new Zb(e, n);
    }
  });
}
class Zb {
  constructor(e, t) {
    this.editorView = e, this.cursorPos = null, this.element = null, this.timeout = -1, this.width = t.width || 1, this.color = t.color || "black", this.class = t.class, this.handlers = ["dragover", "dragend", "drop", "dragleave"].map((r) => {
      let i = (o) => {
        this[r](o);
      };
      return e.dom.addEventListener(r, i), { name: r, handler: i };
    });
  }
  destroy() {
    this.handlers.forEach(({ name: e, handler: t }) => this.editorView.dom.removeEventListener(e, t));
  }
  update(e, t) {
    this.cursorPos != null && t.doc != e.state.doc && (this.cursorPos > e.state.doc.content.size ? this.setCursor(null) : this.updateOverlay());
  }
  setCursor(e) {
    e != this.cursorPos && (this.cursorPos = e, e == null ? (this.element.parentNode.removeChild(this.element), this.element = null) : this.updateOverlay());
  }
  updateOverlay() {
    let e = this.editorView.state.doc.resolve(this.cursorPos), t;
    if (!e.parent.inlineContent) {
      let s = e.nodeBefore, a = e.nodeAfter;
      if (s || a) {
        let l = this.editorView.nodeDOM(this.cursorPos - (s ? s.nodeSize : 0));
        if (l) {
          let c = l.getBoundingClientRect(), u = s ? c.bottom : c.top;
          s && a && (u = (u + this.editorView.nodeDOM(this.cursorPos).getBoundingClientRect().top) / 2), t = { left: c.left, right: c.right, top: u - this.width / 2, bottom: u + this.width / 2 };
        }
      }
    }
    if (!t) {
      let s = this.editorView.coordsAtPos(this.cursorPos);
      t = { left: s.left - this.width / 2, right: s.left + this.width / 2, top: s.top, bottom: s.bottom };
    }
    let r = this.editorView.dom.offsetParent;
    this.element || (this.element = r.appendChild(document.createElement("div")), this.class && (this.element.className = this.class), this.element.style.cssText = "position: absolute; z-index: 50; pointer-events: none; background-color: " + this.color);
    let i, o;
    if (!r || r == document.body && getComputedStyle(r).position == "static")
      i = -pageXOffset, o = -pageYOffset;
    else {
      let s = r.getBoundingClientRect();
      i = s.left - r.scrollLeft, o = s.top - r.scrollTop;
    }
    this.element.style.left = t.left - i + "px", this.element.style.top = t.top - o + "px", this.element.style.width = t.right - t.left + "px", this.element.style.height = t.bottom - t.top + "px";
  }
  scheduleRemoval(e) {
    clearTimeout(this.timeout), this.timeout = setTimeout(() => this.setCursor(null), e);
  }
  dragover(e) {
    if (!this.editorView.editable)
      return;
    let t = this.editorView.posAtCoords({ left: e.clientX, top: e.clientY }), r = t && t.inside >= 0 && this.editorView.state.doc.nodeAt(t.inside), i = r && r.type.spec.disableDropCursor, o = typeof i == "function" ? i(this.editorView, t, e) : i;
    if (t && !o) {
      let s = t.pos;
      if (this.editorView.dragging && this.editorView.dragging.slice && (s = Ga(this.editorView.state.doc, s, this.editorView.dragging.slice), s == null))
        return this.setCursor(null);
      this.setCursor(s), this.scheduleRemoval(5e3);
    }
  }
  dragend() {
    this.scheduleRemoval(20);
  }
  drop() {
    this.scheduleRemoval(20);
  }
  dragleave(e) {
    (e.target == this.editorView.dom || !this.editorView.dom.contains(e.relatedTarget)) && this.setCursor(null);
  }
}
const Qb = ge.create({
  name: "dropCursor",
  addOptions() {
    return {
      color: "currentColor",
      width: 1,
      class: void 0
    };
  },
  addProseMirrorPlugins() {
    return [
      Xb(this.options)
    ];
  }
});
class q extends P {
  constructor(e) {
    super(e, e);
  }
  map(e, t) {
    let r = e.resolve(t.map(this.head));
    return q.valid(r) ? new q(r) : P.near(r);
  }
  content() {
    return S.empty;
  }
  eq(e) {
    return e instanceof q && e.head == this.head;
  }
  toJSON() {
    return { type: "gapcursor", pos: this.head };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for GapCursor.fromJSON");
    return new q(e.resolve(t.pos));
  }
  getBookmark() {
    return new jo(this.anchor);
  }
  static valid(e) {
    let t = e.parent;
    if (t.isTextblock || !ev(e) || !tv(e))
      return !1;
    let r = t.type.spec.allowGapCursor;
    if (r != null)
      return r;
    let i = t.contentMatchAt(e.index()).defaultType;
    return i && i.isTextblock;
  }
  static findGapCursorFrom(e, t, r = !1) {
    e:
      for (; ; ) {
        if (!r && q.valid(e))
          return e;
        let i = e.pos, o = null;
        for (let s = e.depth; ; s--) {
          let a = e.node(s);
          if (t > 0 ? e.indexAfter(s) < a.childCount : e.index(s) > 0) {
            o = a.child(t > 0 ? e.indexAfter(s) : e.index(s) - 1);
            break;
          } else if (s == 0)
            return null;
          i += t;
          let l = e.doc.resolve(i);
          if (q.valid(l))
            return l;
        }
        for (; ; ) {
          let s = t > 0 ? o.firstChild : o.lastChild;
          if (!s) {
            if (o.isAtom && !o.isText && !N.isSelectable(o)) {
              e = e.doc.resolve(i + o.nodeSize * t), r = !1;
              continue e;
            }
            break;
          }
          o = s, i += t;
          let a = e.doc.resolve(i);
          if (q.valid(a))
            return a;
        }
        return null;
      }
  }
}
q.prototype.visible = !1;
q.findFrom = q.findGapCursorFrom;
P.jsonID("gapcursor", q);
class jo {
  constructor(e) {
    this.pos = e;
  }
  map(e) {
    return new jo(e.map(this.pos));
  }
  resolve(e) {
    let t = e.resolve(this.pos);
    return q.valid(t) ? new q(t) : P.near(t);
  }
}
function ev(n) {
  for (let e = n.depth; e >= 0; e--) {
    let t = n.index(e), r = n.node(e);
    if (t == 0) {
      if (r.type.spec.isolating)
        return !0;
      continue;
    }
    for (let i = r.child(t - 1); ; i = i.lastChild) {
      if (i.childCount == 0 && !i.inlineContent || i.isAtom || i.type.spec.isolating)
        return !0;
      if (i.inlineContent)
        return !1;
    }
  }
  return !0;
}
function tv(n) {
  for (let e = n.depth; e >= 0; e--) {
    let t = n.indexAfter(e), r = n.node(e);
    if (t == r.childCount) {
      if (r.type.spec.isolating)
        return !0;
      continue;
    }
    for (let i = r.child(t); ; i = i.firstChild) {
      if (i.childCount == 0 && !i.inlineContent || i.isAtom || i.type.spec.isolating)
        return !0;
      if (i.inlineContent)
        return !1;
    }
  }
  return !0;
}
function nv() {
  return new U({
    props: {
      decorations: sv,
      createSelectionBetween(n, e, t) {
        return e.pos == t.pos && q.valid(t) ? new q(t) : null;
      },
      handleClick: iv,
      handleKeyDown: rv,
      handleDOMEvents: { beforeinput: ov }
    }
  });
}
const rv = Pl({
  ArrowLeft: vr("horiz", -1),
  ArrowRight: vr("horiz", 1),
  ArrowUp: vr("vert", -1),
  ArrowDown: vr("vert", 1)
});
function vr(n, e) {
  const t = n == "vert" ? e > 0 ? "down" : "up" : e > 0 ? "right" : "left";
  return function(r, i, o) {
    let s = r.selection, a = e > 0 ? s.$to : s.$from, l = s.empty;
    if (s instanceof D) {
      if (!o.endOfTextblock(t) || a.depth == 0)
        return !1;
      l = !1, a = r.doc.resolve(e > 0 ? a.after() : a.before());
    }
    let c = q.findGapCursorFrom(a, e, l);
    return c ? (i && i(r.tr.setSelection(new q(c))), !0) : !1;
  };
}
function iv(n, e, t) {
  if (!n || !n.editable)
    return !1;
  let r = n.state.doc.resolve(e);
  if (!q.valid(r))
    return !1;
  let i = n.posAtCoords({ left: t.clientX, top: t.clientY });
  return i && i.inside > -1 && N.isSelectable(n.state.doc.nodeAt(i.inside)) ? !1 : (n.dispatch(n.state.tr.setSelection(new q(r))), !0);
}
function ov(n, e) {
  if (e.inputType != "insertCompositionText" || !(n.state.selection instanceof q))
    return !1;
  let { $from: t } = n.state.selection, r = t.parent.contentMatchAt(t.index()).findWrapping(n.state.schema.nodes.text);
  if (!r)
    return !1;
  let i = x.empty;
  for (let s = r.length - 1; s >= 0; s--)
    i = x.from(r[s].createAndFill(null, i));
  let o = n.state.tr.replace(t.pos, t.pos, new S(i, 0, 0));
  return o.setSelection(D.near(o.doc.resolve(t.pos + 1))), n.dispatch(o), !1;
}
function sv(n) {
  if (!(n.selection instanceof q))
    return null;
  let e = document.createElement("div");
  return e.className = "ProseMirror-gapcursor", K.create(n.doc, [Te.widget(n.selection.head, e, { key: "gapcursor" })]);
}
const av = ge.create({
  name: "gapCursor",
  addProseMirrorPlugins() {
    return [
      nv()
    ];
  },
  extendNodeSchema(n) {
    var e;
    const t = {
      name: n.name,
      options: n.options,
      storage: n.storage
    };
    return {
      allowGapCursor: (e = R(C(n, "allowGapCursor", t))) !== null && e !== void 0 ? e : null
    };
  }
}), lv = ye.create({
  name: "hardBreak",
  addOptions() {
    return {
      keepMarks: !0,
      HTMLAttributes: {}
    };
  },
  inline: !0,
  group: "inline",
  selectable: !1,
  parseHTML() {
    return [
      { tag: "br" }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["br", ue(this.options.HTMLAttributes, n)];
  },
  renderText() {
    return `
`;
  },
  addCommands() {
    return {
      setHardBreak: () => ({ commands: n, chain: e, state: t, editor: r }) => n.first([
        () => n.exitCode(),
        () => n.command(() => {
          const { selection: i, storedMarks: o } = t;
          if (i.$from.parent.type.spec.isolating)
            return !1;
          const { keepMarks: s } = this.options, { splittableMarks: a } = r.extensionManager, l = o || i.$to.parentOffset && i.$from.marks();
          return e().insertContent({ type: this.name }).command(({ tr: c, dispatch: u }) => {
            if (u && l && s) {
              const d = l.filter((f) => a.includes(f.type.name));
              c.ensureMarks(d);
            }
            return !0;
          }).run();
        })
      ])
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Enter": () => this.editor.commands.setHardBreak(),
      "Shift-Enter": () => this.editor.commands.setHardBreak()
    };
  }
}), cv = ye.create({
  name: "heading",
  addOptions() {
    return {
      levels: [1, 2, 3, 4, 5, 6],
      HTMLAttributes: {}
    };
  },
  content: "inline*",
  group: "block",
  defining: !0,
  addAttributes() {
    return {
      level: {
        default: 1,
        rendered: !1
      }
    };
  },
  parseHTML() {
    return this.options.levels.map((n) => ({
      tag: `h${n}`,
      attrs: { level: n }
    }));
  },
  renderHTML({ node: n, HTMLAttributes: e }) {
    return [`h${this.options.levels.includes(n.attrs.level) ? n.attrs.level : this.options.levels[0]}`, ue(this.options.HTMLAttributes, e), 0];
  },
  addCommands() {
    return {
      setHeading: (n) => ({ commands: e }) => this.options.levels.includes(n.level) ? e.setNode(this.name, n) : !1,
      toggleHeading: (n) => ({ commands: e }) => this.options.levels.includes(n.level) ? e.toggleNode(this.name, "paragraph", n) : !1
    };
  },
  addKeyboardShortcuts() {
    return this.options.levels.reduce((n, e) => ({
      ...n,
      [`Mod-Alt-${e}`]: () => this.editor.commands.toggleHeading({ level: e })
    }), {});
  },
  addInputRules() {
    return this.options.levels.map((n) => lo({
      find: new RegExp(`^(#{1,${n}})\\s$`),
      type: this.type,
      getAttributes: {
        level: n
      }
    }));
  }
});
var Kr = 200, te = function() {
};
te.prototype.append = function(e) {
  return e.length ? (e = te.from(e), !this.length && e || e.length < Kr && this.leafAppend(e) || this.length < Kr && e.leafPrepend(this) || this.appendInner(e)) : this;
};
te.prototype.prepend = function(e) {
  return e.length ? te.from(e).append(this) : this;
};
te.prototype.appendInner = function(e) {
  return new uv(this, e);
};
te.prototype.slice = function(e, t) {
  return e === void 0 && (e = 0), t === void 0 && (t = this.length), e >= t ? te.empty : this.sliceInner(Math.max(0, e), Math.min(this.length, t));
};
te.prototype.get = function(e) {
  if (!(e < 0 || e >= this.length))
    return this.getInner(e);
};
te.prototype.forEach = function(e, t, r) {
  t === void 0 && (t = 0), r === void 0 && (r = this.length), t <= r ? this.forEachInner(e, t, r, 0) : this.forEachInvertedInner(e, t, r, 0);
};
te.prototype.map = function(e, t, r) {
  t === void 0 && (t = 0), r === void 0 && (r = this.length);
  var i = [];
  return this.forEach(function(o, s) {
    return i.push(e(o, s));
  }, t, r), i;
};
te.from = function(e) {
  return e instanceof te ? e : e && e.length ? new Jc(e) : te.empty;
};
var Jc = /* @__PURE__ */ function(n) {
  function e(r) {
    n.call(this), this.values = r;
  }
  n && (e.__proto__ = n), e.prototype = Object.create(n && n.prototype), e.prototype.constructor = e;
  var t = { length: { configurable: !0 }, depth: { configurable: !0 } };
  return e.prototype.flatten = function() {
    return this.values;
  }, e.prototype.sliceInner = function(i, o) {
    return i == 0 && o == this.length ? this : new e(this.values.slice(i, o));
  }, e.prototype.getInner = function(i) {
    return this.values[i];
  }, e.prototype.forEachInner = function(i, o, s, a) {
    for (var l = o; l < s; l++)
      if (i(this.values[l], a + l) === !1)
        return !1;
  }, e.prototype.forEachInvertedInner = function(i, o, s, a) {
    for (var l = o - 1; l >= s; l--)
      if (i(this.values[l], a + l) === !1)
        return !1;
  }, e.prototype.leafAppend = function(i) {
    if (this.length + i.length <= Kr)
      return new e(this.values.concat(i.flatten()));
  }, e.prototype.leafPrepend = function(i) {
    if (this.length + i.length <= Kr)
      return new e(i.flatten().concat(this.values));
  }, t.length.get = function() {
    return this.values.length;
  }, t.depth.get = function() {
    return 0;
  }, Object.defineProperties(e.prototype, t), e;
}(te);
te.empty = new Jc([]);
var uv = /* @__PURE__ */ function(n) {
  function e(t, r) {
    n.call(this), this.left = t, this.right = r, this.length = t.length + r.length, this.depth = Math.max(t.depth, r.depth) + 1;
  }
  return n && (e.__proto__ = n), e.prototype = Object.create(n && n.prototype), e.prototype.constructor = e, e.prototype.flatten = function() {
    return this.left.flatten().concat(this.right.flatten());
  }, e.prototype.getInner = function(r) {
    return r < this.left.length ? this.left.get(r) : this.right.get(r - this.left.length);
  }, e.prototype.forEachInner = function(r, i, o, s) {
    var a = this.left.length;
    if (i < a && this.left.forEachInner(r, i, Math.min(o, a), s) === !1 || o > a && this.right.forEachInner(r, Math.max(i - a, 0), Math.min(this.length, o) - a, s + a) === !1)
      return !1;
  }, e.prototype.forEachInvertedInner = function(r, i, o, s) {
    var a = this.left.length;
    if (i > a && this.right.forEachInvertedInner(r, i - a, Math.max(o, a) - a, s + a) === !1 || o < a && this.left.forEachInvertedInner(r, Math.min(i, a), o, s) === !1)
      return !1;
  }, e.prototype.sliceInner = function(r, i) {
    if (r == 0 && i == this.length)
      return this;
    var o = this.left.length;
    return i <= o ? this.left.slice(r, i) : r >= o ? this.right.slice(r - o, i - o) : this.left.slice(r, o).append(this.right.slice(0, i - o));
  }, e.prototype.leafAppend = function(r) {
    var i = this.right.leafAppend(r);
    if (i)
      return new e(this.left, i);
  }, e.prototype.leafPrepend = function(r) {
    var i = this.left.leafPrepend(r);
    if (i)
      return new e(i, this.right);
  }, e.prototype.appendInner = function(r) {
    return this.left.depth >= Math.max(this.right.depth, r.depth) + 1 ? new e(this.left, new e(this.right, r)) : new e(this, r);
  }, e;
}(te), _c = te;
const dv = 500;
class Ie {
  constructor(e, t) {
    this.items = e, this.eventCount = t;
  }
  popEvent(e, t) {
    if (this.eventCount == 0)
      return null;
    let r = this.items.length;
    for (; ; r--)
      if (this.items.get(r - 1).selection) {
        --r;
        break;
      }
    let i, o;
    t && (i = this.remapping(r, this.items.length), o = i.maps.length);
    let s = e.tr, a, l, c = [], u = [];
    return this.items.forEach((d, f) => {
      if (!d.step) {
        i || (i = this.remapping(r, f + 1), o = i.maps.length), o--, u.push(d);
        return;
      }
      if (i) {
        u.push(new je(d.map));
        let p = d.step.map(i.slice(o)), h;
        p && s.maybeStep(p).doc && (h = s.mapping.maps[s.mapping.maps.length - 1], c.push(new je(h, void 0, void 0, c.length + u.length))), o--, h && i.appendMap(h, o);
      } else
        s.maybeStep(d.step);
      if (d.selection)
        return a = i ? d.selection.map(i.slice(o)) : d.selection, l = new Ie(this.items.slice(0, r).append(u.reverse().concat(c)), this.eventCount - 1), !1;
    }, this.items.length, 0), { remaining: l, transform: s, selection: a };
  }
  addTransform(e, t, r, i) {
    let o = [], s = this.eventCount, a = this.items, l = !i && a.length ? a.get(a.length - 1) : null;
    for (let u = 0; u < e.steps.length; u++) {
      let d = e.steps[u].invert(e.docs[u]), f = new je(e.mapping.maps[u], d, t), p;
      (p = l && l.merge(f)) && (f = p, u ? o.pop() : a = a.slice(0, a.length - 1)), o.push(f), t && (s++, t = void 0), i || (l = f);
    }
    let c = s - r.depth;
    return c > pv && (a = fv(a, c), s -= c), new Ie(a.append(o), s);
  }
  remapping(e, t) {
    let r = new fn();
    return this.items.forEach((i, o) => {
      let s = i.mirrorOffset != null && o - i.mirrorOffset >= e ? r.maps.length - i.mirrorOffset : void 0;
      r.appendMap(i.map, s);
    }, e, t), r;
  }
  addMaps(e) {
    return this.eventCount == 0 ? this : new Ie(this.items.append(e.map((t) => new je(t))), this.eventCount);
  }
  rebased(e, t) {
    if (!this.eventCount)
      return this;
    let r = [], i = Math.max(0, this.items.length - t), o = e.mapping, s = e.steps.length, a = this.eventCount;
    this.items.forEach((f) => {
      f.selection && a--;
    }, i);
    let l = t;
    this.items.forEach((f) => {
      let p = o.getMirror(--l);
      if (p == null)
        return;
      s = Math.min(s, p);
      let h = o.maps[p];
      if (f.step) {
        let m = e.steps[p].invert(e.docs[p]), y = f.selection && f.selection.map(o.slice(l + 1, p));
        y && a++, r.push(new je(h, m, y));
      } else
        r.push(new je(h));
    }, i);
    let c = [];
    for (let f = t; f < s; f++)
      c.push(new je(o.maps[f]));
    let u = this.items.slice(0, i).append(c).append(r), d = new Ie(u, a);
    return d.emptyItemCount() > dv && (d = d.compress(this.items.length - r.length)), d;
  }
  emptyItemCount() {
    let e = 0;
    return this.items.forEach((t) => {
      t.step || e++;
    }), e;
  }
  compress(e = this.items.length) {
    let t = this.remapping(0, e), r = t.maps.length, i = [], o = 0;
    return this.items.forEach((s, a) => {
      if (a >= e)
        i.push(s), s.selection && o++;
      else if (s.step) {
        let l = s.step.map(t.slice(r)), c = l && l.getMap();
        if (r--, c && t.appendMap(c, r), l) {
          let u = s.selection && s.selection.map(t.slice(r));
          u && o++;
          let d = new je(c.invert(), l, u), f, p = i.length - 1;
          (f = i.length && i[p].merge(d)) ? i[p] = f : i.push(d);
        }
      } else
        s.map && r--;
    }, this.items.length, 0), new Ie(_c.from(i.reverse()), o);
  }
}
Ie.empty = new Ie(_c.empty, 0);
function fv(n, e) {
  let t;
  return n.forEach((r, i) => {
    if (r.selection && e-- == 0)
      return t = i, !1;
  }), n.slice(t);
}
class je {
  constructor(e, t, r, i) {
    this.map = e, this.step = t, this.selection = r, this.mirrorOffset = i;
  }
  merge(e) {
    if (this.step && e.step && !e.selection) {
      let t = e.step.merge(this.step);
      if (t)
        return new je(t.getMap().invert(), t, this.selection);
    }
  }
}
class pt {
  constructor(e, t, r, i) {
    this.done = e, this.undone = t, this.prevRanges = r, this.prevTime = i;
  }
}
const pv = 20;
function hv(n, e, t, r) {
  let i = t.getMeta(xt), o;
  if (i)
    return i.historyState;
  t.getMeta(gv) && (n = new pt(n.done, n.undone, null, 0));
  let s = t.getMeta("appendedTransaction");
  if (t.steps.length == 0)
    return n;
  if (s && s.getMeta(xt))
    return s.getMeta(xt).redo ? new pt(n.done.addTransform(t, void 0, r, Mr(e)), n.undone, Oa(t.mapping.maps[t.steps.length - 1]), n.prevTime) : new pt(n.done, n.undone.addTransform(t, void 0, r, Mr(e)), null, n.prevTime);
  if (t.getMeta("addToHistory") !== !1 && !(s && s.getMeta("addToHistory") === !1)) {
    let a = n.prevTime == 0 || !s && (n.prevTime < (t.time || 0) - r.newGroupDelay || !mv(t, n.prevRanges)), l = s ? Li(n.prevRanges, t.mapping) : Oa(t.mapping.maps[t.steps.length - 1]);
    return new pt(n.done.addTransform(t, a ? e.selection.getBookmark() : void 0, r, Mr(e)), Ie.empty, l, t.time);
  } else
    return (o = t.getMeta("rebased")) ? new pt(n.done.rebased(t, o), n.undone.rebased(t, o), Li(n.prevRanges, t.mapping), n.prevTime) : new pt(n.done.addMaps(t.mapping.maps), n.undone.addMaps(t.mapping.maps), Li(n.prevRanges, t.mapping), n.prevTime);
}
function mv(n, e) {
  if (!e)
    return !1;
  if (!n.docChanged)
    return !0;
  let t = !1;
  return n.mapping.maps[0].forEach((r, i) => {
    for (let o = 0; o < e.length; o += 2)
      r <= e[o + 1] && i >= e[o] && (t = !0);
  }), t;
}
function Oa(n) {
  let e = [];
  return n.forEach((t, r, i, o) => e.push(i, o)), e;
}
function Li(n, e) {
  if (!n)
    return null;
  let t = [];
  for (let r = 0; r < n.length; r += 2) {
    let i = e.map(n[r], 1), o = e.map(n[r + 1], -1);
    i <= o && t.push(i, o);
  }
  return t;
}
function Uc(n, e, t, r) {
  let i = Mr(e), o = xt.get(e).spec.config, s = (r ? n.undone : n.done).popEvent(e, i);
  if (!s)
    return;
  let a = s.selection.resolve(s.transform.doc), l = (r ? n.done : n.undone).addTransform(s.transform, e.selection.getBookmark(), o, i), c = new pt(r ? l : s.remaining, r ? s.remaining : l, null, 0);
  t(s.transform.setSelection(a).setMeta(xt, { redo: r, historyState: c }).scrollIntoView());
}
let $i = !1, Ca = null;
function Mr(n) {
  let e = n.plugins;
  if (Ca != e) {
    $i = !1, Ca = e;
    for (let t = 0; t < e.length; t++)
      if (e[t].spec.historyPreserveItems) {
        $i = !0;
        break;
      }
  }
  return $i;
}
const xt = new de("history"), gv = new de("closeHistory");
function yv(n = {}) {
  return n = {
    depth: n.depth || 100,
    newGroupDelay: n.newGroupDelay || 500
  }, new U({
    key: xt,
    state: {
      init() {
        return new pt(Ie.empty, Ie.empty, null, 0);
      },
      apply(e, t, r) {
        return hv(t, r, e, n);
      }
    },
    config: n,
    props: {
      handleDOMEvents: {
        beforeinput(e, t) {
          let r = t.inputType, i = r == "historyUndo" ? Gc : r == "historyRedo" ? Yc : null;
          return i ? (t.preventDefault(), i(e.state, e.dispatch)) : !1;
        }
      }
    }
  });
}
const Gc = (n, e) => {
  let t = xt.getState(n);
  return !t || t.done.eventCount == 0 ? !1 : (e && Uc(t, n, e, !1), !0);
}, Yc = (n, e) => {
  let t = xt.getState(n);
  return !t || t.undone.eventCount == 0 ? !1 : (e && Uc(t, n, e, !0), !0);
}, bv = ge.create({
  name: "history",
  addOptions() {
    return {
      depth: 100,
      newGroupDelay: 500
    };
  },
  addCommands() {
    return {
      undo: () => ({ state: n, dispatch: e }) => Gc(n, e),
      redo: () => ({ state: n, dispatch: e }) => Yc(n, e)
    };
  },
  addProseMirrorPlugins() {
    return [
      yv(this.options)
    ];
  },
  addKeyboardShortcuts() {
    return {
      "Mod-z": () => this.editor.commands.undo(),
      "Mod-y": () => this.editor.commands.redo(),
      "Shift-Mod-z": () => this.editor.commands.redo(),
      "Mod-\u044F": () => this.editor.commands.undo(),
      "Shift-Mod-\u044F": () => this.editor.commands.redo()
    };
  }
}), vv = ye.create({
  name: "horizontalRule",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  group: "block",
  parseHTML() {
    return [
      { tag: "hr" }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["hr", ue(this.options.HTMLAttributes, n)];
  },
  addCommands() {
    return {
      setHorizontalRule: () => ({ chain: n }) => n().insertContent({ type: this.name }).command(({ tr: e, dispatch: t }) => {
        var r;
        if (t) {
          const { $to: i } = e.selection, o = i.end();
          if (i.nodeAfter)
            e.setSelection(D.create(e.doc, i.pos));
          else {
            const s = (r = i.parent.type.contentMatch.defaultType) === null || r === void 0 ? void 0 : r.create();
            s && (e.insert(o, s), e.setSelection(D.create(e.doc, o)));
          }
          e.scrollIntoView();
        }
        return !0;
      }).run()
    };
  },
  addInputRules() {
    return [
      Db({
        find: /^(?:---|—-|___\s|\*\*\*\s)$/,
        type: this.type
      })
    ];
  }
}), kv = /(?:^|\s)((?:\*)((?:[^*]+))(?:\*))$/, xv = /(?:^|\s)((?:\*)((?:[^*]+))(?:\*))/g, wv = /(?:^|\s)((?:_)((?:[^_]+))(?:_))$/, Sv = /(?:^|\s)((?:_)((?:[^_]+))(?:_))/g, Mv = Mt.create({
  name: "italic",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "em"
      },
      {
        tag: "i",
        getAttrs: (n) => n.style.fontStyle !== "normal" && null
      },
      {
        style: "font-style=italic"
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["em", ue(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      setItalic: () => ({ commands: n }) => n.setMark(this.name),
      toggleItalic: () => ({ commands: n }) => n.toggleMark(this.name),
      unsetItalic: () => ({ commands: n }) => n.unsetMark(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-i": () => this.editor.commands.toggleItalic(),
      "Mod-I": () => this.editor.commands.toggleItalic()
    };
  },
  addInputRules() {
    return [
      Mn({
        find: kv,
        type: this.type
      }),
      Mn({
        find: wv,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      On({
        find: xv,
        type: this.type
      }),
      On({
        find: Sv,
        type: this.type
      })
    ];
  }
}), Ov = ye.create({
  name: "listItem",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  content: "paragraph block*",
  defining: !0,
  parseHTML() {
    return [
      {
        tag: "li"
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["li", ue(this.options.HTMLAttributes, n), 0];
  },
  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.splitListItem(this.name),
      Tab: () => this.editor.commands.sinkListItem(this.name),
      "Shift-Tab": () => this.editor.commands.liftListItem(this.name)
    };
  }
}), Cv = /^(\d+)\.\s$/, Tv = ye.create({
  name: "orderedList",
  addOptions() {
    return {
      itemTypeName: "listItem",
      HTMLAttributes: {}
    };
  },
  group: "block list",
  content() {
    return `${this.options.itemTypeName}+`;
  },
  addAttributes() {
    return {
      start: {
        default: 1,
        parseHTML: (n) => n.hasAttribute("start") ? parseInt(n.getAttribute("start") || "", 10) : 1
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: "ol"
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    const { start: e, ...t } = n;
    return e === 1 ? ["ol", ue(this.options.HTMLAttributes, t), 0] : ["ol", ue(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      toggleOrderedList: () => ({ commands: n }) => n.toggleList(this.name, this.options.itemTypeName)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-7": () => this.editor.commands.toggleOrderedList()
    };
  },
  addInputRules() {
    return [
      Vo({
        find: Cv,
        type: this.type,
        getAttributes: (n) => ({ start: +n[1] }),
        joinPredicate: (n, e) => e.childCount + e.attrs.start === +n[1]
      })
    ];
  }
}), Ev = ye.create({
  name: "paragraph",
  priority: 1e3,
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  group: "block",
  content: "inline*",
  parseHTML() {
    return [
      { tag: "p" }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["p", ue(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      setParagraph: () => ({ commands: n }) => n.setNode(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Alt-0": () => this.editor.commands.setParagraph()
    };
  }
}), Av = /(?:^|\s)((?:~~)((?:[^~]+))(?:~~))$/, Nv = /(?:^|\s)((?:~~)((?:[^~]+))(?:~~))/g, Dv = Mt.create({
  name: "strike",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "s"
      },
      {
        tag: "del"
      },
      {
        tag: "strike"
      },
      {
        style: "text-decoration",
        consuming: !1,
        getAttrs: (n) => n.includes("line-through") ? {} : !1
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["s", ue(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      setStrike: () => ({ commands: n }) => n.setMark(this.name),
      toggleStrike: () => ({ commands: n }) => n.toggleMark(this.name),
      unsetStrike: () => ({ commands: n }) => n.unsetMark(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-x": () => this.editor.commands.toggleStrike()
    };
  },
  addInputRules() {
    return [
      Mn({
        find: Av,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      On({
        find: Nv,
        type: this.type
      })
    ];
  }
}), Iv = ye.create({
  name: "text",
  group: "inline"
}), Pv = ge.create({
  name: "starterKit",
  addExtensions() {
    var n, e, t, r, i, o, s, a, l, c, u, d, f, p, h, m, y, b;
    const w = [];
    return this.options.blockquote !== !1 && w.push(Lb.configure((n = this.options) === null || n === void 0 ? void 0 : n.blockquote)), this.options.bold !== !1 && w.push(jb.configure((e = this.options) === null || e === void 0 ? void 0 : e.bold)), this.options.bulletList !== !1 && w.push(Wb.configure((t = this.options) === null || t === void 0 ? void 0 : t.bulletList)), this.options.code !== !1 && w.push(Jb.configure((r = this.options) === null || r === void 0 ? void 0 : r.code)), this.options.codeBlock !== !1 && w.push(Gb.configure((i = this.options) === null || i === void 0 ? void 0 : i.codeBlock)), this.options.document !== !1 && w.push(Yb.configure((o = this.options) === null || o === void 0 ? void 0 : o.document)), this.options.dropcursor !== !1 && w.push(Qb.configure((s = this.options) === null || s === void 0 ? void 0 : s.dropcursor)), this.options.gapcursor !== !1 && w.push(av.configure((a = this.options) === null || a === void 0 ? void 0 : a.gapcursor)), this.options.hardBreak !== !1 && w.push(lv.configure((l = this.options) === null || l === void 0 ? void 0 : l.hardBreak)), this.options.heading !== !1 && w.push(cv.configure((c = this.options) === null || c === void 0 ? void 0 : c.heading)), this.options.history !== !1 && w.push(bv.configure((u = this.options) === null || u === void 0 ? void 0 : u.history)), this.options.horizontalRule !== !1 && w.push(vv.configure((d = this.options) === null || d === void 0 ? void 0 : d.horizontalRule)), this.options.italic !== !1 && w.push(Mv.configure((f = this.options) === null || f === void 0 ? void 0 : f.italic)), this.options.listItem !== !1 && w.push(Ov.configure((p = this.options) === null || p === void 0 ? void 0 : p.listItem)), this.options.orderedList !== !1 && w.push(Tv.configure((h = this.options) === null || h === void 0 ? void 0 : h.orderedList)), this.options.paragraph !== !1 && w.push(Ev.configure((m = this.options) === null || m === void 0 ? void 0 : m.paragraph)), this.options.strike !== !1 && w.push(Dv.configure((y = this.options) === null || y === void 0 ? void 0 : y.strike)), this.options.text !== !1 && w.push(Iv.configure((b = this.options) === null || b === void 0 ? void 0 : b.text)), w;
  }
}), Rv = Y({
  name: "bold-svg",
  setup() {
    return () => B("svg", {
      width: "32",
      height: "32",
      viewBox: "0 0 24 24"
    }, [B("path", {
      fill: "none",
      stroke: "currentColor",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M7 5h6a3.5 3.5 0 0 1 0 7H7zm6 7h1a3.5 3.5 0 0 1 0 7H7v-7"
    }, null)]);
  }
}), Bv = Y({
  name: "italic-svg",
  setup() {
    return () => B("svg", {
      width: "32",
      height: "32",
      viewBox: "0 0 24 24"
    }, [B("path", {
      fill: "none",
      stroke: "currentColor",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M11 5h6M7 19h6m1-14l-4 14"
    }, null)]);
  }
}), Lv = Y({
  name: "strikethrough-svg",
  setup() {
    return () => B("svg", {
      width: "32",
      height: "32",
      viewBox: "0 0 24 24"
    }, [B("path", {
      fill: "none",
      stroke: "currentColor",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M5 12h14m-3-5.5A4 2 0 0 0 12 5h-1a3.5 3.5 0 0 0 0 7h2a3.5 3.5 0 0 1 0 7h-1.5a4 2 0 0 1-4-1.5"
    }, null)]);
  }
}), $v = Y({
  name: "code-svg",
  setup() {
    return () => B("svg", {
      width: "32",
      height: "32",
      viewBox: "0 0 24 24"
    }, [B("g", {
      fill: "none",
      stroke: "currentColor",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2"
    }, [B("path", {
      d: "M8.5 13.5L7 12l1.5-1.5m7 0L17 12l-1.5 1.5"
    }, null), B("circle", {
      cx: "12",
      cy: "12",
      r: "9"
    }, null), B("path", {
      d: "M13 9.5L11 15"
    }, null)])]);
  }
}), Fv = Y({
  name: "bold-svg",
  setup() {
    return () => B("svg", {
      width: "32",
      height: "32",
      viewBox: "0 0 24 24"
    }, [B("path", {
      fill: "none",
      stroke: "currentColor",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M3 19h4L17.5 8.5a2.828 2.828 0 1 0-4-4L3 15v4m9.5-13.5l4 4m-12 4l4 4M21 15v4h-8l4-4z"
    }, null)]);
  }
}), zv = Y({
  name: "bold-svg",
  setup() {
    return () => B("svg", {
      width: "32",
      height: "32",
      viewBox: "0 0 24 24"
    }, [B("path", {
      fill: "none",
      stroke: "currentColor",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M19 18v-8l-2 2M4 6v12m8-12v12m-1 0h2M3 18h2m-1-6h8M3 6h2m6 0h2"
    }, null)]);
  }
}), Vv = Y({
  name: "bold-svg",
  setup() {
    return () => B("svg", {
      width: "32",
      height: "32",
      viewBox: "0 0 24 24"
    }, [B("path", {
      fill: "none",
      stroke: "currentColor",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M17 12a2 2 0 1 1 4 0c0 .591-.417 1.318-.816 1.858L17 18.001h4M4 6v12m8-12v12m-1 0h2M3 18h2m-1-6h8M3 6h2m6 0h2"
    }, null)]);
  }
}), jv = Y({
  name: "bold-svg",
  setup() {
    return () => B("svg", {
      width: "32",
      height: "32",
      viewBox: "0 0 24 24"
    }, [B("path", {
      fill: "none",
      stroke: "currentColor",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M19 14a2 2 0 1 0-2-2m0 4a2 2 0 1 0 2-2M4 6v12m8-12v12m-1 0h2M3 18h2m-1-6h8M3 6h2m6 0h2"
    }, null)]);
  }
}), Hv = Y({
  name: "bold-svg",
  setup() {
    return () => B("svg", {
      width: "32",
      height: "32",
      viewBox: "0 0 24 24"
    }, [B("path", {
      fill: "none",
      stroke: "currentColor",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M20 18v-8l-4 6h5M4 6v12m8-12v12m-1 0h2M3 18h2m-1-6h8M3 6h2m6 0h2"
    }, null)]);
  }
}), Wv = Y({
  name: "bold-svg",
  setup() {
    return () => B("svg", {
      width: "32",
      height: "32",
      viewBox: "0 0 24 24"
    }, [B("path", {
      fill: "none",
      stroke: "currentColor",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M17 18h2a2 2 0 1 0 0-4h-2v-4h4M4 6v12m8-12v12m-1 0h2M3 18h2m-1-6h8M3 6h2m6 0h2"
    }, null)]);
  }
}), qv = Y({
  props: {
    editor: {
      type: Object,
      required: !0
    }
  },
  setup({
    editor: n
  }) {
    console.log("editor", n);
    const e = () => {
      n.value.chain().focus().toggleBold().run();
    }, t = () => {
      n.value.chain().focus().toggleItalic().run();
    };
    return () => B("div", {
      class: "editor-header"
    }, [B(Rv, {
      onClick: e
    }, null), B(Bv, {
      onClick: t
    }, null), B(Lv, {
      onClick: () => n.value.chain().focus().toggleStrike().run()
    }, null), B($v, {
      onClick: () => n.value.chain().focus().toggleCode().run()
    }, null), B(Fv, {
      onClick: () => n.value.chain().focus().toggleHighlight().run()
    }, null), B(zv, {
      onClick: () => n.value.chain().focus().toggleHeading({
        level: 1
      }).run()
    }, null), B(Vv, {
      onClick: () => n.value.chain().focus().toggleHeading({
        level: 2
      }).run()
    }, null), B(jv, {
      onClick: () => n.value.chain().focus().toggleHeading({
        level: 3
      }).run()
    }, null), B(Hv, {
      onClick: () => n.value.chain().focus().toggleHeading({
        level: 4
      }).run()
    }, null), B(Wv, {
      onClick: () => n.value.chain().focus().toggleHeading({
        level: 5
      }).run()
    }, null)]);
  }
}), Kv = Y({
  props: {
    editor: {
      type: Object,
      required: !0
    }
  },
  setup({
    editor: n
  }) {
    return () => B(Rb, {
      class: "editor-content",
      editor: n.value
    }, null);
  }
});
const Or = Y({
  name: "vue-tiptop-editor",
  setup() {
    const n = Jr();
    return co(() => {
      n.value = new Pb({
        content: "<p>I\u2019m running Tiptap with Vue.js. \u{1F389}</p>",
        extensions: [Pv]
      });
    }), () => B("div", {
      class: "editor-container"
    }, [B(qv, {
      editor: n
    }, null), B(Kv, {
      editor: n
    }, null)]);
  }
});
Or.install = function(n) {
  n.component(Or.name, Or);
};
const _v = {
  install(n) {
    n.use(Or);
  }
};
export {
  _v as default
};
