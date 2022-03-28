Game.registerMod("clairvoyance", {
	init:function(){
		if (clairvoyance === undefined) var clairvoyance = {};
		clairvoyance.version = "1.013";
		// snippet from ccse, thanks klattmose: https://klattmose.github.io/CookieClicker/CCSE-POCs/
		window.GetModPath = (modName) => {
			let mod = App.mods[modName];
			let pos = mod.dir.lastIndexOf('\\');
			if(pos == -1) return '../mods/' + (mod.local ? 'local' : 'workshop') + '/' + mod.path;
			else return '../mods/' + mod.dir.substring(pos + 1);
		};
		
		clairvoyance.path = (App ? window.GetModPath('clairvoyance') : 'https://bobatealee.com/hosting/mods/clairvoyance');
		
		function tryInitializeClairvoyanceMod() {
			let minigameHasLoaded = Game.Objects["Wizard tower"].minigameLoaded;
			let modHasInitialized = "statsloaded" in window;

			if (minigameHasLoaded && !modHasInitialized) {
				ClairvoyanceInit();
				Game.removeHook("logic", tryInitializeClairvoyanceMod);
			}
		}
		
		Game.registerHook("logic", tryInitializeClairvoyanceMod);
		// some snippets based on this mod by klattmose: https://www.reddit.com/r/CookieClicker/comments/au2rsx/ingame_fthof_predictor_mod/
		function ClairvoyanceInit() {
			if (!("statsloaded" in window)) {
				let minigame = Game.Objects["Wizard tower"].minigame;
				let originalSpellTooltip = minigame.spellTooltip;
				minigame.spellTooltip = function (id) {
					let originalCallback = originalSpellTooltip(id);
					return function () {
						let originalString = originalCallback();
						let ourTooltip = originalString.substring(0, originalString.length - "</div></div>".length);
						let me = minigame.spellsById[id];
						ourTooltip += "<div></div>" + clairvoyance.spellForecast(me);
						return ourTooltip;
					};
				};
			}

			statsloaded = 1;

			clairvoyance.FateChecker = function (spellCount, column, failChanceDefault, active) {
				var res = "";
				var clairvoyanceChoice = "";
				Math.seedrandom(Game.seed + "/" + spellCount);
				roll = Math.random();

				if (roll < 1 - failChanceDefault) {
					// good effects
					if (column > 0) Math.random();
					if (column > 1) Math.random();
					Math.random();
					Math.random();

					var choices = [];
					choices.push("Frenzy","Lucky");
					if (!Game.hasBuff("Dragonflight")) choices.push("Click Frenzy");
					if (Math.random()<0.1) choices.push("Cookie Storm","Cookie Storm","<span style=\"color:#CCCCCC;\">Blab</span>");
					if (Game.BuildingsOwned>=10 && Math.random()<0.25) choices.push("Building Special");
					if (Math.random()<0.15) choices=["Free Cookies"];
					if (Math.random()<0.0001) choices.push("<span style=\"color:#F9E38B;\">Sweet</span>");

					clairvoyanceChoice = choose(choices);
					res = '<span class="green" style="font-size:11px;"><b>' + clairvoyanceChoice + "</b></span><br/>";
				}
				else {
					// bad effects
					if (column > 0) Math.random();
					if (column > 1) Math.random();
					Math.random();
					Math.random();

					var choices = [];
					choices.push("Clot","Ruin");
					if (Math.random()<0.1) choices.push("<span style=\"color:#FF89E7;\">Cursed Finger</span>","<span style=\"color:#FF89E7;\">Elder Frenzy</span>");
					if (Math.random()<0.003) choices.push("<span style=\"color:#F9E38B;\">Sweet</span>");
					if (Math.random()<0.1) choices=["<span style=\"color:#CCCCCC;\">Blab</span>"];

					clairvoyanceChoice = choose(choices);
					res = '<span class="red" style="font-size:11px;"><b>' + clairvoyanceChoice + "</b></span><br/>";
				}
				return (
					"<td" + (active ? ' style="text-shadow:0px 0px 6px currentColor;"' : "") + ">" + res + "</td>"
				);
			};

			clairvoyance.spellForecast = function (spell) {
				var yourFate = '<div width="100%"><div class="line" style="margin-top:8px; margin-bottom:0;"></div><span style="background-image:url(' + clairvoyance.path + '/icons.png' + '); background-size:24px 24px; width:24px; height:24px; display:inline-block; vertical-align:middle; margin-right:4px; filter: drop-shadow(0px 3px 2px #000)"></span><b style="vertical-align:middle;">Your fate:</b>';
				var spellsSeed = Game.Objects["Wizard tower"].minigame.spellsCastTotal; // player's total spells cast; determines seeded results
				var failChanceDefault = Game.Objects["Wizard tower"].minigame.getFailChance(spell); // default fail chance per spell
				var column = Game.season == "valentines" || Game.season == "easter" ? 1 : 0; // column logic - if season is valentines or easter, use right column; otherwise, use left column
				var resultRange = spellsSeed + 10; // result range - only 10 for now, might make this a slider later

				switch (spell.name) {
					case loc("Force the Hand of Fate"):
						// failChanceDefault = Game.ObjectsById[7].minigame.getFailChance(Game.ObjectsById[7].minigame.spells["hand of fate"]); // grabs fail chance for specifically fthof

						yourFate =
							yourFate + '<table width="100%"><tr>';
							for (var i = 0; i < 2; i++) yourFate += "</tr>";

						while (spellsSeed < resultRange) { // generate/refresh visual spell list
							yourFate += "<tr>";
							for (var i = 0; i < 2; i++)
							yourFate += clairvoyance.FateChecker(spellsSeed, i, failChanceDefault, column == i);
							yourFate += "</tr>";

							spellsSeed += 1;
							Math.seedrandom();
						}

						yourFate += "</table></div>";
					break;

					default:
						yourFate = ""; // prevents additional info from appearing on anything that isn't fthof
				}
				return yourFate;
			};
		}
		Game.Notify("Clairvoyance loaded!", "Version "+clairvoyance.version, [0, 0, clairvoyance.path+"/icons.png"], 2, 1);
	}
});