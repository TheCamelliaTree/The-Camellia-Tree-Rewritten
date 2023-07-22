function addCommas(s){
    if (s.length <= 3) return s
    let rem = s.length % 3
    if (rem == 0) rem = 3
    return s.slice(0, rem) + "," + addCommas(s.slice(rem))
}

function exponentialFormat(num, precision) {
    let e = num.log10().floor()
    if (player.notation == 'Engineering') e = num.log10().div(3).floor().mul(3)
    let m = num.div(Decimal.pow(10, e))
    if (player.notation == 'Engineering') {
        if (m.toStringWithDecimalPlaces(precision) == 1000) {
            m = new Decimal(1)
            e = e.add(3)
        }
        if (e.lt(0)) {
            m = m.mul(1e3)
            e = e.sub(3)
        }
    }
    else {
        if (m.toStringWithDecimalPlaces(precision) == 10) {
            m = new Decimal(1)
            e = e.add(1)
        }
        if (e.lt(0)) {
            m = m.mul(10)
            e = e.sub(1)
        }
    }
    let start = ""
    if (e.abs().lt(1e9)) {
        if (player.notation == 'Engineering' || player.notation == 'Mixed Engineering') {
            if (m.toStringWithDecimalPlaces(precision) == 1000) {
                m = new Decimal(1)
                e = e.add(3)
            }
        }
        else {
            if (m.toStringWithDecimalPlaces(precision) == 10) {
                m = new Decimal(1)
                e = e.add(1)
            }
        }
        start = m.toStringWithDecimalPlaces(precision)
    }

    let end = e.toStringWithDecimalPlaces(0)
    if (!end.includes("e")) end = addCommas(end.replace(/-/g, ''))
    if (e.lt(0)) end = "-"+end
    return start + "e" + end
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

function t1format(x,mult=false,y) {
    let ills = ['K','M','B','T','q','Q','s','S','O','N']
    let t1ones = ["","U","D","T","q","Q","s","S","O","N"]
    if (mult && y>0 && x<10) t1ones = ["","","D","T","q","Q","s","S","O","N"]
    let t1tens = ["","Dc","Vi","Tr","Qd","Qt","Sx","Sp","Oc","No"]
    let t1hunds = ["","Ce","Dn","Te","Qa","Qi","Se","St","Oe","Ne"]
    let t1f = ills[x]
    if (mult && y>0) t1f = t1ones[x]
    if (x>=10) t1f = t1ones[x%10]+t1tens[Math.floor(x/10)%10]+t1hunds[Math.floor(x/100)]
    return t1f
}

function t2format(x,mult=false,y) {
    let t2ills = ["","Mi","Mc","Na","Pi","Fm","At","Ze","Yo","Xo"]
    let t2ones = ["","Mei","Due","Tre","Tet","Pen","Hex","Hep","Oct","Ene"]
    if (mult && y>0 && x<10) t2ones = ["","","Mc","Na","Pi","Fm","At","Ze","Yo","Xo"]
    let t2tens = ["","c","Ic","Tri","Tec","Pec","Hec","Hpc","Otc","Ena"]
    let t2hunds = ["","Hc","Dh","Trh","Teh","Peh","Heh","Hph","Oth","Enh"]
    let t2f = t2ills[x]
    if (mult && y>0) t2f = t2ones[x]
    let t2t = t2tens[Math.floor(x/10)%10]
    if (x%100==10) t2t='Vc'
    if (x>=10) t2f = t2ones[x%10]+t2t+t2hunds[Math.floor(x/100)]
    return t2f
}

function t3format(x,mult=false,y,z) {
    let t3ills = ["","Kil","Meg","Gig","Ter","Pet","Exi","Zet","Yot","Xen"]
    let t3ones = ["","eN","oD","tR","tE","pT","eX","zE","yO","xN"]
    let t3tns = ["Dak","Hen","Dok","Tra","Ted","Ped","Exd","Zed","Yod","Ned"]
    let t3to = ["k","k","c","c","c","k","k","c","k","c"]
    if (mult && y>0 && x<10) t3ones = ["","","D","Tr","T","P","Ex","Z","Y","N"]
    let t3tens = ["","","I","Tr","Te","P","E","Z","Y","N"]
    let t3hunds = ["","Hot","Bot","Trot","Tot","Pot","Exot","Zot","Yoot","Not"]
    let t3f = t3ills[x]
    if ((mult && y>0) || z>=1e3) t3f = t3ones[x]
    let t3t = t3tens[Math.floor(x/10)%10]
    let t3h = t3hunds[Math.floor(x/100)]
    if (x%100==0) t3h+='T'
    if (x%100<20&&x%100>9) t3t = t3tns[x%10]
    if (x%100>19) t3t += t3to[x%10]+t3ones[x%10]
    if (x>=10) t3f = t3h+t3t
    return t3f
}

function t4format(x,m) {
    let t4ills = ["","aL","eJ","iJ","AsT","uN","rM","oV","oL","eT","O","aX","uP","rS","lT","eT","eN","yP","rC","lR","mN","rA","uC","olT","rieV","esoN","emP","esT","entI","otaE","ameL","eglE","hI","obA","akU","auR","ikU","enkI","atA","amI","uzU","aG"] //eT is the start of the extending, beginning at 10^10^10^45. Currently at 10^10^10^123 (Lagillion). Previous extensions: 10^10^10^120 (Suzumillion), 10^10^10^117 (Namillion), 10^10^10^114 (Matatabillion), 10^10^10^111 (Genkillion) 10^10^10^108 (Mikuillion), 10^10^10^105 (Laurillion), 10^10^10^102 (Sakuzillion), 10^10^10^99 (Kobarillion), 10^10^10^96 (Phigrillion), 10^10^10^93 (Aeglesillion), 10^10^10^90 (Camellillion), 10^10^10^87 (Rotaenillion), 10^10^10^84 (Pentimentillion), 10^10^10^81 (Testifillion) 10^10^10^78 (Tempestillion), 10^10^10^75 (Resonillion) 10^10^10^72 (Grievillion), 10^10^10^69 (nice)(Voltillion), 10^10^10^66 (Yucillion), 10^10^10^63 (Fractillion), 10^10^10^60 (Omnillion), Ultrillion (10^10^10^57), Archillion (10^10^10^54), Hyperillion (10^10^10^51), Xenoillion (10^10^10^48), Metaillion (10^10^10^45)
    let t4m = ["","K","M","G","","L","F","J","S","B","Gl","G","S","V","M","M","X","H","A","U","O","F","Y","V","G","R","T","T","P","R","C","A","P","K","S","L","M","G","M","N","S","L"]
    let t4f = t4ills[x]
    if (m<2) t4f = t4m[x]+t4f
    return t4f
}

function format(decimal, precision = 2, small) {
    small = small || modInfo.allowSmall
    decimal = new Decimal(decimal)
    if (isNaN(decimal.sign) || isNaN(decimal.layer) || isNaN(decimal.mag)) {
        player.hasNaN = true;
        return "NaN"
    }
    if (decimal.sign < 0) return "-" + format(decimal.neg(), precision, small)
    if (decimal.mag == Number.POSITIVE_INFINITY) return "Infinity"
    if (decimal.gte("eeeee1000")) {
        var slog = decimal.slog()
        if (slog.gte(1e6)) return "F" + format(slog.floor())
        else return Decimal.pow(10, slog.sub(slog.floor())).toStringWithDecimalPlaces(3) + "F" + commaFormat(slog.floor(), 0)
    }
    else if (decimal.gte("1e1000000")) return exponentialFormat(decimal, 0, false)
    else if (decimal.gte("1e10000")) return exponentialFormat(decimal, 0)
    else if (decimal.gte(1e12)) return exponentialFormat(decimal, precision)
    else if (decimal.gte(1e3)) return commaFormat(decimal, 0)
    else if (decimal.gte(0.0001) || !small) return regularFormat(decimal, precision)
    else if (decimal.eq(0)) return (0).toFixed(precision)

    decimal = invertOOM(decimal)
    let val = ""
    if (decimal.lt("1e1000")){
        val = exponentialFormat(decimal, precision)
        return val.replace(/([^(?:e|F)]*)$/, '-$1')
    }
    else   
        return format(decimal, precision) + "⁻¹"

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

function toPlaces(x, precision, maxAccepted) {
    x = new Decimal(x)
    let result = x.toStringWithDecimalPlaces(precision)
    if (new Decimal(result).gte(maxAccepted)) {
        result = new Decimal(maxAccepted - Math.pow(0.1, precision)).toStringWithDecimalPlaces(precision)
    }
    return result
}

function format(decimal, precision=3) {
    decimal = new Decimal(decimal)
    if (player.notation == 'Standard') {
        return standard(decimal, precision)
    }
    else return formatSciEng(decimal, precision)
}
function standard(decimal, precision){
	decimal = new Decimal(decimal)
	if (decimal.sign < 0) return "-"+standard(decimal.neg(), precision)
	if (decimal.layer > 4 || (decimal.mag > Math.log10(3e123) && decimal.layer == 4)) {
		var slog = decimal.slog()
		if (slog.gte(1e9)) return "F" + formatWhole(slog.floor())
		if (slog.gte(100)) return Decimal.pow(10, slog.sub(slog.floor())).toStringWithDecimalPlaces(3) + "F" + commaFormat(slog.floor(), 0)
		else return Decimal.pow(10, slog.sub(slog.floor())).toStringWithDecimalPlaces(4) + "F" + commaFormat(slog.floor(), 0)
	}
	let illion = decimal.log10().div(3).floor().sub(1)
	let m = decimal.div(Decimal.pow(1e3,illion.add(1)))
	if (m.toStringWithDecimalPlaces(precision) == 1000) {
		m = new Decimal(1)
		illion = illion.add(1)
	}
	if (decimal.log10().lt(1e9)) m = m.toStringWithDecimalPlaces(precision)+' '
	else m = ''
	let t2illion = illion.max(1).log10().div(3).floor()
	let t3illion = t2illion.max(1).log10().div(3).floor()
	let t4illion = t3illion.max(1).log10().div(3).floor()
	let t1 = illion.div(Decimal.pow(1e3,t2illion.sub(2))).floor().toNumber()
	if (illion.lt(1e3)) t1 = illion.toNumber()
	let t2 = t2illion.div(Decimal.pow(1e3,t3illion.sub(2))).floor().toNumber()
	if (t2illion.lt(1e3)) t2 = t2illion.toNumber()
	let t3 = t3illion.div(Decimal.pow(1e3,t4illion.sub(2))).floor().toNumber()
	if (t3illion.lt(1e3)) t3 = t3illion.toNumber()
	let t4 = t4illion.toNumber()
	let st = t1format(t1)
	if (illion.gte(1e3)) st = t1format(Math.floor(t1/1e6),true,t2)+t2format(t2)+((Math.floor(t1/1e3)%1e3>0)?('-'+t1format(Math.floor(t1/1e3)%1e3,true,t2-1)+t2format(t2-1)):'')
	if (illion.gte(1e6)) st += ((t1%1e3>0)?('-'+t1format(t1%1e3,true,t2-2)+t2format(t2-2)):'')
	if (t2illion.gte(1e3)) st = t2format(Math.floor(t2/1e6),true,t3)+t3format(t3)+((Math.floor(t2/1e3)%1e3>0)?("a'-"+t2format(Math.floor(t2/1e3)%1e3,true,t3-1)+t3format(t3-1)):'')
	if (t2illion.gte(1e6)) st += ((t2%1e3>0)?("a'-"+t2format(t2%1e3,true,t3-2)+t3format(t3-2)):'')
	if (t3illion.gte(1e3)) st = t3format(Math.floor(t3/1e6),true,t4)+t4format(t4,Math.floor(t3/1e6))+((Math.floor(t3/1e3)%1e3>0)?("`-"+t3format(Math.floor(t3/1e3)%1e3,true,t4-1,t3)+t4format(t4-1,Math.floor(t3/1e3)%1e3)):'')
	if (t3illion.gte(1e6)) st += ((t3%1e3>0)?("`-"+t3format(t3%1e3,true,t4-2,t3)+t4format(t4-2,t3%1e3)):'')
	if (decimal.mag >= 1e9 || (decimal.layer>0 && decimal.mag>=0))return m+st
	if (decimal.mag >= 1e3) return commaFormat(decimal, 0)
	if (decimal.mag >= 0.001) return regularFormat(decimal, precision)
	if (decimal.sign!=0) return '1/'+standard(decimal.recip(),precision)
	return regularFormat(decimal, precision)
}

function formatSciEng(decimal, precision) {
        decimal = new Decimal(decimal)
        if (isNaN(decimal.sign)||isNaN(decimal.layer)||isNaN(decimal.mag)) {
            player.hasNaN = true;
            console.log(decimal)
            Decimal(0)
            for (i in player){
                if (player[i] == undefined) continue
                if (player[i].points != undefined) {
                    if (isNaN(player[i].points.mag)) console.log(i + "'s points are NaN")
                }
            }
    
            return "NaN"
        }
        if (player.notation == 'Mixed Scientific' || player.notation == 'Mixed Engineering'){
            if (decimal.layer < 1 || (Math.abs(decimal.mag) < 63 && decimal.layer == 1)) return standard(decimal,precision)
        }
        if (decimal.sign < 0) return "-"+format(decimal.neg(), precision)
        if (decimal.mag<0) {
            if (decimal.layer > 3 || (decimal.mag < -1e10 && decimal.layer == 3)) return "1/" + format(decimal.recip(), precision)
            else exponentialFormat(decimal, precision)
        }
        if (decimal.mag == Number.POSITIVE_INFINITY) return "Infinity"
         if (decimal.layer > 2 || (Math.abs(decimal.mag) > 308 && decimal.layer == 2)) {
            return "e" + format(decimal.log10(), precision)
        } else if (decimal.layer > 1 || (Math.abs(decimal.mag) >= 1e12 && decimal.layer == 1)) {
            return "e" + format(decimal.log10(), 4)
        } else if (decimal.layer > 0 || decimal.mag >= 1e9) {
            return exponentialFormat(decimal, precision)
        } else if (decimal.mag >= 1000) {
            return commaFormat(decimal, 0)
        } else if (decimal.mag>=0.001) {
            return regularFormat(decimal, precision)
        } else if (decimal.sign!=0) {
            return exponentialFormat(decimal, precision)
        } else return regularFormat(decimal, precision)
    }
// Will also display very small numbers
function formatSmall(x, precision=3) { 
    return format(x, precision, true)    
}

function invertOOM(x){
    let e = x.log10().ceil()
    let m = x.div(Decimal.pow(10, e))
    e = e.neg()
    x = new Decimal(10).pow(e).times(m)

    return x
}