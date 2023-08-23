addLayer("a", {
    startData() { return {                  // startData is a function that returns default data for a layer. 
        unlocked: true,
        points: new Decimal(0),
        trina: new Decimal(0),
        bpm: new Decimal(100),                    // You can add more variables here to add them to your layer.
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
<<<<<<< Updated upstream
            effect() {return player[this.layer].points.pow(0.5).add(1)},
=======
            effect() {return player.a.points.max(1)},
>>>>>>> Stashed changes
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id)) + "x"
            }
        },
    },
    update(diff) {
        let trinaGain = new Decimal(0)
        if (hasUpgrade('a', 11)) trinaGain = new Decimal(1)
        if (player.a.trina.gte(2.55) && player.a.trina.lt(3.75)) player.a.bpm = new Decimal(100)
        if (player.a.trina.gte(3.75) && player.a.trina.lt(4.938)) player.a.bpm = new Decimal(101)
        if (player.a.trina.gte(4.938) && player.a.trina.lt(6.114)) player.a.bpm = new Decimal(102)
        if (player.a.trina.gte(6.114) && player.a.trina.lt(7.28)) player.a.bpm = new Decimal(103)
        if (player.a.trina.gte(7.28) && player.a.trina.lt(8.434)) player.a.bpm = new Decimal(104)
        if (player.a.trina.gte(8.434) && player.a.trina.lt(9.576)) player.a.bpm = new Decimal(105)
        if (player.a.trina.gte(9.576) && player.a.trina.lt(10.708)) player.a.bpm = new Decimal(106)
        if (player.a.trina.gte(10.708) && player.a.trina.lt(11.83)) player.a.bpm = new Decimal(107)
        if (player.a.trina.gte(11.83) && player.a.trina.lt(12.942)) player.a.bpm = new Decimal(108)
        if (player.a.trina.gte(12.942) && player.a.trina.lt(14.042)) player.a.bpm = new Decimal(109)
        if (player.a.trina.gte(14.042) && player.a.trina.lt(15.132)) player.a.bpm = new Decimal(110)
        if (player.a.trina.gte(15.132) && player.a.trina.lt(16.214)) player.a.bpm = new Decimal(111)
        if (player.a.trina.gte(16.214) && player.a.trina.lt(17.286)) player.a.bpm = new Decimal(112)
        if (player.a.trina.gte(17.286) && player.a.trina.lt(18.348)) player.a.bpm = new Decimal(113)
        if (player.a.trina.gte(18.348) && player.a.trina.lt(19.4)) player.a.bpm = new Decimal(114)
        if (player.a.trina.gte(19.4) && player.a.trina.lt(20.444)) player.a.bpm = new Decimal(115)
        if (player.a.trina.gte(20.444) && player.a.trina.lt(21.478)) player.a.bpm = new Decimal(116)
        if (player.a.trina.gte(21.478) && player.a.trina.lt(22.504)) player.a.bpm = new Decimal(117)
        if (player.a.trina.gte(22.504) && player.a.trina.lt(23.52)) player.a.bpm = new Decimal(118)
        if (player.a.trina.gte(23.52) && player.a.trina.lt(24.528)) player.a.bpm = new Decimal(119)
        if (player.a.trina.gte(24.528) && player.a.trina.lt(25.528)) player.a.bpm = new Decimal(120)
        if (player.a.trina.gte(25.528) && player.a.trina.lt(26.52)) player.a.bpm = new Decimal(121)
        if (player.a.trina.gte(26.52) && player.a.trina.lt(27.504)) player.a.bpm = new Decimal(122)
        if (player.a.trina.gte(27.504) && player.a.trina.lt(28.48)) player.a.bpm = new Decimal(123)
        if (player.a.trina.gte(28.48) && player.a.trina.lt(29.448)) player.a.bpm = new Decimal(124)
        if (player.a.trina.gte(29.448) && player.a.trina.lt(30.408)) player.a.bpm = new Decimal(125)
        if (player.a.trina.gte(30.408) && player.a.trina.lt(31.36)) player.a.bpm = new Decimal(126)
        if (player.a.trina.gte(31.36) && player.a.trina.lt(32.304)) player.a.bpm = new Decimal(127)
        if (player.a.trina.gte(32.304) && player.a.trina.lt(33.242)) player.a.bpm = new Decimal(128)
        if (player.a.trina.gte(33.242) && player.a.trina.lt(34.172)) player.a.bpm = new Decimal(129)
        if (player.a.trina.gte(34.172) && player.a.trina.lt(35.096)) player.a.bpm = new Decimal(130)
        if (player.a.trina.gte(35.096) && player.a.trina.lt(36.012)) player.a.bpm = new Decimal(131)
        if (player.a.trina.gte(36.012) && player.a.trina.lt(36.922)) player.a.bpm = new Decimal(132)
        if (player.a.trina.gte(36.922) && player.a.trina.lt(37.824)) player.a.bpm = new Decimal(133)
        if (player.a.trina.gte(37.824) && player.a.trina.lt(38.72)) player.a.bpm = new Decimal(134)
        if (player.a.trina.gte(38.72) && player.a.trina.lt(39.608)) player.a.bpm = new Decimal(135)
        if (player.a.trina.gte(39.608) && player.a.trina.lt(40.49)) player.a.bpm = new Decimal(136)
        if (player.a.trina.gte(40.49) && player.a.trina.lt(41.366)) player.a.bpm = new Decimal(137)
        if (player.a.trina.gte(41.366) && player.a.trina.lt(42.236)) player.a.bpm = new Decimal(138)
        if (player.a.trina.gte(42.236) && player.a.trina.lt(43.1)) player.a.bpm = new Decimal(139)
        if (player.a.trina.gte(43.1) && player.a.trina.lt(43.958)) player.a.bpm = new Decimal(140)
        if (player.a.trina.gte(43.958) && player.a.trina.lt(44.81)) player.a.bpm = new Decimal(141)
        if (player.a.trina.gte(44.81) && player.a.trina.lt(45.656)) player.a.bpm = new Decimal(142)
        if (player.a.trina.gte(45.656) && player.a.trina.lt(46.496)) player.a.bpm = new Decimal(143)
        if (player.a.trina.gte(46.496) && player.a.trina.lt(47.33)) player.a.bpm = new Decimal(144)
        if (player.a.trina.gte(47.33) && player.a.trina.lt(48.158)) player.a.bpm = new Decimal(145)
        if (player.a.trina.gte(48.158) && player.a.trina.lt(48.98)) player.a.bpm = new Decimal(146)
        if (player.a.trina.gte(48.98) && player.a.trina.lt(49.796)) player.a.bpm = new Decimal(147)
        if (player.a.trina.gte(49.796) && player.a.trina.lt(50.606)) player.a.bpm = new Decimal(148)
        if (player.a.trina.gte(50.606) && player.a.trina.lt(51.412)) player.a.bpm = new Decimal(149)
        if (player.a.trina.gte(51.412) && player.a.trina.lt(52.212)) player.a.bpm = new Decimal(150)
        if (player.a.trina.gte(52.212) && player.a.trina.lt(53.006)) player.a.bpm = new Decimal(151)
        if (player.a.trina.gte(53.006) && player.a.trina.lt(53.796)) player.a.bpm = new Decimal(152)
        if (player.a.trina.gte(53.796) && player.a.trina.lt(54.58)) player.a.bpm = new Decimal(153)
        if (player.a.trina.gte(54.58) && player.a.trina.lt(55.36)) player.a.bpm = new Decimal(154)
        if (player.a.trina.gte(55.36) && player.a.trina.lt(56.134)) player.a.bpm = new Decimal(155)
        if (player.a.trina.gte(56.134) && player.a.trina.lt(56.904)) player.a.bpm = new Decimal(156)
        if (player.a.trina.gte(56.904) && player.a.trina.lt(57.668)) player.a.bpm = new Decimal(157)
        if (player.a.trina.gte(57.668) && player.a.trina.lt(58.428)) player.a.bpm = new Decimal(158)
        if (player.a.trina.gte(58.428) && player.a.trina.lt(59.182)) player.a.bpm = new Decimal(159)
        if (player.a.trina.gte(59.182) && player.a.trina.lt(59.932)) player.a.bpm = new Decimal(160)
        if (player.a.trina.gte(59.932) && player.a.trina.lt(60.678)) player.a.bpm = new Decimal(161)
        if (player.a.trina.gte(60.678) && player.a.trina.lt(61.418)) player.a.bpm = new Decimal(162)
        if (player.a.trina.gte(61.418) && player.a.trina.lt(62.154)) player.a.bpm = new Decimal(163)
        if (player.a.trina.gte(62.154) && player.a.trina.lt(62.886)) player.a.bpm = new Decimal(164)
        if (player.a.trina.gte(62.886) && player.a.trina.lt(63.614)) player.a.bpm = new Decimal(165)
        if (player.a.trina.gte(63.614) && player.a.trina.lt(64.366)) player.a.bpm = new Decimal(166)
        if (player.a.trina.gte(64.336) && player.a.trina.lt(65.054)) player.a.bpm = new Decimal(167)
        if (player.a.trina.gte(65.054) && player.a.trina.lt(65.768)) player.a.bpm = new Decimal(168)
        if (player.a.trina.gte(65.768) && player.a.trina.lt(66.478)) player.a.bpm = new Decimal(169)
        if (player.a.trina.gte(66.478) && player.a.trina.lt(67.184)) player.a.bpm = new Decimal(170)
        if (player.a.trina.gte(67.184) && player.a.trina.lt(67.886)) player.a.bpm = new Decimal(171)
        if (player.a.trina.gte(67.886) && player.a.trina.lt(68.584)) player.a.bpm = new Decimal(172)
        if (player.a.trina.gte(68.584) && player.a.trina.lt(69.278)) player.a.bpm = new Decimal(173)
        if (player.a.trina.gte(69.278) && player.a.trina.lt(69.968)) player.a.bpm = new Decimal(174)
        if (player.a.trina.gte(69.968) && player.a.trina.lt(70.654)) player.a.bpm = new Decimal(175)
        if (player.a.trina.gte(70.654) && player.a.trina.lt(71.336)) player.a.bpm = new Decimal(176)
        if (player.a.trina.gte(71.336) && player.a.trina.lt(72.014)) player.a.bpm = new Decimal(177)
        if (player.a.trina.gte(72.014) && player.a.trina.lt(72.688)) player.a.bpm = new Decimal(178)
        if (player.a.trina.gte(72.688) && player.a.trina.lt(73.358)) player.a.bpm = new Decimal(179)
        if (player.a.trina.gte(73.358) && player.a.trina.lt(74.024)) player.a.bpm = new Decimal(180)
        if (player.a.trina.gte(74.024) && player.a.trina.lt(74.686)) player.a.bpm = new Decimal(181)
        if (player.a.trina.gte(74.686) && player.a.trina.lt(75.346)) player.a.bpm = new Decimal(182)
        if (player.a.trina.gte(75.346) && player.a.trina.lt(76.002)) player.a.bpm = new Decimal(183)
        if (player.a.trina.gte(76.002) && player.a.trina.lt(76.654)) player.a.bpm = new Decimal(184)
        if (player.a.trina.gte(76.654) && player.a.trina.lt(77.302)) player.a.bpm = new Decimal(185)
        if (player.a.trina.gte(77.302) && player.a.trina.lt(77.948)) player.a.bpm = new Decimal(186)
        if (player.a.trina.gte(77.948) && player.a.trina.lt(78.59)) player.a.bpm = new Decimal(187)
        if (player.a.trina.gte(78.59) && player.a.trina.lt(79.228)) player.a.bpm = new Decimal(188)
        if (player.a.trina.gte(79.228) && player.a.trina.lt(79.862)) player.a.bpm = new Decimal(189)
        if (player.a.trina.gte(79.862) && player.a.trina.lt(80.494)) player.a.bpm = new Decimal(190)
        if (player.a.trina.gte(80.494) && player.a.trina.lt(81.122)) player.a.bpm = new Decimal(191)
        if (player.a.trina.gte(81.122) && player.a.trina.lt(81.748)) player.a.bpm = new Decimal(192)
        if (player.a.trina.gte(81.748) && player.a.trina.lt(82.37)) player.a.bpm = new Decimal(193)
        if (player.a.trina.gte(82.37) && player.a.trina.lt(82.988)) player.a.bpm = new Decimal(194)
        if (player.a.trina.gte(82.988) && player.a.trina.lt(83.604)) player.a.bpm = new Decimal(195)
        if (player.a.trina.gte(83.604) && player.a.trina.lt(84.216)) player.a.bpm = new Decimal(196)
        if (player.a.trina.gte(84.216) && player.a.trina.lt(84.826)) player.a.bpm = new Decimal(197)
        if (player.a.trina.gte(84.826) && player.a.trina.lt(85.432)) player.a.bpm = new Decimal(198)
        if (player.a.trina.gte(85.432) && player.a.trina.lt(86.036)) player.a.bpm = new Decimal(199)
        if (player.a.trina.gte(86.036) && player.a.trina.lt(86.636)) player.a.bpm = new Decimal(200)
        if (player.a.trina.gte(86.636) && player.a.trina.lt(87.234)) player.a.bpm = new Decimal(201)
        if (player.a.trina.gte(87.234) && player.a.trina.lt(87.828)) player.a.bpm = new Decimal(202)
        if (player.a.trina.gte(87.828) && player.a.trina.lt(88.42)) player.a.bpm = new Decimal(203)
        if (player.a.trina.gte(88.42) && player.a.trina.lt(89.008)) player.a.bpm = new Decimal(204)
        if (player.a.trina.gte(89.008) && player.a.trina.lt(89.594)) player.a.bpm = new Decimal(205)
        if (player.a.trina.gte(89.594) && player.a.trina.lt(90.176)) player.a.bpm = new Decimal(206)
        if (player.a.trina.gte(90.176) && player.a.trina.lt(90.756)) player.a.bpm = new Decimal(207)
        if (player.a.trina.gte(90.756) && player.a.trina.lt(91.332)) player.a.bpm = new Decimal(208)
        if (player.a.trina.gte(91.332) && player.a.trina.lt(91.906)) player.a.bpm = new Decimal(209)
        if (player.a.trina.gte(91.906) && player.a.trina.lt(92.478)) player.a.bpm = new Decimal(210)
        if (player.a.trina.gte(92.478) && player.a.trina.lt(93.046)) player.a.bpm = new Decimal(211)
        if (player.a.trina.gte(93.046) && player.a.trina.lt(93.612)) player.a.bpm = new Decimal(212)
        if (player.a.trina.gte(93.612) && player.a.trina.lt(94.176)) player.a.bpm = new Decimal(213)
        if (player.a.trina.gte(94.176) && player.a.trina.lt(94.736)) player.a.bpm = new Decimal(214)
        if (player.a.trina.gte(94.736) && player.a.trina.lt(95.294)) player.a.bpm = new Decimal(215)
        if (player.a.trina.gte(95.294) && player.a.trina.lt(95.85)) player.a.bpm = new Decimal(216)
        if (player.a.trina.gte(95.85) && player.a.trina.lt(96.402)) player.a.bpm = new Decimal(217)
        if (player.a.trina.gte(96.402) && player.a.trina.lt(96.952)) player.a.bpm = new Decimal(218)
        if (player.a.trina.gte(96.952) && player.a.trina.lt(97.5)) player.a.bpm = new Decimal(219)
        if (player.a.trina.gte(97.5) && player.a.trina.lt(98.046)) player.a.bpm = new Decimal(220)
        if (player.a.trina.gte(98.046) && player.a.trina.lt(98.588)) player.a.bpm = new Decimal(221)
        if (player.a.trina.gte(98.588) && player.a.trina.lt(99.128)) player.a.bpm = new Decimal(222)
        if (player.a.trina.gte(99.128) && player.a.trina.lt(99.666)) player.a.bpm = new Decimal(223)
        if (player.a.trina.gte(99.666) && player.a.trina.lt(100.202)) player.a.bpm = new Decimal(224)
        if (player.a.trina.gte(100.202) && player.a.trina.lt(100.736)) player.a.bpm = new Decimal(225)
        if (player.a.trina.gte(100.736) && player.a.trina.lt(101.266)) player.a.bpm = new Decimal(226)
        if (player.a.trina.gte(101.266) && player.a.trina.lt(101.794)) player.a.bpm = new Decimal(227)
        if (player.a.trina.gte(101.794) && player.a.trina.lt(102.32)) player.a.bpm = new Decimal(228)
        if (player.a.trina.gte(102.32) && player.a.trina.lt(102.844)) player.a.bpm = new Decimal(229)
        if (player.a.trina.gte(102.844) && player.a.trina.lt(103.366)) player.a.bpm = new Decimal(230)
        if (player.a.trina.gte(103.366) && player.a.trina.lt(103.886)) player.a.bpm = new Decimal(231)
        if (player.a.trina.gte(103.886) && player.a.trina.lt(104.404)) player.a.bpm = new Decimal(232)
        if (player.a.trina.gte(104.404) && player.a.trina.lt(104.92)) player.a.bpm = new Decimal(233)
        if (player.a.trina.gte(104.92) && player.a.trina.lt(105.432)) player.a.bpm = new Decimal(234)
        if (player.a.trina.gte(105.432) && player.a.trina.lt(105.942)) player.a.bpm = new Decimal(235)
        if (player.a.trina.gte(105.942) && player.a.trina.lt(106.45)) player.a.bpm = new Decimal(236)
        if (player.a.trina.gte(106.45) && player.a.trina.lt(106.956)) player.a.bpm = new Decimal(237)
        if (player.a.trina.gte(106.956) && player.a.trina.lt(107.46)) player.a.bpm = new Decimal(238)
        if (player.a.trina.gte(107.46) && player.a.trina.lt(107.962)) player.a.bpm = new Decimal(239)
        if (player.a.trina.gte(107.962) && player.a.trina.lt(108.462)) player.a.bpm = new Decimal(240)
        if (player.a.trina.gte(108.462) && player.a.trina.lt(108.96)) player.a.bpm = new Decimal(241)
        if (player.a.trina.gte(108.96) && player.a.trina.lt(109.456)) player.a.bpm = new Decimal(242)
        if (player.a.trina.gte(109.456) && player.a.trina.lt(109.95)) player.a.bpm = new Decimal(243)
        if (player.a.trina.gte(109.95) && player.a.trina.lt(110.442)) player.a.bpm = new Decimal(244)
        if (player.a.trina.gte(110.442) && player.a.trina.lt(110.932)) player.a.bpm = new Decimal(245)
        if (player.a.trina.gte(110.932) && player.a.trina.lt(111.42)) player.a.bpm = new Decimal(246)
        if (player.a.trina.gte(111.42) && player.a.trina.lt(111.906)) player.a.bpm = new Decimal(247)
        if (player.a.trina.gte(111.906) && player.a.trina.lt(112.39)) player.a.bpm = new Decimal(248)
        if (player.a.trina.gte(112.39) && player.a.trina.lt(112.872)) player.a.bpm = new Decimal(249)
        if (player.a.trina.gte(112.872) && player.a.trina.lt(113.352)) player.a.bpm = new Decimal(250)
        if (player.a.trina.gte(113.352) && player.a.trina.lt(113.83)) player.a.bpm = new Decimal(251)
        if (player.a.trina.gte(113.83) && player.a.trina.lt(114.306)) player.a.bpm = new Decimal(252)
        if (player.a.trina.gte(114.306) && player.a.trina.lt(114.78)) player.a.bpm = new Decimal(253)
        if (player.a.trina.gte(114.78) && player.a.trina.lt(115.252)) player.a.bpm = new Decimal(254)
        if (player.a.trina.gte(115.252) && player.a.trina.lt(115.722)) player.a.bpm = new Decimal(255)
        if (player.a.trina.gte(115.722) && player.a.trina.lt(116.19)) player.a.bpm = new Decimal(256)
        if (player.a.trina.gte(116.19) && player.a.trina.lt(116.656)) player.a.bpm = new Decimal(257)
        if (player.a.trina.gte(116.656) && player.a.trina.lt(117.122)) player.a.bpm = new Decimal(258)
        if (player.a.trina.gte(117.122) && player.a.trina.lt(117.586)) player.a.bpm = new Decimal(259)
        if (player.a.trina.gte(117.586) && player.a.trina.lt(118.048)) player.a.bpm = new Decimal(260)
        if (player.a.trina.gte(118.048) && player.a.trina.lt(118.508)) player.a.bpm = new Decimal(261)
        if (player.a.trina.gte(118.508) && player.a.trina.lt(118.966)) player.a.bpm = new Decimal(262)
        if (player.a.trina.gte(118.966) && player.a.trina.lt(119.422)) player.a.bpm = new Decimal(263)
        if (player.a.trina.gte(119.422) && player.a.trina.lt(119.876)) player.a.bpm = new Decimal(264)
        if (player.a.trina.gte(119.876) && player.a.trina.lt(120.328)) player.a.bpm = new Decimal(265)
        if (player.a.trina.gte(120.328) && player.a.trina.lt(120.78)) player.a.bpm = new Decimal(266)
        if (player.a.trina.gte(120.78) && player.a.trina.lt(121.23)) player.a.bpm = new Decimal(267)
        if (player.a.trina.gte(121.23) && player.a.trina.lt(121.678)) player.a.bpm = new Decimal(268)
        if (player.a.trina.gte(121.678) && player.a.trina.lt(122.124)) player.a.bpm = new Decimal(269)
        if (player.a.trina.gte(122.124) && player.a.trina.lt(122.568)) player.a.bpm = new Decimal(270)
        if (player.a.trina.gte(122.568) && player.a.trina.lt(123.01)) player.a.bpm = new Decimal(271)
        if (player.a.trina.gte(123.01) && player.a.trina.lt(123.452)) player.a.bpm = new Decimal(272)
        if (player.a.trina.gte(123.452) && player.a.trina.lt(123.892)) player.a.bpm = new Decimal(273)
        if (player.a.trina.gte(123.892) && player.a.trina.lt(124.33)) player.a.bpm = new Decimal(274)
        if (player.a.trina.gte(124.33) && player.a.trina.lt(124.766)) player.a.bpm = new Decimal(275)
        if (player.a.trina.gte(124.766) && player.a.trina.lt(125.2)) player.a.bpm = new Decimal(276)
        if (player.a.trina.gte(125.2) && player.a.trina.lt(125.634)) player.a.bpm = new Decimal(277)
        if (player.a.trina.gte(125.634) && player.a.trina.lt(126.066)) player.a.bpm = new Decimal(278)
        if (player.a.trina.gte(126.066) && player.a.trina.lt(126.496)) player.a.bpm = new Decimal(279)
        if (player.a.trina.gte(126.496) && player.a.trina.lt(126.924)) player.a.bpm = new Decimal(280)
        if (player.a.trina.gte(126.924) && player.a.trina.lt(127.352)) player.a.bpm = new Decimal(281)
        if (player.a.trina.gte(127.352) && player.a.trina.lt(127.778)) player.a.bpm = new Decimal(282)
        if (player.a.trina.gte(127.778) && player.a.trina.lt(128.202)) player.a.bpm = new Decimal(283)
        if (player.a.trina.gte(128.202) && player.a.trina.lt(128.624)) player.a.bpm = new Decimal(284)
        if (player.a.trina.gte(128.624) && player.a.trina.lt(129.046)) player.a.bpm = new Decimal(285)
        if (player.a.trina.gte(129.046) && player.a.trina.lt(129.466)) player.a.bpm = new Decimal(286)
        if (player.a.trina.gte(129.466) && player.a.trina.lt(129.884)) player.a.bpm = new Decimal(287)
        if (player.a.trina.gte(129.884) && player.a.trina.lt(130.3)) player.a.bpm = new Decimal(288)
        if (player.a.trina.gte(130.3) && player.a.trina.lt(130.716)) player.a.bpm = new Decimal(289)
        if (player.a.trina.gte(130.716) && player.a.trina.lt(131.13)) player.a.bpm = new Decimal(290)
        if (player.a.trina.gte(131.13) && player.a.trina.lt(131.542)) player.a.bpm = new Decimal(291)
        if (player.a.trina.gte(131.542) && player.a.trina.lt(131.952)) player.a.bpm = new Decimal(292)
        if (player.a.trina.gte(131.952) && player.a.trina.lt(132.362)) player.a.bpm = new Decimal(293)
        if (player.a.trina.gte(132.362) && player.a.trina.lt(132.77)) player.a.bpm = new Decimal(294)
        if (player.a.trina.gte(132.77) && player.a.trina.lt(133.176)) player.a.bpm = new Decimal(295)
        if (player.a.trina.gte(133.176) && player.a.trina.lt(133.582)) player.a.bpm = new Decimal(296)
        if (player.a.trina.gte(133.582) && player.a.trina.lt(133.986)) player.a.bpm = new Decimal(297)
        if (player.a.trina.gte(133.986) && player.a.trina.lt(134.388)) player.a.bpm = new Decimal(298)
        if (player.a.trina.gte(134.388) && player.a.trina.lt(134.79)) player.a.bpm = new Decimal(299)
        if (player.a.trina.gte(134.79)) player.a.bpm = new Decimal(300)
        player.a.trina = player.a.trina.add(trinaGain.times(diff))
        if (player.a.trina.gte(137.83)) player.a.trina = new Decimal(0)
    },
    hotkeys: [
        {key: "b", description: "B: Increase your Beat Points.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
})