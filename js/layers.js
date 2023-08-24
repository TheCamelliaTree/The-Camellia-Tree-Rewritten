addLayer("a", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,
        points: new Decimal(0),
        trina: new Decimal(0),
        bpm: new Decimal(100),
        playingMusic: false                    // You can add more variables here to add them to your layer.
    }},
    color: "#4BDC13",                       // The color for this layer, which affects many elements.
    resource: "Beat Points",            // The name of this layer's main prestige resource.
    row: 0,                                 // The row this layer is on (0 is the first row).
    baseResource: "points",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.
    requires: new Decimal(10),              // The amount of the base needed to  gain 1 of the prestige currency.                                        // Also the amount required to unlock the layer.
    type: "normal",                         // Determines the formula used for calculating prestige currency.
    exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).
    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns the exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
    layerShown() { return true },          // Returns a bool for if this layer's node should be visible in the tree.
    tabFormat: {
        "Upgrades":{
            content: [
                ["display-text", () => "The Current BPM is " + colored("a", format(player.a.bpm)) + " BPM"],
                "prestige-button",
                "blank",
                ["display-text", () => "You have " + colored("a", format(player.a.points)) + " Beat Points"],
                "blank",
                "upgrades",
            ]
        },
    },
    upgrades: {
        11: {
            title: "BPM = BPM + 1",
            description: "The BPM is rapidly esacalating... Generate points based on the current song BPM.",
            cost: new Decimal(1),
            onPurchase() { return player.a.playingMusic = true},
            effect() { return player[this.layer].bpm.div(100)},
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id)) + "/s"
            }
        },
        12: {
            title: "BPM = 2(BPM + 1)",
            description: "Double Gain.",
            cost: new Decimal(3),
        },
        13: {
            title: "BPM = 2(BPM + 1)(a^0.5)",
            description: "Multiply gain by the amount of Beat Points you have.",
            cost: new Decimal(10),
            effect() { return player[this.layer].points.add(1).pow(0.5)},
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id)) + "x"
            }
        },
    },
    update(diff) {
        let trinaGain = new Decimal(0)
        if (hasUpgrade('a', 11)) trinaGain = new Decimal(1)
        if (player.a.trina.gte(2.5) && player.a.trina.lt(3.7)) player.a.bpm = new Decimal(100)
        if (player.a.trina.gte(3.7) && player.a.trina.lt(4.888)) player.a.bpm = new Decimal(101)
        if (player.a.trina.gte(4.888) && player.a.trina.lt(6.064)) player.a.bpm = new Decimal(102)
        if (player.a.trina.gte(6.064) && player.a.trina.lt(7.23)) player.a.bpm = new Decimal(103)
        if (player.a.trina.gte(7.23) && player.a.trina.lt(8.384)) player.a.bpm = new Decimal(104)
        if (player.a.trina.gte(8.384) && player.a.trina.lt(9.526)) player.a.bpm = new Decimal(105)
        if (player.a.trina.gte(9.526) && player.a.trina.lt(10.658)) player.a.bpm = new Decimal(106)
        if (player.a.trina.gte(10.658) && player.a.trina.lt(11.78)) player.a.bpm = new Decimal(107)
        if (player.a.trina.gte(11.78) && player.a.trina.lt(12.892)) player.a.bpm = new Decimal(108)
        if (player.a.trina.gte(12.892) && player.a.trina.lt(13.992)) player.a.bpm = new Decimal(109)
        if (player.a.trina.gte(13.992) && player.a.trina.lt(15.082)) player.a.bpm = new Decimal(110)
        if (player.a.trina.gte(15.082) && player.a.trina.lt(16.164)) player.a.bpm = new Decimal(111)
        if (player.a.trina.gte(16.164) && player.a.trina.lt(17.236)) player.a.bpm = new Decimal(112)
        if (player.a.trina.gte(17.236) && player.a.trina.lt(18.298)) player.a.bpm = new Decimal(113)
        if (player.a.trina.gte(18.298) && player.a.trina.lt(19.35)) player.a.bpm = new Decimal(114)
        if (player.a.trina.gte(19.35) && player.a.trina.lt(20.394)) player.a.bpm = new Decimal(115)
        if (player.a.trina.gte(20.394) && player.a.trina.lt(21.428)) player.a.bpm = new Decimal(116)
        if (player.a.trina.gte(21.428) && player.a.trina.lt(22.454)) player.a.bpm = new Decimal(117)
        if (player.a.trina.gte(22.454) && player.a.trina.lt(23.47)) player.a.bpm = new Decimal(118)
        if (player.a.trina.gte(23.47) && player.a.trina.lt(24.478)) player.a.bpm = new Decimal(119)
        if (player.a.trina.gte(24.478) && player.a.trina.lt(25.478)) player.a.bpm = new Decimal(120)
        if (player.a.trina.gte(25.478) && player.a.trina.lt(26.47)) player.a.bpm = new Decimal(121)
        if (player.a.trina.gte(26.47) && player.a.trina.lt(27.454)) player.a.bpm = new Decimal(122)
        if (player.a.trina.gte(27.454) && player.a.trina.lt(28.43)) player.a.bpm = new Decimal(123)
        if (player.a.trina.gte(28.43) && player.a.trina.lt(29.398)) player.a.bpm = new Decimal(124)
        if (player.a.trina.gte(29.398) && player.a.trina.lt(30.358)) player.a.bpm = new Decimal(125)
        if (player.a.trina.gte(30.358) && player.a.trina.lt(31.31)) player.a.bpm = new Decimal(126)
        if (player.a.trina.gte(31.31) && player.a.trina.lt(32.254)) player.a.bpm = new Decimal(127)
        if (player.a.trina.gte(32.254) && player.a.trina.lt(33.192)) player.a.bpm = new Decimal(128)
        if (player.a.trina.gte(33.192) && player.a.trina.lt(34.122)) player.a.bpm = new Decimal(129)
        if (player.a.trina.gte(34.122) && player.a.trina.lt(35.046)) player.a.bpm = new Decimal(130)
        if (player.a.trina.gte(35.046) && player.a.trina.lt(35.962)) player.a.bpm = new Decimal(131)
        if (player.a.trina.gte(35.962) && player.a.trina.lt(36.872)) player.a.bpm = new Decimal(132)
        if (player.a.trina.gte(36.872) && player.a.trina.lt(37.774)) player.a.bpm = new Decimal(133)
        if (player.a.trina.gte(37.774) && player.a.trina.lt(38.67)) player.a.bpm = new Decimal(134)
        if (player.a.trina.gte(38.67) && player.a.trina.lt(39.558)) player.a.bpm = new Decimal(135)
        if (player.a.trina.gte(39.558) && player.a.trina.lt(40.44)) player.a.bpm = new Decimal(136)
        if (player.a.trina.gte(40.44) && player.a.trina.lt(41.316)) player.a.bpm = new Decimal(137)
        if (player.a.trina.gte(41.316) && player.a.trina.lt(42.186)) player.a.bpm = new Decimal(138)
        if (player.a.trina.gte(42.186) && player.a.trina.lt(43.05)) player.a.bpm = new Decimal(139)
        if (player.a.trina.gte(43.05) && player.a.trina.lt(43.908)) player.a.bpm = new Decimal(140)
        if (player.a.trina.gte(43.908) && player.a.trina.lt(44.76)) player.a.bpm = new Decimal(141)
        if (player.a.trina.gte(44.76) && player.a.trina.lt(45.606)) player.a.bpm = new Decimal(142)
        if (player.a.trina.gte(45.606) && player.a.trina.lt(46.446)) player.a.bpm = new Decimal(143)
        if (player.a.trina.gte(46.446) && player.a.trina.lt(47.28)) player.a.bpm = new Decimal(144)
        if (player.a.trina.gte(47.28) && player.a.trina.lt(48.108)) player.a.bpm = new Decimal(145)
        if (player.a.trina.gte(48.108) && player.a.trina.lt(48.93)) player.a.bpm = new Decimal(146)
        if (player.a.trina.gte(48.93) && player.a.trina.lt(49.746)) player.a.bpm = new Decimal(147)
        if (player.a.trina.gte(49.746) && player.a.trina.lt(50.556)) player.a.bpm = new Decimal(148)
        if (player.a.trina.gte(50.556) && player.a.trina.lt(51.362)) player.a.bpm = new Decimal(149)
        if (player.a.trina.gte(51.362) && player.a.trina.lt(52.162)) player.a.bpm = new Decimal(150)
        if (player.a.trina.gte(52.162) && player.a.trina.lt(52.956)) player.a.bpm = new Decimal(151)
        if (player.a.trina.gte(52.956) && player.a.trina.lt(53.746)) player.a.bpm = new Decimal(152)
        if (player.a.trina.gte(53.746) && player.a.trina.lt(54.53)) player.a.bpm = new Decimal(153)
        if (player.a.trina.gte(54.53) && player.a.trina.lt(55.31)) player.a.bpm = new Decimal(154)
        if (player.a.trina.gte(55.31) && player.a.trina.lt(56.084)) player.a.bpm = new Decimal(155)
        if (player.a.trina.gte(56.084) && player.a.trina.lt(56.854)) player.a.bpm = new Decimal(156)
        if (player.a.trina.gte(56.854) && player.a.trina.lt(57.618)) player.a.bpm = new Decimal(157)
        if (player.a.trina.gte(57.618) && player.a.trina.lt(58.378)) player.a.bpm = new Decimal(158)
        if (player.a.trina.gte(58.378) && player.a.trina.lt(59.132)) player.a.bpm = new Decimal(159)
        if (player.a.trina.gte(59.132) && player.a.trina.lt(59.882)) player.a.bpm = new Decimal(160)
        if (player.a.trina.gte(59.882) && player.a.trina.lt(60.628)) player.a.bpm = new Decimal(161)
        if (player.a.trina.gte(60.628) && player.a.trina.lt(61.368)) player.a.bpm = new Decimal(162)
        if (player.a.trina.gte(61.368) && player.a.trina.lt(62.104)) player.a.bpm = new Decimal(163)
        if (player.a.trina.gte(62.104) && player.a.trina.lt(62.836)) player.a.bpm = new Decimal(164)
        if (player.a.trina.gte(62.836) && player.a.trina.lt(63.564)) player.a.bpm = new Decimal(165)
        if (player.a.trina.gte(63.564) && player.a.trina.lt(64.286)) player.a.bpm = new Decimal(166)
        if (player.a.trina.gte(64.286) && player.a.trina.lt(65.004)) player.a.bpm = new Decimal(167)
        if (player.a.trina.gte(65.004) && player.a.trina.lt(65.718)) player.a.bpm = new Decimal(168)
        if (player.a.trina.gte(65.718) && player.a.trina.lt(66.428)) player.a.bpm = new Decimal(169)
        if (player.a.trina.gte(66.428) && player.a.trina.lt(67.134)) player.a.bpm = new Decimal(170)
        if (player.a.trina.gte(67.134) && player.a.trina.lt(67.836)) player.a.bpm = new Decimal(171)
        if (player.a.trina.gte(67.836) && player.a.trina.lt(68.534)) player.a.bpm = new Decimal(172)
        if (player.a.trina.gte(68.534) && player.a.trina.lt(69.228)) player.a.bpm = new Decimal(173)
        if (player.a.trina.gte(69.228) && player.a.trina.lt(69.918)) player.a.bpm = new Decimal(174)
        if (player.a.trina.gte(69.918) && player.a.trina.lt(70.604)) player.a.bpm = new Decimal(175)
        if (player.a.trina.gte(70.604) && player.a.trina.lt(71.286)) player.a.bpm = new Decimal(176)
        if (player.a.trina.gte(71.286) && player.a.trina.lt(71.964)) player.a.bpm = new Decimal(177)
        if (player.a.trina.gte(71.964) && player.a.trina.lt(72.638)) player.a.bpm = new Decimal(178)
        if (player.a.trina.gte(72.638) && player.a.trina.lt(73.308)) player.a.bpm = new Decimal(179)
        if (player.a.trina.gte(73.308) && player.a.trina.lt(73.974)) player.a.bpm = new Decimal(180)
        if (player.a.trina.gte(73.974) && player.a.trina.lt(74.636)) player.a.bpm = new Decimal(181)
        if (player.a.trina.gte(74.636) && player.a.trina.lt(75.296)) player.a.bpm = new Decimal(182)
        if (player.a.trina.gte(75.296) && player.a.trina.lt(75.952)) player.a.bpm = new Decimal(183)
        if (player.a.trina.gte(75.952) && player.a.trina.lt(76.604)) player.a.bpm = new Decimal(184)
        if (player.a.trina.gte(76.604) && player.a.trina.lt(77.252)) player.a.bpm = new Decimal(185)
        if (player.a.trina.gte(77.252) && player.a.trina.lt(77.898)) player.a.bpm = new Decimal(186)
        if (player.a.trina.gte(77.898) && player.a.trina.lt(78.54)) player.a.bpm = new Decimal(187)
        if (player.a.trina.gte(78.54) && player.a.trina.lt(79.178)) player.a.bpm = new Decimal(188)
        if (player.a.trina.gte(79.178) && player.a.trina.lt(79.812)) player.a.bpm = new Decimal(189)
        if (player.a.trina.gte(79.812) && player.a.trina.lt(80.444)) player.a.bpm = new Decimal(190)
        if (player.a.trina.gte(80.444) && player.a.trina.lt(81.072)) player.a.bpm = new Decimal(191)
        if (player.a.trina.gte(81.072) && player.a.trina.lt(81.698)) player.a.bpm = new Decimal(192)
        if (player.a.trina.gte(81.698) && player.a.trina.lt(82.32)) player.a.bpm = new Decimal(193)
        if (player.a.trina.gte(82.32) && player.a.trina.lt(82.938)) player.a.bpm = new Decimal(194)
        if (player.a.trina.gte(82.938) && player.a.trina.lt(83.554)) player.a.bpm = new Decimal(195)
        if (player.a.trina.gte(83.554) && player.a.trina.lt(84.166)) player.a.bpm = new Decimal(196)
        if (player.a.trina.gte(84.166) && player.a.trina.lt(84.776)) player.a.bpm = new Decimal(197)
        if (player.a.trina.gte(84.776) && player.a.trina.lt(85.382)) player.a.bpm = new Decimal(198)
        if (player.a.trina.gte(85.382) && player.a.trina.lt(85.986)) player.a.bpm = new Decimal(199)
        if (player.a.trina.gte(85.986) && player.a.trina.lt(86.586)) player.a.bpm = new Decimal(200)
        if (player.a.trina.gte(86.586) && player.a.trina.lt(87.184)) player.a.bpm = new Decimal(201)
        if (player.a.trina.gte(87.184) && player.a.trina.lt(87.778)) player.a.bpm = new Decimal(202)
        if (player.a.trina.gte(87.778) && player.a.trina.lt(88.37)) player.a.bpm = new Decimal(203)
        if (player.a.trina.gte(88.37) && player.a.trina.lt(88.958)) player.a.bpm = new Decimal(204)
        if (player.a.trina.gte(88.958) && player.a.trina.lt(89.544)) player.a.bpm = new Decimal(205)
        if (player.a.trina.gte(89.544) && player.a.trina.lt(90.126)) player.a.bpm = new Decimal(206)
        if (player.a.trina.gte(90.126) && player.a.trina.lt(90.706)) player.a.bpm = new Decimal(207)
        if (player.a.trina.gte(90.706) && player.a.trina.lt(91.282)) player.a.bpm = new Decimal(208)
        if (player.a.trina.gte(91.282) && player.a.trina.lt(91.856)) player.a.bpm = new Decimal(209)
        if (player.a.trina.gte(91.856) && player.a.trina.lt(92.428)) player.a.bpm = new Decimal(210)
        if (player.a.trina.gte(92.428) && player.a.trina.lt(92.996)) player.a.bpm = new Decimal(211)
        if (player.a.trina.gte(92.996) && player.a.trina.lt(93.562)) player.a.bpm = new Decimal(212)
        if (player.a.trina.gte(93.562) && player.a.trina.lt(94.126)) player.a.bpm = new Decimal(213)
        if (player.a.trina.gte(94.126) && player.a.trina.lt(94.686)) player.a.bpm = new Decimal(214)
        if (player.a.trina.gte(94.686) && player.a.trina.lt(95.244)) player.a.bpm = new Decimal(215)
        if (player.a.trina.gte(95.244) && player.a.trina.lt(95.8)) player.a.bpm = new Decimal(216)
        if (player.a.trina.gte(95.8) && player.a.trina.lt(96.352)) player.a.bpm = new Decimal(217)
        if (player.a.trina.gte(96.352) && player.a.trina.lt(96.902)) player.a.bpm = new Decimal(218)
        if (player.a.trina.gte(96.902) && player.a.trina.lt(97.45)) player.a.bpm = new Decimal(219)
        if (player.a.trina.gte(97.45) && player.a.trina.lt(97.996)) player.a.bpm = new Decimal(220)
        if (player.a.trina.gte(97.996) && player.a.trina.lt(98.538)) player.a.bpm = new Decimal(221)
        if (player.a.trina.gte(98.538) && player.a.trina.lt(99.078)) player.a.bpm = new Decimal(222)
        if (player.a.trina.gte(99.078) && player.a.trina.lt(99.616)) player.a.bpm = new Decimal(223)
        if (player.a.trina.gte(99.616) && player.a.trina.lt(100.152)) player.a.bpm = new Decimal(224)
        if (player.a.trina.gte(100.152) && player.a.trina.lt(100.686)) player.a.bpm = new Decimal(225)
        if (player.a.trina.gte(100.686) && player.a.trina.lt(101.216)) player.a.bpm = new Decimal(226)
        if (player.a.trina.gte(101.216) && player.a.trina.lt(101.744)) player.a.bpm = new Decimal(227)
        if (player.a.trina.gte(101.744) && player.a.trina.lt(102.27)) player.a.bpm = new Decimal(228)
        if (player.a.trina.gte(102.27) && player.a.trina.lt(102.794)) player.a.bpm = new Decimal(229)
        if (player.a.trina.gte(102.794) && player.a.trina.lt(103.316)) player.a.bpm = new Decimal(230)
        if (player.a.trina.gte(103.316) && player.a.trina.lt(103.836)) player.a.bpm = new Decimal(231)
        if (player.a.trina.gte(103.836) && player.a.trina.lt(104.354)) player.a.bpm = new Decimal(232)
        if (player.a.trina.gte(104.354) && player.a.trina.lt(104.87)) player.a.bpm = new Decimal(233)
        if (player.a.trina.gte(104.87) && player.a.trina.lt(105.382)) player.a.bpm = new Decimal(234)
        if (player.a.trina.gte(105.382) && player.a.trina.lt(105.892)) player.a.bpm = new Decimal(235)
        if (player.a.trina.gte(105.892) && player.a.trina.lt(106.4)) player.a.bpm = new Decimal(236)
        if (player.a.trina.gte(106.4) && player.a.trina.lt(106.906)) player.a.bpm = new Decimal(237)
        if (player.a.trina.gte(106.906) && player.a.trina.lt(107.41)) player.a.bpm = new Decimal(238)
        if (player.a.trina.gte(107.41) && player.a.trina.lt(107.912)) player.a.bpm = new Decimal(239)
        if (player.a.trina.gte(107.912) && player.a.trina.lt(108.412)) player.a.bpm = new Decimal(240)
        if (player.a.trina.gte(108.412) && player.a.trina.lt(108.91)) player.a.bpm = new Decimal(241)
        if (player.a.trina.gte(108.91) && player.a.trina.lt(109.406)) player.a.bpm = new Decimal(242)
        if (player.a.trina.gte(109.406) && player.a.trina.lt(109.9)) player.a.bpm = new Decimal(243)
        if (player.a.trina.gte(109.9) && player.a.trina.lt(110.392)) player.a.bpm = new Decimal(244)
        if (player.a.trina.gte(110.392) && player.a.trina.lt(110.882)) player.a.bpm = new Decimal(245)
        if (player.a.trina.gte(110.882) && player.a.trina.lt(111.37)) player.a.bpm = new Decimal(246)
        if (player.a.trina.gte(111.37) && player.a.trina.lt(111.856)) player.a.bpm = new Decimal(247)
        if (player.a.trina.gte(111.856) && player.a.trina.lt(112.34)) player.a.bpm = new Decimal(248)
        if (player.a.trina.gte(112.34) && player.a.trina.lt(112.822)) player.a.bpm = new Decimal(249)
        if (player.a.trina.gte(112.822) && player.a.trina.lt(113.302)) player.a.bpm = new Decimal(250)
        if (player.a.trina.gte(113.302) && player.a.trina.lt(113.78)) player.a.bpm = new Decimal(251)
        if (player.a.trina.gte(113.78) && player.a.trina.lt(114.256)) player.a.bpm = new Decimal(252)
        if (player.a.trina.gte(114.256) && player.a.trina.lt(114.73)) player.a.bpm = new Decimal(253)
        if (player.a.trina.gte(114.73) && player.a.trina.lt(115.202)) player.a.bpm = new Decimal(254)
        if (player.a.trina.gte(115.202) && player.a.trina.lt(115.672)) player.a.bpm = new Decimal(255)
        if (player.a.trina.gte(115.672) && player.a.trina.lt(116.14)) player.a.bpm = new Decimal(256)
        if (player.a.trina.gte(116.14) && player.a.trina.lt(116.606)) player.a.bpm = new Decimal(257)
        if (player.a.trina.gte(116.606) && player.a.trina.lt(117.072)) player.a.bpm = new Decimal(258)
        if (player.a.trina.gte(117.072) && player.a.trina.lt(117.536)) player.a.bpm = new Decimal(259)
        if (player.a.trina.gte(117.536) && player.a.trina.lt(117.998)) player.a.bpm = new Decimal(260)
        if (player.a.trina.gte(117.998) && player.a.trina.lt(118.458)) player.a.bpm = new Decimal(261)
        if (player.a.trina.gte(118.458) && player.a.trina.lt(118.916)) player.a.bpm = new Decimal(262)
        if (player.a.trina.gte(118.916) && player.a.trina.lt(119.372)) player.a.bpm = new Decimal(263)
        if (player.a.trina.gte(119.372) && player.a.trina.lt(119.826)) player.a.bpm = new Decimal(264)
        if (player.a.trina.gte(119.826) && player.a.trina.lt(120.278)) player.a.bpm = new Decimal(265)
        if (player.a.trina.gte(120.278) && player.a.trina.lt(120.73)) player.a.bpm = new Decimal(266)
        if (player.a.trina.gte(120.73) && player.a.trina.lt(121.18)) player.a.bpm = new Decimal(267)
        if (player.a.trina.gte(121.18) && player.a.trina.lt(121.628)) player.a.bpm = new Decimal(268)
        if (player.a.trina.gte(121.628) && player.a.trina.lt(122.074)) player.a.bpm = new Decimal(269)
        if (player.a.trina.gte(122.074) && player.a.trina.lt(122.518)) player.a.bpm = new Decimal(270)
        if (player.a.trina.gte(122.518) && player.a.trina.lt(122.96)) player.a.bpm = new Decimal(271)
        if (player.a.trina.gte(122.96) && player.a.trina.lt(123.402)) player.a.bpm = new Decimal(272)
        if (player.a.trina.gte(123.402) && player.a.trina.lt(123.842)) player.a.bpm = new Decimal(273)
        if (player.a.trina.gte(123.842) && player.a.trina.lt(124.28)) player.a.bpm = new Decimal(274)
        if (player.a.trina.gte(124.28) && player.a.trina.lt(124.716)) player.a.bpm = new Decimal(275)
        if (player.a.trina.gte(124.716) && player.a.trina.lt(125.15)) player.a.bpm = new Decimal(276)
        if (player.a.trina.gte(125.15) && player.a.trina.lt(125.584)) player.a.bpm = new Decimal(277)
        if (player.a.trina.gte(125.584) && player.a.trina.lt(126.016)) player.a.bpm = new Decimal(278)
        if (player.a.trina.gte(126.016) && player.a.trina.lt(126.446)) player.a.bpm = new Decimal(279)
        if (player.a.trina.gte(126.446) && player.a.trina.lt(126.874)) player.a.bpm = new Decimal(280)
        if (player.a.trina.gte(126.874) && player.a.trina.lt(127.302)) player.a.bpm = new Decimal(281)
        if (player.a.trina.gte(127.302) && player.a.trina.lt(127.728)) player.a.bpm = new Decimal(282)
        if (player.a.trina.gte(127.728) && player.a.trina.lt(128.152)) player.a.bpm = new Decimal(283)
        if (player.a.trina.gte(128.152) && player.a.trina.lt(128.574)) player.a.bpm = new Decimal(284)
        if (player.a.trina.gte(128.574) && player.a.trina.lt(128.996)) player.a.bpm = new Decimal(285)
        if (player.a.trina.gte(128.996) && player.a.trina.lt(129.416)) player.a.bpm = new Decimal(286)
        if (player.a.trina.gte(129.416) && player.a.trina.lt(129.834)) player.a.bpm = new Decimal(287)
        if (player.a.trina.gte(129.834) && player.a.trina.lt(130.25)) player.a.bpm = new Decimal(288)
        if (player.a.trina.gte(130.25) && player.a.trina.lt(130.666)) player.a.bpm = new Decimal(289)
        if (player.a.trina.gte(130.666) && player.a.trina.lt(131.08)) player.a.bpm = new Decimal(290)
        if (player.a.trina.gte(131.08) && player.a.trina.lt(131.492)) player.a.bpm = new Decimal(291)
        if (player.a.trina.gte(131.492) && player.a.trina.lt(131.902)) player.a.bpm = new Decimal(292)
        if (player.a.trina.gte(131.902) && player.a.trina.lt(132.312)) player.a.bpm = new Decimal(293)
        if (player.a.trina.gte(132.312) && player.a.trina.lt(132.72)) player.a.bpm = new Decimal(294)
        if (player.a.trina.gte(132.72) && player.a.trina.lt(133.126)) player.a.bpm = new Decimal(295)
        if (player.a.trina.gte(133.126) && player.a.trina.lt(133.532)) player.a.bpm = new Decimal(296)
        if (player.a.trina.gte(133.532) && player.a.trina.lt(133.936)) player.a.bpm = new Decimal(297)
        if (player.a.trina.gte(133.936) && player.a.trina.lt(134.338)) player.a.bpm = new Decimal(298)
        if (player.a.trina.gte(134.338) && player.a.trina.lt(134.74)) player.a.bpm = new Decimal(299)
        if (player.a.trina.gte(134.74)) player.a.bpm = new Decimal(300)
        player.a.trina = player.a.trina.add(trinaGain.times(diff))
        if (player.a.trina.gte(137.83)) player.a.trina = new Decimal(0)
    },
    hotkeys: [
        {key: "b", description: "B: Increase your Beat Points.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
})