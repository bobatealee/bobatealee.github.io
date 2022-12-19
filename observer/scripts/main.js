document.addEventListener('DOMContentLoaded', (event) => {
	Math.seedrandom(Math.floor(Date.now()/86400000));

	jQuery.get('observer.txt', function(fulltext) {
		var seed = Math.random();
		var quotes = fulltext.split(/\r?\n/);
		var quotenum = Math.round(seed*(quotes.length-1));
		var quote = quotes[quotenum];
		
		const date = new Date();
		let day = date.getUTCDate();
		let month = date.getUTCMonth() + 1;
		let monthString = date.toLocaleString('en-US', {month: 'long'});
		let year = date.getUTCFullYear();
		
		document.getElementById("header").innerHTML = "observer's wisdom for "+monthString+" "+day+", "+year+":";

		// easter eggs
		if (Math.round(Math.random()*100) == 100) {
			quote = "<div class=\"quoteImage\"><img src=\"images/trollface.png\"></img></div>"
		}

		// january
		if (month == 1) {
			if (day == 1) {
				quote = "it's a new year. you're all fucked";
			}
		}

		// february
		if (month == 2) {
			if (day == 14) {
				quote = "happy valentines day <3";
			}
			if (day == 29) {
				quote = "LEAP YEAR ADVICE: you suck";
			}
		}

		// april
		if (month == 4) {
			if (day == 10) {
				quote = "happy anniversary boyboy";
			}
		}
		
		// july
		if (month == 7) {
			if (day == 4) {
				quote = "AMERICA";
			}
		}

		// august
		if (month == 8) {
			if (day == 5) {
				quote = "happy birthday boyboy";
			}
		}
		
		// october
		if (month == 10) {
			if (day == 3) {
				quote = "Happy national boyfriend's day, boyboy";
			}
			if (day == 29) {
				quote = "happy national cat day! meow!";
			}
			if (day == 31) {
				quote = "Happy Halloween!";
			}
		}

		// december
		if (month == 12) {
			if (day == 1) {
				quote = "<div class=\"quoteImage\"><img src=\"images/birthday.gif\"></img></div>";
			}
			if (day == 25) {
				quote = "Meowy Christmas!";
			}
			if (day == 31) {
				quote = "happy new year!";
			}
		}

		document.getElementById("quote").innerHTML = "“"+quote+"”";

		// this prevents wrapping of quotes that are images
		$("img").parents('#quote').addClass("quoteImage2");
	});
});