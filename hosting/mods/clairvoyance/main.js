Game.registerMod("clairvoyance", {
	init: function() {
		function tryInitializeClairvoyanceMod() {
			let minigameHasLoaded = Game.Objects["Wizard tower"].minigameLoaded;
			let modHasInitialized = "statsloaded" in window;

			if (minigameHasLoaded && !modHasInitialized) {
				clairvoyanceInit();
				Game.removeHook("logic", tryInitializeClairvoyanceMod);
			}
		}

		Game.registerHook("logic", tryInitializeClairvoyanceMod);
	}
});

// some snippets based on this mod by u/klattmose: https://www.reddit.com/r/CookieClicker/comments/au2rsx/ingame_fthof_predictor_mod/
function clairvoyanceInit() {
	if (Clairvoyance === undefined) var Clairvoyance = {};
	if (!("statsloaded" in window)) {
		let minigame = Game.Objects["Wizard tower"].minigame;
		let originalSpellTooltip = minigame.spellTooltip;
		minigame.spellTooltip = function (id) {
			let originalCallback = originalSpellTooltip(id);
			return function () {
				let originalString = originalCallback();
				let ourTooltip = originalString.substring(0, originalString.length - "</div></div>".length);
				let me = minigame.spellsById[id];
				ourTooltip += "<div></div>" + Clairvoyance.spellForecast(me);
				return ourTooltip;
			};
		};
	}

	statsloaded = 1;

	Clairvoyance.FateChecker = function (spellCount, column, failChanceDefault, active) {
		var res = "";
		var shimmerFate = "";
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
			if (Math.random()<0.1) choices.push("Cookie Storm","Cookie Storm","Blab");
			if (Game.BuildingsOwned>=10 && Math.random()<0.25) choices.push("Building Special");
			if (Math.random()<0.15) choices=["Cookie Storm Drop"];
			if (Math.random()<0.0001) choices.push("<span style=\"color:#FAEDB9;\">Sweet</span>"); // sweet is pretty important so it gets a special color

			shimmerFate = choose(choices);
			res = '<span class="green" style="font-size:11px;"><b>' + shimmerFate + "</b></span><br/>";
		}
		else {
			// bad effects
			if (column > 0) Math.random();
			if (column > 1) Math.random();
			Math.random();
			Math.random();

			var choices = [];
			choices.push("Clot","Ruin");
			if (Math.random()<0.1) choices.push("Cursed Finger","Elder Frenzy");
			if (Math.random()<0.003) choices.push("<span style=\"color:#FAEDB9;\">Sweet</span>"); // sweet is pretty important so it gets a special color
			if (Math.random()<0.1) choices=["Blab"];

			shimmerFate = choose(choices);
			res = '<span class="red" style="font-size:11px;"><b>' + shimmerFate + "</b></span><br/>";
		}
		return (
			"<td" + (active ? ' style="text-shadow:0px 0px 6px currentColor;"' : "") + ">" + res + "</td>"
		);
	};

	Clairvoyance.spellForecast = function (spell) {
		var yourFate = '<div width="100%"><div class="line" style="margin-top:8px; margin-bottom:0;"></div><span style="background-image:url(/icons.png); background-size:24px 24px; width:24px; height:24px; display:inline-block; vertical-align:middle; margin-right:4px; filter: drop-shadow(0px 3px 2px #000)"></span><b style="vertical-align:middle;">Your fate:</b>';
		var spellsCastSeed = Game.Objects["Wizard tower"].minigame.spellsCastTotal; // player's total spells cast; determines seeded results
		var failChanceDefault = Game.Objects["Wizard tower"].minigame.getFailChance(spell); // default fail chance
		var column = Game.season == "valentines" || Game.season == "easter" ? 1 : 0; // column logic - if season is valentines or easter, use right column; otherwise, use left column
		var resultRange = spellsCastSeed + 10; // result range - only 10 for now, might make this a slider later

		switch (spell.name) {
			case loc("Force the Hand of Fate"):
				// failChanceDefault = Game.ObjectsById[7].minigame.getFailChance(Game.ObjectsById[7].minigame.spells["hand of fate"]); // grabs fail chance for specifically fthof

				yourFate =
					yourFate + '<table width="100%"><tr>';
					for (var i = 0; i < 2; i++) yourFate += "</tr>";

				while (spellsCastSeed < resultRange) { // generate/refresh visual spell list
					yourFate += "<tr>";
					for (var i = 0; i < 2; i++)
					yourFate += Clairvoyance.FateChecker(spellsCastSeed, i, failChanceDefault, column == i);
					yourFate += "</tr>";

					spellsCastSeed += 1;
					Math.seedrandom();
				}

				yourFate += "</table></div>";
			break;

			default:
				yourFate = ""; // prevents "your fate" from appearing on anything not fthof
		}
		return yourFate;
	};
}