if (!("statsloaded" in window)) {
	var memorySpellsCast = Game.Objects["Wizard tower"].minigame.spellsCast
	var memorySpellTotal = Game.Objects["Wizard tower"].minigame.spellsCastTotal
	var memoryMagic = Game.Objects["Wizard tower"].minigame.magic
	Game.spellForecastLength = 10;
	
	eval("Game.UpdateMenu=" + Game.UpdateMenu.toString()
		.replace(/(customGrandmasButton.*)/, `$1
				Game.WriteSlider('spellForecastSlider','Forecast Length','[$]',function(){return Game.spellForecastLength;},'Game.spellForecastLength=(Math.round(l(\\'spellForecastSlider\\').value));l(\\'spellForecastSliderRightText\\').innerHTML=Game.spellForecastLength;')+'<br>'+`
		)
	);
	
	eval("Game.ObjectsById[7].minigame.launch=" + Game.ObjectsById[7].minigame.launch.toString()
		.replace(/(M\.spellTooltip=function\(id\))/,
		`M.fthofChecker=function(spellCount, idx, backfire)
		{
			var res = '';
			Math.seedrandom(Game.seed+'/'+spellCount)
			roll = Math.random()
			
			if(roll < (1-backfire)){
				/* Random is called a few times in setting up the golden cookie */
				if (idx > 0) Math.random();
				if (idx > 1) Math.random();
				Math.random();
				Math.random();
				
				var choices=[];
				choices.push('Frenzy','Lucky');
				if (!Game.hasBuff('Dragonflight')) choices.push('Click Frenzy');
				if (Math.random()<0.1) choices.push('Cookie Storm','Cookie Storm','Blab');
				if (Game.BuildingsOwned>=10 && Math.random()<0.25) choices.push('Building Special');
				if (Math.random()<0.15) choices=['Cookie Storm Drop'];
				if (Math.random()<0.0001) choices.push('Free Sugar Lump');
				
				var FTHOFcookie = choose(choices);
				res += '<span class="green">' + FTHOFcookie + '</span><br/>'
				
			} else {
				/* Random is called a few times in setting up the golden cookie */
				if (idx > 0) Math.random();
				if (idx > 1) Math.random();
				Math.random();
				Math.random();
				
				var choices=[];
				choices.push('Clot','Ruin');
				if (Math.random()<0.1) choices.push('Cursed Finger','Elder Frenzy');
				if (Math.random()<0.003) choices.push('Free Sugar Lump');
				if (Math.random()<0.1) choices=['Blab'];
				
				var FTHOFcookie = choose(choices);
				res += '<span class="red">' + FTHOFcookie + '</span><br/>'
				
			}
			return '<td>' + res + '</td>';
		}
		
		M.spellForecast=function(spell)
		{
			var spellOutcome = '<div width="100%"><b>Forecast:</b><br/>';
			var backfire=M.getFailChance(spell);
			var spellsCast = Game.Objects["Wizard tower"].minigame.spellsCastTotal;
			var target = spellsCast + Game.spellForecastLength;
			
			switch(spell.name){
				case "Force the Hand of Fate":
					var idx = ((Game.season=="valentines" || Game.season=="easter") ? 1 : 0) + ((Game.chimeType==1 && Game.ascensionMode!=1) ? 1 : 0);
					
					spellOutcome += '<table width="100%"><tr>';
					for(var i = 0; i < 3; i++)
						spellOutcome += '<td width="33%">' + ((i==idx)?'Active':'') + '</td>';
					spellOutcome += '</tr><br/>';
					
					while(spellsCast < target){
						spellOutcome += '<tr>';
						for(var i = 0; i < 3; i++)
							spellOutcome += M.fthofChecker(spellsCast, i, backfire);
						spellOutcome += '</tr>';
						
						spellsCast+=1
						Math.seedrandom()
					}
					spellOutcome += '</table></div>';
					break;
					
				default:
					spellOutcome = "";
			}
			return spellOutcome;
		}
		
		$1`
		).replace(/('<\/div><\/div>.*)/, `'<div style="height:8px;"></div>'+
				M.spellForecast(me)+
				$1`
		)
	);
	Game.ObjectsById[7].minigame.launch();
	Game.Objects["Wizard tower"].minigame.spellsCast = memorySpellsCast;
	Game.Objects["Wizard tower"].minigame.spellsCastTotal = memorySpellTotal;
	Game.Objects["Wizard tower"].minigame.magic = memoryMagic;
};

statsloaded = 1;

document.addEventListener("keypress", function(event) {
  if (event.keyCode == 90) {
    document.getElementById("bigCookie").click();
  }
});