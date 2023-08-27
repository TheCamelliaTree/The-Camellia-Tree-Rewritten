doReset(resettingLayer); {
    if (layers[resettingLayer].row <= this.row) return;
    let keptUpgrades = []
    if ((layers[resettingLayer].row == 1) && hasMilestone('b', 0)) keptUpgrades.push(11)
    let keep = [];
    layerDataReset(this.layer, keep);
    player[this.layer].upgrades.push(keptUpgrades)
  }