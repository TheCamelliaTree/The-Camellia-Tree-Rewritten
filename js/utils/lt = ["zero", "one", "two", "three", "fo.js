lt = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"], pt = ["", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"], st = [["", "un", "duo", "tre", "quattuor", "quin", "se", "septe", "octo", "nove"], ["", "deci", "viginti", "triginta", "quadraginta", "quinquaginta", "sexaginta", "septuaginta", "octoginta", "nonaginta"], ["", "centi", "ducenti", "trecenti", "quadringenti", "quingenti", "sescenti", "septingenti", "octingenti", "nongenti"]], ht = ["", "milli-", "micro-", "nano-", "pico-", "femto-", "atto-", "zepto-", "yocto-", "xono-", "veco-", "meco-", "dueco-", "treco-", "tetreco-", "penteco-", "hexeco-", "hepteco-", "octeco-", "enneco-", "icoso-", "meicoso-", "dueicoso-", "trioicoso-", "tetreicoso-", "penteicoso-", "hexeicoso-", "hepteicoso-", "octeicoso-", "enneicoso-", "triaconto-", "metriaconto-", "duetriaconto-", "triotriaconto-", "tetretriaconto-", "pentetriaconto-", "hexetriaconto-", "heptetriaconto-", "octtriaconto-", "ennetriaconto-", "tetraconto-", "metetraconto-", "duetetraconto-", "triotetraconto-", "tetretetraconto-", "pentetetraconto-", "hexetetraconto-", "heptetetraconto-", "octetetraconto-", "ennetetraconto-", "pentaconto-", "mepentaconto-", "duepentaconto-", "triopentaconto-", "tetrepentaconto-", "pentepentaconto-", "hexepentaconto-", "heptepentaconto-", "octepentaconto-", "ennepentaconto-", "hexaconto-", "mehexaconto-", "duehexaconto-", "triohexaconto-", "tetrehexaconto-", "pentehexaconto-", "hexehexaconto-", "heptehexaconto-", "octehexaconto-", "ennehexaconto-", "heptaconto-", "meheptaconto-", "dueheptaconto-", "trioheptaconto-", "tetreheptaconto-", "penteheptaconto-", "hexeheptaconto-", "hepteheptaconto-", "octeheptaconto-", "enneheptaconto-", "octaconto-", "meoctaconto-", "dueoctaconto-", "triooctaconto-", "tetreoctaconto-", "penteoctaconto-", "hexeoctaconto-", "hepteoctaconto-", "octeoctaconto-", "enneoctaconto-", "ennaconto-", "meennaconto-", "dueeennaconto-", "trioennaconto-", "tetreennaconto-", "penteennaconto-", "hexeennaconto-", "hepteennaconto-", "octeennaconto-", "enneennaconto-", "hecto-", "mehecto-", "duehecto-"], mt = function(t) {
        function e() {
            return null !== t && t.apply(this, arguments) || this
        }
        return n.__extends(e, t),
        Object.defineProperty(e.prototype, "name", {
            get: function() {
                return "English"
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "negativeInfinite", {
            get: function() {
                return "an infinitely large negative number"
            },
            enumerable: !1,
            configurable: !0
        }),
        Object.defineProperty(e.prototype, "infinite", {
            get: function() {
                return "an infinitely large positive number"
            },
            enumerable: !1,
            configurable: !0
        }),
        e.prototype.formatNegativeVerySmallDecimal = function(t, e) {
            return "negative one ".concat(this.formatDecimal(t.reciprocal(), e).replace(/ /g, "-").replace("--", "-"), "th")
        }
        ,
        e.prototype.formatVerySmallDecimal = function(t, e) {
            return "one ".concat(this.formatDecimal(t.reciprocal(), e).replace(/ /g, "-").replace("--", "-"), "th")
        }
        ,
        e.prototype.formatNegativeUnder1000 = function(t, e) {
            return "negative ".concat(this.formatDecimal(new r.default(t), e))
        }
        ,
        e.prototype.formatUnder1000 = function(t, e) {
            return this.formatDecimal(new r.default(t), e)
        }
        ,
        e.prototype.formatNegativeDecimal = function(t, e) {
            return "negative ".concat(this.formatDecimal(t, e))
        }
        ,
        e.prototype.formatDecimal = function(t, e) {
            if (t.eq(0))
                return "zero";
            if (t.lte(.001))
                return this.formatVerySmallDecimal(t, e);
            var n = function(t, e) {
                return u(c(t), e, 1e3, 3)
            }(t, e)
              , o = Math.pow(10, -e);
            if (t.lte(.01))
                return this.formatUnits(t.toNumber() + o / 2, e);
            var r = n.mantissa + o / 2 >= 1e3
              , i = r ? 1 : n.mantissa + o / 2
              , a = n.exponent + (r ? 1 : 0)
              , f = this.formatUnits(i, e)
              , l = this.formatPrefixes(a);
            return "".concat(f, " ").concat(l)
        }
        ,
        e.prototype.formatUnits = function(t, e) {
            var n = []
              , o = t
              , r = Math.pow(10, -e);
            if (t >= 100) {
                var i = Math.floor(t / 100);
                n.push("".concat(lt[i], " hundred")),
                t -= 100 * i
            }
            if (t < 20) {
                t >= 1 && n.length > 0 && n.push("and");
                i = Math.floor(t);
                n.push(t < 1 && o > 1 ? "" : lt[i]),
                t -= i
            } else {
                n.length > 0 && n.push("and");
                i = Math.floor(t / 10);
                n.push(pt[i]),
                t -= 10 * i,
                0 !== (i = Math.floor(t)) && (n.push(lt[i]),
                t -= i)
            }
            if (t >= Math.pow(10, -e) && e > 0) {
                n.push("point");
                for (i = 0; t >= r && i < e; )
                    n.push(lt[Math.floor(10 * t)]),
                    t = 10 * t - Math.floor(10 * t),
                    r *= 10,
                    i++
            }
            return n.filter((function(t) {
                return "" !== t
            }
            )).join(" ")
        }
        ,
        e.prototype.formatPrefixes = function(t) {
            if ((t = Math.floor(t / 3) - 1) <= 3)
                return ["", "thousand", "million", "billion", "trillion"][t + 1];
            for (var e = 0, n = [st[0][t % 10]]; t >= 10; )
                t = Math.floor(t / 10),
                n.push(st[++e % 3][t % 10]);
            for (e = Math.floor(e / 3); n.length % 3 != 0; )
                n.push("");
            for (var o = ""; e >= 0; ) {
                if ("un" !== n[3 * e] || "" !== n[3 * e + 1] || "" !== n[3 * e + 2] || 0 === e) {
                    var r = n[3 * e + 1] + n[3 * e + 2];
                    ["tre", "se"].includes(n[3 * e]) && ["v", "t", "q"].includes(r.substr(0, 1)) && (r = "s".concat(r)),
                    "se" === n[3 * e] && ["c", "o"].includes(r.substr(0, 1)) && (r = "x".concat(r)),
                    ["septe", "nove"].includes(n[3 * e]) && ["v", "o"].includes(r.substr(0, 1)) && (r = "m".concat(r)),
                    ["septe", "nove"].includes(n[3 * e]) && ["d", "c", "t", "q", "s"].includes(r.substr(0, 1)) && (r = "n".concat(r)),
                    o += n[3 * e] + r
                }
                "" === n[3 * e] && "" === n[3 * e + 1] && "" === n[3 * e + 2] || (o += ht[e]),
                e--
            }
            return o = o.replace(/-$/, ""),
            "".concat(o, "illion").replace("i-illion", "illion").replace("iillion", "illion").replace("aillion", "illion").replace("oillion", "illion").replace("eillion", "illion").replace("unillion", "untillion").replace("duillion", "duotillion").replace("trillion", "tretillion").replace("quattuorillion", "quadrillion").replace("quinillion", "quintillion").replace("sillion", "sextillion").replace("novillion", "nonillion")
        }}