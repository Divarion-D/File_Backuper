!(function (t, e) {
    "object" == typeof exports && "undefined" != typeof module ? e(exports) : "function" == typeof define && define.amd ? define(["exports"], e) : e(((t = t || self).fileManager = {}));
})(this, function (t) {
    "use strict";
    var e = function (
        t,
        i
    ) {
        return (e =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
                function (t, e) {
                    t.__proto__ = e;
                }) ||
            function (t, e) {
                for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
            })(t, i);
    };
    function i(t, i) {
        function n() {
            this.constructor = t;
        }
        e(t, i), (t.prototype = null === i ? Object.create(i) : ((n.prototype = i.prototype), new n()));
    }
    var n = function () {
            return (n =
                Object.assign ||
                function (t) {
                    for (var e, i = 1, n = arguments.length; i < n; i++) for (var r in (e = arguments[i])) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
                    return t;
                }).apply(this, arguments);
        },
        r = function () {},
        o = (function () {
            function t(t, e) {
                (this.managerJet = !0), (this.manager = t), (this._events = []), (this._subs = {}), (this._data = {}), e && e.params && t.extend(this._data, e.params);
            }
            return (
                (t.prototype.getRoot = function () {
                    return this._root;
                }),
                (t.prototype.destructor = function () {
                    this._detachEvents(), this._destroySubs(), (this._events = this._container = this.app = this._parent = this._root = null);
                }),
                (t.prototype.setParam = function (t, e, i) {
                    if (this._data[t] !== e && ((this._data[t] = e), this._segment.update(t, e, 0), i)) return this.show(null);
                }),
                (t.prototype.getParam = function (t, e) {
                    var i = this._data[t];
                    if (void 0 !== i || !e) return i;
                    var n = this.getParentView();
                    return n ? n.getParam(t, e) : void 0;
                }),
                (t.prototype.getUrl = function () {
                    return this._segment.suburl();
                }),
                (t.prototype.getUrlString = function () {
                    return this._segment.toString();
                }),
                (t.prototype.getParentView = function () {
                    return this._parent;
                }),
                (t.prototype.$$ = function (t) {
                    if ("string" == typeof t) {
                        var e = this.getRoot();
                        return e.queryView(function (i) {
                            return (i.config.id === t || i.config.localId === t) && i.$scope === e.$scope;
                        }, "self");
                    }
                    return t;
                }),
                (t.prototype.on = function (t, e, i) {
                    var n = t.attachEvent(e, i);
                    return this._events.push({ obj: t, id: n }), n;
                }),
                (t.prototype.contains = function (t) {
                    for (var e in this._subs) {
                        var i = this._subs[e].view;
                        if (i === t || i.contains(t)) return !0;
                    }
                    return !1;
                }),
                (t.prototype.getSubView = function (t) {
                    var e = this.getSubViewInfo(t);
                    if (e) return e.subview.view;
                }),
                (t.prototype.getSubViewInfo = function (t) {
                    var e = this._subs[t || "default"];
                    return e ? { subview: e, parent: this } : "_top" === t ? ((this._subs[t] = { url: "", id: null, popup: !0 }), this.getSubViewInfo(t)) : this._parent ? this._parent.getSubViewInfo(t) : null;
                }),
                (t.prototype._detachEvents = function () {
                    for (var t = this._events, e = t.length - 1; e >= 0; e--) t[e].obj.detachEvent(t[e].id);
                }),
                (t.prototype._destroySubs = function () {
                    for (var t in this._subs) {
                        var e = this._subs[t].view;
                        e && e.destructor();
                    }
                    this._subs = {};
                }),
                (t.prototype._init_url_data = function () {
                    var t = this._segment.current();
                    (this._data = {}), this.manager.extend(this._data, t.params, !0);
                }),
                (t.prototype._getDefaultSub = function () {
                    if (this._subs.default) return this._subs.default;
                    for (var t in this._subs) {
                        var e = this._subs[t];
                        if (!e.branch && e.view && "_top" !== t) {
                            var i = e.view._getDefaultSub();
                            if (i) return i;
                        }
                    }
                }),
                (t.prototype._routed_view = function () {
                    var t = this.getParentView();
                    if (!t) return !0;
                    var e = t._getDefaultSub();
                    return !(!e && e !== this) && t._routed_view();
                }),
                t
            );
        })();
    function a(t) {
        "/" === t[0] && (t = t.substr(1));
        for (var e = t.split("/"), i = [], n = 0; n < e.length; n++) {
            var r = e[n],
                o = {},
                a = r.indexOf(":");
            if ((-1 === a && (a = r.indexOf("?")), -1 !== a))
                for (var s = 0, c = r.substr(a + 1).split(/[\:\?\&]/g); s < c.length; s++) {
                    var u = c[s].split("=");
                    o[u[0]] = decodeURIComponent(u[1]);
                }
            i[n] = { page: a > -1 ? r.substr(0, a) : r, params: o, isNew: !0 };
        }
        return i;
    }
    function s(t) {
        for (var e = [], i = 0, n = t; i < n.length; i++) {
            var r = n[i];
            e.push("/" + r.page);
            var o = c(r.params);
            o && e.push("?" + o);
        }
        return e.join("");
    }
    function c(t) {
        var e = [];
        for (var i in t) "object" != typeof t[i] && (e.length && e.push("&"), e.push(i + "=" + encodeURIComponent(t[i])));
        return e.join("");
    }
    var u = (function () {
            function t(t, e) {
                (this._next = 1), (this.route = "string" == typeof t ? { url: a(t), path: t } : t), (this.index = e);
            }
            return (
                (t.prototype.current = function () {
                    return this.route.url[this.index];
                }),
                (t.prototype.next = function () {
                    return this.route.url[this.index + this._next];
                }),
                (t.prototype.suburl = function () {
                    return this.route.url.slice(this.index);
                }),
                (t.prototype.shift = function (e) {
                    var i = new t(this.route, this.index + this._next);
                    return i.setParams(i.route.url, e, i.index), i;
                }),
                (t.prototype.setParams = function (t, e, i) {
                    if (e) {
                        var n = t[i].params;
                        for (var r in e) n[r] = e[r];
                    }
                }),
                (t.prototype.refresh = function () {
                    for (var t = this.route.url, e = this.index + 1; e < t.length; e++) t[e].isNew = !0;
                }),
                (t.prototype.toString = function () {
                    var t = s(this.suburl());
                    return t ? t.substr(1) : "";
                }),
                (t.prototype._join = function (t, e) {
                    var i = this.route.url;
                    if (null === t) return i;
                    var n = this.route.url,
                        r = !0;
                    if (((i = n.slice(0, this.index + (e ? this._next : 0))), t)) {
                        i = i.concat(a(t));
                        for (var o = 0; o < i.length; o++) n[o] && (i[o].view = n[o].view), r && n[o] && i[o].page === n[o].page ? (i[o].isNew = !1) : i[o].isNew && (r = !1);
                    }
                    return i;
                }),
                (t.prototype.append = function (t) {
                    var e = this._join(t, !0);
                    return (this.route.path = s(e)), (this.route.url = e), this.route.path;
                }),
                (t.prototype.show = function (t, e, i) {
                    var n = this,
                        o = this._join(t.url, i);
                    return (
                        this.setParams(o, t.params, this.index + (i ? this._next : 0)),
                        new Promise(function (t, i) {
                            var a = s(o),
                                c = { url: o, redirect: a, confirm: Promise.resolve() },
                                u = e ? e.app : null;
                            if (u && !u.callEvent("app:guard", [c.redirect, e, c])) return void i(new r());
                            c.confirm
                                .catch(function (t) {
                                    return i(t);
                                })
                                .then(function () {
                                    if (null !== c.redirect) {
                                        if (c.redirect !== a) return u.show(c.redirect), void i(new r());
                                        (n.route.path = a), (n.route.url = o), t();
                                    } else i(new r());
                                });
                        })
                    );
                }),
                (t.prototype.size = function (t) {
                    this._next = t;
                }),
                (t.prototype.split = function () {
                    var e = { url: this.route.url.slice(this.index + 1), path: "" };
                    return e.url.length && (e.path = s(e.url)), new t(e, 0);
                }),
                (t.prototype.update = function (t, e, i) {
                    var n = this.route.url[this.index + (i || 0)];
                    if (!n) return this.route.url.push({ page: "", params: {} }), this.update(t, e, i);
                    "" === t ? (n.page = e) : (n.params[t] = e), (this.route.path = s(this.route.url));
                }),
                t
            );
        })(),
        l = (function (t) {
            function e(e, i) {
                var n = t.call(this, e.manager) || this;
                return (n.app = e), (n._children = []), n;
            }
            return (
                i(e, t),
                (e.prototype.ui = function (t, e) {
                    var i = (e = e || {}).container || t.container,
                        n = this.app.createView(t);
                    return this._children.push(n), n.render(i, this._segment, this), "object" != typeof t || t instanceof o ? n : n.getRoot();
                }),
                (e.prototype.show = function (t, e) {
                    if (((e = e || {}), "object" == typeof t)) {
                        for (var i in t) this.setParam(i, t[i]);
                        t = null;
                    } else {
                        if ("/" === t.substr(0, 1)) return this.app.show(t, e);
                        if ((0 === t.indexOf("./") && (t = t.substr(2)), 0 === t.indexOf("../"))) {
                            var n = this.getParentView();
                            return n ? n.show(t.substr(3), e) : this.app.show("/" + t.substr(3));
                        }
                        var r = this.getSubViewInfo(e.target);
                        if (r) {
                            if (r.parent !== this) return r.parent.show(t, e);
                            if (e.target && "default" !== e.target) return this._renderFrameLock(e.target, r.subview, { url: t, params: e.params });
                        } else if (t) return this.app.show("/" + t, e);
                    }
                    return this._show(this._segment, { url: t, params: e.params }, this);
                }),
                (e.prototype._show = function (t, e, i) {
                    var n = this;
                    return t
                        .show(e, i, !0)
                        .then(function () {
                            return n._init_url_data(), n._urlChange();
                        })
                        .then(function () {
                            t.route.linkRouter && (n.app.getRouter().set(t.route.path, { silent: !0 }), n.app.callEvent("app:route", [t.route.path]));
                        });
                }),
                (e.prototype.init = function (t, e) {}),
                (e.prototype.ready = function (t, e) {}),
                (e.prototype.config = function () {
                    this.app.manager.message("View:Config is not implemented");
                }),
                (e.prototype.urlChange = function (t, e) {}),
                (e.prototype.destroy = function () {}),
                (e.prototype.destructor = function () {
                    this.destroy(), this._destroyKids(), this._root && (this._root.destructor(), t.prototype.destructor.call(this));
                }),
                (e.prototype.use = function (t, e) {
                    t(this.app, this, e);
                }),
                (e.prototype.refresh = function () {
                    this.getUrl();
                    return this.destroy(), this._destroyKids(), this._destroySubs(), this._detachEvents(), this._container.tagName && this._root.destructor(), this._segment.refresh(), this._render(this._segment);
                }),
                (e.prototype.render = function (t, e, i) {
                    var n = this;
                    "string" == typeof e && (e = new u(e, 0)), (this._segment = e), (this._parent = i), this._init_url_data();
                    var r = "string" == typeof (t = t || document.body) ? this.manager.toNode(t) : t;
                    return this._container !== r
                        ? ((this._container = r), this._render(e))
                        : this._urlChange().then(function () {
                              return n.getRoot();
                          });
                }),
                (e.prototype._render = function (t) {
                    var e = this,
                        i = this.config();
                    return i.then
                        ? i.then(function (i) {
                              return e._render_final(i, t);
                          })
                        : this._render_final(i, t);
                }),
                (e.prototype._render_final = function (t, e) {
                    var i,
                        n = this,
                        r = null,
                        o = null,
                        a = !1;
                    if ((this._container.tagName ? (o = this._container) : (r = this._container).popup ? ((o = document.body), (a = !0)) : (o = this.manager.$$(r.id)), !this.app || !o)) return Promise.reject(null);
                    var s = this._segment.current(),
                        c = { ui: {} };
                    this.app.copyConfig(t, c.ui, this._subs), this.app.callEvent("app:render", [this, e, c]), (c.ui.$scope = this), !r && s.isNew && s.view && s.view.destructor();
                    try {
                        if (r && !a) {
                            var u = o,
                                l = u.getParentView();
                            l && "multiview" === l.name && !c.ui.id && (c.ui.id = u.config.id);
                        }
                        this._root = this.app.manager.ui(c.ui, o);
                        var p = this._root;
                        a && p.setPosition && !p.isVisible() && p.show(),
                            r && (r.view && r.view !== this && r.view !== this.app && r.view.destructor(), (r.id = this._root.config.id), this.getParentView() || !this.app.app ? (r.view = this) : (r.view = this.app)),
                            s.isNew && ((s.view = this), (s.isNew = !1)),
                            (i = Promise.resolve(this._init(this._root, e)).then(function () {
                                return n._urlChange().then(function () {
                                    return (n._initUrl = null), n.ready(n._root, e.suburl());
                                });
                            }));
                    } catch (t) {
                        i = Promise.reject(t);
                    }
                    return i.catch(function (t) {
                        return n._initError(n, t);
                    });
                }),
                (e.prototype._init = function (t, e) {
                    return this.init(t, e.suburl());
                }),
                (e.prototype._urlChange = function () {
                    var t = this;
                    this.app.callEvent("app:urlchange", [this, this._segment]);
                    var e = [];
                    for (var i in this._subs) {
                        var n = this._subs[i],
                            r = this._renderFrameLock(i, n, null);
                        r && e.push(r);
                    }
                    return Promise.all(e).then(function () {
                        return t.urlChange(t._root, t._segment.suburl());
                    });
                }),
                (e.prototype._renderFrameLock = function (t, e, i) {
                    if (!e.lock) {
                        var n = this._renderFrame(t, e, i);
                        n &&
                            (e.lock = n.then(
                                function () {
                                    return (e.lock = null);
                                },
                                function () {
                                    return (e.lock = null);
                                }
                            ));
                    }
                    return e.lock;
                }),
                (e.prototype._renderFrame = function (t, e, i) {
                    var n = this;
                    if ("default" === t) {
                        if (this._segment.next()) {
                            var r = i ? i.params : null;
                            return e.params && (r = this.manager.extend(r || {}, e.params)), this._createSubView(e, this._segment.shift(r));
                        }
                        e.view && e.popup && (e.view.destructor(), (e.view = null));
                    }
                    if ((null !== i && ((e.url = i.url), e.params && (i.params = this.manager.extend(i.params || {}, e.params))), e.route)) {
                        if (null !== i)
                            return e.route.show(i, e.view).then(function () {
                                return n._createSubView(e, e.route);
                            });
                        if (e.branch) return;
                    }
                    var o = e.view;
                    if (!o && e.url) {
                        if ("string" == typeof e.url)
                            return (e.route = new u(e.url, 0)), i && e.route.setParams(e.route.route.url, i.params, 0), e.params && e.route.setParams(e.route.route.url, e.params, 0), this._createSubView(e, e.route);
                        "function" != typeof e.url || o instanceof e.url || (o = new (this.app._override(e.url))(this.app, "")), o || (o = e.url);
                    }
                    if (o) return o.render(e, e.route || this._segment, this);
                }),
                (e.prototype._initError = function (t, e) {
                    return this.app && this.app.error("app:error:initview", [e, t]), !0;
                }),
                (e.prototype._createSubView = function (t, e) {
                    var i = this;
                    return this.app.createFromURL(e.current()).then(function (n) {
                        return n.render(t, e, i);
                    });
                }),
                (e.prototype._destroyKids = function () {
                    for (var t = this._children, e = t.length - 1; e >= 0; e--) t[e] && t[e].destructor && t[e].destructor();
                    this._children = [];
                }),
                e
            );
        })(o),
        p = (function (t) {
            function e(e, i) {
                var n = t.call(this, e, i) || this;
                return (n._ui = i.ui), n;
            }
            return (
                i(e, t),
                (e.prototype.config = function () {
                    return this._ui;
                }),
                e
            );
        })(l),
        h = (function () {
            function t(t, e, i) {
                (this.path = ""), (this.app = i);
            }
            return (
                (t.prototype.set = function (t, e) {
                    this.path = t;
                    var i = this.app;
                    i.app.getRouter().set(i._segment.append(this.path), { silent: !0 });
                }),
                (t.prototype.get = function () {
                    return this.path;
                }),
                t
            );
        })(),
        f = !0,
        d = (function (t) {
            function e(e) {
                var i = this,
                    n = (e || {}).manager || window.manager;
                return (
                    (e = n.extend({ name: "App", version: "1.0", start: "/home" }, e, !0)),
                    ((i = t.call(this, n, e) || this).config = e),
                    (i.app = i.config.app),
                    (i.ready = Promise.resolve()),
                    (i._services = {}),
                    i.manager.extend(i, i.manager.EventSystem),
                    i
                );
            }
            return (
                i(e, t),
                (e.prototype.getUrl = function () {
                    return this._subSegment.suburl();
                }),
                (e.prototype.getUrlString = function () {
                    return this._subSegment.toString();
                }),
                (e.prototype.getService = function (t) {
                    var e = this._services[t];
                    return "function" == typeof e && (e = this._services[t] = e(this)), e;
                }),
                (e.prototype.setService = function (t, e) {
                    this._services[t] = e;
                }),
                (e.prototype.destructor = function () {
                    this.getSubView().destructor(), t.prototype.destructor.call(this);
                }),
                (e.prototype.copyConfig = function (t, e, i) {
                    if (((t instanceof o || ("function" == typeof t && t.prototype instanceof o)) && (t = { $subview: t }), void 0 !== t.$subview)) return this.addSubView(t, e, i);
                    var n = t instanceof Array;
                    for (var r in ((e = e || (n ? [] : {})), t)) {
                        var a = t[r];
                        if (("function" == typeof a && a.prototype instanceof o && (a = { $subview: a }), !a || "object" != typeof a || a instanceof this.manager.DataCollection || a instanceof RegExp || a instanceof Map)) e[r] = a;
                        else if (a instanceof Date) e[r] = new Date(a);
                        else {
                            var s = this.copyConfig(a, a instanceof Array ? [] : {}, i);
                            null !== s && (n ? e.push(s) : (e[r] = s));
                        }
                    }
                    return e;
                }),
                (e.prototype.getRouter = function () {
                    return this.$router;
                }),
                (e.prototype.clickHandler = function (t, e) {
                    if (t && (e = e || t.target || t.srcElement) && e.getAttribute) {
                        var i = e.getAttribute("trigger");
                        if (i)
                            return (
                                this._forView(e, function (t) {
                                    return t.app.trigger(i);
                                }),
                                (t.cancelBubble = !0),
                                t.preventDefault()
                            );
                        var n = e.getAttribute("route");
                        if (n)
                            return (
                                this._forView(e, function (t) {
                                    return t.show(n);
                                }),
                                (t.cancelBubble = !0),
                                t.preventDefault()
                            );
                    }
                    var r = e.parentNode;
                    r && this.clickHandler(t, r);
                }),
                (e.prototype.getRoot = function () {
                    return this.getSubView().getRoot();
                }),
                (e.prototype.refresh = function () {
                    var t = this;
                    return this._subSegment
                        ? this.getSubView()
                              .refresh()
                              .then(function (e) {
                                  return t.callEvent("app:route", [t.getUrl()]), e;
                              })
                        : Promise.resolve(null);
                }),
                (e.prototype.loadView = function (t) {
                    var e = this,
                        i = this.config.views,
                        n = null;
                    if ("" === t) return Promise.resolve(this._loadError("", new Error("Manager Jet: Empty url segment")));
                    try {
                        i && "string" == typeof (n = "function" == typeof i ? i(t) : i[t]) && ((t = n), (n = null)),
                            n || ("_hidden" === t ? (n = { hidden: !0 }) : "_blank" === t ? (n = {}) : ((t = t.replace(/\./g, "/")), (n = this.require("jet-views", t))));
                    } catch (e) {
                        n = this._loadError(t, e);
                    }
                    return (
                        n.then || (n = Promise.resolve(n)),
                        (n = n
                            .then(function (t) {
                                return t.__esModule ? t.default : t;
                            })
                            .catch(function (i) {
                                return e._loadError(t, i);
                            }))
                    );
                }),
                (e.prototype._forView = function (t, e) {
                    var i = this.manager.$$(t);
                    i && e(i.$scope);
                }),
                (e.prototype._loadViewDynamic = function (t) {
                    return null;
                }),
                (e.prototype.createFromURL = function (t) {
                    var e = this;
                    return t.isNew || !t.view
                        ? this.loadView(t.page).then(function (i) {
                              return e.createView(i, name, t.params);
                          })
                        : Promise.resolve(t.view);
                }),
                (e.prototype._override = function (t) {
                    var e = this.config.override;
                    if (e) {
                        for (var i = void 0; t; ) (i = t), (t = e.get(t));
                        return i;
                    }
                    return t;
                }),
                (e.prototype.createView = function (t, i, n) {
                    if ("function" == typeof (t = this._override(t))) {
                        if (t.prototype instanceof e) return new t({ app: this, name: i, params: n, router: h });
                        if (t.prototype instanceof o) return new t(this, { name: i, params: n });
                        t = t(this);
                    }
                    return t instanceof o ? t : new p(this, { name: i, ui: t });
                }),
                (e.prototype.show = function (t, e) {
                    return t && this.app && 0 == t.indexOf("//") ? this.app.show(t.substr(1), e) : this.render(this._container, t || this.config.start, e);
                }),
                (e.prototype.trigger = function (t) {
                    for (var e = [], i = 1; i < arguments.length; i++) e[i - 1] = arguments[i];
                    this.apply(t, e);
                }),
                (e.prototype.apply = function (t, e) {
                    this.callEvent(t, e);
                }),
                (e.prototype.action = function (t) {
                    return this.manager.bind(function () {
                        for (var e = [], i = 0; i < arguments.length; i++) e[i] = arguments[i];
                        this.apply(t, e);
                    }, this);
                }),
                (e.prototype.on = function (t, e) {
                    this.attachEvent(t, e);
                }),
                (e.prototype.use = function (t, e) {
                    t(this, null, e);
                }),
                (e.prototype.error = function (t, e) {
                    if ((this.callEvent(t, e), this.callEvent("app:error", e), this.config.debug))
                        for (var i = 0; i < e.length; i++)
                            if ((console.error(e[i]), e[i] instanceof Error)) {
                                var n = e[i].message;
                                0 === n.indexOf("Module build failed")
                                    ? ((n = n.replace(/\x1b\[[0-9;]*m/g, "")), (document.body.innerHTML = "<pre style='font-size:16px; background-color: #ec6873; color: #000; padding:10px;'>" + n + "</pre>"))
                                    : ((n += "<br><br>Check console for more details"), this.manager.message({ type: "error", text: n, expire: -1 }));
                            }
                }),
                (e.prototype.render = function (t, e, i) {
                    var n = this;
                    this._container = "string" == typeof t ? this.manager.toNode(t) : t || document.body;
                    var r = null;
                    !this.$router
                        ? (f &&
                              "tagName" in this._container &&
                              (this.manager.event(document.body, "click", function (t) {
                                  return n.clickHandler(t);
                              }),
                              (f = !1)),
                          "string" == typeof e && (e = new u(e, 0)),
                          (this._subSegment = this._first_start(e)),
                          (this._subSegment.route.linkRouter = !0))
                        : (r = "string" == typeof e ? e : this.app ? e.split().route.path || this.config.start : e.toString());
                    var o = i ? i.params : this.config.params || null,
                        a = this.getSubView(),
                        s = this._subSegment,
                        c = s
                            .show({ url: r, params: o }, a)
                            .then(function () {
                                return n.createFromURL(s.current());
                            })
                            .then(function (e) {
                                return e.render(t, s);
                            })
                            .then(function (t) {
                                return n.$router.set(s.route.path, { silent: !0 }), n.callEvent("app:route", [n.getUrl()]), t;
                            });
                    return (
                        (this.ready = this.ready.then(function () {
                            return c;
                        })),
                        c
                    );
                }),
                (e.prototype.getSubView = function () {
                    if (this._subSegment) {
                        var t = this._subSegment.current().view;
                        if (t) return t;
                    }
                    return new l(this, {});
                }),
                (e.prototype.require = function (t, e) {
                    return null;
                }),
                (e.prototype._first_start = function (t) {
                    var e = this;
                    this._segment = t;
                    if (
                        ((this.$router = new this.config.router(
                            function (t) {
                                return setTimeout(function () {
                                    e.show(t).catch(function (t) {
                                        if (!(t instanceof r)) throw t;
                                    });
                                }, 1);
                            },
                            this.config,
                            this
                        )),
                        this._container === document.body && !1 !== this.config.animation)
                    ) {
                        var i = this._container;
                        this.manager.html.addCss(i, "managerappstart"),
                            setTimeout(function () {
                                e.manager.html.removeCss(i, "managerappstart"), e.manager.html.addCss(i, "managerapp");
                            }, 10);
                    }
                    if (t) {
                        if (this.app) {
                            var n = t.current().view;
                            (t.current().view = this), t.next() ? (t.refresh(), (t = t.split())) : (t = new u(this.config.start, 0)), (t.current().view = n);
                        }
                    } else {
                        var o = this.$router.get();
                        o || ((o = this.config.start), this.$router.set(o, { silent: !0 })), (t = new u(o, 0));
                    }
                    return t;
                }),
                (e.prototype._loadError = function (t, e) {
                    return this.error("app:error:resolve", [e, t]), { template: " " };
                }),
                (e.prototype.addSubView = function (t, e, i) {
                    var n = !0 !== t.$subview ? t.$subview : null,
                        r = t.name || (n ? this.manager.uid() : "default");
                    return (e.id = t.id || "s" + this.manager.uid()), (i[r] = { id: e.id, url: n, branch: t.branch, popup: t.popup, params: t.params }).popup ? null : e;
                }),
                e
            );
        })(o),
        v = (function () {
            function t(t, e) {
                var i = this;
                (this.config = e || {}),
                    this._detectPrefix(),
                    (this.cb = t),
                    (window.onpopstate = function () {
                        return i.cb(i.get());
                    });
            }
            return (
                (t.prototype.set = function (t, e) {
                    var i = this;
                    if (this.config.routes) {
                        var n = t.split("?", 2);
                        for (var r in this.config.routes)
                            if (this.config.routes[r] === n[0]) {
                                t = r + (n.length > 1 ? "?" + n[1] : "");
                                break;
                            }
                    }
                    this.get() !== t && window.history.pushState(null, null, this.prefix + this.sufix + t),
                        (e && e.silent) ||
                            setTimeout(function () {
                                return i.cb(t);
                            }, 1);
                }),
                (t.prototype.get = function () {
                    var t = this._getRaw().replace(this.prefix, "").replace(this.sufix, "");
                    if (((t = "/" !== t && "#" !== t ? t : ""), this.config.routes)) {
                        var e = t.split("?", 2),
                            i = this.config.routes[e[0]];
                        i && (t = i + (e.length > 1 ? "?" + e[1] : ""));
                    }
                    return t;
                }),
                (t.prototype._detectPrefix = function () {
                    var t = this.config.routerPrefix;
                    (this.sufix = "#" + (void 0 === t ? "!" : t)), (this.prefix = document.location.href.split("#", 2)[0]);
                }),
                (t.prototype._getRaw = function () {
                    return document.location.href;
                }),
                t
            );
        })(),
        g = !1;
    function w(t) {
        if (!g && t) {
            g = !0;
            var e = window;
            e.Promise || (e.Promise = t.promise);
            var i = t.version.split(".");
            10 * i[0] + 1 * i[1] < 53 &&
                (t.ui.freeze = function (e) {
                    var i = e();
                    return (
                        i && i.then
                            ? i.then(function (e) {
                                  return (t.ui.$freeze = !1), t.ui.resize(), e;
                              })
                            : ((t.ui.$freeze = !1), t.ui.resize()),
                        i
                    );
                });
            var n = t.ui.baselayout.prototype.addView,
                r = t.ui.baselayout.prototype.removeView,
                o = {
                    addView: function (t, e) {
                        if (this.$scope && this.$scope.managerJet && !t.queryView) {
                            var i = this.$scope,
                                r = {};
                            (t = i.app.copyConfig(t, {}, r)), n.apply(this, [t, e]);
                            var o = function (t) {
                                i._renderFrame(t, r[t], null).then(function () {
                                    i._subs[t] = r[t];
                                });
                            };
                            for (var a in r) o(a);
                            return t.id;
                        }
                        return n.apply(this, arguments);
                    },
                    removeView: function () {
                        if ((r.apply(this, arguments), this.$scope && this.$scope.managerJet)) {
                            var e = this.$scope._subs;
                            for (var i in e) {
                                var n = e[i];
                                t.$$(n.id) || (n.view.destructor(), delete e[i]);
                            }
                        }
                    },
                };
            t.extend(t.ui.layout.prototype, o, !0),
                t.extend(t.ui.baselayout.prototype, o, !0),
                t.protoUI(
                    {
                        name: "jetapp",
                        $init: function (e) {
                            this.$app = new this.app(e);
                            var i = t.uid().toString();
                            (e.body = { id: i }),
                                this.$ready.push(function () {
                                    this.callEvent("onInit", [this.$app]), this.$app.render({ id: i });
                                });
                        },
                    },
                    t.ui.proxy,
                    t.EventSystem
                );
        }
    }
    var m = (function (t) {
            function e(e) {
                var i;
                return (e.router = e.router || v), w((i = t.call(this, e) || this).manager), i;
            }
            return (
                i(e, t),
                (e.prototype.require = function (t, e) {
                    return require(t + "/" + e);
                }),
                e
            );
        })(d),
        y =
            ((function (t) {
                function e() {
                    return (null !== t && t.apply(this, arguments)) || this;
                }
                i(e, t),
                    (e.prototype._detectPrefix = function () {
                        (this.prefix = ""), (this.sufix = this.config.routerPrefix || "");
                    }),
                    (e.prototype._getRaw = function () {
                        return document.location.pathname + (document.location.search || "");
                    });
            })(v),
            (function () {
                function t(t, e) {
                    (this.path = ""), (this.cb = t);
                }
                return (
                    (t.prototype.set = function (t, e) {
                        var i = this;
                        (this.path = t),
                            (e && e.silent) ||
                                setTimeout(function () {
                                    return i.cb(t);
                                }, 1);
                    }),
                    (t.prototype.get = function () {
                        return this.path;
                    }),
                    t
                );
            })());
    function b(t, e) {
        return Object.prototype.hasOwnProperty.call(t, e);
    }
    function _(t, e, i) {
        for (var n in t) b(t, n) && e.call(i || t, t[n], n, t);
    }
    function x(t) {
        (t = "Warning: " + t), "undefined" != typeof console && console.error(t);
        try {
            throw new Error(t);
        } catch (t) {}
    }
    var S = String.prototype.replace,
        k = String.prototype.split,
        $ = function (t) {
            var e = t % 10;
            return 11 !== t && 1 === e ? 0 : 2 <= e && e <= 4 && !(t >= 12 && t <= 14) ? 1 : 2;
        },
        C = {
            arabic: function (t) {
                if (t < 3) return t;
                var e = t % 100;
                return e >= 3 && e <= 10 ? 3 : e >= 11 ? 4 : 5;
            },
            bosnian_serbian: $,
            chinese: function () {
                return 0;
            },
            croatian: $,
            french: function (t) {
                return t > 1 ? 1 : 0;
            },
            german: function (t) {
                return 1 !== t ? 1 : 0;
            },
            russian: $,
            lithuanian: function (t) {
                return t % 10 == 1 && t % 100 != 11 ? 0 : t % 10 >= 2 && t % 10 <= 9 && (t % 100 < 11 || t % 100 > 19) ? 1 : 2;
            },
            czech: function (t) {
                return 1 === t ? 0 : t >= 2 && t <= 4 ? 1 : 2;
            },
            polish: function (t) {
                if (1 === t) return 0;
                var e = t % 10;
                return 2 <= e && e <= 4 && (t % 100 < 10 || t % 100 >= 20) ? 1 : 2;
            },
            icelandic: function (t) {
                return t % 10 != 1 || t % 100 == 11 ? 1 : 0;
            },
            slovenian: function (t) {
                var e = t % 100;
                return 1 === e ? 0 : 2 === e ? 1 : 3 === e || 4 === e ? 2 : 3;
            },
        },
        T = {
            arabic: ["ar"],
            bosnian_serbian: ["bs-Latn-BA", "bs-Cyrl-BA", "srl-RS", "sr-RS"],
            chinese: ["id", "id-ID", "ja", "ko", "ko-KR", "lo", "ms", "th", "th-TH", "zh"],
            croatian: ["hr", "hr-HR"],
            german: ["fa", "da", "de", "en", "es", "fi", "el", "he", "hi-IN", "hu", "hu-HU", "it", "nl", "no", "pt", "sv", "tr"],
            french: ["fr", "tl", "pt-br"],
            russian: ["ru", "ru-RU"],
            lithuanian: ["lt"],
            czech: ["cs", "cs-CZ", "sk"],
            polish: ["pl"],
            icelandic: ["is"],
            slovenian: ["sl-SL"],
        };
    function P(t) {
        var e,
            i =
                ((e = {}),
                _(T, function (t, i) {
                    _(t, function (t) {
                        e[t] = i;
                    });
                }),
                e);
        return i[t] || i[k.call(t, /-/, 1)[0]] || i.en;
    }
    function I(t) {
        return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
    var E = /\$/g,
        A = /%\{(.*?)\}/g;
    function F(t, e, i, n) {
        if ("string" != typeof t) throw new TypeError("Polyglot.transformPhrase expects argument #1 to be string");
        if (null == e) return t;
        var r = t,
            o = n || A,
            a = "number" == typeof e ? { smart_count: e } : e;
        if (null != a.smart_count && r) {
            var s = k.call(r, "||||");
            r = (
                s[
                    (function (t, e) {
                        return C[P(t)](e);
                    })(i || "en", a.smart_count)
                ] || s[0]
            ).replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
        }
        return (r = S.call(r, o, function (t, e) {
            return b(a, e) && null != a[e] ? S.call(a[e], E, "$$") : t;
        }));
    }
    function j(t) {
        var e = t || {};
        (this.phrases = {}), this.extend(e.phrases || {}), (this.currentLocale = e.locale || "en");
        var i = e.allowMissing ? F : null;
        (this.onMissingKey = "function" == typeof e.onMissingKey ? e.onMissingKey : i),
            (this.warn = e.warn || x),
            (this.tokenRegex = (function (t) {
                var e = (t && t.prefix) || "%{",
                    i = (t && t.suffix) || "}";
                if ("||||" === e || "||||" === i) throw new RangeError('"||||" token is reserved for pluralization');
                return new RegExp(I(e) + "(.*?)" + I(i), "g");
            })(e.interpolation));
    }
    (j.prototype.locale = function (t) {
        return t && (this.currentLocale = t), this.currentLocale;
    }),
        (j.prototype.extend = function (t, e) {
            _(
                t,
                function (t, i) {
                    var n = e ? e + "." + i : i;
                    "object" == typeof t ? this.extend(t, n) : (this.phrases[n] = t);
                },
                this
            );
        }),
        (j.prototype.unset = function (t, e) {
            "string" == typeof t
                ? delete this.phrases[t]
                : _(
                      t,
                      function (t, i) {
                          var n = e ? e + "." + i : i;
                          "object" == typeof t ? this.unset(t, n) : delete this.phrases[n];
                      },
                      this
                  );
        }),
        (j.prototype.clear = function () {
            this.phrases = {};
        }),
        (j.prototype.replace = function (t) {
            this.clear(), this.extend(t);
        }),
        (j.prototype.t = function (t, e) {
            var i,
                n,
                r = null == e ? {} : e;
            if ("string" == typeof this.phrases[t]) i = this.phrases[t];
            else if ("string" == typeof r._) i = r._;
            else if (this.onMissingKey) {
                n = (0, this.onMissingKey)(t, r, this.currentLocale, this.tokenRegex);
            } else this.warn('Missing translation for key: "' + t + '"'), (n = t);
            return "string" == typeof i && (n = F(i, r, this.currentLocale, this.tokenRegex)), n;
        }),
        (j.prototype.has = function (t) {
            return b(this.phrases, t);
        }),
        (j.transformPhrase = function (t, e, i) {
            return F(t, e, i);
        });
    var R = j;
    var D = window.manager;
    D && w(D);
    var M = function (t, e, i) {
            var n = (i = i || {}).storage,
                r = n ? n.get("lang") || "en" : i.lang || "en";
            function o(e, o, a) {
                o.__esModule && (o = o.default);
                var c = { phrases: o };
                i.polyglot && t.manager.extend(c, i.polyglot);
                var u = (s.polyglot = new R(c));
                if ((u.locale(e), (s._ = t.manager.bind(u.t, u)), (r = e), n && n.put("lang", r), i.manager)) {
                    var l = i.manager[e];
                    l && t.manager.i18n.setLocale(l);
                }
                return a ? Promise.resolve() : t.refresh();
            }
            function a(e, n) {
                if (!1 !== i.path) {
                    var r = (i.path ? i.path + "/" : "") + e;
                    o(e, t.require("jet-locales", r), n);
                }
            }
            var s = {
                getLang: function () {
                    return r;
                },
                setLang: a,
                setLangData: o,
                _: null,
                polyglot: null,
            };
            t.setService("locale", s), a(r, !0);
        },
        V = window;
    V.Promise || (V.Promise = V.manager.promise);
    var O = 1;
    function U(t, e, i) {
        Object.defineProperty(e, i, {
            get: function () {
                return t[i];
            },
            set: function (e) {
                return (t[i] = e);
            },
        });
    }
    function z(t, e) {
        e = e || {};
        var i = {},
            n = {},
            r = function (t, e) {
                var r = O++;
                return (i[r] = { mask: t, handler: e }), e("*" === t ? n : n[t], void 0, t), r;
            },
            o = [],
            a = !1,
            s = function (t, e, n, r) {
                if (a) o.push([t, e, n, r]);
                else
                    for (var s = Object.keys(i), c = 0; c < s.length; c++) {
                        var u = i[s[c]];
                        u && (("*" !== u.mask && u.mask !== t) || u.handler(n, e, t, r));
                    }
            };
        for (var c in t)
            if (t.hasOwnProperty(c)) {
                var u = t[c];
                e.nested && "object" == typeof u && u ? (n[c] = z(u, e)) : L(n, u, c, s);
            }
        return (
            Object.defineProperty(n, "$changes", {
                value: {
                    attachEvent: r,
                    detachEvent: function (t) {
                        delete i[t];
                    },
                },
                enumerable: !1,
                configurable: !1,
            }),
            Object.defineProperty(n, "$observe", { value: r, enumerable: !1, configurable: !1 }),
            Object.defineProperty(n, "$batch", {
                value: function (t) {
                    if ("function" != typeof t) {
                        var e = t;
                        t = function () {
                            for (var t in e) n[t] = e[t];
                        };
                    }
                    for (a = !0, t(n), a = !1; o.length; ) {
                        var i = o.shift();
                        s.apply(this, i);
                    }
                },
                enumerable: !1,
                configurable: !1,
            }),
            n
        );
    }
    function L(t, e, i, n) {
        Object.defineProperty(t, i, {
            get: function () {
                return e;
            },
            set: function (t) {
                if (null === e || null === t ? e !== t : e.valueOf() != t.valueOf()) {
                    var r = e;
                    (e = t), n(i, r, t, null);
                }
            },
            enumerable: !0,
            configurable: !1,
        });
    }
    var W = !1;
    function B(t, e, i) {
        var n = e.$width,
            r = e.$height;
        t.config._fillApp ? t.define({ width: n, height: r }) : t.define({ left: (n - t.$width) / 2, top: (r - t.$height) / 2 }), i || t.resize();
    }
    function H(t, e) {
        var i = e.getRoot();
        t.attachEvent("onHide", function () {
            manager.html.removeCss(i.$view, "manager_win_inside"), i.enable();
        });
        var n = e.attachEvent("view:resize", function () {
            B(t, i);
        });
        t.attachEvent("onDestruct", function () {
            e.detachEvent(n);
        });
    }
    function N(t) {
        return {
            attachEvent: function (e, i) {
                return manager.UIManager.addHotKey(e, i, t), { key: e, handler: i };
            },
            detachEvent: function (e) {
                var i = e.key,
                    n = e.handler;
                return manager.UIManager.removeHotKey(i, n, t);
            },
        };
    }
    var G = "<span class='manager_icon wxi-folder'></span>",
        q = "<span class='manager_icon wxi-dots manager_fmanager_menu_icon'></span>",
        K = (function (t) {
            function e(e, i) {
                var n = t.call(this, e) || this;
                return (n.compact = !!i.compact), (n.tree = !!i.tree), n;
            }
            return (
                i(e, t),
                (e.prototype.config = function () {
                    var t = this,
                        e = this.app.getService("locale")._,
                        i = [
                            { id: "download", value: e("Download"), icon: "wxi-download", show: 32, hotkey: "Ctrl+D" },
                            { $template: "Separator", show: 32 },
                            { id: "toggle-preview", value: e("Preview"), icon: "wxi-eye", show: 17 },
                            { id: "locate", value: e("Open item location"), icon: "wxi-folder", hotkey: "Ctrl+Alt+O", show: 65 },
                            { id: "open", value: e("Open"), icon: "wxi-folder-open", hotkey: "Ctrl+O", show: 8 },
                            { $template: "Separator", show: 8 },
                            { id: "copy", value: e("Copy"), hotkey: "Ctrl+C", icon: "fmi-content-copy", show: 35 },
                            { id: "cut", value: e("Cut"), hotkey: "Ctrl+X", icon: "fmi-content-cut", show: 35 },
                            { id: "paste", value: e("Paste"), hotkey: "Ctrl+V", icon: "fmi-content-paste", show: 161 },
                            { $template: "Separator", show: 35 },
                            { id: "rename", value: e("Rename"), icon: "fmi-rename-box", hotkey: "Ctrl+R", show: 1 },
                            { id: "delete", value: e("Delete"), icon: "wxi-close", hotkey: "Del / &#8592;", show: 3 },
                        ];
                    return (
                        this.app.config.editor && i.splice(5, 0, { id: "edit", value: e("Edit"), icon: "wxi-pencil", hotkey: "Ctrl+E", show: 6 }),
                        {
                            view: "menu",
                            css: "manager_fmanager_menu",
                            layout: "y",
                            autoheight: !0,
                            data: i,
                            template: function (t) {
                                return (t.icon ? '<span class="manager_list_icon manager_icon ' + t.icon + '"></span>' : "") + t.value + (t.hotkey ? '<span class="manager_fmanager_context-menu-hotkey">' + t.hotkey + "</span>" : "");
                            },
                            on: {
                                onMenuItemClick: function (e) {
                                    t.app.callEvent("app:action", [e, t.Files]), t.app.callEvent("app:filemenu:click");
                                },
                            },
                        }
                    );
                }),
                (e.prototype.FilterOptions = function (t) {
                    var e = this;
                    this.Files = t;
                    var i = t[0],
                        n = t.length > 1,
                        r = ["image", "audio", "video", "code", "pdf"],
                        o = -1 != r.indexOf(i.type) || -1 != r.indexOf(i.$ext),
                        a = this.app.getState().search,
                        s = "empty" === i.type;
                    this.getRoot().define("width", a && !n ? 270 : 200),
                        this.getRoot().filter(function (t) {
                            return !(
                                (!(128 & t.show) && s) ||
                                (n && !(2 & t.show)) ||
                                ("folder" === i.type && !(1 & t.show)) ||
                                (4 & t.show && "code" !== i.type) ||
                                (8 & t.show && !o) ||
                                (16 & t.show && !e.compact) ||
                                (32 & t.show && e.tree) ||
                                (64 & t.show && !a)
                            );
                        });
                }),
                e
            );
        })(l),
        J = (function (t) {
            function e(e, i) {
                var n = t.call(this, e) || this;
                return (n._config = i), n;
            }
            return (
                i(e, t),
                (e.prototype.config = function () {
                    var t = this;
                    return {
                        view: "context",
                        body: { $subview: new (this.app.dynamic(K))(this.app, n({}, this._config)), name: "options" },
                        on: {
                            onBeforeShow: function (e) {
                                var i = t._Locate(e);
                                if (!i) return !1;
                                t.getSubView("options").FilterOptions(i);
                            },
                        },
                    };
                }),
                (e.prototype.init = function () {
                    var t = this;
                    this.on(this.app, "app:filemenu:click", function () {
                        return t.getRoot().hide();
                    });
                }),
                (e.prototype.AttachTo = function (t, e) {
                    (this._Locate = e), this.getRoot().attachTo(t);
                }),
                (e.prototype.Show = function (t) {
                    this.getRoot().show(t, { x: -t.offsetX, y: t.target.offsetHeight - t.offsetY });
                }),
                (e.prototype.Hide = function () {
                    this.getRoot().hide();
                }),
                e
            );
        })(l),
        X = (function (t) {
            function e() {
                return (null !== t && t.apply(this, arguments)) || this;
            }
            return (
                i(e, t),
                (e.prototype.init = function () {
                    var t = this;
                    (this.State = this.getParam("state")),
                        (this.Local = this.app.getService("local")),
                        (this._Track = !0),
                        this.WTable.attachEvent("onAfterSelect", function () {
                            return t.ShiftFocus();
                        }),
                        this.WTable.attachEvent("onSelectChange", function () {
                            if (t._Track) {
                                var e = []
                                    .concat(
                                        t.WTable.getSelectedId(!0).map(function (e) {
                                            return t.WTable.getItem(e);
                                        })
                                    )
                                    .filter(function (t) {
                                        return ".." !== t.value;
                                    });
                                (e.length || t.State.selectedItem.length) && (e.length || (e.$noSelect = !0), (t.State.selectedItem = e));
                            }
                        }),
                        this.on(this.State.$changes, "path", function (e, i) {
                            t.State.search
                                ? i && t.State.$batch({ search: "", searchStats: null })
                                : "files" === t.State.source &&
                                  (i
                                      ? t.Local.folders().then(function (n) {
                                            (t.State.selectedItem = t.GetPrevLocation(n, e, i)), t.LoadData(e);
                                        })
                                      : t.LoadData(e));
                        }),
                        this.on(this.WTable.data, "onStoreUpdated", function (e, i, n) {
                            !n && t.WTable.count() && t.State.selectedItem.length && t.SelectActive();
                        }),
                        this.AddHotkeys();
                    var e = this.getParam("compact", !0);
                    (this.Menu = this.ui(new (this.app.dynamic(J))(this.app, { compact: e, state: this.State }))),
                        this.Menu.AttachTo(this.WTable.$view, function (e) {
                            var i = t.WTable.locate(e);
                            if (!i) return [{ type: "empty" }];
                            var n = t.WTable.getItem(i);
                            if (".." == n.value) return !1;
                            t.WTable.isSelected(i) || t.WTable.select(i);
                            var r = t.WTable.getSelectedId(!0);
                            return 1 === r.length
                                ? [n]
                                : (r = r
                                      .map(function (e) {
                                          return t.WTable.getItem(e);
                                      })
                                      .filter(function (t) {
                                          return ".." != t.value;
                                      }));
                        }),
                        this.on(this.WTable, "onAfterScroll", function () {
                            return t.Menu.Hide();
                        }),
                        this.on(this.WTable, "onBeforeDrag", function () {
                            return t.Menu.Hide();
                        });
                }),
                (e.prototype.ShiftFocus = function () {
                    this.getParam("trackActive", !0) && (this.State.isActive = !0);
                }),
                (e.prototype.Activate = function (t) {
                    if (t.length)
                        if (1 === t.length) {
                            var e = t[0];
                            if ("folder" === e.type) this.ShowSubFolder(".." === e.value ? e.value : e.id);
                            else {
                                var i = "code" === e.type && this.app.config.editor ? "edit" : "open";
                                this.app.callEvent("app:action", [i, t]);
                            }
                        } else {
                            i = this.app.config.editor ? "edit" : "open";
                            this.app.callEvent("app:action", [i, t]);
                        }
                }),
                (e.prototype.ShowSubFolder = function (t) {
                    var e;
                    if (".." == t) {
                        var i = this.State.path.split("/");
                        e = "/" + i.slice(1, i.length - 1).join("/");
                    } else e = t;
                    this.State.path = e;
                }),
                (e.prototype.GetPrevLocation = function (t, e, i) {
                    if ("/" === i || !t.exists(i)) return [];
                    var n;
                    for ("/" === e && (e = "../files"); i; )
                        if (((n = i), (i = t.getParentId(i)) === e)) {
                            var r = t.getItem(n);
                            return [{ id: r.id, value: r.value, type: "folder", date: new Date(r.date) }];
                        }
                    return [];
                }),
                (e.prototype.GetTargetFolder = function (t) {
                    var e = t ? this.WTable.getItem(t) : null;
                    return !e || "folder" !== e.type || ".." === e.value ? this.State.path : e.id;
                }),
                (e.prototype.SelectActive = function () {
                    var t = this.WTable;
                    if (!1 !== this.State.isActive && !t.getSelectedId()) {
                        for (var e = this.State.selectedItem, i = 0; i < e.length; i++) t.exists(e[i].id) && t.select(e[i].id, !0);
                        if (!e.$noSelect && !t.getSelectedId()) {
                            var n = t.getFirstId();
                            n && (t.select(n), (e.$noSelect = !1));
                        }
                        manager.delay(function () {
                            return manager.UIManager.setFocus(t);
                        });
                    }
                }),
                (e.prototype.GetSelection = function () {
                    var t = this;
                    return this.WTable.getSelectedId(!0).map(function (e) {
                        return t.WTable.getItem(e);
                    });
                }),
                (e.prototype.LoadData = function (t, e) {
                    var i = this;
                    this._Track = !1;
                    var n = this.WTable;
                    e
                        ? (n.clearAll(),
                          this.app
                              .getService("backend")
                              .search(t, e)
                              .then(function (t) {
                                  if (i.app) {
                                      for (var e = 0; e < t.length; ++e) i.Local.prepareData(t[e]);
                                      n.parse(t), i.GetSearchStats(t);
                                  }
                              }))
                        : n.data.url !== t &&
                          (n.clearAll(),
                          this.Local.files(t).then(function (t) {
                              i.app && (i.RenderData(t), i.SelectActive());
                          })),
                        (this._Track = !0);
                }),
                (e.prototype.MoveFiles = function (t, e) {
                    return this.app.getService("operations").move(t, this.GetTargetFolder(e)), !1;
                }),
                (e.prototype.Icon = function (t) {
                    return '<img class="manager_fmanager_file-type-icon" src="' + this.app.getService("backend").icon(t) + '" />';
                }),
                (e.prototype.DragMarker = function (t) {
                    var e = this.WTable,
                        i = e.find(function (t) {
                            return ".." === t.value;
                        }, !0);
                    if (i) {
                        var n = t.source.indexOf(i.id);
                        -1 !== n && t.source.splice(n, 1);
                    }
                    var r = t.source.length;
                    if (!r) return !1;
                    1 === r && e.select(t.source[0]);
                    var o = e.getItem(t.source[0]),
                        a = "<div class='manager_fmanager_grid_drag_zone_list'>";
                    if (((a += '<div class="manager_fmanager_inner_drag_zone_list">' + ("folder" === o.type ? G : this.Icon(o)) + o.value + "</div>"), (a += "</div>"), r > 1)) {
                        a = "<div class='manager_drag_main'>" + a + "</div>";
                        var s = "<div class='manager_drag_multiple'></div>";
                        r > 2 && (s = "<div class='manager_drag_multiple_last'></div>" + s), (a = s + (a += "<div class='manager_badge'>" + r + "</div>"));
                    }
                    t.html = a;
                }),
                (e.prototype.AddHotkeys = function () {
                    var t = this,
                        e = manager.env.isMac ? "COMMAND" : "CTRL",
                        i = [
                            { key: "DELETE", oper: "delete" },
                            { key: "BACKSPACE", oper: "delete" },
                            { key: e + "+C", oper: "copy" },
                            { key: e + "+X", oper: "cut" },
                            { key: e + "+V", oper: "paste" },
                            { key: e + "+R", oper: "rename" },
                            { key: e + "+O", oper: "open" },
                            { key: e + "+D", oper: "download" },
                            { key: e + "+Alt+O", oper: "locate" },
                        ];
                    this.app.config.editor && i.push({ key: e + "+E", oper: "edit" });
                    for (
                        var n = function (e) {
                                r.on(N(r.getRoot()), i[e].key, function (n, r) {
                                    var o = [i[e].oper];
                                    t.app.callEvent("app:action", o), manager.html.preventEvent(r);
                                });
                            },
                            r = this,
                            o = 0;
                        o < i.length;
                        ++o
                    )
                        n(o);
                    this.on(N(this.getRoot()), e + "+A", function (e, i) {
                        t.WTable.selectAll(), manager.html.preventEvent(i);
                    });
                }),
                (e.prototype.GetSearchStats = function (t) {
                    var e = t.length,
                        i = t.filter(function (t) {
                            return "folder" === t.type;
                        });
                    this.State.searchStats = { folders: i ? i.length : 0, files: e - i.length };
                }),
                (e.prototype.EmptyClick = function () {
                    !1 !== this.State.isActive ? this.WTable.unselectAll() : this.ShiftFocus();
                }),
                e
            );
        })(l),
        Y = (function (t) {
            function e() {
                return (null !== t && t.apply(this, arguments)) || this;
            }
            return (
                i(e, t),
                (e.prototype.config = function () {
                    var t = this,
                        e = this.getParam("compact", !0),
                        i = "mini" === manager.skin.$name || "compact" === manager.skin.$name;
                    return {
                        view: "dataview",
                        localId: "cards",
                        drag: !e,
                        select: !0,
                        multiselect: !0,
                        css: "manager_noselect manager_fmanager_cards",
                        template: function (e) {
                            return t.CardTemplate(e);
                        },
                        type: n(n({}, i ? { height: 149, width: 181, padding: 16 } : { height: 197, width: 236, padding: 20 }), { type: "tiles" }),
                        on: {
                            onItemDblClick: function () {
                                return t.Activate(t.GetSelection());
                            },
                            onEnter: function () {
                                return t.Activate(t.GetSelection());
                            },
                            onBeforeDrag: function (e) {
                                return t.DragMarker(e);
                            },
                            onBeforeDrop: function (e) {
                                return t.MoveFiles(e.source, e.target);
                            },
                        },
                        onClick: {
                            manager_fmanager_menu_icon: function (e) {
                                t.Menu.Show(e);
                            },
                            manager_dataview: function (e, i) {
                                i || t.EmptyClick();
                            },
                        },
                        onContext: {
                            manager_dataview: function (e, i) {
                                i || t.EmptyClick();
                            },
                        },
                    };
                }),
                (e.prototype.init = function () {
                    (this.WTable = this.$$("cards")), t.prototype.init.call(this);
                }),
                (e.prototype.RenderData = function (t) {
                    var e = this;
                    this.WTable.sync(t, function () {
                        return e.WTable.filter(function (t) {
                            return ".." !== t.value;
                        });
                    });
                }),
                (e.prototype.CardTemplate = function (t) {
                    var e,
                        i,
                        n = this.app.getService("locale")._;
                    if ("folder" === t.type)
                        (e = "<div class=\"manager_fmanager_card_preview\"><span class='manager_icon wxi-folder manager_fmanager_folder_icon'></span></div>"),
                            (i =
                                '<div class="manager_fmanager_card_panel">\n\t\t<span class="manager_fmanager_card_label">' +
                                n("Folder") +
                                '</span>\n\t\t<span class="manager_fmanager_card_name folder">' +
                                this.SearchTemplate(t.value) +
                                "</span>" +
                                q +
                                "\n\t\t</div>");
                    else {
                        var r = manager.skin.$active.listItemHeight < 29 ? [163, 92] : [214, 124],
                            o = this.app.getService("backend").previewURL(t, r[0], r[1]);
                        (e = '<div class="manager_fmanager_card_preview file">' + ('<img height="' + r[1] + '" width="' + r[0] + '" src="' + o + '" onerror=\'this.style.display="none"\'/>') + "</div>"),
                            (i =
                                '<div class="manager_fmanager_card_panel file">\n\t\t<span class="manager_fmanager_card_name">' +
                                this.Icon(t) +
                                '<span class="file_name_text">' +
                                this.SearchTemplate(t.value) +
                                "</span></span>" +
                                q +
                                "\n\t\t</div>");
                    }
                    return e + i;
                }),
                (e.prototype.SearchTemplate = function (t) {
                    if (this.State.search) {
                        var e = new RegExp("(" + this.State.search + ")", "gi");
                        return t.replace(e, "<span class='manager_fmanager_search_mark'>$1</span>");
                    }
                    return t;
                }),
                e
            );
        })(X);
    function Z(t) {
        var e = t.value.lastIndexOf(".");
        e > -1 ? t.setSelectionRange(0, e) : t.select();
    }
    function Q(t, e, i) {
        if (!((i = i || { i: 0, cancel: !1 }).i >= t.length))
            return e(t[i.i], i.i).then(function () {
                if (((i.i += 1), !i.cancel)) return Q(t, e, i);
            });
    }
    function tt(t) {
        return t >= 1e9 ? (t / 1e9).toFixed(1) + " Gb" : t >= 1e6 ? (t / 1e6).toFixed(1) + " Mb" : t >= 1e3 ? (t / 1e3).toFixed(1) + " kb" : t + " b";
    }
    function et(t) {
        return t.length ? t[t.length - 1] : { type: "empty", value: "Nothing is selected" };
    }
    function it(t) {
        for (t = t.replace(/[/\\:*?"<>|]/g, "").trim(); "." === t[0]; ) t = t.substr(1).trim();
        return t;
    }
    function nt(t) {
        return t ? t.charAt(0).toUpperCase() + t.slice(1) : "";
    }
    manager.protoUI(
        {
            name: "codemirror-editor",
            defaults: { mode: "javascript", lineNumbers: !0, matchBrackets: !0, theme: "default" },
            $init: function (t) {
                (this.$view.innerHTML = "<textarea style='width:100%;height:100%;'></textarea>"), (this._textarea = this.$view.firstChild), (this._waitEditor = manager.promise.defer()), this.$ready.push(this._render_cm_editor);
            },
            complex_types: {
                php: { mode: ["xml", "javascript", "css", "htmlmixed", "clike"] },
                htmlembedded: { mode: ["xml", "javascript", "css", "htmlmixed"], addon: ["mode/multiplex"] },
                htmlmixed: { mode: ["xml", "javascript", "css"] },
                dockerfile: { addon: ["mode/simple"] },
            },
            _render_cm_editor: function () {
                if (!1 !== this.config.cdn) {
                    var t = this.config.cdn || "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.48.4/",
                        e = [t + "/codemirror.css", t + "/codemirror.js"],
                        i = this.config.mode ? this.config.mode : "javascript",
                        n = this.complex_types[i];
                    n &&
                        (n.mode &&
                            n.mode.forEach(function (i) {
                                var n = "/mode/" + i + "/" + i + ".js";
                                e.push(t + n);
                            }),
                        n.addon &&
                            n.addon.forEach(function (i) {
                                var n = "/addon/" + i + ".js";
                                e.push(t + n);
                            })),
                        e.push(t + "/mode/" + i + "/" + i + ".js"),
                        this.config.theme && "default" !== this.config.theme && e.push(t + "/theme/" + this.config.theme + ".css"),
                        this.config.matchBrackets && e.push(t + "/addon/edit/matchbrackets.js"),
                        manager
                            .require(e)
                            .then(manager.bind(this._render_when_ready, this))
                            .catch(function (t) {
                                console.log(t);
                            });
                } else this._render_when_ready;
            },
            _render_when_ready: function () {
                (this._editor = CodeMirror.fromTextArea(this._textarea, { mode: this.config.mode, lineNumbers: this.config.lineNumbers, matchBrackets: this.config.matchBrackets, theme: this.config.theme })),
                    this._waitEditor.resolve(this._editor),
                    this.setValue(this.config.value),
                    this._focus_await && this.focus();
            },
            _set_inner_size: function () {
                this._editor && this.$width && (this._updateScrollSize(), this._editor.scrollTo(0, 0));
            },
            _updateScrollSize: function () {
                var t = this._editor.getWrapperElement(),
                    e = (this.$height || 0) + "px";
                (t.style.height = e), (t.style.width = (this.$width || 0) + "px");
                var i = this._editor.getScrollerElement();
                i.style.height != e && ((i.style.height = e), this._editor.refresh());
            },
            $setSize: function (t, e) {
                manager.ui.view.prototype.$setSize.call(this, t, e) && this._set_inner_size();
            },
            setValue: function (t) {
                t || 0 === t || (t = ""), (this.config.value = t), this._editor && (this._editor.setValue(t), this.config.preserveUndoHistory || this._editor.clearHistory(), this._updateScrollSize());
            },
            getValue: function () {
                return this._editor ? this._editor.getValue() : this.config.value;
            },
            focus: function () {
                (this._focus_await = !0), this._editor && this._editor.focus();
            },
            getEditor: function (t) {
                return t ? this._waitEditor : this._editor;
            },
            undo: function () {
                this._editor.undo();
            },
            redo: function () {
                this._editor.redo();
            },
            undoLength: function () {
                return this._editor.historySize().undo;
            },
        },
        manager.ui.view
    );
    var rt = {
            css: ["css", "less"],
            go: ["go"],
            htmlmixed: ["html", "xml", "svg"],
            javascript: ["js", "mjs", "json", "ts", "coffee"],
            markdown: ["md"],
            php: ["php", "phtml", "php3", "php4", "php5", "php7", "php-s", "pht", "phar"],
            python: ["py", "pyc", "pyd", "pyo", "pyw", "pyz"],
            sql: ["sql", "sqlite3", "sqlite", "db"],
            yaml: ["yaml", "yml"],
            shell: ["sh"],
        },
        ot = (function (t) {
            function e() {
                return (null !== t && t.apply(this, arguments)) || this;
            }
            return (
                i(e, t),
                (e.prototype.config = function () {
                    var t = this;
                    (this._ = this.app.getService("locale")._), (this.Files = this.getParam("files"));
                    var e = {
                            view: "tabbar",
                            localId: "tabbar",
                            css: "manager_fmanager_editor_tabs",
                            borderless: !0,
                            tabMinWidth: 170,
                            moreTemplate: "<span class='manager_icon manager_tabbar_more fmi-format-list-bulleted'></span>",
                            tooltip: function (t) {
                                return t.id;
                            },
                            options: [],
                            on: {
                                onChange: function (e) {
                                    return t.OpenDoc(e);
                                },
                                onBeforeTabClick: function (e, i) {
                                    return t.TabAction(e, i);
                                },
                            },
                            tabbarPopup: { css: "manager_gantt_editor_popup" },
                        },
                        i = manager.skin.$active,
                        n = { view: "toolbar", css: "manager_fmanager_editor_bar", padding: { left: 4, right: 4, top: 0, bottom: 0 }, height: i.toolbarHeight + !(i.toolbarHeight % 2), cols: manager.env.mobile ? this.GetMobileControls() : [e] };
                    return (
                        manager.env.mobile ? n.cols.push(this.GetCloseAll(!0)) : n.cols.push({ width: 12 }, this.GetCloseAll()),
                        { type: "wide", rows: [n, { view: "codemirror-editor", localId: "editor", theme: "contrast" === manager.skin.$name ? "monokai" : "default" }] }
                    );
                }),
                (e.prototype.GetMobileControls = function () {
                    var t = this;
                    return [
                        {
                            view: "button",
                            localId: "saveBtn",
                            type: "icon",
                            label: this._("Save"),
                            icon: "wxi-check",
                            css: "manager_primary manager_fmanager_editor_save",
                            width: 90,
                            click: function () {
                                return t.Save();
                            },
                        },
                        { view: "label", label: " ", localId: "name", css: "manager_fmanager_editor_name" },
                    ];
                }),
                (e.prototype.GetCloseAll = function (t) {
                    var e = this;
                    return {
                        view: "icon",
                        icon: t ? "wxi-close" : "fmi-exit-to-app",
                        click: function () {
                            return e.ConfirmAll();
                        },
                        tooltip: this._("Close the editor") + " (Esc)",
                    };
                }),
                (e.prototype.init = function () {
                    var t = this,
                        e = this.$$("editor");
                    if ((manager.extend(e, manager.ProgressBar), e.showProgress({ type: "top" }), manager.env.mobile)) {
                        var i = this.Files[0];
                        this.$$("name").setValue(this.GetFileLabel(i));
                    }
                    (this._oldValue = {}),
                        (this._changed = {}),
                        (this._buffers = {}),
                        e.getEditor(!0).then(function (i) {
                            Q(t.Files, function (e) {
                                return t.app
                                    .getService("operations")
                                    .read(e.id)
                                    .then(function (i) {
                                        return t.AddDoc(e, i);
                                    });
                            })
                                .then(function () {
                                    if (!manager.env.mobile) {
                                        for (var e = t.$$("tabbar"), i = 0; i < t.Files.length; ++i) t.AddTab(e, t.Files[i]);
                                        e.setValue(e.config.options[0].id);
                                    }
                                    t.OpenDoc(t.Files[0].id);
                                })
                                .finally(function () {
                                    e.hideProgress();
                                }),
                                t.HandleChanges(i);
                        });
                    var n = manager.env.isMac ? "COMMAND" : "CTRL";
                    this.on(N(), n + " + S", function (e, i) {
                        t.Save(), manager.html.preventEvent(i);
                    }),
                        this.on(N(), n + " + Shift + S", function () {
                            return t.SaveAll();
                        }),
                        this.on(N(), "ESC", function () {
                            return t.ConfirmAll();
                        });
                }),
                (e.prototype.HandleChanges = function (t) {
                    var e = this;
                    t.on("changes", function () {
                        e.TextChanged(e.GetActiveFile());
                    });
                }),
                (e.prototype.AddDoc = function (t, e) {
                    (this._oldValue[t.id] = e), (this._buffers[t.id] = CodeMirror.Doc(e, this.GetFileType(t)));
                }),
                (e.prototype.GetFileLabel = function (t, e) {
                    return '<div class="filename">' + this.ClipName(e ? t.value : t.id) + '</div><span class="extension">.' + t.$ext + "</span>";
                }),
                (e.prototype.ClipName = function (t) {
                    if (!t) return "";
                    var e = t.split(".");
                    return e.slice(0, e.length - 1).join(".");
                }),
                (e.prototype.AddTab = function (t, e) {
                    var i = '<span class="manager_fmanager_tab_action manager_icon wxi-close" manager_tooltip="' + this._("Close this file") + '"></span>',
                        n = '<div class="tab_content">' + this.GetFileLabel(e, !0) + i + "</div>",
                        r = manager.html.getTextSize(e.value, "manager_item_tab").width + 90;
                    t.addOption({ id: e.id, value: n, css: "manager_fmanager_editor_tab", width: r > 250 ? 250 : r });
                }),
                (e.prototype.OpenDoc = function (t) {
                    var e = this;
                    this.$$("editor")
                        .getEditor(!0)
                        .then(function (i) {
                            i.swapDoc(e._buffers[t]), i.focus();
                        });
                }),
                (e.prototype.Back = function () {
                    this.show("/top", { params: { state: this.getParam("state") } });
                }),
                (e.prototype.ConfirmAll = function () {
                    var t = this;
                    this.CheckChanges()
                        ? manager.confirm({ container: this.app.getRoot().$view, text: this._("Are you sure you want to exit without saving?") }).then(function () {
                              return t.Back();
                          })
                        : this.Back();
                }),
                (e.prototype.TabAction = function (t, e) {
                    if (e) {
                        var i = e.target.className,
                            n = -1 !== i.indexOf("manager_icon") && t == this.$$("tabbar").getValue();
                        return n && (-1 !== i.indexOf("close") ? this.CloseTab(t) : -1 !== i.indexOf("circle") && this.ConfirmOne(t)), !n;
                    }
                    return !0;
                }),
                (e.prototype.ConfirmOne = function (t) {
                    var e = this;
                    manager
                        .confirm({ container: this.app.getRoot().$view, text: this._("Save before closing?") })
                        .then(function () {
                            e.Save(t).then(function () {
                                return e.CloseTab(t);
                            });
                        })
                        .catch(function () {
                            e.CloseTab(t);
                        });
                }),
                (e.prototype.CheckChanges = function () {
                    for (var t in this._changed) if (this._changed[t]) return !0;
                    return !1;
                }),
                (e.prototype.SaveAll = function () {
                    var t = this,
                        e = this.Files.filter(function (e) {
                            return t._changed[e.id];
                        });
                    e.length &&
                        Q(e, function (e) {
                            return t.WriteFileContent(e.id);
                        }).then(function () {
                            t.ChangeTextState(!1);
                        });
                }),
                (e.prototype.Save = function (t) {
                    var e = this;
                    return (
                        t || (t = this.GetActiveFile()),
                        this._changed[t]
                            ? this.WriteFileContent(t).then(function () {
                                  e.ChangeTextState(!1, t);
                              })
                            : manager.promise.resolve()
                    );
                }),
                (e.prototype.WriteFileContent = function (t) {
                    var e = this,
                        i = this._buffers[t].getValue();
                    return this.app
                        .getService("operations")
                        .write(t, i)
                        .then(function () {
                            e._oldValue[t] = i;
                        });
                }),
                (e.prototype.GetActiveFile = function () {
                    return manager.env.mobile ? this.Files[0].id : this.$$("tabbar").getValue();
                }),
                (e.prototype.GetFileType = function (t) {
                    if ("Dockerfile" === t.value) return "dockerfile";
                    if (t.$ext) for (var e in rt) if (-1 !== rt[e].indexOf(t.$ext)) return e;
                    return "htmlmixed";
                }),
                (e.prototype.TextChanged = function (t) {
                    var e = this._buffers[t] == this._oldValue[t];
                    this.ChangeTextState(!e, t);
                }),
                (e.prototype.ChangeTextState = function (t, e) {
                    (e && t === !!this._changed[e]) || (e ? (this._changed[e] = t) : (this._changed = {}), manager.env.mobile ? this.ChangeButtonState(t) : this.ChangeTabsState(t, e));
                }),
                (e.prototype.ChangeButtonState = function (t) {
                    var e = this.$$("saveBtn");
                    (e.config.icon = t ? "manager_fmanager_icon fmi-circle" : "wxi-check"), e.refresh();
                }),
                (e.prototype.ChangeTabsState = function (t, e) {
                    var i = this.$$("tabbar");
                    if (e) {
                        var n = i.getOption(e);
                        this.ChangeTabState(n, t);
                    } else for (var r = i.config.options, o = 0; o < r.length; ++o) this.ChangeTabState(r[o], t);
                    i.refresh();
                }),
                (e.prototype.ChangeTabState = function (t, e) {
                    t.value = t.value.replace(e ? "wxi-close" : "manager_fmanager_icon fmi-circle", e ? "manager_fmanager_icon fmi-circle" : "wxi-close");
                }),
                (e.prototype.CloseTab = function (t) {
                    var e = this.$$("tabbar");
                    if ((e.removeOption(t), !e.getValue())) return this.Back();
                    delete this._buffers[t], delete this._changed[t], delete this._oldValue[t];
                }),
                e
            );
        })(l);
    function at(t, e) {
        var i = new manager.promise.defer();
        return (
            manager
                .ui(
                    e.getService("jet-win").updateConfig({
                        view: "window",
                        css: "manager_fmanager_prompt",
                        head: {
                            view: "toolbar",
                            padding: { left: 12, right: 4 },
                            borderless: !0,
                            elements: [
                                { view: "label", label: t.text },
                                {
                                    view: "icon",
                                    icon: "wxi-close",
                                    hotkey: "esc",
                                    click: function () {
                                        i.reject("prompt cancelled"), this.getTopParentView().close();
                                    },
                                },
                            ],
                        },
                        body: {
                            view: "form",
                            padding: { top: 0, left: 12, right: 12, bottom: 12 },
                            rows: [
                                {
                                    margin: 10,
                                    cols: [
                                        { view: "text", name: "name", value: t.value, maxWidth: 230, validate: it, css: "manager_fmanager_prompt_input" },
                                        {
                                            view: "button",
                                            value: t.button,
                                            css: "manager_primary",
                                            width: 100,
                                            hotkey: "enter",
                                            click: function () {
                                                var t = this.getTopParentView(),
                                                    e = t.getBody();
                                                if (e.validate()) {
                                                    var n = e.getValues().name;
                                                    i.resolve(n), t.close();
                                                } else manager.UIManager.setFocus(e);
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        on: {
                            onShow: function () {
                                var e = this.getBody().elements.name.getInputNode();
                                e.focus(), t.selectMask ? t.selectMask(e) : e.select();
                            },
                        },
                    })
                )
                .show(),
            i
        );
    }
    var st = (function (t) {
            function e() {
                return (null !== t && t.apply(this, arguments)) || this;
            }
            return (
                i(e, t),
                (e.prototype.config = function () {
                    var t = this,
                        e = this.app.getService("locale")._;
                    return {
                        view: "popup",
                        width: 198,
                        body: {
                            view: "menu",
                            autoheight: !0,
                            layout: "y",
                            css: "manager_fmanager_add_new_menu",
                            data: [
                                { id: "makefile", value: e("Add new file"), icon: "manager_fmanager_icon fmi-file-plus-outline" },
                                { id: "makedir", value: e("Add new folder"), icon: "manager_fmanager_icon fmi-folder-plus-outline" },
                                { $template: "Separator" },
                                { id: "upload", value: e("Upload file"), icon: "manager_fmanager_icon fmi-file-upload-outline" },
                                { id: "uploaddir", value: e("Upload folder"), icon: "manager_fmanager_icon fmi-folder-upload-outline" },
                            ],
                            on: {
                                onMenuItemClick: function (e) {
                                    return t.StartAction(e);
                                },
                            },
                        },
                    };
                }),
                (e.prototype.Show = function (t) {
                    this.getRoot().show(t, { x: 20 });
                }),
                (e.prototype.StartAction = function (t) {
                    var e = this;
                    if ("makefile" === t || "makedir" === t) {
                        var i = this.app.getService("locale")._;
                        at({ text: i("Enter a new name"), button: i("Add"), selectMask: Z, value: "New " + ("makefile" === t ? "file.txt" : "folder") }, this.app).then(function (i) {
                            e.app.callEvent("app:action", [t, it(i)]);
                        });
                    } else this.app.callEvent("app:action", [t]);
                    this.getRoot().hide();
                }),
                e
            );
        })(l),
        ct = (function (t) {
            function e() {
                return (null !== t && t.apply(this, arguments)) || this;
            }
            return (
                i(e, t),
                (e.prototype.config = function () {
                    var t = this,
                        e = this.app.getService("locale")._;
                    return {
                        view: "proxy",
                        body: {
                            rows: [
                                {
                                    view: "button",
                                    value: e("Add New"),
                                    inputWidth: 210,
                                    css: "manager_primary",
                                    align: "center",
                                    click: function () {
                                        this.$scope.Menu.Show(this.$view);
                                    },
                                },
                                {
                                    view: "tree",
                                    localId: "tree",
                                    css: "manager_fmanager_tree",
                                    select: !0,
                                    drag: "target",
                                    type: {
                                        template: function (t, i) {
                                            return "" + i.icon(t) + i.folder(t) + " <span>" + (1 === t.$level ? e(t.value) : t.value) + "</span>";
                                        },
                                        folder: function (t) {
                                            return "<div class='manager_icon wxi-" + (t.icon || "folder") + "'></div>";
                                        },
                                    },
                                    borderless: !0,
                                    on: {
                                        onBeforeDrop: function (e) {
                                            return t.MoveFiles(e.source, e.target);
                                        },
                                        onBeforeContextMenu: function (e) {
                                            if (".." === e.substr(0, 2)) return !1;
                                            t.Tree.select(e);
                                        },
                                    },
                                },
                                {
                                    localId: "fs:stats",
                                    borderless: !0,
                                    height: 68,
                                    css: "manager_fmanager_fsstats",
                                    template: function (t) {
                                        return (
                                            '<svg width="100%" height="20px">\n<rect y="1" rx="4" width="100%" height="8" style="fill:#DFE2E6;" />\n<rect y="1" rx="4" width="' +
                                            (Math.floor((t.used / t.total) * 100) || 0) +
                                            '%" height="8" style="fill:' +
                                            manager.skin.$active.timelineColor +
                                            ';" /></svg>' +
                                            ('<div class="manager_fmanager_fsstats_label">' + tt(t.used || 0) + " " + e("of") + " " + tt(t.total || 0) + " " + e("used") + "</div>")
                                        );
                                    },
                                },
                            ],
                            padding: { top: 8, bottom: 4 },
                        },
                    };
                }),
                (e.prototype.init = function () {
                    var t = this;
                    (this.State = this.getParam("state")),
                        (this.Tree = this.$$("tree")),
                        this.app
                            .getService("local")
                            .folders()
                            .then(function (e) {
                                t.Tree.sync(e), t.Subscribe(), t.GetFsStats();
                            }),
                        (this.Menu = this.ui(st)),
                        (this.ContextMenu = this.ui(new (this.app.dynamic(J))(this.app, { compact: !1, tree: !0 }))),
                        this.ContextMenu.AttachTo(this.Tree, function (e) {
                            var i = t.Tree.locate(e);
                            return i ? [t.Tree.getItem(i)] : null;
                        }),
                        this.on(this.app, "reload:fs:stats", function () {
                            return t.GetFsStats(!0);
                        });
                }),
                (e.prototype.Subscribe = function () {
                    var t = this;
                    this.Tree.attachEvent("onAfterSelect", function () {
                        var e = t.Tree.getSelectedId();
                        ".." == e.substr(0, 2) ? t.State.$batch({ source: e.slice(3), path: "/" }) : t.State.$batch({ source: t.GetRootId(e).slice(3), path: e }), (t.TreeState = t.Tree.getState());
                    }),
                        this.Tree.attachEvent("onAfterOpen", function () {
                            t.TreeState = t.Tree.getState();
                        }),
                        this.on(this.State.$changes, "path", function (e) {
                            if (((t.State.path = e), t.Tree.exists(e))) {
                                t.Tree.select(e);
                                var i = t.Tree.getParentId(e);
                                i && t.Tree.open(i), t.Tree.showItem(e);
                            } else t.Tree.select("../" + t.State.source);
                        }),
                        this.app
                            .getService("local")
                            .folders()
                            .then(function (e) {
                                t.on(e.data, "onStoreUpdated", function (e) {
                                    !e && t.Tree.count() && t.Tree.setState(t.TreeState);
                                });
                            });
                }),
                (e.prototype.GetFsStats = function (t) {
                    var e = this;
                    this.app
                        .getService("backend")
                        .getInfo(t)
                        .then(function (t) {
                            e.$$("fs:stats").setValues(t.stats);
                        });
                }),
                (e.prototype.MoveFiles = function (t, e) {
                    return "../files" === e && (e = "/"), this.app.getService("operations").move(t, e), !1;
                }),
                (e.prototype.GetRootId = function (t) {
                    for (var e; t; ) (e = t), (t = this.Tree.getParentId(t));
                    return e;
                }),
                e
            );
        })(l),
        ut = (function (t) {
            function e() {
                return (null !== t && t.apply(this, arguments)) || this;
            }
            return (
                i(e, t),
                (e.prototype.config = function () {
                    var t = this,
                        e = this.app.getService("locale")._,
                        i = this.getParam("compact", !0),
                        n = {
                            view: "datatable",
                            localId: "table",
                            css: "manager_noselect manager_header_border manager_fmanager_filelist",
                            select: "row",
                            multiselect: !0,
                            drag: !0,
                            resizeColumn: { headerOnly: !0 },
                            sort: "multi",
                            type: {
                                backIcon: function () {
                                    return "<span class='manager_icon wxi-angle-double-left manager_fmanager_back_icon'></span>";
                                },
                                backLabel: function () {
                                    return e("back to parent folder");
                                },
                            },
                            on: {
                                onItemDblClick: function () {
                                    return t.Activate(t.GetSelection());
                                },
                                onEnter: function () {
                                    return t.Activate(t.GetSelection());
                                },
                                onBeforeDrag: function (e) {
                                    return t.DragMarker(e);
                                },
                                onBeforeDrop: function (e) {
                                    return t.MoveFiles(e.source, e.target);
                                },
                                "data->onStoreLoad": function () {
                                    t.WTable.markSorting();
                                },
                            },
                            onClick: {
                                manager_ss_center_scroll: function () {
                                    return t.EmptyClick();
                                },
                                manager_column: function () {
                                    return !1;
                                },
                            },
                            onContext: {
                                manager_ss_center_scroll: function (e, i) {
                                    i || t.EmptyClick();
                                },
                            },
                            columns: [
                                {
                                    id: "value",
                                    header: "",
                                    template: function (e) {
                                        return t.NameTemplate(e);
                                    },
                                    sort: lt("value"),
                                    fillspace: !0,
                                },
                                {
                                    id: "size",
                                    header: e("Size"),
                                    template: function (t) {
                                        return "folder" !== t.type ? tt(t.size) : "";
                                    },
                                    sort: lt("size"),
                                },
                                {
                                    id: "date",
                                    header: e("Date"),
                                    sort: lt("date"),
                                    format: function (t) {
                                        return t instanceof Date && !isNaN(t) ? manager.i18n.longDateFormatStr(t) : "";
                                    },
                                    width: 150,
                                },
                            ],
                        };
                    return i && n.columns.splice(1, 2), n;
                }),
                (e.prototype.init = function () {
                    var e = this;
                    (this.WTable = this.$$("table")),
                        t.prototype.init.call(this),
                        this.on(this.State.$changes, "isActive", function (t) {
                            t
                                ? (e.SelectActive(),
                                  manager.delay(function () {
                                      return manager.UIManager.setFocus(e.WTable);
                                  }))
                                : (e.Menu.Hide(), (e._Track = !1), e.WTable.unselect(), (e._Track = !0));
                        }),
                        this.on(N(this.getRoot()), "TAB", function () {
                            e.getParam("trackActive", !0) && (e.State.isActive = !1);
                        });
                }),
                (e.prototype.RenderData = function (t) {
                    this.WTable.sync(t);
                }),
                (e.prototype.NameTemplate = function (t) {
                    return "folder" === t.type ? G + t.value : this.Icon(t) + '<span class="file-name">' + t.value + "</span>";
                }),
                e
            );
        })(X);
    function lt(t) {
        return function (e, i) {
            return ".." === e.value || ".." === i.value || ("folder" === e.type && "folder" !== i.type) || ("folder" === i.type && "folder" !== e.type)
                ? 0
                : "value" === t
                ? e.value.localeCompare(i.value, void 0, { ignorePunctuation: !0, numeric: !0 })
                : e[t] < i[t]
                ? -1
                : e[t] > i[t]
                ? 1
                : 0;
        };
    }
    var pt = (function (t) {
            function e() {
                return (null !== t && t.apply(this, arguments)) || this;
            }
            return (
                i(e, t),
                (e.prototype.config = function () {
                    return this.app.getService("jet-win").updateConfig({ view: "window", borderless: !0, head: !1, fullscreen: !0, body: { $subview: !0, branch: !0, name: "preview" } });
                }),
                (e.prototype.IsVisible = function () {
                    return this.getRoot().isVisible();
                }),
                (e.prototype.Show = function (t) {
                    this.show("preview", { target: "preview", params: { state: t.state, compact: !0 } }), this.getRoot().show();
                }),
                (e.prototype.Hide = function () {
                    this.show("_blank", { target: "preview" }), this.getRoot().hide();
                }),
                e
            );
        })(l),
        ht = (function (t) {
            function e() {
                return (null !== t && t.apply(this, arguments)) || this;
            }
            return (
                i(e, t),
                (e.prototype.config = function () {
                    var t = this;
                    return {
                        view: "sidemenu",
                        css: "manager_files_sidemenu",
                        width: 300,
                        animate: !1,
                        state: function (e) {
                            var i = manager.skin.$active.toolbarHeight + 14;
                            (e.left = t.Parent.left), (e.top = t.Parent.top + i), (e.height = t.Parent.height - i);
                        },
                        body: ct,
                    };
                }),
                (e.prototype.init = function () {
                    var t = this;
                    this.on(this.app, "view:resize", function () {
                        t.getRoot().isVisible() && t.Show(!0);
                    });
                }),
                (e.prototype.Show = function (t) {
                    (!t && this.getRoot().isVisible()) || ((this.Parent = this.app.getRoot().$view.getBoundingClientRect()), this.getRoot().show());
                }),
                e
            );
        })(l),
        ft = (function (t) {
            function e() {
                return (null !== t && t.apply(this, arguments)) || this;
            }
            return (
                i(e, t),
                (e.prototype.config = function () {
                    return { type: "wide", cols: [{ $subview: !0, branch: !0, name: "left" }, { view: "resizer" }, { $subview: !0, branch: !0, name: "right" }] };
                }),
                (e.prototype.init = function () {
                    this.State = this.getParam("state");
                    var t = z({ selectedItem: [].concat(this.State.selectedItem), path: this.State.path, source: this.GetSource("left"), mode: "list", isActive: !0 });
                    t.selectedItem.$noSelect = this.State.selectedItem.$noSelect;
                    var e = z({ selectedItem: [], path: this.State.path, source: this.GetSource("right"), mode: "list", isActive: !1 });
                    this._TrackChanges(t, e), this._TrackChanges(e, t), this.show("panel/list", { target: "left", params: { trackActive: !0, state: t } }), this.show("panel/list", { target: "right", params: { trackActive: !0, state: e } });
                }),
                (e.prototype._TrackChanges = function (t, e) {
                    var i = this;
                    this.on(t.$changes, "path", function (e) {
                        t.isActive && (i.State.path = e);
                    }),
                        this.on(t.$changes, "source", function (t) {
                            return (i.State.source = t);
                        }),
                        this.on(t.$changes, "selectedItem", function (e) {
                            t.isActive && (i.State.selectedItem = e);
                        }),
                        this.on(t.$changes, "isActive", function (n) {
                            n && i.State.$batch({ path: t.path, source: t.source }), (e.isActive = !n);
                        }),
                        this.on(this.app, "pathChanged", function (e, i) {
                            t.isActive || (t.path !== e && 0 !== t.path.indexOf(e + "/")) || (t.path = t.path.replace(e, i));
                        });
                }),
                (e.prototype.GetSource = function () {
                    return this.State.source;
                }),
                e
            );
        })(l),
        dt = (function (t) {
            function e() {
                return (null !== t && t.apply(this, arguments)) || this;
            }
            return (
                i(e, t),
                (e.prototype.config = function () {
                    var t = this;
                    this.State = this.getParam("state");
                    var e = this.app.getService("locale")._;
                    return {
                        rows: [
                            {
                                view: "toolbar",
                                cols: [
                                    {
                                        view: "icon",
                                        icon: "wxi-angle-left",
                                        click: function () {
                                            t.State.$batch({ search: "", searchStats: null });
                                        },
                                    },
                                    {
                                        localId: "header",
                                        type: "header",
                                        borderless: !0,
                                        css: "manager_fmanager_path",
                                        template: function (i) {
                                            var n = e("Search results in"),
                                                r = t.app.getService("backend").getRootName(),
                                                o = "";
                                            return i && i.path && "/" !== i.path && (o = manager.template.escape(i.path)), n + " " + r + o;
                                        },
                                    },
                                    {},
                                ],
                            },
                            { $subview: !0, params: { state: this.State } },
                        ],
                    };
                }),
                (e.prototype.init = function () {
                    this.$$("header").setValues({ path: this.State.path });
                }),
                (e.prototype.ready = function () {
                    var t = this;
                    this.on(this.State.$changes, "search", function (e) {
                        (e = e.trim()) && ((t.State.selectedItem = []), t.getSubView().LoadData(t.State.path, e));
                    });
                }),
                e
            );
        })(l),
        vt = (function (t) {
            function e() {
                return (null !== t && t.apply(this, arguments)) || this;
            }
            return (
                i(e, t),
                (e.prototype.config = function () {
                    var t = this;
                    return {
                        rows: [
                            {
                                view: "toolbar",
                                paddingX: 4,
                                cols: [
                                    {
                                        view: "icon",
                                        icon: "wxi-sync",
                                        css: "manager_fmanager_spec_icon",
                                        tooltip: "Refresh",
                                        click: function () {
                                            t.app.getService("local").refresh(t.State.path);
                                        },
                                    },
                                    {
                                        view: "template",
                                        localId: "path",
                                        type: "header",
                                        borderless: !0,
                                        css: "manager_fmanager_path",
                                        template: function (e) {
                                            return t.RenderPath(e);
                                        },
                                        onClick: {
                                            manager_fmanager_path_chunk: function (e) {
                                                return t.ChangePath(e);
                                            },
                                        },
                                    },
                                ],
                            },
                            { $subview: !0, params: { state: this.getParam("state") } },
                        ],
                    };
                }),
                (e.prototype.init = function () {
                    var t = this;
                    (this.State = this.getParam("state")),
                        this.on(this.State.$changes, "path", function (e) {
                            return t.ProcessPath(e);
                        });
                    var e = this.app.getService("upload").getUploader();
                    e.addDropZone(this.getRoot().$view),
                        this.on(e, "onBeforeFileDrop", function (i, n) {
                            t.getRoot().$view.contains(n.target) && (e.config.tempUrlData = { id: t.State.path });
                        });
                }),
                (e.prototype.ProcessPath = function (t) {
                    var e = this;
                    this.app
                        .getService("local")
                        .folders()
                        .then(function (i) {
                            var n = ["/"];
                            if ("/" !== t) for (var r = t.split("/"), o = 1, a = ""; o < r.length; ++o) (a += "/" + r[o]), n.push(i.getItem(a).value);
                            e.$$("path").setValues({ path: n });
                        });
                }),
                (e.prototype.RenderPath = function (t) {
                    if (t.path && t.path.length) {
                        var e = this.app.getService("backend").getRootName(),
                            i = "";
                        return (
                            t.path.forEach(function (n, r) {
                                (i += '<span class="manager_fmanager_path_chunk" data-path="' + r + '">' + (r ? n : e) + "</span>"), r < t.path.length - 1 && (i += "<span class='manager_icon wxi-angle-right'></span>");
                            }),
                            i
                        );
                    }
                    return "";
                }),
                (e.prototype.ChangePath = function (t) {
                    var e = 1 * t.target.getAttribute("data-path"),
                        i = this.State.path.split("/");
                    i.splice(e + 1, i.length - 1);
                    var n = i.join("/") || "/";
                    this.State.path = n;
                }),
                e
            );
        })(l),
        gt = (function (t) {
            function e() {
                return (null !== t && t.apply(this, arguments)) || this;
            }
            return (
                i(e, t),
                (e.prototype.config = function () {
                    var t = this,
                        e = this.app.getService("locale")._,
                        i = manager.Date.dateToStr("%M %j, %Y&nbsp;&nbsp;&nbsp;&nbsp;%H:%i:%s"),
                        n = {
                            css: "manager_fmanager_preview_info",
                            localId: "info",
                            borderless: !0,
                            autoheight: !0,
                            template: function (e) {
                                if (!e.id) return "";
                                var n = t.app.getService("locale")._;
                                return (
                                    "<div>" +
                                    ("<div class='key_col'>" +
                                        ("folder" === e.type ? ["Type", "Date"] : ["Type", "Size", "Date"])
                                            .map(function (t) {
                                                return "<div class='key_value_cell''>" + n(t) + "</div>";
                                            })
                                            .join("") +
                                        "</div>") +
                                    ('<div class="value_col">' +
                                        ("folder" === e.type ? [nt(n(e.type)), i(e.date)] : [nt(n(e.type)), tt(e.size), i(e.date)])
                                            .map(function (t) {
                                                return "<div class='key_value_cell'>" + t + "</div>";
                                            })
                                            .join("") +
                                        "</div>") +
                                    "</div>"
                                );
                            },
                        },
                        r = {
                            css: "manager_fmanager_preview_info extra",
                            localId: "extra:info",
                            hidden: !0,
                            autoheight: !0,
                            template: function (t) {
                                for (var e = Object.keys(t), i = "<div class='key_col'>", n = 0; n < e.length; ++n) i += "<div class='key_value_cell key'>" + e[n] + "</div>";
                                i += "</div>";
                                var r = "<div class='value_col'>";
                                for (var o in t) {
                                    var a = t[o].trim();
                                    r += "<div class='key_value_cell'>" + (a && "0" != a ? a : "<span class='manager_fmanager_id3tags-unknown'>Unknown</span>") + "</div>";
                                }
                                return (
                                    '<div><div class="manager_fmanager_info_header">\n<span class="manager_fmanager_icon fmi-information-outline"></span>\n<span class="manager_fmanager_info_title">Extra info</span>\n</div>' +
                                    i +
                                    (r += "</div>") +
                                    "</div>"
                                );
                            },
                        },
                        o = {
                            localId: "search:counter",
                            css: "manager_fmanager_preview_info",
                            height: 104,
                            borderless: !0,
                            template: function (t) {
                                return (
                                    "<div>" +
                                    ("<div class='key_col search'>" +
                                        ["Folders", "Files"]
                                            .map(function (t) {
                                                return "<div class='key_value_cell''>" + e(t) + "</div>";
                                            })
                                            .join("") +
                                        "</div>") +
                                    ('<div class="value_col search">' +
                                        [t.folders, t.files]
                                            .map(function (t) {
                                                return "<div class='key_value_cell'>" + t + "</div>";
                                            })
                                            .join("") +
                                        "</div>") +
                                    "</div>"
                                );
                            },
                        };
                    return {
                        localId: "info:tabs",
                        view: "tabview",
                        css: "manager_fmanager_info_tab",
                        cells: [
                            { header: e("Information"), body: { padding: 14, margin: 14, rows: [n, r, {}] } },
                            { header: e("Search results"), body: { padding: 14, margin: 14, rows: [o, {}] } },
                        ],
                    };
                }),
                (e.prototype.init = function () {
                    var t = this;
                    (this.Tabview = this.$$("info:tabs")),
                        (this.State = this.getParam("state")),
                        this.on(this.State.$changes, "selectedItem", function (e) {
                            t.ShowInfo(et(e));
                        }),
                        this.on(this.State.$changes, "searchStats", function (e) {
                            e ? t.$$("search:counter").setValues(e) : t.State.selectedItem.length || t.Tabview.hide();
                        });
                }),
                (e.prototype.ShowInfo = function (t) {
                    var e = this,
                        i = this.Tabview.getTabbar(),
                        n = i.config.options[0].id,
                        r = i.config.options[1].id;
                    if ("empty" !== t.type) {
                        this.SetInfo(this.$$("info"), t), this.SwitchTabs(i, r, n);
                        var o = this.$$("extra:info"),
                            a = this.app.getService("backend").getMeta(t);
                        a
                            ? a
                                  .then(function (t) {
                                      return e.SetExtraInfo(o, t);
                                  })
                                  .catch(function () {
                                      return o.hide();
                                  })
                            : o.hide();
                    } else this.State.search ? this.SwitchTabs(i, n, r) : this.Tabview.hide();
                }),
                (e.prototype.SetExtraInfo = function (t, e) {
                    !(function t(e) {
                        for (var i in e) {
                            if ("object" == typeof e[i]) return t(e[i]);
                            if (e[i] && "0" !== e[i]) return !1;
                        }
                        return !0;
                    })(e)
                        ? this.SetInfo(t, e)
                        : t.hide();
                }),
                (e.prototype.SetInfo = function (t, e) {
                    t.setValues(e), t.show();
                }),
                (e.prototype.SwitchTabs = function (t, e, i) {
                    t.hideOption(e), t.setValue(i), t.showOption(i), this.Tabview.show();
                }),
                e
            );
        })(l);
    var wt = (function (t) {
        function e() {
            return (null !== t && t.apply(this, arguments)) || this;
        }
        return (
            i(e, t),
            (e.prototype.config = function () {
                var t = this,
                    e = this.app.getService("locale")._,
                    i = this.getParam("compact");
                return {
                    margin: 0.1,
                    rows: [
                        {
                            view: "toolbar",
                            localId: "toolbar",
                            height: manager.skin.$active.toolbarHeight + 2,
                            padding: { right: 6 },
                            elements: [
                                { view: "label", localId: "filename:label", css: "manager_fmanager_preview_name" },
                                {
                                    view: "icon",
                                    icon: "wxi-download",
                                    css: "manager_fmanager_spec_icon",
                                    localId: "download",
                                    tooltip: e("Download file"),
                                    click: function () {
                                        t.app.callEvent("app:action", ["download", [t.FileInfo]]);
                                    },
                                },
                                {
                                    view: "icon",
                                    icon: "wxi-close",
                                    hidden: !i,
                                    click: function () {
                                        return t.app.callEvent("app:action", ["toggle-preview"]);
                                    },
                                },
                            ],
                        },
                        { view: "scrollview", borderless: !0, body: { type: "wide", margin: 10, rows: [{ view: "proxy", minHeight: 413, borderless: !0, body: { $subview: !0, name: "preview" } }, gt] } },
                    ],
                };
            }),
            (e.prototype.init = function () {
                var t = this;
                this.on(this.getParam("state").$changes, "selectedItem", function (e) {
                    var i = et(e);
                    t.ShowInfo(i), (t.FileInfo = i);
                    var n = t.$$("download");
                    "folder" === i.type ? n.hide() : n.show();
                });
            }),
            (e.prototype.ShowInfo = function (t) {
                var e = "preview.template";
                !this.app.config.player || ("audio" !== t.type && "video" !== t.type) || (e = "preview.media"),
                    "empty" !== t.type ? (this.$$("filename:label").setValue(t.value), this.$$("toolbar").show()) : this.$$("toolbar").hide(),
                    this.show(e, { target: "preview", params: { info: t } });
            }),
            e
        );
    })(l);
    manager.protoUI(
        {
            name: "plyr-player",
            defaults: { config: {}, source: {} },
            $init: function () {
                (this.$view.innerHTML = '<div class="manager_player_parent"><audio></audio></div>'),
                    (this._container = this.$view.firstChild.firstChild),
                    (this.$view.style.overflow = "visible"),
                    (this._waitView = manager.promise.defer()),
                    this.$ready.push(this.render);
            },
            getPlayer: function (t) {
                return t ? this._waitView : this._player;
            },
            render: function () {
                if (!1 === this.config.cdn || window.Plyr) this._initPlyr();
                else {
                    var t = this.config.cdn ? this.config.cdn : "https://cdn.plyr.io/3.5.10";
                    manager
                        .require([t + "/plyr.js", t + "/plyr.css"])
                        .then(manager.bind(this._initPlyr, this))
                        .catch(function (t) {
                            console.log(t);
                        });
                }
            },
            _initPlyr: function () {
                if (this.$view) {
                    var t = manager.extend({}, this.config.config);
                    (this._player = new Plyr(this._container, t)),
                        this._player.elements.container.setAttribute("tabindex", "-1"),
                        this.attachEvent("onDestroy", function () {
                            this._player && this._player.destroy();
                        }),
                        this._waitView.resolve(this._player),
                        this._player.on(
                            "canplay",
                            manager.bind(function () {
                                this._player.media && (this._player.media.setAttribute("tabindex", "-1"), this._normalizeRatio());
                            }, this)
                        ),
                        this._player.on(
                            "ready",
                            manager.bind(function () {
                                this.$view && ((this.$view.querySelector(".plyr--full-ui").style["min-width"] = "0px"), this._normalizeRatio());
                            }, this)
                        );
                }
            },
            $setSize: function (t, e) {
                (this.$view.firstChild.style.width = t + "px"), (this.$view.firstChild.style.height = e - 2 + "px"), this._player && this._normalizeRatio(t, e);
            },
            source_setter: function (t) {
                this._waitView.then(function (e) {
                    t && (e.source = t);
                });
            },
            getPlyr: function (t) {
                return t ? this._waitView : this._player;
            },
            _gcdRatio: function (t, e) {
                for (t = Math.abs(t), e = Math.abs(e); e; ) {
                    var i = e;
                    (e = t % e), (t = i);
                }
                return t;
            },
            _normalizeRatio: function (t, e) {
                if (this.$view) {
                    (t = t || this.$view.clientWidth), (e = e || this.$view.clientHeight);
                    var i = this._gcdRatio(t, e),
                        n = (t / i).toString() + ":" + (e / i).toString();
                    this._player.ratio = n;
                }
            },
        },
        manager.ui.view,
        manager.EventSystem
    );
    var mt = (function (t) {
            function e() {
                return (null !== t && t.apply(this, arguments)) || this;
            }
            return (
                i(e, t),
                (e.prototype.config = function () {
                    return {
                        rows: [
                            { localId: "albumArt", hidden: !0, css: "manager_fmanager_preview", template: '<img class="manager_fmanager_preview_icon" src="' + this.app.getService("backend").icon({ type: "audio" }, "big") + '" />' },
                            { view: "plyr-player", css: "manager_fmanager_player", localId: "player", config: { controls: ["play-large", "play", "progress", "current-time", "mute", "volume"] } },
                        ],
                    };
                }),
                (e.prototype.init = function () {
                    var t = this,
                        e = this.$$("albumArt").$view;
                    manager.event(e, "dblclick", function () {
                        var e = t.getParam("info");
                        t.app.callEvent("app:action", ["open", [e]]);
                    });
                }),
                (e.prototype.urlChange = function () {
                    var t = this.getParam("info");
                    this.ShowPreview(t);
                }),
                (e.prototype.ShowPreview = function (t) {
                    if (t) {
                        var e = this.app.getService("backend").directLink(t.id);
                        this.SetMedia(e, t.type, t.$ext);
                        var i = this.$$("albumArt"),
                            n = this.$$("player");
                        "audio" === t.type ? ((n.config.height = 52), i.show()) : ((n.config.height = 0), i.hide());
                    }
                }),
                (e.prototype.SetMedia = function (t, e, i) {
                    this.$$("player").define({ source: { type: e, sources: [{ src: t, type: e + "/" + i }] } });
                }),
                e
            );
        })(l),
        yt = (function (t) {
            function e() {
                return (null !== t && t.apply(this, arguments)) || this;
            }
            return (
                i(e, t),
                (e.prototype.config = function () {
                    return { view: "template", localId: "preview", css: "manager_fmanager_preview" };
                }),
                (e.prototype.init = function () {
                    var t = this,
                        e = this.getRoot().$view;
                    manager.event(e, "dblclick", function () {
                        var e = t.getParam("info");
                        "code" === e.type && t.app.config.editor ? t.app.callEvent("app:action", ["edit", [e]]) : "folder" !== e.type && "empty" !== e.type && t.app.callEvent("app:action", ["open", [e]]);
                    });
                }),
                (e.prototype.urlChange = function () {
                    var t = this.getParam("info");
                    this.ShowPreview(t);
                }),
                (e.prototype.ShowPreview = function (t) {
                    var e = this.$$("preview");
                    if ("folder" === t.type) e.setHTML('<img class="manager_fmanager_preview_icon" src="' + this.app.getService("backend").icon({ type: "folder" }, "big") + '" />');
                    else if ("empty" === t.type) e.setHTML('<img class="manager_fmanager_preview_icon" src="' + this.app.getService("backend").icon({ type: "none" }, "big") + '" />');
                    else {
                        var i = this.app.getService("backend").previewURL(t, 464, 407);
                        e.setHTML("<img style='width:100%; height:100%;' src='" + i + "' onerror='this.style.display=\"none\"'>");
                    }
                }),
                e
            );
        })(l),
        bt = (function (t) {
            function e() {
                return (null !== t && t.apply(this, arguments)) || this;
            }
            return (
                i(e, t),
                (e.prototype.config = function () {
                    var t = this;
                    return (
                        (this.Config = this.getParam("config")),
                        this.app.getService("jet-win").updateConfig({
                            view: "window",
                            css: "manager_fmanager_progress",
                            head: { template: this.Config.head, css: "manager_fmanager_progress_head", height: 54 },
                            body: {
                                padding: { top: 0, bottom: 20, left: 20, right: 20 },
                                margin: 10,
                                rows: [
                                    {
                                        template: function (t) {
                                            return (
                                                '<div class="manager_fmanager_progress_bar">\n<div class="manager_fmanager_progress_counter">' +
                                                t.done +
                                                " of " +
                                                t.total +
                                                ' items</div>\n<div class="manager_fmanager_progress_name">' +
                                                t.file +
                                                "</div></div>"
                                            );
                                        },
                                        localId: "counter",
                                        borderless: !0,
                                        height: 59,
                                    },
                                    {
                                        view: "button",
                                        value: "Stop",
                                        css: "manager_fmanager_progress_cancel",
                                        click: function () {
                                            (t.State.cancel = !0), t.getRoot().disable();
                                        },
                                    },
                                ],
                            },
                        })
                    );
                }),
                (e.prototype.ready = function () {
                    var t = this;
                    (this.WaitClose = manager.promise.defer()),
                        (this.Counter = this.$$("counter")),
                        this.Counter.setValues({ done: 0, total: this.Config.files.length, file: this.Config.files[0] }),
                        manager.extend(this.Counter, manager.ProgressBar),
                        (this.State = z({ i: 0, cancel: !1 })),
                        Q(this.Config.files, this.Config.code, this.State).finally(function () {
                            return t.Close();
                        }),
                        this.on(this.State.$changes, "i", function (e) {
                            return e && t.Step(e);
                        });
                }),
                (e.prototype.Close = function () {
                    this.Counter.showProgress({ type: "bottom", position: 1, delay: 100 }), this.show("_blank", { target: "popup" }), this.WaitClose.resolve();
                }),
                (e.prototype.Step = function (t) {
                    var e = this.Counter.getValues().done;
                    this.Counter.setValues({ done: t, file: this.Config.files[t - 1] }, !0), (e = (e + 1) / this.Config.files.length), this.Counter.showProgress({ type: "bottom", position: Math.min(1, e), delay: 100 });
                }),
                e
            );
        })(l),
        _t = (function (t) {
            function e() {
                return (null !== t && t.apply(this, arguments)) || this;
            }
            return (
                i(e, t),
                (e.prototype.config = function () {
                    var t = this,
                        e = this.getParam("compact"),
                        i = manager.skin.$active,
                        n = this.app.getService("locale")._;
                    return {
                        view: "toolbar",
                        height: i.toolbarHeight + 12,
                        margin: 20,
                        paddingY: 9,
                        paddingX: 12,
                        cols: [
                            {
                                view: "icon",
                                icon: "manager_fmanager_icon fmi-file-tree",
                                click: function () {
                                    return t.app.callEvent("app:action", ["toggle-folders"]);
                                },
                                hidden: !e,
                            },
                            { view: "label", label: n("Files"), autowidth: !0, hidden: e },
                            { view: "search", width: e ? 0 : 300, localId: "search", placeholder: n("Search files and folders") },
                            { hidden: e },
                            {
                                view: "toggle",
                                css: "manager_fmanager_preview_toggle",
                                type: "icon",
                                icon: "wxi-eye",
                                tooltip: n("Preview"),
                                width: i.toolbarHeight < 37 ? 48 : 60,
                                localId: "previewMode",
                                click: function () {
                                    return t.app.callEvent("app:action", ["toggle-preview"]);
                                },
                                hidden: e,
                            },
                            {
                                view: "segmented",
                                width: 124,
                                optionWidth: 40,
                                localId: "modes",
                                tooltip: function (t) {
                                    switch (t.id) {
                                        case "grid":
                                            return n("Table");
                                        case "cards":
                                            return n("Cards");
                                        case "double":
                                            return n("Total");
                                        default:
                                            return nt(t.id + "");
                                    }
                                },
                                options: [
                                    { value: "<span class='manager_fmanager_icon fmi-view-list manager_fmanager_mode_icon'></span>", id: "grid" },
                                    { value: "<span class='manager_fmanager_icon fmi-view-grid manager_fmanager_mode_icon'></span>", id: "cards" },
                                    { value: "<span class='manager_fmanager_icon fmi-view-array manager_fmanager_mode_icon'></span>", id: "double" },
                                ],
                            },
                        ],
                    };
                }),
                (e.prototype.init = function () {
                    var t = this.getParam("state"),
                        e = this.$$("modes");
                    e.attachEvent("onChange", function (e) {
                        e && t.$batch({ mode: e, search: "" });
                    }),
                        this.on(t.$changes, "mode", function (t) {
                            e.getOption(t) ? e.setValue(t) : e.setValue();
                        });
                    var i = this.$$("search");
                    i.attachEvent("onTimedKeyPress", function () {
                        t.search = i.getValue().trim();
                    }),
                        this.on(t.$changes, "search", function (t) {
                            (t = t.trim()), i.setValue(t);
                        }),
                        this.on(N(), (manager.env.isMac ? "COMMAND" : "CTRL") + " + F", function (t, e) {
                            i.focus(), manager.html.preventEvent(e);
                        });
                }),
                e
            );
        })(l),
        xt = (function (t) {
            function e() {
                return (null !== t && t.apply(this, arguments)) || this;
            }
            return (
                i(e, t),
                (e.prototype.config = function () {
                    W ||
                        ((W = !0),
                        manager.protoUI(
                            {
                                name: "r-layout",
                                sizeTrigger: function (t, e, i) {
                                    (this._compactValue = i), (this._compactHandler = e), (this._app = t);
                                    var n = t.config;
                                    (this._forceCompact = n.params.forceCompact), (this._compactWidth = n.compactWidth), this._forceCompact || this._checkTrigger(this.$view.width, i);
                                },
                                _checkTrigger: function (t, e) {
                                    return !this._compactWidth || !((t <= this._compactWidth && !e) || (t > this._compactWidth && e)) || ((this._compactWidth = null), this._compactHandler(!e), !1);
                                },
                                $setSize: function (t, e) {
                                    (this._forceCompact || this._checkTrigger(t, this._compactValue)) && manager.ui.layout.prototype.$setSize.call(this, t, e), this._app && this._app.callEvent("view:resize", []);
                                },
                            },
                            manager.ui.layout
                        ));
                    var t = this.getParam("forceCompact");
                    manager.isUndefined(t) || this.setParam("compact", t), (this.Compact = this.getParam("compact"));
                    var e = { view: "proxy", batch: "tree", width: 240, minWidth: 240, maxWidth: 400, hidden: !0, borderless: !0, body: ct },
                        i = {
                            type: "wide",
                            localId: "folders",
                            cols: [
                                { $subview: !0, name: "center", branch: !0 },
                                { view: "proxy", borderless: !0, width: 470, hidden: !0, localId: "r-side", body: { $subview: "", branch: !0, name: "r-side" } },
                            ],
                        };
                    return this.Compact || i.cols.unshift(e, { view: "resizer", batch: "tree" }), { view: "r-layout", type: "wide", css: "manager_files_main_layout", rows: [_t, i, { $subview: !0, popup: !0, name: "popup" }] };
                }),
                (e.prototype.init = function () {
                    var t = this;
                    this.getRoot().sizeTrigger(
                        this.app,
                        function (e) {
                            return t.SetCompactMode(e);
                        },
                        !!this.Compact
                    );
                    var e = this.getParam("state");
                    (this.State = e),
                        this.Compact && ((this.SideTree = this.ui(ht)), (this.PreviewPopup = this.ui(pt))),
                        this.on(this.app, "app:action", function (e) {
                            switch (e) {
                                case "toggle-preview":
                                    t.TogglePreview();
                                    break;
                                case "toggle-folders":
                                    t.ToggleFolders();
                            }
                        }),
                        this.on(e.$changes, "mode", function (e, i) {
                            return t.ShowMode(e, i);
                        }),
                        this.on(e.$changes, "search", function (e) {
                            return t.ShowSearch(e);
                        }),
                        this.app.getService("progress").handle(this.getRoot(), this.ShowProgress.bind(this));
                }),
                (e.prototype.ShowMode = function (t, e) {
                    var i = this.$$("folders"),
                        n = { target: "center", params: { state: this.getParam("state"), compact: this.Compact } };
                    switch (t) {
                        case "grid":
                        case "cards":
                            i.showBatch("tree"), this.show("panel/" + ("grid" == t ? "list" : t), n);
                            break;
                        case "double":
                            i.showBatch(""), this.show("panel-double", n);
                            break;
                        case "search":
                            (this.PrevMode = this.PrevMode || e), i.showBatch(""), this.show("panel-search/cards", n);
                    }
                }),
                (e.prototype.ShowProgress = function (t) {
                    var e = this;
                    return this.show("./progress", { target: "popup", params: t }).then(function () {
                        return e.getSubView("popup");
                    });
                }),
                (e.prototype.TogglePreview = function () {
                    if (this.Compact) this.PreviewPopup.IsVisible() ? this.PreviewPopup.Hide() : this.PreviewPopup.Show({ state: this.State });
                    else {
                        var t = this.$$("r-side");
                        t.isVisible() ? (this.show("_blank", { target: "r-side" }), t.hide()) : (this.show("preview", { target: "r-side", params: { state: this.State } }), t.show());
                    }
                }),
                (e.prototype.ToggleFolders = function () {
                    this.SideTree.Show();
                }),
                (e.prototype.ShowSearch = function (t) {
                    t ? (this.State.mode = "search") : ("search" === this.State.mode && (this.State.mode = this.PrevMode || "grid"), (this.PrevMode = ""));
                }),
                (e.prototype.SetCompactMode = function (t) {
                    this.setParam("compact", t), this.refresh();
                }),
                e
            );
        })(l),
        St = { JetView: l };
    (St.cards = Y),
        (St.editor = ot),
        (St.folders = ct),
        (St.list = ut),
        (St["menus/addnewmenu"] = st),
        (St["menus/contextmenu"] = J),
        (St["menus/menubody"] = K),
        (St["mobile/previewpopup"] = pt),
        (St["mobile/sidetree"] = ht),
        (St["panel-double"] = ft),
        (St["panel-search"] = dt),
        (St.panel = vt),
        (St.preview = wt),
        (St["preview/info"] = gt),
        (St["preview/media"] = mt),
        (St["preview/template"] = yt),
        (St.progress = bt),
        (St["sections/dataview"] = X),
        (St.top = xt),
        (St.topbar = _t);
    var kt = (function () {
            function t(t, e) {
                (this.app = t), (this._url = e), (this._features = { preview: {}, meta: {} });
            }
            return (
                (t.prototype.url = function (t) {
                    return this._url + t;
                }),
                (t.prototype.search = function (t, e) {
                    return (t = t || "/"), this._files(this.url("files"), { id: t, search: e });
                }),
                (t.prototype.files = function (t) {
                    return (t = t || "/"), this._files(this.url("files"), { id: t });
                }),
                (t.prototype._files = function (t, e) {
                    var i = manager.ajax(t, e).then(function (t) {
                        return t.json();
                    });
                    return this.getInfo().then(function () {
                        return i;
                    });
                }),
                (t.prototype.folders = function (t) {
                    return (
                        (t = t || "/"),
                        manager.ajax(this.url("folders"), { id: t }).then(function (t) {
                            return t.json();
                        })
                    );
                }),
                (t.prototype.icon = function (t, e) {
                    return this.url("icons/" + (e || "small") + "/" + t.type + "/" + t.$ext + ".svg");
                }),
                (t.prototype.upload = function () {
                    return this.url("upload");
                }),
                (t.prototype.readText = function (t) {
                    return manager.ajax(this.url("text"), { id: t }).then(function (t) {
                        return t.text();
                    });
                }),
                (t.prototype.writeText = function (t, e) {
                    return manager
                        .ajax()
                        .post(this.url("text"), { id: t, content: e })
                        .then(function (t) {
                            return t.json();
                        });
                }),
                (t.prototype.directLink = function (t, e) {
                    return this.url("direct?id=" + encodeURIComponent(t) + (e ? "&download=true" : ""));
                }),
                (t.prototype.previewURL = function (t, e, i) {
                    return this._features.preview[t.type] ? this.url("preview?width=" + e + "&height=" + i + "&id=" + encodeURIComponent(t.id)) : this.icon(t, "big");
                }),
                (t.prototype.remove = function (t) {
                    return manager
                        .ajax()
                        .post(this.url("delete"), { id: t })
                        .then(function (t) {
                            return t.json();
                        });
                }),
                (t.prototype.makedir = function (t, e) {
                    return manager
                        .ajax()
                        .post(this.url("makedir"), { id: t, name: e })
                        .then(function (t) {
                            return t.json();
                        });
                }),
                (t.prototype.makefile = function (t, e) {
                    return manager
                        .ajax()
                        .post(this.url("makefile"), { id: t, name: e })
                        .then(function (t) {
                            return t.json();
                        });
                }),
                (t.prototype.copy = function (t, e) {
                    return manager
                        .ajax()
                        .post(this.url("copy"), { id: t, to: e })
                        .then(function (t) {
                            return t.json();
                        });
                }),
                (t.prototype.move = function (t, e) {
                    return manager
                        .ajax()
                        .post(this.url("move"), { id: t, to: e })
                        .then(function (t) {
                            return t.json();
                        });
                }),
                (t.prototype.rename = function (t, e) {
                    return manager
                        .ajax()
                        .post(this.url("rename"), { id: t, name: e })
                        .then(function (t) {
                            return t.json();
                        });
                }),
                (t.prototype.getRootName = function () {
                    return (0, this.app.getService("locale")._)("My Files");
                }),
                (t.prototype.getMeta = function (t) {
                    return (
                        !!this._features.meta[t.type] &&
                        manager.ajax(this.url("meta"), { id: t.id }).then(function (t) {
                            return t.json();
                        })
                    );
                }),
                (t.prototype.getInfo = function (t) {
                    var e = this;
                    return this._info && !t
                        ? this._info
                        : (this._info = manager.ajax(this.url("info")).then(function (t) {
                              return (t = t.json()), (e._features = t.features), t;
                          }));
                }),
                t
            );
        })(),
        $t = (function () {
            function t(t) {
                (this._store = new Map()), (this._limit = t), (this._i = 1);
            }
            return (
                (t.prototype.each = function (t) {
                    this._store.forEach(function (e) {
                        return t(e.obj);
                    });
                }),
                (t.prototype.set = function (t, e) {
                    this._store.size >= this._limit && this.prune(), this._store.set(t, { obj: e, key: t, t: this._i++ });
                }),
                (t.prototype.get = function (t) {
                    var e = this._store.get(t);
                    return e ? ((e.t = this._i++), e.obj) : null;
                }),
                (t.prototype.prune = function () {
                    var t = [];
                    this._store.forEach(function (e) {
                        return t.push(e);
                    }),
                        (t = t.sort(function (t, e) {
                            return t.t > e.t ? -1 : 1;
                        }));
                    for (var e = Math.floor(this._limit / 2); e < t.length; e++) this._store.delete(t[e].key);
                }),
                (t.prototype.delete = function (t) {
                    this._store.has(t) && this._store.delete(t);
                }),
                (t.prototype.clear = function () {
                    this._store.clear();
                }),
                t
            );
        })(),
        Ct = (function () {
            function t(t, e) {
                (this.app = t), (this.fscache = new $t(e)), (this.hierarchy = new manager.TreeCollection()), (this.folders_ready = null);
            }
            return (
                (t.prototype.defaultDir = function (t) {
                    var e = [];
                    return (
                        "/" !== t &&
                            e.push({
                                type: "folder",
                                value: "..",
                                $row: function (t, e) {
                                    return e.backIcon() + "<span class='manager_fmanager_back'>" + e.backLabel() + "</span>";
                                },
                            }),
                        e
                    );
                }),
                (t.prototype.files = function (t, e) {
                    var i = this.fscache.get(t);
                    return e ? i : i ? Promise.resolve(i) : ((i = new manager.DataCollection({ scheme: { $change: this.prepareData, $serialize: this.serializeData } })), this.fscache.set(t, i), this.reload(i, t));
                }),
                (t.prototype.serializeData = function (t) {
                    if (".." == t.value) return !1;
                    var e = {};
                    for (var i in t) 0 !== i.indexOf("$") && (e[i] = t[i]);
                    return e;
                }),
                (t.prototype.prepareData = function (t) {
                    "number" == typeof t.date && (t.date = new Date(1e3 * t.date)),
                        "folder" === t.type
                            ? (t.$css = t.type)
                            : (t.$ext = (function (t) {
                                  if (!t) return "";
                                  var e = t.split(".");
                                  return e.length < 2 ? "" : e[e.length - 1];
                              })(t.value));
                }),
                (t.prototype.reload = function (t, e) {
                    var i = this;
                    return this.app
                        .getService("backend")
                        .files(e)
                        .then(function (n) {
                            return t.clearAll(), t.parse(i.defaultDir(e).concat(n)), t;
                        });
                }),
                (t.prototype.refresh = function (t) {
                    var e = this.fscache.get(t);
                    if (e) return this.reload(e, t);
                }),
                (t.prototype.addFile = function (t, e, i) {
                    var n = this,
                        r = this.fscache.get(t);
                    r && (r.exists(e.id) || r.add(e, this.getFsPosition(r, e))),
                        "folder" === e.type &&
                            ("/" === t && (t = "../files"),
                            this.hierarchy.add(e, null, t),
                            i &&
                                this.app
                                    .getService("backend")
                                    .folders(e.id)
                                    .then(function (t) {
                                        return t.length && n.hierarchy.parse({ parent: e.id, data: t });
                                    }));
                }),
                (t.prototype.getFsPosition = function (t, e) {
                    if ("folder" !== e.type) return -1;
                    var i = t.data;
                    return i.order.findIndex(function (t) {
                        return "folder" !== i.getItem(t).type;
                    });
                }),
                (t.prototype.deleteFile = function (t) {
                    var e = this.fscache,
                        i = this.hierarchy;
                    e.each(function (e) {
                        e && e.exists(t) && e.remove(t);
                    }),
                        e.delete(t),
                        i.exists(t) && i.remove(t);
                }),
                (t.prototype.updateFile = function (t, e, i) {
                    var n = this.hierarchy;
                    this.fscache.each(function (n) {
                        n && n.exists(t) && (n.updateItem(t, e), i && t != i && n.data.changeId(t, i));
                    }),
                        n.exists(t) && (n.updateItem(t, e), i && t != i && n.data.changeId(t, i));
                }),
                (t.prototype.defaultTree = function () {
                    return [{ value: "My Files", id: "../files", open: !0 }];
                }),
                (t.prototype.folders = function (t) {
                    var e = this,
                        i = this.hierarchy;
                    return (
                        (!t && this.folders_ready) ||
                            (this.folders_ready = this.app
                                .getService("backend")
                                .folders()
                                .then(function (t) {
                                    return i.clearAll(), i.parse(e.defaultTree()), i.parse({ parent: "../files", data: t }), i;
                                })),
                        this.folders_ready
                    );
                }),
                t
            );
        })(),
        Tt = (function () {
            function t(t, e) {
                this.initUploader(t), this.initEvents(t, e);
            }
            return (
                (t.prototype.initEvents = function (t, e) {
                    var i = this;
                    t.attachEvent("app:action", function (t, n) {
                        ("upload" != t && "uploaddir" != t) || (n || (n = e.path || "/"), i.openDialog(t, n));
                    });
                }),
                (t.prototype.initUploader = function (t) {
                    (this.uploader = this.createUploader(t)), (this.dirUploader = this.createUploader(t, !0));
                }),
                (t.prototype.createUploader = function (t, e) {
                    var i = manager.ui({
                        view: "uploader",
                        directory: e,
                        apiOnly: !0,
                        upload: t.getService("backend").upload(),
                        on: {
                            onAfterFileAdd: function (t) {
                                t.urlData = this.config.tempUrlData;
                            },
                            onUploadComplete: function () {
                                if ((t.getService("progress").end(), t.callEvent("reload:fs:stats", []), e)) {
                                    var i = this.config.tempUrlData.id,
                                        n = t.getService("local");
                                    n.refresh(i), n.folders(!0);
                                }
                            },
                        },
                    });
                    return (
                        e ||
                            i.attachEvent("onFileUpload", function (e, i) {
                                t.getService("local").addFile(e.urlData.id, i);
                            }),
                        (i.$updateProgress = function (e, i) {
                            var n = i / 100;
                            n && t.getService("progress").start(n);
                        }),
                        i
                    );
                }),
                (t.prototype.openDialog = function (t, e) {
                    var i = "upload" == t ? this.uploader : this.dirUploader;
                    (i.config.tempUrlData = { id: e }), i.fileDialog();
                }),
                (t.prototype.getUploader = function () {
                    return this.dirUploader;
                }),
                t
            );
        })(),
        Pt = (function () {
            function t() {
                (this.view = null), (this.popup = null);
            }
            return (
                (t.prototype.handle = function (t, e) {
                    (this.view = t), manager.extend(t, manager.ProgressBar), (this.popup = e);
                }),
                (t.prototype.start = function (t) {
                    var e = this.view;
                    e && !e.$destructed && e.showProgress({ type: "top", delay: 3e3, hide: !0, position: t });
                }),
                (t.prototype.end = function () {
                    var t = this.view;
                    t && !t.$destructed && t.hideProgress();
                }),
                (t.prototype.files = function (t, e, i) {
                    var n = this;
                    if (e.length)
                        return 1 == e.length
                            ? (this.start(),
                              i(e[0], 0).finally(function () {
                                  return n.end();
                              }))
                            : this.popup
                            ? this.popup({ config: { head: t, files: e, code: i } }).then(function (t) {
                                  return t.WaitClose;
                              })
                            : void 0;
                }),
                t
            );
        })(),
        It = (function () {
            function t(t, e) {
                (this.app = t), (this.state = e), this.initEvents();
            }
            return (
                (t.prototype.backend = function () {
                    return this.app.getService("backend");
                }),
                (t.prototype.local = function () {
                    return this.app.getService("local");
                }),
                (t.prototype.initEvents = function () {
                    var t = this;
                    this.app.attachEvent("app:action", function (e, i) {
                        switch (e) {
                            case "open":
                                t.open(i);
                                break;
                            case "download":
                                t.download(i);
                                break;
                            case "edit":
                                t.edit(i);
                                break;
                            case "delete":
                                t.remove(i);
                                break;
                            case "makefile":
                                t.makeFile(i);
                                break;
                            case "makedir":
                                t.makeFolder(i);
                                break;
                            case "rename":
                                t.rename(i);
                                break;
                            case "copy":
                            case "cut":
                                t.addToClipboard(e);
                                break;
                            case "paste":
                                t.paste(i);
                                break;
                            case "locate":
                                t.goUp(i);
                        }
                    });
                }),
                (t.prototype.write = function (t, e) {
                    var i = this;
                    return this.backend()
                        .writeText(t, e)
                        .then(function (e) {
                            return i.local().updateFile(t, { size: e.size, date: e.date });
                        });
                }),
                (t.prototype.read = function (t) {
                    return this.backend().readText(t);
                }),
                (t.prototype.makeFile = function (t) {
                    var e = this,
                        i = this.state.path || "/";
                    this.backend()
                        .makefile(i, t)
                        .then(function (t) {
                            t.invalid || e.local().addFile(i, t);
                        });
                }),
                (t.prototype.makeFolder = function (t) {
                    var e = this,
                        i = this.state.path || "/";
                    this.backend()
                        .makedir(i, t)
                        .then(function (t) {
                            t.invalid || e.local().addFile(i, t);
                        });
                }),
                (t.prototype.edit = function (t) {
                    var e = this.state;
                    t || (t = e.selectedItem),
                        (t = t.filter(function (t) {
                            return "code" === t.type;
                        })).length && this.app.show("/editor", { params: { files: t, state: e } });
                }),
                (t.prototype.open = function (t) {
                    t || (t = this.state.selectedItem);
                    for (var e = 0; e < t.length; ++e) "folder" != t[e].type && window.open(this.backend().directLink(t[e].id), "_blank");
                }),
                (t.prototype.download = function (t) {
                    t || (t = this.state.selectedItem), window.open(this.backend().directLink(t[0].id, !0), "_self");
                }),
                (t.prototype.remove = function (t) {
                    var e = this,
                        i = this.state,
                        n = this.extractIds(t || i.selectedItem);
                    if (!n.length) return manager.promise.reject();
                    var r = this.app.getService("locale")._;
                    return manager
                        .confirm({ title: r("Delete files"), text: this.removeConfirmMessage(t || i.selectedItem), container: this.app.getRoot().$view, css: "manager_fmanager_confirm" })
                        .then(function () {
                            return e.app.getService("progress").files(r("Deleting..."), n, function (t) {
                                return e
                                    .backend()
                                    .remove(t)
                                    .then(function (n) {
                                        n.invalid || (e.local().deleteFile(t), i.path === t && (i.path = "/"), e.app.callEvent("pathChanged", [t, "/"]), e.app.callEvent("reload:fs:stats", []));
                                    });
                            });
                        })
                        .then(function () {
                            i.search && (i.search = i.search + " ");
                        });
                }),
                (t.prototype.removeConfirmMessage = function (t) {
                    for (
                        var e = this.app.getService("locale")._,
                            i = '<div class="question">' + e("Are you sure you want to delete") + " " + (t.length > 1 ? e("these items:") : e("this item:")) + "</div>",
                            n = 0,
                            r = "&#9679;&nbsp;",
                            o = t.length < 6 ? t.length : 5;
                        n < o;
                        ++n
                    )
                        i += '<div class="item">' + r + t[n].value + "</div>";
                    return n < t.length && (i += "<div>" + r + e("and") + " " + (t.length - n) + " " + e("more file(s)") + "</div>"), i;
                }),
                (t.prototype.rename = function (t) {
                    var e = this,
                        i = this.state,
                        n = t ? t[0] : i.selectedItem[0];
                    if (n) {
                        var r = this.app.getService("locale")._,
                            o = n.id;
                        at({ text: r("Enter a new name"), button: r("Rename"), value: n.value, selectMask: "folder" !== n.type ? Z : null }, this.app).then(function (t) {
                            (t = it(t)) &&
                                t !== n.value &&
                                e
                                    .backend()
                                    .rename(o, t)
                                    .then(function (t) {
                                        e.local().updateFile(o, { value: t.id.split("/").pop() }, t.id),
                                            "folder" === n.type &&
                                                e.reloadBranch(t.id).then(function () {
                                                    i.path === o && (i.path = t.id), e.app.callEvent("pathChanged", [o, t.id]);
                                                }),
                                            i.search && (i.search = i.search + " ");
                                    });
                        });
                    }
                }),
                (t.prototype.reloadBranch = function (t) {
                    var e = this.local().hierarchy;
                    return this.app
                        .getService("backend")
                        .folders(t)
                        .then(function (i) {
                            var n = [];
                            e.data.eachChild(t, function (t) {
                                return n.push(t.id);
                            }),
                                e.parse({ parent: t, data: i }),
                                e.remove(n);
                        });
                }),
                (t.prototype.copy = function (t, e) {
                    var i = this;
                    if (!t.length) return manager.promise.reject();
                    var n = this.local(),
                        r = this.app.getService("locale")._;
                    return this.app.getService("progress").files(r("Copying..."), t, function (t) {
                        return i
                            .backend()
                            .copy(t, e)
                            .then(function (t) {
                                t.invalid || n.addFile(e, t, !0);
                            });
                    });
                }),
                (t.prototype.move = function (t, e) {
                    var i = this;
                    if (!t.length || !e) return manager.promise.reject();
                    var n = this.local(),
                        r = n.files(e, !0);
                    if (
                        (r &&
                            (t = t.filter(function (t) {
                                return !r.exists(t);
                            })),
                        !(t = t.filter(function (t) {
                            return t != e;
                        })).length)
                    )
                        return manager.promise.reject();
                    var o = this.app.getService("locale")._;
                    return this.app.getService("progress").files(o("Moving..."), t, function (t) {
                        return i
                            .backend()
                            .move(t, e)
                            .then(function (r) {
                                r.invalid || (n.deleteFile(t), n.addFile(e, r, !0), i.state.path === t && (i.state.path = r.id), i.app.callEvent("pathChanged", [t, r.id]));
                            });
                    });
                }),
                (t.prototype.extractIds = function (t) {
                    if (!t.length || "string" == typeof t[0]) return t;
                    for (var e = [], i = 0; i < t.length; ++i) ".." !== t[i].value && e.push(t[i].id);
                    return e;
                }),
                (t.prototype.addToClipboard = function (t) {
                    var e = this.state.selectedItem;
                    e.length && (this.state.clipboard = { files: e, mode: t });
                }),
                (t.prototype.clearClipboard = function () {
                    this.state.clipboard = null;
                }),
                (t.prototype.paste = function (t) {
                    var e = this.state;
                    if (e.clipboard) {
                        var i = e.path;
                        t && "folder" == t[0].type && (i = t[0].id),
                            "copy" === e.clipboard.mode ? this.copy(this.extractIds(e.clipboard.files), i) : "cut" === e.clipboard.mode && this.move(this.extractIds(e.clipboard.files), i),
                            this.clearClipboard();
                    }
                }),
                (t.prototype.goUp = function (t) {
                    var e = this.state;
                    if (e.search) {
                        var i = t ? t[0] : e.selectedItem[0];
                        if (!i) return;
                        var n = i.id.split("/"),
                            r = "/" + n.slice(1, n.length - 1).join("/");
                        e.$batch({ search: "", searchStats: null, path: r });
                    }
                }),
                t
            );
        })(),
        Et = (function (t) {
            function e(e) {
                var i,
                    r,
                    o,
                    a = this,
                    s = z({ mode: e.mode || "grid", selectedItem: [], search: "", searchStats: null, path: e.path || "/", source: e.source || "files", clipboard: null }),
                    c = { router: y, version: "9.4.0", debug: !0, start: "/top", params: { state: s, forceCompact: e.compact }, editor: !0, player: !0, compactWidth: 640 };
                return (
                    (a = t.call(this, n(n({}, c), e)) || this).setService("backend", new (a.dynamic(kt))(a, a.config.url)),
                    a.setService("local", new (a.dynamic(Ct))(a, 10)),
                    a.setService("progress", new (a.dynamic(Pt))(a)),
                    a.setService("upload", new (a.dynamic(Tt))(a, s)),
                    a.setService("operations", new (a.dynamic(It))(a, s)),
                    (o = {
                        updateConfig: function (t) {
                            var e = i.getRoot(),
                                n = e.$view;
                            r
                                ? r && !n.id && (n.id = r)
                                : (n.id ? (r = n.id) : (n.id = r = "manager_" + manager.uid()),
                                  manager.html.addStyle(".manager_win_inside *:not(.manager_modal_box):not(.manager_modal_cover){ z-index: 0; }"),
                                  manager.html.addStyle("#" + r + "{ position: relative; }"),
                                  manager.html.addStyle("#" + r + " .manager_window{ z-index:2 !important; }"),
                                  manager.html.addStyle("#" + r + " .manager_disabled{ z-index:1 !important; }")),
                                (t.container = r),
                                t.fullscreen && ((t._fillApp = !0), delete t.fullscreen),
                                t.on || (t.on = {});
                            var o = !0,
                                a = t.on.onShow;
                            return (
                                (t.on.onShow = function () {
                                    var t = this;
                                    a && a.apply(this, arguments),
                                        o &&
                                            ((this.$setSize = function (i, n) {
                                                B(t, e, !0), manager.ui.window.prototype.$setSize.apply(t, [i, n]);
                                            }),
                                            H(this, i),
                                            (o = null)),
                                        manager.callEvent("onClick", []),
                                        manager.html.addCss(n, "manager_win_inside"),
                                        e.disable(),
                                        B(this, e);
                                }),
                                t
                            );
                        },
                    }),
                    (i = a).setService("jet-win", o),
                    a.use(M, a.config.locale || { lang: "en", manager: { en: "en-US", zh: "zh-CN" } }),
                    a
                );
            }
            return (
                i(e, t),
                (e.prototype.dynamic = function (t) {
                    return (this.config.override && this.config.override.get(t)) || t;
                }),
                (e.prototype.require = function (t, e) {
                    return "jet-views" === t ? St[e] : "jet-locales" === t ? Ft[e] : null;
                }),
                (e.prototype.getState = function () {
                    return this.config.params.state;
                }),
                e
            );
        })(m);
    manager.protoUI(
        {
            name: "filemanager",
            app: Et,
            getState: function () {
                return this.$app.getState();
            },
            getService: function (t) {
                return this.$app.getService(t);
            },
            $init: function () {
                this.$view.className += " manager_files";
                var t = this.$app.getState();
                for (var e in t) U(t, this.config, e);
            },
        },
        manager.ui.jetapp
    );
    var At = { Backend: kt, LocalData: Ct, Upload: Tt, Progress: Pt, Operations: It },
        Ft = {
            en: {
                Save: "Save",
                "Save all": "Save all",
                Rename: "Rename",
                Open: "Open",
                Edit: "Edit",
                Delete: "Delete",
                Folder: "Folder",
                "Add New": "Add New",
                "My Files": "My Files",
                Size: "Size",
                Date: "Date",
                "back to parent folder": "back to parent folder",
                Download: "Download",
                Type: "Type",
                Information: "Information",
                Files: "Files",
                Table: "Table",
                Cards: "Cards",
                Total: "Total",
                "Are you sure ?": "Are you sure ?",
                Details: "Details",
                "Enter a new name": "Enter a new name",
                Add: "Add",
                "Select something": "Select something",
                "Download file": "Download file",
                Preview: "Preview",
                Refresh: "Refresh",
                "Are you sure you want to exit without saving?": "Are you sure you want to exit without saving?",
                "Save before closing?": "Save before closing?",
                Copy: "Copy",
                Cut: "Cut",
                Paste: "Paste",
                "Deleting...": "Deleting...",
                "Copying...": "Copying...",
                "Moving...": "Moving...",
                Folders: "Folders",
                "Search results": "Search results",
                "Search results in": "Search results in",
                "Search files and folders": "Search files and folders",
                "Add new file": "Add new file",
                "Add new folder": "Add new folder",
                "Upload file": "Upload file",
                "Upload folder": "Upload folder",
                folder: "folder",
                file: "file",
                archive: "archive",
                audio: "audio",
                image: "image",
                video: "video",
                code: "code",
                document: "document",
                of: "of",
                used: "used",
                "Open item location": "Open item location",
                "Are you sure you want to delete": "Are you sure you want to delete",
                "these items:": "these items:",
                "this item:": "this item:",
                "Delete files": "Delete files",
                and: "and",
                "more file(s)": "more file(s)",
                "Close the editor": "Close the editor",
                "Close this file": "Close this file",
            },
        };
    (t.App = Et), (t.locales = Ft), (t.services = At), (t.views = St), Object.defineProperty(t, "__esModule", { value: !0 });
});
