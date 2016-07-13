+!~-(($, window, document, undefined) => {
    const self = {};
  
    self.isFirefoxOrIE = typeof InstallTrigger !== "undefined" || (false || !!document.documentMode);
    
    self.version = "0.0.1";

    self.PI = Math.PI;
    self.A90 = Math.PI / 2;
    self.rad = degrees => degrees / 180 * PI;

    self.deg = radians => 180 * (radians / PI);

    self.isTouch = false;
    self.corners = {
        backward: ["bl", "tl", "l"],
        forward: ["br", "tr", "r"],
        all: ["tl", "bl", "tr", "br", "l", "r"]
    };

    self.DISPLAY_SINGLE = 1;
    self.DISPLAY_DOUBLE = 2;
    self.DIRECTION_LTR = 1;
    self.DIRECTION_RTL = 2;
    self.EVENT_PREVENTED = 1;
    self.EVENT_STOPPED = 2;
    self.getVendorPrefix = () => {
        const vendorPrefixes = ["Moz", "Webkit", "Khtml", "O", "ms"];
        let len = vendorPrefixes.length;
        let prefix = "";
        for (; len--;) {
            if (`${vendorPrefixes[len]}Transform` in document.body.style) {
                prefix = `-${vendorPrefixes[len].toLowerCase()}-`;
            }
        }
        return prefix;
    };

    self.addCssWithPrefix = function(opt_attributes) {
        const value = this.vendor || this.getVendorPrefix();
        const options = {};
        let field;
        for (field in opt_attributes) {
            if (this.has(field, opt_attributes)) {
                options[field.replace("@", value)] = opt_attributes[field].replace("@", value);
            }
        }
        return options;
    };

    self.transitionEnd = (elem, callback) => {
        let t;
        let type;
        const el = document.createElement("fakeelement");
        const transitions = {
            transition: "transitionend",
            OTransition: "oTransitionEnd",
            MSTransition: "transitionend",
            MozTransition: "transitionend",
            WebkitTransition: "webkitTransitionEnd"
        };
        for (t in transitions) {
            if (void 0 !== el.style[t]) {
                type = transitions[t];
                break;
            }
        }
        return (elem && (type ? elem.bind(type, () => {
            elem.unbind(type);
            callback.call(elem);
        }) : window.setTimeout(() => {
            callback.call(elem);
        }, Math.ceil(1E3 * parseFloat(elem.css(`${getVendorPrefix()}transition-duration`))))), type);
    };

    self.findPos = el => {
        const o = {
            top: 0,
            left: 0
        };
        do {
            o.left += el.offsetLeft;
            o.top += el.offsetTop;
        } while (el === el.offsetParent);
        return o;
    };

    self.offsetWhile = (el, fn) => {
        const o = {
            top: 0,
            left: 0
        };
        do {
            if (!fn(el, o)) {
                break;
            }
            o.left += el.offsetLeft;
            o.top += el.offsetTop;
        } while (el === el.offsetParent);
        return o;
    };

    self.getSelectedText = () => window.getSelection ? window.getSelection().toString() : document.selection.createRange ? document.selection.createRange().text : void 0;

    self.bezier = function(data, t, message) {
        const mum1 = 1 - t;
        const mum13 = mum1 * mum1 * mum1;
        const t3 = t * t * t;
        return this.peelingPoint(message, Math.round(mum13 * data[0].x + 3 * t * mum1 * mum1 * data[1].x + 3 * t * t * mum1 * data[2].x + t3 * data[3].x), Math.round(mum13 * data[0].y + 3 * t * mum1 * mum1 * data[1].y + 3 * t * t * mum1 * data[2].y + t3 * data[3].y));
    };

    self.layerCSS = (recurring, mayParseLabeledStatementInstead, lab, overf) => ({
        css: {
            position: "absolute",
            top: recurring,
            left: mayParseLabeledStatementInstead,
            overflow: overf || "hidden",
            "z-index": lab || "auto"
        }
    });

    self.peelingPoint = (childrenVarArgs, funcToCall, millis) => ({
        corner: childrenVarArgs,
        x: funcToCall,
        y: millis
    });

    self.transformUnit = (line, g) => {
        let m;
        return "string" == typeof line && (m = /^(\d+)(px|%)$/.exec(line)) ? "px" == m[2] ? parseInt(m[1], 10) : "%" == m[2] ? parseInt(m[1], 10) / 100 * g : void 0 : line;
    };

    self.point2D = (recurring, mayParseLabeledStatementInstead) => ({
        x: recurring,
        y: mayParseLabeledStatementInstead
    });

    self.translate = function(z, mayParseLabeledStatementInstead, deepDataAndEvents) {
        return this.has3d && deepDataAndEvents ? ` translate3d(${z}px,${mayParseLabeledStatementInstead}px, 0px) ` : ` translate(${z}px, ${mayParseLabeledStatementInstead}px) `;
    };

    self.scale = function(value, dataAndEvents, deepDataAndEvents) {
        return this.has3d && deepDataAndEvents ? ` scale3d(${value},${dataAndEvents}, 1) ` : ` scale(${value}, ${dataAndEvents}) `;
    };

    self.rotate = x => ` rotate(${x}deg) `;

    self.has = (property, target) => Object.prototype.hasOwnProperty.call(target, property);

    self.rotationAvailable = () => {
        let components;
        if (components === /AppleWebkit\/([0-9\.]+)/i.exec(navigator.userAgent)) {
            const version = parseFloat(components[1]);
            return version > 534.3;
        }
        return true;
    };

    self.css3dAvailable = () => "WebKitCSSMatrix" in window || "MozPerspective" in document.body.style;

    self.getTransitionEnd = ($elem, oldValMethod) => {
        let t;
        let type;
        const el = document.createElement("fakeelement");
        const transitions = {
            transition: "transitionend",
            OTransition: "oTransitionEnd",
            MSTransition: "transitionend",
            MozTransition: "transitionend",
            WebkitTransition: "webkitTransitionEnd"
        };
        for (t in transitions) {
            if (void 0 !== el.style[t]) {
                type = transitions[t];
                break;
            }
        }
        return ($elem && (type ? $elem.bind(type, () => {
            $elem.unbind(type);
            oldValMethod.call($elem);
        }) : setTimeout(() => {
            oldValMethod.call($elem);
        }, Math.ceil(1E3 * parseFloat($elem.css(`${getVendorPrefix()}transition-duration`))))), type);
    };

    self.makeGradient = function(recurring) {
        let vendor;
        return ("-webkit-" == this.vendor ? recurring ? (vendor = "-webkit-gradient(linear, left top, right top,", vendor += "color-stop(0, rgba(0,0,0,0)),", vendor += "color-stop(0.3, rgba(0,0,0, 0.3)),", vendor += "color-stop(0.5, rgba(0,0,0, 0.8))", vendor += ")") : (vendor = "-webkit-gradient(linear, left top, right top,", vendor += "color-stop(0, rgba(0,0,0,0)),", vendor += "color-stop(0.2, rgba(0,0,0,0.5)),", vendor += "color-stop(0.2, rgba(0,0,0,0.6)),", vendor += "color-stop(0.4, rgba(0,0,0,0.2)),",
            vendor += "color-stop(1, rgba(0,0,0,0))", vendor += ")") : (vendor = `${this.vendor}linear-gradient(left, `, recurring ? (vendor += "rgba(0,0,0,0) 0%,", vendor += "rgba(0,0,0,0.3) 30%,", vendor += "rgba(0,0,0,0.8) 50%") : (vendor += "rgba(0,0,0,0) 0%,", vendor += "rgba(0,0,0,0.2) 20%,", vendor += "rgba(0,0,0,0.6) 20%,", vendor += "rgba(0,0,0,0.2) 40%,", vendor += "rgba(0,0,0,0) 100%"), vendor += ")"), vendor);
    };

    self.gradient = function(el, pos, p1, colors, a) {
        let b;
        const tagNameArr = [];
        if ("-webkit-" == this.vendor) {
            b = 0;
            for (; a > b; b++) {
                tagNameArr.push(`color-stop(${colors[b][0]}, ${colors[b][1]})`);
            }
            el.css({
                "background-image": `-webkit-gradient(linear, ${pos.x}% ${pos.y}%,${p1.x}% ${p1.y}%, ${tagNameArr.join(",")} )`
            });
        }
    };

    self.trigger = (event, obj, data) => {
        const e = $.Event(event);
        return (obj.trigger(e, data), e.isDefaultPrevented() ? self.EVENT_PREVENTED : e.isPropagationStopped() ? self.EVENT_STOPPED : "");
    };

    self.error = msg => {
        function AssertionError(message) {
            this.name = "TurnError";
            this.message = message;
        }
        return (TurnJsError.prototype = new Error(), TurnJsError.prototype.constructor = AssertionError, new AssertionError(msg));
    };

    self.getListeners = (obj, type, dataAndEvents) => {
        const events = $._data(obj[0]).events;
        const assigns = [];
        if (events) {
            const list = events[type];
            if (list) {
                $.each(list, (dataAndEvents, vvar) => {
                    assigns.push(vvar);
                });
                if (dataAndEvents) {
                    obj.unbind(type);
                }
            }
        }
        return assigns;
    };

    self.setListeners = (cy, event, codeSegments) => {
        if (codeSegments) {
            let i = 0;
            for (; i < codeSegments.length; i++) {
                cy.on(event, codeSegments[i].selector, codeSegments[i].handler);
            }
        }
    };

    self.cleanSelection = () => {
        if (window.getSelection().empty) {
            window.getSelection().empty();
        } else {
            if (window.getSelection().removeAllRanges) {
                window.getSelection().removeAllRanges();
            } else {
                if (document.selection) {
                    document.selection.empty();
                }
            }
        }
    };


    self.UIComponent = cssText => {
        const Tabs = function(element, opt_renderer) {
            this._data = {};
            this._hashKey = opt_renderer;
            this.$el = $(element);
        };
        return (Tabs.prototype = {
            _init: cssText,
            _bind(fn) {
                return Tabs.prototype[fn].apply(this, Array.prototype.slice.call(arguments, 1));
            },
            _trigger(type) {
                return self.trigger(type, this.$el, Array.prototype.slice.call(arguments, 1));
            },
            _destroy() {
                const _hashKey = this.$el.data();
                delete _hashKey[this._hashKey];
            }
        }, Tabs);
    };

    self.widgetInterface = function(model, options, checkSet) {
        let data = $.data(this, options);
        return data ? data._bind.apply(data, checkSet) : (self.oneTimeInit(), data = new model(this, options), $.data(this, options, data), data._init.apply(data, checkSet));
    };

    self.widgetFactory = (name, obj) => {
        const fqn = `turn.${name}`;

        $.fn[name] = function() {
            if (1 == this.length) {
                return self.widgetInterface.call(this[0], obj, fqn, arguments);
            }
            let i = 0;
            for (; i < this.length; i++) {
                self.widgetInterface.call(this[i], obj, fqn, arguments);
            }
            return this;
        };
    };

    self.oneTimeInit = function() {
        if (!this.vendor) {
            this.has3d = this.css3dAvailable();
            this.hasRotation = this.rotationAvailable();
            this.vendor = this.getVendorPrefix();
        }
    };

    self.calculateBounds = params => {
        const img = {
            width: params.width,
            height: params.height
        };
        if (img.width > params.boundWidth || img.height > params.boundHeight) {
            const delta = img.width / img.height;
            if (params.boundWidth / delta > params.boundHeight && params.boundHeight * delta <= params.boundWidth) {
                img.width = Math.round(params.boundHeight * delta);
                img.height = params.boundHeight;
            } else {
                img.width = params.boundWidth;
                img.height = Math.round(params.boundWidth / delta);
            }
        }
        return img;
    };

    self.animate = (options, animation) => {
        if (!animation) {
            return (options.animation && options.animation.stop(), void 0);
        }
        if (options.animation) {
            options.animation._time = (new Date()).getTime();
            let j = 0;
            for (; j < options.animation._elements; j++) {
                options.animation.from[j] = options.animation.current[j];
                options.animation.to[j] = animation.to[j] - options.animation.from[j];
            }
        } else {
            if (!animation.to.length) {
                animation.to = [animation.to];
            }
            if (!animation.from.length) {
                animation.from = [animation.from];
            }
            let e = true;
            options.animation = $.extend({
                current: [],
                _elements: animation.to.length,
                _time: (new Date()).getTime(),
                stop() {
                    e = false;
                    options.animation = null;
                },
                easing(t, x, easing, d) {
                    return -easing * ((t = t / d - 1) * t * t * t - 1) + x;
                },
                _frame() {
                    const t = Math.min(this.duration, (new Date()).getTime() - this._time);
                    let i = 0;
                    for (; i < this._elements; i++) {
                        this.current[i] = this.easing(t, this.from[i], this.to[i], this.duration);
                    }
                    e = true;
                    this.frame(this.current);
                    if (t >= this.duration) {
                        this.stop();
                        if (this.completed) {
                            this.completed();
                        }
                    } else {
                        window.requestAnimationFrame(() => {
                            if (e) {
                                options.animation._frame();
                            }
                        });
                    }
                }
            }, animation);
            let i = 0;
            for (; i < options.animation._elements; i++) {
                options.animation.to[i] -= options.animation.from[i];
            }
            options.animation._frame();
        }
    };
    self.addDelegateList = (o, f) => {
        if (o) {
            let i;
            for (i in o) {
                if (self.has(i, o)) {
                    f.on(i, o[i]);
                }
            }
        }
    };
    self.getDeviceName = () => {
        let userPlatform = "";
        const u = navigator.userAgent;
        return (/ipad/i.test(u) ? userPlatform = "ipad" : /iphone/i.test(u) ? userPlatform = "iphone" : /ipod/i.test(u) ? userPlatform = "ipod" : /kindle/i.test("iPod") && (userPlatform = "kindle"), userPlatform);
    };

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = window.webkitRequestAnimationFrame || (window.mozRequestAnimationFrame || (window.oRequestAnimationFrame || (window.msRequestAnimationFrame || (after => {
            window.setTimeout(after, 1E3 / 60);
        }))));
    }

    $.fn.transform = function(value, dest) {
        const properties = {};
        return (dest && (properties[`${self.vendor}transform-origin`] = dest), properties[`${self.vendor}transform`] = value, this.css(properties));
    };

    window.Turn = self;

    const val = $.isTouch || "ontouchstart" in window;

    self.eventPrefix = "";
    self.isTouchDevice = val;

    self.isInside = (point, container) => {
        if (container) {
            if (container == document.body || container == window) {
                return true;
            }
            const rect = $(container).offset();
            return rect && (point.x >= rect.left && (point.y >= rect.top && (point.x <= rect.left + container.offsetWidth && point.y <= rect.top + container.offsetHeight)));
        }
    };

    self.eventPoint = ev => {
        const orig = ev.originalEvent;
        const hasBody = orig.touches && orig.touches[0];
        const data = hasBody ? self.point2D(orig.touches[0].pageX, orig.touches[0].pageY) : self.point2D(ev.pageX, ev.pageY);
        return (data.time = ev.timeStamp, data.target = ev.target, data);
    };

    self.Event = function(name, opt_attributes) {
        name = this.eventPrefix + name;
        let iTime = false;
        const init = function(el, selector) {
            this.el = el;
            this.$el = $(el); // jQuery object
            this.eventName = name;
            this._selector = selector;
            this._data = {};
            this._init();
        };
        return (opt_attributes._triggerVirtualEvent = function(evt) {
            if (iTime !== evt.timeStamp) {
                iTime = evt.timeStamp;
                this.$el.trigger(evt);
            }
        }, opt_attributes._trigger = function(eventName) {
            const touch = self.eventPoint(eventName);
            const event = this.Event(eventName, {
                pageX: touch.x,
                pageY: touch.y
            });
            this._triggerVirtualEvent(event);
        }, opt_attributes.Event = function(event, e={}) {
            e.type = this.eventName;
            e.target = event.target;
            e.toElement = event.toElement;
            e.currentTarget = event.currentTarget;
            e.delegateTarget = event.delegateTarget;
            e.pageX = e.pageX || event.pageX;
            e.pageY = e.pageY || event.pageY;
            const info = $.Event(event, e);
            return (info.type = this.eventName, info);
        }, init.eventName = name, init.prototype = opt_attributes, init);
    };

    self._registerEvent = (Resource, evtName) => {
        $.event.special[evtName] = {
            add(handleObj) {
                const opt = handleObj.selector || "";
                const that = `e.${evtName}${opt}`;
                const target = $(this);
                const self = target.data(that) || {
                    listeners: 0
                };
                if (!self.instance) {
                    self.instance = new Resource(this, opt);
                }
                self.listeners++;
                target.data(that, self);
            },

            remove(handleObj) {
                const endpoint = handleObj.selector || "";
                const full = `e.${evtName}${endpoint}`;
                const d = $(this);
                const view = d.data(full);
                if (view) {
                    if (view.listeners > 0) {
                        view.listeners--;
                        if (0 === view.listeners) {
                            view.instance._remove();
                            delete view.instance;
                        }
                    }
                }
            }
        };
    };

    self._registerEvents = function(codeSegments) {
        let i = 0;
        for (; i < codeSegments.length; i++) {
            this._registerEvent(codeSegments[i], codeSegments[i].eventName);
        }
    };
    const tap = self.Event("tap", {
        _init() {
            if (val) {
                this.$el.on("touchstart", this._selector, $.proxy(this, "_touchstart"));
                this.$el.on("touchmove", this._selector, $.proxy(this, "_touchmove"));
                this.$el.on("touchend", this._selector, $.proxy(this, "_touchend"));
            } else {
                this.$el.on("click", this._selector, $.proxy(this, "_trigger"));
            }
        },
        _remove() {
            if (val) {
                this.$el.off("touchstart", this._selector, this._touchstart);
                this.$el.off("touchmove", this._selector, this._touchmove);
                this.$el.off("touchend", this._selector, this._touchend);
            } else {
                this.$el.off("click", this._selector, this._trigger);
            }
        },
        _touchstart(value) {
            /** @type {Object} */
            this._data.startEvent = value;
            this._data.initScrollTop = $(window).scrollTop();
            this._data.initScrollLeft = $(window).scrollLeft();
        },
        _touchmove(value) {
            /** @type {Object} */
            this._data.startEvent = value;
        },
        _touchend() {
            if (this._data.startEvent) {
                const x = self.eventPoint(this._data.startEvent);
                const todayMonth = $(window).scrollTop();
                const todayYear = $(window).scrollLeft();
                if (self.isInside(x, this._data.startEvent.currentTarget || this.el) && (this._data.initScrollTop == todayMonth && this._data.initScrollLeft == todayYear)) {
                    const $this = this;
                    const type = this._data.startEvent;
                    setTimeout(() => {
                        $this._trigger(type);
                    }, 0);
                }
                this._data.startEvent = null;
            }
        }
    });
    const e = self.Event("doubletap", {
        _init() {
            this._data.queue = [0, 0];
            this.$el.on("tap", this._selector, $.proxy(this, "_tap"));
        },
        _remove() {
            this.$el.off("tap", this._selector, this._tap);
        },
        _tap(e) {
            const keys = this._data.queue;
            if (keys.shift(), keys.push(e.timeStamp), keys[1] - keys[0] < 300) {
                const event = e.originalEvent;
                const pointer = self.eventPoint(event);
                this._triggerVirtualEvent(this.Event(event, {
                    pageX: pointer.x,
                    pageY: pointer.y
                }));
            }
        }
    });
    const vmouseover = self.Event("vmouseover", {
        _init() {
            if (val) {
                this.$el.on("touchstart", this._selector, $.proxy(this, "_trigger"));
            } else {
                this.$el.on("mouseover", this._selector, $.proxy(this, "_trigger"));
            }
        },
        _remove() {
            if (val) {
                this.$el.off("touchstart", this._selector, this._trigger);
            } else {
                this.$el.off("mouseover", this._selector, this._trigger);
            }
        }
    });
    const vmouseout = self.Event("vmouseout", {
        _init() {
            if (val) {
                this.$el.on("touchend", this._selector, $.proxy(this, "_trigger"));
            } else {
                this.$el.on("mouseout", this._selector, $.proxy(this, "_trigger"));
            }
        },
        _remove() {
            if (val) {
                this.$el.off("touchend", this._selector, this._trigger);
            } else {
                this.$el.off("mouseout", this._selector, this._trigger);
            }
        }
    });
    const vmousedown = self.Event("vmousedown", {
        _init() {
            if (val) {
                this.$el.on("touchstart", this._selector, $.proxy(this, "_trigger"));
            } else {
                this.$el.on("mousedown", this._selector, $.proxy(this, "_trigger"));
            }
        },
        _remove() {
            if (val) {
                this.$el.off("touchstart", this._selector, this._trigger);
            } else {
                this.$el.off("mousedown", this._selector, this._trigger);
            }
        }
    });
    const vmouseup = self.Event("vmouseup", {
        _init() {
            if (val) {
                this.$el.on("touchend", this._selector, $.proxy(this, "_trigger"));
            } else {
                this.$el.on("mouseup", this._selector, $.proxy(this, "_trigger"));
            }
        },
        _remove() {
            if (val) {
                this.$el.off("touchend", this._selector, this._trigger);
            } else {
                this.$el.off("mouseup", this._selector, this._trigger);
            }
        }
    });
    const vmousemove = self.Event("vmousemove", {
        _init() {
            if (val) {
                this.$el.on("touchmove", this._selector, $.proxy(this, "_trigger"));
            } else {
                this.$el.on("mousemove", this._selector, $.proxy(this, "_trigger"));
            }
        },
        _remove() {
            if (val) {
                this.$el.off("touchmove", this._selector, this._trigger);
            } else {
                this.$el.off("mousemove", this._selector, this._trigger);
            }
        }
    });
    const message = self.Event("swipe", {
        _init() {
            this.$el.on("vmousedown", this._selector, $.proxy(this, "_vmousedown"));
        },
        _remove() {
            this.$el.off("vmousedown", this._selector, this._vmousedown);
        },
        _vmousedown(end) {
            const data = this._data;
            data.firstEvent = self.eventPoint(end);
            data.currentEvent = data.firstEvent;
            data.prevEvent = data.firstEvent;
            $(document).on("vmousemove", $.proxy(this, "_vmousemove"));
            $(document).on("vmouseup", $.proxy(this, "_vmouseup"));
        },
        _vmousemove(part) {
            const options = this._data;
            const len = options.currentEvent;
            options.currentEvent = self.eventPoint(part);
            options.prevEvent = len;
        },
        _vmouseup() {
            const d = this._data;
            const movingSpace = d.prevEvent.x - d.currentEvent.x;
            const deltaTime = d.prevEvent.time - d.currentEvent.time;
            const speed = movingSpace / deltaTime;
            if (-0.2 > speed || speed > 0.2) {
                const t = {};
                t.pageX = d.currentEvent.x;
                t.pageY = d.currentEvent.y;
                t.speed = speed;
                this._triggerVirtualEvent(this.Event(d.firstEvent, t));
            }
            $(document).off("vmousemove", this._vmousemove);
            $(document).off("vmouseup", this._vmouseup);
        }
    });
    const error = self.Event("pinch", {
        _init() {
            this.$el.on("touchstart", this._selector, $.proxy(this, "_touchstart"));
        },
        _remove() {
            this.$el.off("touchstart", this._selector, this._touchstart);
        },
        _touchstart(touch) {
            const data = this._data;
            data.firstEvent = self.eventPoint(touch);
            data.pinch = null;
            $(document).on("touchmove", $.proxy(this, "_touchmove"));
            $(document).on("touchend", $.proxy(this, "_touchend"));
        },
        _touchmove(e) {
            const touches = e.originalEvent.touches;
            const data = this._data;
            if (2 == touches.length) {
                const evt = {};
                const z0 = touches[1].pageX - touches[0].pageX;
                const z1 = touches[1].pageY - touches[0].pageY;
                const ev = self.point2D(touches[1].pageX / 2 + touches[0].pageX / 2, touches[1].pageY / 2 + touches[0].pageY / 2);
                const x = Math.sqrt(z0 * z0 + z1 * z1);
                if (!data.pinch) {
                    data.pinch = {
                        initDistance: x,
                        prevDistance: x,
                        prevMidpoint: ev
                    };
                }
                evt.pageX = ev.x;
                evt.pageY = ev.y;
                evt.dx = ev.x - data.pinch.prevMidpoint.x;
                evt.dy = ev.y - data.pinch.prevMidpoint.y;
                evt.factor = x / data.pinch.initDistance;
                evt.dfactor = x / data.pinch.prevDistance;
                data.pinch.prevDistance = x;
                data.pinch.prevMidpoint = ev;
                this._triggerVirtualEvent(this.Event(data.firstEvent, evt));
            }
        },
        _touchend() {
            $(document).off("touchmove", this._touchmove);
            $(document).off("touchend", this._touchend);
        }
    });
    self._registerEvents([tap, e, message, error, vmouseover, vmouseout, vmousedown, vmousemove, vmouseup]);
    const defaults = {
        acceleration: true,
        animatedAutoCenter: false,
        autoCenter: true,
        autoScroll: true,
        autoScaleContent: false,
        hoverAreaSize: 50,
        cornerPosition: "50px 20px",
        margin: "0px 0px",
        display: "double",
        duration: 500,
        easing(t, b, c, d) {
            const ts = (t /= d) * t;
            const tc = ts * t;
            return b + c * (-1.95 * tc * ts + 7.8 * ts * ts + -10.7 * tc + 4.8 * ts + 1.05 * t);
        },
        elevation: "100%",
        hover: true,
        ignoreElements: "[ignore=1]",
        page: 1,
        pageMargin: "0px 0px",
        smartFlip: false,
        swipe: true,
        responsive: false,
        gradients: true,
        turnCorners: "l,r",
        events: null,
        showDoublePage: false
            // zoomAnimationDuration: 1E4
    };
    const that = self.UIComponent(function(options) {
        const data = this._data;
        const codeSegments = this.$el.children();
        /** @type {number} */
        let entered = 0;
        options = $.extend({
            width: options.pageWidth ? 2 * options.pageWidth : this.$el.width(),
            height: options.pageHeight ? options.pageHeight : this.$el.height(),
            direction: this.$el.attr("dir") || (this.$el.css("direction") || "ltr"),
            viewer: this.$el.parent(),
            cacheSize: options && options.blocks ? 8 : 6
        }, defaults, options);
        const octalLiteral = options.cornerPosition.split(" ");
        if (options.cornerPosition = self.point2D(parseInt(octalLiteral[0], 10), parseInt(octalLiteral[1], 10)), data.options = options, data.dynamicMode = false, data.turningPage = false, data.watchSizeChange = true, data.pageObjs = {}, data.pageBlocks = {}, data.pages = {}, data.pageWrap = {}, data.blocks = {}, data.pageMv = [], data.front = [], data.scroll = {
                left: 0,
                top: 0
            }, data.margin = [0, 0, 0, 0], data.pageMargin = [0, 0, 0, 0], data.zoom = 1, data.totalPages = options.pages || 0, options.when && (options.delegate = options.when), options.delegate) {
            let eventName;
            for (eventName in options.delegate) {
                if (self.has(eventName, options.delegate)) {
                    if ("tap" == eventName || "doubletap" == eventName) {
                        this.$el.on(eventName, ".page", options.delegate[eventName]);
                    } else {
                        this.$el.on(eventName, options.delegate[eventName]);
                    }
                }
            }
        }
        this.$el.css({
            position: "relative",
            width: options.width,
            height: options.height
        });
        if (val) {
            this.$el.addClass("touch-device");
        } else {
            this.$el.addClass("no-touch-device");
        }
        this.display(options.display);
        if ("" !== options.direction) {
            this.direction(options.direction);
        }
        /** @type {number} */
        let i = 0;
        for (; i < codeSegments.length; i++) {
            if (!$(codeSegments[i]).is(options.ignoreElements)) {
                this.addPage(codeSegments[i], ++entered);
            }
        }
        return (options.pages = data.totalPages, data.dynamicMode = 0 === entered, options.swipe && this.$el.on("swipe", $.proxy(this, "_eventSwipe")), this.$el.parent().on("start", $.proxy(this, "_eventStart")), this.$el.on("vmousedown", $.proxy(this, "_eventPress")).on("vmouseover", $.proxy(this, "_eventHover")).on("vmouseout", $.proxy(this, "_eventNoHover")), this._resizeObserver(), "number" != typeof options.page || (isNaN(options.page) || (options.page < 1 || options.page > data.totalPages)) ? this.page(1) :
            this.page(options.page), options.animatedAutoCenter && this.$el.css(self.addCssWithPrefix({
                "@transition": `margin-left ${options.duration}ms`
            })), data.done = true, this.$el);
    });
    self.directions;
    /** @type {number} */
    const lastAngle = self.A90;
    /** @type {number} */
    var PI = self.PI;
    
    const results = self.UIComponent(function(self, session) {
        return (self = self || {}, self.disabled = false, self.hover = false, self.turn = session, self.turnData = session._data, self.effect = this.$el.hasClass("hard") || this.$el.hasClass("cover") ? "hard" : "sheet", this.$el.data("f", self), this._addPageWrapper(), this.$el);
    });
    /**
     * @return {?}
     */
    results.prototype._cornerAllowed = function() {
        const result = this.$el.data("f");
        const id = result.page;
        const data = result.turnData;
        /** @type {number} */
        const leftBottom = id % 2;
        switch (result.effect) {
            case "hard":
                /** @type {boolean} */
                const f = data.direction == self.DIRECTION_LTR;
                return f ? [leftBottom ? "r" : "l"] : [leftBottom ? "l" : "r"];
            case "sheet":
                if (data.display == self.DISPLAY_SINGLE) {
                    return 1 == id ? self.corners.forward : id == data.totalPages ? self.corners.backward : "tapping" == result.status ? self.corners.all : self.corners.forward;
                }
                if (data.display == self.DISPLAY_DOUBLE) {
                    return data.options.showDoublePage ? self.corners[leftBottom ? "backward" : "forward"] : self.corners[leftBottom ? "forward" : "backward"];
                };
        }
    };
    /**
     * @param {?} e
     * @return {?}
     */
    results.prototype._cornerActivated = function(e) {
        const x = this.$el.width();
        const y = this.$el.height();
        const me = self.peelingPoint("", e.x, e.y);
        if (me.x <= 0 || (me.y <= 0 || (me.x >= x || me.y >= y))) {
            return false;
        }
        const result = this.$el.data("f");
        const msg = result.turnData;
        if (result.dpoint) {
            let max = msg.options.cornerPosition;
            const field = this._startPoint(result.dpoint.corner, $.extend({}, me));
            if (max = Math.max(max.x, max.y), field.x <= max && field.y <= max) {
                return (me.corner = result.dpoint.corner, me);
            }
        }
        const delta = msg.options.hoverAreaSize;
        const elems = this._cornerAllowed();
        switch (result.effect) {
            case "hard":
                if (me.x > x - delta) {
                    /** @type {string} */
                    me.corner = "r";
                } else {
                    if (!(me.x < delta)) {
                        return false;
                    }
                    /** @type {string} */
                    me.corner = "l";
                }
                break;
            case "sheet":
                if (me.y < delta) {
                    me.corner += "t";
                } else {
                    if (me.y >= y - delta) {
                        me.corner += "b";
                    }
                }
                if (me.x <= delta) {
                    me.corner += "l";
                } else {
                    if (me.x >= x - delta) {
                        me.corner += "r";
                    }
                };
        }
        return me.corner && -1 != $.inArray(me.corner, elems) ? me : false;
    };

    results.prototype._isIArea = function(ev) {
        const mousePos = self.eventPoint(ev);
        const g = this.$el.data("f");
        const docPos = (g.clip || g.ipage).parent().offset();
        return this._cornerActivated(self.point2D(mousePos.x - docPos.left, mousePos.y - docPos.top));
    };


    results.prototype._startPoint = function(corner, rp) {
        let o;
        switch (rp = rp || self.point2D(0, 0), corner) {
            case "tr":
                /** @type {number} */
                rp.x = this.$el.width() - rp.x;
                break;
            case "bl":
                /** @type {number} */
                rp.y = this.$el.height() - rp.y;
                break;
            case "br":
                /** @type {number} */
                rp.x = this.$el.width() - rp.x;
                /** @type {number} */
                rp.y = this.$el.height() - rp.y;
                break;
            case "l":
                o = this.$el.data("f");
                if (o.startPoint) {
                    rp.y = o.startPoint.y;
                }
                break;
            case "r":
                /** @type {number} */
                rp.x = this.$el.width() - rp.x;
                o = this.$el.data("f");
                if (o.startPoint) {
                    rp.y = o.startPoint.y;
                };
        }
        return rp;
    };
    /**
     * @param {?} dataAndEvents
     * @param {Object} rp
     * @return {?}
     */
    results.prototype._endPoint = function(dataAndEvents, rp) {
        let o;
        switch (rp = rp || self.point2D(0, 0), dataAndEvents) {
            case "tl":
                /** @type {number} */
                rp.x = 2 * this.$el.width() - rp.x;
                break;
            case "tr":
                rp.x = -this.$el.width() + rp.x;
                break;
            case "bl":
                /** @type {number} */
                rp.x = 2 * this.$el.width() - rp.x;
                /** @type {number} */
                rp.y = this.$el.height() - rp.y;
                break;
            case "br":
                rp.x = -this.$el.width() + rp.x;
                /** @type {number} */
                rp.y = this.$el.height() - rp.y;
                break;
            case "l":
                /** @type {number} */
                rp.x = 2 * this.$el.width() - rp.x;
                o = this.$el.data("f");
                if (o.startPoint) {
                    rp.y = o.startPoint.y;
                }
                break;
            case "r":
                /** @type {number} */
                rp.x = -this.$el.width() - rp.x;
                o = this.$el.data("f");
                if (o.startPoint) {
                    rp.y = o.startPoint.y;
                };
        }
        return rp;
    };
    /**
     * @param {string} off
     * @return {?}
     */
    results.prototype._foldingPage = function(off) {
        const s = this.$el.data("f");
        if (s) {
            const data = s.turnData;
            return (off = off || "pageObjs", data.display == self.DISPLAY_SINGLE ? data[off][0] : s.over ? data[off][s.over] : data[off][s.next]);
        }
        return false;
    };
    /**
     * @param {number} x
     * @param {number} y
     * @return {?}
     */
    results.prototype.resize = function(x, y) {
        const s = this.$el.data("f");
        switch (x = x || this.$el.width(), y = y || this.$el.height(), s.effect) {
            case "sheet":
                /** @type {number} */
                const side = Math.round(Math.sqrt(x * x + y * y));
                s.clip.css({
                    width: side,
                    height: side
                });
                s.ipage.css({
                    width: x,
                    height: y
                });
                s.igradient.css({
                    width: 100,
                    height: 2 * y,
                    top: -y / 2
                });
                s.ogradient.css({
                    width: 100,
                    height: 2 * y,
                    top: -y / 2
                });
        }
        return this.$el;
    };
    /**
     * @return {undefined}
     */
    results.prototype._addPageWrapper = function() {
        const options = this.$el.data("f");
        options.turnData;
        let css;
        const content = this.$el.parent();
        const html = $("<div />", {
            "class": "inner-page"
        });
        const modal = $("<div />", {
            "class": "inner-gradient"
        });
        const $el = $("<div />", {
            "class": "outer-gradient"
        });
        switch (options.effect) {
            case "hard":
                css = self.layerCSS(0, 0, 2).css;
                /** @type {string} */
                css[`${self.vendor}transform-style`] = "preserve-3d";
                /** @type {string} */
                css[`${self.vendor}backface-visibility`] = "hidden";
                html.css(css).appendTo(content).prepend(this.$el);
                modal.css(self.layerCSS(0, 0, 0).css).appendTo(html);
                $el.css(self.layerCSS(0, 0, 0));
                options.ipage = html;
                options.igradient = modal;
                options.ogradient = $el;
                break;
            case "sheet":
                const container = $("<div />", {
                    "class": "clip"
                });
                css = self.layerCSS(0, 0, 0).css;
                container.css(css);
                html.css($.extend({
                    cursor: "default"
                }, css));
                /** @type {number} */
                css.zIndex = 1;
                modal.css({
                    background: self.makeGradient(true),
                    display: self.isFirefoxOrIE ? "" : "none",
                    visibility: "hidden",
                    position: "absolute",
                    "z-index": 2
                });
                $el.css({
                    background: self.makeGradient(false),
                    visibility: "hidden",
                    position: "absolute",
                    "z-index": 2
                });
                modal.appendTo(html);
                html.appendTo(container).prepend(this.$el);
                $el.appendTo(content);
                container.appendTo(content);
                options.clip = container;
                options.ipage = html;
                options.igradient = modal;
                options.ogradient = $el;
        }
        this.resize();
    };
    /**
     * @param {Object} pos
     * @return {?}
     */
    results.prototype._fold = function(pos) {
        const e = this.$el.data("f");
        if (e.dpoint && (e.dpoint.corner == pos.corner && (e.dpoint.x == pos.x && e.dpoint.y == pos.y))) {
            return false;
        }
        switch (e.effect) {
            case "hard":
                this._hard(pos);
                break;
            case "sheet":
                this._pageCURL(pos);
        }
        return (e.dpoint = self.peelingPoint(pos.corner, pos.x, pos.y), true);
    };
    /**
     * @param {boolean} recurring
     * @return {undefined}
     */
    results.prototype._bringClipToFront = function(recurring) {
        const s = this.$el.data("f");
        if (s) {
            const data = s.turnData;
            /** @type {boolean} */
            const key = data.display == self.DISPLAY_SINGLE;
            if (recurring) {
                const id = key ? 0 : s.next;
                if (s.over && (s.over != id && this._bringClipToFront(false)), "hard" == s.effect) {
                    s.igradient.show();
                } else {
                    if ("sheet" == s.effect) {
                        const container = data.pageWrap[id];
                        const result = data.pages[id].data("f");
                        const w = container.width();
                        const dialogHeight = container.height();
                        if (container.css({
                                overflow: "visible",
                                "pointer-events": "none",
                                zIndex: 3 + data.front.length
                            }), result.ipage.css({
                                overflow: "hidden",
                                position: "absolute",
                                width: w,
                                height: dialogHeight
                            }), result.igradient.show().css({
                                visibility: "visible"
                            }), s.ipage.css({
                                "z-index": 1
                            }), s.ogradient.show().css({
                                zIndex: 2,
                                visibility: "visible"
                            }), key && result.tPage != s.page) {
                            data.pageObjs[0].find("*").remove();
                            const clone = data.pageObjs[s.page].clone(false).css({
                                opacity: "0.2",
                                overflow: "hidden"
                            }).transform("rotateY(180deg)", "50% 50%");
                            clone.appendTo(data.pageObjs[0]);
                            result.tPage = s.page;
                        }
                    }
                }
                s.over = id;
            } else {
                if (s.over) {
                    const modal = data.pageWrap[s.over];
                    if (modal) {
                        modal.css({
                            overflow: "hidden",
                            display: self.isFirefoxOrIE ? "" : "none",
                            visibility: self.isFirefoxOrIE ? "hidden" : "",
                            "pointer-events": "",
                            zIndex: 0
                        });
                    }
                    this._restoreClip(true);
                    delete s.over;
                }
            }
        }
    };
    /**
     * @param {boolean} cell
     * @param {?} dataAndEvents
     * @return {undefined}
     */
    results.prototype._restoreClip = function(cell, dataAndEvents) {
        let c;
        const i = this.$el.data("f");
        const that = i.turnData;
        const text = cell ? self.translate(0, 0, that.options.acceleration) : "";
        if (dataAndEvents) {
            c = i;
        } else {
            if (that.pages[i.over]) {
                c = that.pages[i.over].data("f");
            }
        }
        if (c) {
            if (c.clip) {
                c.clip.transform(text);
            }
            c.ipage.transform(text).css({
                top: 0,
                left: 0,
                right: "auto",
                bottom: "auto"
            });
            c.igradient.hide();
        }
    };
    /**
     * @param {Object} elem
     * @param {boolean} dataAndEvents
     * @return {undefined}
     */
    results.prototype._setFoldedPagePosition = function(elem, dataAndEvents) {
        const entry = this.$el.data();
        const p = entry.f;
        const o = p.turnData;
        if (dataAndEvents) {
            let offsetCoordinate;
            const rhtml = this;
            const corner = elem.corner;
            offsetCoordinate = p.point && p.point.corner == corner ? p.point : this._startPoint(corner, self.point2D(1, 1));
            this._animate({
                from: [offsetCoordinate.x, offsetCoordinate.y],
                to: [elem.x, elem.y],
                duration: 500,
                easing: o.options.easing,
                /**
                 * @param {Array} args
                 * @return {undefined}
                 */
                frame(args) {
                    /** @type {number} */
                    elem.x = Math.round(args[0]);
                    /** @type {number} */
                    elem.y = Math.round(args[1]);
                    elem.corner = corner;
                    rhtml._fold(elem);
                }
            });
        } else {
            this._fold(elem);
            if (this.animation) {
                if (!this.animation.turning) {
                    this._animate(false);
                }
            }
        }
    };
    /**
     * @param {Object} c
     * @param {boolean} dataAndEvents
     * @return {?}
     */
    results.prototype._showFoldedPage = function(c, dataAndEvents) {
        const options = this.$el.data("f");
        const xCreateElement = this._foldingPage();
        if (options && xCreateElement) {
            const _visible = options.visible;
            const corner = c.corner;
            const async = options.turn;
            const data = options.turnData;
            if (!_visible || (!options.point || options.point.corner != c.corner)) {
                if (data.corner = corner, this._trigger("start", options.page, data.tpage ? null : c.corner) == self.EVENT_PREVENTED) {
                    return false;
                }
                if (data.pages[options.next] && options.effect != data.pages[options.next].data("f").effect) {
                    return false;
                }
                if ("hard" == options.effect && "turning" == data.status) {
                    /** @type {number} */
                    let i = 0;
                    for (; i < data.front.length; i++) {
                        if (!data.pages[data.front[i]].hasClass("hard")) {
                            that.prototype.stop.call(async);
                            break;
                        }
                    }
                }
                if (!_visible) {
                    data.front.push(data.display == self.DISPLAY_SINGLE ? 0 : options.next);
                    data.pageMv.push(options.page);
                }
                options.startPoint = options.startPoint || self.point2D(c.x, c.y);
                /** @type {boolean} */
                options.visible = true;
                this._bringClipToFront(true);
                that.prototype.update.call(async);
                if (data.options.blocks) {
                    that.prototype._fetchBlocks.call(async, Math.max(data.options.pages + 1, that.prototype.view.call(async, options.next)[0]), "hover");
                }
            }
            return (this._setFoldedPagePosition(c, dataAndEvents), true);
        }
        return false;
    };
    /**
     * @return {?}
     */
    results.prototype.hide = function() {
        const data = this.$el.data("f");
        const config = data.turnData;
        const udataCur = self.translate(0, 0, config.options.acceleration);
        switch (data.effect) {
            case "hard":
                const out = config.pages[data.over];
                data.ogradient.remove();
                data.igradient.remove();
                data.ipage.transform(udataCur);
                if (out) {
                    out.data("f").ipage.transform(udataCur);
                }
                break;
            case "sheet":
                const $control = config.pageWrap[data.over];
                if ($control) {
                    $control.css({
                        overflow: "hidden",
                        "pointer-events": ""
                    });
                }
                data.ipage.css({
                    left: 0,
                    top: 0,
                    right: "auto",
                    bottom: "auto"
                }).transform(udataCur);
                data.clip.transform(udataCur);
                data.ogradient.css({
                    visibility: "hidden"
                });
        }
        return (data.visible && (0 === config.front.length && that.prototype._removeFromDOM.call(data.turn)), data.status = "", data.visible = false, delete data.point, delete data.dpoint, delete data.startPoint, this.$el);
    };
    /**
     * @param {boolean} dataAndEvents
     * @return {undefined}
     */
    results.prototype.hideFoldedPage = function(dataAndEvents) {
        const p = this.$el.data("f");
        if (p.dpoint) {
            const $scope = this;
            const code = p.status;
            const o = p.turnData;
            const alpha = p.peel && p.peel.corner == p.dpoint.corner;
            /**
             * @return {undefined}
             */
            const hide = () => {
                if (dataAndEvents && ("move" == code && alpha)) {
                    /** @type {string} */
                    p.status = "peel";
                } else {
                    $scope._animationCompleted(p.page, false);
                }
            };
            if (dataAndEvents) {
                const data = [p.dpoint, 0, 0, 0];
                data[3] = alpha ? this._startPoint(data[0].corner, self.point2D(p.peel.x, p.peel.y)) : this._startPoint(data[0].corner, self.point2D(0, 1));
                let dy = data[0].y - data[3].y;
                dy = "tr" == data[0].corner || "tl" == data[0].corner ? Math.min(0, dy) / 2 : Math.max(0, dy) / 2;
                data[1] = self.point2D(data[0].x, data[0].y + dy);
                data[2] = self.point2D(data[3].x, data[3].y - dy);
                this._animate(false);
                this._animate({
                    from: 0,
                    to: 1,
                    frame(action) {
                        $scope._fold(self.bezier(data, action, data[0].corner));
                    },
                    complete: hide,
                    easing: o.options.easing,
                    duration: 800,
                    hiding: true
                });
            } else {
                this._animate(false);
                hide();
            }
        }
    };
    results.prototype.turnPage = function(key) {
        let position;
        let path;
        let elem = this.$el;
        const data = elem.data("f");
        const config = data.turnData;
        /** @type {Array} */
        const styles = [0, 0, 0, 0];
        if (has3d = self.css3dAvailable(), config.display == self.DISPLAY_SINGLE && -1 == $.inArray(key, self.corners.forward)) {
            const html = config.pages[data.next];
            const e = html.data("f");
            const pos = e.peel;
            /** @type {number} */
            const _zIndex = parseInt(config.pageWrap[data.page].css("z-index"), 10) || 0;
            path = e.dpoint ? e.dpoint.corner : key;
            position = self.peelingPoint(config.direction == self.DIRECTION_LTR ? path.replace("l", "r") : path.replace("r", "l"));
            elem = html;
            config.pageWrap[data.page - 1].show().css({
                zIndex: _zIndex + 1
            });
            styles[0] = e.dpoint ? self.point2D(e.dpoint.x, e.dpoint.y) : this._endPoint(position.corner);
            styles[1] = styles[0];
            styles[2] = this._startPoint(position.corner, self.point2D(0, 20));
            styles[3] = pos ? this._startPoint(position.corner, self.point2D(pos.x, pos.y)) : this._startPoint(position.corner);
        } else {
            const def = "r" == key || "l" == key ? 0 : config.options.elevation;
            let errors = self.transformUnit(def, this.$el.height());
            path = data.dpoint ? data.dpoint.corner : key;
            position = self.peelingPoint(path || this._cornerAllowed()[0]);
            styles[0] = data.dpoint || this._startPoint(position.corner);
            styles[1] = data.dpoint ? styles[0] : this._startPoint(position.corner, self.point2D(0, errors));
            if (styles[0].x < 0 || styles[0].x > this.$el.width()) {
                /** @type {number} */
                errors = 0;
            }
            styles[2] = this._endPoint(position.corner, self.point2D(0, errors));
            styles[3] = this._endPoint(position.corner);
        }
        elem.flip("_animate", false);
        if (elem.flip("_showFoldedPage", styles[0])) {
            if (data.turnData.options.autoCenter) {
                that.prototype.center.call(data.turn, data.next);
            }
            elem.flip("_animate", {
                from: 0,
                to: 1,
                easing: config.options.easing,
                /**
                 * @param {number} action
                 * @return {undefined}
                 */
                frame(action) {
                    elem.flip("_fold", self.bezier(styles, action, position.corner));
                },
                /**
                 * @return {undefined}
                 */
                complete() {
                    elem.flip("_animationCompleted", data.page, true);
                },
                duration: config.options.duration,
                turning: true
            });
        } else {
            elem.flip("_animationCompleted", data.page, true);
        }
        /** @type {null} */
        data.corner = null;
    };
    /**
     * @return {?}
     */
    results.prototype.isTurning = function() {
        return this.animation && this.animation.turning;
    };
    /**
     * @return {undefined}
     */
    results.prototype._showWhenHolding = function() {
        let message;
        const e = this.$el;
        const result = e.data("f");
        const node = result.turn;
        const data = result.turnData;
        if (result.holdingPoint) {
            /** @type {boolean} */
            const l = data.display == self.DISPLAY_SINGLE;
            const elems = this._cornerAllowed();
            if (message = data.direction == self.DIRECTION_LTR ? l ? result.holdingPoint.x > e.width() / 2 ? "r" : "l" : data.options.showDoublePage ? 0 === result.page % 2 ? "r" : "l" : 0 === result.page % 2 ? "l" : "r" : l ? result.holdingPoint.x > e.width() / 2 ? "l" : "r" : data.options.showDoublePage ? 0 === result.page % 2 ? "l" : "r" : 0 === result.page % 2 ? "r" : "l", that.prototype.stop.call(node), this._animate(false), result.status = "holding", ~$.inArray(message, elems)) {
                if (!data.tmpListeners) {
                    data.tmpListeners = {};
                    data.tmpListeners.tap = self.getListeners(node.$el, "tap", true);
                    data.tmpListeners.doubleTap = self.getListeners(node.$el, "doubleTap", true);
                }
                const ast = self.peelingPoint(message, result.holdingPoint.x, result.holdingPoint.y);
                if (l) {
                    if (this._detectSinglePage(ast, ast, true)) {
                        result.corner = self.peelingPoint(message, result.holdingPoint.x, result.holdingPoint.y);
                    }
                } else {
                    if (this._showFoldedPage(ast, true)) {
                        result.corner = self.peelingPoint(message, result.holdingPoint.x, result.holdingPoint.y);
                    }
                }
            }
        }
    };
    /**
     * @param {Event} method
     * @return {?}
     */
    results.prototype._pagePress = function(method) {
        const data = this.$el.data("f");
        const elem = data.turn;
        if (!data.corner && (!data.disabled && !this.isTurning())) {
            const response = data.turnData;
            /** @type {string} */
            response.status = "tapping";
            /** @type {string} */
            data.status = "tapping";
            const opts = this._isIArea(method);
            if (!(response.options.hover || data.peel && data.peel.corner == opts.corner)) {
                return (response.status = "", data.status = "", void 0);
            }
            if (response.display == self.DISPLAY_SINGLE && (response.pages[data.next] && (data.effect != response.pages[data.next].data("f").effect && (response.pageObjs[data.next].hasClass("cover") && ~$.inArray(opts.corner, self.corners.forward))))) {
                return (response.status = "", data.status = "", void 0);
            }
            if (data.corner = opts, data.startPoint = null, has3d = self.css3dAvailable(), data.corner && this._foldingPage()) {
                return (that.prototype.update.call(elem), true);
            }
            /** @type {null} */
            data.corner = null;
            const ret = self.eventPoint(method);
            const boundary = response.pageWrap[data.page].offset();
            ret.x -= boundary.left;
            ret.y -= boundary.top;
            if (response.options.smartFlip) {
                if (~$.inArray(data.page, that.prototype.view.call(elem))) {
                    if (ret.x > 0) {
                        if (ret.y > 0) {
                            if (ret.x < this.$el.width()) {
                                if (ret.y < this.$el.height()) {
                                    data.holdingPoint = ret;
                                    data.startPoint = ret;
                                    /** @type {number} */
                                    data.holding = setTimeout($.proxy(this._showWhenHolding, this), 100);
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    /**
     * @param {Event} ev
     * @return {?}
     */
    results.prototype._pageMove = function(ev) {
        let position;
        let offset;
        let image;
        let data;
        const options = this.$el.data("f");
        if (!options.disabled) {
            if (ev.preventDefault(), options.corner) {
                return (image = options.turn, data = options.turnData, offset = data.pageWrap[options.page].offset(), options.status = "move", position = self.eventPoint(ev), position.x -= offset.left, position.y -= offset.top, position.corner = options.corner.corner, data.display == self.DISPLAY_SINGLE ? this._detectSinglePage(position, options.corner) : this._showFoldedPage(position), options.holdingPoint && self.cleanSelection(), true);
            }
            if (!this.animation) {
                if (position = this._isIArea(ev)) {
                    if (options.hover) {
                        if ("sheet" == options.effect && 2 != position.corner.length) {
                            return false;
                        }
                        if ("peel" != options.status || (!options.peel || options.peel.corner != position.corner)) {
                            if (data = options.turnData, data.display == self.DISPLAY_SINGLE && data.page == data.totalPages) {
                                return false;
                            }
                            const pos = data.options.cornerPosition;
                            const initialOffset = this._startPoint(position.corner, self.point2D(pos.x, pos.y));
                            /** @type {string} */
                            options.status = "peel";
                            position.x = initialOffset.x;
                            position.y = initialOffset.y;
                            this._showFoldedPage(position, true);
                        }
                    }
                } else {
                    if ("peel" == options.status) {
                        if (!(options.peel && options.peel.corner == options.dpoint.corner)) {
                            /** @type {string} */
                            options.status = "";
                            this.hideFoldedPage(true);
                        }
                    }
                }
            }
            return false;
        }
    };
    /**
     * @return {undefined}
     */
    results.prototype._pageUnpress = function() {
        const opts = this.$el.data("f");
        const corner = opts.corner;
        const turn = opts.turn;
        const response = opts.turnData;
        if (!opts.disabled && (corner && ("turning" != response.status && "swiped" != response.status))) {
            let data = opts.point || corner;
            const page = opts.page;
            const width = this.$el.width();
            if (response.display == self.DISPLAY_SINGLE) {
                if (1 == page) {
                    if ("tapping" == opts.status || data.x < width / 2) {
                        that.prototype._turnPage.call(turn, opts.next, data.corner);
                    } else {
                        this.hideFoldedPage(true);
                    }
                } else {
                    if (~$.inArray(data.corner, self.corners.forward)) {
                        if ("tapping" == opts.status || data.x < width / 2) {
                            that.prototype._turnPage.call(turn, opts.next, data.corner);
                        } else {
                            this.hideFoldedPage(true);
                        }
                    } else {
                        const d = response.pages[opts.page - 1];
                        data = d.data("f").point;
                        if ("tapping" == opts.status || data.x > 0.1 * width) {
                            that.prototype._turnPage.call(turn, opts.page - 1, data ? data.corner : null);
                            /** @type {string} */
                            response.status = "turning";
                        } else {
                            d.flip("turnPage", data.corner);
                        }
                    }
                }
            } else {
                if (response.display == self.DISPLAY_DOUBLE) {
                    if ("tapping" == opts.status || (data.x < 0 || data.x > width)) {
                        that.prototype._turnPage.call(turn, opts.next, data.corner);
                    } else {
                        this.hideFoldedPage(true);
                    }
                }
            }
        }
        if (opts.holdingPoint) {
            clearInterval(opts.holding);
            delete opts.holdingPoint;
            delete opts.holding;
        }
        /** @type {string} */
        opts.status = "";
        /** @type {null} */
        opts.corner = null;
    };
    /**
     * @param {Error} c
     * @param {?} node
     * @param {boolean} dataAndEvents
     * @return {?}
     */
    results.prototype._detectSinglePage = function(c, node, dataAndEvents) {
        const event = this.$el.data("f");
        const eventTarget = event.turn;
        const data = event.turnData;
        if (data.pageWrap[event.page].offset(), -1 == $.inArray(node.corner, self.corners.forward)) {
            let b;
            const d = data.pages[event.page - 1];
            const e = d.data("f");
            if (c.corner = data.direction == self.DIRECTION_LTR ? c.corner.replace("l", "r") : c.corner.replace("r", "l"), e.visible) {
                return (b = d.flip("_showFoldedPage", c, false), data.corner = node.corner, b);
            }
            const pos = d.flip("_endPoint", c.corner);
            return (e.point = self.peelingPoint(c.corner, pos.x, pos.y), that.prototype.stop.call(eventTarget), b = d.flip("_showFoldedPage", c, true), data.corner = node.corner, b);
        }
        return this._showFoldedPage(c, dataAndEvents);
    };
    /**
     * @param {boolean} recurring
     * @return {?}
     */
    results.prototype.disable = function(recurring) {
        return (this.$el.data("f").disabled = recurring, this.$el);
    };
    /**
     * @param {string} hover
     * @return {?}
     */
    results.prototype.hover = function(hover) {
        return (this.$el.data("f").hover = hover, this.$el);
    };
    /**
     * @param {string} opts
     * @param {boolean} dataAndEvents
     * @return {?}
     */
    results.prototype.peel = function(opts, dataAndEvents) {
        const s = this.$el.data("f");
        if (opts.corner) {
            if (-1 == $.inArray(opts.corner, self.corners.all)) {
                throw self.turnError(`Corner ${opts.corner} is not permitted`);
            }
            if (~$.inArray(opts.corner, this._cornerAllowed())) {
                const that = s.turnData;
                const center = that.options.cornerPosition;
                opts.x = opts.x || center.x;
                opts.y = opts.y || center.y;
                const pos = this._startPoint(opts.corner, self.point2D(opts.x, opts.y));
                /** @type {string} */
                s.peel = opts;
                /** @type {string} */
                s.status = "peel";
                this._showFoldedPage(self.peelingPoint(opts.corner, pos.x, pos.y), dataAndEvents);
            }
        } else {
            /** @type {string} */
            s.status = "";
            this.hideFoldedPage(dataAndEvents);
        }
        return this.$el;
    };
    /**
     * @param {number} name
     * @param {boolean} code
     * @return {undefined}
     */
    results.prototype._animationCompleted = function(name, code) {
        const options = this.$el.data("f");
        const async = options.turn;
        const data = options.turnData;
        if ((code || (!options.peel || options.peel.corner != options.dpoint.corner)) && (data.front.splice(data.front.indexOf(parseInt(options.next, 10)), 1), data.pageMv.splice(data.pageMv.indexOf(parseInt(options.page, 10)), 1), this.$el.css({
                visibility: "hidden"
            }), this.hide(), 0 === data.front.length && (data.corner = null)), code) {
            const port = data.tpage || data.page;
            if (port == options.next || port == options.page) {
                delete data.tpage;
                that.prototype._fitPage.call(async, port || options.next);
            } else {
                data.pageWrap[options.page].hide();
            }
        } else {
            if (data.display == self.DISPLAY_SINGLE && name == data.tpage) {
                delete data.tpage;
                that.prototype._fitPage.call(async, name);
            } else {
                that.prototype.update.call(async);
                that.prototype._updateShadow.call(async);
            }
        }
        this.$el.css({
            visibility: ""
        });
        this.$el.trigger("end", [name, code]);
    };
    /**
     * @param {boolean} animation
     * @return {?}
     */
    results.prototype._animate = function(animation) {
        if (!animation) {
            return (this.animation && this.animation.stop(), void 0);
        }
        if (this._animation) {
            this.animation._time = (new Date()).getTime();
            let i = 0;
            for (; i < this.animation._elements; i++) {
                this.animation.from[i] = this._animation.current[i];
                this.animation.to[i] = animation.to[i] - this._animation.from[i];
            }
        } else {
            if (!animation.to.length) {
                animation.to = [animation.to];
            }
            if (!animation.from.length) {
                animation.from = [animation.from];
            }
            const options = this;
            let e = true;
            this.animation = $.extend({
                current: [],
                _elements: animation.to.length,
                _time: (new Date()).getTime(),
                stop() {
                    e = false;
                    options.animation = null;
                },
                _frame() {
                    const t = Math.min(this.duration, (new Date()).getTime() - this._time);
                    let i = 0;
                    for (; i < this._elements; i++) {
                        this.current[i] = this.easing(t, this.from[i], this.to[i], this.duration);
                    }
                    e = true;
                    this.frame(1 == this._elements ? this.current[0] : this.current);
                    if (t >= this.duration) {
                        this.stop();
                        if (this.complete) {
                            this.complete();
                        }
                    } else {
                        window.requestAnimationFrame(() => {
                            if (e) {
                                options.animation._frame();
                            }
                        });
                    }
                }
            }, animation);
            let j = 0;
            for (; j < this.animation._elements; j++) {
                this.animation.to[j] -= this.animation.from[j];
            }
            this.animation._frame();
        }
    };

    results.prototype.destroy = function() {
        const g = this.$el.data("f");
        if (g.clip) {
            this._animate(false);
            g.clip.detach();
            delete g.clip;
            delete g.igradient;
            delete g.ogradient;
            delete g.ipage;
            delete g.turnData;
            delete g.turn;
        }
        this._destroy();
    };

    that.prototype.addPage = function(element, page, func) {
        const data = this._data;
        if (data.destroying) {
            return null;
        }
        let octalLiteral;
        let activeClassName = "";
        let i = false;
        const lastPage = data.totalPages + 1;

        if (func = func || {}, (octalLiteral = /\bpage\-([0-9]+|last|next\-to\-last)\b/.exec($(element).attr("class"))) && (page = "last" == octalLiteral[1] ? data.totalPages : "next-to-last" == octalLiteral[1] ? data.totalPages - 1 : parseInt(octalLiteral[1], 10)), page) {
            if (page <= lastPage) {
                i = true;
            } else {
                if (page > lastPage) {
                    throw self.error(`Page "${page}" cannot be inserted`);
                }
            }
        } else {
            page = lastPage;
            i = true;
        }
        return (page >= 1 && (lastPage >= page && (page in data.pageObjs && this._movePages(page, 1), i && (data.totalPages = lastPage), data.pageObjs[page] = $(element), data.pageObjs[page].hasClass("cover") || (activeClassName += "page "), activeClassName += `page-${page} `, activeClassName += data.display == self.DISPLAY_DOUBLE ? page % 2 ? "page-odd" : "page-even" : "page-odd", data.pageObjs[page].css({
            "float": "left"
        }).addClass(activeClassName), data.pageObjs[page].data({
            f: func
        }), this._addPage(page), data.done && this._removeFromDOM())), this.$el);
    };
    /**
     * @param {number} page
     * @return {undefined}
     */
    that.prototype._addPage = function(page) {
        const data = this._data;
        const element = data.pageObjs[page];
        if (element) {
            if (this._pageNeeded(page)) {
                if (!data.pageWrap[page]) {
                    data.pageWrap[page] = $("<div/>", {
                        "class": "page-wrapper",
                        page,
                        css: {
                            position: "absolute",
                            overflow: "hidden"
                        }
                    });
                    this.$el.append(data.pageWrap[page]);
                    data.pageObjs[page].appendTo(data.pageWrap[page]);
                    const tmp = this._pageSize(page, true);
                    element.css({
                        width: tmp.width,
                        height: tmp.height
                    });
                    data.pageWrap[page].css(tmp);
                }
                this._makeFlip(page);
            } else {
                data.pageObjs[page].remove();
            }
        }
    };
    /**
     * @param {string} page
     * @return {?}
     */
    that.prototype.hasPage = function(page) {
        return self.has(page, this._data.pageObjs);
    };

    that.prototype._pageSize = function(page) {
        const data = this._data;
        const s = {};
        const w = this.$el.width();
        const size = this.$el.height();
        const element = data.pageObjs[page];
        if (data.display == self.DISPLAY_SINGLE) {
            s.width = w;
            s.height = size;
            s.top = 0;
            s.left = 0;
            s.right = "auto";
            if (element.hasClass("page")) {
                s.top = data.pageMargin[0];
                s.width -= data.pageMargin[1];
                s.height -= data.pageMargin[0] + data.pageMargin[2];
            } else {
                if (2 == page) {
                    if (element.hasClass("cover")) {
                        s.left = -w;
                    }
                }
            }
        } else {
            if (data.display == self.DISPLAY_DOUBLE) {
                /** @type {number} */
                const width = Math.floor(w / 2);
                const y = size;
                /** @type {number} */
                const l = page % 2;
                /** @type {number} */
                s.top = 0;
                if (element.hasClass("own-size")) {
                    s.width = data.pageObjs[page].width();
                    s.height = data.pageObjs[page].height();
                } else {
                    /** @type {number} */
                    s.width = width;
                    s.height = y;
                }
                if (element.hasClass("page")) {
                    s.top = data.pageMargin[0];
                    s.width -= l ? data.pageMargin[1] : data.pageMargin[3];
                    s.height -= data.pageMargin[0] + data.pageMargin[2];
                }
                if (data.direction != self.DIRECTION_LTR || data.options.showDoublePage) {
                    /** @type {number} */
                    s[l ? "left" : "right"] = width - s.width;
                    /** @type {string} */
                    s[l ? "right" : "left"] = "auto";
                } else {
                    /** @type {number} */
                    s[l ? "right" : "left"] = width - s.width;
                    /** @type {string} */
                    s[l ? "left" : "right"] = "auto";
                }
            }
        }
        return s;
    };
    /**
     * @param {number} page
     * @return {?}
     */
    that.prototype._makeFlip = function(page) {
        const data = this._data;
        if (!data.pages[page]) {
            let state;
            /** @type {boolean} */
            const frameMasked = data.display == self.DISPLAY_SINGLE;
            /** @type {number} */
            const even = page % 2;
            state = frameMasked ? page + 1 : data.options.showDoublePage && !frameMasked ? even ? page - 1 : page + 1 : even ? page + 1 : page - 1;
            if (data.options.blocks > 0) {
                if (!data.pageBlocks[page]) {
                    data.pageBlocks[page] = {
                        first: 0,
                        last: 0
                    };
                }
            }
            const tmp = this._pageSize(page);
            data.pages[page] = data.pageObjs[page].css({
                width: tmp.width,
                height: tmp.height
            }).flip({
                page,
                next: state
            }, this);
            if (data.z) {
                data.pageWrap[page].css({
                    display: self.isFirefoxOrIE ? "" : data.z.pageV[page] ? "none" : "",
                    visibility: self.isFirefoxOrIE ? data.z.pageV[page] ? "hidden" : "" : "",
                    zIndex: data.z.pageZ[page] || 0
                });
            }
        }
        return data.pages[page];
    };
    /**
     * @return {undefined}
     */
    that.prototype._makeRange = function() {
        let page;
        const data = this._data;
        if (data.totalPages > 0) {
            data.range = this.range();
            page = data.range[0];
            for (; page <= data.range[1]; page++) {
                if (data.pageObjs[page]) {
                    if (!data.pageWrap[page]) {
                        this._addPage(page);
                    }
                }
            }
        }
    };
    /**
     * @param {number} page
     * @return {?}
     */
    that.prototype.range = function(page) {
        let numStyles;
        let index;
        let length;
        let parts;
        const data = this._data;
        let max = data.totalPages;
        if (data.options.blocks > 0) {
            let ms = this.getBlockPage(data.options.blocks);
            if (data.display == self.DISPLAY_DOUBLE) {
                if (data.options.showDoublePage) {
                    ms += 1;
                }
            }
            if (ms > max) {
                max = ms;
                data.totalPages = max;
            }
        }
        return (page = page || (data.tpage || (data.page || 1)), parts = this._view(page), parts[1] = parts[1] || parts[0], parts[0] >= 1 && parts[1] <= max ? (numStyles = Math.floor((data.options.cacheSize - 2) / 2), max - parts[1] > parts[0] ? (index = Math.min(parts[0] - 1, numStyles), length = 2 * numStyles - index) : (length = Math.min(max - parts[1], numStyles), index = 2 * numStyles - length)) : (index = data.options.cacheSize - 1, length = data.options.cacheSize - 1), [Math.max(1, parts[0] - index),
            Math.min(max, parts[1] + length)
        ]);
    };
    /**
     * @param {number} page
     * @return {?}
     */
    that.prototype._pageNeeded = function(page) {
        if (0 === page) {
            return true;
        }
        const data = this._data;
        const range = data.range || this.range();
        return data.pageObjs[page].hasClass("cover") || (~data.pageMv.indexOf(page) || (~data.front.indexOf(page) || page >= range[0] && page <= range[1]));
    };
    /**
     * @return {undefined}
     */
    that.prototype._removeFromDOM = function() {
        if (!this.isAnimating()) {
            const data = this._data;
            let page;
            for (page in data.pageWrap) {
                if (self.has(page, data.pageWrap)) {
                    /** @type {number} */
                    page = parseInt(page, 10);
                    if (!this._pageNeeded(page)) {
                        this._removePageFromDOM(page);
                    }
                }
            }
        }
    };
    /**
     * @param {?} page
     * @param {number} dataName
     * @return {?}
     */
    that.prototype.pageData = function(page, dataName) {
        const data = this._data;
        return void 0 === dataName ? data.pageObjs[page].data("f") : (data.pageObjs[page].data("f", dataName), void 0);
    };
    /**
     * @param {number} page
     * @param {boolean} dataAndEvents
     * @return {?}
     */
    that.prototype._removePageFromDOM = function(page, dataAndEvents) {
        const data = this._data;
        this.view(page);
        let options;
        const aliases = data.pageObjs;
        const pages = data.pages;
        if (page && this._trigger("removePage", page, aliases[page]) == self.EVENT_PREVENTED) {
            return false;
        }
        if (data.pages[page] && (data.pages[page].flip("_bringClipToFront", false), data.pages[page].flip("destroy"), data.pages[page].detach(), delete data.pages[page]), aliases[page] && aliases[page].detach(), data.pageWrap[page] && (data.pageWrap[page].detach(), delete data.pageWrap[page]), data.dynamicMode || dataAndEvents) {
            if (options = data.pageBlocks[page]) {
                const h = options.last || options.first;
                let i = options.first;
                for (; h >= i; i++) {
                    if (data.blocks[i]) {
                        if (data.blocks[i].start) {
                            if (!pages[data.blocks[i].start]) {
                                if (!pages[data.blocks[i].end]) {
                                    delete data.blocks[i];
                                }
                            }
                        } else {
                            delete data.blocks[i];
                        }
                    }
                }
                delete data.pageBlocks[page];
            }
            if (aliases[page]) {
                aliases[page].removeData();
                delete aliases[page];
            }
        }
        return true;
    };
    /**
     * @param {number} page
     * @return {?}
     */
    that.prototype.removePage = function(page) {
        const data = this._data;
        if ("*" == page) {
            const param = this.range();
            let value = param[0];
            for (; value <= param[1]; value++) {
                this._removePageFromDOM(value, true);
            }
            /** @type {number} */
            data.options.blocks = 0;
            /** @type {number} */
            data.totalPages = 0;
        } else {
            if (1 > page || page > data.totalPages) {
                throw self.turnError(`The page ${page} doesn't exist`);
            }
            if (data.pageObjs[page] && (this.stop(), !this._removePageFromDOM(page, true))) {
                return false;
            }
            this._movePages(page, -1);
            /** @type {number} */
            data.totalPages = data.totalPages - 1;
            if (data.page > data.totalPages) {
                /** @type {null} */
                data.page = null;
                this._fitPage(data.totalPages);
            } else {
                this._makeRange();
                this.update();
            }
        }
        return this;
    };
    /**
     * @param {number} newPage
     * @param {number} recurring
     * @return {undefined}
     */
    that.prototype._movePages = function(newPage, recurring) {
        let page;
        const that = this;
        const data = this._data;
        /** @type {boolean} */
        const d = data.display == self.DISPLAY_SINGLE;
        /**
         * @param {number} page
         * @return {undefined}
         */
        const move = page => {
            const i = page + recurring;
            /** @type {number} */
            const prev = i % 2;
            /** @type {string} */
            const idx = prev ? " page-odd " : " page-even ";
            if (data.pageObjs[page]) {
                data.pageObjs[i] = data.pageObjs[page].removeClass(`page-${page} page-odd page-even`).addClass(`page-${i}${idx}`);
            }
            if (data.pageWrap[page]) {
                data.pageWrap[i] = data.pageObjs[i].hasClass("fixed") ? data.pageWrap[page].attr("page", i) : data.pageWrap[page].css(that._pageSize(i, true)).attr("page", i);
                if (data.pages[page]) {
                    data.pages[i] = data.pages[page];
                    data.pages[i].data("f").page = i;
                    data.pages[i].data("f").next = d ? i + 1 : data.options.showDoublePage ? prev ? i - 1 : i + 1 : prev ? i + 1 : i - 1;
                }
                if (recurring) {
                    delete data.pages[page];
                    delete data.pageObjs[page];
                    delete data.pageWrap[page];
                }
            }
        };
        if (recurring > 0) {
            page = data.totalPages;
            for (; page >= newPage; page--) {
                move(page);
            }
        } else {
            /** @type {number} */
            page = newPage;
            for (; page <= data.totalPages; page++) {
                move(page);
            }
        }
    };
    /**
     * @param {number} page
     * @return {?}
     */
    that.prototype._view = function(page) {
        const data = this._data;
        return (page = page || data.page, data.display == self.DISPLAY_DOUBLE ? data.options.showDoublePage ? page % 2 ? [page, page + 1] : [page - 1, page] : page % 2 ? [page - 1, page] : [page, page + 1] : 0 === page % 2 && (data.pages[page] && data.pages[page].hasClass("cover")) ? [page, page + 1] : [page]);
    };
    /**
     * @param {number} page
     * @param {boolean} dataAndEvents
     * @return {?}
     */
    that.prototype.view = function(page, dataAndEvents) {
        const data = this._data;
        const els = this._view(page);
        /** @type {Array} */
        const arr = [];
        return (dataAndEvents ? (els[0] > 0 && arr.push(els[0]), els[1] <= data.totalPages && arr.push(els[1])) : (els[0] > 0 ? arr.push(els[0]) : arr.push(0), els[1] && (els[1] <= data.totalPages ? arr.push(els[1]) : arr.push(0))), arr);
    };
    /**
     * @param {number} pages
     * @return {?}
     */
    that.prototype.pages = function(pages) {
        const data = this._data;
        if (pages) {
            if (pages < data.totalPages) {
                let page = data.totalPages;
                for (; page > pages; page--) {
                    this.removePage(page);
                }
            }
            return (data.totalPages = pages, this._fitPage(data.page), this.$el);
        }
        return data.totalPages;
    };
    /**
     * @param {number} page
     * @return {?}
     */
    that.prototype._missing = function(page) {
        const data = this._data;
        if (data.totalPages < 1) {
            return (data.options.blocks > 0 && this.$el.trigger("missing", [1]), void 0);
        }
        const args = data.range || this.range(page);
        /** @type {Array} */
        const ret = [];
        let next = args[0];
        for (; next <= args[1]; next++) {
            if (!data.pageObjs[next]) {
                ret.push(next);
            }
        }
        if (ret.length > 0) {
            this.$el.trigger("missing", [ret]);
        }
    };
    /**
     * @param {?} i
     * @return {?}
     */
    that.prototype.pageElement = function(i) {
        return this._data.pageObjs[i];
    };
    /**
     * @return {?}
     */
    that.prototype.next = function() {
        return this.page(this._view(this._data.page).pop() + 1);
    };
    /**
     * @return {?}
     */
    that.prototype.previous = function() {
        return this.page(this._view(this._data.page).shift() - 1);
    };
    /**
     * @param {boolean} recurring
     * @return {undefined}
     */
    that.prototype._backPage = function(recurring) {
        const data = this._data;
        if (recurring) {
            if (!data.pageObjs[0]) {
                const curr = $("<div />");
                data.pageObjs[0] = $(curr).css({
                    "float": "left"
                }).addClass("page page-0");
                this._addPage(0);
            }
        } else {
            if (data.pageObjs[0]) {
                this._removePageFromDOM(0, true);
            }
        }
    };
    /**
     * @param {number} page
     * @return {?}
     */
    that.prototype._isCoverPageVisible = function(page) {
        const data = this._data;
        const totalPages = data.tpage || data.page;
        return data.pageObjs[page].hasClass("cover") && (totalPages >= page && 0 === page % 2 || page >= totalPages && 1 === page % 2);
    };
    /**
     * @param {number} keepData
     * @return {?}
     */
    that.prototype.getBlockPage = function(keepData) {
        const data = this._data;
        if (1 > keepData || keepData > data.options.blocks) {
            return 0;
        }
        if (1 == keepData) {
            return data.options.pages + 1;
        }
        const pages = data.options.pages;
        const endPage = 0 === pages % 2 ? pages : Math.min(0, pages - 1);
        return data.display == self.DISPLAY_DOUBLE ? data.options.showDoublePage ? 2 * keepData - 1 + endPage : 2 * keepData - 2 + endPage : keepData + data.options.pages;
    };
    that.prototype._fitPage = function(page) {
        const data = this._data;
        const elems = this.view(page);
        if (data.display == self.DISPLAY_SINGLE) {
            if (data.pages[page]) {
                if (data.pages[page].hasClass("cover")) {
                    if (-1 != $.inArray(page + 1, elems)) {
                        page += 1;
                    }
                }
            }
        }
        data.range = this.range(page);
        this._missing();
        if (data.pageObjs[page]) {
            if (-1 != $.inArray(1, elems)) {
                this.$el.addClass("first-page");
            } else {
                this.$el.removeClass("first-page");
            }
            if (~$.inArray(data.totalPages, elems)) {
                this.$el.addClass("last-page");
            } else {
                this.$el.removeClass("last-page");
            }
            /** @type {string} */
            data.status = "";
            /** @type {null} */
            data.peel = null;
            /** @type {number} */
            data.page = page;
            if (data.display != self.DISPLAY_SINGLE) {
                this.stop();
            }
            this._removeFromDOM();
            this._makeRange();
            this._updateShadow();
            this._cloneView(false);
            this.$el.trigger("turned", [page, elems]);
            this.update();
            if (elems[0] > data.options.pages) {
                this._fetchBlocks(elems[0], "fixed");
            } else {
                if (elems[1] > data.options.pages) {
                    this._fetchBlocks(elems[1], "fixed");
                }
            }
            if (data.options.autoCenter) {
                this.center();
            }
        }
    };

    that.prototype._turnPage = function(page, dir) {
        let current;
        let prevMsgId;
        let next;
        const data = this._data;
        const view = this.view();
        const values = this.view(page);
        const k = data.display == self.DISPLAY_SINGLE;
        if (k) {
            current = view[0];
            next = values[0];
        } else {
            if (view[1] && page > view[1]) {
                current = view[1];
                next = values[0];
            } else {
                if (!(view[0] && page < view[0])) {
                    return false;
                }
                current = view[0];
                next = values[1];
            }
        }
        const coords = data.options.turnCorners.split(",");
        const e = data.pages[current].data("f");
        const change = e.dpoint;
        if (e.next, dir || (dir = "hard" == e.effect ? data.direction == self.DIRECTION_LTR ? page > current ? "r" : "l" : page > current ? "l" : "r" : data.direction == self.DIRECTION_LTR ? $.trim(coords[page > current ? 1 : 0]) : $.trim(coords[page > current ? 0 : 1])), k ? next > current && -1 == data.pageMv.indexOf(current) ? this.stop() : current > next && (-1 == data.pageMv.indexOf(next) && this.stop()) : data.display == self.DISPLAY_DOUBLE && (Math.abs((data.tpage || data.page) - page) > 2 &&
                this.stop()), data.page != page) {
            if (prevMsgId = data.page, this._trigger("turning", page, values, dir) == self.EVENT_PREVENTED) {
                return (~$.inArray(current, data.pageMv) && data.pages[current].flip("hideFoldedPage", true), false);
            }
            if (~$.inArray(1, values)) {
                this.$el.addClass("first-page");
                this.$el.trigger("first");
            } else {
                this.$el.removeClass("first-page");
            }
            if (~$.inArray(data.totalPages, values)) {
                this.$el.addClass("last-page");
                this.$el.trigger("last");
            } else {
                this.$el.removeClass("last-page");
            }
        }
        return (data.status = "turning", data.range = this.range(page), this._missing(page), data.pageObjs[page] && (this._cloneView(false), data.tpage = next, this._makeRange(), e.dpoint = e.next != next ? null : change, e.next = next, prevMsgId = data.page, -1 == data.pageMv.indexOf(next) ? data.pages[current].flip("turnPage", dir) : (data.options.autoCenter && this.center(next), data.status = "", data.pages[next].flip("hideFoldedPage", true)), prevMsgId == data.page && (data.page = page), this.update()), true);
    };

    that.prototype.page = function(page) {
        const data = this._data;
        if (void 0 === page) {
            return data.page;
        }
        if (page = parseInt(page, 10), !(data.options.blocks > 0 && page == data.totalPages + 1)) {
            if (page > 0 && page <= data.totalPages) {
                if (page != data.page) {
                    if (!data.done || ~$.inArray(page, this.view())) {
                        this._fitPage(page);
                    } else {
                        if (!this._turnPage(page)) {
                            return false;
                        }
                    }
                }
                return this.$el;
            }
            return false;
        }
        this._fitPage(page);

    };

    that.prototype.center = function(out) {
        const data = this._data;
        const size = this.size();
        /** @type {number} */
        let ml = 0;
        if (!data.noCenter) {
            if (data.display == self.DISPLAY_DOUBLE) {
                const view = this.view(out || (data.tpage || data.page));
                if (data.direction == self.DIRECTION_LTR) {
                    if (view[0]) {
                        if (!view[1]) {
                            ml += size.width / 4;
                        }
                    } else {
                        ml -= size.width / 4;
                    }
                } else {
                    if (view[0]) {
                        if (!view[1]) {
                            ml -= size.width / 4;
                        }
                    } else {
                        ml += size.width / 4;
                    }
                }
            }
            this.$el.css({
                marginLeft: ml
            });
        }
        return this.$el;
    };
    /**
     * @return {?}
     */
    // that.prototype.destroy = function() {
    //     var that = this._data;
    //     return this._trigger("destroy") != self.EVENT_PREVENTED && (that.watchSizeChange = false, that.destroying = true, this.$el.undelegate(), this.$el.parent().off("start", this._eventPress), that.options.viewer.off("vmousemove", this._eventMove), $(document).off("vmouseup", this._eventRelease), this.removePage("*"), that.zoomer && that.zoomer.remove(), that.shadow && that.shadow.remove(), this._destroy()), this.$el;
    // };

    // that.prototype.is = function() {
    //     return true;
    // };

    that.prototype._getDisplayStr = i => i == self.DISPLAY_SINGLE ? "single" : i == self.DISPLAY_DOUBLE ? "double" : void 0;

    that.prototype._getDisplayConst = idx => idx == self.DISPLAY_SINGLE ? idx : idx == self.DISPLAY_DOUBLE ? idx : "single" == idx ? self.DISPLAY_SINGLE : "double" == idx ? self.DISPLAY_DOUBLE : void 0;

    that.prototype.display = function(options, display) {
        const data = this._data;
        const el = this._getDisplayStr(data.display);
        if (void 0 === options) {
            return el;
        }
        if (1 == data.zoom) {
            const type = this._getDisplayConst(options);
            if (!type) {
                throw self.turnError(`"${options}" is not a value for display`);
            }
            if (type != data.display) {
                const e = this._trigger("changeDisplay", options, el);
                if (!data.done || e != self.EVENT_PREVENTED) {
                    switch (type) {
                        case self.DISPLAY_SINGLE:
                            this._backPage(true);
                            this.$el.removeClass("display-double").addClass("display-single");
                            break;
                        case self.DISPLAY_DOUBLE:
                            this._backPage(false);
                            this.$el.removeClass("display-single").addClass("display-double");
                    }
                    if (data.display = type, el) {
                        if (void 0 === display || display) {
                            const size = this.size();
                            this.size(size.width, size.height);
                            this.update();
                        }
                        this._movePages(1, 0);
                        this.$el.removeClass(el);
                    }
                }
                this.$el.addClass(this._getDisplayStr());
                this._cloneView(false);
                this._makeRange();
            }
        }
        return this.$el;
    };

    that.prototype.isAnimating = function() {
        const data = this._data;
        return data.pageMv.length > 0 || "turning" == data.status;
    };

    that.prototype._resizeObserver = function() {
        const data = this._data;
        if (data && data.watchSizeChange) {
            const $cont = data.options.viewer;
            const d = 10;
            if (data.viewerWidth != $cont.width() || data.viewerHeight != $cont.height()) {
                data.viewerWidth = $cont.width();
                data.viewerHeight = $cont.height();
                this._resize();
            }
            data.monitorTimer = setTimeout($.proxy(this._resizeObserver, this), d);
        }
    };

    that.prototype._defaultSize = function(idx) {
        const data = this._data;
        /** @type {number} */
        const width = data.viewerWidth - data.margin[1] - data.margin[3];
        /** @type {number} */
        const g = data.viewerHeight - data.margin[0] - data.margin[2];
        /** @type {(boolean|number)} */
        const f = "string" == typeof data.options.width && ~data.options.width.indexOf("%");
        const w = self.transformUnit(data.options.width, width);
        const r2 = self.transformUnit(data.options.height, g);
        const rect = self.calculateBounds({
            width: w,
            height: r2,
            boundWidth: Math.min(data.options.width, width),
            boundHeight: Math.min(data.options.height, g)
        });
        if (data.options.responsive) {
            if (f) {
                if (g > width) {
                    return {
                        width: self.transformUnit(data.options.width, width),
                        height: r2,
                        display: self.DISPLAY_SINGLE
                    };
                }
            } else {
                const img = self.calculateBounds({
                    width: w / 2,
                    height: r2,
                    boundWidth: Math.min(data.options.width / 2, width),
                    boundHeight: Math.min(data.options.height, g)
                });
                /** @type {number} */
                const length = data.viewerWidth * data.viewerHeight;
                /** @type {number} */
                const l = length - rect.width * rect.height;
                /** @type {number} */
                const i = length - img.width * img.height;
                if (l > i && !idx || idx == self.DISPLAY_SINGLE) {
                    return {
                        width: img.width,
                        height: img.height,
                        display: self.DISPLAY_SINGLE
                    };
                }
                if (0 !== rect.width % 2) {
                    rect.width -= 1;
                }
            }
        }
        return {
            width: rect.width,
            height: rect.height,
            display: self.DISPLAY_DOUBLE
        };
    };

    that.prototype._calculateMargin = function() {
        let selector;
        let matched;
        const data = this._data;
        const rquickExpr = /^(\d+(?:px|%))(?:\s+(\d+(?:px|%))(?:\s+(\d+(?:px|%))\s+(\d+(?:px|%)))?)$/;
        if (selector = data.options.margin) {
            if (matched = rquickExpr.exec(selector)) {
                data.margin[0] = self.transformUnit(matched[1], data.viewerHeight);
                data.margin[1] = matched[2] ? self.transformUnit(matched[2], data.viewerWidth) : data.margin[0];
                data.margin[2] = matched[3] ? self.transformUnit(matched[3], data.viewerHeight) : data.margin[0];
                data.margin[3] = matched[4] ? self.transformUnit(matched[4], data.viewerWidth) : data.margin[1];
            }
        } else {
            /** @type {Array} */
            data.margin = [0, 0, 0, 0];
        }
        if (selector = data.options.pageMargin) {
            if (matched = rquickExpr.exec(selector)) {
                data.pageMargin[0] = self.transformUnit(matched[1], data.viewerHeight);
                data.pageMargin[1] = matched[2] ? self.transformUnit(matched[2], data.viewerWidth) : data.pageMargin[0];
                data.pageMargin[2] = matched[3] ? self.transformUnit(matched[3], data.viewerHeight) : data.pageMargin[0];
                data.pageMargin[3] = matched[4] ? self.transformUnit(matched[4], data.viewerWidth) : data.pageMargin[1];
            }
        } else {
            /** @type {Array} */
            data.pageMargin = [0, 0, 0, 0];
        }
    };
    /**
     * @return {undefined}
     */
    that.prototype._resize = function() {
        let i;
        let codeSegments;
        let options;
        const data = this._data;
        if (data.options.responsive) {
            const bbox = this.view();
            data.options.viewer;
            data.viewerWidth;
            data.viewerHeight;
            if (this._calculateMargin(), options = this._defaultSize(), this.display(options.display, false), options.display != data.display && (options = this._defaultSize(data.display)), this.size(options.width * data.zoom, options.height * data.zoom), this.update(), data.zoomer) {
                options = this._defaultSize(data.display);
                i = 0;
                for (; i < codeSegments.length; i++) {
                    $(codeSegments[i]).css({
                        width: options.width / bbox.length,
                        height: options.height
                    });
                }
            }
        }
    };

    that.prototype.calcVisiblePages = function() {
        const value = this;
        const data = this._data;
        if (!data.tpage) {
            data.page;
        }
        let i;
        let pageIndex;
        let pages;
        const r = {
            pageZ: {},
            pageV: {}
        };
        if (this.isAnimating() && 0 !== data.pageMv[0]) {
            const len = data.pageMv.length;
            const l = data.front.length;
            const end = data.display;
            if (end == self.DISPLAY_SINGLE) {
                /** @type {number} */
                i = 0;
                for (; len > i; i++) {
                    nextPage = data.pages[data.pageMv[i]].data("f").next;
                    /** @type {boolean} */
                    r.pageV[data.pageMv[i]] = true;
                    /** @type {number} */
                    r.pageZ[data.pageMv[i]] = 3 + len - i;
                    /** @type {boolean} */
                    r.pageV[nextPage] = true;
                    if (data.pageObjs[data.pageMv[i]].hasClass("cover")) {
                        /** @type {boolean} */
                        r.pageV[nextPage + 1] = true;
                    } else {
                        /** @type {boolean} */
                        r.pageV[0] = true;
                        r.pageZ[0] = 3 + len + 1;
                    }
                }
            } else {
                if (data.display == self.DISPLAY_DOUBLE) {
                    /** @type {number} */
                    i = 0;
                    for (; len > i; i++) {
                        pages = value.view(data.pageMv[i]);
                        /** @type {number} */
                        pageIndex = 0;
                        for (; pageIndex < pages.length; pageIndex++) {
                            /** @type {boolean} */
                            r.pageV[pages[pageIndex]] = true;
                        }
                        /** @type {number} */
                        r.pageZ[data.pageMv[i]] = 3 + len - i;
                    }
                    /** @type {number} */
                    i = 0;
                    for (; l > i; i++) {
                        pages = value.view(data.front[i]);
                        r.pageZ[data.front[i]] = 5 + len + i;
                        /** @type {number} */
                        pageIndex = 0;
                        for (; pageIndex < pages.length; pageIndex++) {
                            /** @type {boolean} */
                            r.pageV[pages[pageIndex]] = true;
                        }
                    }
                }
            }
        } else {
            pages = this.view(false, true);
            /** @type {number} */
            i = 0;
            for (; i < pages.length; i++) {
                /** @type {boolean} */
                r.pageV[pages[i]] = true;
                /** @type {number} */
                r.pageZ[pages[i]] = 2;
            }
            if (data.display == self.DISPLAY_SINGLE) {
                if (pages[0] < data.totalPages) {
                    if (data.pages[pages[0]].hasClass("cover")) {
                        if (data.pages[pages[0] + 1]) {
                            if (!data.pages[pages[0] + 1].hasClass("cover")) {
                                /** @type {boolean} */
                                r.pageV[pages[0] + 1] = true;
                                /** @type {number} */
                                r.pageZ[pages[0] + 1] = 2;
                            }
                        }
                    } else {
                        /** @type {boolean} */
                        r.pageV[pages[0] + 1] = true;
                        /** @type {number} */
                        r.pageZ[pages[0] + 1] = 1;
                    }
                }
            } else {
                if (data.display == self.DISPLAY_DOUBLE) {
                    if (pages[0] > 2) {
                        /** @type {boolean} */
                        r.pageV[pages[0] - 2] = true;
                        /** @type {number} */
                        r.pageZ[pages[0] - 2] = 1;
                    }
                    if (pages[1] < data.totalPages - 1) {
                        /** @type {boolean} */
                        r.pageV[pages[1] + 2] = true;
                        /** @type {number} */
                        r.pageZ[pages[1] + 2] = 1;
                    }
                }
            }
        }
        let page;
        for (page in data.pageWrap) {
            if (self.has(page, data.pageWrap)) {
                if (void 0 === r.pageV[page]) {
                    if (this._isCoverPageVisible(page)) {
                        r.pageV[page] = true;
                        r.pageZ[page] = -1;
                    }
                }
            }
        }
        return r;
    };

    that.prototype.update = function() {
        let page;
        let hover;
        const data = this._data;
        const pos = this.calcVisiblePages();
        if (this.isAnimating() && 0 !== data.pageMv[0]) {
            const view = this.view();
            const h = this.view(data.tpage);
            hover = "" === data.status ? data.options.hover : false;
            for (page in data.pageWrap) {
                if (self.has(page, data.pageWrap)) {
                    data.pageWrap[page].css({
                        display: self.isFirefoxOrIE ? "" : pos.pageV[page] ? "" : "none",
                        visibility: self.isFirefoxOrIE ? pos.pageV[page] ? "" : "hidden" : "",
                        zIndex: pos.pageZ[page] || 0
                    });
                    if (data.tpage) {
                        data.pages[page].flip("hover", false).flip("disable", -1 == $.inArray(parseInt(page, 10), data.pageMv) && (page != h[0] && page != h[1]));
                    } else {
                        data.pages[page].flip("hover", hover).flip("disable", page != view[0] && page != view[1]);
                    }
                }
            }
        } else {
            hover = data.options.hover;
            for (page in data.pageWrap) {
                if (self.has(page, data.pageWrap)) {
                    data.pageWrap[page].css({
                        display: self.isFirefoxOrIE ? "" : pos.pageV[page] ? "" : "none",
                        visibility: self.isFirefoxOrIE ? pos.pageV[page] ? "" : "hidden" : "",
                        zIndex: pos.pageZ[page] || 0
                    });
                    if (data.pages[page]) {
                        data.pages[page].flip("disable", data.disabled || 2 != pos.pageZ[page]).flip("hover", hover);
                        if (!pos.pageV[page]) {
                            /** @type {boolean} */
                            data.pages[page].data("f").visible = false;
                        }
                    }
                }
            }
        }
        return (data.z = pos, this.$el);
    };

    that.prototype._updateShadow = () => {};

    that.prototype.options = function(options) {
        if (void 0 === options) {
            return this._data.options;
        }
        const data = this._data;
        const swipe = data.options.swipe;
        if ($.extend(data.options, options), options.pages && this.pages(options.pages), options.page && this.page(options.page), (options.margin || options.pageMargin) && (this._calculateMargin(), this._resize()), options.display && this.display(options.display), options.direction && this.direction(options.direction), options.width && (options.height && this.size(options.width, options.height)), options.swipe === true && swipe ? this.$el.on("swipe", $.proxy(this, "_eventSwipe")) : options.swipe ===
            false && this.$el.off("swipe", this._eventSwipe), options.cornerPosition) {
            const octalLiteral = options.cornerPosition.split(" ");
            data.options.cornerPosition = self.point2D(parseInt(octalLiteral[0], 10), parseInt(octalLiteral[1], 10));
        }
        if (options.margin && this._resize.call(this), options.animatedAutoCenter === true ? this.$el.css(self.addCssWithPrefix({
                "@transition": `margin-left ${options.duration}ms`
            })) : options.animatedAutoCenter === false && this.$el.css(self.addCssWithPrefix({
                "@transition": ""
            })), options.delegate) {
            let eventName;
            for (eventName in options.delegate) {
                if (self.has(eventName, options.delegate)) {
                    if ("tap" == eventName || "doubletap" == eventName) {
                        this.$el.off(eventName, ".page");
                        this.$el.on(eventName, ".page", options.delegate[eventName]);
                    } else {
                        this.$el.off(eventName).on(eventName, options.delegate[eventName]);
                    }
                }
            }
        }
        return this.$el;
    };

    that.prototype.version = () => version;

    that.prototype._getDirectionStr = i => i == self.DIRECTION_LTR ? "ltr" : i == self.DIRECTION_RTL ? "rtl" : void 0;

    that.prototype._getDirectionConst = fragment => "ltr" == fragment ? self.DIRECTION_LTR : "rtl" == fragment ? self.DIRECTION_RTL : void 0;

    that.prototype.direction = function(current) {
        const data = this._data;
        const resultVec = this._getDirectionStr(data.direction);
        if (void 0 === current) {
            return resultVec;
        }
        current = current.toLowerCase();
        const key = this._getDirectionConst(current);
        if (!key) {
            throw self.turnError(`"${current}" is not a value for direction`);
        }
        return ("rtl" == current && this.$el.attr("dir", "ltr").css({
            direction: "ltr"
        }), data.direction = key, data.done && this.size(this.$el.width(), this.$el.height()), this.$el);
    };

    that.prototype.disabled = function(recurring) {
        return void 0 === recurring ? this._data.disabled === true : this.disable(recurring);
    };

    that.prototype.size = function(w, n, obj) {
        if (void 0 === w || void 0 === n) {
            return {
                width: this.$el.width(),
                height: this.$el.height()
            };
        }
        let page;
        let dimension;
        let testWindow;
        const data = this._data;
        const keys = this.view();
        if (data.display == self.DISPLAY_DOUBLE ? (w = Math.floor(w), n = Math.floor(n), 1 == w % 2 && (w -= 1), testWindow = Math.floor(w / 2)) : testWindow = w, this.stop(), this.$el.css({
                width: w,
                height: n
            }), data.zoom > 1) {
            const a = {};
            /** @type {number} */
            let i = 0;
            for (; i < keys.length; i++) {
                if (keys[i]) {
                    /** @type {number} */
                    a[keys[i]] = 1;
                }
            }
            for (page in data.pageWrap) {
                if (self.has(page, data.pageWrap)) {
                    if (this._isCoverPageVisible(page)) {
                        /** @type {number} */
                        a[page] = 1;
                    }
                }
            }
            for (page in a) {
                if (self.has(page, a)) {
                    dimension = this._pageSize(page, true);
                    if (!obj) {
                        data.pageObjs[page].css({
                            width: dimension.width,
                            height: dimension.height
                        });
                    }
                    data.pageWrap[page].css(dimension);
                    if (data.pages[page]) {
                        data.pages[page].flip("_restoreClip", false, true);
                        data.pages[page].flip("resize", dimension.width, dimension.height);
                    }
                }
            }
        } else {
            for (page in data.pageWrap) {
                if (self.has(page, data.pageWrap)) {
                    dimension = this._pageSize(page, true);
                    if (!(obj && -1 != $.inArray(parseInt(page, 10), keys))) {
                        data.pageObjs[page].css({
                            width: dimension.width,
                            height: dimension.height
                        });
                    }
                    data.pageWrap[page].css(dimension);
                    if (data.pages[page]) {
                        data.pages[page].flip("_restoreClip");
                        data.pages[page].flip("resize", dimension.width, dimension.height);
                    }
                }
            }
        }
        if (data.pages[0]) {
            data.pageWrap[0].css({
                left: -this.$el.width()
            });
            data.pages[0].flip("resize");
        }
        this._updateShadow();
        const _self = this;
        const options = data.options;
        return (options.autoCenter && (options.animatedAutoCenter && data.done ? (this.$el.css(self.addCssWithPrefix({
            "@transition": ""
        })), _self.center(), setTimeout(() => {
            _self.$el.css(self.addCssWithPrefix({
                "@transition": `margin-left ${options.duration}ms`
            }));
        }, 0)) : this.center()), this.$el.css(this._position()), data.pages[0] && (page = data.pages[0].data("f").tPage, page && data.pageObjs[0].children().eq(0).css({
            width: data.pageObjs[data.page].width(),
            height: data.pageObjs[data.page].height()
        })), data.peel && this.peel(data.peel.corner, data.peel.x, data.peel.y, false), this.$el);
    };

    that.prototype.stop = function() {
        let c;
        let page;
        const data = this._data;
        if (this.isAnimating()) {
            const path = data.display == self.DISPLAY_SINGLE;
            if (data.tpage) {
                data.page = data.tpage;
                delete data.tpage;
            }
            for (; data.pageMv.length > 0;) {
                // Bad quality code.
                if (page = data.pages[data.pageMv[0]], c = page.data("f")) {
                    const i = c.peel;
                    c.peel = null;
                    page.flip("hideFoldedPage");
                    c.peel = i;
                    c.next = path ? c.page + 1 : data.options.showDoublePage ? 0 === c.page % 2 ? c.page + 1 : c.page - 1 : 0 === c.page % 2 ? c.page - 1 : c.page + 1;
                    page.flip("_bringClipToFront", false);
                }
            }
            data.status = "";
            this.update();
        } else {
            for (page in data.pages) {
                if (self.has(page, data.pages)) {
                    data.pages[page].flip("_bringClipToFront", false);
                }
            }
        }
        return this.$el;
    };

    that.prototype._eventStart = function(evt, dataAndEvents, e) {
        const data = this._data;
        const opts = $(evt.target).data("f");
        return (data.display == self.DISPLAY_SINGLE && (e && (opts.next = "l" == e.charAt(1) && data.direction == self.DIRECTION_LTR || "r" == e.charAt(1) && data.direction == self.DIRECTION_RTL ? opts.next < opts.page ? opts.next : opts.page - 1 : opts.next > opts.page ? opts.next : opts.page + 1)), evt.isDefaultPrevented() ? (this._updateShadow(), void 0) : (this._updateShadow(), void 0));
    };

    that.prototype._eventPress = function(event) {
        const data = this._data;
        data.finger = self.eventPoint(event);
        /** @type {boolean} */
        data.hasSelection = "" === self.getSelectedText();
        let page;
        for (page in data.pages) {
            if (self.has(page, data.pages) && data.pages[page].flip("_pagePress", event)) {
                return (data.tmpListeners || (data.tmpListeners = {}, data.tmpListeners.tap = self.getListeners(this.$el, "tap", true), data.tmpListeners.doubleTap = self.getListeners(this.$el, "doubleTap", true)), event.preventDefault(), data.statusHolding = true, void 0);
            }
        }
        if (data.options.smartFlip) {
            event.preventDefault();
        }
    };

    that.prototype._eventMove = function(e) {
        const that = this._data;
        let page;
        for (page in that.pages) {
            if (self.has(page, that.pages)) {
                that.pages[page].flip("_pageMove", e);
            }
        }
        if (that.finger) {
            const prev = $.extend({}, that.finger);
            if (!that.tmpListeners) {
                that.tmpListeners = {};
                that.tmpListeners.tap = self.getListeners(this.$el, "tap", true);
                that.tmpListeners.doubleTap = self.getListeners(this.$el, "doubleTap", true);
            }
            that.finger = self.eventPoint(e);
            that.finger.prev = prev;
        }
    };

    that.prototype._eventRelease = function(deepDataAndEvents) {
        const head = this;
        const data = this._data;
        if (setTimeout(() => {
                if (data.tmpListeners) {
                    self.setListeners(head.$el, "tap", data.tmpListeners.tap);
                    self.setListeners(head.$el, "doubleTap", data.tmpListeners.doubleTap);
                    delete data.tmpListeners;
                }
            }, 1), data.finger) {
            let page;
            for (page in data.pages) {
                if (self.has(page, data.pages)) {
                    data.pages[page].flip("_pageUnpress", deepDataAndEvents);
                }
            }
            delete data.finger;
            if (data.statusHolding) {
                data.statusHolding = false;
                if (!data.statusHover) {
                    this._hasMotionListener(false);
                }
            }
        }
    };

    that.prototype._eventSwipe = function(a) {
        const data = this._data;
        const ok = "" === self.getSelectedText();
        if ("turning" != data.status && (1 == data.zoom && data.hasSelection == ok)) {
            if (data.display == self.DISPLAY_SINGLE) {
                const i = data.page;
                if (a.speed < 0) {
                    if (~$.inArray(data.corner, self.corners.forward)) {
                        this.next();
                    } else {
                        if (data.status = "swiped", data.pages[i].flip("hideFoldedPage", true), i > 1) {
                            const target = data.pages[i - 1].data("f").point;
                            data.pages[i - 1].flip("turnPage", target ? target.corner : "");
                        }
                    }
                } else {
                    if (a.speed > 0) {
                        if (~$.inArray(data.corner, self.corners.backward)) {
                            this.previous();
                        } else {
                            data.status = "swiped";
                            data.pages[i].flip("hideFoldedPage", true);
                        }
                    }
                }
            } else {
                if (data.display == self.DISPLAY_DOUBLE) {
                    if (a.speed < 0) {
                        if (this.isAnimating()) {
                            if (~$.inArray(data.corner, self.corners.forward)) {
                                this.next();
                            }
                        } else {
                            this.next();
                        }
                    } else {
                        if (a.speed > 0) {
                            if (this.isAnimating()) {
                                if (~$.inArray(data.corner, self.corners.backward)) {
                                    this.previous();
                                }
                            } else {
                                this.previous();
                            }
                        }
                    }
                }
            }
        }
    };

    that.prototype._eventHover = function() {
        const data = this._data;
        clearInterval(data.noHoverTimer);
        data.statusHover = true;
        this._hasMotionListener(true);
    };

    that.prototype._eventNoHover = function(datum) {
        const that = this;
        const data = this._data;
        data.noHoverTimer = setTimeout(() => {
            if (!data.statusHolding) {
                that._eventMove(datum);
                that._hasMotionListener(false);
            }
            delete data.noHoverTimer;
            data.statusHover = false;
        }, 10);
    };

    that.prototype._hasMotionListener = function(recurring) {
        const data = this._data;
        if (recurring) {
            if (!data.hasMoveListener) {
                $(document).on("vmousemove", $.proxy(this, "_eventMove")).on("vmouseup", $.proxy(this, "_eventRelease"));
                data.hasMoveListener = true;
            }
        } else {
            if (data.hasMoveListener) {
                $(document).off("vmousemove", this._eventMove).off("vmouseup", this._eventRelease);
                data.hasMoveListener = false;
            }
        }
    };

    that.prototype._position = function(value) {
        const self = this._data;
        const data = value ? this._size(value) : this.size();
        const pos = {
            top: 0,
            left: 0
        };
        if (self.options.responsive && (pos.top = self.viewerHeight / 2 - data.height / 2, pos.left = self.viewerWidth / 2 - data.width / 2)) {
            const cursor = self.margin;
            if (pos.top < cursor[0] || pos.top + data.height > self.viewerHeight - cursor[2]) {
                pos.top = cursor[0];
            }
            if (pos.left < cursor[1] || pos.left + data.width > self.viewerWidth - cursor[3]) {
                pos.left = cursor[3];
            }
        }
        return pos;
    };

    that.prototype._cloneView = function(recurring) {
        const data = this._data;
        if (recurring) {
            let pos;
            let div;
            let page;
            const codeSegments = this.view();
            const r = {};
            const node = $("<div />");
            node.css(self.addCssWithPrefix({
                "@transform-origin": "0% 0%"
            }));
            node.css({
                position: "absolute",
                top: 0,
                left: 0,
                "z-index": 10,
                width: this.$el.width(),
                height: this.$el.height()
            });
            let i = 0;
            for (; i < codeSegments.length; i++) {
                if (codeSegments[i]) {
                    r[codeSegments[i]] = 1;
                }
            }
            for (page in r) {
                if (self.has(page, r)) {
                    pos = this._pageSize(page, true);
                    pos.position = "absolute";
                    pos.zIndex = data.pageWrap[page].css("z-index");
                    div = data.pageObjs[page].clone();
                    div.css(pos);
                    div.appendTo(node);
                }
            }
            node.appendTo(this.$el);
        }
    };

    results.prototype._pageCURL = function(node) {
        let options;
        let top;
        let left;
        let px;
        let size;
        let halfWidth;
        let index;
        let y;
        let tubeRadius;
        let radius;
        let dY;
        let dX;
        let angle;
        const e = this.$el.data("f");
        const data = e.turnData;
        const width = this.$el.width();
        const height = this.$el.height();
        const $ = this;
        let newTime = 0;
        let that = self.point2D(0, 0);
        let rCenter = self.point2D(0, 0);
        let pos = self.point2D(0, 0);
        const deepDataAndEvents = (this._foldingPage(), data.options.acceleration);
        const h = e.clip.height();
        const compute = () => {
            options = $._startPoint(node.corner);
            let angleMid;
            const x = width - options.x - node.x;
            const y = options.y - node.y;
            let angle = Math.atan2(y, x);
            let i = Math.sqrt(x * x + y * y);
            const o = self.point2D(width - options.x - Math.cos(angle) * width, options.y - Math.sin(angle) * width);
            if (i > width) {
                node.x = o.x;
                node.y = o.y;
            }
            const delta = self.point2D(0, 0);
            const diff = self.point2D(0, 0);
            if (delta.x = options.x ? options.x - node.x : node.x, delta.y = self.hasRotation ? options.y ? options.y - node.y : node.y : 0, diff.x = left ? width - delta.x / 2 : node.x + delta.x / 2, diff.y = delta.y / 2, angle = lastAngle - Math.atan2(delta.y, delta.x), angleMid = angle - Math.atan2(diff.y, diff.x), i = Math.sin(angleMid) * Math.sqrt(diff.x * diff.x + diff.y * diff.y), pos = self.point2D(i * Math.sin(angle), i * Math.cos(angle)), angle > lastAngle) {
                if (pos.x = pos.x + Math.abs(pos.y * delta.y / delta.x), pos.y = 0, Math.round(pos.x * Math.tan(PI - angle)) < height) {
                    return (node.y = Math.sqrt(Math.pow(height, 2) + 2 * diff.x * delta.x), top && (node.y = height - node.y), compute());
                }
                const beta = PI - angle;
                const dd = h - height / Math.sin(beta);
                that = self.point2D(Math.round(dd * Math.cos(beta)), Math.round(dd * Math.sin(beta)));
                if (left) {
                    that.x = -that.x;
                }
                if (top) {
                    that.y = -that.y;
                }
            }
            newTime = Math.round(100 * self.deg(angle)) / 100;
            px = Math.round(pos.y / Math.tan(angle) + pos.x);
            const side = width - px;
            let windowHeight = Math.min(height, side * Math.tan(angle));
            if (0 > windowHeight) {
                windowHeight = height;
            }
            const sideX = side * Math.cos(2 * angle);
            const sideY = side * Math.sin(2 * angle);
            if (rCenter = self.point2D(Math.round(left ? side - sideX : px + sideX), Math.round(top ? sideY : height - sideY)), data.options.gradients) {
                const e = $._endPoint(node.corner);
                index = Math.sqrt(Math.pow(e.x - node.x, 2) + Math.pow(e.y - node.y, 2)) / width;
                size = Math.min(100, side * Math.sin(angle));
                halfWidth = 1.3 * Math.min(side, windowHeight);
            }
            return (pos.x = Math.round(pos.x), pos.y = Math.round(pos.y), true);
        };

        const init = (pos, nodeLength, opt_attributes, r) => {
            const f = ["0", "auto"];
            const i = (width - h) * opt_attributes[0] / 100;
            const err = (height - h) * opt_attributes[1] / 100;
            const v = {
                left: f[nodeLength[0]],
                top: f[nodeLength[1]],
                right: f[nodeLength[2]],
                bottom: f[nodeLength[3]]
            };
            const offset = 90 != r && -90 != r ? left ? -1 : 1 : 0;
            const gg = `${opt_attributes[0]}% ${opt_attributes[1]}%`;
            const g = data.pages[e.over].data("f");
            const x = e.clip.parent().position().left - data.pageWrap[e.over].position().left;
            if (e.ipage.css(v).transform(self.rotate(r) + self.translate(pos.x + offset, pos.y, deepDataAndEvents), gg), g.ipage.css(v).transform(self.rotate(r) + self.translate(pos.x + rCenter.x - that.x - width * opt_attributes[0] / 100, pos.y + rCenter.y - that.y - height * opt_attributes[1] / 100, deepDataAndEvents) + self.rotate(Math.round(100 * (180 / r - 2) * r) / 100), gg), e.clip.transform(self.translate(-pos.x + i - offset, -pos.y + err, deepDataAndEvents) + self.rotate(-r), gg), g.clip.transform(self.translate(x -
                    pos.x + that.x + i, -pos.y + that.y + err, deepDataAndEvents) + self.rotate(-r), gg), data.options.gradients) {
                let source;
                let a;
                let m;
                if (top) {
                    if (left) {
                        a = r - 90;
                        m = px - 50;
                        size = -size;
                        source = "50% 25%";
                    } else {
                        a = r - 270;
                        m = width - px - 50;
                        source = "50% 25%";
                    }
                } else {
                    if (left) {
                        m = px - 50;
                        a = r - 270;
                        size = -size;
                        source = "50% 75%";
                    } else {
                        m = width - px - 50;
                        a = r - 90;
                        source = "50% 75%";
                    }
                }
                let change = Math.max(0.5, 2 - index);
                if (change > 1) {
                    change = change >= 1.7 ? (2 - change) / 0.3 : 1;
                }
                g.igradient.css({
                    opacity: Math.round(100 * change) / 100
                }).transform(self.translate(m, 0, deepDataAndEvents) + self.rotate(a) + self.scale(size / 100, 1, deepDataAndEvents), source);
                if (top) {
                    if (left) {
                        a = -270 - r;
                        halfWidth = -halfWidth;
                        m = width - px - 20;
                        source = "20% 25%";
                    } else {
                        a = -90 - r;
                        m = px - 20;
                        source = "20% 25%";
                    }
                } else {
                    if (left) {
                        a = -90 - r;
                        m = width - px - 20;
                        halfWidth = -halfWidth;
                        source = "20% 75%";
                    } else {
                        a = 90 - r;
                        m = px - 20;
                        source = "20% 75%";
                    }
                }
                change = 0.3 > index ? index / 0.3 : 1;
                e.ogradient.css({
                    opacity: Math.round(100 * change) / 100
                }).transform(self.translate(m, 0, deepDataAndEvents) + self.rotate(a) + self.scale(-halfWidth / 100, 1, deepDataAndEvents), source);
            }
        };
        switch (e.point = self.peelingPoint(node.corner, node.x, node.y), node.corner) {
            case "l":
                dY = node.y - e.startPoint.y;
                dX = node.x;
                angle = Math.atan2(dY, dX);
                if (angle > 0) {
                    y = e.startPoint.y;
                    tubeRadius = Math.sqrt(dX * dX + dY * dY);
                    radius = 2 * y * Math.sin(angle) + tubeRadius;
                    node.x = radius * Math.cos(angle);
                    node.y = radius * Math.sin(angle);
                    node.corner = "tl";
                    left = true;
                    top = true;
                    compute();
                    init(pos, [1, 0, 0, 1], [100, 0], newTime);
                } else {
                    angle = -angle;
                    y = height - e.startPoint.y;
                    tubeRadius = Math.sqrt(dX * dX + dY * dY);
                    radius = 2 * y * Math.cos(lastAngle - angle) + tubeRadius;
                    node.x = radius * Math.cos(angle);
                    node.y = height - radius * Math.sin(angle);
                    node.corner = "bl";
                    left = true;
                    compute();
                    init(self.point2D(pos.x, -pos.y), [1, 1, 0, 0], [100, 100], -newTime);
                }
                break;
            case "r":
                dY = e.startPoint.y - node.y;
                dX = width - node.x;
                angle = Math.atan2(dY, dX);
                if (0 > angle) {
                    y = e.startPoint.y;
                    angle = -angle;
                    tubeRadius = Math.sqrt(dX * dX + dY * dY);
                    radius = 2 * y * Math.sin(angle) + tubeRadius;
                    node.x = width - radius * Math.cos(angle);
                    node.y = radius * Math.sin(angle);
                    node.corner = "tr";
                    top = true;
                    compute();
                    init(self.point2D(-pos.x, pos.y), [0, 0, 0, 1], [0, 0], -newTime);
                } else {
                    y = height - e.startPoint.y;
                    tubeRadius = Math.sqrt(dX * dX + dY * dY);
                    radius = 2 * y * Math.cos(lastAngle - angle) + tubeRadius;
                    node.x = width - radius * Math.cos(angle);
                    node.y = height - radius * Math.sin(angle);
                    node.corner = "br";
                    compute();
                    init(self.point2D(-pos.x, -pos.y), [0, 1, 1, 0], [0, 100], newTime);
                }
                break;
            case "tl":
                top = true;
                left = true;
                node.x = Math.max(node.x, 1);
                e.point.x = node.x;
                options = this._startPoint("tl");
                compute();
                init(pos, [1, 0, 0, 1], [100, 0], newTime);
                break;
            case "tr":
                top = true;
                node.x = Math.min(node.x, width - 1);
                e.point.x = node.x;
                compute();
                init(self.point2D(-pos.x, pos.y), [0, 0, 0, 1], [0, 0], -newTime);
                break;
            case "bl":
                left = true;
                node.x = Math.max(node.x, 1);
                e.point.x = node.x;
                compute();
                init(self.point2D(pos.x, -pos.y), [1, 1, 0, 0], [100, 100], -newTime);
                break;
            case "br":
                node.x = Math.min(node.x, width - 1);
                e.point.x = node.x;
                compute();
                init(self.point2D(-pos.x, -pos.y), [0, 1, 1, 0], [0, 100], newTime);
        }
    };

    self.widgetFactory("turn", that);
    self.widgetFactory("flip", results);

})(jQuery, this, document);