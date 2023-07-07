
function exponentialFormat(num, precision, mantissa = true) {
    let e = num.log10().floor()
    if (options.notation == "engineering") e = e.div(3).floor().mul(3);
    let m = num.div(Decimal.pow(10, e))
    if (m.toStringWithDecimalPlaces(precision) == 10) {
        m = decimalOne
        e = e.add(1)
    }
    e = (e.gte(1e9) ? format(e, 3) : (e.gte(10000) ? commaFormat(e, 0) : e.toStringWithDecimalPlaces(0)))
    if (mantissa)
        return sigFormat(m, precision) + "e" + e
    else return "e" + e
}

function commaFormat(num, precision) {
    if (num === null || num === undefined) return "NaN"
    if (num.mag < 0.001) return (0).toFixed(precision)
    let init = num.toStringWithDecimalPlaces(precision)
    let portions = init.split(".")
    portions[0] = portions[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
    if (portions.length == 1) return portions[0]
    return portions[0] + "." + portions[1]
}

function sigFormat(num, precision) {
    if (num === null || num === undefined) return "NaN"
    if (num.mag < 0.001) return (0).toFixed(precision)
    return regularFormat(num, Math.max(precision - Math.floor(num.log10().toNumber()), 0))
}

function regularFormat(num, precision) {
    if (num === null || num === undefined) return "NaN"
    if (num.mag < 0.0001) return (0).toFixed(precision)
    if (num.mag < 0.1 && precision !==0) precision = Math.max(precision, 4)
    return num.toStringWithDecimalPlaces(precision)
}

function fixValue(x, y = 0) {
    return x || new Decimal(y)
}

function sumValues(x) {
    x = Object.values(x)
    if (!x[0]) return decimalZero
    return x.reduce((a, b) => Decimal.add(a, b))
}

function format(decimal, precision = 2, small) {
    small = small || modInfo.allowSmall
    decimal = new Decimal(decimal)
    if (!Number.isFinite(decimal.mag)) return decimal.toString();

    const precision2 = Math.max(precision, 3);
    
    if (decimal.abs().lt(1e-308)) return (0).toFixed(precision);
    if (decimal.sign < 0) return "-" + format(decimal.neg(), precision);
    if (decimal.lt("0.0001") && small) return format(decimal.rec(), precision) + "⁻¹";
    if (decimal.lt(1)) return regularFormat(decimal, precision + (small ? 2 : 0));
    if (decimal.lt(1000)) return regularFormat(decimal, precision);
    if (decimal.lt(1e9)) return commaFormat(decimal, 0);
    
    if (options.notation == "standard") {
        if (decimal.lt("eeee45")) {
            let tiers = [
                (tier, inh) => {
                    let ones = ["K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"]
                    let tens = ["", "Dc", "Vg", "Tg", "Qr", "Qq", "Sg", "St", "Og", "Ng"]
                    let hundreds = ["", "Ce", "Dn", "Tc", "Qe", "Qu", "Sc", "Se", "Oe", "Ne"]
    
                    if (inh) ones = ["", "", "D", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"]
                    if (inh == 2) ones = ["", "U", "D", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"]
    
                    const o = tier % 10; t = Math.floor(tier / 10) % 10; h = Math.floor(tier / 100) % 10
    
                    if (t == 0 && h == 0) {
                        return ones[o]
                    }
    
                    ones = ["", "U", "D", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"]
    
                    return ones[o] + tens[t] + hundreds[h]
                }, 
                (tier, inh) => {
                    let ones = ["", "Mi", "Mc", "Na", "Pc", "Fe", "At", "Z", "Y", "X"]
                    let tens = ["", "C", "Ic", "Ti", "Tr", "Pt", "Hx", "Hp", "Ot", "En"]
                    let hundreds = ["", "H", "Dh", "Th", "Trh", "Ph", "Hxh", "Hph", "Oh", "Eh"]
    
                    const o = tier % 10; t = Math.floor(tier / 10) % 10; h = Math.floor(tier / 100) % 10
    
                    if (t == 0 && h == 0) {
                        return ones[o]
                    }
    
                    ones = ["", "Me", "De", "Ti", "Tr", "Pt", "Hx", "Hp", "Ot", "En"]
    
                    if (t == 1) ones[0] = "V"
    
                    return ones[o] + tens[t] + hundreds[h]
                }, 
                (tier, inh) => {
                    let ones = ["", "Ki", "Me", "Gi", "Te", "Pe", "Ex", "Zt", "Yt", "Xe"]
                    let tens = ["", "Dk", "Ik", "Trk", "Tk", "Pk", "Ek", "Zk", "Yk", "Nk"]
                    let hundreds = ["", "Ht", "Bt", "Trt", "Tt", "Pot", "Et", "Ze", "Yo", "Nt"]
    
                    const o = tier % 10; t = Math.floor(tier / 10) % 10; h = Math.floor(tier / 100) % 10
    
                    if (t == 0 && h == 0) {
                        return ones[o]
                    }
    
                    if (t == 1) ones = ["", "He", "Do", "Ta", "Te", "Pe", "Ex", "Ze", "Yo", "Ne"]
                    else ones = ["", "En", "Da", "Ta", "Te", "Pe", "Ec", "Ze", "Yo", "Xe"]
    
                    return ones[o] + tens[t] + hundreds[h]
                },
                (tier, inh) => {
                    return ["Al", "Ej", "Ij", "St", "Un", "Em", "Ov", "Ol", "Et", "Lc", "Ax", "Up", "Es", "Ut"][tier]
                },, 
            ]
    
            let prefix = decimal.log10().div(3).sub(1).floor()
            let tier = 0
    
            while (prefix.gt("e90")) {
                prefix = prefix.log10().floor()
                tier++
            }
            
            let prefix2 = prefix.log10().div(3).floor()
    
            let str = (tier == 0 && prefix < 1e6 ? sigFormat(decimal.div(Decimal.pow(1000, prefix.add(1))), precision2, true) : "1") 
                + " " + tiers[tier](prefix.div(Decimal.pow(1000, prefix2)).floor() % 1000, prefix2 >= 1) + tiers[tier+1](prefix2)
    
            while (prefix.gt(0) && prefix2.gt(0) && str.length < 8) {
                prefix = new Decimal(prefix % new Decimal.pow(1000, prefix2))
                prefix2 = prefix2.sub(1)
                if (prefix.gte(1)) str += "-" + tiers[tier](prefix.div(new Decimal.pow(1000, prefix2)).floor() % 1000, 2) + tiers[tier+1](prefix2)
            }
    
            return str
        }
    } else if (options.notation == "letters") {
        let alphabet = "abcdefghijklmnopqrstuvwxysz";
        let tier = decimal.log10().div(3).sub(1).floor();
        if (tier.lt((1 - alphabet.length ** 4) / (1 - alphabet.length) - 1)) {
            let base = sigFormat(decimal.div(Decimal.pow(1000, tier.add(1))), precision2)
            let str = "";
            tier = tier.toNumber();
            while (tier >= 0) {
                str = alphabet[tier % alphabet.length] + str;
                tier = Math.floor(tier / alphabet.length) - 1;
            }
            return base + str;
        }
    }

    if (decimal.lt("1e10000")) return exponentialFormat(decimal, precision2)
    if (decimal.lt("1e1000000")) return exponentialFormat(decimal, 0)
    if (decimal.lt("ee9")) return exponentialFormat(decimal, 0, false)

    var slog = decimal.slog()
    if (slog.gte(1e6)) return "F" + format(slog.floor())
    else return Decimal.pow(10, slog.sub(slog.floor())).toStringWithDecimalPlaces(precision2) + "F" + commaFormat(slog.floor(), 0)
}

function formatWhole(decimal) {
    decimal = new Decimal(decimal)
    if (decimal.gte(1e9)) return format(decimal, 2)
    if (decimal.lte(0.99) && !decimal.eq(0)) return format(decimal, 2)
    return format(decimal, 0)
}

function formatTime(s) {
    if (s < 60) return format(s) + "s"
    else if (s < 3600) return formatWhole(Math.floor(s / 60)) + "m " + format(s % 60) + "s"
    else if (s < 86400) return formatWhole(Math.floor(s / 3600)) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else if (s < 31536000) return formatWhole(Math.floor(s / 86400) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
    else return formatWhole(Math.floor(s / 31536000)) + "y " + formatWhole(Math.floor(s / 86400) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
}

function formatClock(s) {
    let ans = formatWhole(Math.floor(s / 60 % 60)) + ":" + formatWhole(Math.floor(s % 60)).padStart(2, "0");
    if (s >= 3600) ans = formatWhole(s / 3600) + ":" + (Math.floor(s / 60 % 60) < 10 ? "0" : "") + ans;
    return ans;
}


function toPlaces(x, precision, maxAccepted) {
    x = new Decimal(x)
    let result = x.toStringWithDecimalPlaces(precision)
    if (new Decimal(result).gte(maxAccepted)) {
        result = new Decimal(maxAccepted - Math.pow(0.1, precision)).toStringWithDecimalPlaces(precision)
    }
    return result
}

// Will also display very small numbers
function formatSmall(x, precision=2) { 
    return format(x, precision, true)    
}

function invertOOM(x){
    let e = x.log10().ceil()
    let m = x.div(Decimal.pow(10, e))
    e = e.neg()
    x = new Decimal(10).pow(e).times(m)

    return x
}