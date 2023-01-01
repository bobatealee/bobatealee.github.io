const date = new Date();
var day = date.getUTCDate();
var month = date.getUTCMonth() + 1;
var monthString = date.toLocaleString('en-US', {timeZone: 'UTC', month: 'long'});
var year = date.getUTCFullYear();
var tomorrow = Date.UTC(year, month - 1, day + 1, 0, 0, 0);

document.addEventListener('DOMContentLoaded', (event) => {
	Math.seedrandom(Math.floor(Date.now()/86400000));

	jQuery.get('observer.txt', function(fulltext) {
		var seed = Math.random();
		var quotes = fulltext.split(/\r?\n/);
		var quotenum = Math.round(seed*(quotes.length-1));
		var quote = quotes[quotenum];
		
		document.getElementById("header").innerHTML = "observer's wisdom for "+monthString+" "+day+", "+year+":";

		// easter eggs
		if (Math.round(Math.random()*100) == 100) {
			quote = "<div class=\"quoteImage\"><img src=\"images/trollface.png\"></img></div>"
		}

		// january
		if (month == 1) {
			if (day == 1) {
				quote = "<div class=\"quoteImage\"><img src=\"images/birthday.gif\"></img></div>";
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
		
		countdown();
	});

	function countdown() {
		var now = new Date().getTime();
		var distance = tomorrow - now;

		var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);

		document.getElementById("footerTime").innerHTML = hours + "h " + minutes + "m " + seconds + "s";

		if (distance < 0) {
			clearInterval(countdownTimer);
			document.getElementById("footerText").innerHTML = "<a class=\"reload\" onclick=\"location.reload();\">new wisdom available now!</a>";
			document.getElementById("footerTime").innerHTML = "";
			document.getElementById("header").innerHTML = "observer's very outdated wisdom for "+monthString+" "+day+", "+year+":";
		}
	}

	var countdownTimer = setInterval(function() {
		countdown();
	}, 1000);
});