var layoutInfo = {
    startTab: "none",
    startNavTab: "tree-tab",
	showTree: true,

    treeLayout: ""

    
}


// A "ghost" layer which offsets other layers in the tree
addNode("blank", {
    layerShown: "ghost",
}, 
)

addLayer("tree-tab", {
    requirements(){
        let req = []
        for(i=0;i<player.currencies.length;i++){
            if (player.devSpeed >> 1) req[i] = new Decimal("1e3000000").mul(Decimal.pow(1.05, i))
            else req[i] = new Decimal(100).mul(Decimal.pow(1.05, i))
        }
        return req
    },
        update(diff){
        for(i=0;i<player.currencies.length;i++){
            if(player.currencies[i][0].gte(1)) player.currencies[new Decimal(i+1).min(player.currencies.length-1)][2]=true
            player.currencies[i][3] = player.currencies[i][3].max(player.currencies[i][0])
        }
        if(player.points.gte(tmp["tree-tab"].requirements[0])){
            player.points = new Decimal(0)
            let gain = new Decimal(1)
            for(i=1;i<player.currencies.length;i++){
                gain = gain.mul(player.currencies[i][0].mul(0.1).max(1))
            }
            player.currencies[0][0] = player.currencies[0][0].add(gain)
        }
        for(i=0;i<player.currencies.length-1;i++){
            if(player.currencies[i][0].gte(tmp["tree-tab"].requirements[i+1])){
                let gain = new Decimal(1)
                for(v=i+1;v<player.currencies.length-1;v++){
                    gain = gain.mul(new Decimal(player.currencies[v+1][0]).add(1))
                }
                for(let w=0;w<i+1;w++){
                    player.currencies[w][0] = new Decimal(0)
                }
                player.currencies[i+1][0] = player.currencies[i+1][0].add(gain)
            }
        }
        for(i=0;i<player.currencies.length-1;i++){
            player.currencies[i][0] = player.currencies[i][0].add(player.currencies[i+1][0].mul(diff))
          }
    },
    tabFormat: {
        "Resources": {
            content: [["display-text", function(){
                let thing = `<h1>Points: ${format(player.points)}`
                for(i=0;i<player.currencies.length;i++){
                    if(player.currencies[i][2] && i==0) thing = thing+`<br>Multi: ${format(player.currencies[i][0])}`
                    else if(player.currencies[i][2]) thing = thing+`<br>${player.currencies[i][1]}s: ${format(player.currencies[i][0])}`
                }
                return thing
                }]]
        },
        "Requirement List": {
            content: [["display-text", function(){
                let desc = `<h3>Each next currency requires 1.05x more resource to obtain<br><br></h3>`
                for(i=0;i<player.currencies.length;i++){
                    if(player.currencies[new Decimal(i).max(0)][2]){
                        if(i==0) {desc = desc+`<h2>Multi: ${formatWhole(tmp["tree-tab"].requirements[0])} Points <br>`}
                        else if (i==1){desc = desc+`<h2>${player.currencies[i][1]}: ${formatWhole(tmp["tree-tab"].requirements[i])} Multi <br>`}
                        else {desc = desc+`<h2>${player.currencies[i][1]}: ${formatWhole(tmp["tree-tab"].requirements[i])} ${player.currencies[i-1][1]}s <br>`}
                    }
                }
                return desc
            }]]
        },
    },
    previousTab: "",
    leftTab: true,
})