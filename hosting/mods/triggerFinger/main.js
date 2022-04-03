Game.registerMod("triggerFinger",{
	init:function(){
		if (triggerFinger === undefined) var triggerFinger = {};
		triggerFinger.version = "1.02";
		triggerFingerMode = 0;
		triggerFingerModeDebug = 0;

		Game.registerHook("check", triggerFingerCheck);
		Game.registerHook("logic", triggerFingerLogic);
		Game.registerHook("reincarnate", triggerFingerReincarnate);
		Game.registerHook("reset", triggerFingerReset);

		// ======================================================================================
		// ABOUT
		// ======================================================================================
		// thanks to Lookas and z MANNNNNNN from the Dashnet Discord server for a few things here
		// this is my first big mod and by proxy a huge, bloated mess
		// i documented what i can so hopefully it helps you if you want to make your own mode
		// if you want to make your own challenge mode, feel free to use code here with credit
		// ======================================================================================
		// LOCALIZATION
		// ======================================================================================

		ModLanguage('EN',{
			// ModLanguage doesn't support a lot of things so we're kind of just stuck with this for now
			"Trigger finger [ascension type]": "Trigger finger",
			//"In this run, scrolling your mouse wheel on the cookie counts as clicking it. Some upgrades introduce new clicking behaviors. No clicking achievements may be obtained in this mode.<div class=\"line\"></div>Reaching 1 quadrillion cookies in this mode unlocks a special heavenly upgrade.": "/",
			// "Scroll rate:": "/",
			// "You are in a <b>Trigger finger</b> run, and are not currently benefiting from heralds.": "/",
			// "You are in a Trigger finger run, and can only click by scrolling!": "/",
			// "Toggles the <b>Tigger finger</b> challenge mode, enabling you to use the scroll wheel.": "/",
			"Bake <b>%1</b> in one Trigger finger run.<div class=\"line\"></div>Owning this achievement unlocks a special heavenly upgrade.": "Bake <b>%1</b> in one Trigger finger run.<div class=\"line\"></div>Owning this achievement unlocks a special heavenly upgrade.", // would use "/", but...
			// "Trigger finger debug disabled": "/",
			"Since you\'re in a <b>Trigger finger</b> run, this upgrade also increases scrolling rate by <b>+%1%</b>.": "Since you\'re in a <b>Trigger finger</b> run, this upgrade also increases scrolling rate by <b>+%1%</b>.",
			// "Trigger finger debug enabled": "/",
			// "[Upgrade name "+Game.Upgrades['Wheeled mouse'].id+"]Wheeled mouse": "Wheeled mouse",
			// "[Upgrade name "+Game.Upgrades['Warped cookies'].id+"]Warped cookies": "Warped cookies",
			// "[Upgrade name "+Game.Achievements['Till the wheels fall off'].id+"]Till the wheels fall off": "Till the wheels fall off",
		});

		// ======================================================================================
		// REPLACEMENT
		// ======================================================================================

		// ported over so it works here
		function writeIcon(icon) {
			return (icon[2]?'background-image:url(\''+icon[2].replace(/'/g,"\\'")+'\');':'')+'background-position:'+(-icon[0]*48)+'px '+(-icon[1]*48)+'px;';
		}
		
		function triggerFingerReset(hard) {
			if (hard) {
				triggerFingerMode = 0
				triggerFingerModeDebug = 0
			}
		}

		// add additional ascension mode. this uses a decimal value (which is apparently somehow valid) to not interfere with any other potential future/modded modes
		Game.ascensionModes = Object.assign({1.001:{name:'Trigger finger',dname:loc("Trigger finger [ascension type]"),desc:loc("In this run, scrolling your mouse wheel on the cookie counts as clicking it. Some upgrades introduce new clicking behaviors. No clicking achievements may be obtained in this mode.<div class=\"line\"></div>Reaching 1 quadrillion cookies in this mode unlocks a special heavenly upgrade."),icon:[12,0]}}, Game.ascensionModes)

		// achievement banning
		triggerFingerBannedAchievements = ['Speed baking I', 'Speed baking II', 'Speed baking III', 'Clicktastic', 'Clickathlon', 'Clickolympics', 'Clickorama', 'Clickasmic', 'Clickageddon', 'Clicknarok', 'Clickastrophe', 'Clickataclysm', 'The ultimate clickdown' ,'All the other kids with the pumped up clicks', 'One...more...click...', 'Clickety split'/*, 'Ain\'t that a click in the head'*/]; // list of banned achievements
		
		triggerFingerLogicStr = Game.Logic.toString();
		for(let i of triggerFingerBannedAchievements){
		  let str = "Game.Win('"+i
		  triggerFingerLogicStr = triggerFingerLogicStr.replace(str,'if(!triggerFingerMode)' + str)
		}

		eval('Game.Logic=' + triggerFingerLogicStr);

		// spoof the stats menu, and add a new stat
		function triggerFingerStats(str) {
			document.getElementById("menu").innerHTML = str;
			const children = document.getElementById("menu").children;

			if (Game.resets > 0 && triggerFingerMode == 1) {
				// ascension mode inject
				ascensionModeStr='<span style="cursor:pointer;" '+Game.getTooltip(
				'<div style="min-width:200px;text-align:center;font-size:11px;">'+Game.ascensionModes[1.001].desc+'</div>'
				,'top')+'><div class="icon" style="display:inline-block;float:none;transform:scale(0.5);margin:-24px -16px -19px -8px;'+writeIcon(Game.ascensionModes[1.001].icon)+'"></div>'+Game.ascensionModes[1.001].dname+'</span>';
				children[3].children[1].innerHTML = '<b>'+loc("Challenge mode:")+'</b>'+ascensionModeStr;

				// scroll rate inject
				const element = document.createElement("div.listing");
				element.innerHTML = '<div class="listing"><b>'+loc("Scroll rate:")+'</b> '+Beautify(scrollRate*5)+'%'+'</div>';
				children[3].appendChild(element);
			}
		}

		const triggerFingerHandler = {
			get(target, prop, receiver) {
				let triggerFingerStatsReturn = Reflect.get(...arguments);
				if (triggerFingerStatsReturn instanceof Function) {
					triggerFingerStatsReturn = triggerFingerStatsReturn.bind(target);
				}
				return triggerFingerStatsReturn;
			},

			set(target, prop, value) {
				if (prop === "innerHTML") {
					triggerFingerStats(value)
				} else {
					return Reflect.set(...arguments);
				}
			}
		};

		globalThis["l"] = function (what) {
			const element = document.getElementById(what);
			if (what === "menu" && Game.onMenu == 'stats') return new Proxy(element, triggerFingerHandler);
			else return element;
		};

		// replace the heralds menu in its entirety (this will inevitably go out of date)
		Game.attachTooltip(l('heralds'),function(){
			var str='';

			if (!App && !Game.externalDataLoaded) str+=loc("Heralds couldn't be loaded. There may be an issue with our servers, or you are playing the game locally.");
			else
			{
				if (!App && Game.heralds==0) str+=loc("There are no heralds at the moment. Please consider <b style=\"color:#bc3aff;\">donating to our Patreon</b>!");
				else
				{
					str+='<b style="color:#bc3aff;text-shadow:0px 1px 0px #6d0096;">'+loc("%1 herald",Game.heralds)+'</b> '+loc("selflessly inspiring a boost in production for everyone, resulting in %1.",'<br><b style="color:#cdaa89;text-shadow:0px 1px 0px #7c4532,0px 0px 6px #7c4532;"><div style="width:16px;height:16px;display:inline-block;vertical-align:middle;background:url(img/money.png);"></div>'+loc("+%1% cookies per second",Game.heralds)+'</b>');
					str+='<div class="line"></div>';
					// silly little inject
					if (triggerFingerMode==1) str+=loc("You are in a <b>Trigger finger</b> run, and are not currently benefiting from heralds.");
					else if (Game.ascensionMode==1) str+=loc("You are in a <b>Born again</b> run, and are not currently benefiting from heralds.");
					else if (Game.Has('Heralds')) str+=loc("You own the <b>Heralds</b> upgrade, and therefore benefit from the production boost.");
					else str+=loc("To benefit from the herald bonus, you need a special upgrade you do not yet own. You will permanently unlock it later in the game.");
				}
			}
			str+='<div class="line"></div><span style="font-size:90%;opacity:0.6;">'+(!App?loc("<b>Heralds</b> are people who have donated to our highest Patreon tier, and are limited to 100.<br>Each herald gives everyone +1% CpS.<br>Heralds benefit everyone playing the game, regardless of whether you donated."):loc("Every %1 current players on Steam generates <b>1 herald</b>, up to %2 heralds.<br>Each herald gives everyone +1% CpS.",[100,100]))+'</span>';

			str+='<div style="width:31px;height:39px;background:url(img/heraldFlag.png);position:absolute;top:0px;left:8px;"></div><div style="width:31px;height:39px;background:url(img/heraldFlag.png);position:absolute;top:0px;right:8px;"></div>';

			return '<div style="padding:8px;width:300px;text-align:center;" class="prompt"><h3>'+loc("Heralds")+'</h3><div class="block">'+str+'</div></div>';
		},'this');

		function triggerFingerReincarnate() {
			if (Game.ascensionMode == 1.001) {
				triggerFingerModeDebug = 0
				Game.ascensionMode = 1
				triggerFingerMode = 1
				Game.Reset(); // required to make sure the game fully registers that we're in a (spoofed) Born again run. apparently breaks something related to sounds
			}
			else {
				triggerFingerMode = 0
			}
		}

		// ======================================================================================
		// BIG COOKIE
		// ======================================================================================

		// redefine clicking the cookie in its entirety for this mode (bonus: also prevents uncanny clicker achievement from being earned in this mode)
		triggerFingerScrollClick = function(e,amount)
		{
			Game.BigCookieState = 1
			var now = Date.now();
			if (e) e.preventDefault();
			if (Game.OnAscend || Game.AscendTimer>0 || Game.T<3 || now-Game.lastClick < 1000 / scrollRate) {} // custom clicking threshhold, based on the old pre-steam one
			else
			{
				Game.loseShimmeringVeil('click');
				var amount = amount ? amount : Game.computedMouseCps;
				Game.Earn(amount);
				Game.handmadeCookies += amount;
				if (Game.prefs.particles)
				{
					Game.particleAdd();
					Game.particleAdd(Game.mouseX,Game.mouseY,Math.random()*4-2,Math.random()*-2-2,Math.random()*0.5+0.75,1,2);
				}
				if (Game.prefs.numbers) Game.particleAdd(Game.mouseX+Math.random()*8-4,Game.mouseY-8+Math.random()*8-4,0,-2,1,4,2,'','+'+Beautify(amount,1));

				Game.runModHook('click');

				Game.playCookieClickSound();
				Game.cookieClicks++;

				if (Game.clicksThisSession == 0) PlayCue('preplay');
				Game.clicksThisSession++;
				Game.lastClick = now;
			}
			Game.Click = 0;
			if (document.getElementById("bigCookie").mouseIsOver == true) {
				setTimeout(() => {Game.BigCookieState=2;}, 100) // make cookie bounce back
			};
		}

		triggerFingerLastNotice = Date.now();
		function triggerFingerNotice(event){
			var now = Date.now();
			if (now - triggerFingerLastNotice < 1000 / 2) {}
			else {
				Game.Popup('<div style="font-size:80%;">'+loc("You are in a Trigger finger run, and can only click by scrolling!")+'</div>',Game.mouseX,Game.mouseY);PlaySound('snd/press.mp3');
				triggerFingerLastNotice=now;
			}
		}

		// nuke all of bigCookie's events
		var eventListenerReplace = document.getElementById('bigCookie'), eventListenerClone = eventListenerReplace.cloneNode(true);
		eventListenerReplace.parentNode.replaceChild(eventListenerClone, eventListenerReplace);

		// redefine bigCookie events so they can be removed properly (this is horrible)
		function mousedownBigCookie(event){
			Game.BigCookieState=1; if (Game.prefs.cookiesound) { Game.playCookieClickSound(); } if (event) event.preventDefault();
		}

		function mouseupBigCookie(event){
			Game.BigCookieState=2; if (event) event.preventDefault();
		}

		function mouseoutBigCookie(event){
			Game.BigCookieState=0;
		}

		function mouseoverBigCookie(event){
			Game.BigCookieState=2;
		}

		function touchstartBigCookie(event){
			Game.BigCookieState=1; if (event) event.preventDefault();
		}

		function touchendBigCookie(event){
			Game.BigCookieState=0; if (event) event.preventDefault();
		}

		// append new bigCookie events to the list of other ones
		if (!Game.touchEvents)
		{
			AddEvent(bigCookie,'click',Game.ClickCookie);
			AddEvent(bigCookie,'mousedown',mousedownBigCookie);
			AddEvent(bigCookie,'mouseup',mouseupBigCookie);
			AddEvent(bigCookie,'mouseout',mouseoutBigCookie);
			AddEvent(bigCookie,'mouseover',mouseoverBigCookie);
		}
		else
		{
			//touch events
			AddEvent(bigCookie,'touchend',Game.ClickCookie);
			AddEvent(bigCookie,'touchstart',touchstartBigCookie);
			AddEvent(bigCookie,'touchend',touchendBigCookie);
		}

		// hacky way to get hover state on big cookie
		document.getElementById("bigCookie").mouseIsOver = false;
		document.getElementById("bigCookie").onmouseover = function() {
			this.mouseIsOver = true;
		};

		document.getElementById("bigCookie").onmouseout = function() {
			this.mouseIsOver = false;
		}		

		// ======================================================================================
		// FUNCTIONALITY
		// ======================================================================================

		// new normal upgrades
		new Game.Upgrade('Wheeled mouse',loc("Toggles the <b>Tigger finger</b> challenge mode, enabling you to use the scroll wheel.")+'<q>Muscle memory is no joke! Billions of people suffer from muscle memory each year. It is a tragedy.</q>',7,[12,0]).order=40001;
		Game.last.pool='debug';

		// new heavenly upgrades
		new Game.Upgrade('Warped cookies',loc("Cookie production multiplier <b>+%1% permanently</b>.",10)+'<q>Your meddling with the natural order has caused these cookies to take on an otherworldly appearance that\'s classified as somewhere between "cosmic beauty" and "Lovecraftian horror".</q>',250000,[28,12]);
		Game.last.pool='prestige';Game.last.parents=[Game.Upgrades['Legacy']];Game.last.posX=-20;Game.last.posY=-150;Game.last.showIf=function(){return (Game.HasAchiev('Till the wheels fall off'));};
		Game.PrestigeUpgrades.push(Game.last);

		// new achievements
		new Game.Achievement('Till the wheels fall off',loc("Bake <b>%1</b> in one Trigger finger run.<div class=\"line\"></div>Owning this achievement unlocks a special heavenly upgrade.",loc("%1 cookie",LBeautify(1e15))),[28,12]).order=11011;

		// unlock new upgrades & achievements
		function triggerFingerCheck() {
			if (Game.cookiesEarned >= 1000000000000000 && triggerFingerMode == 1) Game.Win('Till the wheels fall off');
		}

		Game.registerHook('cps',function(cps){return cps*(Game.Has('Warped cookies')?1.10:1);});

		// ======================================================================================
		// LOGIC
		// ======================================================================================

		triggerFingerUpgrades = ['Plastic mouse','Iron mouse','Titanium mouse','Adamantium mouse','Unobtainium mouse','Eludium mouse','Wishalloy mouse','Fantasteel mouse','Nevercrack mouse','Armythril mouse','Technobsidian mouse','Plasmarble mouse','Miraculite mouse'/*,'Aetherice mouse'*/]; // list of existing upgrades to add the extra string to
		triggerFingerInit = 0 // start uninitialized

		function triggerFingerLogic() {
			// make upgrades work
			// scroll rate addition
			scrollRate=20;
			// max is currently 20+(13*5)=85
			if (Game.Has('Plastic mouse')) scrollRate=scrollRate+5;
			if (Game.Has('Iron mouse')) scrollRate=scrollRate+5;
			if (Game.Has('Titanium mouse')) scrollRate=scrollRate+5;
			if (Game.Has('Adamantium mouse')) scrollRate=scrollRate+5;
			if (Game.Has('Unobtainium mouse')) scrollRate=scrollRate+5;
			if (Game.Has('Eludium mouse')) scrollRate=scrollRate+5;
			if (Game.Has('Wishalloy mouse')) scrollRate=scrollRate+5;
			if (Game.Has('Fantasteel mouse')) scrollRate=scrollRate+5;
			if (Game.Has('Nevercrack mouse')) scrollRate=scrollRate+5;
			if (Game.Has('Armythril mouse')) scrollRate=scrollRate+5;
			if (Game.Has('Technobsidian mouse')) scrollRate=scrollRate+5;
			if (Game.Has('Plasmarble mouse')) scrollRate=scrollRate+5;
			if (Game.Has('Miraculite mouse')) scrollRate=scrollRate+5;
			//if (Game.Has('Aetherice mouse')) scrollRate=scrollRate+5;

			// mode debug taketh away
			if (triggerFingerModeDebug == 1 && !Game.Has('Wheeled mouse')) {
				triggerFingerMode = 0;
				triggerFingerModeDebug = 0;
				Game.Notify(loc("Trigger finger debug disabled"),'','',1,1);
			}

			// if in trigger finger run
			if (triggerFingerMode == 1) {
				// if not initialized, start adding everything for trigger finger
				if (triggerFingerInit == 0) {
					// add to existing upgrade descs
					// baseDesc, true to its name, will be used for storing the original desc (without quotes for loc versions)
					// ddesc and baseDesc initially contain the same string, but ddesc is what displays for the user
					// desc contains pre-loc stuff like quotes, which is useful for replacement on loc versions
					for (var i in triggerFingerUpgrades) {
						var replaceUpgradeDesc = Game.Upgrades[triggerFingerUpgrades[i]];
						replaceUpgradeDesc.ddesc = replaceUpgradeDesc.desc.replace('<q>','<div class="line triggerFinger"></div><div><div class="icon" style="vertical-align:middle;display:inline-block;'+writeIcon([12,0])+'transform:scale(0.5);margin:-12px;margin-top:-16px;margin-right:-10px;"></div>'+loc("Since you\'re in a <b>Trigger finger</b> run, this upgrade also increases scrolling rate by <b>+%1%</b>.",25)+'</div><q>');
						if (!EN) replaceUpgradeDesc.ddesc = replaceUpgradeDesc.ddesc.replace(/<q>.*/,''); // if not english, remove quote and everything after it
						replaceUpgradeDesc.ddesc = BeautifyInText(replaceUpgradeDesc.ddesc);
					}

					// change bigCookie events to use trigger finger functionality
					bigCookie.removeEventListener('click',Game.ClickCookie); // remove mouse clicking
					bigCookie.removeEventListener('touchend',Game.ClickCookie); // remove touch clicking
					bigCookie.removeEventListener('mousedown',mousedownBigCookie); // remove mouse down
					bigCookie.removeEventListener('mouseup',mouseupBigCookie); // remove mouse up
					AddEvent(bigCookie,'wheel',triggerFingerScrollClick,mousedownBigCookie); // add scroll clicking
					AddEvent(bigCookie,'click',triggerFingerNotice); // add click notice

					// set initialized
					triggerFingerInit = 1
				}

				if (document.getElementById("bigCookie").mouseIsOver == false) {
					Game.BigCookieState = 0; // hacky code to make sure setTimeout behaves
				}
			}
			// if not in trigger finger run
			else {
				// if initialized, start revering everything back to normal
				if (triggerFingerInit == 1) {
					// remove from existing upgrade descs
					for (var i in triggerFingerUpgrades) {
						var replaceUpgradeDesc = Game.Upgrades[triggerFingerUpgrades[i]];
						replaceUpgradeDesc.ddesc = BeautifyInText(replaceUpgradeDesc.baseDesc);
					}

					// restore bigCookie events
					AddEvent(bigCookie,'click',Game.ClickCookie); // add mouse clicking
					AddEvent(bigCookie,'mousedown',mousedownBigCookie); // add touch clicking
					AddEvent(bigCookie,'mouseup',mouseupBigCookie); // add mouse down
					AddEvent(bigCookie,'touchend',Game.ClickCookie); // add mouse up
					bigCookie.removeEventListener('wheel',triggerFingerScrollClick,mousedownBigCookie); // remove scroll clicking
					bigCookie.removeEventListener('click',triggerFingerNotice); // remove click notice

					// set uninitialized
					triggerFingerInit = 0
				}
				
				// mode debug giveth
				if (triggerFingerModeDebug == 0 && Game.Has('Wheeled mouse')) {
					triggerFingerMode = 1;
					triggerFingerModeDebug = 1;
					Game.Notify(loc("Trigger finger debug enabled"),'','',1,1);
				}
			}
		}

		LocalizeUpgradesAndAchievs(); // make loc strings for upgrades actually work

		Game.Notify("Trigger Finger loaded!", "Version "+triggerFinger.version, [12, 0], 2, 1);
	},

	save:function() {
		return JSON.stringify([
			triggerFingerMode,
			Game.Has('Wheeled mouse'),
			Game.Has('Warped cookies'),
			Game.HasAchiev('Till the wheels fall off')
		])
	},

	load:function(str) {
		const save = JSON.parse(str)
		triggerFingerMode = save[0];
		Game.Upgrades['Warped cookies'].bought = save[1];
		Game.Upgrades['Wheeled mouse'].bought = save[2];
		Game.Achievements['Till the wheels fall off'].won = save[3];
	}
});