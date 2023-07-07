var systemComponents = {
	'tab-buttons': {
		props: ['layer', 'data', 'name'],
		template: `
			<div class="tabRow">
				<div v-for="tab in Object.keys(data)" v-bind:class="{ selected: player.subtabs[layer][name] == tab }">
					<button v-if="data[tab].unlocked == undefined || data[tab].unlocked" v-bind:class="{tabButton: true, notify: subtabShouldNotify(layer, name, tab), resetNotify: subtabResetNotify(layer, name, tab)}"
					v-bind:style="[{'border-color': tmp[layer].color}, (subtabShouldNotify(layer, name, tab) ? {'box-shadow': 'var(--hqProperty2a), 0 0 20px '  + (data[tab].glowColor || defaultGlow)} : {}), tmp[layer].componentStyles['tab-button'], data[tab].buttonStyle]"
						v-on:click="function(){player.subtabs[layer][name] = tab; updateTabFormats(); needCanvasUpdate = true;}">{{data[tab].title ?? tab}}</button>
				</div>
			</div>
		`
	},

	'tree-node': {
		props: ['layer', 'abb', 'size', 'prev'],
		template: `
		<button v-if="nodeShown(layer)"
			v-bind:id="layer"
			v-on:click="function() {
				if (shiftDown && options.forceTooltips) player[layer].forceTooltip = !player[layer].forceTooltip
				else if(tmp[layer].isLayer) {
					if (tmp[layer].leftTab) {
						showNavTab(layer, prev)
						showTab('none')
					}
					else
						showTab(layer, prev)
				}
				else {run(layers[layer].onClick, layers[layer])}
			}"


			v-bind:class="{
				treeNode: tmp[layer].isLayer,
				treeButton: !tmp[layer].isLayer,
				smallNode: size == 'small',
				[layer]: true,
				tooltipBox: true,
				forceTooltip: player[layer].forceTooltip,
				ghost: tmp[layer].layerShown == 'ghost',
				hidden: !tmp[layer].layerShown,
				locked: tmp[layer].isLayer ? !(player[layer].unlocked || tmp[layer].canReset) : !(tmp[layer].canClick),
				notify: tmp[layer].notify && player[layer].unlocked,
				resetNotify: tmp[layer].prestigeNotify,
				can: ((player[layer].unlocked || tmp[layer].canReset) && tmp[layer].isLayer) || (!tmp[layer].isLayer && tmp[layer].canClick),
				front: !tmp.scrolled,
			}"
			v-bind:style="constructNodeStyle(layer)">
			<span class="nodeLabel" v-html="(abb !== '' && tmp[layer].image === undefined) ? abb : '&nbsp;'"></span>
			<tooltip
      v-if="tmp[layer].tooltip != ''"
			:text="(tmp[layer].isLayer) ? (
				player[layer].unlocked ? (tmp[layer].tooltip ? tmp[layer].tooltip : formatWhole(player[layer].points) + ' ' + tmp[layer].resource)
				: (tmp[layer].tooltipLocked ? tmp[layer].tooltipLocked : 'Reach ' + formatWhole(tmp[layer].requires) + ' ' + tmp[layer].baseResource + ' to unlock (You have ' + formatWhole(tmp[layer].baseAmount) + ' ' + tmp[layer].baseResource + ')')
			)
			: (
				tmp[layer].canClick ? (tmp[layer].tooltip ? tmp[layer].tooltip : 'I am a button!')
				: (tmp[layer].tooltipLocked ? tmp[layer].tooltipLocked : 'I am a button!')
			)"></tooltip>
			<node-mark :layer='layer' :data='tmp[layer].marked'></node-mark></span>
		</button>
		`
	},

	
	'layer-tab': {
		props: ['layer', 'back', 'spacing', 'embedded'],
		template: `<div v-bind:style="[tmp[layer].style ? tmp[layer].style : {}, (tmp[layer].tabFormat && !Array.isArray(tmp[layer].tabFormat)) ? tmp[layer].tabFormat[player.subtabs[layer].mainTabs].style : {}]" class="noBackground">
		<div v-if="back"><button v-bind:class="back == 'big' ? 'other-back' : 'back'" v-on:click="goBack(layer)">←</button></div>
		<div v-if="!tmp[layer].tabFormat">
			<div v-if="spacing" v-bind:style="{'height': spacing}" :key="this.$vnode.key + '-spacing'"></div>
			<infobox v-if="tmp[layer].infoboxes" :layer="layer" :data="Object.keys(tmp[layer].infoboxes)[0]":key="this.$vnode.key + '-info'"></infobox>
			<main-display v-bind:style="tmp[layer].componentStyles['main-display']" :layer="layer"></main-display>
			<div v-if="tmp[layer].type !== 'none'">
				<prestige-button v-bind:style="tmp[layer].componentStyles['prestige-button']" :layer="layer"></prestige-button>
			</div>
			<resource-display v-bind:style="tmp[layer].componentStyles['resource-display']" :layer="layer"></resource-display>
			<milestones v-bind:style="tmp[layer].componentStyles.milestones" :layer="layer"></milestones>
			<div v-if="Array.isArray(tmp[layer].midsection)">
				<column :layer="layer" :data="tmp[layer].midsection" :key="this.$vnode.key + '-mid'"></column>
			</div>
			<clickables v-bind:style="tmp[layer].componentStyles['clickables']" :layer="layer"></clickables>
			<buyables v-bind:style="tmp[layer].componentStyles.buyables" :layer="layer"></buyables>
			<upgrades v-bind:style="tmp[layer].componentStyles['upgrades']" :layer="layer"></upgrades>
			<challenges v-bind:style="tmp[layer].componentStyles['challenges']" :layer="layer"></challenges>
			<achievements v-bind:style="tmp[layer].componentStyles.achievements" :layer="layer"></achievements>
			<br><br>
		</div>
		<div v-if="tmp[layer].tabFormat">
			<div v-if="Array.isArray(tmp[layer].tabFormat)"><div v-if="spacing" v-bind:style="{'height': spacing}"></div>
				<column :layer="layer" :data="tmp[layer].tabFormat" :key="this.$vnode.key + '-col'"></column>
			</div>
			<div v-else>
				<div class="upgTable" v-bind:style="{'padding-top': (embedded ? '0' : '25px'), 'margin-top': (embedded ? '-10px' : '0'), 'margin-bottom': '24px'}">
					<tab-buttons v-bind:style="tmp[layer].componentStyles['tab-buttons']" :layer="layer" :data="tmp[layer].tabFormat" :name="'mainTabs'"></tab-buttons>
				</div>
				<layer-tab v-if="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].embedLayer" :layer="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].embedLayer" :embedded="true" :key="this.$vnode.key + '-' + layer"></layer-tab>
				<column v-else :layer="layer" :data="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].content" :key="this.$vnode.key + '-col'"></column>
			</div>
		</div></div>
			`
	},

	'overlay-head': {
		template: `			
		<div class="overlayThing" style="padding-bottom:7px; width: 90%; z-index: 1000; position: relative">
		<span v-if="player.devSpeed && player.devSpeed != 1" class="overlayThing">
			<br>Dev Speed: {{format(player.devSpeed)}}x<br>
		</span>
		<span v-if="player.offTime !== undefined"  class="overlayThing">
			<br>Offline Time: {{formatTime(player.offTime.remain)}}<br>
		</span>
		<br>
		<span v-if="player.points.lt('1e1000')" class="overlayThing">You have </span>
		<h2 class="overlayThing" id="points">{{formatWhole(player.points)}}</h2>
		<span v-if="player.points.lt('1e1e6')" class="overlayThing"> {{modInfo.pointsName}}</span>
		<br>
		<span v-if="canGenPoints()"  class="overlayThing">({{tmp.other.oompsMag != 0 ? format(tmp.other.oomps) + " OOM" + (tmp.other.oompsMag < 0 ? "^OOM" : tmp.other.oompsMag > 1 ? "^" + tmp.other.oompsMag : "") + "s" : formatSmall(getPointGen())}}/sec)</span>
		<div v-for="thing in tmp.displayThings" class="overlayThing"><span v-if="thing" v-html="thing"></span></div>
	</div>
	`
    },

    'info-tab': {
        template: `
        <div>
        <h2>{{modInfo.name}}</h2>
        <br>
        <h3>{{VERSION.withName}}</h3>
        <br>
        <br>
		made by 
		<a href="https://github.com/TheCamelliaTree" target="_blank" class="link inline">ArcanaEden</a> and 
		<a href="https://ducdat0507.github.io/" target="_blank" class="link inline">duducat</a>
        <br>
		additional CSS help from
		<a href="https://flustix.foxes4life.net/" target="_blank" class="link inline">Flustix</a>
        <hr style="width: 200px; margin: 4px auto 2px auto; border: none; height: 2px; background: var(--color)">
        using The Modding Tree 
		<a href="https://github.com/Acamaeda/The-Modding-Tree/blob/master/changelog.md" target="_blank" class="link inline">{{TMT_VERSION.tmtNum}}</a> by 
		<a href="https://github.com/Acamaeda/" target="_blank" class="link inline">Acamaeda</a>
        <br>
        based on The Prestige Tree made by 
		<a href="https://jacorb90.me/" target="_blank" class="link inline">Jacorb</a> and
		<a href="https://aarextiaokhiao.github.io/" target="_blank" class="link inline">Aarex</a><br>
		<br>
		You are now playing the new, rewritten Camellia Tree made mostly by ducdat0507.<br>
		If you wish to expereience the old tree please visit
		<a href="https://raw.githack.com/TheCamelliaTree/The-Camellia-Tree-Rewritten/arcana-eden/" target="_blank" class="link inline">this link</a>.<br>
		<br>
		<div style="opacity: .5; font-size: small">
			This game is made just for fun, no income is generated.<br>
			If you do not wish to be referenced in the game please let us know in the Discord links down below.<br>
			And also if you're really Camellia, hi 👋 please don't attack us
		</div>
		<br>
		<br>
		<div class="link" onclick="showTab('changelog-tab')">Changelog</div><br>
        <span v-if="modInfo.discordLink"><a class="link" v-bind:href="modInfo.discordLink" target="_blank">{{modInfo.discordName}}</a><br></span>
        <a class="link" href="https://discord.gg/F3xveHV" target="_blank" v-bind:style="modInfo.discordLink ? {'font-size': '16px'} : {}">The Modding Tree Discord</a><br>
        <a class="link" href="http://discord.gg/wwQfgPa" target="_blank" v-bind:style="{'font-size': '16px'}">Main Prestige Tree server</a><br>
		<br><br>
        Time Played: {{ formatTime(player.timePlayed) }}<br><br>
        <h3>Hotkeys</h3><br>
        <span v-for="key in hotkeys" v-if="player[key.layer].unlocked && tmp[key.layer].hotkeys[key.id].unlocked"><br>{{key.description}}</span></div>
    `
    },

    'options-tab': {
        template: `
        <div class="options-tab">
            <button class="opt" onclick="save()">
				<div class="key-desc">
					<h3 class="key">Save</h3>
					<div class="desc">Save your game</div>
				</div>
				<div class="value"></div>
			</button>
            <button class="opt" onclick="toggleOpt('autosave')">
				<div class="key-desc">
					<h3 class="key">Autosave</h3>
					<div class="desc">Automatically save your game</div>
				</div>
				<div class="value">{{ options.autosave?"ON":"OFF" }}</div>
			</button>
            <button class="opt" onclick="hardResetModal()">
				<div class="key-desc">
					<h3 class="key">Hard Reset</h3>
					<div class="desc">Wipe everything</div>
				</div>
				<div class="value"></div>
			</button>
            <button class="opt" onclick="exportSave()">
				<div class="key-desc">
					<h3 class="key">Export to Clipboard</h3>
					<div class="desc">Copy your save to your clipboard</div>
				</div>
				<div class="value"></div>
			</button>
            <button class="opt" onclick="importSave()">
				<div class="key-desc">
					<h3 class="key">Import</h3>
					<div class="desc">Import a save from a save string</div>
				</div>
				<div class="value"></div>
			</button>
            <button class="opt" onclick="toggleOpt('offlineProd')">
				<div class="key-desc">
					<h3 class="key">Offline Production</h3>
					<div class="desc">Keep producing while the game is closed</div>
				</div>
				<div class="value">{{ options.offlineProd?"ON":"OFF" }}</div>
			</button>
            <button class="opt" onclick="switchNotation()">
				<div class="key-desc">
					<h3 class="key">Notation</h3>
					<div class="desc">Change how numbers are formatted</div>
				</div>
				<div class="value">{{ getNotationName() }}</div>
			</button>
            <button class="opt" onclick="switchTheme()">
				<div class="key-desc">
					<h3 class="key">Theme</h3>
					<div class="desc">Switch between different background themes</div>
				</div>
				<div class="value">{{ getThemeName() }}</div>
			</button>
            <button class="opt" onclick="toggleOpt('hqTree')">
				<div class="key-desc">
					<h3 class="key">High Quality Tree</h3>
					<div class="desc">Add shadows and shades to tree nodes</div>
				</div>
				<div class="value">{{ options.hqTree?"ON":"OFF" }}</div>
			</button>
            <button v-if="hasAchievement('journal', 's1x1')" class="opt" onclick="toggleOptHyper('visualizer', event)">
				<div class="key-desc">
					<h3 class="key">Dancing Background</h3>
					<div class="desc">Make the background react to the currently playing music</div>
				</div>
				<div class="value">{{ options.visualizer?options.visualizer=="hyper"?"HYPER MODE":"ON":"OFF" }}</div>
			</button>
            <button class="opt" onclick="adjustMSDisp()">
				<div class="key-desc">
					<h3 class="key">Show Milestones</h3>
					<div class="desc">Show or hide milestones based on criterias</div>
				</div>
				<div class="value">{{ MS_DISPLAYS[MS_SETTINGS.indexOf(options.msDisplay)]}}</div>
			</button>
            <button class="opt" onclick="toggleOpt('hideChallenges')">
				<div class="key-desc">
					<h3 class="key">Completed Challenges</h3>
					<div class="desc">Show or hide completed challenges</div>
				</div>
				<div class="value">{{ options.hideChallenges?"HIDDEN":"SHOWN" }}</div>
			</button>
            <button class="opt" onclick="toggleOpt('forceOneTab'); needsCanvasUpdate = true">
				<div class="key-desc">
					<h3 class="key">Single-Tab Mode</h3>
					<div class="desc">Force the game to only show one tab at a time</div>
				</div>
				<div class="value">{{ options.forceOneTab?"ALWAYS":"AUTO" }}</div>
			</button>
			<button class="opt" onclick="toggleOpt('forceTooltips'); needsCanvasUpdate = true">
				<div class="key-desc">
					<h3 class="key">Shift-Click to Pin Tooltips</h3>
					<div class="desc">Enable pinning tooltips by shift-clicking</div>
				</div>
				<div class="value">{{ options.forceTooltips?"ON":"OFF" }}</div>
			</button>
        </div>`
    },

    'back-button': {
        template: `
        <button v-bind:class="back" onclick="goBack()">←</button>
        `
    },


	'tooltip' : {
		props: ['text'],
		template: `<div class="tooltip" v-html="text"></div>
		`
	},

	'node-mark': {
		props: {'layer': {}, data: {}, offset: {default: 0}, scale: {default: 1}},
		template: `<div v-if='data'>
			<div v-if='data === true' class='star' v-bind:style='{position: "absolute", left: (offset-10) + "px", top: (offset-10) + "px", transform: "scale( " + scale||1 + ", " + scale||1 + ")"}'></div>
			<img v-else class='mark' v-bind:style='{position: "absolute", left: (offset-22) + "px", top: (offset-15) + "px", transform: "scale( " + scale||1 + ", " + scale||1 + ")"}' v-bind:src="data"></div>
		</div>
		`
	},

	'particle': {
		props: ['data', 'index'],
		template: `<div><div class='particle instant' v-bind:style="[constructParticleStyle(data), data.style]" 
			v-on:click="run(data.onClick, data)"  v-on:mouseenter="run(data.onMouseOver, data)" v-on:mouseleave="run(data.onMouseLeave, data)" ><span v-html="data.text"></span>
		</div>
		<svg version="2" v-if="data.color">
		<mask v-bind:id="'pmask' + data.id">
        <image id="img" v-bind:href="data.image" x="0" y="0" :height="data.width" :width="data.height" />
    	</mask>
    	</svg>
		</div>
		`
	},

	'bg': {
		props: ['layer'],
		template: `<div class ="bg" v-bind:style="[tmp[layer].style ? tmp[layer].style : {}, (tmp[layer].tabFormat && !Array.isArray(tmp[layer].tabFormat)) ? tmp[layer].tabFormat[player.subtabs[layer].mainTabs].style : {}]"></div>
		`
	}

}

